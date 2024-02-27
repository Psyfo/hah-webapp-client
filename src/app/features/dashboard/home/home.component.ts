import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { VerificationService } from 'app/features/auth/verification/verification.service';
import { PatientService } from 'app/features/patient/patient.service';
import { IPatient } from 'app/models/patient.interface';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    routerTransitionSlideUp,
    routerTransitionSlideLeft,
    routerTransitionSlideRight,
  ],
})
export class HomeComponent implements OnInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  messageService = inject(MessageService);
  router = inject(Router);
  verificationService = inject(VerificationService);
  confirmationService = inject(ConfirmationService);
  fb: FormBuilder = inject(FormBuilder);

  patient?: IPatient;
  verificationStatus: string = '';
  emailSent: boolean = false;

  items?: any[];
  activeIndex: number = 0;
  activeTab: string = '1';
  navItems?: MenuItem[];
  loading: boolean = false;

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe((patient) => {
        this.patient = patient;
        this.verificationStatus = patient.account.verified
          ? 'Verified'
          : 'Not Verified';
      });
    }

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

    this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      dob: [new Date(), [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  next() {
    if (this.activeIndex < this.items!.length - 1) {
      this.activeIndex++;
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
}
