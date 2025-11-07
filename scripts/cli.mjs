import readline from 'node:readline';
import { spawn } from 'node:child_process';

const actions = {
  '1': ['npm', ['run', 'setup'], 'První instalace (setup)'],
  '2': ['npm', ['run', 'dev'], 'Vývoj (frontend + backend)'],
  '3': ['npm', ['run', 'dev:backend+db'], 'Vývoj backendu + MongoDB'],
  '4': ['npm', ['run', 'dev:all'], 'Vývoj (MongoDB + backend + frontend)'],
  '5': ['npm', ['run', 'lint'], 'Lint (frontend + backend)'],
  '6': ['npm', ['run', 'test'], 'Jest testy backendu'],
  '7': ['npm', ['run', 'test:e2e'], 'E2E testy backendu']
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log('\n=== Projektové menu ===');
console.log(`
1) Setup (instalace a .env)
2) Dev (FE + BE)
3) Dev (BE + MongoDB)
4) Dev (MongoDB + BE + FE)
5) Lint
6) Testy
7) E2E testy
0) Konec
`);
rl.question('Zadej volbu: ', (ans) => {
  if (ans === '0') {
    rl.close();
    process.exit(0);
  }
  const act = actions[ans];
  if (!act) {
    console.log('Neplatná volba');
    rl.close();
    process.exit(1);
  }
  const [cmd, args, label] = act;
  console.log(`Spouštím: ${label}\n`);
  const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code ?? 0));
});
