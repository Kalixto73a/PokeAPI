import { Component, Input, OnInit, } from '@angular/core';
import { EvolutionChain, EvolutionChainOfPokemon, EvolutionDetails } from '../../model/Pokemons/pokemon-evolution-chain';
import { PokemonSpeciesApicallService } from '../../services/pokemon-species-apicall/pokemon-species-apicall.service';
import { EvolutionChainApicallService } from '../../services/evolution-chain-apicall/evolution-chain-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { CommonModule } from '@angular/common';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { forkJoin } from 'rxjs';
import  Swal  from 'sweetalert2';


@Component({
  selector: 'app-pokemon-evolution-chain',
  standalone: true,
  imports: [ CommonModule, SpriteForEachPokemonComponent, ],
  providers: [ PokemonSpeciesApicallService, EvolutionChainApicallService, DetailsForEachPokemonApicallService ],
  templateUrl: './pokemon-evolution-chain.component.html',
  styleUrl: './pokemon-evolution-chain.component.css'
})

export class PokemonEvolutionChainComponent implements OnInit {

  @Input() speciesUrl: string

  public loading: boolean
  public evolutionChain: EvolutionChain | null 
  public pokemonTypesMap: Record<number, PokemonTypes[]>

  /**
   * 
   * Constructor
   * 
   * @param {PokemonSpeciesApicallService} speciesService
   * @param {EvolutionChainApicallService} evolutionChainService
   * @param {DetailsForEachPokemonApicallService} detailsForEachPokemonService
   * 
   */

  constructor(

    private speciesService: PokemonSpeciesApicallService,
    private evolutionChainService: EvolutionChainApicallService,
    private detailsForEachPokemonService: DetailsForEachPokemonApicallService

  ) {}


  public ngOnInit(): void {
    
    this.initializeValues()

  }
  
  private initializeValues(): void{

      this.loading = false
      this.evolutionChain = null
      this.pokemonTypesMap = {}
      this.getEvolutionChainUrlFormSpecies()
    
  }

  private getEvolutionChainUrlFormSpecies(): void{

    if (!this.speciesUrl) return
    
    this.loading = true
    this.speciesService.getPokemonSpeciesData(this.speciesUrl)
    .subscribe({
      next: speciesData => {
        const evolutionUrl = speciesData.evolution_chain?.url
        if (evolutionUrl) {
          this.evolutionChainService.getPokemonEvolutionChain(evolutionUrl)
          .subscribe(
            chainData => {
              this.evolutionChain = chainData
              const observables = this.getEvolutionChainOfPokemon(chainData.chain).map(p => {
                const id = this.getPokemonIdFromSpeciesUrl(p.species.url);
                return this.detailsForEachPokemonService.getDetailsOfPokemon(id);
              });

              forkJoin(observables).subscribe(results => {
                results.forEach(pokemonData => {
                  const id = Number(pokemonData.id)
                  this.pokemonTypesMap[id] = pokemonData.types;
                });
                this.loading = false;
              });
            }
          )
        }
      },
      error: () => {
        this.loading = false
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'There was an error loading the Pokémon evolution chain.<br><br>Please reload the page and try again.',
          theme: 'dark',
          confirmButtonText: 'Reload Page',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      }
    })
  }

  public getEvolutionChainOfPokemon( result: EvolutionChainOfPokemon ): EvolutionChainOfPokemon[] {

    const results: EvolutionChainOfPokemon[] = []
    if (!result) return results
    results.push(result)
    result.evolves_to.forEach(child => {
      results.push(...this.getEvolutionChainOfPokemon(child))
    })
    return results
  }

  public getPokemonIdFromSpeciesUrl(url: string): number {
    if (!url) return 0;
    const parts = url.split('/').filter(p => p)
    return +parts[parts.length - 1]
  }

  public loadPokemonTypes(pokemonId: number): void {
    if (this.pokemonTypesMap[pokemonId]) return

    this.detailsForEachPokemonService.getDetailsOfPokemon(pokemonId)
      .subscribe(pokemonData => {
        this.pokemonTypesMap[pokemonId] = pokemonData.types
      });
  }


  public getValidEvolutionRequirements(details: EvolutionDetails[]): EvolutionDetails[] {
    if (!details) return [];
    console.log(details)
    return details.filter(detail => 
      detail.gender != null ||
      detail.held_item?.name != null ||
      detail.item?.name != null ||
      detail.known_move?.name != null ||
      detail.known_move_type?.name != null ||
      detail.location != null ||
      detail.min_affection != null ||
      detail.min_beauty != null ||
      detail.min_damage_taken != null ||
      detail.min_happiness != null ||
      detail.min_level != null ||
      detail.min_move_count != null ||
      detail.min_steps != null ||
      detail.needs_overworld_rain != null ||
      detail.needs_multiplayer != null ||
      detail.party_species != null ||
      detail.party_type != null ||
      detail.relative_physical_stats != null ||
      detail.time_of_day != null ||
      detail.trade_species != null ||
      detail.turn_upside_down != null ||
      detail.trigger?.name != null ||
      detail.used_move?.name != null,
    )
  }

  public getTriggerText(detail: EvolutionDetails): string {
    if (!detail.trigger) return '';

    switch (detail.trigger.name) {
      case 'level-up':
        if (detail.min_happiness && detail.time_of_day) return `Having a minimum happiness of  ${detail.min_happiness} at ${detail.time_of_day}`
        if (detail.min_happiness && detail.known_move_type) return `Having a minimum happiness of  ${detail.min_happiness} and knowing ${this.toTitleCase(detail.known_move_type.name)} type movement`
        if (detail.min_affection && detail.known_move_type) return `Having a minimum affection of ${detail.min_affection} hearts and knowing ${this.toTitleCase(detail.known_move_type.name)} type movement`
        if (detail.min_level && detail.party_type) return `Evolves at level ${detail.min_level} with a ${detail.party_type.name} type pokemon on the team`
        if (detail.min_level && detail.turn_upside_down) return `Evolves at level ${detail.min_level} and turning the console upside down`
        if (detail.min_level && detail.relative_physical_stats !== null) return `Evolves at level ${detail.min_level} and ${this.getPhysicalStatsText(detail.relative_physical_stats)}`
        if (detail.min_level && detail.time_of_day) return `Evolves at level ${detail.min_level} at ${detail.time_of_day}`
        if (detail.min_level && detail.needs_overworld_rain) return `Evolves at level ${detail.min_level} and while it rains`
        if (detail.min_beauty) return `Having minimum beauty of ${detail.min_beauty}`
        if (detail.min_steps) return `Walking a minimum of ${detail.min_steps} steps`
        if (detail.min_affection) return `Having a minimum affection of ${detail.min_affection} hearts`
        if (detail.min_happiness) return `Having a minimum happiness of  ${detail.min_happiness}`  
        if(detail.party_species) return `Having ${this.toTitleCase(detail.party_species.name)} in the team`
        if(detail.location) return `Leveling up in ${this.toTitleCase(detail.location.name)}`
        if (detail.min_level) return `Evolves at level ${detail.min_level}`
        if(detail.min_steps) return `minumum steps walked`
        if(detail.known_move) return `Knowing ${this.toTitleCase(detail.known_move.name.replace('-', ' '))}`
        return `level up`
      case 'use-item':
        if (detail.item && detail.gender) return `Being ${this.getGenderTypeText(detail.gender)} and using ${this.toTitleCase(detail.item.name.replace('-', ' '))}`
        if (detail.item) return `Using ${this.toTitleCase(detail.item.name.replace('-', ' '))}`
        return 'Using an item'
      case 'trade':
        if (detail.trade_species) return `Trading for a ${this.toTitleCase(detail.trade_species.name)}`
        if (detail.held_item) return `Tading the pokemon holding ${this.toTitleCase(detail.held_item.name.replace('-', ' '))}`
        return `Trading`
      case 'use-move':
        if (detail.min_move_count) return `Using ${detail.used_move?.name} ${detail.min_move_count} times`
        return 'Using a specific move specific times'
      case 'three-critical-hits':
        return 'Dealing three critical hits in only one combat'
      case 'shed':
        return 'If there is a space in the team + a pokeball'
      case 'strong-style-move':
        return 'using strong-style'
      case 'spin':
        return 'spinning with a sweet equiped on the pokemon'
      case 'take-damage':
        return `Receive damage until having ${detail.min_damage_taken} hp`
      case 'recoil-damage':
        return `Taking ${detail.min_damage_taken} hp by recoil damage`
      case 'tower-of-darkness':
        return 'Chossing tower of Darkness or using Scroll of Darkness'
      case 'tower-of-waters':
        return 'Choosing tower of Waters or using Scroll of Waters'
      default:
        return detail.trigger.name.replace('-', ' ');
    }
  }

  public getPhysicalStatsText(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (value) {
      case -1:
        return 'Attack < Defense';
      case 0:
        return 'Attack = Defense';
      case 1:
        return 'Attack > Defense';
      default:
        return 'Unknown condition';
    }
  }

  public getGenderTypeText(value: number | null | undefined) : string {

    if (value === null || value === undefined) {
      return '';
    }
    
    switch (value) {
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      default:
        return 'Unknown gender';
    }
  
  }


public buildEvolutionRequirements(details: any[]): string[] {
  const reqs: string[] = [];

  details.forEach(detail => {

    if (detail.trigger?.name) {

      let triggerText = this.getTriggerText(detail);

      reqs.push(triggerText);

    }
  });
  return reqs;
}

public openEvolutionPopup(details: EvolutionDetails[]): void {
  if (!details.length) {
    Swal.fire({
      icon: 'info',
      title: 'Evolution',
      text: 'This pokemon dont have special requirements.',
      theme: 'dark'
    });
    return;
  }

  const requirements = details
    .filter(detail => detail.trigger?.name)
    .map(detail => this.getTriggerText(detail));

  if (!requirements.length) {
    Swal.fire({
      icon: 'info',
      title: 'Evolution',
      text: 'This pokemon does not have special requirements.',
      theme: 'dark'
    });
    return;
  }

  const html = `
    <ul style="text-align:center">
      ${requirements.map(r => `<li>• ${r}</li>`).join('')}
    </ul>
  `;

  Swal.fire({
      icon: 'info',
      title: 'Evolution Requirements',
      html,
      theme: 'dark',
      confirmButtonText: 'Thanks'
    });
  }

  private toTitleCase(text: string): string {
    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  public getCardBackgroundForPokemon(types: PokemonTypes[]): string {
    return this.calculateCardBackground(types)
  }

  public calculateCardBackground(types: PokemonTypes[]): string {
    if (!types || types.length === 0) return '#fff';

    const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777');

    if (colors.length === 1) return colors[0];

    return `linear-gradient(135deg, ${colors.join(', ')})`;
  }

}


