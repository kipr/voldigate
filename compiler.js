const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { get: getConfig } = require("./config.js");
const { execSync } = require("child_process");
const envProjectUsername = process.env.PROJECT_USERNAME;
const envProjectName = process.env.PROJECT_NAME;
const envFileName = process.env.FILE_NAME;
const envLanguage = process.env.ACTIVE_LANGUAGE;

const userProjectDirectory = `/home/kipr/Documents/KISS/${envProjectUsername}/${envProjectName}`;
console.error("userProjectDirectory: ", userProjectDirectory);
const bin_directory = path.join(userProjectDirectory, "/bin");
const include_directory = path.join(userProjectDirectory, "/include");
const src_directory = path.join(userProjectDirectory, "/src");
const outputBinaryPath = path.join(bin_directory, "botball_user_program");

// Ensure bin folder doesn't already exist
if (fs.existsSync(bin_directory)) {
  console.error("Bin directory already exists");
} else {
  fs.mkdirSync(bin_directory);
  console.error("Bin directory created");
}

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
    case "graphical":
    case "c":
      sourceFiles = fs
        .readdirSync(src_directory)
        .filter((file) => {
          // Only include .c
          return file.endsWith(".c");
        })
        .map((file) => path.join(src_directory, file));

      sourceFilePath = sourceFiles.join(" ");
      compileCommand = `gcc -Wall -Wextra -fmax-errors=100 -o "${outputBinaryPath}" ${sourceFilePath}  -I"${include_directory}" -lkipr -lm -lpthreads`;

      try {
        exec(compileCommand, (error, stdout, stderr) => {
          // const messages = parseCompilerErrors(stderr, userProjectDirectory);
          if (error) {
            process.stdout.write(
              JSON.stringify({
                success: false,
                error: stderr,
              }) + "\n"
            );
          } else {
            try {
              fs.chmodSync(outputBinaryPath, "755");
            } catch (chmodErr) {
              console.warn("chmod failed:", chmodErr.message);
            }
            const hasWarnings = stderr && stderr.trim().length > 0;
            process.stdout.write(
              JSON.stringify({
                success: true,
                output: stdout || "Compilation successful",
                warnings: hasWarnings ? stderr : undefined,
              }) + "\n"
            );
          }
        });
      } catch (err) {
        process.stdout.write(
          JSON.stringify({
            success: false,
            error: err.stderr || err.message,
          }) + "\n"
        );
      }

      break;
    case "cpp":
      sourceFiles = fs
        .readdirSync(src_directory)
        .filter((file) => {
          // Only include .c
          return file.endsWith(".cpp");
        })
        .map((file) => path.join(src_directory, file));

      sourceFilePath = sourceFiles.join(" ");

      compileCommand = `clang++ -Wall -std=c++17 -o "${outputBinaryPath}" ${sourceFilePath} -I"${include_directory}" -lkipr -lm -lpthreads`;
      console.error("compileCommand: ", compileCommand);
      try {
        exec(compileCommand, (error, stdout, stderr) => {
          if (error) {
            console.error("Compilation failed:", error.message);
            process.stdout.write(
              JSON.stringify({
                success: false,
                error: stderr || error.message,
              }) + "\n"
            );
          } else {
            try {
              fs.chmodSync(outputBinaryPath, "755");
            } catch (chmodErr) {
              console.warn("chmod failed:", chmodErr.message);
            }
            const hasWarnings = stderr && stderr.trim().length > 0;
            process.stdout.write(
              JSON.stringify({
                success: true,
                output: stdout || "Compilation successful",
                warnings: hasWarnings ? stderr : undefined,
              }) + "\n"
            );
          }
        });
      } catch (err) {
        console.error("C++ Compilation failed:", err.message);
        process.stdout.write(
          JSON.stringify({
            success: false,
            error: err.stderr?.toString() || err.message,
          })
        );
      }

      break;
    case "python":
      sourceFilePath = path.join(userProjectDirectory, "/src/main.py");
      // Unlink any existing binary or symbolic link before creating a new one
      try {
        if (fs.existsSync(outputBinaryPath)) {
          fs.unlinkSync(outputBinaryPath);
        }
        const output = execSync(
          `/bin/bash -c 'export PYTHONPATH=/usr/local/lib && python3 -m py_compile ${sourceFilePath}'`,
          { encoding: "utf8" }
        );
        fs.symlinkSync(sourceFilePath, outputBinaryPath);
        console.error("Python failed output: ", output);
        process.stdout.write(
          JSON.stringify({
            success: true,
            output: output || "Python compilation successful",
          })
        );
      } catch (err) {
        console.error("Python compile/link failed:", err.message);
        process.stdout.write(
          JSON.stringify({
            success: false,
            error: err.stderr,
          }) + "\n"
        );
      }

      break;
  }
} catch (err) {
  console.error("compiler.js Error:", err);
}
