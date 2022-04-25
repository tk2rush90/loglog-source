import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Animator} from '@tk-ui/utils/animation.util';
import {MathUtil} from '@tk-ui/utils/math.util';
import {PlatformService} from '@tk-ui/services/universal/platform.service';

export type LoadingSpinnerPosition = 'absolute' | 'relative' | 'fixed';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  /**
   * Spinner size.
   */
  @Input() size = 24;

  /**
   * Spinner stroke width.
   */
  @Input() strokeWidth = 4;

  /**
   * Duration of each circle.
   */
  @Input() circleDuration = 1000;

  /**
   * Duration for fadeout.
   */
  @Input() fadingDuration = 500;

  /**
   * Colors to animate.
   */
  @Input() colors = [
    '#0a40db',
    '#3867ec',
    '#9024e2',
    '#212121',
    '#7d7d7d',
  ];

  /**
   * Set position style.
   */
  @Input() position: LoadingSpinnerPosition = 'relative';

  /**
   * Set width style.
   */
  @Input() width = 'auto';

  /**
   * Set height style.
   */
  @Input() height = 'auto';

  /**
   * Current animating color index.
   */
  index = 0;

  /**
   * Dashoffset.
   */
  dashOffset = 0;

  /**
   * Loading opacity.
   */
  opacity = 0;

  /**
   * Showing state of spinner.
   */
  show = false;

  /**
   * Rotate value.
   */
  private _rotate = 0;

  /**
   * Animator to control rotate.
   */
  private _spinningAnimator = new Animator();

  /**
   * Animator to control stroke of circle.
   */
  private _circleAnimator = new Animator();

  /**
   * Animator to control color fading.
   */
  private _colorAnimator = new Animator<number[]>();

  /**
   * Animator to control opacity.
   */
  private _opacityAnimator = new Animator();

  constructor(
    private platformService: PlatformService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stop(false);
  }

  /**
   * return view box
   */
  get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  /**
   * return circle center
   */
  get center(): number {
    return this.size / 2;
  }

  /**
   * return circle radius
   */
  get radius(): number {
    return this.center - this.strokeWidth / 2;
  }

  /**
   * return stroke color
   */
  get color(): string {
    return this.colors[this.index];
  }

  /**
   * return rotate
   */
  get rotate(): string {
    return `rotate(${this._rotate}deg)`;
  }

  /**
   * return dash array
   */
  get dashArray(): number {
    return MathUtil.getCircleRoundLength(this.radius);
  }

  /**
   * Start loading.
   */
  start(): void {
    if (this.platformService.isBrowser) {
      this.show = true;
      this.opacity = 1;
      this._startSpinningFirstStep();
      this._startCircleFirstStep();
    }
  }

  /**
   * Stop loading.
   * @param fadeOut Fadeout before stopping.
   */
  stop(fadeOut = true): void {
    if (this.platformService.isBrowser) {
      if (fadeOut) {
        this._startFadeOut();
      } else {
        this._cancelAllAnimators();
      }
    }
  }

  /**
   * start spinning first step
   */
  private _startSpinningFirstStep(): void {
    this._spinningAnimator.animate({
      start: 0,
      target: 180,
      duration: this.circleDuration / 3,
      timing: 'linear',
      onProgress: value => {
        this._rotate = Math.round(value);
      },
      onEnd: () => {
        this._startSpinningSecondStep();
      },
    });
  }

  /**
   * start spinning second step
   */
  private _startSpinningSecondStep(): void {
    this._spinningAnimator.animate({
      start: 180,
      target: 720,
      duration: this.circleDuration / 1.5,
      timing: 'linear',
      onProgress: value => {
        this._rotate = Math.round(value);
      },
      onEnd: () => {
        this._startSpinningFirstStep();
      },
    });
  }

  /**
   * start circle first step
   */
  private _startCircleFirstStep(): void {
    this._circleAnimator.animate({
      start: 0,
      target: this.dashArray,
      duration: this.circleDuration,
      timing: 'linear',
      onProgress: value => {
        this.dashOffset = Math.round(value);
      },
      onEnd: () => {
        this._toNextIndex();
        this._startCircleSecondStep();
      },
    });
  }

  /**
   * start circle second step
   */
  private _startCircleSecondStep(): void {
    this._circleAnimator.animate({
      start: this.dashArray,
      target: this.dashArray * 2,
      duration: this.circleDuration,
      timing: 'linear',
      onProgress: value => {
        this.dashOffset = Math.round(value);
      },
      onEnd: () => {
        this._toNextIndex();
        this._startCircleFirstStep();
      },
    });
  }

  /**
   * Start loading fadeout.
   */
  private _startFadeOut(): void {
    this._opacityAnimator.animate({
      start: this.opacity,
      target: 0,
      duration: this.fadingDuration,
      timing: 'linear',
      onProgress: value => {
        this.opacity = value;
      },
      onEnd: () => {
        this._cancelAllAnimators();
      },
    });
  }

  /**
   * Cancel all animators.
   */
  private _cancelAllAnimators(): void {
    this.show = false;
    this._opacityAnimator.cancel();
    this._spinningAnimator.cancel();
    this._circleAnimator.cancel();
    this._colorAnimator.cancel();
  }

  /**
   * to next index
   */
  private _toNextIndex(): void {
    this.index = this.nextIndex;
  }

  /**
   * return next index
   */
  get nextIndex(): number {
    const next = this.index + 1;

    return next > this.colors.length - 1 ? 0 : next;
  }
}

