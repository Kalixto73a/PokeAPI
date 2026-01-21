import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllPokemon } from '../../model/all-pokemon/all-pokemon';
import { PokemonQuery } from '../../model/all-pokemon-apicall/all-pokemon.apicall';

@Injectable({
  providedIn: 'root'
})

export class AllPokemonAPICallService {

  private baseURL = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getAllPokemon(query: PokemonQuery): Observable<AllPokemon> {
    const { limit, offset } = query
    return this.http.get<AllPokemon>(
      `${this.baseURL}/pokemon?limit=${limit}&offset=${offset}`
    );
  }
}