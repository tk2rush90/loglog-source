import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {PostItem} from '@tk2blog90/models/post-item';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {finalize} from 'rxjs';
import {SeoService} from '@tk2blog90/services/app/seo.service';
import {makeStateKey, TransferState} from '@angular/platform-browser';

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

  /**
   * Posts state key.
   */
  private _stateKey = makeStateKey('8713b108-efcd-42f3-ac0b-29d160885378');

  constructor(
    private transferState: TransferState,
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

    if (this.posts.length === 0) {
      this._getPostList();
    }
  }

  /**
   * Set posts item to transfer state.
   * @param posts Posts.
   */
  set posts(posts: PostItem[]) {
    this.transferState.set<PostItem[]>(this._stateKey, posts);
  }

  /**
   * Get post items from transfer state.
   */
  get posts(): PostItem[] {
    return this.transferState.get<PostItem[]>(this._stateKey, []);
  }

  /**
   * Get the post list of next page.
   */
  getNextPage(): void {
    if (this._hasNext) {
      this._getPostList(this._page + 1);
    }
  }

  /**
   * Get post list.
   */
  private _getPostList(page = this._page): void {
    if (!this.loading) {
      const sub = this.dataApiService
        .getPostList(page)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: res => {
            // If page is `0`, clear previous loaded posts.
            if (page === 0) {
              this.posts = [];
            }

            this.posts = [...this.posts, ...res.data];
            this._hasNext = res.hasNext;
          },
        });

      this.subscriptionService.store('getPostList', sub);
      this.loading = true;
    }
  }
}
