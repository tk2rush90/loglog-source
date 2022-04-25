# LOGLOG Source code

This is the source code of [LOGLOG Blog](https://tk2blog90.github.io).

This application is made with Angular and Angular Universal.

The repository of deployed codes is [here](https://github.com/tk2blog90/tk2blog90.github.io).

# Commands

```bash
# Run application from local.
ng serve -o

# Create API data, rss.xml, sitemap.xml with draft posts.
npm run create-data

# Publish the build data to GitHub branch directory.
# By default, the GitHub branch directory should be placed in same directory
# with this project.
# The name of GitHub branch directory should be `tk2blog90.github.io`.
npm run publish

# Run push command in GitHub branch directory.
npm run push

# Process creating data to pushing changes at once.
npm run build:github
```

# How to create post

All the draft posts should be placed in `/assets/posts` directory.

The name of subdirectory in `/assets/posts` is the `id` of each post.

Create a subdirectory to create a new post and create `meta.json` and `index.md` files in it.

The `meta.json` file contains metadata for the post
and `index.md` is a markdown file containing the contents of the post body.

The structure of the `meta.json` file is as follows:

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

- `title`: Post title.
- `description`: Post description. It is not for SEO. The description for SEO will be created by using post contents.
- `keywords`: Post keywords for SEO.
- `tags`: Post tags. Will be used for searching posts by tags.
- `banner`: Post banner image. It is shown from post detail page.
- `thubmnail`: Post thumbnail image. It is shown from post list page.
- `bannerCredit`: The credit text for post banner. It is for [Unsplash](https://unsplash.com) images. The `name` is username of unsplash photographer and `id` is his/her user id.
- `publish`: Post publish datetime. If it is not set, post created date will be created date of `index.md`.

# Routes

- `/`: Main page of LOGLOG.
- `/blog/list`: Default post list page.
- `/blog/search`: Keyword searched post list page.
- `/blog/tags`: Tag searched post list page.
- `/blog/post/:id`: Post detail page.
- `/blog/draft/:id`: Draft post detail page. Only works for local environment.
