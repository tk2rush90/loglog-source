import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OwnerComponent} from './owner.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {OuterLinkModule} from '@tk2blog90/components/outer-link/outer-link.module';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';


@NgModule({
  declarations: [
    OwnerComponent
  ],
  exports: [
    OwnerComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    OuterLinkModule,
    RippleModule
  ]
})
export class OwnerModule { }
