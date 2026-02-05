export class EvolutionChain {

  public id: number       
  public chain: EvolutionChainOfPokemon;

}

export class EvolutionChainOfPokemon {

    public evolution_details: EvolutionDetails[]
    public evolves_to: EvolutionChainOfPokemon[]
    public species: NamedAPIResource
}

export class EvolutionDetails {

  public gender?: number | null
  public held_item?: NamedAPIResource | null
  public item?: NamedAPIResource | null
  public known_move?: NamedAPIResource | null
  public known_move_type?: NamedAPIResource | null
  public location?: NamedAPIResource | null
  public min_affection?: number | null
  public min_beauty?: number | null
  public min_damage_taken?: number | null
  public min_happiness?: number | null
  public min_level?: number | null
  public min_move_count?: number | null
  public min_steps?: number | null
  public needs_overworld_rain?: boolean | null
  public needs_multiplayer?: boolean | null
  public party_species?: NamedAPIResource | null
  public party_type?: NamedAPIResource | null
  public relative_physical_stats?: number | null
  public time_of_day?: string | null
  public trade_species?: NamedAPIResource | null
  public turn_upside_down?: boolean | null
  public trigger?: NamedAPIResource | null
  public used_move?: NamedAPIResource | null
  
}

export class NamedAPIResource {

    public name: string
    public url : string

}