import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatePickerComponent} from './date-picker.component';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormControlBaseModule} from '@tk-ui/components/form-control-base/form-control-base.module';
import {CalendarComponent} from './calendar/calendar.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';


@NgModule({
  declarations: [
    DatePickerComponent,
    CalendarComponent
  ],
  exports: [
    DatePickerComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    FormControlBaseModule,
    IconModule,
    RippleModule,
  ]
})
export class DatePickerModule {
}
