import fse from 'fs-extra';
import { join } from 'path';

const extensionsConfig = {
  recommendations: [
    'esbenp.prettier-vscode',
    'editorconfig.editorconfig',
    'dbaeumer.vscode-eslint',
    'stylelint.vscode-stylelint',
    'unifiedjs.vscode-mdx',
  ],
};
const extensionsFilePath = join(process.cwd(), '.vscode', 'extensions.json');

export async function initVSCodeExtensions() {
  await fse.outputJson(extensionsFilePath, extensionsConfig, { spaces: 2 });
}
