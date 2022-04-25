import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupOutletComponent} from './popup-outlet/popup-outlet.component';


@NgModule({
  declarations: [
    PopupOutletComponent
  ],
  exports: [
    PopupOutletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PopupModule {
}
