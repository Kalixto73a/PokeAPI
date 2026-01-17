import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllPokemonAPICallService {
  private baseURL = 'https://pokeapi.co/api/v2';
  constructor(private http: HttpClient) { }
  getAllPokemon(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseURL}/pokemon?limit=${limit}&offset=${offset}`);
  }
}