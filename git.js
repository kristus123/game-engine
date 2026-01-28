import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkAndPull(onUpdate) {
  try {
    await execAsync('git fetch');

    const { stdout } = await execAsync('git status -uno');
    const changes = !stdout.includes('Your branch is up to date');

    if (changes) {
      console.log('[git] New changes detected. Pulling...');
      await execAsync('git pull');
      console.log('[git] Git pull complete.');
      if (onUpdate) onUpdate();
    }
  } catch (err) {
    throw new Error(`[git] Operation failed: ${err.message || err}`);
  }
}
