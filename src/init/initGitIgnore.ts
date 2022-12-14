import fse from 'fs-extra';
import { join } from 'path';

const path = join(process.cwd(), '.gitignore');

const content = `# Generated By RiVE
build
coverage
dist
node_modules
package-lock.json
pnpm-lock.yaml
yarn.lock
`;

export function initGitIgnore() {
  return fse.writeFile(path, content);
}
