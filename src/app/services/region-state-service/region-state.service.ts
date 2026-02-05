import { Injectable } from '@angular/core';
import { RegionImages } from '../../core/config/regions-list-images';
import { RegionNames } from '../../core/config/regions-names';

@Injectable({
  providedIn: 'root'
})

export class RegionStateService {

  selectedRegionId: number | null = null;

  setRegion(regionId: number) {
    this.selectedRegionId = regionId;
    localStorage.setItem('regionId', regionId.toString());
  }

  getRegionId(): number | null {
    const stored = localStorage.getItem('regionId');
    return this.selectedRegionId ?? (stored ? +stored : null);
  }

  getRegionImage(): string | null {
    const id = this.getRegionId();
    return id ? RegionImages[id] : null;
  }

  getRegionName(): string | null {
    const id = this.getRegionId();
    return id ? RegionNames[id] : null;
  }

}