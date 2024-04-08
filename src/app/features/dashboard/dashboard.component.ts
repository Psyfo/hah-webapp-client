import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { IPatient } from 'app/core/models/patient.interface';
import { PatientService } from 'app/core/services/patient.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    MenubarModule,
    MessagesModule,
    StepsModule,
    ToastModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [routerTransitionSlideUp],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  authService = inject(AuthenticationService);
  patientService = inject(PatientService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  cdr = inject(ChangeDetectorRef);

  patient?: IPatient;
  verificationStatus: string = '';
  emailSent: boolean = false;

  items?: any[];
  activeIndex: number = 0;
  activeTab: string = '1';
  navItems?: MenuItem[];

  ngOnInit(): void {
    // Check local storage or session storage for email
    const email =
      localStorage.getItem('email') || sessionStorage.getItem('email');

    if (email) {
      this.patientService
        .getPatientByEmail(email)
        .subscribe((patient: IPatient) => {
          this.patient = patient;
          this.verificationStatus = patient.account?.verified
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
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.cdr.detectChanges();
  }

  logout() {
    this.confirmationService.confirm({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Confirmed',
          detail: 'Logging out',
        });
        setTimeout(() => {
          this.authService.logout();
          console.log('Logged out');
        }, 2000);
      },
    });
  }

  goToAppointments() {}
}
