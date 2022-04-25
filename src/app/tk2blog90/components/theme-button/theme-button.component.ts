import {Component, OnInit} from '@angular/core';
import {AppTheme, ThemeService} from '@tk2blog90/services/app/theme.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ThemeButtonComponent implements OnInit {
  /**
   * Theme value.
   * Default is `light`.
   */
  private _theme: AppTheme = 'light';

  constructor(
    private themeService: ThemeService,
    private subscriptionService: SubscriptionService,
  ) { }

  ngOnInit(): void {
    this._subscribeTheme();
  }

  /**
   * Get icon name by theme value.
   */
  get icon(): keyof typeof IconDefinitions {
    switch (this._theme) {
      case 'light': {
        return 'nightlight:black-30';
      }

      case 'dark': {
        return 'sunny:white-30';
      }
    }
  }

  /**
   * Toggle theme color.
   */
  toggleTheme(): void {
    switch (this._theme) {
      case 'light': {
        this.themeService.theme = 'dark';
        break;
      }

      case 'dark': {
        this.themeService.theme = 'light';
        break;
      }
    }
  }

  /**
   * Subscribe theme value to detect current theme.
   */
  private _subscribeTheme(): void {
    const sub = this.themeService
      .theme$
      .subscribe(theme => {
        this._theme = theme;
      });

    this.subscriptionService.store('_subscribeTheme', sub);
  }
}
