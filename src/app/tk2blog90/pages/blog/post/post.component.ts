import {ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PostDetail} from '@tk2blog90/models/post-detail';
import {TableOfContentsComponent} from '@tk2blog90/components/table-of-contents/table-of-contents.component';
import {DOCUMENT, Location} from '@angular/common';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {SeoService} from '@tk2blog90/services/app/seo.service';
import {MarkdownComponent} from 'ngx-markdown';
import {environment} from '../../../../../environments/environment';
import {fadeIn, fadeInName, fadeInState} from '@tk2blog90/animations/fade-in';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {PlainMarkdownService} from '@tk2blog90/services/plain-markdown/plain-markdown.service';
import {makeStateKey, TransferState} from '@angular/platform-browser';

const {
  href,
} = environment;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [
    SubscriptionService,
  ],
  animations: [
    fadeIn,
  ],
})
export class PostComponent implements OnInit, OnDestroy {
  /**
   * Reference to the TableOfContentsComponent.
   */
  @ViewChild(TableOfContentsComponent) tableOfContents!: TableOfContentsComponent;

  /**
   * Reference to the MarkdownComponent.
   */
  @ViewChild(MarkdownComponent) markdown!: MarkdownComponent;

  /**
   * Bind fade in-out animation.
   */
  @HostBinding(`@${fadeInName}`) fadeIn = fadeInState.show;

  /**
   * Post id.
   */
  protected _id: string | null = null;

  /**
   * Post key for transfer state.
   */
  private _stateKey = makeStateKey('63cfe5c3-0318-4826-bc42-d81e1ea7eea1');

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    @Inject(Location) protected location: Location,
    protected transferState: TransferState,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    protected seoService: SeoService,
    protected toastService: ToastService,
    protected platformService: PlatformService,
    protected plainMarkdownService: PlainMarkdownService,
    protected dataApiService: DataApiService,
    protected subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._subscribeParamMap();
  }

  ngOnDestroy(): void {
    if (this.platformService.isBrowser) {
      this.post = undefined;
    }
  }

  /**
   * Set post to transfer state.
   * @param post Post.
   */
  set post(post: PostDetail | undefined) {
    this.transferState.set<PostDetail | undefined>(this._stateKey, post);
  }

  /**
   * Get post from transfer state.
   */
  get post(): PostDetail | undefined {
    return this.transferState.get<PostDetail | undefined>(this._stateKey, undefined);
  }

  /**
   * Get banner credit link.
   */
  get creditLink(): string {
    return `https://unsplash.com/${this.post?.bannerCredit?.id}?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`;
  }

  /**
   * Get banner credit name.
   */
  get creditName(): string {
    return this.post?.bannerCredit?.name || '';
  }

  /**
   * Get current url.
   */
  get url(): string {
    return href + this.location.path(false);
  }

  /**
   * Get tweet url.
   */
  get tweetUrl(): string {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.url)}`;
  }

  /**
   * Scroll to fragment by finding heading with fragment.
   * @param fragment Fragment.
   */
  scrollToFragment(fragment: string | null): void {
    if (this.platformService.isBrowser) {
      const scrollableContainer = this.document.querySelector<HTMLElement>('app-blog')!;

      if (fragment) {
        const heading = this.document.querySelector<HTMLHeadingElement>(`#${fragment}`);

        if (heading) {
          const domRect = heading.getBoundingClientRect();

          // To show heading text correctly,
          // reduce the application header height.
          scrollableContainer.scrollTo(0, scrollableContainer.scrollTop + domRect.top - 70);
        } else {
          scrollableContainer.scrollTo(0, 0);
        }
      } else {
        scrollableContainer.scrollTo(0, 0);
      }
    }
  }

  /**
   * Copy post link.
   */
  copyPostLink(): void {
    navigator.clipboard.writeText(location.href)
      .then(() => {
        this.toastService.closeLatest();
        this.toastService.message('Link is copied');
      })
      .catch(() => {
        this.toastService.closeLatest();
        this.toastService.error('Failed to copy link');
      });
  }

  /**
   * Get post detail from the data api.
   */
  protected _getPostDetail(): void {
    if (this._id && !this.post) {
      const sub = this.dataApiService
        .getPostDetail(this._id)
        .subscribe({
          next: res => {
            this.post = res;
            this.changeDetectorRef.detectChanges();
            this._subscribeFragment();
            this._updateSEOProperties();
          },
          error: () => {
            this.router.navigate(['/error/404']);
          },
        });

      this.subscriptionService.store('_getPostDetail', sub);
    }
  }

  /**
   * Update SEO properties with post detail.
   */
  protected _updateSEOProperties(): void {
    if (this.post) {
      /**
       * The plain text of markdown.
       */
      const contents = this.plainMarkdownService.parse(this.post.contents);

      this.seoService.update({
        title: this.post.title,
        // Normalize the whitespaces and linebreaks.
        description: contents
          .replace(/\n/gmi, ' ')
          .replace(/\s{2,}/gmi, ' ')
          .substring(0, 300),
        thumbnail: this.post.thumbnail,
        keywords: this.post.keywords,
        created: this.post.created,
      });
    }
  }

  /**
   * Subscribe fragment to scroll to specific heading.
   */
  protected _subscribeFragment(): void {
    const sub = this.activatedRoute
      .fragment
      .subscribe(fragment => {
        this.scrollToFragment(fragment);
      });

    this.subscriptionService.store('_subscribeFragment', sub);
  }

  /**
   * Subscribe `paramMap` to get post id from url.
   */
  private _subscribeParamMap(): void {
    const sub = this.activatedRoute
      .paramMap
      .subscribe(paramMap => {
        this._id = paramMap.get('id');
        this._getPostDetail();
      });

    this.subscriptionService.store('_subscribeParamMap', sub);
  }
}
