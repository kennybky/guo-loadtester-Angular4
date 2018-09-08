import { TestBed, inject } from '@angular/core/testing';

import { RealTimeTrackerService } from './real-time-tracker.service';

describe('RealTimeTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealTimeTrackerService]
    });
  });

  it('should be created', inject([RealTimeTrackerService], (service: RealTimeTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
