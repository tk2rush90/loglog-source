import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultiSelectComponent} from './multi-select.component';
import {SelectBaseModule} from '@tk-ui/components/select-base/select-base.module';
import {SelectModule} from '@tk-ui/components/select/select.module';


@NgModule({
  declarations: [MultiSelectComponent],
  exports: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    SelectBaseModule,
    SelectModule,
  ]
})
export class MultiSelectModule { }
