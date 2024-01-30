import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor() {}

  private isAuthenticatedFlag = false;
  private authSecretKey = 'Bearer';

  // Simulate a login process that sets the authentication state
  login(username: string, password: string) {
    if (username === 'omotola' && password === 'pass123!') {
      const authToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpheWRlZXAgUGF0aWwiLCJpYXQiOjE1MTYyMzkwMjJ9.yt3EOXf60R62Mef2oFpbFh2ihkP5qZ4fM8bjVnF8YhA'; // Generate or receive the token from your server
      localStorage.setItem(this.authSecretKey, authToken);
      this.isAuthenticatedFlag = true;
      return true;
    } else {
      return false;
    }
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
