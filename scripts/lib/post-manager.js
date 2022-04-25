const fs = require('fs');
const path = require('path');
const {fileOptions} = require('./fs-utils');
const {postDirectoryPath, dataDirectoryPath} = require('./path-utils');

const postDirectory = 'post';
const metaJsonFile = 'meta.json';
const postMarkdownFile = 'index.md';

/**
 * Get all available posts.
 * @returns {Post[]} All available posts.
 */
function getPosts() {
  const contents = fs.readdirSync(postDirectoryPath);
  const posts = [];

  contents.forEach(content => {
    const metaJson = fs.readFileSync(path.join(postDirectoryPath, content, metaJsonFile), fileOptions);
    const postContents = fs.readFileSync(path.join(postDirectoryPath, content, postMarkdownFile), fileOptions);
    const postStat = fs.statSync(path.join(postDirectoryPath, content, postMarkdownFile));

    // The `metaJson` is string with `utf-8`.
    // Why the IDE can't apply the external `fileOptions`?
    const meta = JSON.parse(metaJson);

    // The `content` is directory name for each post, and it should be the `id` of post.
    meta.id = content;
    meta.contents = postContents;
    meta.created = postStat.birthtime;

    posts.push(meta);
  });

  // Order by `created` desc.
  posts.sort((a, b) => {
    return b.created - a.created;
  });

  return posts;
}

/**
 * Create post files in data/post directory.
 * @param posts {Post[]} All available posts.
 */
function createPosts(posts) {
  posts.forEach(post => {
    fs.writeFileSync(path.join(dataDirectoryPath, postDirectory, post.id), JSON.stringify(post), fileOptions);
  });
}

module.exports = {
  getPosts,
  createPosts,
};
