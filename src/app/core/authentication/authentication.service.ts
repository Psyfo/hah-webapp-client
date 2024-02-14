import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { map } from 'jquery';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  http = inject(HttpClient);
  router = inject(Router);

  constructor() {}
  // http = inject(HttpClient);

  private isAuthenticatedFlag = false;
  private authSecretKey = 'Bearer';
  private apiUrl = environment.apiUrl;

  login(email: string, password: string) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          // Check if the response contains an authentication token
          if (response && response.token) {
            // Save the token in local storage
            localStorage.setItem(this.authSecretKey, response.token);
            localStorage.setItem('email', email);

            // Update authentication flag
            this.isAuthenticatedFlag = true;
          }
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem(this.authSecretKey);
    localStorage.removeItem('email');
    this.isAuthenticatedFlag = false;
    this.router.navigate(['/login']);
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }
}
