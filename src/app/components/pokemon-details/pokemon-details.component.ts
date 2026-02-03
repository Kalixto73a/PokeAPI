import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetails } from '../../model/Pokemons/pokemon-details';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { Pokemon } from '../../model/Pokemons/pokedex';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [ PokemonNumberComponent, PokemonTypesComponent, SpriteForEachPokemonComponent, CommonModule, HttpClientModule ],
  providers: [ DetailsForEachPokemonApicallService ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})

export class PokemonDetailsComponent implements OnInit{

  @Input() public pokemonId : number

  public loading: boolean
  public pokemon: PokemonDetails

  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} detailsForEachPokemonService
   * 
   */

  constructor(    

    private detailsForEachPokemonService: DetailsForEachPokemonApicallService,
    private route: ActivatedRoute,

  ) {}

  public ngOnInit(): void{

    this.initializeValues()

  }

  private initializeValues(): void{

    this.getIdByUrl(),
    this.loadPokemonDetails()
    
  } 
  
  private getIdByUrl(): void {
    this.loading = true
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if (id) {
        this.pokemonId = +id
        this.loading= false
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'An Error Ocurred<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Retry',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
         if (result.isConfirmed) {
            window.location.reload();
          }
        })
      }
    })
  }
  
  private loadPokemonDetails(): void{
    this.loading = true
    if (this.pokemonId) {
      this.detailsForEachPokemonService.getDetailsOfPokemon(this.pokemonId)
        .subscribe(details => {
          console.log('Detalles del Pokémon:', details)
          this.pokemon = details
          this.loading = false
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'An Error Ocurred<br><br>Please reload the page and try again.',
            theme: 'dark',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#FF0000',
          }).then((result) => {
          if (result.isConfirmed) {
              window.location.reload();
            }
          })
      })
    }
  }

}
