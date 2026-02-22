import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { RegionsAPICallService } from '../../services/regions-apicall/regions-apicall.service';
import { NamedAPIResource } from '../../model/Regions/regions';
import { RegionImages } from '../../core/config/regions-list-images';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-regions-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [RegionsAPICallService],
  templateUrl: './regions-list.component.html',
  styleUrls: ['./regions-list.component.css']
})

export class RegionsListComponent implements OnInit, OnDestroy {

  public regions: (NamedAPIResource & { id: number })[]
  public loading: boolean
  public regionImages: Record<number, string> = RegionImages

  private routerSubscription!: Subscription

  constructor(
    private regionsListService: RegionsAPICallService,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  public ngOnInit(): void {
    this.initializeValues()
  }

  public ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

  private initializeValues(): void {
    this.regions = []
    this.loading = false
    this.loadRegionsList()
  }

  private loadRegionsList(): void {
    this.loading = true
    this.regionsListService.getRegions().subscribe({
      next: response => {
        this.regions = response.results.map(r => ({
          ...r,
          id: Number(r.url.split('/').filter(Boolean).pop())
        }))
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

  public getRegionImage(regionId: number): string {
    return this.regionImages[regionId]
  }

  public selectRegion(region: NamedAPIResource): void {
    this.router.navigate(['Pokedex/', region.name])
  }

}