import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit {
  /**
   * set icon name
   * @param name name
   */
  @Input() set name(name: keyof typeof IconDefinitions | undefined) {
    this._name = name;
    this._setIcon();
  }

  /**
   * bind name to attribute
   */
  @HostBinding('attr.tk-name') get bindName(): keyof typeof IconDefinitions | undefined {
    return this._name;
  }

  /**
   * name of icon
   */
  private _name: keyof typeof IconDefinitions | undefined;

  /**
   * svg string from `icon-defs.ts`
   */
  private _icon?: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._setIcon();
  }

  /**
   * set icon with name
   */
  private _setIcon(): void {
    this._parseSvgIcon();
    this._appendSvgToView();
  }

  /**
   * parse svg icon to element
   */
  private _parseSvgIcon(): void {
    if (this._name) {
      this._icon = IconDefinitions[this._name];
    }
  }

  /**
   * append svg icon to view
   */
  private _appendSvgToView(): void {
    if (this._icon && this.elementRef?.nativeElement) {
      this.elementRef.nativeElement.innerHTML = this._icon;
    }
  }
}
