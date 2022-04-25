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
import {DateUtil} from '@tk-ui/utils/date.util';
import {CalendarDate} from '@tk-ui/models/calendar-date';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('fading', [
      state('void', style({
        opacity: 0,
      })),
      state('show', style({
        opacity: 1,
      })),
      transition('void <=> show', animate(100)),
    ]),
  ],
  providers: [
    EventListenerService,
  ]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // Current selected date.
  @Input() currentDate!: Date;

  // Maximum date.
  @Input() maxDate?: Date;

  // Minimum date.
  @Input() minDate?: Date;

  // Datepicker container element.
  @Input() datePickerContainer!: HTMLElement;

  // Date change emitter.
  @Output() dateChange: EventEmitter<Date | undefined> = new EventEmitter<Date | undefined>();

  // Calendar container.
  @ViewChild('calendarContainer') calendarContainer!: ElementRef<HTMLElement>;

  // State of fading animation.
  fading = 'void';

  // Calendar dates.
  calendarDates: CalendarDate[] = [];

  // The starting date of current calendar.
  calendarDate!: Date;

  // The day of weeks.
  calendarDayOfWeeks = [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
  ];

  // The x position.
  private _x = 0;

  // The y position.
  private _y = 0;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    private eventListenerService: EventListenerService,
  ) {
  }

  /**
   * Get left style.
   */
  get left(): string {
    return `${this._x}px`;
  }

  /**
   * Get top style.
   */
  get top(): string {
    return `${this._y}px`;
  }

  /**
   * Get calendar year.
   */
  get calendarYear(): number {
    return this.calendarDate.getFullYear();
  }

  /**
   * Get calendar month.
   */
  get calendarMonth(): number {
    return this.calendarDate.getMonth();
  }

  ngOnInit(): void {
    this.fading = 'show';
    this.createCalendar();
    this.eventListenerService.addEvent(window, 'scroll', this._handleWindowScroll, true);
  }

  ngAfterViewInit(): void {
    this._setPosition();
  }

  /**
   * Listen window keydown event.
   * @param event Event.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    event.preventDefault();

    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this.onClickDate();
    }
  }

  /**
   * Listen window resize event to close option.
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.onClickDate();
  }

  /**
   * Create calendar with year and month.
   * @param year The year of calendar.
   * @param month The month of calendar.
   */
  createCalendar(year = this.currentDate.getFullYear(), month = this.currentDate.getMonth()): void {
    this.calendarDate = new Date(year, month, 1);
    this.calendarDates = DateUtil.calendar({
      year,
      month,
    });
  }

  /**
   * Create calendar for previous month.
   */
  toPreviousMonth(): void {
    this.createCalendar(this.calendarYear, this.calendarMonth - 1);
  }

  /**
   * Create calendar for next month.
   */
  toNextMonth(): void {
    this.createCalendar(this.calendarYear, this.calendarMonth + 1);
  }

  /**
   * Create calendar for previous year.
   */
  toPreviousYear(): void {
    this.createCalendar(this.calendarYear - 1, this.calendarMonth);
  }

  /**
   * Create calendar for next year.
   */
  toNextYear(): void {
    this.createCalendar(this.calendarYear + 1, this.calendarMonth);
  }

  /**
   * Check whether the date is current date or not.
   * @param date Date.
   */
  isCurrentDate(date: CalendarDate): boolean {
    const _year = this.currentDate.getFullYear();
    const _month = this.currentDate.getMonth();
    const _date = this.currentDate.getDate();

    return date.year === _year && date.month === _month && date.date === _date;
  }

  /**
   * Check whether the date over the restricted range.
   * @param date Date to check.
   */
  isOverDateRange(date: CalendarDate): boolean {
    let maxAvailable = true;
    let minAvailable = true;

    if (this.maxDate) {
      maxAvailable = DateUtil.isLater(this.maxDate, date.originalObject);
    }

    if (this.minDate) {
      minAvailable = DateUtil.isLater(date.originalObject, this.minDate);
    }

    return !maxAvailable || !minAvailable;
  }

  /**
   * Handle click date.
   * @param date Date.
   */
  onClickDate(date?: CalendarDate): void {
    this.dateChange.emit(date?.originalObject);
  }

  /**
   * Set the option container position.
   */
  private _setPosition(): void {
    const datePickerContainerRect = this.datePickerContainer.getBoundingClientRect();
    const calendarContainerRect = this.calendarContainer.nativeElement.getBoundingClientRect();

    const bottomAvailable = datePickerContainerRect.bottom + calendarContainerRect.height < window.innerHeight;
    const topAvailable = datePickerContainerRect.top - calendarContainerRect.height > 0;
    let y;

    if (bottomAvailable) {
      y = datePickerContainerRect.bottom;
    } else if (topAvailable) {
      y = datePickerContainerRect.top - calendarContainerRect.height;
    } else {
      y = datePickerContainerRect.bottom;
    }

    this._x = datePickerContainerRect.x;
    this._y = y;

    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handle window scroll event.
   */
  private _handleWindowScroll = (event: Event): void => {
    if (event.target === this.elementRef.nativeElement) {
      event.stopPropagation();
    } else {
      this.onClickDate();
    }
  }
}
