import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";

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
  } else if (
    authService.isAuthenticated() &&
    authService.getRole().includes('practitioner')
  ) {
    // If user is authenticated and has 'practitioner' role
    if (state.url.startsWith('/practitioner')) {
      // Allow access to /practitioner routes
      return true;
    } else {
      // Redirect to /practitioner if trying to access other routes
      return router.createUrlTree(['/practitioner']);
    }
  } else if (authService.isAuthenticated()) {
    // If user is authenticated but doesn't have 'admin' or 'practitioner' role
    if (
      state.url.startsWith('/admin') ||
      state.url.startsWith('/practitioner')
    ) {
      // Redirect to /dashboard if trying to access special routes without proper role
      return router.createUrlTree(['/dashboard']);
    } else {
      // Allow access to non-/admin routes
      return true;
    }
  } else if (state.url.startsWith('/admin-login')) {
    // Allow access to /admin-login if not authenticated
    return router.createUrlTree(['/admin-login']);
  } else {
    // Redirect to /login if not authenticated
    return router.createUrlTree(['/login']);
  }
};
