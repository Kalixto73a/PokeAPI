import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionsAPICallService } from '../../services/regions-apicall/regions-apicall.service';
import { NamedAPIResource } from '../../model/Regions/regions';
import { RegionImages } from '../../core/config/regions-list-images';
import { HttpClientModule } from '@angular/common/http';
import { PokedexForEachRegionComponent } from '../../components/pokedex-for-each-region/pokedex-for-each-region.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-regions-list',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, PokedexForEachRegionComponent ],
  providers:[ RegionsAPICallService ],
  templateUrl: './regions-list.component.html',
  styleUrl: './regions-list.component.css'
})
export class RegionsListComponent  implements OnInit{

  public regions: NamedAPIResource[]

  public loading: boolean

  public regionImages: Record<string, string>

  public selectedRegionId: number | null 

  /**
   * Constructor
   * 
   * @param {RegionsAPICallService} regionsListService
   * 
   */
  constructor (
    private regionsListService: RegionsAPICallService
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
        });
    }

    public getRegionImage(regionName: string): string{
      return this.regionImages[regionName.toLowerCase()]
    }
    
    public selectRegion(region: NamedAPIResource): void {
      const id = Number(region.url.split('/').filter(Boolean).pop());
      this.selectedRegionId = id;
    }

}