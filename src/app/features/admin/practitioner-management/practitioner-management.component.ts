import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IPractitioner } from "app/core/models/practitioner.interface";
import { PractitionerService } from "app/core/services/practitioner.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
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
import { merge } from "ts-deepmerge";

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
    CalendarModule,
    CardModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DialogModule,
    DropdownModule,
    InputMaskModule,
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
  contextMenuItems: MenuItem[] = [];

  practitionerForm!: FormGroup;
  approvalForm!: FormGroup;
  isFormSubmitted: boolean = false;
  updatingPractitioner: boolean = false;
  approvingPractitioner: boolean = false;
  practitionerDialogVisible = false;
  approvalDialogVisible = false;
  rejectionReasonVisible: boolean = false;
  isUpdate: boolean = false;

  ngOnInit(): void {
    this.getPractitioners();

    this.practitionerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: [new Date(), [Validators.required]],
      idNumber: [''],
      phoneNumber: [''],
      verified: [false],
      approvalStatus: ['pending'],
    });
    this.f['verified'].disable();

    this.approvalForm = this.fb.group({
      approvalStatus: ['pending', [Validators.required]],
      rejectionReason: [''],
    });

    this.contextMenuItems = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-eye',
        command: (event) =>
          this.openUpdatePractitionerDialog(this.selectedPractitioner),
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: (event) => this.deletePractitioner(this.selectedPractitioner),
      },
      {
        label: 'Approve / Reject',
        icon: 'pi pi-fw pi-check',
        command: (event) => this.openApprovalDialog(this.selectedPractitioner),
      },
    ];

    // Subscribe to a[approvalStatus] value changes
    this.a['approvalStatus'].valueChanges.subscribe((value) => {
      if (value === 'rejected') {
        this.rejectionReasonVisible = true;
        this.a['rejectionReason'].setValidators([Validators.required]);
      } else {
        this.rejectionReasonVisible = false;
        this.a['rejectionReason'].clearValidators();
      }
    });
  }

  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  get f() {
    return this.practitionerForm.controls;
  }

  get a() {
    return this.approvalForm.controls;
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

  openApprovalDialog(practitioner: IPractitioner) {
    if (this.a['approvalStatus']!.value === 'rejected') {
      this.rejectionReasonVisible = true;
      this.a['rejectionReason'].setValidators([Validators.required]);
    } else {
      this.rejectionReasonVisible = false;
      this.a['rejectionReason'].clearValidators();
    }

    this.approvalDialogVisible = true;

    this.approvalForm.patchValue({
      approvalStatus: practitioner.account?.approvalStatus,
    });
  }

  closeApprovalDialog() {
    this.approvalDialogVisible = false;
  }

  onApprovalStatusChange() {
    // if (this.a['approvalStatus'].value === 'rejected') {
    //   this.rejectionReasonVisible = true;
    //   this.a['rejectionReason'].setValidators([Validators.required]);
    // } else {
    //   this.rejectionReasonVisible = false;
    //   this.a['rejectionReason'].clearValidators();
    // }
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

  approvePractitioner() {
    this.approvalDialogVisible = false;
    this.approvingPractitioner = true;

    const updatedPractitioner: IPractitioner = merge(
      this.selectedPractitioner,
      {
        account: {
          approvalStatus: this.approvalForm.value.approvalStatus,
        },
      } as IPractitioner
    );

    if (this.approvalForm.value.approvalStatus === 'rejected') {
      updatedPractitioner.account!.rejectionReason =
        this.approvalForm.value.rejectionReason;
    }

    this.practitionerService.approvePractitioner(updatedPractitioner).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Practitioner approved successfully.',
        });
        this.approvingPractitioner = false;
        this.approvalDialogVisible = false;

        this.approvalForm.reset();
        this.getPractitioners();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while approving the practitioner.',
        });
        this.approvingPractitioner = false;
        this.approvalDialogVisible = false;

        this.approvalForm.reset();
      }
    );
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
