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

// Define the compilation command (gcc for C files)
const sourceFilePathC = path.join(userProjectDirectory, "/src/main.c"); // Adjust the path as needed
const sourceFilePathCpp = path.resolve(__dirname, "source_file.cpp"); // Adjust the path as needed
const sourceFilePathPy = path.resolve(__dirname, "source_file.py"); // Adjust the path as needed

const outputBinaryPathCpp = path.resolve(bin_directory, "output_binary_cpp");
let sourceFilePath;
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
      sourceFilePath = path.join(userProjectDirectory, "/src/main.c");
      compileCommand = `gcc -o "${outputBinaryPath}" "${sourceFilePath}" -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
      break;
    case "cpp":
      sourceFilePath = path.join(userProjectDirectory, "/src/main.cpp");
      compileCommand = `clang++ -std=c++17 -o "${outputBinaryPath}" "${sourceFilePath}" -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
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
// getContentFromSrcFile(envProjectUsername, envProjectName, envFileName)
//   .then((content) => {
//     console.log("Writing content to source file:", content);
//     switch(envLanguage) {
//       case "c":
//         sourceFilePath = sourceFilePathC;
//         break;
//       case "cpp":
//         sourceFilePath = sourceFilePathCpp;
//         break;
//       case "python":
//         sourceFilePath = sourceFilePathPy;
//         break;
//       default:
//         console.error("Invalid language selection");
//         process.exit(1);
//     }
//     return fs.writeFile(sourceFilePath, content);
//   })
//   .then(() => {
//     console.log(`Source file written successfully: ${sourceFilePath}`);

//     //Compile executable file from source file (user code in source file)
//     // const compileCommand = `gcc -o ${outputBinaryPath} ${sourceFilePath} -I${__dirname}/libkipr_voldigate/libkipr_install_c/include -L${__dirname}/libkipr_voldigate/libkipr_install_c/lib -lkipr`;
//     var chmod_cmd, cp_cmd, i, len, ln_cmd, pyc_cmd, src;
//     switch (envLanguage) {
//       case "c":
//         try {
//           const outputBinaryPathC = path.resolve(outputBinaryPath);

//           const stats = fs.lstatSync(outputBinaryPathC);
//           if (stats.isSymbolicLink()) {
//             const linkTarget = fs.readlinkSync(outputBinaryPathC); // Get the linked file

//             // If the link target matches the source file path, unlink it
//             if (linkTarget === sourceFilePathC) {
//               console.log("Unlinking the existing symbolic link...");
//               fs.unlinkSync(outputBinaryPathC);
//             }
//           }
//         } catch (err) {
//           console.log(
//             "No symbolic link found or error checking symbolic link:",
//             err.message
//           );
//         }
//         console.log("_dirname: ", __dirname);
//         compileCommand = `gcc -o "${outputBinaryPath}" "${sourceFilePathC}" -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
//         break;
//       case "cpp":
//         try {
//           const outputBinaryPathCpp = path.resolve(outputBinaryPath);
//           const stats = fs.lstatSync(outputBinaryPathCpp);
//           if (stats.isSymbolicLink()) {
//             const linkTarget = fs.readlinkSync(outputBinaryPathCpp); // Get the linked file

//             // If the link target matches the source file path, unlink it
//             if (linkTarget === sourceFilePathC) {
//               console.log("Unlinking the existing symbolic link...");
//               fs.unlinkSync(outputBinaryPathCpp);
//             }
//           }
//         } catch (err) {
//           console.log(
//             "No symbolic link found or error checking symbolic link:",
//             err.message
//           );
//         }

//         compileCommand = `clang++ -std=c++17 -o "${outputBinaryPathCpp}" "${sourceFilePathCpp}" -I"${__dirname}/libkipr_voldigate/libkipr_install_c/include" -L"${__dirname}/libkipr_voldigate/libkipr_install_c/lib" -lkipr`;
//         break;
//       case "python":
//         const outputBinaryPathPy = path.resolve(outputBinaryPath);

//         // Unlink any existing binary or symbolic link before creating a new one
//         try {
//           fs.unlinkSync(outputBinaryPathPy); // Remove the previous binary (C/ELF)
//           console.log(`Removed previous binary at ${outputBinaryPathPy}`);
//         } catch (err) {
//           console.log(
//             "No previous binary to unlink or error unlinking:",
//             err.message
//           );
//         }
//         // Python compilation and linking
//         compileCommand = `python3 -m py_compile ${sourceFilePathPy}`;
//         ln_cmd = `ln -s ${sourceFilePathPy} ${outputBinaryPathPy}`;
//         exec(ln_cmd, (err) => {
//           if (err) {
//             console.error(`Error creating symbolic link: ${err.message}`);
//           } else {
//             console.log(
//               `Symbolic link created: ${sourceFilePathPy} -> ${outputBinaryPathPy}`
//             );
//           }
//         });
//         break;
//       default:
//         console.error("Invalid language selection");
//         process.exit(1);
//     }

//     chmod_cmd = `chmod u+x ${outputBinaryPath}`;

//     exec(chmod_cmd);
//     console.log("compileCommand: ", compileCommand);
//     console.log("ln_cmd: ", ln_cmd);
//     console.log("chmod_cmd: ", chmod_cmd);
//     console.log("pyc_cmd: ", pyc_cmd);

//     exec(compileCommand, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error during compilation: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`Compilation warnings/errors in compiler.js: ${stderr}`);
//       }
//       console.log(`Compilation successful: ${stdout}`);

//       // Verify the binary file has been updated
//       fs.stat(outputBinaryPath, (err, stats) => {
//         if (err) {
//           console.error("Error getting binary file stats:", err);
//           return;
//         }
//         console.log("Binary file stats:", stats);
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });
