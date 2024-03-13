import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { TabView, TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

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
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    TabViewModule,
    ToastModule,
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
  @ViewChild('tabView') tabView!: TabView;

  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthenticationService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);

  loginForm!: FormGroup;
  practitionerLoginForm!: FormGroup;

  isFormSubmitted: boolean = false;
  loginFailMessage: boolean = false;
  tabViewIndex: number = 0;

  get f() {
    return this.loginForm.controls;
  }
  get p() {
    return this.practitionerLoginForm.controls;
  }

  ngOnInit(): void {
    // Set tab to practitioner if the route parameter is set
    this.route.params.subscribe((params) => {
      console.log('params', params);

      if (params['tab'] === 'practitioner') {
        this.tabViewIndex = 1;
      }
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.practitionerLoginForm = this.fb.group({
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
  loginPractitioner() {
    this.isFormSubmitted = true;
    if (this.practitionerLoginForm.invalid) {
      return;
    } else {
      const email = this.p['email'].value;
      const password = this.p['password'].value;

      this.authService.practitionerLogin(email, password).subscribe(
        (data) => {
          this.loginFailMessage = false;
          console.log('Login successful');
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'Login Successful',
          });
          setTimeout(() => {
            this.router.navigate(['/practitioner']);
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

  goToPractitionerSignup() {
    this.router.navigate(['/register', { tab: 'practitioner' }]);
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
}
