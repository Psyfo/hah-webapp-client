import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { customEmailValidator } from 'app/core/validators/email.validator';
import { customPasswordValidator } from 'app/core/validators/password.validator';
import { IPatient, IPatientEmailExists } from 'app/models/patient.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { RegisterService } from './register.service';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

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
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessagesModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    CheckboxModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [routerTransitionSlideUp],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  registerService = inject(RegisterService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);

  registerForm!: FormGroup;

  isFormSubmitted = false;
  passwordSymbols = '(!"#\$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)';
  patientEmailExists = false;
  messages: any[] = [];
  ref: DynamicDialogRef | undefined;
  // All countries
  // length 252
  countries = [
    { name: 'Zimbabwe', code: 'ZW' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'United Kingdom', code: 'GB' },
  ];

  //getters for form controls
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, customPasswordValidator()]],
      selectedCountry: ['ZW', [Validators.required]],
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

            this.confirmationService.confirm({
              message: 'Patient email exists. Do you want to login instead?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.router.navigate(['/login']);
              },
              reject: () => {
                this.resetEmail();
              },
            });

            return;
          } else if (this.f['selectedCountry'].value !== 'ZW') {
            this.countryDialogVisible = true;
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

                  setTimeout(() => {
                    this.router.navigate(['/get-started']);
                  }, 2000);
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

  resetEmail() {
    this.f['email'].reset();
    this.patientEmailExists = false;
  }

  // Handle Country Dialog
  countryDialogVisible: boolean = false;
  countryDialogMessage =
    'Hi there! Currently Health at Home is not available in your country yet. We will notify you when we are available.';
  showCountryDialog() {
    this.countryDialogVisible = true;
  }
  hideCountryDialog() {
    this.countryDialogVisible = false;
  }

  // Handle change detection
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
