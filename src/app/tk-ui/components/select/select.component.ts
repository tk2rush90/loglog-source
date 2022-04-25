import {ChangeDetectorRef, Component, ElementRef, OnInit, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {SelectBaseComponent} from '@tk-ui/components/select-base/select-base.component';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent<T> extends SelectBaseComponent<T> implements OnInit {
  /**
   * override value type from SelectBaseComponent
   */
  override value: T | undefined;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    public override elementRef: ElementRef<HTMLElement>,
    protected override changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, elementRef, changeDetectorRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Handle option changes.
   * @param option The changed option.
   */
  onOptionChanged(option?: OptionItem<T | undefined>): void {
    if (option) {
      this.setValue(option.value);
    }

    this.close();
  }
}
