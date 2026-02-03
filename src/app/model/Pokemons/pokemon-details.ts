export class PokemonDetails{

    public id : string
    public name : string
    public sprites  :  DiferentSprites
    public types: PokemonTypes[]
    public weight: number
    public stats: Stats[]
}

export class DiferentSprites{

    public front_default : string
    public front_female: string
    public front_shiny: string
    public front_shiny_female: string
    public back_default: string
    public back_female: string
    public back_shiny: string
    public back_female_shiny: string

}

export class PokemonTypes{

    public slot: number
    public type: NamedAPIResource

}

export class NamedAPIResource{

    private url: string

    public name: string
    
}

export class Stats{
    
    public base_stat: number
    public stat: NamedAPIResource

}