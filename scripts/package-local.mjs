import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { homedir } from 'node:os';

const cargoBin = join(homedir(), '.cargo', 'bin');
const env = { ...process.env };
if (existsSync(cargoBin) && !env.PATH?.includes(cargoBin)) {
  env.PATH = `${cargoBin}${delimiter}${env.PATH ?? ''}`;
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(command, ['tauri', 'build'], {
  stdio: 'inherit',
  env,
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
