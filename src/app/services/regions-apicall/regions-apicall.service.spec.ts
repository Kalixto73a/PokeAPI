import { TestBed } from '@angular/core/testing';
import { RegionsAPICallService } from './regions-apicall.service';

describe('RegionsAPICallService', () => {
  let service: RegionsAPICallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionsAPICallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
