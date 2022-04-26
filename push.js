const {exec} = require('child_process');
const args = process.argv;
const index = args.indexOf('--message');
let commitMessage;

if (index !== -1) {
  commitMessage = args[index + 1];
}

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
      console.log(`command error:`, code, signal);
      reject();
    });

    process.on('message', (message, sendHandler) => {
      console.log(`command message:`, message, sendHandler);
    });

    process.on('exit', (code, signal) => {
      console.log(`command exit:`, code, signal);
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
  await runCommand(`cd ${__dirname} && git commit -m "${commitMessage || new Date().toISOString()}"`);

  // Push.
  await runCommand(`cd ${__dirname} && git push origin master`);
}

run();
