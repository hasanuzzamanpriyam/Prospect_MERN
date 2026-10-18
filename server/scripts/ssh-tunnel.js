const { Client } = require("ssh2");
const net = require("net");

const SSH_CONFIG = {
  host: "109.199.103.178",
  username: "root",
  password: "nEwRoo7t",
  readyTimeout: 30000,
  keepaliveInterval: 10000,
  keepaliveCountMax: 10,
};

const TUNNELS = [
  { localPort: 27017, remoteHost: "127.0.0.1", remotePort: 27017, name: "MongoDB" },
  { localPort: 9100,  remoteHost: "127.0.0.1", remotePort: 9200,  name: "Elasticsearch" },
];

function createTunnel(conn, { localPort, remoteHost, remotePort, name }) {
  const server = net.createServer((localSocket) => {
    conn.forwardOut("127.0.0.1", localPort, remoteHost, remotePort, (err, remoteStream) => {
      if (err) {
        console.error(`[${name}] forwardOut error:`, err.message);
        localSocket.end();
        return;
      }
      localSocket.pipe(remoteStream).pipe(localSocket);
    });
  });

  server.listen(localPort, "127.0.0.1", () => {
    console.log(`[${name}] Tunnel: 127.0.0.1:${localPort} → ${remoteHost}:${remotePort}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[${name}] Port ${localPort} already in use — skipping`);
    } else {
      console.error(`[${name}] Server error:`, err.message);
    }
  });

  return server;
}

const conn = new Client();

conn.on("ready", () => {
  console.log("SSH connected to", SSH_CONFIG.host);
  const servers = TUNNELS.map((t) => createTunnel(conn, t));
  console.log("All tunnels established. Press Ctrl+C to stop.");
});

conn.on("error", (err) => {
  console.error("SSH connection error:", err.message);
  process.exit(1);
});

conn.on("close", () => {
  console.log("SSH connection closed.");
  process.exit(0);
});

conn.connect(SSH_CONFIG);

process.on("SIGINT", () => {
  console.log("\nShutting down tunnels...");
  conn.end();
});
