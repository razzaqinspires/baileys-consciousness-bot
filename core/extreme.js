import { exec as cliExec } from "child_process";
import { promisify } from "util";
import config from "../config.js";

const execAsync = promisify(cliExec);

export async function handleExtreme(msg, sock) {
  const body = msg.body.trimStart();
  const sender = msg.sender;
  if (!config.ownerNumbers.includes(sender)) return false;

  if (body.startsWith(">>")) {
    const code = body.slice(2).trim();
    if (!code) return false;
    try {
      const { stdout, stderr } = await execAsync(
        `${config.pythonBin} -c ${JSON.stringify(code)}`,
        { timeout: 15000, maxBuffer: 1024 * 1024 }
      );
      await msg.reply(`🐍 OUT:\n${stdout || "(kosong)"}${stderr ? `\nERR:\n${stderr}` : ""}`);
    } catch (e) {
      await msg.reply(`🐍 Error: ${e.message}`);
    }
    return true;
  }

  if (body.startsWith("=>")) {
    const code = body.slice(2).trim();
    if (!code) return false;
    try {
      const result = eval(code);
      await msg.reply(`=> ${String(result)}`);
    } catch (e) {
      await msg.reply(`Eval Error: ${e.message}`);
    }
    return true;
  }

  if (body.startsWith(">")) {
    const code = body.slice(1).trim();
    if (!code) return false;
    try {
      const result = await eval(`(async () => { ${code} })()`);
      await msg.reply(`> ${String(result)}`);
    } catch (e) {
      await msg.reply(`Async Eval Error: ${e.message}`);
    }
    return true;
  }

  if (body.startsWith("$")) {
    const cmd = body.slice(1).trim();
    if (!cmd) return false;
    try {
      const { stdout, stderr } = await execAsync(cmd, { timeout: 15000, maxBuffer: 1024 * 1024 });
      await msg.reply(`$ OUT:\n${stdout || "(kosong)"}${stderr ? `\nERR:\n${stderr}` : ""}`);
    } catch (e) {
      await msg.reply(`$ Error: ${e.message}`);
    }
    return true;
  }

  return false;
}
