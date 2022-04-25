import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {PostComponent} from '@tk2blog90/pages/blog/post/post.component';
import {DOCUMENT, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SeoService} from '@tk2blog90/services/app/seo.service';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {DataApiService} from '@tk2blog90/services/api/data-api.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {PlainMarkdownService} from '@tk2blog90/services/plain-markdown/plain-markdown.service';

@Component({
  selector: 'app-draft',
  templateUrl: '../post/post.component.html',
  styleUrls: ['../post/post.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class DraftComponent extends PostComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) protected override document: Document,
    @Inject(Location) protected override location: Location,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute,
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override seoService: SeoService,
    protected override toastService: ToastService,
    protected override platformService: PlatformService,
    protected override plainMarkdownService: PlainMarkdownService,
    protected override dataApiService: DataApiService,
    protected override subscriptionService: SubscriptionService,
  ) {
    super(
      document,
      location,
      router,
      activatedRoute,
      changeDetectorRef,
      seoService,
      toastService,
      platformService,
      plainMarkdownService,
      dataApiService,
      subscriptionService,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Override `_getPostDetail()` method to get draft post.
   */
  protected override _getPostDetail() {
    if (this._id && !this.post) {
      const sub = this.dataApiService
        .getDraftPost(this._id)
        .subscribe({
          next: res => {
            this.post = res;
            this.changeDetectorRef.detectChanges();
            this._subscribeFragment();
            this._updateSEOProperties();
          },
        });

      this.subscriptionService.store('_getPostDetail', sub);
    }
  }
}
