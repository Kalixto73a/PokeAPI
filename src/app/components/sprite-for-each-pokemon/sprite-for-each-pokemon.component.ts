import { Component, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core'
import { CommonModule } from '@angular/common';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonDetails } from '../../model/Pokemons/pokemon-details';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule, ],
  providers: [DetailsForEachPokemonApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrl: './sprite-for-each-pokemon.component.css'
})
export class SpriteForEachPokemonComponent implements OnInit{

  @Input() pokemonId : number
  @Output() load: EventEmitter<void> = new EventEmitter<void>()

  public sprite : string[]

  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} spriteService 
   * 
   */
  constructor(private spriteService: DetailsForEachPokemonApicallService) {}

  public ngOnInit(): void {
      this.initializeValues()
  }

  private initializeValues(): void {

    this.sprite = []
    this.loadSprites()

  }

  private loadSprites() : void {
    this.spriteService.getDetailsOfPokemon(this.pokemonId)
      .subscribe({
        next: (response: PokemonDetails) => {
          this.sprite = [ 
            response.sprites.front_default,
            response.sprites.front_female,
            response.sprites.front_shiny,
            response.sprites.front_shiny_female,
            response.sprites.back_default,
            response.sprites.back_female,
            response.sprites.back_shiny,
            response.sprites.back_female_shiny,
          ]
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

  public onSpriteLoaded(): void {
    this.load.emit()
  }
}