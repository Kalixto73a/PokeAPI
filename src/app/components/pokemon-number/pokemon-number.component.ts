import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pokemon-number',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-number.component.html',
  styleUrl: './pokemon-number.component.css'
})
export class PokemonNumberComponent {

  @Input() pokemonId : number

  public formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0')
  }

}
