import { NamedAPIResource } from "../Regions/regions";

export class Pokedex {
    
    public id: number
    public name: string
    public pokemon_entries: PokemonEntry[]

}

export class PokemonEntry{
    
    public entry_number: number;
    public pokemon_species: NamedAPIResource

}