const path = require('path');

const sourceDirectoryPath = path.join(__dirname, '..', '..', 'src');
const postDirectoryPath = path.join(sourceDirectoryPath, 'assets', 'posts');
const dataDirectoryPath = path.join(sourceDirectoryPath, 'assets', 'data');

const lookupsDirectory = 'lookups';
const postDirectory = 'post';
const listDirectory = 'list';

module.exports = {
  sourceDirectoryPath,
  postDirectoryPath,
  dataDirectoryPath,
  lookupsDirectory,
  postDirectory,
  listDirectory,
};
