import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { IPatient } from 'app/core/models/patient.interface';
import { PatientService } from 'app/core/services/patient.service';
import { UploadService } from 'app/core/services/upload.service';
import { VerificationService } from 'app/core/services/verification.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { merge } from 'ts-deepmerge';

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

import {
  routerTransitionSlideLeft,
  routerTransitionSlideRight,
  routerTransitionSlideUp,
} from 'app/core/utilities/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MessagesModule,
    ToastModule,
    MenubarModule,
    StepsModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    FileUploadModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    routerTransitionSlideUp,
    routerTransitionSlideLeft,
    routerTransitionSlideRight,
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  messageService = inject(MessageService);
  router = inject(Router);
  verificationService = inject(VerificationService);
  confirmationService = inject(ConfirmationService);
  fb: FormBuilder = inject(FormBuilder);
  uploadService = inject(UploadService);
  cdr = inject(ChangeDetectorRef);

  patient!: IPatient;
  verificationStatus: string = '';
  emailSent: boolean = false;
  patientIdForm!: FormGroup;
  maxDate: Date = new Date(2006, 2, 1);
  updatingPatient: boolean = false;
  patientUpdated: boolean = false;
  selectedFile: File | null = null;

  items?: any[];
  activeIndex: number = 0;
  activeTab: string = '1';
  navItems?: MenuItem[];
  loading: boolean = false;
  isFormSubmitted: boolean = false;

  ngOnInit(): void {
    this.navItems = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/profile'], // Update with your route
      },
      {
        label: 'Appointments',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/appointment'], // Update with your route
      },
    ];

    this.items = [
      {
        label: 'Email Verification',
        command: (event: any) => {
          this.activeIndex = 0;
          this.activeTab = '1';
        },
      },
      {
        label: 'ID Verification',
        command: (event: any) => {
          this.activeIndex = 1;
          this.activeTab = '2';
        },
      },
    ];

    this.patientIdForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      dob: [new Date(1987, 8, 13), [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });

    const email = localStorage.getItem('email');
    if (email) {
      this.patientService
        .getPatientByEmail(email)
        .subscribe((patient: IPatient) => {
          this.patient = patient;

          this.patientIdForm.patchValue({
            firstName: this.patient?.firstName,
            lastName: this.patient?.lastName,
            idNumber: this.patient?.idNumber,
            dob: this.patient.dob as Date,
            phoneNumber: this.patient?.phoneNumber,
          });

          this.f['dob'].setValue(this.patient.dob as Date);

          this.verificationStatus = patient?.account?.verified
            ? 'Verified'
            : 'Not Verified';
          if (this.patient?.account?.activationStep === 0) {
            this.activeIndex = 0;
            this.activeTab = '1';
          } else if (this.patient?.account?.activationStep === 1 || 2) {
            this.activeIndex = 1;
            this.activeTab = '2';
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  next() {
    if (this.activeIndex < this.items!.length - 1) {
      this.activeIndex++;
      this.patient!.account!.activationStep = this.activeIndex;
      this.patientService.updatePatient(this.patient!).subscribe((response) => {
        console.log('Response: ', response);
        console.log('Patient activationStep updated.');
      });
    }
  }

  resendEmailDialogVisible: boolean = false;
  openResendEmailDialog() {
    this.resendEmailDialogVisible = true;
  }
  closeResendEmailDialog() {
    this.resendEmailDialogVisible = false;
  }
  resendVerificationEmail() {
    this.resendEmailDialogVisible = false;
    this.loading = true;
    setTimeout(() => {
      this.verificationService
        .resendVerificationEmail(this.patient?.email || '')
        .subscribe(
          (response: any) => {
            console.log('Response: ', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Verification email sent.',
            });
            this.loading = false;
          },
          (error: any) => {
            console.log('Error: ', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to send verification email.',
            });
            this.loading = false;
          }
        );
    }, 2000);
  }

  goToAppointments() {
    this.router.navigate(['/dashboard/appointments']);
  }

  openEmailApp() {
    window.open('mailto:?view=inbox');
  }

  updatePatient() {
    this.isFormSubmitted = true;
    this.updatingPatient = true;

    const updatedPatient: IPatient = merge(this.patient, {
      account: { activationStep: 2 },
      firstName: this.patientIdForm.value.firstName,
      lastName: this.patientIdForm.value.lastName,
      idNumber: this.patientIdForm.value.idNumber,
      dob: this.patientIdForm.value.dob as Date,
      phoneNumber: this.patientIdForm.value.phoneNumber,
    } as IPatient);

    console.log('Updated Patient before API: ', updatedPatient);

    if (this.patientIdForm.invalid) {
      this.updatingPatient = false;
      return;
    }

    this.patientService.updatePatient(updatedPatient).subscribe(
      (patient: IPatient) => {
        console.log('Updated Patient from API: ', patient);
        this.patient = patient;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient updated successfully.',
        });

        this.updatingPatient = false;
        this.patientUpdated = true;
      },
      (error: any) => {
        console.log('Error: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update patient.',
        });

        this.updatingPatient = false;
      }
    );
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const email = this.patient!.email as string;

    if (!file || !email) {
      return;
    }
    this.uploadService.uploadPatientId(file, email).subscribe(
      (response: any) => {
        console.log('Upload successful!', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient ID uploaded successfully.',
        });

        const updatedPatient: IPatient = Object.assign({}, this.patient, {
          account: { activationStep: 3 },
        });
        this.patientService.updatePatient(updatedPatient!).subscribe(
          (patient: IPatient) => {
            this.patient = patient;
            console.log('Patient activationStep updated.');
          },
          (error: any) => {
            console.error('Error: ', error);
          }
        );
      },
      (error: any) => {
        console.error('Upload failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload patient ID.',
        });
      }
    );
  }

  get f() {
    return this.patientIdForm.controls;
  }
}
