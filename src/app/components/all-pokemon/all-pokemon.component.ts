import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AllPokemonAPICallService } from '../../services/AllPokemonAPICall/all-pokemon-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { Pokemon } from '../../model/all-pokemon/all-pokemon';
import { PokemonQuery } from '../../model/all-pokemon-apicall/all-pokemon.apicall';


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

  ngOnInit(): void {
    this.initializeValues()
  }

  initializeValues(): void {
    this.query = { limit : 20, offset : 0 }
    this.loading = false
    this.pokemons = []

    this.loadPokemons()
  }

  loadPokemons(): void {
    this.loading = true
    this.allPokemonService.getAllPokemon(this.query)
      .subscribe({
        next: response => {
          this.pokemons = response.results
          this.loading = false
        },
        error: () => this.loading = false
      });
  }

  nextPage(): void {
    this.query.offset += this.query.limit
    this.loadPokemons()
  }

  prevPage(): void {
    if (this.query.offset === 0) return
    this.query.offset -= this.query.limit
    this.loadPokemons()
  }

}
