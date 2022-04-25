import {Directive, Input, TemplateRef} from '@angular/core';

/**
 * Directive to render custom body column.
 */
@Directive({
  selector: '[appBodyColumn]'
})
export class BodyColumnDirective {
  // The key of column.
  // It should be matched with the key of `TableColumn`.
  @Input() key!: string;

  constructor(
    private _templateRef: TemplateRef<any>,
  ) {
  }

  /**
   * Get the reference of the template.
   */
  get templateRef(): TemplateRef<any> {
    return this._templateRef;
  }
}
