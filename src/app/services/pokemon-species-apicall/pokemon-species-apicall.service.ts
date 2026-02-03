import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PokemonSpicies } from '../../model/Pokemons/pokemon-species';

@Injectable({
  providedIn: 'root'
})
export class PokemonSpeciesApicallService {

  constructor( private http: HttpClient) { }

  public getPokemonSpeciesData(url: string): Observable<PokemonSpicies> {
      return this.http.get<PokemonSpicies>(`${url}`)
    }

}
