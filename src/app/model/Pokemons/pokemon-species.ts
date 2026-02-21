export class PokemonSpicies {

    public evolution_chain: NamedAPIResource
    public generation: NamedAPIResource
    public varieties: PokemonVariety[]

}

export class PokemonVariety {

    public is_default: boolean
    public pokemon: NamedAPIResource

}

export class NamedAPIResource {

    public name: string
    public url: string

}