import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {ToastOutletComponent} from '@tk-ui/components/toast/components/toast-outlet/toast-outlet.component';
import {ToastMessageComponent} from '@tk-ui/components/toast/components/toast-message/toast-message.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * registered toast outlets
   * `k` is the id of each toast outlet
   */
  private _outlets: { [k: string]: ToastOutletComponent } = {};

  // The map of displaying toasts.
  // The `k` is the id of each toast message.
  private _toasts: { [k: string]: ComponentRef<ToastMessageComponent> } = {};

  // The ids of opened toasts.
  // The `k` is outlet id to map toasts by outlet.
  private _openedToastIds: { [k: string]: string[] } = {};

  constructor(
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * register toast outlet
   * @param outlet outlet
   */
  registerOutlet(outlet: ToastOutletComponent): void {
    this._outlets[outlet.id] = outlet;
    this._openedToastIds[outlet.id] = [];
  }

  /**
   * Unregister the outlet.
   * @param outlet Toast outlet.
   */
  unregisterOutlet(outlet: ToastOutletComponent): void {
    this._closeAllToastsByOutletId(outlet.id);

    delete this._outlets[outlet.id];
    delete this._openedToastIds[outlet.id];
  }

  /**
   * open the toast message for all registered outlets
   * @param options toast options
   */
  open(options: ToastOptions): void {
    Object.keys(this._outlets).forEach(outletId => {
      if (this._outlets[outletId].viewContainerRef) {
        this._createToast(outletId, options);
      }
    });
  }

  /**
   * Open default message.
   * @param message The message.
   * @param timer The closing timer.
   */
  message(message: string, timer = 5000): void {
    this.open({
      message,
      timer,
      type: ToastType.default,
    });
  }

  /**
   * Open error toast.
   * @param message The message.
   * @param timer The closing timer.
   */
  error(message: string, timer = 5000): void {
    this.open({
      message,
      timer,
      type: ToastType.error,
    });
  }

  /**
   * Close latest toast from the all outlets.
   */
  closeLatest(): void {
    Object.keys(this._openedToastIds).forEach(outletId => {
      const latestToastId = (this._openedToastIds[outletId] || []).pop();

      if (latestToastId) {
        this._destroyExistingToast(outletId, latestToastId);
      }
    });
  }

  /**
   * Close all toasts for all outlets.
   */
  closeAll(): void {
    Object.keys(this._openedToastIds).forEach(outletId => {
      this._closeAllToastsByOutletId(outletId);
    });
  }

  /**
   * Close the all toasts in outlet by outlet id.
   * @param outletId The outlet id to close all toasts.
   */
  private _closeAllToastsByOutletId(outletId: string): void {
    (this._openedToastIds[outletId] || []).forEach(toastId => {
      this._destroyExistingToast(outletId, toastId);
    });
  }

  /**
   * create toast for view container ref
   * @param outletId The key of outlets.
   * @param options toast options
   */
  private _createToast(outletId: string, options: ToastOptions): void {
    const viewContainerRef = this._outlets[outletId].viewContainerRef as ViewContainerRef;
    const toast = viewContainerRef.createComponent(ToastMessageComponent);
    const toastId = toast.instance.id;

    toast.instance.message = options.message;
    toast.instance.type = options.type || ToastType.default;
    toast.instance.count = options.timer || 5000;
    toast.changeDetectorRef.detectChanges();

    this._toasts[toastId] = toast;
    this._openedToastIds[outletId].push(toastId);

    this._subscribeCloseToast(outletId, toast);
  }

  /**
   * Subscribe close event of toast message.
   * @param outletId The key of outlet id.
   * @param toast The component reference to toast message.
   */
  private _subscribeCloseToast(outletId: string, toast: ComponentRef<ToastMessageComponent>): void {
    if (toast) {
      const sub = toast.instance.closeToast
        .subscribe(() => {
          this._destroyExistingToast(outletId, toast.instance.id);
        });

      this.subscriptionService.store(`_subscribeCloseToast${toast.instance.id}`, sub);
    }
  }

  /**
   * Destroy existing toast message
   * @param outletId The key of outlet for toast.
   * @param toastId The key of toast to close.
   */
  private _destroyExistingToast(outletId: string, toastId: string): void {
    const toast = this._toasts[toastId];

    // Destroy the target toast and remove the key from `this._toasts`.
    if (toast) {
      toast.destroy();
      this.subscriptionService.unSubscribe(`_subscribeCloseToast${toastId}`);

      // Remove the toast ComponentRef.
      delete this._toasts[toastId];
    }

    // Remove the destroyed toast id for outlet.
    this._openedToastIds[outletId] = (this._openedToastIds[outletId] || []).filter(_toastId => _toastId !== toastId);
  }
}

/**
 * toast type enum
 */
export enum ToastType {
  default = 'default',
  success = 'success',
  error = 'error',
}

export interface ToastOptions {
  /**
   * toast message to display
   */
  message: string;

  /**
   * toast type enum
   */
  type?: ToastType;

  /**
   * closing timer in milliseconds
   */
  timer?: number;
}
