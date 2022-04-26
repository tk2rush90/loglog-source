const {exec} = require('child_process');
const args = process.argv;

/**
 * Run command asynchronously.
 * @param command {string} Command to run.
 * @returns {Promise<unknown>}
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Run command: ${command}`);

    const process = exec(command);

    process.on('error', (code, signal) => {
      console.log(`command error: "${command}"`, code, signal);
      reject();
    });

    process.on('message', (message, sendHandler) => {
      console.log(`command message: "${command}"`, message, sendHandler);
    });

    process.on('exit', (code, signal) => {
      console.log(`command exit: "${command}"`, code, signal);
      resolve();
    });
  });
}

/**
 * Run push process.
 * @returns {Promise<void>}
 */
async function run() {
  // Add missing files.
  await runCommand(`cd ${__dirname} && git add .`);

  // Commit changes.
  await runCommand(`cd ${__dirname} && git commit -m "${args[1] || new Date().toISOString()}"`);

  // Push.
  await runCommand(`cd ${__dirname} && git push origin master`);
}

run();
