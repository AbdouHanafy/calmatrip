#!/usr/bin/env node
// Stops the portable MySQL instance started by scripts/db-start.js.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PID_FILE = path.join(__dirname, ".mysql-portable.pid");

if (!fs.existsSync(PID_FILE)) {
  try {
    execSync("docker stop calmatrip-mysql", { stdio: "inherit" });
    process.exit(0);
  } catch {
    // no docker container either
  }
  console.log("[db-stop] No pid file found — is MySQL running via db-start?");
  process.exit(0);
}

const pid = fs.readFileSync(PID_FILE, "utf8").trim();
try {
  execSync(`taskkill /PID ${pid} /T /F`, { stdio: "inherit" });
} catch (err) {
  console.error(`[db-stop] Could not stop pid ${pid} (it may already be gone).`);
}
fs.unlinkSync(PID_FILE);
console.log("[db-stop] Stopped.");
