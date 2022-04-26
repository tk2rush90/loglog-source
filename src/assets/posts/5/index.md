The most representative way to build a blog using GitHub pages is
to use the [Jekyll](https://jekyllrb-ko.github.io/) template.
I also made my blog using Jekyll template.
However, I recently renewed it based on Angular,
and this post is about why and how I created the Angular based GitHub pages blog.

# Why Angular?

Jekyll template is a great tool that allows you to build a simple blog with GitHub pages.
Search engines can be optimized, posts can be easily written through markdown,
and templates can be easily customized if you know a little HTML, CSS, and Javascript.
In fact, you need to know [Liquid](https://jekyllrb.com/docs/liquid/) grammar, but it is not difficult either.

However, there are also disadvantages, which are difficult to use frontend frameworks.
For this reason, there was a problem that more time and effort were needed to create each screen or component,
and maintenance was difficult.

So I decided to use Angular to remake my blog,
and the reason I chose Angular is simple.
Because it is the best frontend framework I know.

In addition, when using Angular with Angular Universal,
HTML contents that should be rendered on the server
can be made into actual HTML files in advance by using the prerendering.
This means that even GitHub pages, which cannot build servers,
can create Angular applications with fully supported SEO.

# How to create GitHub pages blog with Angular

Angular and the prerendering feature of Angular Universal are not described here.
Let's check the official documentation instead.

- [Angular](https://angular.io/)
- [Angular Universal](https://angular.io/guide/universal)
- [Angular Universal prerendering](https://angular.io/guide/prerendering)

Since Angular prepared all the ingredients for the cooking,
all I had to do was make data for prerendering.

## Prepare raw post data

The list of required data is as follows:

- Pagination data for displaying the post list.
- Post detail data to show the post page.
- Entire posts data to be used for post search.
- Entire tags data to be used on the tag search page.

For this, it was necessary to define the post structure correctly,
and the way I chose was to create one directory per post.
And then, create a json file containing the metadata of the post and a markdown file for the contents.

```
// The `assets` directory is Angular's default asset root.
// All the posts should be place in `posts` directory.
// The directory name in `posts` will be an `id` of each post.

assets
└ posts
  └ directory
    ├ meta.json
    └ index.md
```

I made the meta.json file have the following contents:

```json
{
  "title": "string",
  "description": "string",
  "keywords": [
    "string"
  ],
  "tags": [
    "string"
  ],
  "banner": "string",
  "thumbnail": "string",
  "bannerCredit": {
    "name": "string",
    "id": "string"
  },
  "publish": "string"
}
```

The description of each property is as follows.

- `title`: Post title.
- `description`: Post description. It is not for SEO. The description for SEO will be created by using post contents.
- `keywords`: Post keywords for SEO.
- `tags`: Post tags. Will be used for searching posts by tags.
- `banner`: Post banner image. It is shown from post detail page.
- `thubmnail`: Post thumbnail image. It is shown from post list page.
- `bannerCredit`: The credit text for post banner. It is for [Unsplash](https://unsplash.com) images. The `name` is username of unsplash photographer and `id` is his/her user id.
- `publish`: Post publish datetime. If it is not set, post created date will be created date of `index.md`.

## Create refined data during the build process

After creating the post, I could create a static HTML file using Angular prerendering,
but before that, I had to create data for prerendering.

To do this, I created a script that refines the raw post data.
Since it is too long to explain everything, I will only introduce function that make raw post data to a json file.

```javascript
const fs = require('fs');
const path = require('path');

/**
 * Get all available posts.
 * @returns {Post[]} All available posts.
 */
function getPosts() {
  const postDirectoryPath = `path-to-'assets/posts'`;
  const contents = fs.readdirSync(postDirectoryPath);
  const posts = [];

  contents.forEach(content => {
    const metaJson = fs.readFileSync(path.join(postDirectoryPath, content, 'meta.json'), {encoding: 'utf-8'});
    const postContents = fs.readFileSync(path.join(postDirectoryPath, content, 'index.md'), {encoding: 'utf-8'});
    const postStat = fs.statSync(path.join(postDirectoryPath, content, 'index.md'));
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
```

The `posts` returned by the `getPosts()` method is an array of object
which is made of each post directory within the `/assets/posts` directory.

Now it's done!
Since post data is made into objects,
it is very easy to extract tags,
extract each post data,
extract pagination data for listing,
and create these as json files.
You can also create your own sitemap and rss files with script.

Next, use the generated json files to render your components
and run Angular prerendering, then magically the static HTML files will be created.

# Conclusion

I know the explanation is not enough.
But I want you to know that it is difficult to explain everything.
The key is to use Angular prerendering and to pre-generate data for prerendering using scripts.
If you need more information, check out [this blog's repository](https://github.com/tk2rush90/loglog-source).
Scripts for data generation are located in the `/scripts` directory.
