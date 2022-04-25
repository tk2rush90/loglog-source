import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {FormControlBaseDirective} from '@tk-ui/components/form-control-base/form-control-base.directive';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-select-base',
  template: '',
})
export class SelectBaseComponent<T> extends FormControlBaseDirective<T> implements OnInit {
  /**
   * set placeholder
   */
  @Input() placeholder = 'Select...';
  /**
   * opened state
   */
  opened = false;
  /**
   * selected item's label
   */
  label = '';
  /**
   * selected item's value
   */
  value: any;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    public elementRef: ElementRef<HTMLElement>,
    protected override changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * option list for select component
   */
  protected _options: OptionItem<T>[] = [];

  /**
   * return the options
   */
  get options(): OptionItem<T>[] {
    return this._options;
  }

  /**
   * set options for select
   * @param options options
   */
  @Input() set options(options: OptionItem<T>[]) {
    this._options = options || [];
    this._setSelectedLabel();
  }

  ngOnInit(): void {
  }

  /**
   * open with input element
   * @param target target
   */
  openWithInput(target: HTMLInputElement): void {
    target.blur();
    this.open();
  }

  /**
   * open the options
   */
  open(): void {
    this.opened = true;
  }

  /**
   * close the options
   */
  close(): void {
    this.opened = false;
    this.markAsTouched();
  }

  /**
   * write value to component
   * @param value new value
   */
  override writeValue(value: any): void {
    this.value = value;
    this._setSelectedLabel();
  }

  /**
   * set selected label with value
   */
  protected _setSelectedLabel(): void {
    const option = this._options.find(item => item.value === this.value);

    if (option) {
      this.label = option.label;
    } else {
      this.label = '';
    }
  }
}
