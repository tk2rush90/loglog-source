import {Component, NgZone, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {PostItem} from '@tk2blog90/models/post-item';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {finalize} from 'rxjs';
import {SeoService} from '@tk2blog90/services/app/seo.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ListComponent implements OnInit {
  /**
   * The post items to display.
   */
  posts: PostItem[] = [];

  /**
   * Post loading state.
   */
  loading = false;

  /**
   * The number of page to get posts.
   */
  private _page = 0;

  /**
   * The state of having next page.
   */
  private _hasNext = false;

  constructor(
    private ngZone: NgZone,
    private seoService: SeoService,
    private platformService: PlatformService,
    private dataApiService: DataApiService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this.seoService.update({
      title: `LOGLOG - A full-stack developer's log`,
      description: `Mainly about programming, but it also talking about various topics such as music, travel, and games, etc.`,
    });

    if (this.platformService.isBrowser) {
      this.getPostList();
    }
  }

  /**
   * Get post list.
   */
  getPostList(page = this._page): void {
    const sub = this.dataApiService
      .getPostList(page)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          // If page is `0`, clear previous loaded posts.
          if (page === 0) {
            this.posts = [];
          }

          this.posts.push(...res.data);
          this._hasNext = res.hasNext;
        },
      });

    this.subscriptionService.store('getPostList', sub);
    this.loading = true;
  }
}
