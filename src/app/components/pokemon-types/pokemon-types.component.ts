import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'
import { PokemonDetails, PokemonTypes, NamedAPIResource } from '../../model/Pokemons/pokemon-details';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonTypesColors } from '../../core/config/types-colors';

@Component({
  selector: 'app-pokemon-types',
  standalone: true,
  imports: [ CommonModule ],
  providers: [ DetailsForEachPokemonApicallService ],
  templateUrl: './pokemon-types.component.html',
  styleUrl: './pokemon-types.component.css'
})


export class PokemonTypesComponent implements OnInit {

  @Input() pokemonId : number
  @Output() typesLoaded = new EventEmitter<{ pokemonId: number, types: PokemonTypes[] }>()
  
  public types: PokemonTypes[] 
  /**
   * 
   * Constructor
   * 
   * @param {DetailsForEachPokemonApicallService} typesService
   * 
   */
  constructor(private typesService: DetailsForEachPokemonApicallService) {}

  public ngOnInit(): void{

    this.initializeValues()

  }

  private initializeValues(): void{

    this.types = []
    this.loadTypesOfThePokemon()

  }

  private loadTypesOfThePokemon(): void{

    this.typesService.getDetailsOfPokemon(this.pokemonId)
    .subscribe({
      next:(response: PokemonDetails) => {
        this.types = response.types.map( t => {
          return {
            slot: t.slot,
            type: {
              name: t.type.name
            } as NamedAPIResource
          }as PokemonTypes
        })
        this.typesLoaded.emit({ pokemonId: this.pokemonId, types: this.types })
      }
    })
  }

  public getTypeColor(typeName: string): string {
    return PokemonTypesColors[typeName];
  }

}
