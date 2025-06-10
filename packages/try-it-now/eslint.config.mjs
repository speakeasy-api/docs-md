import { getReactEslintConfig } from "@speakeasy-api/config";
import { getDirname } from "cross-dirname";
import { resolve } from "node:path";

const gitignorePath = resolve(getDirname(), "../..", ".gitignore");

export default [...getReactEslintConfig(gitignorePath)];
