export class PokemonDetails{

    public id : string
    public name : string
    public sprites  :  DiferentSprites
    public types: PokemonTypes[]
    public weight: number
    public stats: Stats[]
    public species: NamedAPIResource
    
}

export class DiferentSprites{

    public front_default : string | null
    public front_female: string | null
    public front_shiny: string | null
    public front_shiny_female: string | null
    public back_default: string | null
    public back_female: string | null
    public back_shiny: string | null
    public back_shiny_female: string | null

}

export class PokemonTypes{

    public slot: number
    public type: NamedAPIResource

}

export class NamedAPIResource{

    public url: string
    public name: string
    
}

export class Stats{
    
    public base_stat: number
    public stat: NamedAPIResource

}