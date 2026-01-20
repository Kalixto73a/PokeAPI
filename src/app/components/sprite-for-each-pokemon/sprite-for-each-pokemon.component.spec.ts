import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteForEachPokemonComponent } from './sprite-for-each-pokemon.component';

describe('SpriteForEachPokemonComponent', () => {
  let component: SpriteForEachPokemonComponent;
  let fixture: ComponentFixture<SpriteForEachPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpriteForEachPokemonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpriteForEachPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
