import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Regions , RegionDetails } from '../../model/Regions/regions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RegionsAPICallService {

  constructor(private http: HttpClient) { }

  public getRegions(): Observable<Regions> {
    return this.http.get<Regions>(`${environment.apiUrl}/region`);
  }

  public getRegionsByName(name: string): Observable<RegionDetails>{
    return this.http.get<RegionDetails>(`${environment.apiUrl}/region/${name}`)
  }

}
