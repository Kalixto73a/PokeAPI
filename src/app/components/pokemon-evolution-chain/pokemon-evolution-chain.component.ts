import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PokemonSpeciesApicallService } from '../../services/pokemon-species-apicall/pokemon-species-apicall.service';
import { EvolutionChainApicallService } from '../../services/evolution-chain-apicall/evolution-chain-apicall.service';
import { DetailsForEachPokemonApicallService } from '../../services/pokemon-details/pokemon-details-apicall.service';
import { SpriteForEachPokemonComponent } from '../sprite-for-each-pokemon/sprite-for-each-pokemon.component';
import { EvolutionChain, EvolutionChainOfPokemon, EvolutionDetails } from '../../model/Pokemons/pokemon-evolution-chain';
import { PokemonTypes } from '../../model/Pokemons/pokemon-details';
import { PokemonTypesColors } from '../../core/config/types-colors';
import { PokemonRegionRanges } from '../../core/config/pokemon-regions-range';
import { PhysicalStatsTexts } from '../../core/config/physical-stats-texts';
import { GenderTypes } from '../../core/config/gender-types';
import { RegionNames } from '../../core/config/regions-names';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-evolution-chain',
  standalone: true,
  imports: [CommonModule, SpriteForEachPokemonComponent],
  providers: [ PokemonSpeciesApicallService, EvolutionChainApicallService, DetailsForEachPokemonApicallService],
  templateUrl: './pokemon-evolution-chain.component.html',
  styleUrl: './pokemon-evolution-chain.component.css'
})

export class PokemonEvolutionChainComponent implements OnInit {

  @Input() speciesUrl!: string
  @Input() pokemonId: number
  
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
    private detailsForEachPokemonService: DetailsForEachPokemonApicallService,
    private router: Router

  ) {}

  public ngOnInit(): void {

    this.initializeValues()

  }

  private initializeValues(): void {

    this.loading = false
    this.evolutionChain = null
    this.pokemonTypesMap = {}
    this.getEvolutionChainUrlFromSpecies()

  }

  private getEvolutionChainUrlFromSpecies(): void {
    if (!this.speciesUrl) return
    this.loading = true
    this.speciesService.getPokemonSpeciesData(this.pokemonId).subscribe({
      next: speciesData => {
        const evolutionUrl = speciesData.evolution_chain?.url
        if (evolutionUrl) {
          this.evolutionChainService.getPokemonEvolutionChain(evolutionUrl)
            .subscribe(chainData => this.processEvolutionChain(chainData))
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
        })
        .then(result => { if (result.isConfirmed) window.location.reload()
        })
      }
    })
  }

  private processEvolutionChain(chainData: EvolutionChain): void {
    this.evolutionChain = chainData
    const observables = this.getEvolutionChainOfPokemon(chainData.chain)
      .map(p => this.detailsForEachPokemonService.getDetailsOfPokemon(this.getPokemonIdFromSpeciesUrl(p.species.url)))

    forkJoin(observables).subscribe(results => {
      results.forEach(pokemonData => {
        this.pokemonTypesMap[Number(pokemonData.id)] = pokemonData.types
      })
      this.loading = false
    })
  }

  public getEvolutionChainOfPokemon(result: EvolutionChainOfPokemon): EvolutionChainOfPokemon[] {
    const results: EvolutionChainOfPokemon[] = []
    if (!result) return results
    results.push(result)
    result.evolves_to.forEach(child => results.push(...this.getEvolutionChainOfPokemon(child)))
    return results
  }

  public getPokemonIdFromSpeciesUrl(url: string): number {
    const parts = url.split('/').filter(p => p)
    return +parts[parts.length - 1]
  }

  public getCardBackgroundForPokemon(types: PokemonTypes[]): string {
    if (!types || types.length === 0) return '#fff'
    const colors = types.map(t => PokemonTypesColors[t.type.name] ?? '#777')
    return colors.length === 1 ? colors[0] : `linear-gradient(135deg, ${colors.join(', ')})`
  }

  public changePokemon(pokemonId: number): void {
    const regionId = this.getRegionByPokemonId(pokemonId)
    const regionName = RegionNames[regionId]

    this.router.navigate([
      'Pokedex',
      regionName,
      'pokemon',
      pokemonId
    ])
  }

  private getRegionByPokemonId(pokemonId: number): number {
    for (const entry of PokemonRegionRanges) {
      const r = entry.range
      if (Array.isArray(r[0])) { 
        for (const [start, end] of r as [number, number][]) {
          if (pokemonId >= start && pokemonId <= end) return entry.regionId
        }
      } else if ((r as number[]).includes(pokemonId)) {
        return entry.regionId
      }
    }
    return 1
  }

  public getTriggerText(detail: EvolutionDetails): string {
    if (!detail.trigger) return ''

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
        if(detail.known_move) return `Knowing ${this.toTitleCase(detail.known_move.name.replace('-', ' '))} and leveling up`
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
        if (detail.min_move_count) return `Using an strong-style move ${detail.min_move_count} times`
        return 'Using an strong-style move specific times'
      case 'spin':
        return 'Spinning with a sweet equiped on the pokemon'
      case 'take-damage':
        return `Receive damage until having ${detail.min_damage_taken} hp`
      case 'recoil-damage':
        return `Taking ${detail.min_damage_taken} hp by recoil damage`
      case 'tower-of-darkness':
        return 'Chossing tower of Darkness or using Scroll of Darkness'
      case 'tower-of-waters':
        return 'Choosing tower of Waters or using Scroll of Waters'
      case 'agile-style-move':
        if (detail.min_move_count) return `Using an agile-style move ${detail.min_move_count} times`
        return 'Using an agile-style move specific times'
      default:
        return detail.trigger.name.replace('-', ' ')
    }
  }

  public openEvolutionPopup(details: EvolutionDetails[]): void {
    if (!details.length) {
      Swal.fire({ icon: 'info', title: 'Evolution', text: 'This pokemon does not have special requirements.', theme: 'dark' })
      return
    }

    const html = `<ul style="text-align:center">
      ${details.filter(d => d.trigger?.name).map(d => `<li>• ${this.getTriggerText(d)}</li>`).join('')}
    </ul>`

    Swal.fire({ icon: 'info', title: 'Evolution Requirements', html, theme: 'dark', confirmButtonText: 'Thanks' })
  }

  private getPhysicalStatsText(value: number | null | undefined): string {
    if (value === null || value === undefined) return ''
    return PhysicalStatsTexts[value] ?? 'Unknown condition'
  }

  private toTitleCase(text: string): string {
    return text
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  private getGenderTypeText(value: number | null | undefined): string {
    if (value === null || value === undefined) return ''
    return GenderTypes[value] ?? 'Unknown gender'
  }
}
