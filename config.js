// config.js — Konfigurasi global bot
export default {
  ownerNumbers: [
    "6281234567890@s.whatsapp.net"
  ],
  prefixes: ["!", ".", "#", "/", "?"],
  aiEnabled: true,
  hotReload: true,
  pythonBin: process.env.PYTHON_BIN || "python3",

  ai: {
    apiUrl: process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.AI_API_KEY || "",
    model:  process.env.AI_MODEL  || "gpt-4o-mini",
    system: "Kamu adalah asisten WhatsApp yang ringkas, ramah, dan membantu."
  },

  extreme: {
    evalReturn: "=>",
    evalAsync:  ">",
    cliExec:    "$",
    pythonRun:  ">>"
  }
};
