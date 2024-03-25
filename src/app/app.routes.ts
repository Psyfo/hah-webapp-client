import { Routes } from "@angular/router";
import { authenticationGuard } from "./core/authentication/authentication.guard";

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/dashboard/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import(
            './features/dashboard/appointments/appointments.component'
          ).then((m) => m.AppointmentsComponent),
      },
    ],
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./features/auth/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
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
    path: 'verify-practitioner/:token',
    loadComponent: () =>
      import(
        './features/auth/practitioner-verification/practitioner-verification.component'
      ).then((m) => m.PractitionerVerificationComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./features/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'practitioner',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./features/practitioner/practitioner.component').then(
        (m) => m.PractitionerComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/practitioner/practitioner-home/practitioner-home.component'
          ).then((m) => m.PractitionerHomeComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/practitioner/practitioner-profile/practitioner-profile.component'
          ).then((m) => m.PractitionerProfileComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import(
            './features/practitioner/practitioner-appointments/practitioner-appointments.component'
          ).then((m) => m.PractitionerAppointmentsComponent),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authenticationGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-home/admin-home.component').then(
            (m) => m.AdminHomeComponent
          ),
      },
      {
        path: 'patient-management',
        loadComponent: () =>
          import(
            './features/admin/patient-management/patient-management.component'
          ).then((m) => m.PatientManagementComponent),
      },
      {
        path: 'admin-management',
        loadComponent: () =>
          import(
            './features/admin/admin-management/admin-management.component'
          ).then((m) => m.AdminManagementComponent),
      },
      {
        path: 'practitioner-management',
        loadComponent: () =>
          import(
            './features/admin/practitioner-management/practitioner-management.component'
          ).then((m) => m.PractitionerManagementComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
