const fs = require('fs');
const path = require('path');
const xmlJs = require('xml-js');
const {fileOptions} = require('./fs-utils');
const {sourceDirectoryPath} = require('./path-utils');

const rssFile = 'rss.xml';

/**
 * Create sitemap with posts.
 * @param posts {Post[]} All available posts.
 */
function createRss(posts) {
  // Rss data.
  const rss = {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'utf-8',
      },
    },
    rss: {
      _attributes: {
        version: '2.0',
      },
      channel: {
        title: {
          _text: 'LOGLOG',
        },
        link: {
          _text: 'https://tk2rush90.github.io',
        },
        description: {
          _text: `Welcome to the full-stack developer's personal space with GitHub pages`,
        },
        item: [],
      },
    }
  };

  // Add posts to sitemap.
  posts.forEach(post => {
    const url = `https://tk2blog90.github.io/blog/post/${post.id}`;

    rss.rss.channel.item.push({
      title: {
        _text: post.title,
      },
      link: {
        _text: url,
      },
      description: {
        _text: post.description,
      },
      pubDate: {
        _text: new Date(post.created).toUTCString(),
      },
      guid: {
        _text: url,
      },
    });
  });

  const xml = xmlJs.js2xml(rss, {
    compact: true,
  });

  fs.writeFileSync(path.join(sourceDirectoryPath, rssFile), xml, fileOptions);
}

module.exports = {
  createRss,
};
