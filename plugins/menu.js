import os from "os";
import process from "process";

export default {
  meta: { name: "menu", category: "Umum", description: "Menampilkan menu utama bot" },
  async handler(msg, { loader, config }) {
    const all = loader.getAll();
    const byCategory = {};
    for (const p of all) {
      const cat = p.category || "Lainnya";
      (byCategory[cat] ||= []).push(p);
    }

    let text = `╭───「 *CONSCIOUSNESS BOT* 」\n`;
    text += `│ Owner    : ${(config.ownerNumbers[0] || "?").split("@")[0]}\n`;
    text += `│ Uptime   : ${process.uptime().toFixed(0)}s\n`;
    text += `│ Platform : ${os.platform()} ${os.arch()}\n`;
    text += `│ Prefix   : ${config.prefixes.join(" ")}\n`;
    text += `╰───────────────────\n\n`;

    let count = 0;
    const mainPrefix = config.prefixes[0];

    for (const [cat, plugins] of Object.entries(byCategory)) {
      text += `*${cat}*\n`;
      for (const p of plugins) {
        count++;
        text += `${count}. ${mainPrefix}${p.name} <args>\n`;
      }
      text += "\n";
    }

    text += `_Total: ${count} command aktif_`;
    await msg.reply(text);
  }
};
