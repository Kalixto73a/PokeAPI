import { TestBed } from '@angular/core/testing';

import { AllPokemonAPICallService } from './all-pokemon-apicall.service';

describe('AllPokemonAPICallService', () => {
  let service: AllPokemonAPICallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllPokemonAPICallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
