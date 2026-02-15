import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetails, PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import Swal from 'sweetalert2';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { RegionNames } from '../../core/config/regions-names';
import { RegionImages } from '../../core/config/regions-list-images';
import { PokemonSpeciesApicallService } from '../../services/pokemon-species-apicall/pokemon-species-apicall.service';
import { GenerationToRegionId } from '../../core/config/generation-to-region';

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
  
  public loading: boolean
  public pokemon: PokemonDetails
  public regionId: number | null 
  public originRegionId: number | null
  public originRegionName: string | null
  public originRegionImage: string | null
  public statsBackground: string
  public statsWidths: number[]
  public selectedGender: 'male' | 'female'
  public isShiny: boolean

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

  ) {}

  public ngOnInit(): void{

    this.initializeValues()
  
  }

  private initializeValues(): void{

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
    this.getIdByUrl()

    
  } 
  
  private getIdByUrl(): void {
    this.loading = true
    this.route.paramMap.subscribe(params => {
      this.regionId = Number(params.get('id'))
      this.pokemonId = Number(params.get('pokemonId'))
      if (this.regionId && this.pokemonId) {
        this.loadPokemonDetails()
        this.loading= false
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
  
  private loadPokemonDetails(): void{
    this.loading = true
    if (this.pokemonId) {
      this.detailsForEachPokemonService.getDetailsOfPokemon(this.pokemonId)
        .subscribe({next: details => {
          this.pokemon = details
          if (details?.species?.url) {
            this.pokemonSpeciesService.getPokemonSpeciesData(details.species.url)
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
    if(this.pokemon?.types){
      this.statsBackground = this.calculateCardBackground(this.pokemon.types)
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
    const id = this.regionId
    this.router.navigate(['region', id])
  }
  
  public showMale(): void{
    this.selectedGender = 'male'
  }

  public showFemale(): void{
    this.selectedGender = 'female'
  }
  
  public toggleShiny(): void{
    this.isShiny = !this.isShiny
  }

}
