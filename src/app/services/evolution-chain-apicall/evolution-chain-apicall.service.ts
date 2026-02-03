import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EvolutionChain } from '../../model/Pokemons/pokemon-evolution-chain';

@Injectable({
  providedIn: 'root'
})
export class EvolutionChainApicallService {

  constructor( private http: HttpClient) { }

  public getPokemonEvolutionChain(url: string): Observable<EvolutionChain> {
      return this.http.get<EvolutionChain>(`${url}`)
    }

}
