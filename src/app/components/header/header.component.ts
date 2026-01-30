import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor (
    private router: Router
  ) {}


  public ngOnInit(): void {
    this.initializeValues()
  }

  private initializeValues(): void {

    this.returnHomePage()
  }

  public returnHomePage(): void {
        this.router.navigate(['/'])
      }
}
