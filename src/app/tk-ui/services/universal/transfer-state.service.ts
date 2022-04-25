import { Injectable } from '@angular/core';
import {PlatformService} from '@tk-ui/services/universal/platform.service';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {RandomUtil} from '@tk-ui/utils/random.util';

/**
 * TransferState managing service.
 * If the platform is browser, it will remove the data in keys
 * when destroying service from the scoping target.
 */
@Injectable()
export class TransferStateService {
  private _keysKey: StateKey<StateKey<any>[]> = makeStateKey(RandomUtil.key());

  constructor(
    private transferState: TransferState,
    private platformService: PlatformService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.platformService.isBrowser) {
      this._getKeys().forEach(key => this.remove(key));
      this.remove(this._keysKey);
    }
  }

  /**
   * Set the data to state.
   * @param key The key.
   * @param value The value.
   */
  set<T>(key: StateKey<T>, value: T): void {
    const keys = this._getKeys();

    if (keys.indexOf(key) === -1) {
      this._setKeys([...keys, key]);
    }

    this.transferState.set(key, value);
  }

  /**
   * Get the data from state.
   * @param key The key.
   * @param defaultValue Default value when no data set.
   */
  get<T>(key: StateKey<T>, defaultValue?: any): T {
    return this.transferState.get(key, defaultValue);
  }

  /**
   * Remove the key from state.
   * @param key The key.
   */
  remove<T>(key: StateKey<T>): void {
    this.transferState.remove(key);
  }

  /**
   * Set state keys array to state.
   * @param keys State keys for scoping target.
   */
  private _setKeys(keys: StateKey<any>[]): void {
    this.transferState.set(this._keysKey, keys);
  }

  /**
   * Get state keys array from state.
   */
  private _getKeys(): StateKey<any>[] {
    return this.transferState.get(this._keysKey, []);
  }
}
