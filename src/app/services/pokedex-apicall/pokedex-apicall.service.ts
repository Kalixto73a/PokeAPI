import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokedex } from '../../model/Pokemons/pokedex';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PokedexAPICallService {

  constructor(private http: HttpClient) { }

  public  getPokedexByUrl(url: string): Observable<Pokedex>{
    return this.http.get<Pokedex>(url)
  }
}
