export class Pokedex {
    
    private id: number
    private name: string
    public pokemon_entries: PokemonsOfThatRegion[]

}

export class PokemonsOfThatRegion{
    
    public entry_number: number;
    public pokemon_species: Pokemon

}

export class Pokemon{

    public id: number
    public name: string
    public url: string

}
