import { TestBed, inject } from '@angular/core/testing';

import { ChartLoaderService } from './chart-loader.service';

describe('ChartLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartLoaderService]
    });
  });

  it('should be created', inject([ChartLoaderService], (service: ChartLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
