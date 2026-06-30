import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

interface Language {
  code: string;
  name: string;
  native: string;
}

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
            <div class="lang-selector">
              <button class="lang-btn" (click)="langOpen = !langOpen">
                {{ selectedLang.native }}
                <span class="arrow">&#9660;</span>
              </button>
              <ul class="lang-dropdown" *ngIf="langOpen" (mouseleave)="langOpen = false">
                <li *ngFor="let lang of languages" [class.active]="lang.code === selectedLang.code" (click)="switchLanguage(lang)">
                  <span class="lang-native">{{ lang.native }}</span>
                  <span class="lang-name notranslate">{{ lang.name }}</span>
                </li>
              </ul>
            </div>
            <div id="google_translate_element" class="gt-hidden"></div>
            <span class="user-name">{{ authService.currentUser?.name }}</span>
            <button class="btn btn-secondary" (click)="authService.logout()">Logout</button>
          </div>
        </ng-container>
        <ng-template #authLinks>
          <div class="nav-right">
            <div class="lang-selector">
              <button class="lang-btn" (click)="langOpen = !langOpen">
                {{ selectedLang.native }}
                <span class="arrow">&#9660;</span>
              </button>
              <ul class="lang-dropdown" *ngIf="langOpen" (mouseleave)="langOpen = false">
                <li *ngFor="let lang of languages" [class.active]="lang.code === selectedLang.code" (click)="switchLanguage(lang)">
                  <span class="lang-native">{{ lang.native }}</span>
                  <span class="lang-name notranslate">{{ lang.name }}</span>
                </li>
              </ul>
            </div>
            <div id="google_translate_element" class="gt-hidden"></div>
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
    .lang-selector { position: relative; }
    .lang-btn { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-input); color: var(--text); font-size: 13px; cursor: pointer; white-space: nowrap; }
    .lang-btn .arrow { font-size: 10px; }
    .lang-dropdown { position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; list-style: none; padding: 4px; min-width: 180px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 200; }
    .lang-dropdown li { display: flex; flex-direction: column; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.15s; }
    .lang-dropdown li:hover { background: var(--bg-input); }
    .lang-dropdown li.active { background: var(--primary-light); color: #fff; }
    .lang-native { font-size: 14px; font-weight: 500; }
    .lang-name { font-size: 11px; opacity: 0.7; }
    .gt-hidden { display: none; }
  `],
})
export class NavbarComponent {
  langOpen = false;
  languages: Language[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
  ];
  selectedLang: Language;
  authService = inject(AuthService);
  private translationSvc = inject(TranslationService);

  constructor() {
    const saved = localStorage.getItem('preferredLanguage');
    this.selectedLang = this.languages.find(l => l.code === saved) || this.languages[0];
  }

  switchLanguage(lang: Language): void {
    this.selectedLang = lang;
    this.langOpen = false;
    this.translationSvc.setLanguage(lang.code);
    if (lang.code === 'en') {
      document.cookie = 'googtrans=; path=/; max-age=0';
      document.cookie = 'googtrans=/en/en; path=/; max-age=0';
    } else {
      document.cookie = 'googtrans=/en/' + lang.code + '; path=/; max-age=86400';
    }
    location.reload();
  }
}
