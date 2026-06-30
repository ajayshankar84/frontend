import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'chatbot',
    loadComponent: () =>
      import('./features/chatbot/chatbot.component').then((m) => m.ChatbotComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'practice/interview',
    loadComponent: () =>
      import('./features/practice/live-interview/live-interview.component').then(
        (m) => m.LiveInterviewComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'practice/subjective',
    loadComponent: () =>
      import('./features/practice/subjective-exam/subjective-exam.component').then(
        (m) => m.SubjectiveExamComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'practice/objective',
    loadComponent: () =>
      import('./features/practice/objective-exam/objective-exam.component').then(
        (m) => m.ObjectiveExamComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/questions',
    loadComponent: () =>
      import('./features/admin/questions/questions.component').then((m) => m.QuestionsComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/users/users.component').then((m) => m.UsersComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '**', redirectTo: '/login' },
];
