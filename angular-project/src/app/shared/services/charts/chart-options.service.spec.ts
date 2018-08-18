import { TestBed, inject } from '@angular/core/testing';

import { ChartOptionsService } from './chart-options.service';

describe('ChartOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartOptionsService]
    });
  });

  it('should be created', inject([ChartOptionsService], (service: ChartOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
