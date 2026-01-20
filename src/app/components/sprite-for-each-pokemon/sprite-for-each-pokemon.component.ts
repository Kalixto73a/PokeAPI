import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SpriteForEachPokemonApicallService } from '../../services/SpriteForEachPokemonAPICall/sprite-for-each-pokemon-apicall.service';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule, ],
  providers: [SpriteForEachPokemonApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrl: './sprite-for-each-pokemon.component.css'
})
export class SpriteForEachPokemonComponent implements OnInit{

  @Input() pokemonId!: string;
  sprites: any = {}; 

  constructor(private spriteService: SpriteForEachPokemonApicallService) {}

  ngOnInit(): void {
      this.loadSprites();
  }

  loadSprites() : void {
    this.spriteService.getSpriteForPokemon(this.pokemonId)
      .subscribe(pokemon => {
        this.sprites = pokemon.sprites;
      });
  }
}
