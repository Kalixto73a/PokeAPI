import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AllPokemonComponent } from './components/all-pokemon/all-pokemon/all-pokemon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AllPokemonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PokeAPI';
}
