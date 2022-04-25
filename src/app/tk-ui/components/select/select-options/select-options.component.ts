import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {OptionItem} from '@tk-ui/models/option-item';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
  providers: [
    EventListenerService,
  ]
})
export class SelectOptionsComponent<T> implements OnInit, AfterViewInit {
  // The value.
  @Input() value: T | undefined;

  // The options.
  @Input() options: OptionItem<T>[] = [];

  // The container element.
  @Input() selectContainer!: HTMLElement;

  // Option selected emitter.
  @Output() optionSelected: EventEmitter<OptionItem<T | undefined> | undefined> = new EventEmitter<OptionItem<T | undefined> | undefined>();

  // The reference to options container.
  @ViewChild('optionsContainer') optionsContainer!: ElementRef<HTMLElement>;

  // The focused index.
  focusedIndex = -1;

  // The x position of options.
  private _x = 0;

  // The y position of options.
  private _y = 0;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    private eventListenerService: EventListenerService,
  ) {
  }

  // The options' container width.
  private _width = 0;

  /**
   * Get the width of options' container.
   */
  get width(): string {
    return `${this._width}px`;
  }

  /**
   * Get left style value.
   */
  get left(): string {
    return `${this._x}px`;
  }

  /**
   * Get top style value.
   */
  get top(): string {
    return `${this._y}px`;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._setPosition();
    this.eventListenerService.addEvent(window, 'scroll', this._handleWindowScroll, true);
  }

  /**
   * Emit `optionSelected` emitter.
   * @param item Selected option.
   */
  onOptionClicked(item?: OptionItem<T | undefined>): void {
    this.optionSelected.emit(item);
  }

  /**
   * reset `focusedIndex`
   */
  resetFocusedIndex(): void {
    this.focusedIndex = -1;
  }

  /**
   * Listen window keydown event.
   * @param event Event.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    event.preventDefault();

    this._onEsc(event);
    this._onArrowDown(event);
    this._onArrowUp(event);
    this._onEnter(event);
  }

  /**
   * Listen window resize event to close option.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.onOptionClicked();
  }

  /**
   * handle esc event
   * @param event event
   */
  private _onEsc(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this.onOptionClicked();
    }
  }

  /**
   * handle arrow down event
   * @param event event
   */
  private _onArrowDown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.ArrowDown)) {
      this.focusedIndex = Math.min(this.focusedIndex + 1, this.options.length - 1);
    }
  }

  /**
   * handle arrow up event
   * @param event event
   */
  private _onArrowUp(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.ArrowUp)) {
      this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
    }
  }

  /**
   * handle enter event
   * @param event event
   */
  private _onEnter(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Enter)) {
      const option = this.options[this.focusedIndex];

      if (option) {
        this.onOptionClicked(option);
      }
    }
  }

  /**
   * Set the option container position.
   */
  private _setPosition(): void {
    const containerRect = this.selectContainer.getBoundingClientRect();
    const optionsContainerRect = this.optionsContainer.nativeElement.getBoundingClientRect();

    const bottomAvailable = containerRect.bottom + optionsContainerRect.height < window.innerHeight;
    const topAvailable = containerRect.top - optionsContainerRect.height > 0;
    let y;

    if (bottomAvailable) {
      y = containerRect.bottom;
    } else if (topAvailable) {
      y = containerRect.top - optionsContainerRect.height;
    } else {
      y = containerRect.bottom;
    }

    this._x = containerRect.x;
    this._y = y;
    this._width = containerRect.width;

    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handle window scroll event.
   */
  private _handleWindowScroll = (event: Event): void => {
    if (event.target === this.optionsContainer.nativeElement) {
      event.stopPropagation();
    } else {
      this.onOptionClicked();
    }
  }
}
