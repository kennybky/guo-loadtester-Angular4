import { TestBed, inject } from '@angular/core/testing';

import { RealTimePerformanceService } from './real-time-performance.service';

describe('RealTimePerformanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealTimePerformanceService]
    });
  });

  it('should be created', inject([RealTimePerformanceService], (service: RealTimePerformanceService) => {
    expect(service).toBeTruthy();
  }));
});
