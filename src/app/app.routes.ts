import { Routes } from '@angular/router';
import { authenticationGuard } from './core/authentication/authentication.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authenticationGuard],
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
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'verify/:token',
    loadComponent: () =>
      import('./features/auth/verification/verification.component').then(
        (m) => m.VerificationComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
