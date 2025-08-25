const { execSync } = require('child_process');

module.exports = port => {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      const pids = [...output.matchAll(/\s+(\d+)\r?\n?/g)].map(m => m[1]);
      if (pids.length) {
        pids.forEach(pid => execSync(`taskkill /PID ${pid} /F`));
        console.log(`Killed PIDs ${pids.join(', ')} on port ${port}`);
      } else {
        console.log(`No process found on port ${port}`);
      }
    } else {
      // Use ss, which is almost always installed on Linux
      let output = execSync(`ss -ltnp 'sport = :${port}' 2>/dev/null || true`).toString().trim();
      const pidMatches = [...output.matchAll(/pid=(\d+),/g)];
      const pids = pidMatches.map(m => m[1]);
      if (pids.length) {
        pids.forEach(pid => execSync(`kill -9 ${pid}`));
        console.log(`Killed PIDs ${pids.join(', ')} on port ${port}`);
      } else {
        console.log(`No process found on port ${port}`);
      }
    }
  } catch (err) {
    console.error(`Failed to kill port ${port}:`, err.message);
  }
}

