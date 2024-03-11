import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (
    authService.isAuthenticated() &&
    authService.getRole().includes('admin')
  ) {
    // If user is authenticated and has 'admin' role
    if (state.url.startsWith('/admin')) {
      // Allow access to /admin routes
      return true;
    } else {
      // Redirect to /admin if trying to access other routes
      return router.createUrlTree(['/admin']);
    }
  } else if (authService.isAuthenticated()) {
    // If user is authenticated but doesn't have 'admin' role
    if (state.url.startsWith('/admin')) {
      // Redirect to /dashboard if trying to access /admin routes without 'admin' role
      return router.createUrlTree(['/dashboard']);
    } else {
      // Allow access to non-/admin routes
      return true;
    }
  } else {
    // Redirect to /login if not authenticated
    return router.createUrlTree(['/login']);
  }
};
