import { TestBed, inject } from '@angular/core/testing';

import { ChartTrackerService } from './chart-tracker.service';

describe('ChartTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartTrackerService]
    });
  });

  it('should be created', inject([ChartTrackerService], (service: ChartTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
