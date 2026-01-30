import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, HttpClientModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'PokeAPI';

  ngOnInit(): void{
    Swal.fire({
          icon: 'info',
          title: 'Welcome',
          html: 'Please select a region to see his pokemons.',
          theme: 'dark',
          confirmButtonText: 'Okey',
          customClass: {
            confirmButton: 'bg-[#FFD700] text-black hover:bg-[#DAA520]'
          },
        })
  }
}
