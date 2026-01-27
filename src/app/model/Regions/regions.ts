export class Regions{

  private count : number
  private next: boolean
  private previous: boolean

  public  results : NamedAPIResource[]

}

export class RegionDetails {
  
  private id: number

  public name: string
  public pokedexes: NamedAPIResource[]


}

export class NamedAPIResource{

  public name: string
  public url: string

}