import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="with-nav">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main.with-nav {
        padding-top: 64px;
      }
    `,
  ],
})
export class AppComponent {}
