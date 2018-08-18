import { TestBed, inject } from '@angular/core/testing';

import { StatusPromisesService } from './status-promises.service';

describe('StatusPromisesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusPromisesService]
    });
  });

  it('should be created', inject([StatusPromisesService], (service: StatusPromisesService) => {
    expect(service).toBeTruthy();
  }));
});
