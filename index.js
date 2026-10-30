// index.js — Entry point
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import config from "./config.js";
import { serializeMessage } from "./core/serializer.js";
import { PluginLoader } from "./core/loader.js";
import { handleAI } from "./core/ai-engine.js";
import { handleExtreme } from "./core/extreme.js";

global.config = config;

const logger = pino({ level: "silent" });
const loader = new PluginLoader("./plugins", config);

async function start() {
  await loader.loadAll();
  loader.watch();

  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: state,
    printQRInTerminal: true,
    browser: ["ConsciousnessBot", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (u) => {
    const { connection, lastDisconnect } = u;
    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(`[Conn] Terputus. Reconnect=${shouldReconnect}`);
      if (shouldReconnect) start();
    } else if (connection === "open") {
      console.log("✅ Bot terhubung ke WhatsApp.");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const raw of messages) {
      if (!raw.message || raw.key.fromMe) continue;

      const msg = serializeMessage(raw, sock);
      if (!msg) continue;

      if (await handleExtreme(msg, sock, config)) continue;

      if (msg.prefix && msg.command) {
        const plugin = loader.getPlugin(msg.command);
        if (plugin) {
          try {
            await plugin.handler(msg, { sock, config, loader });
          } catch (e) {
            console.error(`[Plugin:${msg.command}]`, e);
            await msg.reply(`⚠️ Error: ${e.message}`);
          }
          continue;
        }
      }

      if (!config.aiEnabled) continue;

      if (!msg.isGroup && !msg.prefix) {
        await handleAI(msg, sock);
        continue;
      }

      if (msg.isGroup && !msg.prefix) {
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const mentioned = msg.mentionedJid.includes(botNumber);
        const repliedToBot =
          msg.isReply &&
          (msg.contextInfo?.participant === botNumber ||
            msg.contextInfo?.remoteJid === botNumber);

        if (mentioned || repliedToBot) {
          await handleAI(msg, sock);
        }
      }
    }
  });
}

start().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
