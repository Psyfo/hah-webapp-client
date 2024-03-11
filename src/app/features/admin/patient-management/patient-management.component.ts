import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';
import { PatientService } from 'app/features/patient/patient.service';
import { IPatient } from 'app/models/patient.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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
  selectedPatient: IPatient = {};
  selectedPatients: IPatient[] = [];
  approvalStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  updatePatientForm!: FormGroup;
  isFormSubmitted: boolean = false;
  updatingPatient: boolean = false;

  ngOnInit(): void {
    this.patientService.getPatients().subscribe(
      (patients) => {
        this.patients = patients;
        console.log(this.patients);
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while retrieving patients.',
        });
      }
    );

    this.updatePatientForm = this.fb.group({
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
    return this.updatePatientForm.controls;
  }

  openNew() {}

  onInput($event: any) {
    this.dt.filterGlobal($event.target.value, 'contains');
  }

  updateDialogVisible = false;
  openUpdatePatientDialog(patient: IPatient) {
    this.updateDialogVisible = true;
    this.updatePatientForm.patchValue({
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      verified: patient.account?.verified,
      approvalStatus: patient.account?.approvalStatus,
    });
    this.selectedPatient = patient;
  }
  closeUpdatePatientDialog() {
    this.updateDialogVisible = false;
  }

  updatePatient() {
    this.isFormSubmitted = true;
    this.updatingPatient = true;

    if (this.updatePatientForm.invalid) {
      this.updatingPatient = false;
      return;
    }

    const updatedPatient: IPatient = Object.assign({}, this.selectedPatient, {
      email: this.updatePatientForm.value.email,
      firstName: this.updatePatientForm.value.firstName,
      lastName: this.updatePatientForm.value.lastName,
      account: {
        verified: this.updatePatientForm.value.verified,
        approvalStatus: this.updatePatientForm.value.approvalStatus,
      },
    });
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

        // Update the value in the local DataTable array
        // const index = this.dt.findIndexInSelection((patient: IPatient) => {
        //   patient.id === updatedPatient.id;
        // });
        // if (index !== -1) {
        //   this.dt[index] = newValue;
        // }
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

    this.closeUpdatePatientDialog();
  }

  deletePatient(patient: IPatient) {
    if (patient) {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete ${patient.firstName} ${patient.lastName} (${patient.email})?`,
        accept: () => {
          this.patientService.deletePatient(patient.id!).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Patient deleted successfully.',
              });
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
}
