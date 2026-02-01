import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { PokemonDetails } from '../../model/Pokemons/pokemon-details';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SpriteForEachPokemonApicallService {
  
  constructor(private http: HttpClient) { }

  public getSpriteForPokemon(id: string | number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${environment.apiUrl}/pokemon/${id}`);
  }
}
