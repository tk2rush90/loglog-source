const fs = require('fs');
const path = require('path');
const {remove, copyDirectory} = require('./lib/fs-utils');

const originalDirectory = path.join(__dirname, '..', 'dist', 'tk2blog90', 'browser');
const targetDirectory = path.join(__dirname, '..', '..', 'tk2blog90.github.io');

/**
 * Whitelist to keep when clearing the target directory.
 * @type {string[]}
 */
const whiteList = ['.git', '.idea', 'push.js'];

// Clear all data in target directory.
fs.readdirSync(targetDirectory).forEach(content => {
  // Keep whitelisted contents.
  if (whiteList.every(item => item !== content)) {
    remove(path.join(targetDirectory, content));
  }
});

// Copy original data to target directory.
copyDirectory(originalDirectory, targetDirectory);
