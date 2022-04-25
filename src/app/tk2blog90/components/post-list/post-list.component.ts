import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PostItem} from '@tk2blog90/models/post-item';
import {fadeInOut, fadeInOutState} from '@tk2blog90/animations/fade-in-out';
import {showUp, showUpState} from '@tk2blog90/animations/show-up';
import {LoadingSpinnerComponent} from '@tk-ui/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  animations: [
    fadeInOut,
    showUp,
  ],
})
export class PostListComponent implements OnInit, AfterViewInit {
  /**
   * Post items to display.
   */
  @Input() posts: PostItem[] = [];

  /**
   * Reference to LoadingSpinnerComponent.
   */
  @ViewChild(LoadingSpinnerComponent) loadingSpinner?: LoadingSpinnerComponent;

  /**
   * The state of fade in-out animation.
   */
  fadeInOut = fadeInOutState.show;

  /**
   * The state of show up animation.
   */
  showUp = showUpState.show;

  /**
   * Loading state.
   */
  private _loading = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.loading) {
      this.loadingSpinner?.start();
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Set loading state.
   * @param loading Loading state.
   */
  @Input() set loading(loading: boolean) {
    this._loading = loading;

    if (loading) {
      this.loadingSpinner?.start();
    } else {
      this.loadingSpinner?.stop();
    }
  }

  /**
   * Get loading state.
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Get state of having posts.
   */
  get hasPosts(): boolean {
    return this.posts.length > 0;
  }
}
