import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonDetails, PokemonTypes, NamedAPIResource } from '../../model/Pokemons/pokemon-details';
import { PokemonTypesColors } from '../../core/config/types-colors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-types',
  standalone: true,
  imports: [CommonModule],
  providers: [DetailsForEachPokemonApicallService],
  templateUrl: './pokemon-types.component.html',
  styleUrls: ['./pokemon-types.component.css']
})

export class PokemonTypesComponent implements OnInit {

  @Input() types: PokemonTypes[]
  @Input() pokemonId!: number

  @Output() typesLoaded = new EventEmitter<{ pokemonId: number, types: PokemonTypes[] }>()

  constructor(private typesService: DetailsForEachPokemonApicallService) {}

  public ngOnInit(): void {
    this.initializeValues()
    if (!this.types.length && this.pokemonId) {
      this.loadTypesOfThePokemon()
    }
  }

  private initializeValues(): void{
    this.types = []
  }

  private loadTypesOfThePokemon(): void {
    this.typesService.getDetailsOfPokemon(this.pokemonId).subscribe({
      next: (response: PokemonDetails) => {
        this.types = response.types.map(t => ({
          slot: t.slot,
          type: { name: t.type.name } as NamedAPIResource
        })) as PokemonTypes[];

        this.typesLoaded.emit({ pokemonId: this.pokemonId, types: this.types })
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'There was an error loading types.<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Retry',
          confirmButtonColor: '#FF0000',
        }).then(result => { 
          if (result.isConfirmed) window.location.reload()
        })
      }
    })
  }

  public getTypeColor(typeName: string): string {
    return PokemonTypesColors[typeName] ?? '#777'
  }

}