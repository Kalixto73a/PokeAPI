import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonNumberComponent } from './pokemon-number.component';

describe('PokemonNumberComponent', () => {
  let component: PokemonNumberComponent;
  let fixture: ComponentFixture<PokemonNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
