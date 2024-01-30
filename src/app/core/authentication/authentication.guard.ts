import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);

  return authService.isAuthenticated() // check if the user is authenticated
    ? true
    : inject(Router).createUrlTree(['/login']); //
};
