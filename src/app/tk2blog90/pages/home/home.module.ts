import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {CopyrightsModule} from '@tk2blog90/components/copyrights/copyrights.module';
import {RouterModule} from '@angular/router';
import {OuterLinkModule} from '@tk2blog90/components/outer-link/outer-link.module';
import {ThemeButtonModule} from '@tk2blog90/components/theme-button/theme-button.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FlatButtonModule,
    IconModule,
    CopyrightsModule,
    RouterModule,
    OuterLinkModule,
    ThemeButtonModule,
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
