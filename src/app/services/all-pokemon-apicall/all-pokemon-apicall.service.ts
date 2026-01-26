import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllPokemon } from '../../model/Pokemons/all-pokemon';
import { PokemonQuery } from '../../model/Pokemons/all-pokemon-apicall';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AllPokemonAPICallService {

  constructor(private http: HttpClient) { }

  getAllPokemon(query: PokemonQuery): Observable<AllPokemon> {
    const { limit, offset } = query
    return this.http.get<AllPokemon>(
      `${environment.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
  }
}