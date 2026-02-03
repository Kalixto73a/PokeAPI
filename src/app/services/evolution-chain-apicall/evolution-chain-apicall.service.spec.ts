import { TestBed } from '@angular/core/testing';

import { EvolutionChainApicallService } from './evolution-chain-apicall.service';

describe('EvolutionChainApicallService', () => {
  let service: EvolutionChainApicallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvolutionChainApicallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
