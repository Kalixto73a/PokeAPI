import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { PokemonSprite } from '../../model/sprite-for-each-pokemon-apicall/sprite-for-each-pokemon-apicall';

@Injectable({
  providedIn: 'root'
})
export class SpriteForEachPokemonApicallService {
  private  baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  
  constructor(private http: HttpClient) { }

  getSpriteForPokemon(id: string | number): Observable<PokemonSprite> {
    return this.http.get<PokemonSprite>(`${this.baseUrl}${id}`);
  }
}
