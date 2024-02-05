import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { customPasswordValidator } from 'app/core/validators/password.validator';
import { IPatient, IPatientEmailExists } from 'app/models/patient.interface';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { RegisterService } from './register.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
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
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HahButtonComponent,
    HahTextInputComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessagesModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  registerService = inject(RegisterService);
  messageService = inject(MessageService);

  registerForm!: FormGroup;

  isFormSubmitted = false;
  patientEmailExists = false;
  messages: any[] = [];

  //getters for form controls
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, customPasswordValidator()]],
      terms: [false, [Validators.requiredTrue]],
    });
    this.registerForm.valueChanges.subscribe((value: any) => {
      //console.log(value);
    });
  }

  onSubmit() {
    this.isFormSubmitted = true;

    // check if email exists
    if (this.registerForm.invalid) {
      return;
    } else {
      this.registerService.patientEmailExists(this.f['email'].value).subscribe(
        (data: any) => {
          console.log('data', data);

          this.patientEmailExists = data.exists;

          if (this.patientEmailExists) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Patient email exists',
              life: 5000,
              closable: false,
            });
            return;
          } else {
            this.registerService
              .register(this.f['email'].value, this.f['password'].value)
              .subscribe(
                (data: any) => {
                  console.log('data', data);

                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail:
                      'Patient registered. Please check your email to verify your account.',
                    life: 5000,
                    closable: false,
                  });

                  this.router.navigate(['/login']);
                },
                (error) => {
                  console.log('error', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      error.message || 'An error occurred. Please try again.',
                    life: 5000,
                    closable: false,
                  });
                }
              );
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    console.log('register form', this.registerForm);
  }
}
