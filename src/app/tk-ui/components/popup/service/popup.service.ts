import {ComponentRef, Injectable, Injector, Type} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PopupOutletComponent} from '@tk-ui/components/popup/popup-outlet/popup-outlet.component';

export const POPUP_DATA = 'POPUP_DATA';
export const POPUP_BOUNDING_X = 'POPUP_BOUNDING_X';
export const POPUP_BOUNDING_Y = 'POPUP_BOUNDING_Y';

export interface PopupOptions {
  data?: any;
  x?: number;
  y?: number;
  onClose?: (result: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  // Popup outlet.
  private _outlet?: PopupOutletComponent;

  // ComponentRef for created popup.
  private _componentRef?: ComponentRef<any>;

  // The component.
  private _component?: Type<any>;

  // The options.
  private _options?: PopupOptions;

  constructor() {
  }

  // Popup opened state.
  private _popupOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Get popup opened state as observable.
   */
  get popupOpened$(): Observable<boolean> {
    return this._popupOpened$.asObservable();
  }

  /**
   * Register the popup outlet.
   * @param outlet Outlet.
   */
  registerOutlet(outlet: PopupOutletComponent): void {
    this._outlet = outlet;
  }

  /**
   * Unregister the popup outlet.
   */
  unregisterOutlet(): void {
    this.close();
    this._outlet = undefined;
  }

  /**
   * Open the popup.
   * @param component Component to create.
   * @param options Options for popup.
   */
  open<T>(component: Type<T>, options: PopupOptions): void {
    if (this._outlet) {
      this._component = component;
      this._options = options;

      this._componentRef = this._outlet.viewContainerRef.createComponent(this._component, {
        injector: Injector.create({
          providers: [
            {
              provide: POPUP_BOUNDING_X,
              useValue: this._options.x,
            },
            {
              provide: POPUP_BOUNDING_Y,
              useValue: this._options.y,
            },
            {
              provide: POPUP_DATA,
              useValue: this._options.data,
            },
          ],
          parent: this._outlet.viewContainerRef.injector,
        }),
      });

      this._componentRef.changeDetectorRef.detectChanges();
      this._popupOpened$.next(true);
    }
  }

  /**
   * Close the popup.
   * @param result Result.
   */
  close(result?: any): void {
    if (this._options?.onClose) {
      this._options.onClose(result);
    }

    if (this._componentRef) {
      this._componentRef.destroy();
    }

    this._componentRef = undefined;
    this._component = undefined;
    this._options = undefined;
    this._popupOpened$.next(false);
  }
}
