import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import chokidar from "chokidar";

export class PluginLoader {
  constructor(pluginDir, config) {
    this.pluginDir = path.resolve(pluginDir);
    this.config = config;
    this.plugins = new Map();
    this.watcher = null;
  }

  async loadAll() {
    if (!fs.existsSync(this.pluginDir)) fs.mkdirSync(this.pluginDir, { recursive: true });
    const files = fs.readdirSync(this.pluginDir).filter((f) => f.endsWith(".js"));
    for (const file of files) await this.loadPlugin(path.join(this.pluginDir, file));
    console.log(`[Loader] ${this.plugins.size} plugin dimuat.`);
  }

  async loadPlugin(filePath) {
    try {
      const url = `${pathToFileURL(filePath).href}?v=${Date.now()}`;
      const mod = await import(url);
      const name = path.basename(filePath, ".js");
      const plugin = mod.default || mod;
      if (!plugin || typeof plugin.handler !== "function") {
        console.warn(`[Loader] "${name}" tidak punya handler, dilewati.`);
        return;
      }
      this.plugins.set(name, {
        handler: plugin.handler,
        meta: plugin.meta || {},
        filePath, raw: mod
      });
      console.log(`[Loader] Plugin "${name}" dimuat.`);
    } catch (err) {
      console.error(`[Loader] Gagal memuat ${filePath}:`, err.message);
    }
  }

  async reloadPlugin(filePath) {
    const name = path.basename(filePath, ".js");
    console.log(`[HotReload] Memuat ulang "${name}"...`);
    this.plugins.delete(name);
    await this.loadPlugin(filePath);
  }

  watch() {
    if (!this.config.hotReload) return;
    this.watcher = chokidar.watch(this.pluginDir, { ignoreInitial: true, depth: 1 });
    this.watcher.on("add", (fp) => this.loadPlugin(fp));
    this.watcher.on("change", (fp) => this.reloadPlugin(fp));
    this.watcher.on("unlink", (fp) => {
      const name = path.basename(fp, ".js");
      this.plugins.delete(name);
      console.log(`[HotReload] Plugin "${name}" dihapus.`);
    });
    console.log("[Loader] Hot-reload aktif.");
  }

  getPlugin(name) { return this.plugins.get(name) || null; }

  getAll() {
    return Array.from(this.plugins.entries()).map(([name, p]) => ({ name, ...p.meta }));
  }
}
