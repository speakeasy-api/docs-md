import { getReactEslintConfig } from '@speakeasy-api/config';
import { getDirname } from 'cross-dirname';
import { resolve } from 'node:path';
import { globalIgnores } from 'eslint/config';

const gitignorePath = resolve(getDirname(), '../..', '.gitignore');

export default [
  ...getReactEslintConfig(gitignorePath),
  globalIgnores(['.storybook/*']),
];
