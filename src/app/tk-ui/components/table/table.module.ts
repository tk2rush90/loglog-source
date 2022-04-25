import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from './table.component';
import {HeaderColumnDirective} from './header-column.directive';
import {BodyColumnDirective} from './body-column.directive';
import {IconModule} from '@tk-ui/components/icon/icon.module';


@NgModule({
  declarations: [
    TableComponent,
    HeaderColumnDirective,
    BodyColumnDirective
  ],
  exports: [
    TableComponent,
    BodyColumnDirective
  ],
  imports: [
    CommonModule,
    IconModule
  ]
})
export class TableModule {
}
