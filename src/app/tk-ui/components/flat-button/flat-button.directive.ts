import {Directive, ElementRef, HostBinding, Input, Renderer2, ViewContainerRef} from '@angular/core';
import {RippleColor, RippleDirective} from '@tk-ui/components/ripple/ripple.directive';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

@Directive({
  selector: '[appFlatButton]'
})
export class FlatButtonDirective extends RippleDirective {
  /**
   * set and bind color attribute
   */
  @Input() @HostBinding('attr.tk-color') color: FlatButtonColor = 'default';

  /**
   * bind base class
   */
  @HostBinding('class.tk-flat-button') baseClass = true;

  constructor(
    protected override renderer: Renderer2,
    protected override elementRef: ElementRef<HTMLElement>,
    protected override viewContainerRef: ViewContainerRef,
    protected override subscriptionService: SubscriptionService,
  ) {
    super(renderer, elementRef, viewContainerRef, subscriptionService);
  }

  /**
   * Override `rippleColor` getter.
   */
  override get rippleColor(): RippleColor {
    switch (this.color) {
      case 'default': {
        return 'black';
      }
    }
  }
}

/**
 * button color type
 */
export type FlatButtonColor = 'default';
