import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <a routerLink="/dashboard" class="logo">AI Interview Prep</a>
        <ng-container *ngIf="authService.isLoggedIn; else authLinks">
          <div class="nav-links">
            <a routerLink="/chatbot" routerLinkActive="active">Chatbot</a>
            <a routerLink="/practice/interview" routerLinkActive="active">Live Interview</a>
            <a routerLink="/practice/subjective" routerLinkActive="active">Subjective</a>
            <a routerLink="/practice/objective" routerLinkActive="active">Objective</a>
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a *ngIf="authService.isAdmin" routerLink="/admin/questions" routerLinkActive="admin-link">Admin</a>
          </div>
          <div class="nav-right">
            <span class="user-name">{{ authService.currentUser?.name }}</span>
            <button class="btn btn-secondary" (click)="authService.logout()">Logout</button>
          </div>
        </ng-container>
        <ng-template #authLinks>
          <div class="nav-right">
            <a routerLink="/login" class="btn btn-secondary">Login</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { position: fixed; top: 0; left: 0; right: 0; background: var(--bg-card); border-bottom: 1px solid var(--border); z-index: 100; height: 64px; }
    .nav-content { max-width: 1400px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; height: 100%; justify-content: space-between; }
    .logo { font-size: 18px; font-weight: 700; color: var(--primary-light); }
    .nav-links { display: flex; gap: 8px; }
    .nav-links a { padding: 8px 16px; border-radius: 8px; font-size: 14px; color: var(--text-muted); transition: all 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--bg-input); }
    .nav-links a.admin-link { color: var(--warning); }
    .nav-right { display: flex; align-items: center; gap: 12px; }
    .user-name { font-size: 14px; color: var(--text-muted); }
  `],
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
