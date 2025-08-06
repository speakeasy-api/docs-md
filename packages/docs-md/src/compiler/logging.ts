import chalk from "chalk";

type Level = "error" | "info" | "debug";

let level: Level = "info";

export function setLevel(newLevel: Level) {
  level = newLevel;
}

export function info(message: string) {
  if (level === "info" || level === "debug") {
    console.log(message);
  }
}

export function error(message: string, err?: unknown) {
  console.error(chalk.red(message));
  console.error(err);
}

export function debug(message: string) {
  if (level === "debug") {
    console.debug(chalk.grey(message));
  }
}
