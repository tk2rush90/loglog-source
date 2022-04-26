const fs = require('fs');
const path = require('path');
const {fileOptions} = require('./fs-utils');
const {postDirectoryPath, dataDirectoryPath, postDirectory, listDirectory, lookupsDirectory} = require('./path-utils');

const metaJsonFile = 'meta.json';
const postMarkdownFile = 'index.md';
const postsJsonFile = 'posts.json';

/**
 * Page size.
 * @type {number}
 */
const size = 30;

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
    meta.created = meta.publish || postStat.birthtime;

    posts.push(meta);
  });

  // Order by `created` desc.
  posts.sort((a, b) => {
    return new Date(b.created) - new Date(a.created);
  });

  return posts;
}

/**
 * Create post files in data/post directory.
 * @param posts {Post[]} All available posts.
 */
function createPosts(posts) {
  posts.forEach(post => {
    fs.writeFileSync(path.join(dataDirectoryPath, postDirectory, `${post.id}.json`), JSON.stringify(post), fileOptions);
  });
}

/**
 * Get minimized post data by removing unnecessary fields.
 * @param posts {Post[]} All available posts.
 * @returns {PostLookup[]} Post that
 */
function getPostsForLookup(posts) {
  return posts.map(post => {
    // Remove unnecessary fields for pagination.
    const {contents, keywords, description, banner, ...minimized} = post;

    return minimized;
  });
}

/**
 * Create pagination files for posts.
 * @param posts {PostLookup[]} All available posts which are minimized.
 */
function createPagination(posts) {
  let page = 0;

  while (posts.length > 0) {
    const postsForPage = posts.splice(0, size);
    const hasNext = posts.length > 0;

    const pageData = {
      data: postsForPage,
      hasNext,
    };

    fs.writeFileSync(path.join(dataDirectoryPath, listDirectory, `${page}.json`), JSON.stringify(pageData), fileOptions);

    page++;
  }
}

/**
 * Save all posts as a single file.
 * The file which is created with this method will be used for keyword search or tag search.
 * @param posts {PostLookup[]} All available posts which are minimized.
 */
function createPostLookup(posts) {
  fs.writeFileSync(path.join(dataDirectoryPath, lookupsDirectory, postsJsonFile), JSON.stringify(posts), fileOptions);
}

module.exports = {
  getPosts,
  createPosts,
  getPostsForLookup,
  createPagination,
  createPostLookup,
};
