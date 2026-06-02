import { execSync } from 'child_process';
import path from 'path';

const backendDir = path.resolve(__dirname, '../../backend');
const railsEnv = { ...process.env, RAILS_ENV: 'test' };

function rails(task: string) {
  execSync(`bin/rails ${task}`, { cwd: backendDir, env: railsEnv, stdio: 'pipe' });
}

export function resetDb() {
  // db:seed:replant truncates all tables and re-seeds without dropping the DB file.
  // This keeps the running Rails server's SQLite connection valid.
  rails('db:seed:replant');
}
