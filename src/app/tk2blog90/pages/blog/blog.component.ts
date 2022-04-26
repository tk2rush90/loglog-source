import {Component, ElementRef, HostListener, Inject, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {Location} from '@angular/common';
import {ListComponent} from '@tk2blog90/pages/blog/list/list.component';

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
   * Current route page.
   */
  route: ListComponent | any;

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
   * Detect scroll event of host element.
   */
  @HostListener('scroll')
  onHostScroll(): void {
    this._checkScrolledState();
    this._checkScrollEnd();
  }

  /**
   * Listen route activate event to get current routing component.
   * @param component Current routing component.
   */
  onRouteActivate(component: ListComponent | any): void {
    this.route = component;
  }

  /**
   * Check the host element scroll position to add scrolled class to header.
   */
  private _checkScrolledState(): void {
    this.scrolled = this.element.scrollTop > 150;
  }

  /**
   * Check whether the host element meets end of scroll or not
   * to get next page of post list.
   */
  private _checkScrollEnd(): void {
    if (this.element.scrollTop === this.element.scrollHeight - this.element.offsetHeight) {
      if (this.route instanceof ListComponent) {
        this.route.getNextPage();
      }
    }
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
