#!/usr/bin/env node
// Starts the local portable MySQL instance used for development on this machine.
// The Windows "MySQL93" service that used to back DATABASE_URL had its binaries
// deleted (bin/ was empty) while the service registration survived, so local dev
// now runs a self-contained MySQL under the user's home directory instead of a
// Windows service — no admin rights required to start/stop it.
const { spawn } = require("child_process");
const net = require("net");
const fs = require("fs");
const path = require("path");

const MYSQL_HOME =
  process.env.MYSQL_PORTABLE_HOME ||
  "C:\\Users\\abdou\\mysql-portable\\mysql-9.3.0-winx64";
const DATA_DIR = process.env.MYSQL_PORTABLE_DATA || "C:\\Users\\abdou\\mysql-portable\\data";
const PORT = Number(process.env.MYSQL_PORTABLE_PORT || 3306);
const PID_FILE = path.join(__dirname, ".mysql-portable.pid");
const LOG_FILE = path.join(__dirname, ".mysql-portable.log");

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForPort(port, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortOpen(port)) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  if (await isPortOpen(PORT)) {
    console.log(`[db-start] MySQL already listening on port ${PORT}.`);
    return;
  }

  const mysqldPath = path.join(MYSQL_HOME, "bin", "mysqld.exe");
  if (!fs.existsSync(mysqldPath)) {
    console.error(`[db-start] mysqld.exe not found at ${mysqldPath}`);
    console.error("Set MYSQL_PORTABLE_HOME if the portable MySQL install lives elsewhere.");
    process.exit(1);
  }

  const out = fs.openSync(LOG_FILE, "a");
  const child = spawn(
    mysqldPath,
    [
      "--no-defaults",
      `--datadir=${DATA_DIR}`,
      `--basedir=${MYSQL_HOME}`,
      `--port=${PORT}`,
      "--standalone",
    ],
    { detached: true, stdio: ["ignore", out, out] }
  );
  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid));

  console.log(`[db-start] Starting MySQL (pid ${child.pid}), logging to ${LOG_FILE} ...`);
  const ready = await waitForPort(PORT, 20000);
  if (!ready) {
    console.error(`[db-start] MySQL did not open port ${PORT} within 20s. Check ${LOG_FILE}.`);
    process.exit(1);
  }
  console.log(`[db-start] MySQL is up on port ${PORT}.`);
}

main();
