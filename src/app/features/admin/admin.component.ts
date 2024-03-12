import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeIcons,
} from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    InputTextModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    PanelMenuModule,
    RippleModule,
    RouterModule,
    SidebarModule,
    ToastModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  animations: [routerTransitionSlideUp],
})
export class AdminComponent implements OnInit {
  messageService = inject(MessageService);
  router = inject(Router);
  authenticationService = inject(AuthenticationService);
  confirmationService = inject(ConfirmationService);

  navItems: MenuItem[] = [];
  panelMenuItems: MenuItem[] = [];

  sidebarVisible: boolean = true;

  ngOnInit() {
    this.navItems = [];

    this.panelMenuItems = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-bar',
            command: () => {
              this.router.navigate(['/admin']);
            },
          },
          {
            label: 'Projects',
            icon: 'pi pi-fw pi-folder',
            command: () => {},
          },
          {
            label: 'Tasks',
            icon: 'pi pi-fw pi-check-square',
            command: () => {},
          },
        ],
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Patients',
            icon: 'pi pi-fw pi-user',
            command: () => {
              this.router.navigate(['/admin/patient-management']);
            },
          },
          {
            label: 'Practitioners',
            icon: 'pi pi-fw pi-user',
          },
          {
            label: 'Admins',
            icon: 'pi pi-fw pi-cog',
            command: () => {
              this.router.navigate(['/admin/admin-management']);
            },
          },
        ],
      },
      {
        label: 'Appointments',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Upcoming',
            icon: 'pi pi-fw pi-calendar-plus',
          },
          {
            label: 'History',
            icon: 'pi pi-fw pi-calendar-minus',
          },
        ],
      },
      {
        label: 'Performance',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          {
            label: 'Analytics',
            icon: 'pi pi-fw pi-chart-line',
          },
          {
            label: 'Reports',
            icon: 'pi pi-fw pi-file',
          },
        ],
      },
      {
        label: 'Application',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-fw pi-cog',
          },
          {
            label: 'Help',
            icon: 'pi pi-fw pi-question-circle',
          },
        ],
      },
    ];
  }

  openNew() {
    console.log('New Project');
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
          this.authenticationService.logout();
          console.log('Logged out');
        }, 2000);
      },
    });
  }

  closeCallback(event: any) {
    this.sidebarVisible = false;
  }
}
