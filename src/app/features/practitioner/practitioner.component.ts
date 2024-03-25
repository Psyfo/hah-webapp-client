import { CommonModule } from "@angular/common";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { IPractitioner } from "app/core/models/practitioner.interface";
import { PractitionerService } from "app/core/services/practitioner.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-practitioner',
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
  templateUrl: './practitioner.component.html',
  styleUrl: './practitioner.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerComponent implements OnInit, AfterViewInit {
  authService = inject(AuthenticationService);
  practitionerService = inject(PractitionerService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  ref = inject(ChangeDetectorRef);

  practitioner?: IPractitioner;
  verificationStatus: string = '';
  emailSent: boolean = false;

  items?: any[];
  activeIndex: number = 0;
  activeTab: string = '1';
  navItems?: MenuItem[];

  ngOnInit(): void {
    this.navItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/practitioner'], // Update with your route
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/practitioner/profile'], // Update with your route
      },
      {
        label: 'Appointments',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/practitioner/appointments'], // Update with your route
      },
    ];
  }

  ngAfterViewInit(): void {
    this.ref.detectChanges();
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
