import {Injectable} from '@angular/core';
import {StorageService} from '@tk-ui/services/common/storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlatformService} from '@tk-ui/services/universal/platform.service';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * Theme value.
   */
  private _theme$: BehaviorSubject<AppTheme> = new BehaviorSubject<AppTheme>('light');

  /**
   * Local storage key for `theme` value.
   */
  private _themeKey = '01267225-52b2-408f-9040-713c9a14821c';

  constructor(
    private platformService: PlatformService,
    private storageService: StorageService,
  ) { }

  /**
   * Change theme value.
   * Local saved value will be updated too.
   * @param theme Theme value.
   */
  set theme(theme: AppTheme) {
    this.storageService.setToLocal<AppTheme>(this._themeKey, theme);
    this._theme$.next(theme);
  }

  /**
   * Get theme value as an observable.
   */
  get theme$(): Observable<AppTheme> {
    return this._theme$.asObservable();
  }

  /**
   * Initialize the theme.
   */
  init(): void {
    if (this.platformService.isBrowser) {
      const theme = this.storageService.getFromLocal<AppTheme>(this._themeKey);

      this._theme$.next(theme || 'light');
    }
  }
}
