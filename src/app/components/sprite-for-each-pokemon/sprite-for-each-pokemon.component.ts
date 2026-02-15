import { Component, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonDetails, DiferentSprites } from '../../model/Pokemons/pokemon-details';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprite-for-each-pokemon',
  standalone: true,
  imports: [CommonModule],
  providers: [DetailsForEachPokemonApicallService],
  templateUrl: './sprite-for-each-pokemon.component.html',
  styleUrls: ['./sprite-for-each-pokemon.component.css']
})
export class SpriteForEachPokemonComponent implements OnChanges {

  @Input() pokemonId!: number
  @Input() spriteIndex?: number
  @Input() gender: 'male' | 'female' = 'male'
  @Input() shiny: boolean = false

  @Output() load: EventEmitter<void> = new EventEmitter<void>()

  public frontSprite?: string
  public backSprite?: string
  public showFront: boolean = true

  constructor(private spriteService: DetailsForEachPokemonApicallService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loadSprites();
  }

  private loadSprites(): void {

  this.spriteService.getDetailsOfPokemon(this.pokemonId)
    .subscribe({
      next: (response: PokemonDetails) => {
        const sprites: DiferentSprites = response.sprites

        if (this.spriteIndex !== undefined) {
            this.frontSprite = sprites.front_default ?? undefined
            this.backSprite = undefined
            this.showFront = true
            return
          this.showFront = true
          return
        }

        let frontKey: keyof DiferentSprites
        let backKey: keyof DiferentSprites

        if (this.gender === 'female') {
          frontKey = this.shiny ? 'front_shiny_female' : 'front_female'
          backKey  = this.shiny ? 'back_shiny_female' : 'back_female'

          if (!sprites[frontKey]) frontKey = this.shiny ? 'front_shiny' : 'front_default'
          if (!sprites[backKey]) backKey = this.shiny ? 'back_shiny' : 'back_default'
        } else {
          frontKey = this.shiny ? 'front_shiny' : 'front_default'
          backKey  = this.shiny ? 'back_shiny' : 'back_default'
        }

        this.frontSprite = sprites[frontKey] ?? sprites.front_default ?? undefined
        this.backSprite = sprites[backKey] ?? sprites.back_default ?? undefined
        this.showFront = true

      },
      error: () => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: 'There was an error loading the Pokémon sprite.<br><br>Please reload the page and try again.',
        theme: 'dark',
        confirmButtonText: 'Reload Page',
        confirmButtonColor: '#FF0000',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    })
}

  public toggleSprite(): void {
    this.showFront = !this.showFront
  }

  public onSpriteLoaded(): void {
    this.load.emit()
  }
}
