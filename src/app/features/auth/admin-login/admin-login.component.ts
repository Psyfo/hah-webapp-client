import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
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
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  animations: [routerTransitionSlideUp],
})
export class AdminLoginComponent {
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthenticationService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);

  loginForm!: FormGroup;

  isFormSubmitted: boolean = false;
  loginFailMessage: boolean = false;

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.isFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      const email = this.f['email'].value;
      const password = this.f['password'].value;

      this.authService.adminLogin(email, password).subscribe(
        (data) => {
          this.loginFailMessage = false;
          console.log('Login successful');
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'Login Successful',
          });
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1500);
        },
        (error: any) => {
          this.loginFailMessage = true;
          console.error(error.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail:
              'Email or password is incorrect. Please check and try again.',
          });
        }
      );
    }
  }

  goToSignUp(): void {
    this.router.navigate(['/register']);
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
}
