import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { PatientService } from 'app/features/patient/patient.service';
import { IPatient } from 'app/models/patient.interface';
import { MenuItem } from 'primeng/api';
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
    NgbModule,
    StepsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);

  patient?: IPatient;
  verificationStatus: string = '';
  emailSent: boolean = false;

  items?: any[];
  activeIndex: number = 0;

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

    this.items = [
      { label: 'Verification' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ];
  }

  resendVerificationEmail() {
    this.emailSent = true;
  }

  logout() {
    this.authService.logout();
    console.log('Logged out');
  }
}
