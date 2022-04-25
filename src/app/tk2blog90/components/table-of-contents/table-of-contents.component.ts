import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';
import {AppTheme, ThemeService} from '@tk2blog90/services/app/theme.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ActivatedRoute} from '@angular/router';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class TableOfContentsComponent implements OnInit {
  /**
   * Emit with fragment when link is clicked.
   */
  @Output() linkClick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Post id.
   */
  id: string | null = null;

  /**
   * Heading list.
   */
  headings: Heading[] = [];

  /**
   * Target element to get headings.
   */
  private _target?: HTMLElement;

  /**
   * Theme value.
   */
  private _theme: AppTheme = 'light';

  constructor(
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._subscribeTheme();
    this._subscribeParamMap();
  }

  /**
   * Set target element and render table of contents.
   */
  @Input() set target(target: HTMLElement) {
    this._target = target;
    this._render();
  }

  /**
   * Bind light theme class.
   */
  @HostBinding('class.light') get light(): boolean {
    return this._theme === 'light';
  }

  /**
   * Bind dark theme class.
   */
  @HostBinding('class.dark') get dark(): boolean {
    return this._theme === 'dark';
  }

  /**
   * Get anchor class by heading level.
   * @param heading Heading.
   */
  getAnchorClass(heading: Heading): string {
    return `indent-${heading.level}`;
  }

  /**
   * Emit `linkClick` emitter with fragment.
   * @param heading Heading.
   */
  emitLinkClick(heading: Heading): void {
    this.linkClick.emit(heading.id);
  }

  /**
   * Render the table of contents.
   */
  private _render(): void {
    if (this._target) {
      const headings = this._target.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6');

      headings.forEach(heading => {
        const tagName = heading.tagName.toLowerCase();
        const levelString = tagName.replace('h', '');

        this.headings.push({
          id: heading.id,
          text: heading.innerText,
          level: ParsingUtil.toInteger(levelString),
        });
      });
    }
  }

  /**
   * Subscribe theme to change the table of contents' color.
   */
  private _subscribeTheme(): void {
    const sub = this.themeService
      .theme$
      .subscribe(theme => {
        this._theme = theme;
      });

    this.subscriptionService.store('_subscribeTheme', sub);
  }

  /**
   * Subscribe `paramMap` to get post id.
   */
  private _subscribeParamMap(): void {
    const sub = this.activatedRoute
      .paramMap
      .subscribe(paramMap => {
        this.id = paramMap.get('id');
      });

    this.subscriptionService.store('_subscribeParamMap', sub);
  }
}
