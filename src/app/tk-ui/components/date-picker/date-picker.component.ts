import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Optional, Self} from '@angular/core';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {NgControl} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends FormControlBaseDirective<Date> implements OnInit {
  // Set maximum date.
  @Input() maxDate?: Date;

  // Set minimum date.
  @Input() minDate?: Date;

  // Date value.
  date!: Date;

  // Calendar opened state.
  opened = false;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    protected override changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngOnInit(): void {
  }

  /**
   * Override write value.
   * @param value Value.
   */
  override writeValue(value: Date) {
    this.date = value;
  }

  /**
   * Open the calendar.
   */
  openCalendar(): void {
    if (!this.ngControl.disabled) {
      this.opened = true;
    }
  }

  /**
   * Handle date change.
   * @param date Changed date.
   */
  onDateChange(date?: Date): void {
    if (date) {
      this.setValue(date);
    }

    this.opened = false;
  }
}
