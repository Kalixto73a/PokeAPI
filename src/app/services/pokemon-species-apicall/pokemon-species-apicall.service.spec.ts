import { TestBed } from '@angular/core/testing';

import { PokemonSpeciesApicallService } from './pokemon-species-apicall.service';

describe('PokemonSpeciesApicallService', () => {
  let service: PokemonSpeciesApicallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonSpeciesApicallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
