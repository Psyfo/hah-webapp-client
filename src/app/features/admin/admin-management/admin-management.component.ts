import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IAdmin } from "app/core/models/admin.interface";
import { AdminService } from "app/core/services/admin.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { PanelMenuModule } from "primeng/panelmenu";
import { RippleModule } from "primeng/ripple";
import { Table, TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    PanelMenuModule,
    ReactiveFormsModule,
    RippleModule,
    RouterModule,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css',
  animations: [routerTransitionSlideUp],
})
export class AdminManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') dt!: Table;

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  adminService = inject(AdminService);
  ref = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  adminForm!: FormGroup;

  admins: IAdmin[] = [];
  selectedAdmins: IAdmin[] = [];
  selectedAdmin: IAdmin = {};

  adminDialogVisible = false;
  updatingAdmin: boolean = false;
  isFormSubmitted: boolean = false;
  isUpdate: boolean = false;

  ngOnInit(): void {
    this.getAdmins();

    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  getAdmins() {
    this.adminService.getAdmins().subscribe(
      (admins) => {
        this.admins = admins;
        console.log(`Admins: ${this.admins}`);
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Admins loaded.',
        });
      },
      (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load admins',
        });
      }
    );
  }

  get f() {
    return this.adminForm.controls;
  }

  onInput($event: any) {
    this.dt.filterGlobal($event.target.value, 'contains');
  }

  openNewAdminDialog() {
    this.isUpdate = false;
    this.adminDialogVisible = true;
  }

  openUpdateAdminDialog(admin: IAdmin) {
    this.isUpdate = true;
    this.adminDialogVisible = true;

    this.adminForm.patchValue({
      email: admin.email,
      password: admin.password,
    });

    this.selectedAdmin = admin;
  }

  closeAdminDialog() {
    this.isFormSubmitted = false;
    this.adminDialogVisible = false;
    this.adminForm.reset();
  }

  updateAdmin() {
    this.updatingAdmin = true;
    this.isFormSubmitted = true;

    if (this.adminForm.invalid) {
      return;
    }

    if (this.isUpdate) {
      const updatedAdmin = Object.assign({}, this.selectedAdmin, {
        email: this.f['email'].value,
        password: this.f['password'].value,
      });

      this.adminService.updateAdmin(updatedAdmin).subscribe(
        (response) => {
          this.adminDialogVisible = false;
          this.adminForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin updated successfully.',
          });
          this.updatingAdmin = false;
          this.isFormSubmitted = false;
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating the admin.',
          });
          this.updatingAdmin = false;
          this.isFormSubmitted = false;
        }
      );
    } else {
      this.adminService.createAdmin(this.adminForm.value).subscribe(
        (response) => {
          this.adminDialogVisible = false;
          this.adminForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin created successfully.',
          });
          this.updatingAdmin = false;
          this.isFormSubmitted = false;

          this.getAdmins();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the admin.',
          });
          this.updatingAdmin = false;
          this.isFormSubmitted = false;
          this.adminForm.reset();
        }
      );
    }
    this.adminDialogVisible = false;
  }

  deleteAdmin(admin: IAdmin) {
    if (admin) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete (${admin.email})?`,
        accept: () => {
          this.adminService.deleteAdmin(admin).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Admin deleted successfully.',
              });

              this.getAdmins();
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while deleting the admin.',
              });
            }
          );
        },
        reject: () => {},
      });
    }
  }
}
