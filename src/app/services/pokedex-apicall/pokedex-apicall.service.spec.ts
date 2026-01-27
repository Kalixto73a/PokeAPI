import { TestBed } from '@angular/core/testing';

import { PokedexAPICallService } from './pokedex-apicall.service';

describe('PokedexAPICallService', () => {
  let service: PokedexAPICallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokedexAPICallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
