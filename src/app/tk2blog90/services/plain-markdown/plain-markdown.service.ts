import {Injectable} from '@angular/core';
import {MarkdownService} from 'ngx-markdown';
import {cloneDeep} from 'lodash';

@Injectable()
export class PlainMarkdownService {
  private _clonedMarkdownService: MarkdownService;

  constructor(
    private markdownService: MarkdownService,
  ) {
    // Clone the MarkdownService to not override existing one.
    this._clonedMarkdownService = cloneDeep(this.markdownService);
    // Override renderer of markdown service to get plain text.
    this._clonedMarkdownService.renderer.paragraph = text => text;
    this._clonedMarkdownService.renderer.link = (href, title, text) => text;
    this._clonedMarkdownService.renderer.heading = (text, level, raw, slugger) => text;
    this._clonedMarkdownService.renderer.image = (href1, title, text) => '';
    this._clonedMarkdownService.renderer.text = text => text;
    this._clonedMarkdownService.renderer.em = text => text;
    this._clonedMarkdownService.renderer.code = (code, language, isEscaped) => code;
    this._clonedMarkdownService.renderer.blockquote = quote => quote;
    this._clonedMarkdownService.renderer.checkbox = () => '';
    this._clonedMarkdownService.renderer.br = () => '';
    this._clonedMarkdownService.renderer.codespan = code => code;
    this._clonedMarkdownService.renderer.del = text => text;
    this._clonedMarkdownService.renderer.html = html => html;
    this._clonedMarkdownService.renderer.list = (body, ordered, start) => body;
    this._clonedMarkdownService.renderer.listitem = (text, task, checked) => text;
    this._clonedMarkdownService.renderer.strong = text => text;
  }

  /**
   * Parse markdown to plain text.
   * @param markdown Markdown text.
   */
  parse(markdown: string): string {
    return this._clonedMarkdownService.compile(markdown);
  }
}
