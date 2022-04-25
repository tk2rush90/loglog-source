import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {TagService} from '@tk2blog90/services/app/tag.service';
import {finalize} from 'rxjs';
import {PostItem} from '@tk2blog90/models/post-item';
import {SeoService} from '@tk2blog90/services/app/seo.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class TagsComponent implements OnInit, OnDestroy {
  /**
   * Filtered post list.
   */
  posts: PostItem[] = [];

  /**
   * Post loading state.
   */
  loading = false;

  /**
   * Selected tag list.
   */
  selectedTags: string[] = [];

  /**
   * Selectable tag list.
   */
  selectableTags: string[] = [];

  /**
   * All available tag list.
   */
  private _tags: string[] = [];

  /**
   * Map of selected tags.
   * The key is tag name.
   */
  private _selectedTagMap: { [k: string]: boolean } = {};

  constructor(
    private seoService: SeoService,
    private tagService: TagService,
    private dataApiService: DataApiService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this.seoService.update({
      title: 'LOGLOG - Search posts with tags',
      description: 'Search some interesting posts from the LOGLOG blog.',
    });

    this._getTagList();
    this._subscribeSelectedTags();
  }

  ngOnDestroy(): void {
    this.tagService.clearTags();
  }

  /**
   * Get all available tag list.
   */
  private _getTagList(): void {
    const sub = this.dataApiService
      .getTagList()
      .subscribe({
        next: tags => {
          this._tags = tags;
          this._createSelectableTags();
          this._getPostsByTags();
        },
      });

    this.subscriptionService.store('_getTagList', sub);
  }

  /**
   * Subscribe selected tags to update the UI.
   */
  private _subscribeSelectedTags(): void {
    const sub = this.tagService
      .selectedTags$
      .subscribe(selectedTags => {
        this.selectedTags = selectedTags;
        this._selectedTagMap = {};

        selectedTags.forEach(tag => {
          this._selectedTagMap[tag] = true;
        });

        this._createSelectableTags();
        this._getPostsByTags();
      });

    this.subscriptionService.store('_subscribeSelectedTags', sub);
  }

  /**
   * Create selectable tag by removing selected tags from the all tags.
   */
  private _createSelectableTags(): void {
    this.selectableTags = this._tags.filter(tag => {
      return !this._selectedTagMap[tag];
    });
  }

  /**
   * Get posts by selected tags.
   */
  private _getPostsByTags(): void {
    const sub = this.dataApiService
      .getPostsByTags(this.selectedTags)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          this.posts = res;
        },
      });

    this.subscriptionService.store('_getPostsByTags', sub);
    this.loading = true;
  }
}
