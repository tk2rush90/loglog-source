import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeButtonComponent} from './theme-button.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';


@NgModule({
  declarations: [
    ThemeButtonComponent
  ],
  exports: [
    ThemeButtonComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    RippleModule
  ]
})
export class ThemeButtonModule { }
