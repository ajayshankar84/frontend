import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <h1>Create Account</h1>
        <p class="subtitle">Start your interview prep journey</p>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Min 6 characters">
          </div>
          <div class="form-group">
            <label>Preferred Language</label>
            <select [(ngModel)]="preferredLanguage" name="preferredLanguage">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div class="error" *ngIf="error">{{ error }}</div>
          <button type="submit" class="btn btn-primary full-width" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>
        <p class="switch-text">
          Already have an account? <a routerLink="/login">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .auth-card { max-width: 420px; width: 100%; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .subtitle { color: var(--text-muted); margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-muted); }
    .full-width { width: 100%; margin-top: 8px; }
    .switch-text { text-align: center; margin-top: 16px; font-size: 14px; color: var(--text-muted); }
  `],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  preferredLanguage = 'en';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService
      .register({ name: this.name, email: this.email, password: this.password, preferredLanguage: this.preferredLanguage })
      .subscribe({
        next: () => {
          this.router.navigate(['/chatbot']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed';
        },
      });
  }
}
