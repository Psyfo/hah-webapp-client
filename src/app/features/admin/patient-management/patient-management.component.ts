import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IPatient } from 'app/core/models/patient.interface';
import { PatientService } from 'app/core/services/patient.service';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { get } from 'jquery';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { merge } from 'ts-deepmerge';

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
  selector: 'app-patient-management',
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
  templateUrl: './patient-management.component.html',
  styleUrl: './patient-management.component.css',
  animations: [routerTransitionSlideUp],
})
export class PatientManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') dt!: Table;

  messageService = inject(MessageService);
  patientService = inject(PatientService);
  confirmationService = inject(ConfirmationService);
  fb = inject(FormBuilder);
  ref = inject(ChangeDetectorRef);

  patients: IPatient[] = [];
  selectedPatient!: IPatient;
  selectedPatients: IPatient[] = [];
  approvalStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];
  contextMenuItems: MenuItem[] = [];

  patientForm!: FormGroup;
  approvalForm!: FormGroup;
  isFormSubmitted: boolean = false;
  updatingPatient: boolean = false;
  approvingPatient: boolean = false;
  patientDialogVisible = false;
  approvalDialogVisible = false;
  rejectionReasonVisible = false;
  isUpdate: boolean = false;

  ngOnInit(): void {
    this.getPatients();

    this.patientForm = this.fb.group({
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
        command: (event) => this.openUpdatePatientDialog(this.selectedPatient),
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: (event) => this.deletePatient(this.selectedPatient),
      },
      {
        label: 'Approve / Reject',
        icon: 'pi pi-fw pi-check',
        command: (event) => this.openApprovalDialog(this.selectedPatient),
      },
    ];
  }
  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  get f() {
    return this.patientForm.controls;
  }

  get a() {
    return this.approvalForm.controls;
  }

  getPatients() {
    this.patientService.getPatients().subscribe(
      (patients) => {
        this.patients = patients;
        console.log(this.patients);
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Patients loaded.',
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while retrieving patients.',
        });
      }
    );
  }

  openNew() {}

  onInput($event: any) {
    this.dt.filterGlobal($event.target.value, 'contains');
  }

  openNewPatientDialog() {
    this.isUpdate = false;
    this.patientDialogVisible = true;
  }

  openUpdatePatientDialog(patient: IPatient) {
    this.isUpdate = true;
    this.patientDialogVisible = true;

    this.patientForm.patchValue({
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: new Date(patient.dob as Date),
      idNumber: patient.idNumber,
      phoneNumber: patient.phoneNumber,
      verified: patient.account?.verified,
      approvalStatus: patient.account?.approvalStatus,
    });

    this.selectedPatient = patient;

    this.isAccountDeleted();
  }
  closeUpdatePatientDialog() {
    this.isFormSubmitted = false;
    this.patientDialogVisible = false;
  }

  openApprovalDialog(patient: IPatient) {
    this.approvalDialogVisible = true;
    this.approvalForm.patchValue({
      approvalStatus: patient.account?.approvalStatus,
    });
  }

  closeApprovalDialog() {
    this.approvalDialogVisible = false;
  }

  onApprovalStatusChange() {
    console.log('Approval Status:', this.a['approvalStatus']!.value);
    if (this.a['approvalStatus'].value === 'rejected') {
      this.rejectionReasonVisible = true;
      this.a['rejectionReason'].setValidators([Validators.required]);
    } else {
      this.rejectionReasonVisible = false;
      this.a['rejectionReason'].clearValidators();
    }
  }

  updatePatient() {
    this.isFormSubmitted = true;
    this.updatingPatient = true;

    if (this.patientForm.invalid) {
      this.updatingPatient = false;
      return;
    }

    if (this.isUpdate) {
      const updatedPatient: IPatient = merge(this.selectedPatient, {
        email: this.patientForm.value.email,
        firstName: this.patientForm.value.firstName,
        lastName: this.patientForm.value.lastName,
        account: {
          approvalStatus: this.patientForm.value.approvalStatus,
        },
      } as IPatient);

      console.log('Updated Patient:', updatedPatient);

      this.patientService.updatePatient(updatedPatient).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient updated successfully.',
          });
          this.updatingPatient = false;
          this.isFormSubmitted = false;

          this.getPatients();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating the patient.',
          });
          this.updatingPatient = false;
          this.isFormSubmitted = false;
        }
      );
    } else {
      this.patientService.createPatient(this.patientForm.value).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient created successfully.',
          });
          this.updatingPatient = false;
          this.isFormSubmitted = false;

          this.getPatients();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the patient.',
          });
          this.updatingPatient = false;
          this.isFormSubmitted = false;
        }
      );
    }

    this.patientDialogVisible = false;
  }

  deletePatient(patient: IPatient) {
    if (patient) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${patient.firstName} ${patient.lastName} (${patient.email})?`,
        accept: () => {
          this.patientService.deletePatient(patient).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Patient deleted successfully.',
              });

              this.getPatients();
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while deleting the patient.',
              });
            }
          );
        },
        reject: () => {},
      });
    }
  }

  approvePatient() {
    this.approvalDialogVisible = false;
    this.approvingPatient = true;

    const updatedPatient: IPatient = merge(this.selectedPatient, {
      account: {
        approvalStatus: this.approvalForm.value.approvalStatus,
      },
    } as IPatient);

    if (this.approvalForm.value.approvalStatus === 'rejected') {
      updatedPatient.account!.rejectionReason =
        this.approvalForm.value.rejectionReason;
    }

    this.patientService.approvePatient(updatedPatient).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient approved successfully.',
        });
        this.approvingPatient = false;
        this.approvalDialogVisible = false;

        this.approvalForm.reset();
        this.getPatients();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while approving the patient.',
        });
        this.approvingPatient = false;
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
    const isAccountDeleted: boolean =
      this.selectedPatient.account?.accountStatus === 'deleted';
    if (isAccountDeleted) {
      this.f['email'].disable();
      this.f['firstName'].disable();
      this.f['lastName'].disable();
      this.f['verified'].disable();
      this.f['approvalStatus'].disable();
    }
  }
}
