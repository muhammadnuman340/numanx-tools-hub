import { execSync } from 'child_process';

console.log('Checking Git Status...');
try {
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('Status:\n', status);

  console.log('Checking Git Diff...');
  const diff = execSync('git diff --name-only', { encoding: 'utf8' });
  console.log('Diff:\n', diff);
} catch (error) {
  console.error('Error running Git command:', error.message);
}
