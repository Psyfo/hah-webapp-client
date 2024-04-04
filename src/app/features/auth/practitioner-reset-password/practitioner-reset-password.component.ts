import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientService } from "app/core/services/patient.service";
import { PractitionerService } from "app/core/services/practitioner.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-practitioner-reset-password',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './practitioner-reset-password.component.html',
  styleUrl: './practitioner-reset-password.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerResetPasswordComponent
  implements OnInit, AfterViewInit
{
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  practitionerService = inject(PractitionerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  passwordResetToken!: string;

  isFormSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  passwordResetForm!: FormGroup;

  ngOnInit(): void {
    this.passwordResetForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    // Get the reset password token from the URL
    this.route.params.subscribe((params) => {
      this.passwordResetToken = params['passwordResetToken'];
      console.log('Reset Password Token: ', this.passwordResetToken);
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  get f() {
    return this.passwordResetForm.controls;
  }

  resetPassword() {
    this.isFormSubmitted = true;

    if (this.passwordResetForm.invalid) {
      return;
    }

    const newPassword = this.f['newPassword'].value;
    console.log('New password:', newPassword);
    console.log('Password reset token:', this.passwordResetToken);

    this.practitionerService
      .resetPassword(this.passwordResetToken, newPassword)
      .subscribe(
        (response: any) => {
          console.log('Password reset successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Password reset successfully',
            detail: 'Please login with your new password',
          });

          this.passwordResetForm.reset();
          this.isFormSubmitted = false;

          setTimeout(() => {
            this.router.navigate(['/login', { tab: 'practitioner' }]);
          }, 1000);
        },
        (error: any) => {
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
