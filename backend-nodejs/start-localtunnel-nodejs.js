const { exec } = require("child_process");
const localtunnel = require("localtunnel");
const fs = require("fs");

const directoryPath = "../frontend-react/dist";
const serverSettings = {};

// Function to start the server
const startServer = () => {
  const serverProcess = exec("node dist/server.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Server stderr: ${stderr}`);
      return;
    }
    console.log(`Server stdout: ${stdout}`);
  });

  return serverProcess;
};

// Function to start localtunnel
const startTunnel = async (port) => {
  const tunnel = await localtunnel({ port });
  serverSettings.backendUrl = tunnel.url;

  console.log(`Server is publicly accessible at: ${tunnel.url}`);
  fs.writeFileSync(
    `${directoryPath}/backend-settings.json`,
    JSON.stringify(serverSettings)
  );

  tunnel.on("close", () => {
    console.log("Tunnel closed");
  });
};

// Start the server and tunnel
const serverPort = 5000; // Adjust to your server port
startServer();
startTunnel(serverPort);
