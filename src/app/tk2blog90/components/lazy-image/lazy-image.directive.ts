import {AfterViewInit, Directive, ElementRef, HostBinding} from '@angular/core';
import {EventListenerService} from '@tk-ui/services/common/event-listener.service';

@Directive({
  selector: 'img[appLazyImage]',
  providers: [
    EventListenerService,
  ]
})
export class LazyImageDirective implements AfterViewInit {
  /**
   * Loaded state of image.
   */
  loaded = false;

  constructor(
    private elementRef: ElementRef<HTMLImageElement>,
    private eventListenerService: EventListenerService,
  ) { }

  ngAfterViewInit(): void {
    this._waitImageLoad();
  }

  /**
   * Bind opacity style.
   */
  @HostBinding('style.opacity') get opacity(): number {
    return this.loaded ? 1 : 0;
  }

  /**
   * Get host element.
   */
  get element(): HTMLImageElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Add event to wait until image fully loaded.
   */
  private _waitImageLoad(): void {
    this.eventListenerService.addEvent(this.element, 'load', this._showImageAfterLoaded);
  }

  /**
   * Set loaded state as `true` to show image.
   */
  private _showImageAfterLoaded = (): void => {
    this.loaded = this.element.complete;
  }
}
