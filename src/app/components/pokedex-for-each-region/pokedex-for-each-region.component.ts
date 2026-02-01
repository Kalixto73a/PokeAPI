import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokedexAPICallService } from '../../services/pokedex-apicall/pokedex-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { Pokemon } from '../../model/Pokemons/pokedex';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { RegionDetailsAPICallService } from '../../services/region-details-apicall/region-details-apicall.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router  } from '@angular/router';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokedex-for-each-region',
  standalone: true,
  imports: [ CommonModule, SpriteForEachPokemonComponent, HttpClientModule, PokemonTypesComponent, PokemonNumberComponent],
  providers: [ PokedexAPICallService, RegionDetailsAPICallService ],
  templateUrl: './pokedex-for-each-region.component.html',
  styleUrl: './pokedex-for-each-region.component.css'
})

export class PokedexForEachRegionComponent implements OnInit{

  private _regionId: number | null

  public loading: boolean
  public pokemons: Pokemon[]
  public pokemonTypes: PokemonTypes[]
  cardBackground: string ;

  /**
   * Constructor
   * 
   * @param {PokedexAPICallService} pokedexService
   * @param {RegionDetailsAPICallService} getRegionDetailsService
   * 
   */
  constructor (
    private pokedexService: PokedexAPICallService,
    private getRegionDetailsService: RegionDetailsAPICallService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void{
    this.initializeValues()
  }

  private initializeValues(): void {

    this.loading = false
    this.pokemons = []
    this._regionId = null;
    this.pokemonTypes = []
    this.cardBackground = '#fff'
    this.changeRoute()
    
  }

  private loadPokemonsForEachRegion(): void {
  if (this._regionId === null) return;

  this.loading = true;

  this.getRegionDetailsService
    .getRegionDetails(this._regionId)
    .pipe(
      switchMap(pokedex =>
        this.pokedexService.getPokedexRegionByPokedexUrl(pokedex.url)
      )
    )
    .subscribe({
      next: pokedexData => {
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
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'There was an error loading Pokémon from this Region.',
          theme: 'dark'
        });
      }
    });
  }

  private changeRoute(): void{
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if ((id)) {
        this._regionId = id;
        this.loadPokemonsForEachRegion();
      }

    });
  }
  public formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0')
  }

  public onTypesLoaded(event: { pokemonId: number, types: PokemonTypes[] }) {
    const { pokemonId, types } = event;

    // calculamos el background
    const background = this.calculateCardBackground(types);

    // asignamos el background solo al Pokémon correspondiente
    const pokemon = this.pokemons.find(p => p.id === pokemonId);
    if (pokemon) {
      pokemon.cardBackground = background;
    }
  }
  
  public calculateCardBackground(types: PokemonTypes[]): string {
    if (!types || types.length === 0) return '#fff';

    const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777');

    if (colors.length === 1) return colors[0];

    // gradiente diagonal simple para 2 colores
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  }

  public goToPokemonDetails(id: number): void {
    this.router.navigate([`/pokemon/${id}`]);
  }

}
