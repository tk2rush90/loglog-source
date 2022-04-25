const path = require('path');
const PostManager = require('./lib/post-manager');
const TagManager = require('./lib/tag-manager');
const SiteMapManager = require('./lib/sitemap-manager');
const RoutesManager = require('./lib/routes-manager');
const RssManager = require('./lib/rss-manager');
const {remove, createDirectory} = require('./lib/fs-utils');
const {dataDirectoryPath, listDirectory, lookupsDirectory, postDirectory} = require('./lib/path-utils');

// Clear existing data files.
remove(dataDirectoryPath);

// Create required directories.
createDirectory(dataDirectoryPath);
createDirectory(path.join(dataDirectoryPath, listDirectory));
createDirectory(path.join(dataDirectoryPath, lookupsDirectory));
createDirectory(path.join(dataDirectoryPath, postDirectory));

// Get all available posts and create tags and post files.
const posts = PostManager.getPosts();

TagManager.createTags(posts);
PostManager.createPosts(posts);
RssManager.createRss(posts);

// Minimize the post data and create pagination and lookup files.
const postLookups = PostManager.getPostsForLookup(posts);

PostManager.createPagination([...postLookups]);
PostManager.createPostLookup(postLookups);
SiteMapManager.createSiteMap(postLookups);
RoutesManager.createRoutes(postLookups);
