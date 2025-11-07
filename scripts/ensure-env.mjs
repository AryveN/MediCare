import { existsSync, copyFileSync } from 'node:fs';
if (!existsSync('.env')) {
  copyFileSync('.env.example', '.env');
  console.log('Vytvořen .env z .env.example');
} else {
  console.log('.env již existuje – OK');
}
