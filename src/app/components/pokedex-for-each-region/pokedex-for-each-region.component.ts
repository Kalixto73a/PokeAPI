import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokedexAPICallService } from '../../services/pokedex-apicall/pokedex-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { Pokemon } from '../../model/Pokemons/pokedex';
import Swal from 'sweetalert2';
import { RegionDetailsAPICallService } from '../../services/region-details-apicall/region-details-apicall.service';

@Component({
  selector: 'app-pokedex-for-each-region',
  standalone: true,
  imports: [ CommonModule, SpriteForEachPokemonComponent, HttpClientModule],
  providers: [ PokedexAPICallService, RegionDetailsAPICallService ],
  templateUrl: './pokedex-for-each-region.component.html',
  styleUrl: './pokedex-for-each-region.component.css'
})

export class PokedexForEachRegionComponent implements OnInit{

    private _regionId: number

  @Input() public set regionId(id: number | null ){
    if (id !== null){
      this._regionId = id
      this.loadPokemonsForEachRegion()
    }
  }

  public loading: boolean
  public pokemons: Pokemon[]

  /**
   * Constructor
   * 
   * @param {PokedexAPICallService} pokedexService
   * @param {RegionDetailsAPICallService} getRegionDetailsService
   * 
   */
  constructor (
    private pokedexService: PokedexAPICallService,
    private getRegionDetailsService: RegionDetailsAPICallService
  ) {}

  public ngOnInit(): void{
    this.initializeValues()
  }

  private initializeValues(): void {

    this.loading = false
    this.pokemons = []
    this.regionId = null

  }

  private loadPokemonsForEachRegion(): void {
    this.loading = true;

    this.getRegionDetailsService.getRegionDetails(this._regionId).subscribe({
      next: (pokedex) => {
        this.pokedexService.getPokedexRegionByPokedexUrl(pokedex.url).subscribe({
          next: (pokedexData) => {
            this.pokemons = pokedexData.pokemon_entries.map(entry => {
              const url = entry.pokemon_species.url;
              const id = Number(url.split('/').filter(Boolean).pop());
              return {
                name: entry.pokemon_species.name,
                url,
                id
              };
            });
            this.loading = false;
            console.log(this.pokemons);
          },
          error: () => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              html: 'There was an error loading Pokémon from this Region.<br><br>Please reload the page and try again.',
              theme: 'dark',
              confirmButtonText: 'Reload Page',
              confirmButtonColor: '#FF0000',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          }
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'There was an error loading the region details.<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Reload Page',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }
    
  public get regionId(): number {
    return this._regionId
  }

}
