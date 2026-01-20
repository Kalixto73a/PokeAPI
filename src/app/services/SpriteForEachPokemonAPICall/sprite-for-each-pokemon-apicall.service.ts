import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class SpriteForEachPokemonApicallService {
  privateUrl = 'https://pokeapi.co/api/v2/pokemon/';
  constructor(private http: HttpClient) { }

  getSpriteForPokemon(id: string): Observable<any> {
    return this.http.get(`${this.privateUrl}${id}`);
  }
}
