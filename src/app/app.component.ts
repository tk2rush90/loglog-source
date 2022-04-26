import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppTheme, ThemeService} from '@tk2blog90/services/app/theme.service';
import {DOCUMENT} from '@angular/common';

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
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private themeService: ThemeService,
  ) {
    this.themeService.init();
  }

  ngOnInit(): void {
    this._subscribeTheme();
  }

  /**
   * Subscribe theme value to change the theme of the application.
   */
  private _subscribeTheme(): void {
    this.themeService
      .theme$
      .subscribe(theme => {
        this._theme = theme;

        switch (this._theme) {
          case 'light': {
            this.renderer.addClass(this.document.body, 'theme-light');
            this.renderer.removeClass(this.document.body, 'theme-dark');
            break;
          }

          case 'dark': {
            this.renderer.addClass(this.document.body, 'theme-dark');
            this.renderer.removeClass(this.document.body, 'theme-light');
            break;
          }
        }
      });
  }
}
