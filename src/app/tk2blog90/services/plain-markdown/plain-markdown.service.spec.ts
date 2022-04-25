import { TestBed } from '@angular/core/testing';

import { PlainMarkdownService } from './plain-markdown.service';

describe('PlainMarkdownService', () => {
  let service: PlainMarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlainMarkdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
