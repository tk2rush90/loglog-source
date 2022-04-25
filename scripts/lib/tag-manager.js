const fs = require('fs');
const path = require('path');
const {fileOptions} = require('./fs-utils');
const {dataDirectoryPath, lookupsDirectory} = require('./path-utils');

const tagJsonFile = 'tags';

/**
 * Create tags by extracting unique tags from the posts.
 * @param posts {Post[]} All post list.
 */
function createTags(posts) {
  const tagMap = {};

  // Loop posts and its tags to get unique tags.
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap[tag] = true;
    });
  });

  const tags = [];

  // The `key`s of `tagMap` are unique tags.
  Object.keys(tagMap).forEach(tag => {
    tags.push(tag);
  });

  fs.writeFileSync(path.join(dataDirectoryPath, lookupsDirectory, tagJsonFile), JSON.stringify(tags), fileOptions);
}

module.exports = {
  createTags,
};
