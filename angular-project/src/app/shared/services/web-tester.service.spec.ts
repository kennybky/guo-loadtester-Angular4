import { TestBed, inject } from '@angular/core/testing';

import { WebTesterService } from './web-tester.service';

describe('WebTesterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebTesterService]
    });
  });

  it('should be created', inject([WebTesterService], (service: WebTesterService) => {
    expect(service).toBeTruthy();
  }));
});
