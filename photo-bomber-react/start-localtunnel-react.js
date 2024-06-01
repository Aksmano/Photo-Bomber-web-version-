import { exec } from "child_process";
import localtunnel from "localtunnel";
import { publicIpv4 } from "public-ip";

// Function to start the frontend server
function startFrontendServer() {
  const serveProcess = exec(
    "serve -s dist -l 3000",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting frontend server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Frontend server stderr: ${stderr}`);
        return;
      }
      console.log(`Frontend server stdout: ${stdout}`);
    }
  );

  return serveProcess;
}

// Function to start localtunnel
async function startTunnel(port) {
  const tunnel = await localtunnel({ port });
  const publicIp = await publicIpv4();

  console.log(`Frontend is publicly accessible at: ${tunnel.url}`);
  console.log(`Password for website: ${publicIp}`);
}

// Start the frontend server and tunnel
const frontendPort = 3000; // Adjust to your frontend port
startFrontendServer();
setTimeout(() => startTunnel(frontendPort), 2000);
