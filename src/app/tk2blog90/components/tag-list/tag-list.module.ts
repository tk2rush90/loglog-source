import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagListComponent} from './tag-list.component';
import {RouterModule} from '@angular/router';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';


@NgModule({
  declarations: [
    TagListComponent
  ],
  exports: [
    TagListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RippleModule
  ]
})
export class TagListModule { }
