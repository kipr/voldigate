/* eslint-env node */
//require("ts-node").register();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs").promises;
const uuid = require("uuid");
const { exec } = require("child_process");
const app = express();
const { execFile } = require("child_process");
const sourceDir = "dist";
const { get: getConfig } = require("./config");
const path = require("path");
const proxy = require("express-http-proxy");
const http = require("http");
const JSZip = require("jszip");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const compression = require("compression");
app.use(compression());
const expressStaticGzip = require("express-static-gzip");

const {
  parseBlockXml,
  convertToC,
  parseXml,
} = require("./dist/utils/convertToC.js");
const { error } = require("console");

const extensions = {
  c: "c",
  cpp: "cpp",
  python: "py",
  graphical: "graphical",
};

const defaultPath = "/home/kipr/Documents/KISS";
let config;
try {
  config = getConfig();
} catch (e) {
  process.exitCode = 1;
  throw e;
}
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1d",
  })
);
// Cross-origin isolation required for using features like SharedArrayBuffer
function setCrossOriginIsolationHeaders(res) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
}

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

if (config.server.dependencies.scratch_rt) {
  console.log("Scratch Runtime is enabled.");
  app.use(
    "/scratch/rt.js",
    express.static(`${config.server.dependencies.scratch_rt}`, {
      maxAge: config.caching.staticMaxAge,
    })
  );
}

app.use(
  "/scratch",
  express.static(path.resolve(__dirname, "node_modules", "kipr-scratch"), {
    maxAge: config.caching.staticMaxAge,
  })
);

app.use(
  "/media",
  express.static(
    path.resolve(__dirname, "node_modules", "kipr-scratch", "media"),
    {
      maxAge: config.caching.staticMaxAge,
    }
  )
);

app.post("/upload-project", express.json(), async (req, res) => {
  const { user, project, srcFiles, includeFiles, dataFiles } = req.body;
  console.log("Received project upload request:", {
    user,
    project,
    srcFiles,
    includeFiles,
    dataFiles,
  });
  if (!user || !project || !srcFiles || !includeFiles || !dataFiles) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const userPath = `${defaultPath}/${user.userName}`;
  const projectPath = `${userPath}/${project.projectName}`;
  const projectName = project.projectName;
  const includePath = `${projectPath}/include`;
  const srcPath = `${projectPath}/src`;
  const dataPath = `${projectPath}/data`;
  const configPath = `${projectPath}/.config.json`;
  const configContent = project.configFile.content;
  console.log("Config content:", configContent);

  let sourceNames = [];
  let includeNames = [];
  let dataNames = [];

  try {
    // Create user directory if it doesn't exist
    await fs.mkdir(userPath, { recursive: true });
    console.log("User directory created:", userPath);

    // Create project directory if it doesn't exist
    await fs.mkdir(projectPath, { recursive: true });
    console.log("Project directory created:", projectPath);

    // Create include directory if it doesn't exist
    await fs.mkdir(includePath, { recursive: true });
    console.log("Include directory created:", includePath);

    // Create src directory if it doesn't exist
    await fs.mkdir(srcPath, { recursive: true });
    console.log("Src directory created:", srcPath);

    // Create data directory if it doesn't exist
    await fs.mkdir(dataPath, { recursive: true });
    console.log("Data directory created:", dataPath);

    if (!configContent) {
      console.log("Config content is empty, creating default config");
      await fs.writeFile(
        configPath,
        JSON.stringify({ projectName, language }, null, 2),
        "utf-8"
      );
    } else {
      createAndSaveFile(configPath, configContent);
    }

    // Save source files
    for (const file of srcFiles) {
      const filePath = `${srcPath}/${file.name}`;
      await fs.writeFile(filePath, file.content);
      sourceNames.push(file.name);
      console.log(`Source file saved: ${filePath}`);
    }

    // Save include files
    for (const file of includeFiles) {
      const filePath = `${includePath}/${file.name}`;
      await fs.writeFile(filePath, file.content);
      includeNames.push(file.name);
      console.log(`Include file saved: ${filePath}`);
    }

    // Save data files
    for (const file of dataFiles) {
      const filePath = `${dataPath}/${file.name}`;
      await fs.writeFile(filePath, file.content);
      dataNames.push(file.name);
      console.log(`Data file saved: ${filePath}`);
    }

    return res.status(200).json({
      message: "Project uploaded successfully",
      createdProject: {
        projectName: project.projectName,
        projectLanguage: project.projectLanguage,
        srcFolderFiles: sourceNames,
        includeFolderFiles: includeNames,
        dataFolderFiles: dataNames,
      },
    });
  } catch (error) {
    console.error("Error creating project directories:", error);
    return res
      .status(500)
      .json({ error: "Failed to create project directories" });
  }
});

app.post("/upload-file", express.json(), async (req, res) => {
  const { user, project, files } = req.body;
  console.log("Received file upload request:", { user, project, files });
  if (!user || !project || !files) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  const defaultPath = "/home/kipr/Documents/KISS";
  let filePath;
  files.map((file) => {
    if (file.uploadType === "include") {
      if (file.name.endsWith(".h")) {
        filePath = `${defaultPath}/${user.userName}/${project.projectName}/include/${file.name}`;
      } else {
        filePath = `${defaultPath}/${user.userName}/${project.projectName}/include/${file.name}.h`;
      }
    } else if (file.uploadType === "src") {
      if (file.name.endsWith(extensions[file.language])) {
        filePath = `${defaultPath}/${user.userName}/${project.projectName}/src/${file.name}`;
      } else {
        filePath = `${defaultPath}/${user.userName}/${
          project.projectName
        }/src/${file.name}.${extensions[file.language]}`;
      }
    } else if (file.uploadType === "data") {
      if (file.name.endsWith(".txt")) {
        filePath = `${defaultPath}/${user.userName}/${project.projectName}/data/${file.name}`;
      } else {
        filePath = `${defaultPath}/${user.userName}/${project.projectName}/data/${file.name}.txt`;
      }
    }
    console.log("Saving file:", filePath);
    try {
      createAndSaveFile(filePath, file.content);
      return res.status(200).json({ message: "File saved successfully" });
    } catch (error) {
      console.error("Error saving file:", error);
      return res.status(500).json({ error: "Failed to save file" });
    }
  });
});

let latestAnalogValues = [];

let sensorValues = {
  analog: [0, 0, 0, 0, 0, 0], // 6 analog values
  digital: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10 digital values
  accelerometer: [0, 0, 0], // 3 accelerometer values
  gyro: [0, 0, 0], // 3 gyro values
  magnetometer: [0, 0, 0], // 3 magnetometer values
  button: [0], // 1 button value
};

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
console.log("WebSocket server initialized");

function broadcastAnalogValue() {
  const message = JSON.stringify({
    type: "analog",
    value: sensorValues.analog,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastDigitalValue() {
  const message = JSON.stringify({
    type: "digital",
    value: sensorValues.digital,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastAccelerometerValue() {
  const message = JSON.stringify({
    type: "accel",
    value: sensorValues.accelerometer,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastGyroValue() {
  const message = JSON.stringify({
    type: "gyro",
    value: sensorValues.gyro,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastMagnetometerValue() {
  const message = JSON.stringify({
    type: "magneto",
    value: sensorValues.magnetometer,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastButtonValue() {
  const message = JSON.stringify({
    type: "button",
    value: sensorValues.button,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

let analogPolling = false;
let digitalPolling = false;
let accelerometerPolling = false;
let gyroPolling = false;
let magnetometerPolling = false;
let buttonPolling = false;
let servoAddon;
let motorAddon;
let analogAddon;
let digitalAddon;
let accelAddon;
let gyroAddon;
let magnetoAddon;
let buttonAddon;

function startAnalogPolling() {
  if (analogPolling) return;
  analogPolling = true;
  if (!analogAddon) analogAddon = require("./build/Release/analog_addon.node");
  (function loop() {
    if (!analogPolling) return;
    sensorValues.analog.forEach((value, index) => {
      sensorValues.analog[index] = analogAddon.analog(index);
    });
    broadcastAnalogValue();
    setTimeout(loop, 500);
  })();
}

function startDigitalPolling() {
  if (digitalPolling) return;
  digitalPolling = true;
  if (!digitalAddon)
    digitalAddon = require("./build/Release/digital_addon.node");
  (function loop() {
    if (!digitalPolling) return;
    sensorValues.digital.forEach((value, index) => {
      sensorValues.digital[index] = digitalAddon.digital(index);
    });
    broadcastDigitalValue();
    setTimeout(loop, 500);
  })();
}

function startAccelerometerPolling() {
  if (accelerometerPolling) return;
  accelerometerPolling = true;
  if (!accelAddon) accelAddon = require("./build/Release/accel_addon.node");
  (function loop() {
    if (!accelerometerPolling) return;

    sensorValues.accelerometer[0] = accelAddon.accel_x();
    sensorValues.accelerometer[1] = accelAddon.accel_y();
    sensorValues.accelerometer[2] = accelAddon.accel_z();
    broadcastAccelerometerValue();
    setTimeout(loop, 500);
  })();
}

function startGyroPolling() {
  if (gyroPolling) return;
  gyroPolling = true;
  if (!gyroAddon) gyroAddon = require("./build/Release/gyro_addon.node");
  (function loop() {
    if (!gyroPolling) return;
    sensorValues.gyro[0] = gyroAddon.gyro_x();
    sensorValues.gyro[1] = gyroAddon.gyro_y();
    sensorValues.gyro[2] = gyroAddon.gyro_z();
    broadcastGyroValue();
    setTimeout(loop, 500);
  })();
}

function startMagnetometerPolling() {
  if (magnetometerPolling) return;
  magnetometerPolling = true;
  if (!magnetoAddon)
    magnetoAddon = require("./build/Release/magneto_addon.node");
  (function loop() {
    if (!magnetometerPolling) return;

    sensorValues.magnetometer[0] = magnetoAddon.magneto_x();
    sensorValues.magnetometer[1] = magnetoAddon.magneto_y();
    sensorValues.magnetometer[2] = magnetoAddon.magneto_z();

    broadcastMagnetometerValue();
    setTimeout(loop, 500);
  })();
}

function startButtonPolling() {
  if (buttonPolling) return;
  buttonPolling = true;
  if (!buttonAddon) buttonAddon = require("./build/Release/button_addon.node");
  (function loop() {
    if (!buttonPolling) return;

    sensorValues.button[0] = buttonAddon.push_button();
    broadcastButtonValue();
    setTimeout(loop, 100);
  })();
}
function stopPolling() {
  analogPolling = false;
  digitalPolling = false;
  accelerometerPolling = false;
  gyroPolling = false;
  magnetometerPolling = false;
  buttonPolling = false;
}

let pty;
let os;
wss.on("connection", (ws, req) => {
  console.log("WebSocket connection established");
  console.log("WebSocket request pathname:", req.url);

  if (req.url === "/ws/sensors") {
    console.log("WebSocket connection for sensors established");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case "start-analog":
            console.log("Received start-analog message");
            startAnalogPolling();
            break;
          case "start-digital":
            console.log("Received start-digital message");
            startDigitalPolling();
            break;
          case "start-accelerometer":
            console.log("Received start-accelerometer message");
            startAccelerometerPolling();
            break;
          case "start-gyroscope":
            console.log("Received start-gyro message");
            startGyroPolling();
            break;
          case "start-magnetometer":
            console.log("Received start-magnetometer message");
            startMagnetometerPolling();
            break;
          case "start-button":
            console.log("Received start-button message");
            startButtonPolling();
            break;
          case "stop-all":
            console.log("Received stop-all message");
            stopPolling();
            break;
        }
      } catch (error) {
        console.error("Error handling message: ", error);
      }
    });

    ws.send(JSON.stringify({ analog: latestAnalogValues }));
  } else if (req.url === "/ws/terminal") {
    console.log("WebSocket connection for terminal established");

    if (!pty) pty = require("node-pty");
    if (!os) os = require("os");
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    ptyProcess.on("data", (data) => {
      ws.send(data);
    });

    ws.on("message", (message) => {
      console.log("Received message from terminal:", message);
      ptyProcess.write(message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed for terminal");
      ptyProcess.kill();
    });
  }
});

app.post("/enable-servo", express.json(), (req, res) => {
  const { servo, value } = req.body;

  if (typeof servo !== "number") {
    return res.status(400).json({ error: "Servo type incorrect, need number" });
  }
  if (!servoAddon) servoAddon = require("./build/Release/servo_addon.node");
  try {
    servoAddon.enable_servo(servo);
    servoAddon.set_servo_position(servo, value);

    return res
      .status(200)
      .json({ message: `Servo ${servo} enabled and set to value ${value}` });
  } catch (error) {
    console.error("Error enabling servo:", error);
    res.status(500).json({ error: "Failed to enable servo" });
  }
});

app.post("/disable-all-servos", express.json(), (req, res) => {
  if (!servoAddon) servoAddon = require("./build/Release/servo_addon.node");
  try {
    servoAddon.disable_servos();

    res.status(200).json({ message: `Disabled all servos` });
  } catch (error) {
    console.error("Error disabling all servos:", error);
    res.status(500).json({ error: "Failed to disable all servos" });
  }
});

app.post("/disable-servo", express.json(), (req, res) => {
  const { servo, value } = req.body;
  if (!servoAddon) servoAddon = require("./build/Release/servo_addon.node");
  if (typeof servo !== "number") {
    return res.status(400).json({ error: "Servo type incorrect, need number" });
  }
  try {
    console.log(`Disabling servo: ${servo}`);
    servoAddon.disable_servo(servo);

    res.status(200).json({ message: `Servo ${servo} disable` });
  } catch (error) {
    console.error("Error disabling servo:", error);
    res.status(500).json({ error: "Failed to disable servo" });
  }
});
app.post("/move-servo", express.json(), (req, res) => {
  const { servo, value } = req.body;
  if (!servoAddon) servoAddon = require("./build/Release/servo_addon.node");
  if (typeof servo !== "number") {
    return res.status(400).json({ error: "Servo type incorrect, need number" });
  }

  try {
    servoAddon.set_servo_position(servo, value);
    res.status(200).json({ message: `Servo ${servo} moved to value ${value}` });
  } catch (error) {
    console.error("Error moving servo:", error);
    res.status(500).json({ error: "Failed to move servo" });
  }
});

app.post("/move-motor", express.json(), (req, res) => {
  const { view, motor, value } = req.body;

  if (typeof motor !== "number" || typeof value !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");
  try {
    if (view === "Power") {
      motorAddon.motor_power(motor, value);
    } else if (view === "Velocity") {
      motorAddon.mav(motor, value);
    }

    // Send back a success response
    res.status(200).json({ message: `Motor ${motor} moved to value ${value}` });
  } catch (error) {
    console.error("Error moving motor:", error);
    res.status(500).json({ error: "Failed to move motor" });
  }
});

app.post("/stop-motor", express.json(), (req, res) => {
  const { motor } = req.body;

  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");
  if (typeof motor !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    motorAddon.off(motor);

    // Send back a success response
    res.status(200).json({ message: `Motor ${motor} turned off` });
  } catch (error) {
    console.error("Error turning off motor:", error);
    res.status(500).json({ error: "Failed to turn off motor" });
  }
});

app.post("/stop-all-motors", express.json(), (req, res) => {
  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");
  try {
    motorAddon.allOff();
    res.status(200).json({ message: "All motors turned off" });
  } catch (error) {
    console.error("Error turning off all motors:", error);
    res.status(500).json({ error: "Failed to turn off all motors" });
  }
});

app.post("/clear-motor-position", express.json(), (req, res) => {
  const { motor } = req.body;
  console.log("Clearing motor position for motor:", motor);
  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");
  if (typeof motor !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    motorAddon.clear_motor_position_counter(motor);
    res
      .status(200)
      .json({ message: `Motor ${motor} position counter cleared` });
  } catch (error) {
    console.error("Error clearing motor position:", error);
    res.status(500).json({ error: "Failed to clear motor position" });
  }
});

let motorVelPollingInterval = null;
let motorPosPollingInterval = null;
let servoPosPollingInterval = null;

app.get("/stream-motor-velocities", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");

  motorAddon.reset_all_motors();
  motorVelPollingInterval = setInterval(() => {
    try {
      const data = {
        motor0: motorAddon.get_motor_bemf_vel(0),
        motor1: motorAddon.get_motor_bemf_vel(1),
        motor2: motorAddon.get_motor_bemf_vel(2),
        motor3: motorAddon.get_motor_bemf_vel(3),
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      res.write(`data: ERROR: ${err.toString()}\n\n`);
    }
  }, 500);

  req.on("close", () => {
    console.log("Closing motor velocity stream");
    clearInterval(motorVelPollingInterval);

    res.end();
  });
});

app.get("/stream-motor-positions", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  console.log("Starting motor position stream");
  if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");

  const interval = setInterval(() => {
    // const data = {
    //   motor0: motorAddon.get_motor_position_counter(0),
    //   motor1: motorAddon.get_motor_position_counter(1),
    //   motor2: motorAddon.get_motor_position_counter(2),
    //   motor3: motorAddon.get_motor_position_counter(3),
    // };

    const data = {
      motor0: Math.floor(Math.random() * 1000), // Random number from 0 to 999
      motor1: Math.floor(Math.random() * 1000),
      motor2: Math.floor(Math.random() * 1000),
      motor3: Math.floor(Math.random() * 1000),
    };

    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (res.flush) res.flush();
  }, 500);

  req.on("close", () => {
    clearInterval(interval);
  });
});

app.get("/stream-servo-positions", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (!servoAddon) servoAddon = require("./build/Release/servo_addon.node");
  servoPosPollingInterval = setInterval(() => {
    try {
      const data = {
        0: {
          name: "Servo 0",
          value: servoAddon.get_servo_position(0),
          enable: servoAddon.get_servo_enabled(0),
        },
        1: {
          name: "Servo 1",
          value: servoAddon.get_servo_position(1),
          enable: servoAddon.get_servo_enabled(1),
        },
        2: {
          name: "Servo 2",
          value: servoAddon.get_servo_position(2),
          enable: servoAddon.get_servo_enabled(2),
        },
        3: {
          name: "Servo 3",
          value: servoAddon.get_servo_position(3),
          enable: servoAddon.get_servo_enabled(3),
        },
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);

      if (res.flush) res.flush();
    } catch (err) {
      console.error("Servo polling error:", err);
      res.write(`data: ERROR: ${err.toString()}\n\n`);
    }
  }, 500);

  req.on("close", () => {
    clearInterval(servoPosPollingInterval);
  });
});
let declaredVariables;
app.post("/convert-xml-to-c", express.json(), async (req, res) => {
  const { xml, filePath } = req.body;

  console.log("/convert-xml-to-c received XML:", xml);
  console.log("/convert-xml-to-c filePath:", filePath);
  let finalCode = "";

  try {
    // Parse the XML string into a DOM
    const xmlDoc = parseXml(xml);
    console.log("xml: ", xml);

    // Parse the XML document into blocks
    const blockDetected = xml.includes("block");
    console.log("blockDetected: ", blockDetected);
    const blockNodes = xmlDoc.getElementsByTagName("block");
    if (blockNodes && blockDetected) {
      const topBlocks = Array.from(blockNodes).map(parseBlockXml);

      declaredVariables = new Map();

      finalCode = convertToCode(topBlocks[0]);
      console.log("finalCode: ", finalCode);
      createAndSaveFile(filePath, finalCode);
      return res.status(200).json({
        code: finalCode,
        variables: Array.from(declaredVariables.keys()),
      });
    } else {
      res.json({
        message: "failed",
        error: "No blocks found!",
      });
    }
  } catch (error) {
    console.error("Error parsing XML:", error);
    return res.status(500).json({ error: "Failed to parse XML" });
  }
});

const modules = [
  "wait_for",
  "time",
  "motor",
  "servo",
  "digital",
  "analog",
  "control",
  "operator",
  "data",
];

const operatorMap = {
  true: () => "1",
  false: () => "0",
  add: (a, b) => `${a} + ${b}`,
  subtract: (a, b) => `${a} - ${b}`,
  multiply: (a, b) => `${a} * ${b}`,
  divide: (a, b) => `${a} / ${b}`,
  random: (min, max) => `rand() % (${max} - ${min} + 1) + ${min}`,
  equals: (a, b) => `${a} == ${b}`,
  lt: (a, b) => `${a} < ${b}`,
  gt: (a, b) => `${a} > ${b}`,
  and: (a, b) => `${a} && ${b}`,
  or: (a, b) => `${a} || ${b}`,
  not: (a) => `!${a}`,
  join: (a, b) => {
    const format = (v) => (declaredVariables.has(v) ? v : `"${v}"`);
    return `strcat(${format(a)}, ${format(b)})`;
  },
  letter_of: (a, b) => `strchr(${a}, ${b})`,
  length: (a) => `strlen(${a})`,
  contains: (a, b) => `strstr(${a}, ${b})`,
  mod: (a, b) => `${a} % ${b}`,
  round: (a) => `round(${a})`,
  mathop: (a, b) => {
    if (mathOpMap[a]) {
      return mathOpMap[a](b);
    } else {
      return `/* unknown math operation: ${a} */`;
    }
  },
};

const mathOpMap = {
  abs: (a) => `abs(${a})`,
  floor: (a) => `floor(${a})`,
  ceiling: (a) => `ceil(${a})`,
  sqrt: (a) => `sqrt(${a})`,
  sin: (a) => `sin(${a})`,
  cos: (a) => `cos(${a})`,
  tan: (a) => `tan(${a})`,
  asin: (a) => `asin(${a})`,
  acos: (a) => `acos(${a})`,
  atan: (a) => `atan(${a})`,
  ln: (a) => `log(${a})`,
  log: (a) => `log10(${a})`,
  "e ^": (a) => `exp(${a})`,
  "10 ^": (a) => `pow(10, ${a})`,
};

function getValue(child) {
  if (!child) return null;
  if (child.fields?.TEXT !== undefined) return child.fields.TEXT;
  if (child.fields?.NUM !== undefined) return child.fields.NUM;
  if (child.fields?.VARIABLE !== undefined) return child.fields.VARIABLE;
  return convertToCode(child, 0, true).trim();
}
function extractCategoryAndFunction(type) {
  console.log("Type received:", type);

  for (const module of modules) {
    console.log("Checking module:", module);
    if (type.startsWith(module + "_")) {
      const functionName = type.substring(module.length + 1);
      console.log("Found function:", functionName);
      return { category: module, functionName };
    }
  }

  console.log("No match found for type:", type); // Log if no match was found
  return null;
}

/**
 *
 * @param {*} block - XML block
 * @param {*} indentLevel - Indentation level for the generated code
 * @param {*} asExpression - Whether to treat the block as an expression
 *
 * @returns {string} C code
 */
function convertToCode(block, indentLevel = 1, asExpression = false) {
  const indent = "\t".repeat(indentLevel);
  let categoryName = "";
  let functionName = "";
  let cCode = "";

  let result = extractCategoryAndFunction(block.type);
  if (result) {
    categoryName = result.category;
    functionName = result.functionName;
  }

  if (categoryName === "control") {
    switch (functionName) {
      case "run":
        cCode +=
          "#include <stdio.h>\n#include <kipr/wombat.h>\n\nint main()\n{\n";
        const nextBlock = block.next;
        if (nextBlock) {
          cCode += convertToCode(nextBlock, indentLevel + 1);
        }
        cCode += "\n\treturn 0;\n}\n";
        return cCode;
      case "printf":
        const printText = block.children?.find((child) => child.fields?.TEXT);
        if (printText) {
          cCode += `${indent}printf("${printText.fields.TEXT}\\n");\n`;
        } else {
          cCode += `${indent}/* missing printf text */\n`;
        }
        break;
      case "wait":
        const waitTime = block.children?.find((child) => child.fields?.NUM);
        if (waitTime) {
          cCode += `${indent}msleep(${waitTime.fields.NUM});\n`;
        } else {
          cCode += `${indent}/* missing wait time */\n`;
        }
        break;
      case "repeat":
        const repeatCount = block.children?.find((child) => child.fields?.NUM);
        const repeatSubstack = block.children?.find(
          (child) => child.role === "substack"
        );
        if (repeatCount) {
          cCode += `${indent}for (int i = 0; i < ${repeatCount.fields.NUM}; i++) {\n`;
          if (repeatSubstack) {
            cCode += convertToCode(repeatSubstack, indentLevel + 1);
          } else {
            cCode += `${indent}\t// missing repeat substack\n`;
          }
          cCode += `${indent}}\n`;
        } else {
          cCode += `${indent}/* missing repeat count */\n`;
        }
        break;
      case "forever":
        const foreverSubstack = block.children?.find(
          (child) => child.role === "substack"
        );
        cCode += `${indent}while (1) {\n`;
        if (foreverSubstack) {
          cCode += convertToCode(foreverSubstack, indentLevel + 1);
        } else {
          cCode += `${indent}\t// missing forever substack\n`;
        }
        cCode += `${indent}}\n`;
        break;
      case "if":
        const condition = block.children?.find((c) => c.role === "condition");
        const substack = block.children?.find((c) => c.role === "substack");

        cCode += `${indent}if (`;

        if (condition) {
          cCode += convertToCode(condition, 0, true).trim();
        } else {
          cCode += "/* missing condition */";
        }

        cCode += `) {\n`;

        if (substack) {
          cCode += convertToCode(substack, indentLevel + 1);
        } else {
          cCode += `${indent}\t// missing substack\n`;
        }

        cCode += `${indent}}\n`;
        break;
      case "if_else":
        const conditionElse = block.children?.find(
          (c) => c.role === "condition"
        );
        const substackElse = block.children?.find((c) => c.role === "substack");
        const elseSubstack = block.children?.find(
          (c) => c.role === "substack2"
        );

        cCode += `${indent}if (`;

        if (conditionElse) {
          cCode += convertToCode(conditionElse, 0, true).trim();
        } else {
          cCode += "/* missing condition */";
        }

        cCode += `) {\n`;

        if (substackElse) {
          cCode += convertToCode(substackElse, indentLevel + 1);
        } else {
          cCode += `${indent}\t// missing substack\n`;
        }

        cCode += `${indent}} else {\n`;

        if (elseSubstack) {
          cCode += convertToCode(elseSubstack, indentLevel + 1);
        } else {
          cCode += `${indent}\t// missing else substack\n`;
        }

        cCode += `${indent}}\n`;
        break;
      case "wait_until":
        const waitCondition = block.children?.find(
          (c) => c.role === "condition"
        );

        cCode += `${indent}while (!(`;

        if (waitCondition) {
          cCode += convertToCode(waitCondition, 0, true).trim();
        } else {
          cCode += "/* missing condition */";
        }

        cCode += `);\n`;

        break;
      case "repeat_until":
        const repeatUntilSubstack = block.children?.find(
          (child) => child.role === "substack"
        );
        const repeatUntilCondition = block.children?.find(
          (c) => c.role === "condition"
        );
        cCode += `${indent}do {\n`;

        if (repeatUntilSubstack) {
          cCode += `${indent}${convertToCode(
            repeatUntilSubstack,
            indentLevel + 1,
            true
          ).trim()}`;
        } else {
          cCode += `${indent}\t/* missing substack */\n`;
        }

        cCode += `\n${indent}} while (!(`;

        if (repeatUntilCondition) {
          cCode += `${convertToCode(repeatUntilCondition, 0, true)})); \n`;
        } else {
          cCode += `${indent}\t\t// missing repeat condition\n`;
        }
        break;
    }
  } else if (categoryName === "operator") {
    let op1Value = null;
    let op2Value = null;

    const operand1 = block.children?.find((c) => c.role === "operand1");
    const operand2 = block.children?.find((c) => c.role === "operand2");
    if (operand1 || operand2) {
      op1Value = getValue(operand1) ?? op1Value;
      op2Value = getValue(operand2) ?? op2Value;
    }

    if (!op1Value) {
      const operand = block.children?.find((c) => c.role === "operand");
      op1Value = getValue(operand) ?? op1Value;
    }

    const num1 = block.children?.find((c) => c.role === "num1");
    const num2 = block.children?.find((c) => c.role === "num2");
    if (!op1Value) op1Value = getValue(num1);
    if (!op2Value) op2Value = getValue(num2);

    if (!op1Value) {
      const num = block.children?.find((c) => c.role === "num");
      op1Value = getValue(num);
    }

    const string1 = block.children?.find((c) => c.role === "string1");
    const string2 = block.children?.find((c) => c.role === "string2");
    if (!op1Value) op1Value = getValue(string1);
    if (!op2Value) op2Value = getValue(string2);

    if (!op1Value) {
      const string = block.children?.find((c) => c.role === "string");
      op1Value = getValue(string) ?? op1Value;
    }

    if (!op1Value) op1Value = "/* missing operand1 */";
    if (
      !op2Value &&
      ["add", "subtract", "multiply", "divide", "mod"].includes(functionName)
    ) {
      op2Value = "/* missing operand2 */";
    }

    console.log("op1Value: ", op1Value);
    console.log("op2Value: ", op2Value);
    if (functionName === "random") {
      const rand1 = block.children?.[0]?.fields?.NUM ?? "/* missing min */";
      const rand2 = block.children?.[1]?.fields?.NUM ?? "/* missing max */";
      cCode += `${indent}${operatorMap.random(rand1, rand2)}`;
    } else if (functionName === "mathop") {
      const operator = block.fields?.OPERATOR;
      cCode += `${indent}${operatorMap.mathop(operator, op1Value)}`;
    } else if (operatorMap[functionName]) {
      cCode += `${indent}${operatorMap[functionName](op1Value, op2Value)}`;
    } else {
      cCode += `${indent}/* unknown operator: ${functionName} */`;
    }
  } else if (categoryName === "data") {
    switch (functionName) {
      case "setvariableto":
        const variableName = block.fields?.VARIABLE;
        let variableValue = getValue(block.children?.[0]);

        // Regular expressions to detect expressions and function calls
        const isExpression = /[\+\-\*\/\%\(\)]/.test(variableValue);
        const isFunctionCall = /^[a-zA-Z_][a-zA-Z0-9_]*\s*\(.*\)$/.test(
          variableValue
        );

        if (variableName && variableValue !== undefined) {
          if (!isNaN(variableValue)) {
            // Case for number assignment
            variableValue = parseInt(variableValue);
            if (!declaredVariables.has(variableName)) {
              cCode += `${indent}int ${variableName} = ${variableValue};\n`;
              declaredVariables.set(variableName, "int");
            } else {
              cCode += `${indent}${variableName} = ${variableValue};\n`;
            }
          } else if (isFunctionCall) {
            cCode += `${indent}${variableValue};\n`;
          } else if (isExpression) {
            if (!declaredVariables.has(variableName)) {
              cCode += `${indent}int ${variableName} = ${variableValue};\n`;
              declaredVariables.set(variableName, "int");
            } else {
              cCode += `${indent}${variableName} = ${variableValue};\n`;
            }
          } else {
            // Case for string assignment
            if (!declaredVariables.has(variableName)) {
              cCode += `${indent}char ${variableName}[100] = "${variableValue}";\n`;
              declaredVariables.set(variableName, "char[100]");
            } else {
              cCode += `${indent}${variableName} = "${variableValue}";\n`;
            }
          }
        } else {
          cCode += `${indent}/* missing variable name or value */\n`;
        }
        console.log("declaredVariables: ", declaredVariables);
        break;

      case "changevariableby":
        const changeVariableName = block.fields?.VARIABLE;
        let changeVariableValue = block.children?.[0]?.fields?.NUM;
        if (changeVariableName && changeVariableValue) {
          if (!isNaN(changeVariableValue)) {
            changeVariableValue = parseInt(changeVariableValue);
            cCode += `${indent}${changeVariableName} += ${changeVariableValue};\n`;
          } else {
            cCode += `${indent}/* invalid value for variable: ${changeVariableName} */\n`;
          }
        } else {
          cCode += `${indent}/* missing variable name or value */\n`;
        }
        break;
      case "showvariable":
        const showVariableName = block.fields?.VARIABLE;
        if (showVariableName && declaredVariables.has(showVariableName)) {
          if (declaredVariables.get(showVariableName) === "char[100]") {
            cCode += `${indent}printf("%s: %s\\n", "${showVariableName}", ${showVariableName});\n`;
          } else if (declaredVariables.get(showVariableName) === "int") {
            cCode += `${indent}printf("%s: %d\\n", "${showVariableName}", ${showVariableName});\n`;
          } else {
            cCode += `${indent}/* unknown variable type for: ${showVariableName} */\n`;
          }
        } else {
          cCode += `${indent}/* missing variable name */\n`;
        }
        break;
    }
  } else if (block.shadow && block.fields?.NUM) {
    cCode += block.fields.NUM;
  } else if (block.fields && Object.keys(block.fields).length > 0) {
    const args = (block.children || [])
      .map((child) => convertToCode(child, 0))
      .join(", ");
    cCode += `${indent}${functionName}(${args});\n`;
  } else {
    const args = (block.children || []).map((child) =>
      convertToCode(child, 0, true).trim()
    );
    const call = `${functionName}(${args.join(", ")})`;
    cCode += asExpression ? `${call}` : `${indent}${call};\n`;
  }

  const next = block.next;
  if (next) {
    cCode += convertToCode(next, indentLevel);
  }

  return cCode;
}

// Helper function to get all folders in a directory
async function getAllDirectories(dirPath) {
  try {
    const files = await fs.readdir(dirPath);

    const statPromises = files.map(async (file) => {
      const stats = await fs.stat(path.join(dirPath, file));
      return { file, isDir: stats.isDirectory() };
    });

    const results = await Promise.all(statPromises);
    return results.filter(({ isDir }) => isDir).map(({ file }) => file);
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

//Get all project directories from given path
async function getAllProjectDirectories(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const directories = [];

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        directories.push(file);
      }
    }

    const projects = await Promise.all(
      directories.map(async (dirName) => {
        const projectPath = path.join(dirPath, dirName);

        let projectLanguage = "unknown";
        try {
          const configContent = await fs.readFile(
            path.join(projectPath, ".config.json"),
            "utf8"
          );
          projectLanguage = parseConfig(configContent);
        } catch (err) {
          console.warn(`Missing or invalid config in ${dirName}`);
        }

        const includeFolderFiles = await getFilesInFolder(
          path.join(projectPath, "include")
        );
        const srcFolderFiles = await getFilesInFolder(
          path.join(projectPath, "src")
        );
        const dataFolderFiles = await getFilesInFolder(
          path.join(projectPath, "data")
        );

        return {
          projectName: dirName,
          projectLanguage,
          includeFolderFiles,
          srcFolderFiles,
          dataFolderFiles,
        };
      })
    );
    return projects;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

//Get all files in a folder
async function getFilesInFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    // Filter out any files starting with a dot (.)
    return files.filter((file) => !file.startsWith("."));
  } catch (error) {
    console.error("Error reading folder:", error);
    return [];
  }
}

//Get all files in a directory
async function getAllFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const statPromises = files.map(async (file) => {
      const stats = await fs.stat(path.join(dirPath, file));
      return { file, isFile: stats.isFile() };
    });

    const results = await Promise.all(statPromises);
    return results.filter(({ isFile }) => isFile).map(({ file }) => file);
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

async function getUserInterfaceMode(userName) {
  const userConfigPath = path.join(
    "/home/kipr/Documents/KISS",
    userName,
    ".config.json"
  );

  try {
    await fs.access(userConfigPath); // throws if file doesn't exist

    const configRaw = await fs.readFile(userConfigPath, "utf-8");
    const configData = JSON.parse(configRaw);

    return configData.interfaceMode || null;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        `getUserInterfaceMode: Config file not found for user ${userName}`
      );
    } else {
      console.error("Error reading user config:", error);
    }
    return null;
  }
}

//Set the user interface mode
async function setUserInterfaceMode(userName, newMode) {
  const userConfigPath = `/home/kipr/Documents/KISS/${userName}/.config.json`;
  try {
    await fs.access(userConfigPath); // throws if file doesn't exist

    const configRaw = await fs.readFile(userConfigPath, "utf-8");
    const configData = JSON.parse(configRaw);

    configData.interfaceMode = newMode;

    await fs.writeFile(
      userConfigPath,
      JSON.stringify(configData, null, 2),
      "utf-8"
    );

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

    if (!folderPath) {
      return res
        .status(400)
        .json({ error: "Missing filePath query parameter" });
    }

    try {
      const stats = await fs.stat(folderPath);
      if (!stats.isDirectory()) {
        return res
          .status(400)
          .json({ error: "Provided path is not a directory" });
      }
    } catch (error) {
      console.error("Error in createFolderHandler:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const directories = await getAllDirectories(folderPath);

      res.status(200).json({
        folderPath: folderPath,
        directories,
      });
    } catch (error) {
      console.error("Error in createFolderHandler:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

//Get all files in a directory and zip them
async function getAllUserFiles(directory, zipFolder) {
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (file.isDirectory()) {
      const subFolder = zipFolder.folder(file.name);
      await getAllUserFiles(filePath, subFolder);
    } else {
      const fileContent = await fs.readFile(filePath);
      zipFolder.file(file.name, fileContent);
    }
  }
}

function getFileContents() {
  return async (req, res) => {
    const filePath = req.query.filePath;
    console.log("getFileContents called with filePath:", filePath);

    if (!filePath) {
      return res
        .status(400)
        .json({ error: "Missing filePath query parameter" });
    }

    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return res.status(400).json({ error: "Provided path is not a file" });
      }
    } catch (error) {
      console.error("Error in getFileContents:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const fileContents = await fs.readFile(filePath, "utf-8");

      res.status(200).send(fileContents);
    } catch (error) {
      console.error("Error in getFileContents:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

//Save file contents
function saveFileContents() {
  return async (req, res) => {
    const { filePath, fileContents } = req.body;

    if (!filePath) {
      return res
        .status(400)
        .json({ error: "Missing filePath in request body" });
    }

    if (!fileContents) {
      return res
        .status(400)
        .json({ error: "Missing fileContents in request body" });
    }

    try {
      await fs.writeFile(filePath, fileContents);

      res.status(200).send("File saved successfully");
    } catch (error) {
      console.error("Error in saveFileContents:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
function createAndSaveFile(filePath, fileContents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContents, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        reject(err);
      } else {
        console.log("File saved successfully");
        resolve();
      }
    });
  });
}
//Parse the config JSON
function parseConfig(configContent) {
  try {
    const config = JSON.parse(configContent);
    return (language = config.language || null);
  } catch (error) {
    console.error("Failed to parse config JSON:", error.message);
    return null;
  }
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
}

//Compile code
app.post("/compile-code", async (req, res) => {
  const { userName, projectName, fileName, activeLanguage } = req.body;
  if (!userName || !projectName || !fileName || !activeLanguage) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const env = {
    ...process.env,

    PROJECT_USERNAME: userName,
    PROJECT_NAME: projectName,
    FILE_NAME: fileName,
    ACTIVE_LANGUAGE: activeLanguage,
  };

  execFile("node", ["compiler.js"], { env }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during execution: ${error.message}`);
      return res.status(500).json({
        error: "Compilation execution failed",
        details: error.message,
      });
    }

    if (stderr) {
      console.warn(`Compiler warnings/errors: ${stderr}`);
    }

    // stdout should contain JSON string from compiler.js
    try {
      const result = JSON.parse(stdout);
      console.log("Compiler result:", result);
      if (result.success) {
        return res.json({
          message: "successful",
          error: result.error ? result.error : null,
          warnings: result.warnings || [],
          messages: result.messages || [],
        });
      } else {
        res.json({
          message: "failed",
          error: result.error,
          messages: result.messages || [],
        });
      }
    } catch (parseErr) {
      console.error("Failed to parse compiler output:", parseErr.message);
      return res.status(500).json({ error: "Failed to parse compiler output" });
    }
  });
});

app.post("/initialize-project", async (req, res) => {
  const { userName, projectName, language, interfaceMode } = req.body;
  console.log("Received request body:", req.body);

  // Validate input early
  if (!userName || !projectName || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const jsonDirectory = "/home/kipr/Documents/KISS/users.json";
  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const userConfigPath = path.join(userDirectory, ".config.json");
  const projectDirectory = path.join(userDirectory, projectName);
  const projectConfigPath = path.join(projectDirectory, ".config.json");

  try {
    let data = {};
    try {
      const fileContent = await fs.readFile(jsonDirectory, "utf8");
      data = JSON.parse(fileContent);
    } catch (error) {
      data = {};
    }
    data[userName] = interfaceMode;
    await fs.writeFile(jsonDirectory, JSON.stringify(data, null, 2), "utf8");

    await fs.mkdir(userDirectory, { recursive: true });
    await fs.writeFile(
      userConfigPath,
      JSON.stringify({ userName, interfaceMode }, null, 2),
      "utf-8"
    );

    try {
      await fs.access(projectDirectory);
      return res
        .status(409)
        .json({ error: "Project directory already exists." });
    } catch {
      // Continue to create project
    }

    await fs.mkdir(projectDirectory, { recursive: true });
    await fs.writeFile(
      projectConfigPath,
      JSON.stringify({ projectName, language }, null, 2),
      "utf-8"
    );

    const folders = ["bin", "include", "src", "data"];
    for (const folder of folders) {
      await fs.mkdir(path.join(projectDirectory, folder), { recursive: true });
    }

    const mainFilePath = path.join(
      projectDirectory,
      "src",
      extensions[language] ? `main.${extensions[language]}` : ""
    );

    const templates = {
      c: `#include <stdio.h>\n#include <kipr/wombat.h>\n\nint main()\n{\n  printf("Hello, World!\\n");\n  return 0;\n}\n`,
      cpp: `#include <iostream>\n#include <kipr/wombat.hpp>\n\nint main()\n{\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}\n`,
      python: `#!/usr/bin/python3\nimport os, sys\nsys.path.append("/usr/lib")\nfrom kipr import *\n\nprint('Hello, World!')`,
      graphical: `<xml xmlns="http://www.w3.org/1999/xhtml">
                <variables></variables>
                <block type="control_run" id="Tr7;}P}KM[{|.$;Wo9_1" x="176" y="129">
                  <next>
                    <block type="control_printf" id="*wt6^HnMX#w},]R6)*w}">
                      <value name="STRING">
                        <shadow type="text" id="2R).HZf7nqV:od^Se=3+">
                          <field name="TEXT">Hello, World!</field>
                        </shadow>
                      </value>
                    </block>
                  </next>
                </block>
              </xml>`,
    };

    try {
      await fs.access(mainFilePath);
      console.log(`File ${mainFilePath} already exists.`);
    } catch {
      await fs.writeFile(mainFilePath, templates[language] ?? "", "utf-8");
    }

    console.log("Initial files and folder structure committed.");
    return res.status(200).send("User Project folder created successfully");
  } catch (error) {
    console.error("Error initializing project:", error);
    return res.status(500).send("Error initializing project.");
  }
});

//Delete file
app.post("/delete-file", async (req, res) => {
  const { userName, projectName, fileName, fileType } = req.body;

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
    case "graphical":
      userProjectDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/src`;
      break;
    case "txt":
      userProjectDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/data`;
      break;
    default:
      return res.status(400).json({ error: "Invalid file type." });
  }

  const filePath = path.join(userProjectDirectory, fileName);

  try {
    // Check if the file exists
    await fs.access(filePath);
    console.log("File exists and is accessible.");

    //Delete file
    await fs.rm(filePath);
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

//Delete project
app.post("/delete-project", async (req, res) => {
  const { userName, projectName } = req.body;

  if (!userName || !projectName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  const projectDirectory = path.join(userDirectory, projectName);

  try {
    // Check if the project directory exists
    await fs.access(projectDirectory);

    // Recursively delete the entire project directory
    await fs.rm(projectDirectory, { recursive: true, force: true });

    console.log(`Deleted project directory: ${projectDirectory}`);

    res.status(200).send("Repository deleted successfully.");
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send("Error deleting repository.");
  }
});

//Delete user
app.post("/delete-user", async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  const jsonPath = "/home/kipr/Documents/KISS/users.json";
  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;

  try {
    await fs.access(jsonPath);

    const existingData = JSON.parse(await fs.readFile(jsonPath, "utf8"));

    if (!existingData[userName]) {
      return res.status(404).json({ error: "User not found in users.json." });
    }

    delete existingData[userName];

    await fs.writeFile(jsonPath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error("Error deleting from users.json:", error);
    return res.status(500).json({ error: "Error deleting from users.json." });
  }

  try {
    // Check if the project directory exists
    await fs.access(userDirectory);

    // Recursively delete the entire userDirectory directory
    await fs.rm(userDirectory, { recursive: true, force: true });

    console.log(`Deleted userDirectory directory: ${userDirectory}`);

    res.status(200).send("Repository deleted successfully.");
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send("Error deleting repository.");
  }
});

//Download zip
app.post("/download-zip", async (req, res) => {
  const { userName, projectName, fileName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "UserName is required" });
  }

  const userDirectory = `/home/kipr/Documents/KISS/${userName}`;
  // Check if the directory exists

  try {
    await fs.access(userDirectory);

    if (fileName) {
      const [name, extension] = fileName.split(".");
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

      await fs.access(filePath);

      const fileContents = await fs.readFile(filePath, "utf-8");

      const extname = path.extname(fileName).toLowerCase();
      let contentType = "text/plain"; // Default to plain text
      if (extname === ".json") {
        contentType = "application/json"; // If it's a JSON file
      } else if (extname === ".html") {
        contentType = "text/html"; // If it's an HTML file
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      res.status(200).send(fileContents);

      return;
    } else if (projectName) {
      const projectDirectory = path.join(userDirectory, projectName);
      // Check if the project directory exists
      await fs.access(projectDirectory);
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

//Get all file names in a directory
app.get("/get-all-file-names", async (req, res) => {
  try {
    const dirPath = req.query.dirPath;

    if (!dirPath) {
      return res.status(400).json({ error: "Directory path is required" });
    }

    // Directories to check
    const allowedDirs = ["src", "include", "data"];

    const getAllFileNames = async (dir) => {
      let fileNames = [];

      // Read the contents of the directory
      const files = await fs.readdir(dir);
      console.log("/get-all-file-names - Reading directory:", dir);
      console.log("Files found:", files);

      console.log("getAllFileNames: ", files);
      return files;
    };

    const allFileNames = await getAllFileNames(dirPath);
    console.log("All file names found:", allFileNames);

    // Send the list of file names as the response
    res.status(200).json({
      fileNames: allFileNames,
    });
  } catch (error) {
    console.error("Error getting file names:", error);
    res.status(500).send("Error getting file names");
  }
});

//Get project language
app.get("/get-project-language", async (req, res) => {
  try {
    const gitConfigPath = path.join(req.query.filePath, ".git/config");

    //check if .git/config exists
    await fs.access(gitConfigPath);

    const language = parseConfig(await fs.readFile(gitConfigPath, "utf8"));

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
    const allEntries = await fs.readdir("/home/kipr/Documents/KISS");

    //Filter out users.json
    const userDirectories = [];
    for (const file of allEntries) {
      const filePath = path.join("/home/kipr/Documents/KISS", file);
      if (
        file !== "users.json" &&
        !file.startsWith(".") &&
        (await fs.stat(filePath)).isDirectory()
      ) {
        userDirectories.push(file);
      }
    }
    console.log("User directories: ", userDirectories);

    const users = await Promise.all(
      userDirectories.map(async (user) => {
        const userInterfaceMode = await getUserInterfaceMode(user);
        const userDirectory = `/home/kipr/Documents/KISS/${user}`;
        const projects = getAllProjectDirectories(userDirectory);

        return {
          userName: user,
          interfaceMode: userInterfaceMode || "Simple",
          projects: projects,
        };
      })
    );

    // Send the list of users as the response
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).send("Error getting users");
  }
});

// Get all users
app.get("/get-users", createFolderHandler());

// Project getterss
app.get("/get-projects", createFolderHandler());
app.get("/get-project-folders", createFolderHandler());

app.get("/get-project-data", async (req, res) => {
  try {
    const projectDirectory = req.query.filePath;
    const projectConfigPath = path.join(projectDirectory, ".config.json");
    const language = parseConfig(await fs.readFile(projectConfigPath, "utf8"));

    const includeData = await getAllFiles(
      path.join(projectDirectory, "include")
    );
    const srcData = await getAllFiles(path.join(projectDirectory, "src"));
    const userFileData = await getAllFiles(path.join(projectDirectory, "data"));

    const filteredIncludeData = includeData.filter(
      (file) => !file.startsWith(".")
    );
    const filteredSrcData = srcData.filter(
      (file) => !file.startsWith(".") && !file.startsWith("xmlToC.c")
    );
    const filteredUserFileData = userFileData.filter(
      (file) => !file.startsWith(".")
    );

    const projectData = {
      projectLanguage: language,
      includeData: filteredIncludeData,
      srcData: filteredSrcData,
      userFileData: filteredUserFileData,
    };

    console.log("Project data:", projectData);

    res.status(200).json(projectData);
  } catch (error) {
    console.error("Error getting project data:", error);
    res.status(500).send("Error getting project data");
  }
});

// File content getters
app.get("/get-file-contents", getFileContents());

//File content setters
app.post("/save-file-content", saveFileContents());

//Change interface mode
app.post("/change-interface-mode", (req, res) => {
  const { userName, newMode } = req.body;

  if (!userName || !newMode) {
    return res.status(400).json({ error: "Missing userName or newMode" });
  }

  const success = setUserInterfaceMode(userName, newMode);

  if (success) {
    res.json({
      message: `Interface mode updated to ${newMode} for ${userName}`,
    });
  } else {
    res.status(500).json({ error: "Failed to update interface mode" });
  }
});

//Rename user, project, or file
app.post("/rename", async (req, res) => {
  const defaultDirectory = `/home/kipr/Documents/KISS`;
  const usersJsonPath = path.join(defaultDirectory, "users.json");
  console.log("usersJsonPath:", usersJsonPath);

  if (req.body.renameType === "User") {
    try {
      const oldUserDirectory = path.join(
        defaultDirectory,
        req.body.oldUserName
      );
      const desiredUserDirectory = path.join(
        defaultDirectory,
        req.body.newUserName
      );
      // Check if the new desired user directory already exists

      try {
        await fs.access(desiredUserDirectory);
        // If no error, the path exists
        return res
          .status(409)
          .json({ error: "Project directory already exists" });
      } catch (err) {
        // Path does NOT exist — continue
      }
      // Rename the user directory asynchronously
      await fs.rename(oldUserDirectory, desiredUserDirectory);

      console.log(
        `Renamed user directory: ${oldUserDirectory} to ${desiredUserDirectory}`
      );

      const data = await fs.readFile(usersJsonPath, "utf8");
      let usersData = JSON.parse(data);
      console.log("Current users data:", usersData);
      // Update the user entry
      if (usersData[req.body.oldUserName]) {
        usersData[req.body.newUserName] = usersData[req.body.oldUserName];
        delete usersData[req.body.oldUserName];
        console.log("Preparing to write to users.json...");
        console.log("Path:", usersJsonPath);
        console.log("Data:", JSON.stringify(usersData, null, 2));
        await fs.writeFile(
          usersJsonPath,
          JSON.stringify(usersData, null, 2),
          "utf8"
        );
      } else {
        console.warn(`User ${req.body.oldUserName} not found in users.json.`);
      }

      res.status(200).json({
        message: "User renamed successfully",
        oldUserName: req.body.oldUserName,
        newUserName: req.body.newUserName,
        path: desiredUserDirectory,
      });
    } catch (error) {
      console.error("Error renaming user:", error);
      res.status(500).send("Error renaming user.");
    }
  } else if (req.body.renameType === "Project") {
    try {
      const userDirectory = path.join(defaultDirectory, req.body.userName);
      const oldProjectDirectory = path.join(
        userDirectory,
        req.body.oldProjectName
      );
      const newProjectDirectory = path.join(
        userDirectory,
        req.body.newProjectName
      );
      // Check if the project directory exists
      await fs.access(oldProjectDirectory);

      try {
        await fs.access(newProjectDirectory);
        // If no error, the path exists
        return res
          .status(409)
          .json({ error: "Project directory already exists" });
      } catch (err) {
        //continue
      }
      await fs.rename(oldProjectDirectory, newProjectDirectory);

      console.log(
        `Renamed project directory: ${oldProjectDirectory} to ${newProjectDirectory}`
      );

      res.status(200).json({
        message: "Project renamed successfully.",
        oldProjectName: req.body.oldProjectName,
        newProjectName: req.body.newProjectName,
        userName: req.body.userName,
        path: newProjectDirectory,
      });
    } catch (error) {
      console.error("Error renaming project:", error);
      res.status(500).send("Error renaming project.");
    }
  } else if (req.body.renameType === "File") {
    try {
      const [file, extension] = req.body.oldFileName.split(".");
      const userDirectory = path.join(defaultDirectory, req.body.userName);
      const projectDirectory = path.join(userDirectory, req.body.projectName);
      let oldFilePath = "";
      let newFilePath = "";
      switch (extension) {
        case "h":
          oldFilePath = path.join(
            projectDirectory,
            `include/${req.body.oldFileName}`
          );
          newFilePath = path.join(
            projectDirectory,
            `include/${req.body.newFileName}`
          );
          break;
        case "c":
        case "cpp":
        case "py":
          oldFilePath = path.join(
            projectDirectory,
            `src/${req.body.oldFileName}`
          );
          newFilePath = path.join(
            projectDirectory,
            `src/${req.body.newFileName}`
          );
          break;
        case "txt":
          oldFilePath = path.join(
            projectDirectory,
            `data/${req.body.oldFileName}`
          );
          newFilePath = path.join(
            projectDirectory,
            `data/${req.body.newFileName}`
          );
          break;
      }

      await fs.access(oldFilePath);

      try {
        await fs.access(newFilePath);
        // If no error, the path exists
        return res
          .status(409)
          .json({ error: "Project directory already exists" });
      } catch (err) {
        //continue
      }

      await fs.rename(oldFilePath, newFilePath);

      console.log(`Renamed file: ${oldFilePath} to ${newFilePath}`);

      res.status(200).json({
        message: "File renamed successfully",
        oldFileName: req.body.oldFileName,
        newFileName: req.body.newFileName,
        projectName: req.body.projectName,
        userName: req.body.userName,
        path: newFilePath,
      });
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  }
});

let currentChild = null;

// Run code
app.get("/run-code", (req, res) => {
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
    case "graphical":
      runCommand = `"${bin_directory}/botball_user_program"`;

      break;
    case "python":
      runCommand = `/bin/bash -c 'export PYTHONPATH=/usr/local/lib && python3 "${bin_directory}/botball_user_program"'`;
      break;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("Executing:", runCommand);

  // const child = spawn(runCommand, [], { shell: true, env: { ...process.env, PYTHONPATH: "/usr/local/lib" } });
  const child = spawn("stdbuf", ["-oL", runCommand], {
    shell: true,
    detached: true,
  });
  currentChild = child;
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
    currentChild = null;
    if (motorPosPollingInterval) {
      clearInterval(motorPosPollingInterval);
      motorPosPollingInterval = null;
    }
    if (motorVelPollingInterval) {
      clearInterval(motorVelPollingInterval);
      motorVelPollingInterval = null;
    }
    console.log(`Process exited with code ${code}`);
    res.write(`data: Process exited with code ${code}\n\n`);
    res.write("event: end\ndata: END\n\n");
    res.flush?.();
    res.end();
  });
});

// Stop code
app.post("/stop-code", (req, res) => {
  if (currentChild) {
    if (!motorAddon) motorAddon = require("./build/Release/motor_addon.node");
    try {
      process.kill(-currentChild.pid, "SIGKILL"); // Use negative PID to kill the group
      try {
        motorAddon.allOff(); // or motorAddon.off(0), etc.
        console.log("Motors stopped via addon.");
      } catch (motorErr) {
        console.error("Failed to stop motors:", motorErr);
      }

      res.send("Execution stopped");
    } catch (err) {
      console.error("Failed to stop process:", err);
      res.status(500).send("Failed to stop execution");
    }
    currentChild = null;
  } else {
    res.status(400).send("No process running");
  }
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

// app.use(
//   "/dist",
//   express.static(`${__dirname}/dist`, {
//     setHeaders: setCrossOriginIsolationHeaders,
//   })
// );

// app.use(
//   express.static(sourceDir, {
//     maxAge: config.caching.staticMaxAge,
//     setHeaders: setCrossOriginIsolationHeaders,
//   })
// );

app.use((req, res) => {
  setCrossOriginIsolationHeaders(res);
  res.sendFile(`${__dirname}/${sourceDir}/index.html`);
});
app.use(
  "/",
  expressStaticGzip(path.join(__dirname, "dist"), {
    enableBrotli: true, // serve .br files if available
    orderPreference: ["br", "gz"],
    setHeaders: (res, filePath) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

      if (/\.[0-9a-f]{8,}\.min\.(js|css|br|gz)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  })
);
server.listen(config.server.port, "0.0.0.0", () => {
  console.log(
    `Express and WebSocket server started: http://localhost:${config.server.port}`
  );
  console.log(`Serving content from /${sourceDir}/`);
});
