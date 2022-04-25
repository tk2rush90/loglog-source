import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PopupService} from '@tk-ui/components/popup/service/popup.service';

/**
 * The outlet to display popup.
 */
@Component({
  selector: 'app-popup-outlet',
  templateUrl: './popup-outlet.component.html',
  styleUrls: ['./popup-outlet.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class PopupOutletComponent implements OnInit, OnDestroy {
  // The `ViewContainerRef` to render popup.
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  // Popup opened state to bind to class.
  popupOpened = false;

  constructor(
    private popupService: PopupService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this.popupService.registerOutlet(this);
    this._subscribePopupOpened();
  }

  ngOnDestroy(): void {
    this.popupService.unregisterOutlet();
  }

  /**
   * Close the popup.
   */
  close(): void {
    this.popupService.close();
  }

  /**
   * Subscribe popup opened state.
   */
  private _subscribePopupOpened(): void {
    const sub = this.popupService
      .popupOpened$
      .subscribe(res => this.popupOpened = res);

    this.subscriptionService.store('_subscribePopupOpened', sub);
  }
}
