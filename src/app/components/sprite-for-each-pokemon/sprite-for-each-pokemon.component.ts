import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SpriteForEachPokemonApicallService } from '../../services/sprite-for-each-pokemon-apicall/sprite-for-each-pokemon-apicall.service';
import { PokemonSprite } from '../../model/Pokemons/pokemon-details';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule, ],
  providers: [SpriteForEachPokemonApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrl: './sprite-for-each-pokemon.component.css'
})
export class SpriteForEachPokemonComponent implements OnInit{

  @Input() pokemonId : number
  sprite : string 

  /**
   * 
   * Constructor
   * 
   * @param {SpriteForEachPokemonAPICall} spriteService 
   * 
   */
  constructor(private spriteService: SpriteForEachPokemonApicallService) {}

  public ngOnInit(): void {
      this.initializeValues()
  }

  private initializeValues(): void {

    this.sprite = ' '
    this.loadSprites()
    

  }

  private loadSprites() : void {
    this.spriteService.getSpriteForPokemon(this.pokemonId)
      .subscribe({
        next: (detail: PokemonSprite) => {
          this.sprite = detail.sprites.front_default; 
        },
        error:() => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'There was an error loading the Pokémon sprite.<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Reload Page',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      });
  }
}