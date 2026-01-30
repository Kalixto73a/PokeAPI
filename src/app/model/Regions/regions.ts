export class Regions{

  private count : number
  private next: boolean
  private previous: boolean

  public  results : NamedAPIResource[]

}


export class NamedAPIResource{

  public id: number
  public name: string
  public url: string

}