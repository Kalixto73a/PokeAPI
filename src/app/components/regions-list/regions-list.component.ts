import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionsAPICallService } from '../../services/regions-apicall/regions-apicall.service';
import { NamedAPIResource } from '../../model/Regions/regions';
import { RegionImages } from '../../core/config/regions-list-images';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { RegionStateService } from '../../services/region-state-service/region-state.service';



@Component({
  selector: 'app-regions-list',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, ],
  providers:[ RegionsAPICallService, ],
  templateUrl: './regions-list.component.html',
  styleUrl: './regions-list.component.css'
})
export class RegionsListComponent  implements OnInit{

  public regions: NamedAPIResource[]

  public loading: boolean

  public regionImages: Record<number, string>

  public selectedRegionId: number | null 

  /**
   * Constructor
   * 
   * @param {RegionsAPICallService} regionsListService
   * @param {RegionStateService} regionState
   * 
   */
  constructor (
    private regionsListService: RegionsAPICallService,
    private regionState: RegionStateService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.initializeValues()
  }

  private initializeValues(): void{

    this.regions= []
    this.regionImages = RegionImages
    this. loading = false
    this.selectedRegionId = null 

    this.loadRegionsList()

  }

    private loadRegionsList(): void {
      this.loading = true
      this.regionsListService.getRegions()
        .subscribe({
          next: response => {
            this.regions = response.results
            this.loading = false
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              html: 'There was an error loading the Regions list.<br><br>Please reload the page and try again.',
              theme: 'dark',
              confirmButtonText: 'Retry',
              confirmButtonColor: '#FF0000',
            }).then((result) => {
              if (result.isConfirmed) {
                this.loadRegionsList()
              }
            })
          }
        })
    }

    public getRegionImage(regionId: NamedAPIResource): string{
      const id = Number(regionId.url.split('/').filter(Boolean).pop())
      return this.regionImages[id]
    }
    
    public selectRegion(region: NamedAPIResource) {
      const id = Number(region.url.split('/').filter(Boolean).pop())
      this.regionState.setRegion(id)
      this.router.navigate(['/region', id])
    }
    

}