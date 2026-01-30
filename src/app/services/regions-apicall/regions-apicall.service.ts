import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Regions } from '../../model/Regions/regions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RegionsAPICallService {

  constructor(private http: HttpClient) { }

  public getRegions(): Observable<Regions> {
    return this.http.get<Regions>(`${environment.apiUrl}/region`);
  }

}
