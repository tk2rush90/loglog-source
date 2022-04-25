import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import {RippleComponent} from '@tk-ui/components/ripple/ripple.component';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';


/**
 * The ripple color.
 * Default is `black`.
 */
export type RippleColor = 'black' | 'white';

/**
 * Ripple directive to create an interactive ripple to component.
 */
@Directive({
  selector: '[appRipple]',
  providers: [
    SubscriptionService,
  ]
})
export class RippleDirective {
  /**
   * Set ripple bound state.
   * If `false`, ripple can be spread to the outer of the component.
   */
  @Input() @HostBinding('class.tk-ripple-bounded') bound = true;

  /**
   * Bind ripple container class.
   */
  @HostBinding('class.tk-ripple-container') class = true;

  /**
   * Created ripples array.
   */
  ripples: ComponentRef<RippleComponent>[] = [];

  constructor(
    protected renderer: Renderer2,
    protected elementRef: ElementRef<HTMLElement>,
    protected viewContainerRef: ViewContainerRef,
    protected subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Ripple color.
   */
  private _rippleColor: RippleColor = 'black';

  /**
   * Get ripple color.
   */
  get rippleColor(): RippleColor {
    return this._rippleColor;
  }

  /**
   * Set ripple color.
   * @param rippleColor Ripple color.
   */
  @Input() set rippleColor(rippleColor: RippleColor) {
    this._rippleColor = rippleColor;
  }

  /**
   * Set true when ripple need to be started from the center.
   */
  private _centered = false;

  /**
   * Get centered state.
   */
  get centered(): boolean {
    return this._centered;
  }

  /**
   * Set centered state.
   * @param centered Centered state.
   */
  @Input() set centered(centered: boolean) {
    this._centered = centered;
  }

  /**
   * Get the state of ripple color whether black or not and bind to class.
   */
  @HostBinding('class.tk-ripple-black') get rippleBlack(): boolean {
    return this.rippleColor === 'black';
  }

  /**
   * Get the state of ripple color whether white or not and bind to class.
   */
  @HostBinding('class.tk-ripple-white') get rippleWhite(): boolean {
    return this.rippleColor === 'white';
  }

  /**
   * Get host element.
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Handle host pointer down event.
   * @param event Event.
   */
  @HostListener('pointerdown', ['$event'])
  onHostPointerDown(event: PointerEvent): void {
    this._addRipple(event);
  }

  /**
   * Handle window pointer up event.
   */
  @HostListener('window:pointerup')
  onWindowPointerUp(): void {
    this._setRippleDestroyable();
  }

  /**
   * Handle host pointer out event.
   */
  @HostListener('pointerout')
  onHostPointerOut(): void {
    this._setRippleDestroyable();
  }

  /**
   * Set the oldest ripple to be destroyable.
   */
  private _setRippleDestroyable(): void {
    const ripple = this.ripples.shift();

    if (ripple) {
      ripple.instance.setDestroyable();
    }
  }

  /**
   * Add ripple to host element.
   * @param event Pointer event to detect ripple starting position.
   */
  private _addRipple(event: PointerEvent): void {
    const domRect = this.element.getBoundingClientRect();
    const ripple = this.viewContainerRef.createComponent(RippleComponent);
    let rx: number;
    let ry: number;

    if (this.centered) {
      rx = domRect.width / 2;
      ry = domRect.height / 2;
    } else {
      rx = event.x - domRect.x;
      ry = event.y - domRect.y;
    }

    this.ripples.push(ripple);

    ripple.instance.x = rx;
    ripple.instance.y = ry;
    ripple.instance.size = Math.max(domRect.width, domRect.height);
    ripple.changeDetectorRef.detectChanges();

    this.renderer.appendChild(this.element, ripple.location.nativeElement);

    this._subscribeRippleDestroy(ripple);
  }

  /**
   * Subscribe the ripple destroy emitter to destroy it.
   * @param ripple Ripple component reference.
   */
  private _subscribeRippleDestroy(ripple: ComponentRef<RippleComponent>): void {
    const sub = ripple.instance.destroy.subscribe(() => ripple.destroy());

    this.subscriptionService.store(`_subscribeRippleDestroy${ripple.instance.id}`, sub);
  }
}
