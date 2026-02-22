import { Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonSpeciesApicallService } from '../../services/pokemon-species-apicall/pokemon-species-apicall.service';
import { VariantData } from '../../model/Pokemons/pokemon-details';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DetailsForEachPokemonApicallService, PokemonSpeciesApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrls: ['./sprite-for-each-pokemon.component.css']
})

export class SpriteForEachPokemonComponent implements OnChanges, OnInit {

  @Input() pokemonId!: number
  @Input() shiny: boolean
  @Input() selectedVariantIndex: number 

  @Output() load: EventEmitter<void> = new EventEmitter<void>()
  @Output() variantTypesChanged: EventEmitter<string[]> = new EventEmitter()
  @Output() variantsLoaded: EventEmitter<{ count: number, names: string[], hasShiny?: boolean[] }> = new EventEmitter()

  public allVariantsData: VariantData[]
  public allVariantNames: string[]

  constructor(
    private spriteService: DetailsForEachPokemonApicallService,
    private speciesService: PokemonSpeciesApicallService
  ) {}

  public ngOnInit(): void {
    this.shiny = false
    this.selectedVariantIndex = 0
    this.allVariantsData = []
    this.allVariantNames =[]
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemonId']) {
      this.allVariantsData = []
      this.allVariantNames = []
      this.loadSprites()
    }

    if (changes['selectedVariantIndex'] && this.allVariantsData.length) {
      this.emitCurrentVariantTypes()
    }
  }

  private loadSprites(): void {
    this.spriteService.getDetailsOfPokemon(this.pokemonId)
      .subscribe({
        next: base => {
          this.allVariantsData = [{
            artwork: base.sprites.other['official-artwork'],
            types: base.types,
            hasShiny: !!base.sprites.front_shiny
          }]
          this.speciesService.getPokemonSpeciesData(this.pokemonId)
            .subscribe(species => {
              const variantIds = species.varieties
                .filter(v => !v.is_default)
                .map(v => this.extractIdFromUrl(v.pokemon.url))
              this.allVariantNames = species.varieties.map(v => v.pokemon.name)
              if (variantIds.length === 0) {
                this.emitVariantsLoaded()
                return
              }
              const requests = variantIds.map(id => this.spriteService.getDetailsOfPokemon(id))
              forkJoin(requests).subscribe(variants => {
                variants.filter(v => v !== null).forEach(v => {
                  this.allVariantsData.push({
                    artwork: v!.sprites.other['official-artwork'],
                    types: v!.types,
                    hasShiny: !!v!.sprites.front_shiny
                  })
                })
                this.emitVariantsLoaded()
              })
            })
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: 'There was an error loading sprites.<br><br>Please reload the page and try again.',
            theme: 'dark',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#FF0000',
          }).then(result => { 
            if (result.isConfirmed) window.location.reload()
          })
        }
      })
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter(p => p)
    return +parts[parts.length - 1]
  }

  public get frontArtwork(): string | undefined {
    const current = this.allVariantsData[this.selectedVariantIndex]
    if (!current) return undefined
    return this.shiny ? current.artwork.front_shiny : current.artwork.front_default
  }

  private emitVariantsLoaded(): void {
    this.variantsLoaded.emit({
      count: this.allVariantsData.length,
      names: this.allVariantNames,
      hasShiny: this.allVariantsData.map(v => v.hasShiny)
    })
    this.emitCurrentVariantTypes()
  }

  private emitCurrentVariantTypes(): void {
    const current = this.allVariantsData[this.selectedVariantIndex]
    if (current) {
      this.variantTypesChanged.emit(current.types.map(t => t.type.name))
    }
  }

}