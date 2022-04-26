const fs = require('fs');
const path = require('path');
const {fileOptions} = require('./fs-utils');
const {sourceDirectoryPath} = require('./path-utils');

const routesFile = 'routes.txt';

/**
 * Create routes file with posts.
 * @param posts {PostLookup[]} All available posts.
 */
function createRoutes(posts) {
  const routes = [
    // Default pages.
    '/',
    '/blog',
    '/blog/list',
    '/blog/search',
    '/blog/tags',
    '/error/404',
  ];

  posts.forEach(post => {
    routes.push(`/blog/post/${post.id}`);
  });

  fs.writeFileSync(path.join(sourceDirectoryPath, routesFile), routes.join('\n'), fileOptions);
}

module.exports = {
  createRoutes,
};
