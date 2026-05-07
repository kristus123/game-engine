import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();

const SETUP_DIR = path.join(ROOT, 'capacitor_setup');
const DIST_DIR = path.join(ROOT, 'dist');

function run(command, cwd = process.cwd()) {
  console.log(`\n> ${command}`);

  const result = spawnSync(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  // robocopy success codes:
  // 0 = no files copied
  // 1 = files copied successfully
  // up to 7 = still considered success
  if (command.startsWith('robocopy')) {
    if ((result.status ?? 999) <= 7) {
      return;
    }
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command}`);
  }
}

try {
  // Remove old setup folder
  if (fs.existsSync(SETUP_DIR)) {
    run(`rmdir /s /q "${SETUP_DIR}"`);
  }

  // Create setup folder
  fs.mkdirSync(SETUP_DIR, { recursive: true });

  // Copy dist -> capacitor_setup/dist
  run(
    `robocopy "${DIST_DIR}" "${path.join(
      SETUP_DIR,
      'dist'
    )}" /E`
  );

  // Initialize npm
  run(`npm init -y`, SETUP_DIR);

  // Install Capacitor
  run(`npm i @capacitor/core`, SETUP_DIR);
  run(`npm i -D @capacitor/cli`, SETUP_DIR);

  // Initialize Capacitor
  run(
    `npx cap init MyApp com.example.myapp --web-dir=dist`,
    SETUP_DIR
  );

  // Install Android support
  run(`npm i @capacitor/android`, SETUP_DIR);

  // Add Android platform
  run(`npx cap add android`, SETUP_DIR);

  // Optional iOS support
  // run(`npm i @capacitor/ios`, SETUP_DIR);
  // run(`npx cap add ios`, SETUP_DIR);

  // Sync project
  run(`npx cap sync`, SETUP_DIR);

  // Open Android Studio
  run(`npx cap open android`, SETUP_DIR);

  console.log('\n✅ Capacitor setup complete.');
} catch (err) {
  console.error('\n❌ Setup failed.');
  console.error(err.message);
  process.exit(1);
}
