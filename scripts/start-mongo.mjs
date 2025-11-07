import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'data', 'mongodb');

mkdirSync(dataDir, { recursive: true });

const mongoArgs = ['--dbpath', dataDir, '--bind_ip', '127.0.0.1'];
const mongod = spawn('mongod', mongoArgs, { stdio: 'inherit' });

mongod.on('error', (err) => {
  console.error('Nepodařilo se spustit `mongod`. Ujisti se, že je MongoDB nainstalované a příkaz `mongod` je v PATH.');
  console.error(err);
  process.exit(1);
});

const stop = (signal) => {
  if (mongod.killed) {
    return;
  }
  mongod.kill(signal);
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
  process.on(signal, () => stop(signal));
});

mongod.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0);
    return;
  }
  process.exit(code ?? 0);
});
