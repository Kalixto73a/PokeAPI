import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AllPokemonAPICallService } from '../../services/AllPokemonAPICall/all-pokemon-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';


@Component({
  selector: 'app-all-pokemon',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SpriteForEachPokemonComponent],
  providers: [AllPokemonAPICallService],
  templateUrl: './all-pokemon.component.html',
  styleUrl: './all-pokemon.component.css'
})

export class AllPokemonComponent implements OnInit {

  pokemons: any[] = [];
  limit = 20;
  offset = 0;
  loading = false;

  constructor(private allPokemonService: AllPokemonAPICallService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.loading = true;
    this.allPokemonService.getAllPokemon(this.limit, this.offset)
      .subscribe({
        next: response => {
          this.pokemons = response.results;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  nextPage(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }

  prevPage(): void {
    if (this.offset === 0) return;
    this.offset -= this.limit;
    this.loadPokemons();
  }

  getPokemonId(pokemon: any): string { 
  const id = pokemon.url.split('/').filter(Boolean).pop() || '';
  return id; }

}
