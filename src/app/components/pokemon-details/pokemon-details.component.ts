import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetails, PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { Pokemon } from '../../model/Pokemons/pokedex';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import Swal from 'sweetalert2';
import { RegionStateService } from '../../services/region-state-service/region-state.service';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { RegionDetailsAPICallService } from '../../services/region-details-apicall/region-details-apicall.service';
import { RegionImages } from '../../core/config/regions-list-images';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [ HttpClientModule, PokemonNumberComponent, PokemonTypesComponent, SpriteForEachPokemonComponent, CommonModule, PokemonEvolutionChainComponent ],
  providers: [ DetailsForEachPokemonApicallService, RegionDetailsAPICallService ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})

export class PokemonDetailsComponent implements OnInit{

  @Input() public pokemonId : number

  public loading: boolean
  public pokemon: PokemonDetails
  public regionId: number | null 
  public regionImage: Record<number, string>
  public regionName: string | null
  public statsBackground: string
  public statsWidths: number[]

  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} detailsForEachPokemonService
   * @param {RegionStateService} regionState
   * @param {RegionDetailsAPICallService} regionDetailsService
   * 
   */

  constructor(    

    private detailsForEachPokemonService: DetailsForEachPokemonApicallService,
    private regionState: RegionStateService,
    private regionDetailsService: RegionDetailsAPICallService,
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
    this.regionImage = RegionImages
    this.statsBackground = ''
    this.statsWidths = []
    this.getIdByUrl()

    
  } 
  
  private getIdByUrl(): void {
    this.loading = true
    this.route.paramMap.subscribe(params => {
      this.regionId = Number(params.get('id'))
      this.pokemonId = Number(params.get('pokemonId'))
      if (this.regionId && this.pokemonId) {
        this.getRegionDetails()
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
            window.location.reload();
          }
        })
      }
    })
  }
  
  private getRegionDetails(): void {
    this.loading = true
    if (this.regionId !== null){
      this.regionDetailsService.getRegionDetails(this.regionId)
      .subscribe({
        next: (response) =>{
          this.regionName = response.name
          this.regionId = response.id
          this.loading = false;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'An Error Ocurred<br><br>Please reload the page and try again.',
            theme: 'dark',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#FF0000',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          })
        }
      })
    }
  }
  private loadPokemonDetails(): void{
    this.loading = true
    if (this.pokemonId) {
      this.detailsForEachPokemonService.getDetailsOfPokemon(this.pokemonId)
        .subscribe({next: details => {
          this.pokemon = details
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
              window.location.reload();
            }
          })}
      })
    }
  }

  public getWeightInKg(weight: number): string {
  return (weight / 10).toFixed(1);
  }
  
  public updateStatsBackground() {
    if(this.pokemon?.types){
      this.statsBackground = this.calculateCardBackground(this.pokemon.types);
    }
  }
  public calculateCardBackground(types: PokemonTypes[]): string {
    if (!types || types.length === 0) return '#fff';
    const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777');
    if (colors.length === 1) return colors[0];
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  }

  private animateStats(): void {
    if (!this.pokemon?.stats) return;

    // primero inicializamos todas las barras a 0
    this.statsWidths = this.pokemon.stats.map(() => 0);

    // después de un microtick actualizamos al valor real
    setTimeout(() => {
      this.statsWidths = this.pokemon.stats.map(s => (s.base_stat / 255) * 100);
    }, 50); // 50ms de delay suficiente
  }

  public goBack(): void {
    const id = this.regionId
    this.router.navigate(['region', id])
  }
  
  public getRegionImage(regionId: number): string{
      return this.regionImage[regionId]
  }
  
}
