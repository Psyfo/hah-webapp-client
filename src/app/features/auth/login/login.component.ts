import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { customEmailValidator } from 'app/core/validators/email.validator';
import { customPasswordValidator } from 'app/core/validators/password.validator';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HahTextInputComponent,
    HahButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MessagesModule,
    ToastModule,
    CardModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthenticationService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);

  loginForm!: FormGroup;

  isFormSubmitted = false;
  passwordSymbols = '(!"#\$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)';

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, customPasswordValidator()]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.f['email'].value;
      const password = this.f['password'].value;

      this.authService.login(email, password).subscribe(
        (data) => {
          console.log('Login successful');
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'Login Successful',
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000);
        },
        (error) => {
          console.error('Login failed');
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Incorrect email or password. Please try again or go to sign up.',
          });
        }
      );
    } else {
      // Form is invalid, handle the case as per your requirements
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Form is invalid',
      });
      console.log('Incorrect email or password. Please try again or go to sign up.', this.loginForm.errors);
    }
  }

  goToSignUp(): void {
    this.router.navigate(['/register']);
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
}
