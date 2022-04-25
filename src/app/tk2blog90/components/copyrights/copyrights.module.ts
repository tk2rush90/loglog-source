import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightsComponent } from './copyrights.component';



@NgModule({
  declarations: [
    CopyrightsComponent
  ],
  exports: [
    CopyrightsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CopyrightsModule { }
