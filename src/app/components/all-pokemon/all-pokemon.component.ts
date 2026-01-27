import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AllPokemonAPICallService } from '../../services/all-pokemon-apicall/all-pokemon-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { Pokemon } from '../../model/Pokemons/all-pokemon';
import { PokemonQuery } from '../../model/Pokemons/all-pokemon-apicall';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-all-pokemon',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SpriteForEachPokemonComponent],
  providers: [AllPokemonAPICallService],
  templateUrl: './all-pokemon.component.html',
  styleUrl: './all-pokemon.component.css'
})

export class AllPokemonComponent implements OnInit {

  public loading: boolean

  public pokemons:  Pokemon []

  public query : PokemonQuery 
  
  /**
   * Constructor
   * 
   * @param {AllPokemonAPICallService} allPokemonService
   * 
   */
  constructor(
    private allPokemonService: AllPokemonAPICallService
  ) {}

  public ngOnInit(): void {
    this.initializeValues()
  }

  private initializeValues(): void {
    this.query = { limit : 20, offset : 0 }
    this.loading = false
    this.pokemons = []

    this.loadPokemons()
  }

  private loadPokemons(): void {
    this.loading = true
    this.allPokemonService.getAllPokemon(this.query)
      .subscribe({
        next: response => {
          this.pokemons = response.results
          this.loading = false
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'There was an error loading the Pokémon list.<br><br>Please reload the page and try again.',
            theme: 'dark',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#FF0000',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadPokemons()
            }
          })
        }
      });
  }

  public nextPage(): void {
    this.query.offset += this.query.limit
    this.loadPokemons()
  }

  public prevPage(): void {
    if (this.query.offset === 0) return
    this.query.offset -= this.query.limit
    this.loadPokemons()
  }

}
