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

// Helper function to handle folder-based APIs
function createFolderHandler() {
  return async (req, res) => {
    const folderPath = req.query.filePath;
    console.log("Received request for folder path:", folderPath);

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

function getFolderContents() {
  return async (req, res) => {
    const folderPath = req.query.filePath;
    console.log("Received request for folder path:", folderPath);

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
      return res.status(400).json({ error: "Invalid or non-existent file path" });
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
    console.log("Received request to save file:", filePath, "with fileContents: ", fileContents);

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

  const lines = configContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines or comments
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue;
    }

    // Detect section headers, e.g., [repo]
    const sectionMatch = trimmedLine.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    // Parse key-value pairs within a section
    if (currentSection === 'repo' && trimmedLine.includes('=')) {
      const [key, value] = trimmedLine.split('=').map(part => part.trim());
      if (key === 'language') {
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

app.post("/compile-code", (req, res) => {
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
  const { userName, projectName, language } = req.body;
  console.log("Received request body:", req.body); // Log the entire request body
  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const projectDirectory = path.join(userDirectory, projectName);

  // Ensure the user's directory exists
  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory, { recursive: true });
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
    const folders = ["include", "src", "data"];
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
        if(!fs.existsSync(path.join(projectDirectory, "src", `main.py`))){
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

app.get("/get-project-language" , async (req, res) => {
  try{
    console.log("/get-project-language filePath: ", req.query.filePath);
    
    const gitConfigPath = path.join(req.query.filePath, ".git/config");

    

    //check if .git/config exists
    if(!fs.existsSync(gitConfigPath)){
      return res.status(400).json({ error: ".git/config not found" });
    }

    const language = parseGitConfig(fs.readFileSync(gitConfigPath, "utf8"));

    //send the language as the response
    res.status(200).json({
      language,
    });

    
  }
  catch(error){
    console.error("Error getting project language:", error);
    res.status(500).send("Error getting project language");
  }
});

// User getters
app.get("/get-users", createFolderHandler());

// Project getterss
app.get("/get-projects", createFolderHandler());
app.get("/get-project-folders", createFolderHandler());

// Folder content getters
app.get("/get-folder-contents", getFolderContents());

// File content getters
app.get("/get-file-contents", getFileContents());


//File content setters
app.post("/save-file-content", saveFileContents());



app.post("/run-code", (req, res) => {
  console.log("Received request body:", req.body); // Log the entire request body
  const bin_directory = path.resolve(__dirname, "tempBin");

  switch (req.body.activeLanguage) {
    case "c":
      runCommand = `"${bin_directory}/output_binary"`;
      console.log("runCommand: ", runCommand);
      break;
    case "cpp":
      runCommand = `"${bin_directory}/output_binary_cpp"`;
      console.log("runCommand: ", runCommand);
      break;
    case "python":
      runCommand = `export PYTHONPATH=/usr/local/lib && python3 "${bin_directory}/output_binary"`;
      break;
  }
  // Command to execute the binary Python file
  //const command = `export PYTHONPATH=/usr/local/lib && echo $PYTHONPATH && python3 ${bin_directory}/output_binary`;

  exec(runCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during execution: ${error.message}`);
      return res.status(500).json({ error: "Execution failed" });
    }
    if (stderr) {
      console.error(`Execution errors: ${stderr}`);
    }

    // Respond with the execution output
    res.json({
      message: "Execution successful",
      output: stdout,
    });
  });
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
