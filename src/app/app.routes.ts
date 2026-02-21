import { Routes } from '@angular/router';
import { RegionsListComponent } from './components/regions-list/regions-list.component';
import { PokedexForEachRegionComponent } from './components/pokedex-for-each-region/pokedex-for-each-region.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Regions',
    pathMatch: 'full'
  },
  {
    path: 'Regions',
    loadComponent: () =>
      import('./components/regions-list/regions-list.component')
        .then(c => c.RegionsListComponent)
  },
  {
    path: 'Pokedex/:regionName',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/pokedex-for-each-region/pokedex-for-each-region.component')
            .then(c => c.PokedexForEachRegionComponent)
      },
      {
        path: 'pokemon/:pokemonId',
        loadComponent: () =>
          import('./components/pokemon-details/pokemon-details.component')
            .then(c => c.PokemonDetailsComponent)
      }
    ]
  }
]
