import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlainMarkdownService} from '@tk2blog90/services/plain-markdown/plain-markdown.service';
import {MarkdownModule} from 'ngx-markdown';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
  ],
  providers: [
    PlainMarkdownService,
  ]
})
export class PlainMarkdownModule { }
