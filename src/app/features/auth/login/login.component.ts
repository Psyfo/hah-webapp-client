import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HahTextInputComponent, HahButtonComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginForm: FormGroup;

  constructor(private router: Router, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });
  }

  login(): void {
    // You can perform further login logic here
    if (this.loginForm.valid) {
      console.log('form is valid');
      console.log('email:', this.email);
      console.log('password:', this.password);
    } else {
      console.log('form is invalid');
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/register']);
  }
  loginClick() {
    console.log('Login button clicked from the login component');
  }
}
