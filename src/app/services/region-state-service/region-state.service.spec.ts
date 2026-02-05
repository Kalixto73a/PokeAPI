import { TestBed } from '@angular/core/testing';

import { RegionStateService } from './region-state.service';

describe('RegionStateService', () => {
  let service: RegionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
