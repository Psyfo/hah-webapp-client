import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { PatientService } from 'app/features/patient/patient.service';
import { IPatient } from 'app/models/patient.interface';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  messageService = inject(MessageService);
  router = inject(Router);

  patient?: IPatient;
  verificationStatus: string = '';
  emailSent: boolean = false;

  items?: any[];
  activeIndex: number = 0;
  activeTab: string = '1';
  navItems?: MenuItem[];

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.patientService.getPatientByEmail(email).subscribe((patient) => {
        this.patient = patient;
        this.verificationStatus = patient.verified
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
      { label: 'Email Verification' },
      { label: 'ID Verification' },
    ];
  }

  resendVerificationEmail() {
    setTimeout(() => {
      this.emailSent = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Email Sent',
        detail: 'Verification email has been sent to your email address',
      });
    }, 2000);
  }

  logout() {
    this.authService.logout();
    console.log('Logged out');
  }

  goToAppointments() {
    this.router.navigate(['/dashboard/appointments']);
  }
}
