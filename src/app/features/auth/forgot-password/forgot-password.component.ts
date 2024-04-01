import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { PatientService } from 'app/core/services/patient.service';
import { PractitionerService } from 'app/core/services/practitioner.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  animations: [routerTransitionSlideUp],
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  practitionerService = inject(PractitionerService);

  forgotPasswordForm!: FormGroup;
  practitionerFlag: boolean = false;

  isFormSubmitted: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['tab'] === 'practitioner') {
        console.log('Practitioner tab selected');
        this.practitionerFlag = true;
      } else {
        console.log('Patient tab selected');
        this.practitionerFlag = false;
      }
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.isFormSubmitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.f['email'].value;

    if (this.practitionerFlag) {
      this.practitionerService.forgotPassword(email).subscribe(
        (response: any) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Password reset email sent',
            });
          }
          console.log(response);
          this.isFormSubmitted = false;
          this.forgotPasswordForm.reset();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error sending password reset email',
          });
          console.error('Error sending password reset email', error);
        }
      );
    } else {
      this.patientService.forgotPassword(email).subscribe(
        (response: any) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Password reset email sent',
            });
          }
          this.isFormSubmitted = false;
          this.forgotPasswordForm.reset();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error sending password reset email',
          });
          console.error('Error sending password reset email', error);
        }
      );
    }
  }
}
