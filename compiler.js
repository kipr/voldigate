const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { get: getConfig } = require("./config.js");

const envProjectUsername = process.env.PROJECT_USERNAME;
const envProjectName = process.env.PROJECT_NAME;
const envFileName = process.env.FILE_NAME;
const envLanguage = process.env.ACTIVE_LANGUAGE;

// Set working directory
const userProjectDirectory = `/home/kipr/Documents/KISS/${envProjectUsername}/${envProjectName}`;
console.log("userProjectDirectory: ", userProjectDirectory);
const bin_directory = path.join(userProjectDirectory, "/bin");
const include_directory = path.join(userProjectDirectory, "/include");
const src_directory = path.join(userProjectDirectory, "/src");
const outputBinaryPath = path.join(bin_directory, "botball_user_program");

// Ensure bin folder doesn't already exist
if (fs.existsSync(bin_directory)) {
  console.log("Bin directory already exists");
} else {
  fs.mkdirSync(bin_directory);
  console.log("Bin directory created");
}
console.log("bin_directory: ", bin_directory);
console.log("envUsername: ", envProjectUsername);
console.log("envProjectName: ", envProjectName);
console.log("envFileName: ", envFileName);
console.log("envLanguage: ", envLanguage);

let sourceFilePath;
let sourceFiles;
let config;
try {
  config = getConfig();
} catch (e) {
  process.exitCode = 1;
  throw e;
}

try {
  switch (envLanguage) {
    case "c":
      sourceFiles = fs
        .readdirSync(src_directory)
        .filter((file) => {
          // Only include .c
          return file.endsWith(".c");
        })
        .map((file) => path.join(src_directory, file));
      console.log("Source Files: ", sourceFiles);

      sourceFilePath = sourceFiles.join(" ");
      compileCommand = `gcc -Wall -Wextra -fmax-errors=100 -o "${outputBinaryPath}" ${sourceFilePath} -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -I"${include_directory}" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
      console.log("compileCommand: ", compileCommand);
      break;
    case "cpp":
      sourceFiles = fs
        .readdirSync(src_directory)
        .filter((file) => {
          // Only include .c
          return file.endsWith(".cpp");
        })
        .map((file) => path.join(src_directory, file));
      console.log("Source Files: ", sourceFiles);
      sourceFilePath = sourceFiles.join(" ");
      compileCommand = `clang++ -std=c++17 -o "${outputBinaryPath}" ${sourceFilePath} -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -I"${include_directory}" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
      break;
    case "python":
      sourceFilePath = path.join(userProjectDirectory, "/src/main.py");
      // Unlink any existing binary or symbolic link before creating a new one
      try {
        fs.unlinkSync(outputBinaryPath); // Remove the previous binary (C/ELF)
        console.log(`Removed previous binary at ${outputBinaryPath}`);
      } catch (err) {
        console.log(
          "No previous binary to unlink or error unlinking:",
          err.message
        );
      }
      compileCommand = `python3 -m py_compile ${sourceFilePath}`;
      ln_cmd = `ln -s ${sourceFilePath} ${outputBinaryPath}`;
      exec(ln_cmd, (err) => {
        if (err) {
          console.error(`Error creating symbolic link: ${err.message}`);
        } else {
          console.log(
            `Symbolic link created: ${sourceFilePath} -> ${outputBinaryPath}`
          );
        }
      });

      break;
  }
  try {
    const stats = fs.lstatSync(outputBinaryPath);
    if (stats.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(outputBinaryPath); // Get the linked file

      // If the link target matches the source file path, unlink it
      if (linkTarget === sourceFilePath) {
        console.log("Unlinking the existing symbolic link...");
        fs.unlinkSync(outputBinaryPath);
      }
    }
  } catch (err) {
    console.log(
      "No symbolic link found or error checking symbolic link:",
      err.message
    );
  }
  chmod_cmd = `chmod u+x ${outputBinaryPath}`;
  exec(chmod_cmd);
  console.log("compiler.js: Executing compileCommand: ", compileCommand);
  exec(compileCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during compilation: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Compilation warnings/errors in compiler.js: ${stderr}`);
    }
    console.log(`Compilation successful: ${stdout}`);

    // Verify the binary file has been updated
    fs.stat(outputBinaryPath, (err, stats) => {
      if (err) {
        console.error("Error getting binary file stats:", err);
        return;
      }
      console.log("Binary file stats:", stats);
    });
  });
} catch (err) {
  console.error("compiler.js Error:", err);
}
