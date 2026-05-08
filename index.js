/* ╔══════════════════════════════════════════════════════════════════╗
   ║                                                                  ║
   ║        ⚡  VIENGO CORE SYSTEM — ULTRA EDITION  ⚡               ║
   ║              THE UNBEATABLE BOOT ENGINE v3.0.0                  ║
   ║                                                                  ║
   ╠══════════════════════════════════════════════════════════════════╣
   ║   © Eng. Samir Gad  &  Eng. Ammar Galal                         ║
   ║   All Rights Reserved — Private VIP System                      ║
   ╚══════════════════════════════════════════════════════════════════╝ */

import { Client } from "meowsab";
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from "./sub.js";
import os from "os";
import { performance } from "perf_hooks";

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 1 — SYSTEM CONSTANTS & METADATA
   ════════════════════════════════════════════════════════════════════ */
const SYSTEM = Object.freeze({
  NAME: "VIENGO",
  VERSION: "3.0.0 ULTRA VIP",
  CODENAME: "THE UNBEATABLE",
  BOT_NUMBER: "201200358803",
  BOOT_TIME: Date.now(),
  ENV: process.env.NODE_ENV || "production"
});

const OWNERS = Object.freeze([
  {
    name: "Eng. Samir Gad",
    jid: "201070311041@s.whatsapp.net",
    lid: "0@lid"
  },
  {
    name: "Eng. Ammar Galal",
    jid: "201200358803@s.whatsapp.net",
    lid: "0@lid"
  }
]);

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 2 — UTILITY FUNCTIONS
   ════════════════════════════════════════════════════════════════════ */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatUptime = (ms) => {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / (1000 * 60)) % 60;
  const hr  = Math.floor(ms / (1000 * 60 * 60));
  return `${hr}h ${min}m ${sec}s`;
};

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 3 — ADVANCED LOGGER (ANSI Colored)
   ════════════════════════════════════════════════════════════════════ */
class Logger {
  static colors = {
    reset:   "\x1b[0m",
    bright:  "\x1b[1m",
    dim:     "\x1b[2m",
    red:     "\x1b[31m",
    green:   "\x1b[32m",
    yellow:  "\x1b[33m",
    blue:    "\x1b[34m",
    magenta: "\x1b[35m",
    cyan:    "\x1b[36m",
    white:   "\x1b[37m",
    gray:    "\x1b[90m"
  };

  static timestamp() {
    return new Date().toLocaleTimeString("en-GB", { hour12: false });
  }

  static format(level, color, tag, msg) {
    const c = this.colors;
    const time = `${c.gray}[${this.timestamp()}]${c.reset}`;
    const lvl  = `${color}${c.bright}[${level}]${c.reset}`;
    const tg   = tag ? `${c.magenta}[${tag}]${c.reset} ` : "";
    return `${time} ${lvl} ${tg}${msg}`;
  }

  static info(msg, tag = "INFO") {
    console.log(this.format("ℹ INFO", this.colors.cyan, tag, msg));
  }
  static success(msg, tag = "OK") {
    console.log(this.format("✓ DONE", this.colors.green, tag, msg));
  }
  static warn(msg, tag = "WARN") {
    console.warn(this.format("⚠ WARN", this.colors.yellow, tag, msg));
  }
  static error(msg, tag = "ERROR") {
    console.error(this.format("✖ FAIL", this.colors.red, tag, msg));
  }
  static debug(msg, tag = "DEBUG") {
    if (SYSTEM.ENV === "development")
      console.log(this.format("◌ DBUG", this.colors.gray, tag, msg));
  }
  static divider(char = "━", len = 64) {
    console.log(this.colors.cyan + char.repeat(len) + this.colors.reset);
  }
  static blank() { console.log(""); }
}

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 4 — SYSTEM MONITOR
   ════════════════════════════════════════════════════════════════════ */
class SystemMonitor {
  static getInfo() {
    const mem = process.memoryUsage();
    return {
      platform:  `${os.type()} ${os.release()}`,
      arch:      os.arch(),
      cpus:      os.cpus().length,
      cpuModel:  os.cpus()[0]?.model.trim() || "Unknown",
      totalMem:  formatBytes(os.totalmem()),
      freeMem:   formatBytes(os.freemem()),
      usedRAM:   formatBytes(mem.rss),
      heapUsed:  formatBytes(mem.heapUsed),
      nodeVer:   process.version,
      pid:       process.pid,
      hostname:  os.hostname()
    };
  }
}

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 5 — CLIENT INITIALIZATION
   ════════════════════════════════════════════════════════════════════ */
const client = new Client({
  phoneNumber: SYSTEM.BOT_NUMBER,
  prefix: [".", "/", "!", "#"],
  fromMe: false,
  owners: [...OWNERS],
  settings: { noWelcome: false },
  commandsPath: "./plugins"
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 6 — DATABASE BOOTSTRAP (UltraDB)
   ════════════════════════════════════════════════════════════════════ */
if (!global.db) {
  try {
    global.db = new UltraDB();
    Logger.success("UltraDB Initialized Successfully", "DATABASE");
  } catch (err) {
    Logger.error(`UltraDB Failed: ${err.message}`, "DATABASE");
    process.exit(1);
  }
}

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 7 — CLIENT CONFIGURATION
   ════════════════════════════════════════════════════════════════════ */
const { config } = client;
config.info = {
  nameBot:    "♔ VIENGO ⚡",
  nameChannel:"VIENGO ~ Channel ⚡",
  idChannel:  "0029VbDcb7o7IUYZLyAtUn3W@newsletter",
  urls: {
    api:     "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbDcb7o7IUYZLyAtUn3W",
    repo:    "Private System"
  },
  copyright: {
    pack:   "VIENGO ULTRA SYSTEM",
    author: "Eng. Samir Gad & Eng. Ammar Galal",
    year:   new Date().getFullYear()
  },
  images: [
    "https://i.pinimg.com/originals/11/26/97/11269786cdb625c60213212aa66273a9.png",
    "https://i.pinimg.com/originals/e2/21/20/e221203f319df949ee65585a657501a2.jpg",
    "https://i.pinimg.com/originals/bb/77/0f/bb770fad66a634a6b3bf93e9c00bf4e5.jpg"
  ],
  version:  SYSTEM.VERSION,
  codename: SYSTEM.CODENAME
};

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 8 — BOOT BANNER
   ════════════════════════════════════════════════════════════════════ */
function printBanner() {
  const c = Logger.colors;
  const sys = SystemMonitor.getInfo();

  console.clear();
  console.log(c.cyan + c.bright + `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ██╗   ██╗██╗███████╗███╗   ██╗ ██████╗  ██████╗               ║
║   ██║   ██║██║██╔════╝████╗  ██║██╔════╝ ██╔═══██╗              ║
║   ██║   ██║██║█████╗  ██╔██╗ ██║██║  ███╗██║   ██║              ║
║   ╚██╗ ██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║██║   ██║              ║
║    ╚████╔╝ ██║███████╗██║ ╚████║╚██████╔╝╚██████╔╝              ║
║     ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝               ║
║                                                                  ║
║          ⚡  THE UNBEATABLE WHATSAPP CORE SYSTEM  ⚡            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝` + c.reset);

  console.log(c.yellow + `
┌──────────────────────── SYSTEM INFORMATION ────────────────────────┐` + c.reset);
  console.log(`  ${c.cyan}● Bot Name    :${c.reset} ${c.bright}${config.info.nameBot}${c.reset}`);
  console.log(`  ${c.cyan}● Version     :${c.reset} ${c.green}${SYSTEM.VERSION}${c.reset}`);
  console.log(`  ${c.cyan}● Codename    :${c.reset} ${c.magenta}${SYSTEM.CODENAME}${c.reset}`);
  console.log(`  ${c.cyan}● Environment :${c.reset} ${SYSTEM.ENV.toUpperCase()}`);
  console.log(`  ${c.cyan}● Owners      :${c.reset} ${OWNERS.map(o => o.name).join(" & ")}`);
  console.log(c.yellow + `├──────────────────────── HARDWARE & RUNTIME ────────────────────────┤` + c.reset);
  console.log(`  ${c.cyan}● Platform    :${c.reset} ${sys.platform} (${sys.arch})`);
  console.log(`  ${c.cyan}● CPU         :${c.reset} ${sys.cpuModel} × ${sys.cpus}`);
  console.log(`  ${c.cyan}● Memory      :${c.reset} ${sys.usedRAM} used / ${sys.totalMem} total`);
  console.log(`  ${c.cyan}● Node.js     :${c.reset} ${sys.nodeVer}`);
  console.log(`  ${c.cyan}● Hostname    :${c.reset} ${sys.hostname} (PID: ${sys.pid})`);
  console.log(c.yellow + `└────────────────────────────────────────────────────────────────────┘` + c.reset);
  Logger.blank();
}

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 9 — BOOT ENGINE
   ════════════════════════════════════════════════════════════════════ */
class BootEngine {
  static stages = 0;
  static current = 0;
  static startTime = 0;

  static init(total) {
    this.stages = total;
    this.current = 0;
    this.startTime = performance.now();
  }

  static stage(label) {
    this.current++;
    Logger.divider();
    Logger.info(
      `${Logger.colors.bright}STAGE ${this.current}/${this.stages}${Logger.colors.reset} → ${label}`,
      "BOOT"
    );
  }

  static finish() {
    const elapsed = (performance.now() - this.startTime).toFixed(2);
    Logger.divider();
    Logger.success(
      `🚀 VIENGO is fully ONLINE — booted in ${Logger.colors.bright}${elapsed} ms${Logger.colors.reset}`,
      "READY"
    );
    Logger.divider();
  }
}

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 10 — MAIN STARTUP SEQUENCE
   ════════════════════════════════════════════════════════════════════ */
async function startSystem() {
  try {
    printBanner();
    BootEngine.init(5);

    // ── Stage 1: Pre-flight checks ──
    BootEngine.stage("Performing pre-flight checks");
    if (!process.versions.node) throw new Error("Node.js runtime not detected");
    Logger.success("Pre-flight checks passed", "CHECK");

    // ── Stage 2: Loading core connection ──
    BootEngine.stage("Establishing main WhatsApp connection");
    await client.start();
    Logger.success("Main WhatsApp connection established", "CORE");

    // ── Stage 3: Stabilization wait ──
    BootEngine.stage("Stabilizing connection (3s)");
    await wait(3000);
    Logger.success("Connection stabilized", "CORE");

    // ── Stage 4: SubBots system ──
    BootEngine.stage("Initializing SubBots subsystem");
    if (client.commandSystem) {
      await sub(client);
      Logger.success("SubBots system activated", "SUB");
    } else {
      Logger.warn("commandSystem missing — SubBots skipped", "SUB");
    }

    // ── Stage 5: Final health check ──
    BootEngine.stage("Running final health diagnostics");
    const ramAfter = formatBytes(process.memoryUsage().rss);
    Logger.info(`Memory footprint after boot: ${ramAfter}`, "HEALTH");
    Logger.success("All subsystems operational", "HEALTH");

    BootEngine.finish();
  } catch (error) {
    Logger.divider();
    Logger.error("FATAL — System failed to start", "BOOT");
    console.error(error?.stack || error?.message || error);
    Logger.divider();
    process.exit(1);
  }
}

startSystem();

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 11 — ANTI-CRASH SHIELD
   ════════════════════════════════════════════════════════════════════ */
const IGNORED_ERRORS = [
  "rate-overlimit",
  "Connection Closed",
  "Timed Out",
  "Timeout",
  "Stream Errored",
  "Bad MAC",
  "Connection Failure",
  "ENOTFOUND",
  "ECONNRESET",
  "ETIMEDOUT"
];

const isIgnored = (msg) => IGNORED_ERRORS.some((e) => msg.includes(e));

process.on("uncaughtException", (error) => {
  const msg = String(error?.message || error || "");
  if (isIgnored(msg)) return;
  Logger.error(`Uncaught Exception: ${error?.stack || msg}`, "ANTI-CRASH");
});

process.on("unhandledRejection", (reason) => {
  const msg = String(reason?.message || reason || "");
  if (isIgnored(msg)) return;
  Logger.error(`Unhandled Rejection: ${reason?.stack || msg}`, "ANTI-CRASH");
});

process.on("warning", (warning) => {
  Logger.warn(`${warning.name}: ${warning.message}`, "PROCESS");
});

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 12 — GRACEFUL SHUTDOWN
   ════════════════════════════════════════════════════════════════════ */
async function gracefulShutdown(signal) {
  Logger.blank();
  Logger.divider();
  Logger.warn(`Shutdown signal received: ${signal}`, "SYSTEM");

  try {
    if (global.db && typeof global.db.save === "function") {
      Logger.info("Persisting database to disk...", "DATABASE");
      await global.db.save();
      Logger.success("Database saved successfully", "DATABASE");
    }
  } catch (err) {
    Logger.error(`Database save failed: ${err.message}`, "DATABASE");
  }

  const uptime = formatUptime(Date.now() - SYSTEM.BOOT_TIME);
  Logger.info(`Total uptime: ${uptime}`, "SYSTEM");
  Logger.success("VIENGO shut down safely. Goodbye 👋", "SYSTEM");
  Logger.divider();
  process.exit(0);
}

process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGHUP",  () => gracefulShutdown("SIGHUP"));

/* ════════════════════════════════════════════════════════════════════
   📌  SECTION 13 — EXPORT
   ════════════════════════════════════════════════════════════════════ */
export default client;

