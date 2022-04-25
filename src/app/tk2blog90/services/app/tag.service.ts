import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  /**
   * Selected tag list.
   */
  private _selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() { }

  /**
   * Get selected tags as an observable.
   */
  get selectedTags$(): Observable<string[]> {
    return this._selectedTags$.asObservable();
  }

  /**
   * Toggle the tag selection.
   * @param tag Tag to toggle.
   */
  toggleTag(tag: string): void {
    const tags = this._selectedTags$.getValue();
    const index = tags.indexOf(tag);

    if (index !== -1) {
      this._selectedTags$.next(tags.filter(_tag => _tag !== tag));
    } else {
      this._selectedTags$.next([...tags, tag]);
    }
  }

  /**
   * Clear selected tags.
   */
  clearTags(): void {
    this._selectedTags$.next([]);
  }
}
