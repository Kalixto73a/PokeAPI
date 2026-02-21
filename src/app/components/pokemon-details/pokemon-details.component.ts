import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonSpeciesApicallService } from '../../services/pokemon-species-apicall/pokemon-species-apicall.service';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { RegionNames } from '../../core/config/regions-names';
import { RegionImages } from '../../core/config/regions-list-images';
import { GenerationToRegionId } from '../../core/config/generation-to-region';
import { PokemonDetails, PokemonTypes } from '../../model/Pokemons/pokemon-details';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [ HttpClientModule, PokemonNumberComponent, PokemonTypesComponent, SpriteForEachPokemonComponent, CommonModule, PokemonEvolutionChainComponent ],
  providers: [ DetailsForEachPokemonApicallService, PokemonSpeciesApicallService ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})

export class PokemonDetailsComponent implements OnInit{

  @Input() public pokemonId : number

  private readonly hisuiPokemonIds = [899, 900, 901, 902, 903, 904]
  
  public selectedVariantIndex: number
  public totalVariants: number
  public variantNames: string[]
  public variantHasShiny: boolean[]
  public openDropdown: boolean
  public isShiny: boolean
  public loading: boolean
  public pokemon: PokemonDetails
  public regionId: number | null 
  public originRegionId: number | null
  public originRegionName: string | null
  public originRegionImage: string | null
  public statsBackground: string
  public statsWidths: number[]
  public selectedGender: 'male' | 'female'
  public currentTypes: PokemonTypes[]

  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} detailsForEachPokemonService
   * @param {RegionDetailsAPICallService} regionDetailsService
   * 
   */

  constructor(    

    private detailsForEachPokemonService: DetailsForEachPokemonApicallService,
    private pokemonSpeciesService: PokemonSpeciesApicallService,
    private route: ActivatedRoute,
    private router: Router, 

  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  public ngOnInit(): void{

    this.initializeValues()
  
  }

  private initializeValues(): void{

    this.selectedVariantIndex = 0
    this.totalVariants = 0
    this.variantNames  = []
    this.variantHasShiny = []
    this.openDropdown = false
    this.loading = false
    this.pokemon = {} as PokemonDetails
    this.regionId = null
    this.originRegionId = null
    this.originRegionName = null
    this.originRegionImage = null
    this.statsBackground = ''
    this.statsWidths = []
    this.selectedGender = 'male'
    this.isShiny = false
    this.currentTypes = []
    this.getIdByUrl()

  } 
  
  private getIdByUrl(): void {
    this.route.paramMap.subscribe(params => {
      const newPokemonId = Number(params.get('pokemonId'))
      this.resetPokemonState()
      this.pokemonId = newPokemonId
      const regionName = this.route.parent?.snapshot.paramMap.get('regionName')
      if (regionName && this.pokemonId) {
        this.regionId = this.getRegionIdFromName(regionName);
        this.loadPokemonDetails();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'An Error Ocurred<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Retry',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
         if (result.isConfirmed) {
            window.location.reload()
          }
        })
      }
    })
  }
  
  private getRegionIdFromName(name: string): number | null {
    const entry = Object.entries(RegionNames).find(([_, value]) => value === name)
    return entry ? Number(entry[0]) : null
  }

  private loadPokemonDetails(): void{
    this.loading = true
    if (this.pokemonId) {
      this.detailsForEachPokemonService.getDetailsOfPokemon(this.pokemonId)
        .subscribe({next: details => {
          this.pokemon = details
          if (details?.species?.url) {
            this.pokemonSpeciesService.getPokemonSpeciesData(details.id)
              .subscribe(speciesData => {
                const generationName = speciesData.generation?.name
                  if (this.hisuiPokemonIds.includes(this.pokemonId)) {
                    this.originRegionId = 9
                  } else {
                    this.originRegionId = GenerationToRegionId[generationName] ?? 0
                  }
                this.originRegionName = RegionNames[this.originRegionId]
                this.originRegionImage = RegionImages[this.originRegionId]
              })
          }
          this.updateStatsBackground()
          this.animateStats()
          this.loading = false
        }, error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'An Error Ocurred<br><br>Please reload the page and try again.',
            theme: 'dark',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#FF0000',
          }).then((result) => {
          if (result.isConfirmed) {
              window.location.reload()
            }
          })}
      })
    }
  }

  public getWeightInKg(weight: number): string {
    return (weight / 10).toFixed(1)
  }
  
  public updateStatsBackground() {
    if (this.currentTypes && this.currentTypes.length > 0) {
      this.statsBackground = this.calculateCardBackground(this.currentTypes)
    } else if (this.pokemon?.types && this.pokemon.types.length > 0) {
      this.statsBackground = this.calculateCardBackground(this.pokemon.types)
    } else {
      this.statsBackground = '#fff'
    }
  }

  public calculateCardBackground(types: PokemonTypes[]): string {
    if (!types || types.length === 0) return '#fff'
    const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777')
    if (colors.length === 1) return colors[0]
    return `linear-gradient(135deg, ${colors.join(', ')})`
  }

  private animateStats(): void {
    if (!this.pokemon?.stats) return
    this.statsWidths = this.pokemon.stats.map(() => 0)
    setTimeout(() => {
      this.statsWidths = this.pokemon.stats.map(s => (s.base_stat / 255) * 100)
    }, 50)
  }

  public goBack(): void {
    if (!this.regionId) return;
    const regionName = RegionNames[this.regionId]
    this.router.navigate(['Pokedex/',regionName])
  }
  
  public toggleShiny(): void{
    this.isShiny = !this.isShiny
  }

  public onVariantsLoaded(event: { count: number; names: string[], hasShiny?: boolean[] }): void {
    this.totalVariants = event.count
    this.variantNames = event.names
    if (event.hasShiny) {
    this.variantHasShiny = event.hasShiny
    } else {
      this.variantHasShiny = Array(this.totalVariants).fill(false)
    }
  }

  public onVariantSelect(idx: number): void {
    this.selectedVariantIndex = idx
  }

  public onVariantTypesChanged(typeNames: string[]): void {
    this.currentTypes = typeNames.map((name, index) => ({
      slot: index + 1,
      type: { name, url: '' }
    } as PokemonTypes))
    this.updateStatsBackground()
  }
  public get currentVariantHasShiny(): boolean {
    return this.variantHasShiny[this.selectedVariantIndex] ?? false
  }

  private resetPokemonState(): void {

    this.selectedVariantIndex = 0;
    this.totalVariants = 0;
    this.variantNames = [];
    this.variantHasShiny = [];
    this.isShiny = false;
    this.currentTypes = [];
    this.loading = true;

  }

}
