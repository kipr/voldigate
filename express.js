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
const { WebhookClient } = require("discord.js");
const path = require("path");
const proxy = require("express-http-proxy");

let config;
try {
  config = getConfig();
} catch (e) {
  process.exitCode = 1;
  throw e;
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
  console.log("Environment varriables: ", env);

  exec("node compiler.js", { env }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during execution: ${error.message}`);
      return res.status(500).json({ error: "Execution failed" });
    }
    if (stderr) {
      console.error(`Compilation warnings/errors: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.json({
      message: "Compilation successful in /compile-code",
      output: env.PROJECT_USERNAME,
    });
  });
  //res.json({ message: "Received data", userName, projectName, fileName });
});

app.post("/run-code", (req, res) => {
  console.log("Received request body:", req.body); // Log the entire request body
  const bin_directory = path.resolve(__dirname, "tempBin");

  switch(req.body.activeLanguage) {
    case "c":
    case "cpp":
      console.log("runcommand: ", `${bin_directory}/output_binary`);
      runCommand = `${bin_directory}/output_binary`;
      console.log("runCommand: ", runCommand);
      break;
    case "python":
      runCommand = `export PYTHONPATH=/usr/local/lib && echo $PYTHONPATH && python3 ${bin_directory}/output_binary`;
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

app.listen(config.server.port, () => {
  console.log(
    `Express web server started: http://localhost:${config.server.port}`
  );
  console.log(`Serving content from /${sourceDir}/`);
});

// Cross-origin isolation required for using features like SharedArrayBuffer
function setCrossOriginIsolationHeaders(res) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
}
