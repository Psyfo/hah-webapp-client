import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbNav, NgbNavItem } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MessagesModule,
    ToastModule,
    MenubarModule,
    StepsModule,
    ButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  messageService = inject(MessageService);

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
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard'], // Update with your route
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/dashboard/profile'], // Update with your route
      },
      {
        label: 'Appointments',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/dashboard/appointments'], // Update with your route
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

  goToAppointments() {}
}
