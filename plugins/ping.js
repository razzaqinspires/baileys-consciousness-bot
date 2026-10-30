export default {
  meta: { name: "ping", category: "Umum", description: "Cek latensi bot" },
  async handler(msg) {
    const t0 = Date.now();
    await msg.reply("🏓 Pong!");
    await msg.reply(`⏱️ ${Date.now() - t0} ms`);
  }
};
