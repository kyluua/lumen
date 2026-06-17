import { existsSync } from 'node:fs';
import { join } from 'node:path';

const workflow = join(process.cwd(), '.github', 'workflows', 'package-windows.yml');

console.log('\nLumen web build completed.');
console.log('Native Tauri packaging is configured for GitHub Actions because this PC blocks Cargo build scripts with Smart App Control.');

if (existsSync(workflow)) {
  console.log('\nTo create the Windows installer without changing local security settings:');
  console.log('  1. Push your changes to GitHub.');
  console.log('  2. Open Actions -> Package Lumen Desktop.');
  console.log('  3. Run the workflow and download the lumen-windows-bundle artifact.');
}

console.log('\nFor local packaging on a machine that allows Rust build scripts, run:');
console.log('  npm.cmd run package:local\n');
