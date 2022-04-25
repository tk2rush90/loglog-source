const fs = require('fs');
const path = require('path');

const fileOptions = {
  encoding: 'utf-8',
};

/**
 * Remove the directory or file.
 * If the `target` is directory, remove its contents recursively.
 * @param target {string} The path of target.
 */
function remove(target) {
  const stat = fs.statSync(target);

  if (stat.isDirectory()) {
    const contents = fs.readdirSync(target);

    contents.forEach(content => {
      remove(path.join(target, content));
    });

    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
}

/**
 * Create directory.
 * @param target {string} The path of target.
 */
function createDirectory(target) {
  fs.mkdirSync(target);
}

/**
 * Copy origin directory contents to target directory.
 * The target directory must be empty.
 * @param origin {string} Origin directory path.
 * @param target {string} Target directory path.
 */
function copyDirectory(origin, target) {
  const contents = fs.readdirSync(origin);

  contents.forEach(content => {
    copyData(path.join(origin, content), path.join(target, content));
  });
}

/**
 * Copy file or directory to target.
 * @param origin {string} The path of file or directory to copy.
 * @param target {string} The target path.
 */
function copyData(origin, target) {
  const stat = fs.statSync(origin);

  if (stat.isDirectory()) {
    fs.mkdirSync(target);

    const contents = fs.readdirSync(origin);

    contents.forEach(content => {
      copyData(path.join(origin, content), path.join(target, content));
    });
  } else {
    fs.copyFileSync(origin, target);
  }
}

module.exports = {
  fileOptions,
  remove,
  createDirectory,
  copyDirectory,
};
