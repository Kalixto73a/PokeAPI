import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { PokemonSprite } from '../../model/Sprites/sprite-for-each-pokemon-apicall';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SpriteForEachPokemonApicallService {
  
  constructor(private http: HttpClient) { }

  public getSpriteForPokemon(id: string | number): Observable<PokemonSprite> {
    return this.http.get<PokemonSprite>(`${environment.apiUrl}/pokemon/${id}`);
  }
}
