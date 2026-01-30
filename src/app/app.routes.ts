import { Routes } from '@angular/router';
import { RegionsListComponent } from './components/regions-list/regions-list.component';
import { PokedexForEachRegionComponent } from './components/pokedex-for-each-region/pokedex-for-each-region.component';

export const routes: Routes = [
    {
        path: '',
        component: RegionsListComponent,
    },
    {
        path: 'region/:id',
        component: PokedexForEachRegionComponent
    }
];
