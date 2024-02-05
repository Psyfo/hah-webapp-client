import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'get-started',
    loadComponent: () =>
      import('./features/auth/register/get-started/get-started.component').then(
        (m) => m.GetStartedComponent
      ),
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
