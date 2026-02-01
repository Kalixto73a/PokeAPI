import { TestBed } from '@angular/core/testing';

import { DetailsForEachPokemonApicallService } from './pokemon-details-apicall.service';

describe('DetailsForEachPokemonApicallService', () => {
  let service: DetailsForEachPokemonApicallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsForEachPokemonApicallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
