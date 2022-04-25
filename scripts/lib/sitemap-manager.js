const fs = require('fs');
const path = require('path');
const xmlJs = require('xml-js');
const {fileOptions} = require('./fs-utils');
const {sourceDirectoryPath} = require('./path-utils');

const siteMapFile = 'sitemap.xml';

/**
 * Create sitemap with posts.
 * @param posts {PostLookup[]} All available posts.
 */
function createSiteMap(posts) {
  // Sitemap data.
  const sitemap = {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    },
    urlset: {
      _attributes: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      url: [
        // Home page.
        {
          loc: {
            _text: 'https://tk2blog90.github.io/',
          },
          lastmod: {
            _text: new Date().toUTCString(),
          },
          changefreq: {
            _text: 'weekly',
          },
          priority: {
            _text: '1.0000',
          },
        },
        // Blog list page.
        {
          loc: {
            _text: 'https://tk2blog90.github.io/blog/list',
          },
          lastmod: {
            _text: new Date().toUTCString(),
          },
          changefreq: {
            _text: 'daily',
          },
          priority: {
            _text: '1.0000',
          },
        },
        // Blog search page.
        {
          loc: {
            _text: 'https://tk2blog90.github.io/blog/search',
          },
          lastmod: {
            _text: new Date().toUTCString(),
          },
          changefreq: {
            _text: 'daily',
          },
          priority: {
            _text: '1.0000',
          },
        },
        // Blog tags page.
        {
          loc: {
            _text: 'https://tk2blog90.github.io/blog/tags',
          },
          lastmod: {
            _text: new Date().toUTCString(),
          },
          changefreq: {
            _text: 'daily',
          },
          priority: {
            _text: '1.0000',
          },
        },
      ],
    }
  };

  // Add posts to sitemap.
  posts.forEach(post => {
    sitemap.urlset.url.push({
      loc: {
        _text: `https://tk2blog90.github.io/blog/post/${post.id}`
      },
      lastmod: {
        _text: new Date().toUTCString(),
      },
      changefreq: {
        _text: 'daily',
      },
      priority: {
        _text: '0.8',
      },
    });
  });

  const xml = xmlJs.js2xml(sitemap, {
    compact: true,
  });

  fs.writeFileSync(path.join(sourceDirectoryPath, siteMapFile), xml, fileOptions);
}

module.exports = {
  createSiteMap,
};
