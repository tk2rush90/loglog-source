import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableOfContentsComponent} from './table-of-contents.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    TableOfContentsComponent,
  ],
  exports: [
    TableOfContentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class TableOfContentsModule { }
