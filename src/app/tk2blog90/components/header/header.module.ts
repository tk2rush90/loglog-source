import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {RouterModule} from '@angular/router';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';
import {ThemeButtonModule} from '@tk2blog90/components/theme-button/theme-button.module';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IconModule,
    RippleModule,
    ThemeButtonModule
  ]
})
export class HeaderModule { }
