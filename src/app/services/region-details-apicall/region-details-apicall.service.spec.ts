import { TestBed } from '@angular/core/testing';

import { RegionDetailsAPICallService } from './region-details-apicall.service';

describe('RegionDetailsApicallService', () => {
  let service: RegionDetailsAPICallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionDetailsAPICallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
