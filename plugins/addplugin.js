import fs from "fs";
import path from "path";

export default {
  meta: { name: "addplugin", category: "Owner", description: "Menambahkan plugin baru (owner only)" },
  async handler(msg, { config }) {
    if (!config.ownerNumbers.includes(msg.sender)) return msg.reply("⛔ Hanya owner.");

    const raw = msg.body.slice(msg.prefix.length + "addplugin".length).trim();
    const [name, category, ...bodyParts] = raw.split("|").map((s) => s.trim());
    const bodyCode = bodyParts.join("|").trim();

    if (!name || !category || !bodyCode) {
      return msg.reply(
        "Format: !addplugin <nama> | <kategori> | <kode handler>\n" +
        "Contoh: !addplugin halo | Umum | await msg.reply(\"Halo!\")"
      );
    }

    if (!/^[a-z0-9_-]+$/i.test(name)) return msg.reply("Nama plugin hanya huruf/angka/underscore.");

    const filePath = path.join("./plugins", `${name}.js`);
    if (fs.existsSync(filePath)) return msg.reply(`⚠️ Plugin "${name}" sudah ada.`);

    const code = `export default {
  meta: { name: ${JSON.stringify(name)}, category: ${JSON.stringify(category)} },
  async handler(msg, { sock, config, loader }) {
    ${bodyCode}
  }
};
`;

    fs.writeFileSync(filePath, code, "utf8");
    await msg.reply(`✅ Plugin "${name}" dibuat. Hot-reload akan memuatnya otomatis.`);
  }
};
