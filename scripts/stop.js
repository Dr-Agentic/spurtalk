import { execSync } from 'child_process';

function killPort(port) {
  try {
    const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
    if (result) {
      const pids = result.split('\n').filter(Boolean);
      pids.forEach(pid => {
        try {
          process.kill(parseInt(pid), 'SIGTERM');
          console.log(`Killed process ${pid} on port ${port}`);
        } catch (e) {}
      });
      execSync(`sleep 1`);
      const stillRunning = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
      if (stillRunning) {
        stillRunning.split('\n').filter(Boolean).forEach(pid => {
          try {
            process.kill(parseInt(pid), 'SIGKILL');
            console.log(`Force killed process ${pid} on port ${port}`);
          } catch (e) {}
        });
      }
    } else {
      console.log(`No process found on port ${port}`);
    }
  } catch (e) {
    console.log(`No process on port ${port}`);
  }
}

console.log('Stopping services on ports 8001 and 8002...');
killPort(8001);
killPort(8002);
console.log('Done.');
