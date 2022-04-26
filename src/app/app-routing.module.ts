import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '@tk2blog90/pages/home/home.component';
import {BlogComponent} from '@tk2blog90/pages/blog/blog.component';
import {ListComponent} from '@tk2blog90/pages/blog/list/list.component';
import {SearchComponent} from '@tk2blog90/pages/blog/search/search.component';
import {TagsComponent} from '@tk2blog90/pages/blog/tags/tags.component';
import {PostComponent} from '@tk2blog90/pages/blog/post/post.component';
import {DraftComponent} from '@tk2blog90/pages/blog/draft/draft.component';
import {NotFoundComponent} from '@tk2blog90/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: ListComponent,
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'tags',
        component: TagsComponent,
      },
      {
        path: 'post/:id',
        component: PostComponent,
      },
      {
        path: 'draft/:id',
        component: DraftComponent,
      },
    ]
  },
  {
    path: 'error/404',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
