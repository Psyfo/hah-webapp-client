import { Routes } from '@angular/router';
import { Step1Component } from './features/auth/register/step-1/step-1.component';
import { Step2Component } from './features/auth/register/step-2/step-2.component';
import { Step3Component } from './features/auth/register/step-3/step-3.component';

export const routes: Routes = [
  {
    path: '',
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
    children: [
      { path: 'step1', component: Step1Component },
      { path: 'step2', component: Step2Component },
      { path: 'step3', component: Step3Component },
    ],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
