import {Inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT, Location} from '@angular/common';
import {DateLike} from '@tk-ui/others/types';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {environment} from '../../../../environments/environment';

export interface SEOProperties {
  title?: string;
  description?: string;
  created?: DateLike;
  keywords?: string[];
  pathname?: string;
  thumbnail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(Location) private location: Location,
    private title: Title,
    private meta: Meta,
  ) { }

  /**
   * Update SEO properties.
   * @param properties Properties.
   */
  update(properties: SEOProperties = {}): void {
    const {
      title = environment.title,
      pathname = this.location.path(false),
      description = environment.description,
      created,
      thumbnail = environment.thumbnail,
      keywords = environment.keywords,
    } = properties;

    // Remove tag metas and published date.
    while (this.meta.getTag(`property='article:tag'`)) {
      this.meta.removeTag(`property='article:tag'`);
    }

    this.meta.removeTag(`property='article:published_time'`);

    // Set current url.
    const href = environment.href + pathname;
    const canonicalLink: HTMLLinkElement = this.document.querySelector(`link[rel='canonical']`) || this.document.createElement('link');

    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', href);

    this.meta.updateTag({
      name: 'twitter:url',
      content: href,
    });

    this.meta.updateTag({
      property: 'og:url',
      content: href,
    });

    // Set title.
    if (title) {
      this.title.setTitle(title);
      this.meta.updateTag({
        property: 'og:title',
        content: title,
      });

      this.meta.updateTag({
        name: 'twitter:title',
        content: title,
      });
    }

    // Set description.
    if (description) {
      this.meta.updateTag({
        name: 'description',
        content: description,
      });

      this.meta.updateTag({
        name: 'twitter:description',
        content: description,
      });

      this.meta.updateTag({
        property: 'og:description',
        content: description,
      });
    }

    // Set thumbnail.
    if (thumbnail) {
      // Add query param to show new thumbnail without caching.
      const _thumbnail = `${thumbnail}?v=${RandomUtil.key()}`;

      this.meta.updateTag({
        name: 'twitter:image:src',
        content: _thumbnail,
      });

      this.meta.updateTag({
        name: 'twitter:image',
        content: _thumbnail,
      });

      this.meta.updateTag({
        property: 'og:image',
        content: _thumbnail,
      });
    }

    // Set created date.
    if (created) {
      this.meta.addTag({
        property: 'article:published_time',
        content: new Date(created).toISOString(),
      });
    }

    // Set keywords.
    if (keywords.length > 0) {
      this.meta.updateTag({
        name: 'keywords',
        content: keywords.join(', '),
      });

      keywords.forEach(keyword => {
        this.meta.addTag({
          property: 'article:tag',
          content: keyword,
        });
      });
    }
  }
}
