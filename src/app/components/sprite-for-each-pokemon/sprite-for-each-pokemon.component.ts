import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SpriteForEachPokemonApicallService } from '../../services/sprite-for-each-pokemon-apicall/sprite-for-each-pokemon-apicall.service';
import { PokemonSprite } from '../../model/sprite-for-each-pokemon-apicall/sprite-for-each-pokemon-apicall';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule, ],
  providers: [SpriteForEachPokemonApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrl: './sprite-for-each-pokemon.component.css'
})
export class SpriteForEachPokemonComponent implements OnInit{

  @Input() pokemonId : string
  sprite : string 

  /**
   * 
   * Constructor
   * 
   * @param {SpriteForEachPokemonAPICall} spriteService 
   * 
   */
  constructor(private spriteService: SpriteForEachPokemonApicallService) {}

  ngOnInit(): void {
      this.initializeValues()
  }

  initializeValues(): void {

    this.sprite = ' '
    this.loadSprites()
    

  }

  loadSprites() : void {
    this.spriteService.getSpriteForPokemon(this.pokemonId)
      .subscribe({
        next: (detail: PokemonSprite) => {
          this.sprite = detail.sprites.front_default; 
        },
        error: err => console.error('Error cargando sprite:', err)
      });
  }
}
