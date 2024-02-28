import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { customEmailValidator } from "app/core/validators/email.validator";
import { customPasswordValidator } from "app/core/validators/password.validator";
import { data } from "jquery";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  routerTransitionFade,
  routerTransitionSlideLeft,
  routerTransitionSlideUp,
} from 'app/core/utilities/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
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
  animations: [
    routerTransitionFade,
    routerTransitionSlideLeft,
    routerTransitionSlideUp,
  ],
})
export class LoginComponent implements OnInit {
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
      email: [
        '',
        [Validators.required],
      ],
      password: ['', [Validators.required]],
    });
  }

  login() {
	this.isFormSubmitted = true;
    if (this.loginForm.invalid){
		return;
	} else {
      const email = this.f['email'].value;
      const password = this.f['password'].value;

      this.authService.login(email, password).subscribe(
        (data) => {
			this.loginFailMessage = false;
          console.log('Login successful');
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'Login Successful',
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        (error) => {
			this.loginFailMessage = true;
          console.error('Login failed');
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
