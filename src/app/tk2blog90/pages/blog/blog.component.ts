import {Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class BlogComponent implements OnInit {
  /**
   * Content scrolled state.
   */
  scrolled = false;

  /**
   * Current pathname.
   */
  private _pathname = '';

  constructor(
    @Inject(Location) private location: Location,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._pathname = this.location.path(false);
    this._subscribeRouterEvent();
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Detect scroll event of host element to set header class.
   */
  @HostListener('scroll')
  onHostScroll(): void {
    this.scrolled = this.element.scrollTop > 150;
  }

  /**
   * Subscribe router event to move scroll to top on navigating.
   */
  private _subscribeRouterEvent(): void {
    const sub = this.router
      .events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Exclude the hash because hash can be changed from the post detail page.
          const pathname = this.location.path(false);

          if (this._pathname !== pathname) {
            this.element.scrollTo(0, 0);
            this._pathname = pathname;
          }
        }
      });

    this.subscriptionService.store('_subscribeRouterEvent', sub);
  }
}
