const { execFile } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { get: getConfig } = require("./config.js");
const {
  projectBinaryPath,
  projectDirectory,
  projectSubdirectory,
} = require("./kissPaths.js");
const envProjectUsername = process.env.PROJECT_USERNAME;
const envProjectName = process.env.PROJECT_NAME;
const envFileName = process.env.FILE_NAME;
const envLanguage = process.env.ACTIVE_LANGUAGE;

const userProjectDirectory = projectDirectory(envProjectUsername, envProjectName);
console.error("userProjectDirectory: ", userProjectDirectory);
const bin_directory = projectSubdirectory(envProjectUsername, envProjectName, "bin");
const include_directory = projectSubdirectory(envProjectUsername, envProjectName, "include");
const src_directory = projectSubdirectory(envProjectUsername, envProjectName, "src");
const outputBinaryPath = projectBinaryPath(envProjectUsername, envProjectName);

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
let compileArgs;
let compileCommand;
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
        .filter((file) => file.endsWith(".c"))
        .map((file) => path.join(src_directory, file));

      sourceFilePath = sourceFiles.join(" ");
      console.error("sourceFilePath: ", sourceFilePath);
      compileArgs = [
        "-Wall",
        "-Wextra",
        "-fmax-errors=100",
        "-o",
        outputBinaryPath,
        ...sourceFiles,
        `-I${include_directory}`,
        "-lkipr",
        "-lm",
        "-lpthread",
      ];
      compileCommand = `gcc ${compileArgs.map((arg) => JSON.stringify(arg)).join(" ")}`;
      console.error("compileCommand: ", compileCommand);
      try {
        execFile("gcc", compileArgs, (error, stdout, stderr) => {
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
          // Only include .cpp
          return file.endsWith(".cpp");
        })
        .map((file) => path.join(src_directory, file));

      sourceFilePath = sourceFiles.join(" ");

      compileArgs = [
        "-Wall",
        "-std=c++17",
        "-o",
        outputBinaryPath,
        ...sourceFiles,
        `-I${include_directory}`,
        "-lkipr",
        "-lm",
        "-lpthread",
      ];
      compileCommand = `clang++ ${compileArgs.map((arg) => JSON.stringify(arg)).join(" ")}`;
      console.error("compileCommand: ", compileCommand);
      try {
        execFile("clang++", compileArgs, (error, stdout, stderr) => {
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
    case "python": {
      const { execFileSync } = require("child_process");

      sourceFilePath = path.join(userProjectDirectory, "src", "main.py");

      try {
        if (fs.existsSync(outputBinaryPath)) fs.unlinkSync(outputBinaryPath);

        const output = execFileSync(
          "python3",
          ["-m", "py_compile", sourceFilePath],
          {
            encoding: "utf8",
            env: { ...process.env, PYTHONPATH: "/usr/local/lib" }, // replaces: export PYTHONPATH=...
          }
        );

        fs.symlinkSync(sourceFilePath, outputBinaryPath);

        process.stdout.write(
          JSON.stringify({
            success: true,
            output: output || "Python compilation successful",
          }) + "\n"
        );
      } catch (err) {
        console.error("Python compile/link failed:", err.message);
        process.stdout.write(
          JSON.stringify({
            success: false,
            error: (err.stderr && err.stderr.toString()) || err.message,
          }) + "\n"
        );
      }

      break;
    }
  }
} catch (err) {
  console.error("compiler.js Error:", err);
}
