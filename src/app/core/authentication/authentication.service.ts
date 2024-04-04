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

  login(email: string, password: string, rememberMe: boolean) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          // Check if the response contains an authentication token
          if (response && response.token) {
            // Determine where to store the authentication data based on rememberMe flag
            const storage = rememberMe ? localStorage : sessionStorage;

            // Save the token in storage
            storage.setItem(this.authSecretKey, response.token);
            storage.setItem('email', email);
            storage.setItem('isAuthenticated', 'true');
            storage.setItem('role', 'patient');

            // Update authentication flag
            this.isAuthenticatedFlag = true;
          }
          return response;
        })
      );
  }

  practitionerLogin(email: string, password: string, rememberMe: boolean) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http
      .post<any>(`${this.apiUrl}/auth/practitioner/login`, { email, password })
      .pipe(
        tap((response) => {
          // Check if the response contains an authentication token
          if (response && response.token) {
            // Determine where to store the authentication data based on rememberMe flag
            const storage = rememberMe ? localStorage : sessionStorage;

            // Save the token in local storage
            storage.setItem(this.authSecretKey, response.token);
            storage.setItem('email', email);
            storage.setItem('isAuthenticated', 'true');
            storage.setItem('role', 'practitioner');

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
    // Get role from local storage or session storage
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    localStorage.clear();
    sessionStorage.clear();

    this.isAuthenticatedFlag = false;

    if (role === 'admin') {
      this.router.navigate(['/admin-login']);
    } else if (role === 'patient' || role === 'practitioner') {
      this.router.navigate(['/login']);
    }
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    // Get the value of isAuthenticated from local storage or session storage

    const isAuthenticated =
      localStorage.getItem('isAuthenticated') ||
      sessionStorage.getItem('isAuthenticated');

    if (isAuthenticated === 'true') {
      this.isAuthenticatedFlag = true;
    }
    return this.isAuthenticatedFlag;
  }

  getRole(): string {
    return localStorage.getItem('role') || sessionStorage.getItem('role') || '';
  }

  patientPasswordReset(email: string) {
    return this.http.post(`${this.apiUrl}/auth/password-reset`, { email });
  }

  practitionerPasswordReset(email: string) {
    return this.http.post(`${this.apiUrl}/auth/practitioner/password-reset`, {
      email,
    });
  }
}
