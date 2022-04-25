import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PostItem} from '@tk2blog90/models/post-item';
import {fadeIn, fadeInState} from '@tk2blog90/animations/fade-in';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {finalize} from 'rxjs';
import {SeoService} from '@tk2blog90/services/app/seo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    SubscriptionService,
  ],
  animations: [
    fadeIn,
  ]
})
export class SearchComponent implements OnInit {
  /**
   * State of fade in animation.
   */
  fadeIn = fadeInState.show;

  /**
   * Search text.
   */
  search = '';

  /**
   * Searched posts.
   */
  posts: PostItem[] = [];

  /**
   * Post loading state.
   */
  loading = false;

  constructor(
    private seoService: SeoService,
    private dataApiService: DataApiService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this.seoService.update({
      title: 'LOGLOG - Search posts with keyword',
      description: 'Search some interesting posts from the LOGLOG blog.',
    });
  }

  /**
   * Update search and get result posts.
   * @param search Updated search.
   */
  onSearchChange(search: string): void {
    this.search = search;
    this._getPostsBySearch();
  }

  /**
   * Get all posts by search.
   */
  private _getPostsBySearch(): void  {
    const sub = this.dataApiService
      .getPostsBySearch(this.search)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          this.posts = res;
        },
      });

    this.subscriptionService.store('_getPostsBySearch', sub);
    this.loading = true;
  }
}
