import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  http = inject(HttpClient);

  constructor() {}
  // http = inject(HttpClient);

  private isAuthenticatedFlag = false;
  private authSecretKey = 'Bearer';
  private apiUrl = environment.apiUrl;

  login(username: string, password: string) {
    console.log('ApiUrl: ' + this.apiUrl);

    return this.http.post(`${this.apiUrl}/login`, {
      username: username,
      password: password,
    });
  }

  // Simulate a logout process that clears the authentication state
  logout() {
    localStorage.removeItem(this.authSecretKey);
    this.isAuthenticatedFlag = false;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }
}
