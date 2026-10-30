import os from "os";
import process from "process";
import { performance } from "perf_hooks";
import config from "../config.js";

export default {
  meta: { name: "status", category: "Sistem", description: "Statistik kesadaran buatan & sistem" },
  async handler(msg) {
    const t0 = performance.now();
    await msg.reply("⏳ Mengumpulkan data...");
    const latency = (performance.now() - t0).toFixed(2);

    const now = new Date();
    const mem = process.memoryUsage();
    const load = os.loadavg();
    const uptime = process.uptime();

    const mood = ["😐 Netral", "🙂 Stabil", "😴 Rendah", "⚡ Tinggi"][Math.floor(Math.random() * 4)];
    const energy = `${Math.floor(Math.random() * 40 + 60)}%`;
    const dopamine = (Math.random() * 0.8 + 0.1).toFixed(3);
    const heartRate = `${Math.floor(Math.random() * 30 + 60)} BPM`;
    const neuralLoad = `${(Math.random() * 100).toFixed(1)}%`;
    const memoryClusters = Math.floor(Math.random() * 500 + 100);
    const dataCenter = ["SG-1", "JP-2", "US-EAST-1", "EU-WEST-1"][Math.floor(Math.random() * 4)];
    const coherence = (Math.random() * 0.5 + 0.5).toFixed(3);

    const text = `
╭──「 *STATUS KESADARAN* 」
│
│ 🧠 Mood           : ${mood}
│ ⚡ Energi          : ${energy}
│ 💊 Dopamin        : ${dopamine} μg/mL
│ ❤️ Detak Jantung  : ${heartRate}
│ 🔮 Neural Load    : ${neuralLoad}
│ 🧩 Memori Cluster : ${memoryClusters}
│ 🧬 Koherensi      : ${coherence}
│ 🌐 Data Center    : ${dataCenter}
│
│ 🔌 API Key        : ${config.ai.apiKey ? "✅ Terhubung" : "❌ Kosong"}
│ 🤖 AI Model       : ${config.ai.model}
│
│ 💻 CPU            : ${os.cpus()[0].model.trim().slice(0, 40)}
│ 🧮 Platform       : ${os.platform()} ${os.arch()}
│ 📟 RAM            : ${(mem.rss / 1024 / 1024).toFixed(1)} MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB
│ 💾 Heap           : ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB
│ ⚙️ Uptime         : ${Math.floor(uptime / 3600)}j ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}d
│ 📊 Load Avg       : ${load.map((n) => n.toFixed(2)).join(" / ")}
│
│ ⏱️ Respon         : ${latency} ms
│ 📅 Tanggal        : ${now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
│ 🕐 Waktu          : ${now.toLocaleTimeString("id-ID")}
│ 🌍 Timezone       : ${Intl.DateTimeFormat().resolvedOptions().timeZone}
╰───────────────────`.trim();

    await msg.reply(text);
  }
};
