import { Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { PokedexAPICallService } from '../../services/pokedex-apicall/pokedex-apicall.service'; 
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component'; 
import { HttpClientModule } from '@angular/common/http'; import { Pokemon } from '../../model/Pokemons/pokedex'; 
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component'; 
import { RegionDetailsAPICallService } from '../../services/region-details-apicall/region-details-apicall.service'; 
import { switchMap } from 'rxjs/operators'; 
import { forkJoin } from 'rxjs';
 import { ActivatedRoute, Router } from '@angular/router'; 
 import { PokemonTypesColors } from '../../core/config/types-colors'; 
 import { PokemonTypes } from '../../model/Pokemons/pokemon-details'; 
 import { PokemonNumberComponent } from '../pokemon-number/pokemon-number.component'; 
 import { RegionPokedexIndex } from '../../core/config/pokedex-index'; 
 import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
 import Swal from 'sweetalert2'; 
 import { Subject } from 'rxjs';
 import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

 @Component({ 
    selector: 'app-pokedex-for-each-region', 
    standalone: true, 
    imports: [ CommonModule, SpriteForEachPokemonComponent, HttpClientModule, PokemonTypesComponent, PokemonNumberComponent, LoadingSpinnerComponent, FormsModule], 
    providers: [ PokedexAPICallService, RegionDetailsAPICallService ], 
    templateUrl: './pokedex-for-each-region.component.html', 
    styleUrl: './pokedex-for-each-region.component.css' 
}) 

export class PokedexForEachRegionComponent implements OnInit{

    private searchSubject: Subject<string>
     private _regionId: number | null 
     private spritesLoaded: Set<number>
     private initialPokemonCount: number
     private remainingPokemons: Pokemon[]

     
     public loading: boolean 
     public searchText: string
     public filteredPokemons: Pokemon[]
     public pokemons: Pokemon[] 
     public pokemonTypes: PokemonTypes[] 
     public cardBackground: string

    /*
    * 
    * Constructor
    * 
    * @param {PokedexAPICallService} pokedexService 
    * @param {RegionDetailsAPICallService} getRegionDetailsService 
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

        this.loading = true
        this.searchSubject = new Subject<string>()
        this.initialPokemonCount = 300
        this.remainingPokemons = []
        this.pokemons = [] 
        this._regionId = null
        this.pokemonTypes = [] 
        this.cardBackground = '#fff' 
        this.spritesLoaded = new Set<number>()
        this.filteredPokemons = []
        this.searchText = ''
        this.initSearch()
        this.changeRoute() 
        
    } 
    
    private loadPokemonsForEachRegion(): void { 
        if (this._regionId === null) return
        const indices = RegionPokedexIndex[this._regionId]
        this.getRegionDetailsService.getRegionPokedex(this._regionId, indices)
        .pipe(switchMap(pokedexes => { 
            const calls = pokedexes.map(p => this.pokedexService.getPokedexRegionByPokedexUrl(p.url))
            return forkJoin(calls) 
            }))
        .subscribe({ 
            next: allPokedexData => { 
                const allPokemons = allPokedexData
                .flatMap(pokedexData => 
                    pokedexData.pokemon_entries.map(entry => {const url = entry.pokemon_species.url; const id = Number(url.split('/').filter(Boolean).pop())
                    return { name: entry.pokemon_species.name, url, id }
                 }) 
                ).filter((pokemon, index, self) =>
                    index === self.findIndex(p => p.id === pokemon.id))
                this.pokemons = allPokemons.slice(0, this.initialPokemonCount)
                this.filteredPokemons = [...this.pokemons]
                this.remainingPokemons = allPokemons.slice(this.initialPokemonCount)
            },
            error: () => {
                this.loading = false
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Oops...', 
                    html: 'There was an error loading Pokémon from this Region.', 
                    theme: 'dark' 
                }) .then((result) => {
                        if (result.isConfirmed) { window.location.reload() }
                     }) 
            } 
         }) 
    } 

    private changeRoute(): void{ 
        this.route.paramMap
        .subscribe(params => { 
            const id = Number(params.get('id'))
                if ((id && id !== this._regionId)) { 
                    this._regionId = id
                    this.loadPokemonsForEachRegion()
                } 
        })
    } 
    
    public onTypesLoaded(event: { pokemonId: number, types: PokemonTypes[] }){ 

        const { pokemonId, types } = event;
        const pokemon = this.pokemons.find(p => p.id === pokemonId)
        if (pokemon) {
            pokemon.cardBackground = this.calculateCardBackground(types);
        }

    } 
    
    public calculateCardBackground(types: PokemonTypes[]): string {
        if (!types || types.length === 0) return '#fff'
        const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777')
        if (colors.length === 1) return colors[0]
        return `linear-gradient(135deg, ${colors.join(', ')})`
    } 

    public goToPokemonDetails(id: number): void { 
        if (this._regionId !== null) {
            this.router.navigate(['pokemon', id], {
                relativeTo: this.route
            })
        }
    }

    public onSpriteLoaded(pokemonId: number) {
        this.spritesLoaded.add(pokemonId)

        if (this.spritesLoaded.size >= Math.min(this.initialPokemonCount, this.pokemons.length)) {
        this.loading = false
        this.loadRemainingPokemons()
        }
    }

    private loadRemainingPokemons() {
        if (!this.remainingPokemons.length) return

        const chunkSize = 50
        const nextChunk = this.remainingPokemons.splice(0, chunkSize)
        this.pokemons = [...this.pokemons, ...nextChunk]
        this.applyFilter()
        if (this.remainingPokemons.length) {
            setTimeout(() => this.loadRemainingPokemons(), 100)
        }
    }

    public initSearch(): void {
        this.searchSubject
        .pipe(
            debounceTime(500),          
            distinctUntilChanged()      
        )
        .subscribe(value => {
            this.searchText = value
            this.applyFilter()
        })
    }

    public applyFilter(): void {
        const text = this.searchText.toLowerCase().trim()
        if (!text) {
            this.filteredPokemons = [...this.pokemons]
            return
        }
        this.filteredPokemons = this.pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(text)
        )
    }

    public onSearchChange(event: Event): void {
         const input = event.target as HTMLInputElement
         this.searchSubject.next(input.value)
    }

}