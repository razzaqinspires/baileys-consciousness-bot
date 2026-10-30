export function serializeMessage(rawMsg, sock) {
  if (!rawMsg?.message) return null;

  const m = rawMsg.message;
  const type = Object.keys(m)[0];

  const body =
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    "";

  const contextInfo =
    m.extendedTextMessage?.contextInfo ||
    m.imageMessage?.contextInfo ||
    m.videoMessage?.contextInfo ||
    m.documentMessage?.contextInfo;

  const isReply = !!contextInfo?.quotedMessage;
  const mentionedJid = contextInfo?.mentionedJid || [];
  const sender = rawMsg.key.participant || rawMsg.key.remoteJid;
  const isGroup = (rawMsg.key.remoteJid || "").endsWith("@g.us");
  const fromMe = !!rawMsg.key.fromMe;

  const prefixes = global.config?.prefixes || ["!"];
  let prefix = null, command = null, args = [];

  for (const p of prefixes) {
    if (body.startsWith(p)) {
      prefix = p;
      const withoutPrefix = body.slice(p.length).trim();
      const parts = withoutPrefix.split(/\s+/);
      command = (parts.shift() || "").toLowerCase();
      args = parts;
      break;
    }
  }

  const reply = (text, options = {}) =>
    sock.sendMessage(rawMsg.key.remoteJid, { text, ...options }, { quoted: rawMsg });

  return {
    raw: rawMsg, key: rawMsg.key, type, body, sender,
    isGroup, fromMe, isReply, mentionedJid,
    prefix, command, args, contextInfo, reply
  };
}
