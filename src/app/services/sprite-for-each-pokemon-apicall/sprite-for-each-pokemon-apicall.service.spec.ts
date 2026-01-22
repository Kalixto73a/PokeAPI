import { TestBed } from '@angular/core/testing';

import { SpriteForEachPokemonApicallService } from './sprite-for-each-pokemon-apicall.service';

describe('SpriteForEachPokemonApicallService', () => {
  let service: SpriteForEachPokemonApicallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpriteForEachPokemonApicallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
