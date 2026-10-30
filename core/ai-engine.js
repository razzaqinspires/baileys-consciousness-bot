import config from "../config.js";

const histories = new Map();
const MAX_TURNS = 8;

export async function handleAI(msg, sock) {
  const jid = msg.key.remoteJid;
  const userText = msg.body.trim();
  if (!userText) return;

  const aiCfg = config.ai;
  if (!aiCfg.apiKey) {
    await msg.reply("🤖 AI belum dikonfigurasi.\nSet env AI_API_KEY (dan opsional AI_API_URL, AI_MODEL) lalu restart bot.");
    return;
  }

  const history = histories.get(jid) || [];
  history.push({ role: "user", content: userText });
  const trimmed = history.slice(-MAX_TURNS);

  try {
    const res = await fetch(aiCfg.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiCfg.apiKey}`
      },
      body: JSON.stringify({
        model: aiCfg.model,
        messages: [{ role: "system", content: aiCfg.system }, ...trimmed],
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "(kosong)";

    trimmed.push({ role: "assistant", content: answer });
    histories.set(jid, trimmed);
    await msg.reply(answer);
  } catch (e) {
    console.error("[AI]", e);
    await msg.reply(`⚠️ AI error: ${e.message}`);
  }
}
