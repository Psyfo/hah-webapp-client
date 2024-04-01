import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'app/core/services/patient.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  animations: [routerTransitionSlideUp],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  patientService = inject(PatientService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  resetPasswordToken!: string;

  isFormSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  resetPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    // Get the reset password token from the URL
    this.route.params.subscribe((params) => {
      this.resetPasswordToken = params['resetPasswordToken'];
      console.log('Reset password token:', this.resetPasswordToken);
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  resetPassword() {
    this.isFormSubmitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const newPassword = this.f['newPassword'].value;

    this.patientService
      .resetPassword(this.resetPasswordToken, newPassword)
      .subscribe(
        (response) => {
          console.log('Password reset successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Password reset successfully',
            detail: 'Please login with your new password',
          });

          this.resetPasswordForm.reset();
          this.isFormSubmitted = false;

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1000);
        },
        (error) => {
          console.error('Error resetting password', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error resetting password',
            detail: 'Please try again',
          });
        }
      );
  }
}
