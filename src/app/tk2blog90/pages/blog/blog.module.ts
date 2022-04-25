import {NgModule, SecurityContext} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogComponent} from './blog.component';
import {RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {SearchComponent} from './search/search.component';
import {TagsComponent} from './tags/tags.component';
import {HeaderModule} from '@tk2blog90/components/header/header.module';
import {OwnerModule} from '@tk2blog90/components/owner/owner.module';
import {PostListModule} from '@tk2blog90/components/post-list/post-list.module';
import {PostComponent} from './post/post.component';
import {MarkdownModule, MarkedOptions, MarkedRenderer} from 'ngx-markdown';
import {TableOfContentsModule} from '@tk2blog90/components/table-of-contents/table-of-contents.module';
import {TagListModule} from '@tk2blog90/components/tag-list/tag-list.module';
import {CopyrightsModule} from '@tk2blog90/components/copyrights/copyrights.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormsModule} from '@angular/forms';
import {OuterLinkModule} from '@tk2blog90/components/outer-link/outer-link.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {DraftComponent} from './draft/draft.component';
import {LoadingSpinnerModule} from '@tk-ui/components/loading-spinner/loading-spinner.module';
import {PlainMarkdownModule} from '@tk2blog90/services/plain-markdown/plain-markdown.module';

const renderer = new MarkedRenderer();

renderer.link = (href, title, text) => {
  return `<a href="${href}" target="_blank" rel="nofollow noreferrer noopener">${text}</a>`
};

@NgModule({
  declarations: [
    BlogComponent,
    ListComponent,
    SearchComponent,
    TagsComponent,
    PostComponent,
    DraftComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderModule,
    OwnerModule,
    PostListModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          renderer,
        } as MarkedOptions,
      }
    }),
    TableOfContentsModule,
    TagListModule,
    CopyrightsModule,
    InputModule,
    FormsModule,
    OuterLinkModule,
    IconModule,
    LoadingSpinnerModule,
    PlainMarkdownModule,
  ],
})
export class BlogModule { }
