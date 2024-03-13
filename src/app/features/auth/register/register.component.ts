import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { customEmailValidator } from "app/core/validators/email.validator";
import { customPasswordValidator } from "app/core/validators/password.validator";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { TabView, TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";
import { RegisterService } from "./register.service";

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import {
  IPatient,
  IPatientEmailExists,
} from 'app/core/models/patient.interface';

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
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    MessagesModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    TabViewModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [routerTransitionSlideUp],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('tabView') tabView!: TabView;

  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  registerService = inject(RegisterService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);

  registerForm!: FormGroup;
  practitionerRegisterForm!: FormGroup;

  isFormSubmitted = false;
  passwordSymbols = '(policy symbols)';
  emailExists = false;
  messages: any[] = [];
  ref: DynamicDialogRef | undefined;
  tabViewIndex: number = 0;
  // All countries
  // length 252
  countries = [
    { name: 'Zimbabwe', code: 'ZW' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'United Kingdom', code: 'GB' },
  ];

  ngOnInit(): void {
    // Set tab to practitioner if the route parameter is set
    this.route.params.subscribe((params) => {
      if (params['tab'] === 'practitioner') {
        console.log('practitioner tab activated');
        this.tabViewIndex = 1;
      }
    });

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

    this.practitionerRegisterForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, customPasswordValidator()]],
      selectedCountry: ['ZW', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });
    this.practitionerRegisterForm.valueChanges.subscribe((value: any) => {
      //console.log(value);
    });
  }

  //getters for form controls
  get f() {
    return this.registerForm.controls;
  }

  get p() {
    return this.practitionerRegisterForm.controls;
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

          this.emailExists = data.exists;

          if (this.emailExists) {
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
        (error: any) => {
          console.log('error', error);
        }
      );
    }
  }

  onSubmitPractitioner() {
    this.isFormSubmitted = true;

    if (this.practitionerRegisterForm.invalid) {
      return;
    } else {
      this.registerService
        .practitionerEmailExists(this.p['email'].value)
        .subscribe(
          (data: any) => {
            console.log('data', data);

            this.emailExists = data.exists;

            if (this.emailExists) {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Practitioner email exists',
                life: 5000,
                closable: false,
              });

              this.confirmationService.confirm({
                message:
                  'Practitioner email exists. Do you want to login instead?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  this.router.navigate(['/login', { tab: 'practitioner' }]);
                },
                reject: () => {
                  this.resetEmail();
                },
              });

              return;
            } else if (this.p['selectedCountry'].value !== 'ZW') {
              this.countryDialogVisible = true;
              return;
            } else {
              this.registerService
                .registerPractitioner(
                  this.p['email'].value,
                  this.p['password'].value
                )
                .subscribe(
                  (data: any) => {
                    console.log('data', data);

                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail:
                        'Practitioner registered. Please check your email to verify your account.',
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

  goToPractitionerLogin(): void {
    this.router.navigate(['/login', { tab: 'practitioner' }]);
  }

  resetEmail() {
    this.f['email'].reset();
    this.p['email'].reset();
    this.emailExists = false;
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
