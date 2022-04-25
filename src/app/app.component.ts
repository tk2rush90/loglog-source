import {Component, HostBinding, OnInit} from '@angular/core';
import {AppTheme, ThemeService} from '@tk2blog90/services/app/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * Theme value.
   * Default is `light`.
   */
  private _theme: AppTheme = 'light';

  constructor(
    private themeService: ThemeService,
  ) {
    this.themeService.init();
  }

  ngOnInit(): void {
    this._subscribeTheme();
  }

  /**
   * Bind light theme class.
   */
  @HostBinding('class.theme-light') get light(): boolean {
    return this._theme === 'light';
  }

  /**
   * Bind dark theme class.
   */
  @HostBinding('class.theme-dark') get dark(): boolean {
    return this._theme === 'dark';
  }

  /**
   * Subscribe theme value to change the theme of the application.
   */
  private _subscribeTheme(): void {
    this.themeService
      .theme$
      .subscribe(theme => {
        this._theme = theme;
      });
  }
}
