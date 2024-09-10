const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const {
  getAllUsers,
  getContentFromSrcFile,
} = require("./src/database_js/DatabaseService.js");
const DatabaseService = require("./src/database_js/DatabaseService.js");
const { get: getConfig } = require("./config.js");
//Read environment variables

const envProjectUsername = process.env.PROJECT_USERNAME;
const envProjectName = process.env.PROJECT_NAME;
const envFileName = process.env.FILE_NAME;
const envLanguage = process.env.ACTIVE_LANGUAGE;

console.log("envUsername: ", envProjectUsername);
console.log("envProjectName: ", envProjectName);
console.log("envFileName: ", envFileName);
console.log("envLanguage: ", envLanguage);

// Define the compilation command (gcc for C files)
const bin_directory = path.resolve(__dirname, "tempBin");
const sourceFilePath = path.resolve(__dirname, "source_file.c"); // Adjust the path as needed
const outputBinaryPath = path.resolve(bin_directory, "output_binary");

let config;
try {
  config = getConfig();
} catch (e) {
  process.exitCode = 1;
  throw e;
}
getContentFromSrcFile(envProjectUsername, envProjectName, envFileName)
  .then((content) => {
    console.log("Writing content to source file:", content);
    return fs.writeFile(sourceFilePath, content);
  })
  .then(() => {
    console.log(`Source file written successfully: ${sourceFilePath}`);

    //Compile executable file from source file (user code in source file)
    // const compileCommand = `gcc -o ${outputBinaryPath} ${sourceFilePath} -I${__dirname}/libkipr_voldigate/libkipr_install_c/include -L${__dirname}/libkipr_voldigate/libkipr_install_c/lib -lkipr`;
    var chmod_cmd, cp_cmd, i, len, ln_cmd, pyc_cmd, src;
    switch (envLanguage) {
      case "c":
      case "cpp":
        try {
          const outputBinaryPathC = path.resolve(outputBinaryPath);
          const sourceFilePathC = path.resolve(sourceFilePath);
          const stats = fs.lstatSync(outputBinaryPathC);
          if (stats.isSymbolicLink()) {
            const linkTarget = fs.readlinkSync(outputBinaryPathC); // Get the linked file

            // If the link target matches the source file path, unlink it
            if (linkTarget === sourceFilePathC) {
              console.log("Unlinking the existing symbolic link...");
              fs.unlinkSync(outputBinaryPathC);
            }
          }
        } catch (err) {
          console.log(
            "No symbolic link found or error checking symbolic link:",
            err.message
          );
        }

        compileCommand = `gcc -o ${outputBinaryPath} ${sourceFilePath} -I${__dirname}/libkipr_voldigate/libkipr_install_c/include -L${__dirname}/libkipr_voldigate/libkipr_install_c/lib -lkipr`;
        break;
      case "python":
        const outputBinaryPathPy = path.resolve(outputBinaryPath);
        const sourceFilePathPy = path.resolve(sourceFilePath);
        // Unlink any existing binary or symbolic link before creating a new one
        try {
          fs.unlinkSync(outputBinaryPathPy); // Remove the previous binary (C/ELF)
          console.log(`Removed previous binary at ${outputBinaryPathPy}`);
        } catch (err) {
          console.log(
            "No previous binary to unlink or error unlinking:",
            err.message
          );
        }
        // Python compilation and linking
        compileCommand = `python3 -m py_compile ${sourceFilePathPy}`;
        ln_cmd = `ln -s ${sourceFilePathPy} ${outputBinaryPathPy}`;
        exec(ln_cmd, (err) => {
          if (err) {
            console.error(`Error creating symbolic link: ${err.message}`);
          } else {
            console.log(`Symbolic link created: ${sourceFilePathPy} -> ${outputBinaryPathPy}`);
          }
        });
        break;
      default:
        console.error("Invalid language selection");
        process.exit(1);
    }

    chmod_cmd = `chmod u+x ${outputBinaryPath}`;

    exec(chmod_cmd);
    console.log("compileCommand: ", compileCommand);
    console.log("ln_cmd: ", ln_cmd);
    console.log("chmod_cmd: ", chmod_cmd);
    console.log("pyc_cmd: ", pyc_cmd);

    exec(compileCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during compilation: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Compilation warnings/errors: ${stderr}`);
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
  })
  .catch((err) => {
    console.error("Error:", err);
  });
