import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

export function runCommand(
  command: string,
  args: string[],
  { cwd, stdio = "inherit" }: { cwd: string; stdio?: "inherit" | "pipe" }
) {
  const result = spawnSync(command, args, { stdio, cwd });

  // Check if process was terminated by signal (exit code 128 + signal number)
  if (result.status !== null && result.status >= 128) {
    process.exit(result.status);
  }

  // Check if process failed
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  return result.output.map((output) => {
    if (Buffer.isBuffer(output)) {
      return output.toString();
    }
    return output;
  });
}

export async function userPrompt(question: string) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    rl.close();
    process.exit(130);
  });
  const result = await rl.question(question);
  rl.close();
  return result;
}
