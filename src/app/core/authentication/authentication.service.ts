import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { map } from "jquery";
import { tap } from "rxjs";

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
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', 'patient');

            // Update authentication flag
            this.isAuthenticatedFlag = true;
          }
          return response;
        })
      );
  }

  practitionerLogin(email: string, password: string) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http
      .post<any>(`${this.apiUrl}/auth/practitioner/login`, { email, password })
      .pipe(
        tap((response) => {
          // Check if the response contains an authentication token
          if (response && response.token) {
            // Save the token in local storage
            localStorage.setItem(this.authSecretKey, response.token);
            localStorage.setItem('email', email);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', 'practitioner');

            // Update authentication flag
            this.isAuthenticatedFlag = true;
          }
          return response;
        })
      );
  }

  adminLogin(email: string, password: string) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http
      .post<any>(`${this.apiUrl}/auth/admin/login`, { email, password })
      .pipe(
        tap((response) => {
          // Check if the response contains an authentication token
          if (response && response.token) {
            // Save the token in local storage
            localStorage.setItem(this.authSecretKey, response.token);
            localStorage.setItem('email', email);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', 'admin');

            // Update authentication flag
            this.isAuthenticatedFlag = true;
          }
          return response;
        })
      );
  }

  logout() {
    const role = localStorage.getItem('role');

    localStorage.clear();
    this.isAuthenticatedFlag = false;

    if (role === 'admin') {
      this.router.navigate(['/admin-login']);
    } else if (role === 'patient' || role === 'practitioner') {
      this.router.navigate(['/login']);
    }
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      this.isAuthenticatedFlag = true;
    }
    return this.isAuthenticatedFlag;
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }
}
