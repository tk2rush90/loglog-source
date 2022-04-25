import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostListComponent} from './post-list.component';
import {PostItemComponent} from '@tk2blog90/components/post-list/post-item/post-item.component';
import {RouterModule} from '@angular/router';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {LoadingSpinnerModule} from '@tk-ui/components/loading-spinner/loading-spinner.module';


@NgModule({
  declarations: [
    PostListComponent,
    PostItemComponent,
  ],
  exports: [
    PostListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IconModule,
    LoadingSpinnerModule
  ]
})
export class PostListModule { }
