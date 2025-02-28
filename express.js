/* eslint-env node */

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const uuid = require("uuid");
const { exec } = require("child_process");
const app = express();
const sourceDir = "dist";
const { get: getConfig } = require("./config");
const path = require("path");
const proxy = require("express-http-proxy");
const https = require("https");
const simpleGit = require("simple-git");
const JSZip = require("jszip");
const { spawn } = require("child_process");

let config;
try {
  config = getConfig();
} catch (e) {
  process.exitCode = 1;
  throw e;
}

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Helper function to get all folders in a directory
function getAllDirectories(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter((file) =>
      fs.statSync(path.join(dirPath, file)).isDirectory()
    );
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

// Helper function to get all files in a directory
function getAllFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter((file) =>
      fs.statSync(path.join(dirPath, file)).isFile()
    );
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

function getUserInterfaceMode(userName) {
  const userConfigPath = `/home/kipr/Documents/KISS/${userName}/.config.json`;
  try {
    // Check if the file exists
    if (!fs.existsSync(userConfigPath)) {
      console.error(
        `getUserInterfaceMode: Config file not found for user ${userName}`
      );
      return null;
    }

    // Read and parse the JSON file
    const configData = JSON.parse(fs.readFileSync(userConfigPath, "utf-8"));

    // Return the interfaceMode if it exists
    return configData.interfaceMode || null;
  } catch (error) {
    console.error("Error reading user config:", error);
    return null;
  }
}

function setUserInterfaceMode(userName, newMode){
  const userConfigPath = `/home/kipr/Documents/KISS/${userName}/.config.json`;
  try {
    // Check if the file exists
    if (!fs.existsSync(userConfigPath)) {
      console.error(
        `setUserInterfaceMode: Config file not found for user ${userName}`
      );
      return false;
    }

    // Read and parse the JSON file
    const configData = JSON.parse(fs.readFileSync(userConfigPath, "utf-8"));

    //Update interfaceMode
    configData.interfaceMode = newMode;

    // Write the updated config back to the file
    fs.writeFileSync(userConfigPath, JSON.stringify(configData, null, 2), "utf-8");

    console.log(`Successfully updated interfaceMode to ${newMode} for user ${userName}`);
    return true;
  } catch (error) {
    console.error("Error updating user config:", error);
    return false;
  }
}

// Helper function to handle folder-based APIs
function createFolderHandler() {
  return async (req, res) => {
    const folderPath = req.query.filePath;
    console.log(
      "createFolderHandler - Received request for folder path:",
      folderPath
    );

    // Validate folderPath
    if (!folderPath) {
      return res
        .status(400)
        .json({ error: "Missing filePath query parameter" });
    }

    // Check if the path exists and is a directory
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res
        .status(400)
        .json({ error: "Invalid or non-existent directory path" });
    }

    // Get all directories inside the specified folder
    const directories = getAllDirectories(folderPath);

    // Send the list of directories as the response
    res.status(200).json({
      folderPath: folderPath,
      directories,
    });
  };
}

async function getFolderContents() {
  return async (req, res) => {
    const folderPath = req.query.filePath;
    console.log(
      "getFolderContents - Received request for folder path:",
      folderPath
    );

    // Validate folderPath
    if (!folderPath) {
      return res
        .status(400)
        .json({ error: "Missing filePath query parameter" });
    }

    // Check if the path exists and is a directory
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res
        .status(400)
        .json({ error: "Invalid or non-existent directory path" });
    }

    // Get all directories inside the specified folder
    const files = getAllFiles(folderPath);

    // Send the list of files as the response
    res.status(200).json({
      folderPath: folderPath,
      files,
    });
  };
}
async function getAllUserFiles(directory, zipFolder) {
  const files = await fs.promises.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      // Create a folder in the zip and recurse
      const subFolder = zipFolder.folder(file.name);
      await getAllUserFiles(filePath, subFolder);
    } else {
      // Add file content to the zip
      const fileContent = await fs.promises.readFile(filePath);
      zipFolder.file(file.name, fileContent);
    }
  }
}
async function interalGetFileContents(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error("Invalid or non-existent file path");
  }
  return fs.promises.readFile(filePath, "utf-8"); // ✅ Now using async/await properly
}

function getFileContents() {
  return async (req, res) => {
    const filePath = req.query.filePath;
    console.log("Received request for file path:", filePath);

    // Validate filePath
    if (!filePath) {
      return res
        .status(400)
        .json({ error: "Missing filePath query parameter" });
    }

    // Check if the path exists and is a file
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res
        .status(400)
        .json({ error: "Invalid or non-existent file path" });
    }

    // Read the file contents
    const fileContents = fs.readFileSync(filePath, "utf-8");

    // Send the file contents as the response
    res.status(200).send(fileContents);
  };
}

function saveFileContents() {
  return async (req, res) => {
    const { filePath, fileContents } = req.body;
    console.log(
      "Received request to save file:",
      filePath,
      "with fileContents: ",
      fileContents
    );

    // Validate filePath
    if (!filePath) {
      return res
        .status(400)
        .json({ error: "Missing filePath in request body" });
    }

    // Validate fileContents
    if (!fileContents) {
      return res
        .status(400)
        .json({ error: "Missing fileContents in request body" });
    }

    // Write the file contents to the specified path
    fs.writeFileSync(filePath, fileContents);

    // Send a success response
    res.status(200).send("File saved successfully");
  };
}

function parseGitConfig(configContent) {
  let language = null;
  let currentSection = null;

  const lines = configContent.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines or comments
    if (trimmedLine === "" || trimmedLine.startsWith("#")) {
      continue;
    }

    // Detect section headers, e.g., [repo]
    const sectionMatch = trimmedLine.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    // Parse key-value pairs within a section
    if (currentSection === "repo" && trimmedLine.includes("=")) {
      const [key, value] = trimmedLine.split("=").map((part) => part.trim());
      if (key === "language") {
        language = value;
        break; // Stop once 'language' is found in [repo]
      }
    }
  }

  console.log("Language: ", language);
  return language;
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(morgan("combined"));

app.use("/api", proxy(config.dbUrl));

// If we have libkipr (C) artifacts and emsdk, we can compile.
if (
  config.server.dependencies.libkipr_c &&
  config.server.dependencies.emsdk_env
) {
  console.log("Compiling C programs is enabled.");

  app.post("/compile", (req, res) => {
    if (!("code" in req.body)) {
      return res.status(400).json({
        error: "Expected code key in body",
      });
    }

    if (typeof req.body.code !== "string") {
      return res.status(400).json({
        error: "Expected code key in body to be a string",
      });
    }

    // Wrap user's main() in our own "main()" that exits properly
    // Required because Asyncify keeps emscripten runtime alive, which would prevent cleanup code from running
    const augmentedCode = `${req.body.code}
      #include <emscripten.h>
  
      EM_JS(void, on_stop, (), {
        if (Module.context.onStop) Module.context.onStop();
      })
    
      void simMainWrapper()
      {
        main();
        on_stop();
        emscripten_force_exit(0);
      }
    `;
    console.log("inside compile");

    const id = uuid.v4();
    const path = `/tmp/${id}.c`;
    console.log(`Writing to ${path}`);
    fs.writeFile(path, augmentedCode, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Failed to write ${}",
        });
      }

      // ...process.env causes a linter error for some reason.
      // We work around this by doing it manually.

      const env = {};
      for (const key of Object.keys(process.env)) {
        env[key] = process.env[key];
      }

      env[
        "PATH"
      ] = `${config.server.dependencies.emsdk_env.PATH}:${process.env.PATH}`;
      env["EMSDK"] = config.server.dependencies.emsdk_env.EMSDK;
      env["EM_CONFIG"] = config.server.dependencies.emsdk_env.EM_CONFIG;
      exec(
        `emcc -s WASM=0 -s INVOKE_RUN=0 -s ASYNCIFY -s EXIT_RUNTIME=1 -s "EXPORTED_FUNCTIONS=['_main', '_simMainWrapper']" -I${config.server.dependencies.libkipr_c}/include -L${config.server.dependencies.libkipr_c}/lib -lkipr -o ${path}.js ${path}`,
        { env },
        (err, stdout, stderr) => {
          // Always log both stdout and stderr, regardless of errors
          console.log("emcc stdout:", stdout);
          console.log("emcc stderr:", stderr);

          if (err) {
            console.error("Compilation error:", stderr);
            return res.status(200).json({
              stdout,
              stderr,
            });
          }

          fs.readFile(`${path}.js`, (err, data) => {
            if (err) {
              return res.status(400).json({
                error: `Failed to open ${path}.js for reading`,
              });
            }

            // Log the stdout when the compilation is successful
            console.log("Compilation result (after file read):", stdout);

            fs.unlink(`${path}.js`, (err) => {
              if (err) {
                return res.status(500).json({
                  error: `Failed to delete ${path}.js`,
                });
              }
              fs.unlink(`${path}`, (err) => {
                if (err) {
                  return res.status(500).json({
                    error: `Failed to delete ${path}`,
                  });
                }

                // Return the result, stdout, and stderr as the final response
                res.status(200).json({
                  result: data.toString(),
                  stdout,
                  stderr,
                });
              });
            });
          });
        }
      );
    });
  });
}

app.post("/compile-code", async (req, res) => {
  console.log("Received request body:", req.body); // Log the entire request body

  const { userName, projectName, fileName, activeLanguage } = req.body;

  console.log("Extracted username from body:", userName);
  console.log("Extracted projectName from body:", projectName);
  console.log("Extracted fileName from body:", fileName);
  console.log("Extracted activeLanguage from body:", activeLanguage);
  // Proceed with your logic here

  const env = {
    ...process.env,

    PROJECT_USERNAME: userName,
    PROJECT_NAME: projectName,
    FILE_NAME: fileName,
    ACTIVE_LANGUAGE: activeLanguage,
  };
  console.log("Project username: ", userName);
  console.log("Project name: ", projectName);
  console.log("Current working directory:", process.cwd());

  const filePath = `/home/kipr/Documents/KISS/${userName}/${projectName}/src/${fileName}`;

  console.log("Code to compile: ", await interalGetFileContents(filePath));

  exec("node compiler.js", { env }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during execution: ${error.message}`);
      return res.status(500).json({ error: "Execution failed" });
    } else if (stderr) {
      console.error(`Compilation warnings/errors: ${stderr}`);
      res.json({
        message: "failed",
        output: stderr,
      });
    } else {
      console.log(`stdout: ${stdout}`);
      res.json({
        message: "successful",
        output: stdout,
      });
    }
  });
  //res.json({ message: "Received data", userName, projectName, fileName });
});

// API route to initialize a Git repository
app.post("/initialize-repo", async (req, res) => {
  const { userName, projectName, language, interfaceMode } = req.body;
  console.log("Received request body:", req.body); // Log the entire request body
  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const userConfigPath = path.join(userDirectory, ".config.json");
  const projectDirectory = path.join(userDirectory, projectName);

  const userConfig = {
    userName: userName,
    interfaceMode: interfaceMode,
  };
  // Ensure the user's directory exists
  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory, { recursive: true });

    try {
      console.log("Writing user config to:", userConfigPath);
      fs.writeFileSync(
        userConfigPath,
        JSON.stringify(userConfig, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error writing user config:", error);
      return res.status(500).json({ error: "Error writing user config." });
    }
  }

  // Ensure the project directory does not already exist
  if (fs.existsSync(projectDirectory)) {
    return res.status(400).json({ error: "Project directory already exists." });
  } else {
    console.log(`Creating project directory: ${projectDirectory}`);
    fs.mkdirSync(projectDirectory, { recursive: true });
  }
  // Validate input
  if (!userName || !projectName || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Define the full path for the new repository
  const repoPath = path.join(userDirectory, projectName);
  const git = simpleGit();
  try {
    // Initialize the Git repository
    console.log("Current directory before init:", process.cwd());
    await git.cwd(repoPath).init();
    console.log(`Git repository initialized at ${repoPath}`);

    // Set custom attributes in .git/config
    await git.addConfig("repo.language", language);
    await git.addConfig("repo.owner", userName);

    console.log(`Set repo.language=${language} and repo.owner=${userName}`);

    // Create default folders and files
    const folders = ["bin", "include", "src", "data"];
    folders.forEach((folder) => {
      const folderPath = path.join(projectDirectory, folder);
      fs.mkdirSync(folderPath, { recursive: true });
      // Add a placeholder file to ensure Git tracks empty directories
      fs.writeFileSync(
        path.join(folderPath, `.gitkeep`),
        "This file ensures Git tracks this directory."
      );
    });

    //Ensure the main.[language] file isn't already created
    switch (language) {
      case "c":
        if (!fs.existsSync(path.join(projectDirectory, "src", `main.c`))) {
          fs.writeFileSync(
            path.join(projectDirectory, "src", `main.c`),
            `#include <stdio.h>\n#include <kipr/wombat.h>\n\nint main()\n{\n  printf("Hello, World!\\n");\n  return 0;\n}\n`
          );
        }
        break;
      case "cpp":
        if (!fs.existsSync(path.join(projectDirectory, "src", `main.cpp`))) {
          fs.writeFileSync(
            path.join(projectDirectory, "src", `main.cpp`),
            `#include <iostream>\n#include <kipr/wombat.hpp>\n\nint main()\n{\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}\n`
          );
        }

        break;
      case "python":
        if (!fs.existsSync(path.join(projectDirectory, "src", `main.py`))) {
          fs.writeFileSync(
            path.join(projectDirectory, "src", `main.py`),
            `#!/usr/bin/python3\nimport os, sys\nsys.path.append("/usr/lib")\nfrom kipr import *\n\nprint(\'Hello, World!\')`
          );
        }
        break;
    }

    // Optionally, create a README.md or other initial files
    const readmePath = path.join(projectDirectory, "README.md");
    fs.writeFileSync(
      readmePath,
      `# ${projectName}\n\nProject initialized for ${userName} using ${language}.`
    );

    // Stage and commit the initial files
    await git.add(".");
    await git.commit("Initial commit: Add default folder structure and README");

    console.log("Initial files and folder structure committed.");

    // Send success response
    res.status(200).send("Git repository initialized successfully");
  } catch (error) {
    console.error("Error initializing repository:", error);
    res.status(500).send("Error initializing repository");
  }
});

app.post("/delete-file", async (req, res) => {
  const { userName, projectName, fileName, fileType } = req.body;
  console.log("/Delete-file: ", req.body);
  if (!userName || !projectName || !fileName || !fileType) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let userProjectDirectory = "";
  switch (fileType) {
    case "h":
      userProjectDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/include`;
      break;
    case "c":
    case "cpp":
    case "py":
      userProjectDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/src`;
      break;
    case "txt":
      userProjectDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/data`;
      break;
    default:
      return res.status(400).json({ error: "Invalid file type." });
  }

  const filePath = path.join(userProjectDirectory, fileName);
  console.log("File path: ", filePath);
  try {
    // Check if the file exists
    await fs.promises.access(filePath);
    console.log("File exists and is accessible.");

    //Delete file
    await fs.promises.rm(filePath);
    console.log(`Deleted file path: ${filePath}`);

    return res.status(200).send("File deleted successfully.");
  } catch (error) {
    if (error.code === "ENOENT") {
      // File not found
      return res.status(404).json({ error: "File does not exist." });
    }

    // Internal server error
    return res
      .status(500)
      .json({ error: `Error deleting file: ${error.message}` });
  }
});

app.post("/delete-project", async (req, res) => {
  const { userName, projectName } = req.body;
  console.log("/Delete-project: ", req.body);
  if (!userName || !projectName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const projectDirectory = path.join(userDirectory, projectName);

  try {
    // Check if the project directory exists
    if (!fs.existsSync(projectDirectory)) {
      return res
        .status(404)
        .json({ error: "Project directory does not exist." });
    }

    // Recursively delete the entire project directory
    fs.rmSync(projectDirectory, { recursive: true, force: true });

    console.log(`Deleted project directory: ${projectDirectory}`);

    res.status(200).send("Repository deleted successfully.");
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send("Error deleting repository.");
  }
});

app.post("/delete-user", async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;

  try {
    // Check if the project directory exists
    if (!fs.existsSync(userDirectory)) {
      return res
        .status(404)
        .json({ error: "userDirectory directory does not exist." });
    }

    // Recursively delete the entire userDirectory directory
    fs.rmSync(userDirectory, { recursive: true, force: true });

    console.log(`Deleted userDirectory directory: ${userDirectory}`);

    res.status(200).send("Repository deleted successfully.");
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send("Error deleting repository.");
  }
});

app.post("/download-zip", async (req, res) => {
  const { userName, projectName, fileName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "UserName is required" });
  }

  console.log("download-zip Received request body:", req.body); // Log the entire request body
  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  // Check if the directory exists
  if (!fs.existsSync(userDirectory)) {
    return res.status(404).json({ error: "User directory not found" });
  }

  try {
    if (fileName) {
      console.log("Single file download");
      const [name, extension] = fileName.split(".");
      console.log("File extension is: ", extension);
      //Single file download
      if (!projectName) {
        return res.status(400).json({ error: "ProjectName is required" });
      }
      let filePath = "";
      switch (extension) {
        case "h":
          filePath = path.join(userDirectory, projectName, "include", fileName);
          break;
        case "c":
        case "cpp":
        case "py":
          filePath = path.join(userDirectory, projectName, "src", fileName);
          break;
        case "txt":
          filePath = path.join(userDirectory, projectName, "data", fileName);
          break;
      }

      console.log("single file download file path: ", filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const fileContents = fs.readFileSync(filePath, "utf-8");

      const extname = path.extname(fileName).toLowerCase();
      let contentType = "text/plain"; // Default to plain text
      if (extname === ".json") {
        contentType = "application/json"; // If it's a JSON file
      } else if (extname === ".html") {
        contentType = "text/html"; // If it's an HTML file
      }

      console.log("File contents: ", fileContents);
      // Set the correct headers for downloading the file as text
      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // Send the file content as a plain text response
      res.status(200).send(fileContents);

      return;
    } else if (projectName) {
      console.log("Single project download");
      const projectDirectory = path.join(userDirectory, projectName);
      // Check if the project directory exists
      if (!fs.existsSync(projectDirectory)) {
        return res.status(404).json({ error: "Project directory not found" });
      }
      const zip = new JSZip();
      const projectFolder = zip.folder(projectName);
      await getAllUserFiles(projectDirectory, projectFolder);

      const zipContent = await zip.generateAsync({ type: "nodebuffer" });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${projectName}.zip`
      );
      res.send(zipContent);
      return;
    }
    // Handle all projects as a ZIP
    const zip = new JSZip();
    const rootFolder = zip.folder(userName);
    await getAllUserFiles(userDirectory, rootFolder);

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${userName}.zip`
    );
    res.send(zipContent);
  } catch (error) {
    console.error("Error while creating ZIP:", error);
    res.status(500).json({ error: "Failed to create ZIP file" });
  }
});
app.get("/get-all-file-names", async (req, res) => {
  try {
    const dirPath = req.query.dirPath;

    if (!dirPath) {
      return res.status(400).json({ error: "Directory path is required" });
    }

    // Directories to check
    const allowedDirs = ["src", "include", "data"];

    // Function to recursively get all file names in allowed directories only
    const getAllFileNames = (dir) => {
      let fileNames = [];

      // Read the contents of the directory
      const files = fs.readdirSync(dir);

      // Loop through the contents
      files.forEach((file) => {
        // Skip hidden files or directories (those starting with a dot)
        if (file.startsWith(".")) {
          return;
        }

        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        // If it's a directory, check if it's in the allowedDirs list
        if (stats.isDirectory()) {
          if (allowedDirs.includes(file)) {
            fileNames = fileNames.concat(getAllFileNames(filePath)); // Recursion only if the directory is allowed
          }
        } else {
          // If it's a file, add it to the fileNames array
          fileNames.push(filePath);
        }
      });

      return fileNames;
    };

    const allFileNames = getAllFileNames(dirPath);

    // Send the list of file names as the response
    res.status(200).json({
      fileNames: allFileNames,
    });
  } catch (error) {
    console.error("Error getting file names:", error);
    res.status(500).send("Error getting file names");
  }
});

app.get("/get-project-language", async (req, res) => {
  try {
    console.log("/get-project-language filePath: ", req.query.filePath);

    const gitConfigPath = path.join(req.query.filePath, ".git/config");

    //check if .git/config exists
    if (!fs.existsSync(gitConfigPath)) {
      return res.status(400).json({ error: ".git/config not found" });
    }

    const language = parseGitConfig(fs.readFileSync(gitConfigPath, "utf8"));

    //send the language as the response
    res.status(200).json({
      language,
    });
  } catch (error) {
    console.error("Error getting project language:", error);
    res.status(500).send("Error getting project language");
  }
});

// User getters
app.get("/load-user-data", async (req, res) => {
  try {
    console.log("/load-user-data filePath: ", req.query.filePath);
    const userDirectories = fs.readdirSync("/home/kipr/Documents/KISS");

    const users = userDirectories.map((user) => {
      // Get the interface mode for the user
      const userInterfaceMode = getUserInterfaceMode(user);

      const userDirectory = `/home/kipr/Documents/KISS/${user}`;
      const projects = getAllDirectories(userDirectory).filter(
        (file) => !file.startsWith(".")
      );

      if (userInterfaceMode === null) {
        console.log(`User interface mode not found for ${user}`);
      }

      return {
        userName: user,
        interfaceMode: userInterfaceMode || "simple", // Default to 'simple' if not found
        projects: projects
      };
    });

    console.log("/load-user-data: ", users);

      // Send the list of users as the response
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).send("Error getting users");
  }
});

app.get("/get-users", createFolderHandler());

// Project getterss
app.get("/get-projects", createFolderHandler());
app.get("/get-project-folders", createFolderHandler());

app.get("/get-project-data", async (req, res) => {
 try {
  console.log("Received request for get-project-data:", req.query);
  console.log("filepath: ", req.query.filePath);
  const projectDirectory = req.query.filePath;
  const gitConfigPath = path.join(req.query.filePath, ".git/config");
  const language = parseGitConfig(fs.readFileSync(gitConfigPath, "utf8"));

  const includeData =  getAllFiles(path.join(projectDirectory, "include"));
  const srcData = getAllFiles(path.join(projectDirectory, "src"));
  const userFileData = getAllFiles(path.join(projectDirectory, "data"));

  const filteredIncludeData = includeData.filter((file) => !file.startsWith("."));
  const filteredSrcData = srcData.filter((file) => !file.startsWith("."));
  const filteredUserFileData = userFileData.filter((file) => !file.startsWith("."));

 
  const projectData = {
    projectLanguage: language,
    includeData: filteredIncludeData,
    srcData: filteredSrcData,
    userFileData:filteredUserFileData,
  };

  console.log("Project data:", projectData);

  res.status(200).json(projectData);
 }
 catch (error) {
  console.error("Error getting project data:", error);
  res.status(500).send("Error getting project data");
 }
})
// Folder content getters
//app.get("/get-folder-contents", getFolderContents());

// File content getters
app.get("/get-file-contents", getFileContents());

//File content setters
app.post("/save-file-content", saveFileContents());

//Change interface mode
app.post("/change-interface-mode", (req, res) => {
  const { userName, newMode } = req.body;

  console.log("Received request to change interface mode:", req.body);

  if (!userName || !newMode) {
    return res.status(400).json({ error: "Missing userName or newMode" });
  }

  const success = setUserInterfaceMode(userName, newMode);

  if (success) {
    res.json({ message: `Interface mode updated to ${newMode} for ${userName}` });
  } else {
    res.status(500).json({ error: "Failed to update interface mode" });
  }
});


app.get("/run-code", (req, res) => {
  console.log("Received run request:", req.query);
  const { userName, projectName, activeLanguage } = req.query;
  if (!userName || !projectName || !activeLanguage) {
    return res.status(400).send("Missing parameters");
  }

  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const projectDirectory = path.join(userDirectory, projectName);
  const bin_directory = path.join(projectDirectory, "/bin");

  let runCommand;
  switch (activeLanguage) {
    case "c":
    case "cpp":
      runCommand = `"${bin_directory}/botball_user_program"`;

      break;
    case "python":
      runCommand = `/bin/bash -c 'export PYTHONPATH=/usr/local/lib && python3 "${bin_directory}/botball_user_program"'`;
      break;
  }
  console.log("runCommand: ", runCommand);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("Executing:", runCommand);

  // const child = spawn(runCommand, [], { shell: true, env: { ...process.env, PYTHONPATH: "/usr/local/lib" } });
  const child = spawn("stdbuf", ["-oL", runCommand], { shell: true });

  child.stdout.on("data", (data) => {
    const output = data.toString();

    console.log("stdout:", output);
    output.split("\n").forEach((line) => {
      if (line.trim() !== "") {
        res.write(`data: ${line}\n\n`);
        res.flush?.();
      }
    });
  });

  child.stderr.on("data", (data) => {
    console.error("stderr:", data.toString());
    res.write(`data: ERROR: ${data.toString()}\n\n`);
    res.flush?.();
  });

  child.on("close", (code) => {
    console.log(`Process exited with code ${code}`);
    res.write(`data: Process exited with code ${code}\n\n`);
    res.write("event: end\ndata: END\n\n");
    res.flush?.();
    res.end();
  });
  // exec(runCommand, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error during execution: ${error.message}`);
  //     return res.status(500).json({ error: "Execution failed" });
  //   }
  //   if (stderr) {
  //     console.error(`Execution errors: ${stderr}`);
  //   }

  //   // Respond with the execution output
  //   res.json({
  //     message: "Execution successful",
  //     output: stdout,
  //   });
  // });
});

app.post("/feedback", (req, res) => {
  const hookURL = config.server.feedbackWebhookURL;
  if (!hookURL) {
    res.status(500).json({
      message:
        "The feedback URL is not set on the server. If this is a developoment environment, make sure the feedback URL environment variable is set.",
    });
    return;
  }

  const body = req.body;

  let content = `User Feedback Recieved:\n\`\`\`${body.feedback} \`\`\``;

  content += `Sentiment: `;
  switch (body.sentiment) {
    case 0:
      content += "No sentiment! This is probably a bug";
      break;
    case 1:
      content += ":frowning2:";
      break;
    case 2:
      content += ":expressionless:";
      break;
    case 3:
      content += ":smile:";
      break;
  }
  content += "\n";

  if (body.email !== null && body.email !== "") {
    content += `User Email: ${body.email}\n`;
  }

  let files = null;

  if (body.includeAnonData) {
    content += `Browser User-Agent: ${body.userAgent}\n`;
    files = [
      {
        attachment: Buffer.from(JSON.stringify(body.state, undefined, 2)),
        name: "userdata.json",
      },
    ];
  }

  let webhook;
  try {
    webhook = new WebhookClient({ url: hookURL });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occured on the server. If you are a developer, your webhook url is likely wrong.",
    });
    // TODO: write the feedback to a file if an error occurs?
    return;
  }

  webhook
    .send({
      content: content,
      username: "KIPR Simulator Feedback",
      avatarURL:
        "https://www.kipr.org/wp-content/uploads/2018/08/botguy-copy.jpg",
      files: files,
    })
    .then(() => {
      res.status(200).json({
        message: "Feedback submitted! Thank you!",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "An error occured on the server while sending feedback.",
      });
      // TODO: write the feedback to a file if an error occurs?
    });
});

app.use(
  "/static",
  express.static(`${__dirname}/static`, {
    maxAge: config.caching.staticMaxAge,
  })
);

// Expose cpython artifacts
if (config.server.dependencies.cpython) {
  console.log("CPython artifacts are enabled.");
  app.use(
    "/cpython",
    express.static(`${config.server.dependencies.cpython}`, {
      maxAge: config.caching.staticMaxAge,
    })
  );
}

// Expose libkipr (Python) artifacts
if (config.server.dependencies.libkipr_python) {
  console.log("libkipr (Python) artifacts are enabled.");
  console.log(
    "libkipr (Python) artifacts path: ",
    config.server.dependencies.libkipr_python
  );
  app.use(
    "/libkipr/python",
    express.static(`${config.server.dependencies.libkipr_python}`, {
      maxAge: config.caching.staticMaxAge,
    })
  );
}

app.use(
  "/dist",
  express.static(`${__dirname}/dist`, {
    setHeaders: setCrossOriginIsolationHeaders,
  })
);

app.use(
  express.static(sourceDir, {
    maxAge: config.caching.staticMaxAge,
    setHeaders: setCrossOriginIsolationHeaders,
  })
);

app.get("/login", (req, res) => {
  res.sendFile(`${__dirname}/${sourceDir}/login.html`);
});

app.use("*", (req, res) => {
  setCrossOriginIsolationHeaders(res);
  res.sendFile(`${__dirname}/${sourceDir}/index.html`);
});

app.listen(config.server.port, "0.0.0.0", () => {
  console.log(
    `Express web server started: http://localhost:${config.server.port}`
  );
  console.log(`Serving content from /${sourceDir}/`);
});

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Cross-origin isolation required for using features like SharedArrayBuffer
function setCrossOriginIsolationHeaders(res) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
}
