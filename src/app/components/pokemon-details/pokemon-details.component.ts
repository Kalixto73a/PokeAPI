import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetails, PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { Pokemon } from '../../model/Pokemons/pokedex';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import Swal from 'sweetalert2';
import { RegionStateService } from '../../services/region-state-service/region-state.service';
import { PokemonTypesColors } from '../../core/config/types-colors';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [ PokemonNumberComponent, PokemonTypesComponent, SpriteForEachPokemonComponent, CommonModule, HttpClientModule, PokemonEvolutionChainComponent ],
  providers: [ DetailsForEachPokemonApicallService ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})

export class PokemonDetailsComponent implements OnInit{

  @Input() public pokemonId : number

  public loading: boolean
  public pokemon: PokemonDetails
  public regionImage: string | null
  public regionName: string | null
  public statsBackground: string
  public statsWidths: number[]

  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} detailsForEachPokemonService
   * @param {RegionStateService} regionState
   * 
   */

  constructor(    

    private detailsForEachPokemonService: DetailsForEachPokemonApicallService,
    private regionState: RegionStateService,
    private route: ActivatedRoute,

  ) {}

  public ngOnInit(): void{

    this.initializeValues()

  }

  private initializeValues(): void{

    this.loading = false
    this.pokemon = {} as PokemonDetails
    this.regionImage = this.regionState.getRegionImage()
    this.regionName = this.regionState.getRegionName()
    this.statsBackground = ''
    this.statsWidths = []
    this.getIdByUrl()
    this.loadPokemonDetails()
    
  } 
  
  private getIdByUrl(): void {
    this.loading = true
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if (id) {
        this.pokemonId = +id
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
  
  private loadPokemonDetails(): void{
    this.loading = true
    if (this.pokemonId) {
      this.detailsForEachPokemonService.getDetailsOfPokemon(this.pokemonId)
        .subscribe({next: details => {
          console.log(details)
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
      console.log(this.statsBackground)
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
    window.history.back();
  }
  
}
