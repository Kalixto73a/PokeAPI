import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, HttpClientModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{

  title = 'Pokedex'

  public showScrollButton: boolean =false
  public buttonBottom: number = 16

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])

  public onWindowScroll() {
    const scrollY = window.scrollY
    const innerHeight = window.innerHeight
    const bodyHeight = document.body.scrollHeight

    this.showScrollButton = scrollY > 200

    const footer = document.querySelector('footer')
    if (footer) {
      const footerRect = footer.getBoundingClientRect()
      const overlap = innerHeight - footerRect.top
      this.buttonBottom = overlap > 0 ? overlap + 16 : 16
    } else {
      this.buttonBottom = 16
    }
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

}
