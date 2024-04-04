import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientService } from "app/core/services/patient.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { customPasswordValidator } from "app/core/validators/password.validator";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";

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

  passwordResetToken!: string;
  passwordSymbols = '(!"#\$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)'; 

  isFormSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  passwordResetForm!: FormGroup;

  ngOnInit(): void {
    this.passwordResetForm = this.fb.group({
      newPassword: ['', [Validators.required, customPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    });

    // Get the reset password token from the URL
    this.route.params.subscribe((params) => {
      this.passwordResetToken = params['passwordResetToken'];
      console.log('Reset password token:', this.passwordResetToken);
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

    this.patientService
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
            this.router.navigate(['/login']);
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
