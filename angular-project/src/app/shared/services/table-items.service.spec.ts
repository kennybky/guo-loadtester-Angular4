import { TestBed, inject } from '@angular/core/testing';

import { TableItemsService } from './table-items.service';

describe('TableItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableItemsService]
    });
  });

  it('should be created', inject([TableItemsService], (service: TableItemsService) => {
    expect(service).toBeTruthy();
  }));
});
