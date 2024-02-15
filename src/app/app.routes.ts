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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./dashboard/appointments/appointments.component').then(
            (m) => m.AppointmentsComponent
          ),
      },
    ],
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
    path: 'faq',
    loadComponent: () =>
      import('./features/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
