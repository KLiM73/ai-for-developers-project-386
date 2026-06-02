import { execSync } from 'child_process';
import path from 'path';

const backendDir = path.resolve(__dirname, '../backend');
const railsEnv = { ...process.env, RAILS_ENV: 'test' };

function rails(task: string) {
  execSync(`bin/rails ${task}`, { cwd: backendDir, env: railsEnv, stdio: 'inherit' });
}

export default async function globalSetup() {
  rails('db:drop');
  rails('db:create');
  rails('db:schema:load');
  rails('db:seed');
}
