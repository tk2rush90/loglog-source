const fs = require('fs');
const path = require('path');
const {remove, copyDirectory} = require('./lib/fs-utils');
const {exec} = require('child_process');

const originalDirectory = path.join(__dirname, '..', 'dist', 'tk2blog90', 'browser');
const targetDirectory = path.join(__dirname, '..', '..', 'tk2blog90.github.io');

/**
 * Whitelist to keep when clearing the target directory.
 * @type {string[]}
 */
const whiteList = ['.git', '.idea', 'push.js'];

const contents = fs.readdirSync(targetDirectory);

// Clear all data in target directory.
contents.forEach(content => {
  // Keep whitelisted contents.
  if (whiteList.every(item => item !== content)) {
    remove(path.join(targetDirectory, content));
  }
});

// Copy original data to target directory.
copyDirectory(originalDirectory, targetDirectory);

/**
 * Run command asynchronously.
 * @param command {string} Command to run.
 * @returns {Promise<unknown>}
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command);

    process.on('error', (code, signal) => {
      console.log(`command error: "${command}"`, code, signal);
      reject();
    });

    process.on('exit', (code, signal) => {
      console.log(`command exit: "${command}"`, code, signal);
      resolve();
    });
  });
}

runCommand(`node ${path.join(targetDirectory, 'push.js')}`);
