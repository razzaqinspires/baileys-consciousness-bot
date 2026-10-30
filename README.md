# Consciousness WhatsApp Bot

Bot WhatsApp modular berbasis @whiskeysockets/baileys v7 (ESM).

## Fitur
- Multi-prefix: ! . # / ?
- Plugin loader + hot-reload (chokidar) — tulis plugin, langsung aktif.
- AI otomatis:
  - Private: pesan tanpa prefix memicu AI.
  - Grup: AI hanya saat reply ke bot atau mention bot, tanpa prefix.
- Perintah ekstrem owner (tanpa prefix, tidak tampil di menu):
  - => eval return
  - >  eval async
  - $  CLI exec
  - >> run python
- Self-modifying: !addplugin <nama> | <kategori> | <kode>

## Instalasi

    npm install
    # Edit config.js, isi ownerNumbers
    # Opsional AI:
    export AI_API_KEY=sk-...
    export AI_API_URL=https://api.openai.com/v1/chat/completions
    export AI_MODEL=gpt-4o-mini
    npm start

Scan QR di terminal.

## Struktur

    .
    |-- index.js
    |-- config.js
    |-- core/
    |   |-- serializer.js
    |   |-- loader.js
    |   |-- ai-engine.js
    |   `-- extreme.js
    `-- plugins/
        |-- menu.js
        |-- status.js
        |-- ping.js
        `-- addplugin.js

## Menulis plugin baru

Buat plugins/nama.js:

    export default {
      meta: { name: "nama", category: "Umum" },
      async handler(msg, { sock, config, loader }) {
        await msg.reply("Halo!");
      }
    };

Simpan, otomatis ter-reload tanpa restart.
