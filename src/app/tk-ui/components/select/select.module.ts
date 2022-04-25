import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {SelectBaseModule} from '@tk-ui/components/select-base/select-base.module';
import {SelectOptionsComponent} from './select-options/select-options.component';


@NgModule({
  declarations: [SelectComponent, SelectOptionsComponent],
  exports: [
    SelectComponent,
    SelectOptionsComponent
  ],
  imports: [
    CommonModule,
    SelectBaseModule,
  ]
})
export class SelectModule { }
