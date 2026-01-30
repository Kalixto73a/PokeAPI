import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokedex } from '../../model/Pokemons/pokedex';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PokedexAPICallService {

  constructor(private http: HttpClient) { }

  public  getPokedexRegionByPokedexUrl(url: string): Observable<Pokedex>{
    return this.http.get<Pokedex>(`${url}`)
  }

}
