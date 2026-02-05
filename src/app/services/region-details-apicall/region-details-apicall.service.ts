import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegionDetails, Pokedexes } from '../../model/Regions/region-details';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegionDetailsAPICallService {

  constructor( private http: HttpClient) { }

   public getRegionDetails(id: number, indices: number[] ): Observable<Pokedexes[]> {
      return this.http.get<RegionDetails>(`${environment.apiUrl}/region/${id}`)
      .pipe(map(response => indices.map( i => response.pokedexes[i]).filter(Boolean)))
    }

}
