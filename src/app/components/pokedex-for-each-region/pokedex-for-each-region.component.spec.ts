import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexForEachRegionComponent } from './pokedex-for-each-region.component';

describe('PokedexForEachRegionComponent', () => {
  let component: PokedexForEachRegionComponent;
  let fixture: ComponentFixture<PokedexForEachRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexForEachRegionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokedexForEachRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
