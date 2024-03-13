import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IPractitioner } from "app/core/models/practitioner.interface";
import { PractitionerService } from "app/core/services/practitioner.service";
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
  selector: 'app-practitioner-management',
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
  templateUrl: './practitioner-management.component.html',
  styleUrl: './practitioner-management.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerManagementComponent {
  @ViewChild('dt') dt!: Table;

  messageService = inject(MessageService);
  practitionerService = inject(PractitionerService);
  confirmationService = inject(ConfirmationService);
  fb = inject(FormBuilder);
  ref = inject(ChangeDetectorRef);

  practitioners: IPractitioner[] = [];
  selectedPractitioner: IPractitioner = {};
  selectedPractitioners: IPractitioner[] = [];
  approvalStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  practitionerForm!: FormGroup;
  isFormSubmitted: boolean = false;
  updatingPractitioner: boolean = false;
  practitionerDialogVisible = false;
  isUpdate: boolean = false;

  ngOnInit(): void {
    this.getPractitioners();

    this.practitionerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      verified: [false],
      approvalStatus: ['pending'],
    });
  }
  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  get f() {
    return this.practitionerForm.controls;
  }

  getPractitioners() {
    this.practitionerService.getPractitioners().subscribe(
      (practitioners: IPractitioner[]) => {
        this.practitioners = practitioners;
        console.log(this.practitioners);
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Practitioners loaded.',
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while retrieving practitioners.',
        });
      }
    );
  }

  onInput($event: any) {
    this.dt.filterGlobal($event.target.value, 'contains');
  }

  openNewPractitionerDialog() {
    this.isUpdate = false;
    this.practitionerDialogVisible = true;
  }

  openUpdatePractitionerDialog(practitioner: IPractitioner) {
    this.isUpdate = true;
    this.practitionerDialogVisible = true;

    this.practitionerForm.patchValue({
      email: practitioner.email,
      firstName: practitioner.firstName,
      lastName: practitioner.lastName,
      verified: practitioner.account?.verified,
      approvalStatus: practitioner.account?.approvalStatus,
    });

    this.selectedPractitioner = practitioner;
  }
  closeUpdatePractitionerDialog() {
    this.isFormSubmitted = false;
    this.practitionerDialogVisible = false;
  }

  updatePractitioner() {
    this.isFormSubmitted = true;
    this.updatingPractitioner = true;

    if (this.practitionerForm.invalid) {
      this.updatingPractitioner = false;
      return;
    }

    if (this.isUpdate) {
      const updatedPractitioner: IPractitioner = Object.assign(
        {},
        this.selectedPractitioner,
        {
          email: this.practitionerForm.value.email,
          firstName: this.practitionerForm.value.firstName,
          lastName: this.practitionerForm.value.lastName,
          account: {
            verified: this.practitionerForm.value.verified,
            approvalStatus: this.practitionerForm.value.approvalStatus,
          },
        }
      );
      console.log('Updated Practitioner:', updatedPractitioner);

      this.practitionerService
        .updatePractitioner(updatedPractitioner)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Practitioner updated successfully.',
            });
            this.updatingPractitioner = false;
            this.isFormSubmitted = false;

            this.getPractitioners();
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while updating the practitioner.',
            });
            this.updatingPractitioner = false;
            this.isFormSubmitted = false;
          }
        );
    } else {
      this.practitionerService
        .createPractitioner(this.practitionerForm.value)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Practitioner created successfully.',
            });
            this.updatingPractitioner = false;
            this.isFormSubmitted = false;

            this.getPractitioners();
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while creating the practitioner.',
            });
            this.updatingPractitioner = false;
            this.isFormSubmitted = false;
          }
        );
    }
    this.practitionerDialogVisible = false;
  }

  deletePractitioner(practitioner: IPractitioner) {
    if (practitioner) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${practitioner.firstName} ${practitioner.lastName} (${practitioner.email})?`,
        accept: () => {
          this.practitionerService.deletePractitioner(practitioner).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Practitioner deleted successfully.',
              });

              this.getPractitioners();
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while deleting the practitioner.',
              });
            }
          );
        },
        reject: () => {},
      });
    }
  }

  getSeverityApproval(approvalStatus: string) {
    if (approvalStatus === 'pending') {
      return 'warning';
    } else if (approvalStatus === 'approved') {
      return 'success';
    } else {
      return 'danger';
    }
  }

  getSeverityVerified(verified: boolean) {
    if (verified) {
      return 'success';
    } else {
      return 'danger';
    }
  }

  getSeverityAccountStatus(accountStatus: string) {
    if (accountStatus === 'blocked') {
      return 'warning';
    } else if (accountStatus === 'active') {
      return 'success';
    } else {
      return 'danger';
    }
  }

  isAccountDeleted() {
    return this.selectedPractitioner.account?.accountStatus === 'deleted';
  }
}
