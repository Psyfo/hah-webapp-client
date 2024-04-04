import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { IPractitioner } from "app/core/models/practitioner.interface";
import { PractitionerService } from "app/core/services/practitioner.service";
import { UploadService } from "app/core/services/upload.service";
import { VerificationService } from "app/core/services/verification.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-practitioner-home',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    FileUploadModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputMaskModule,
    InputTextModule,
    MenubarModule,
    MessagesModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    StepsModule,
    ToastModule,
  ],
  templateUrl: './practitioner-home.component.html',
  styleUrl: './practitioner-home.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerHomeComponent implements OnInit, AfterViewInit {
  authService = inject(AuthenticationService);
  practitionerService = inject(PractitionerService);
  messageService = inject(MessageService);
  router = inject(Router);
  verificationService = inject(VerificationService);
  confirmationService = inject(ConfirmationService);
  fb: FormBuilder = inject(FormBuilder);
  uploadService = inject(UploadService);
  cdr = inject(ChangeDetectorRef);

  practitioner?: IPractitioner;
  verificationStatus: string = '';
  emailSent: boolean = false;
  practitionerIdForm!: FormGroup;
  maxDate: Date = new Date(2006, 2, 1);
  updatingPractitioner: boolean = false;
  practitionerUpdated: boolean = false;
  selectedFile: File | null = null;

  items?: any[];
  activeIndex!: number;
  activeTab: string = '1';
  navItems?: MenuItem[];
  loading: boolean = false;
  isFormSubmitted: boolean = false;

  ngOnInit(): void {
    // Check local storage or session storage for email
    const email =
      localStorage.getItem('email') || sessionStorage.getItem('email');
    if (email) {
      this.practitionerService
        .getPractitionerByEmail(email)
        .subscribe((practitioner: IPractitioner) => {
          this.practitioner = practitioner;

          this.practitionerIdForm.patchValue({
            firstName: this.practitioner?.firstName,
            lastName: this.practitioner?.lastName,
            idNumber: this.practitioner?.idNumber,
            dob: new Date(this.practitioner?.dob as Date),
            phoneNumber: this.practitioner?.phoneNumber,
          });

          // Set verification status
          this.verificationStatus = practitioner?.account?.verified
            ? 'Verified'
            : 'Not Verified';

          // Set active index and tab based on activation step
          if (this.practitioner?.account?.activationStep === 0) {
            this.activeIndex = 0;
            //this.activeTab = '1';
          } else if (this.practitioner?.account?.activationStep === 1 || 2) {
            this.activeIndex = 1;
            //this.activeTab = '2';
          } else if (this.practitioner?.account?.activationStep === 3) {
            this.activeIndex = 2;
            //this.activeTab = '3';
          }
          console.log(
            'Activation step: ',
            this.practitioner?.account?.activationStep
          );
          console.log('Active index: ', this.activeIndex);
          console.log('Active tab: ', this.activeTab);
        });
    }

    this.navItems = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/profile'], // Update with your route
      },
      {
        label: 'Appointments',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/appointment'], // Update with your route
      },
    ];

    this.items = [
      {
        label: 'Email',
        command: (event: any) => {
          this.activeIndex = 0;
          this.activeTab = '1';
        },
      },
      {
        label: 'Identity',
        command: (event: any) => {
          this.activeIndex = 1;
          this.activeTab = '2';
        },
      },
      {
        label: 'Documents',
        command: (event: any) => {
          this.activeIndex = 2;
          this.activeTab = '3';
        },
      },
    ];

    this.practitionerIdForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      dob: [new Date(2006, 0, 1), [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  next() {
    if (this.activeIndex < this.items!.length - 1) {
      this.activeIndex++;
      this.practitioner!.account!.activationStep = this.activeIndex;
      this.practitionerService
        .updatePractitioner(this.practitioner!)
        .subscribe((response) => {
          console.log('Response: ', response);
          console.log('Practitioner activationStep updated.');
        });
    }
  }

  resendEmailDialogVisible: boolean = false;
  openResendEmailDialog() {
    this.resendEmailDialogVisible = true;
  }
  closeResendEmailDialog() {
    this.resendEmailDialogVisible = false;
  }
  resendVerificationEmail() {
    this.resendEmailDialogVisible = false;
    this.loading = true;
    setTimeout(() => {
      this.verificationService
        .resendPractitionerVerificationEmail(this.practitioner?.email || '')
        .subscribe(
          (response: any) => {
            console.log('Response: ', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Verification email sent.',
            });
            this.loading = false;
          },
          (error: any) => {
            console.log('Error: ', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to send verification email.',
            });
            this.loading = false;
          }
        );
    }, 2000);
  }

  goToAppointments() {
    this.router.navigate(['/dashboard/appointments']);
  }

  openEmailApp() {
    window.open('mailto:?view=inbox');
  }

  updatePractitioner() {
    this.isFormSubmitted = true;
    this.updatingPractitioner = true;
    // let practitioner: IPractitioner = this.practitionerIdForm.value;
    // practitioner.account = {};
    this.practitioner!.firstName = this.practitionerIdForm.value.firstName;
    this.practitioner!.lastName = this.practitionerIdForm.value.lastName;
    this.practitioner!.idNumber = this.practitionerIdForm.value.idNumber;
    this.practitioner!.dob = this.practitionerIdForm.value.dob;
    this.practitioner!.phoneNumber = this.practitionerIdForm.value.phoneNumber;
    this.practitioner!.account!.activationStep = 2;

    console.log('Practitioner: ', this.practitioner);

    if (this.practitionerIdForm.invalid) {
      this.updatingPractitioner = false;
      return;
    }

    this.practitionerService.updatePractitioner(this.practitioner!).subscribe(
      (response: IPractitioner) => {
        console.log('Response: ', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Practitioner updated successfully.',
        });
        this.updatingPractitioner = false;
        this.practitionerUpdated = true;
      },
      (error: any) => {
        console.log('Error: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update practitioner.',
        });
        this.updatingPractitioner = false;
      }
    );
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const email = this.practitioner!.email as string;

    if (!file || !email) {
      return;
    }

    this.uploadService.uploadPractitionerId(file, email).subscribe(
      (response: any) => {
        console.log('Upload successful!', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Practitioner ID uploaded successfully.',
        });

        this.practitioner!.account!.activationStep = 3;
        this.practitionerService
          .updatePractitioner(this.practitioner!)
          .subscribe(
            (response: IPractitioner) => {
              console.log('Response: ', response);
              console.log('Practitioner activationStep updated.');
            },
            (error: any) => {
              console.error('Error: ', error);
            }
          );

        // Update the active index and tab
        this.activeIndex = 2;
        this.activeTab = '3';
      },
      (error: any) => {
        console.error('Upload failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload practitioner ID.',
        });
      }
    );
  }

  onQualificationUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const email = this.practitioner!.email as string;

    if (!file || !email) {
      return;
    }

    this.uploadService.uploadPractitionerQualification(file, email).subscribe(
      (response: any) => {
        console.log('Upload successful!', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Practitioner ID uploaded successfully.',
        });

        this.practitioner!.account!.activationStep = 4;
        this.practitionerService
          .updatePractitioner(this.practitioner!)
          .subscribe(
            (response: IPractitioner) => {
              console.log('Response: ', response);
              console.log('Practitioner activationStep updated.');
            },
            (error: any) => {
              console.error('Error: ', error);
            }
          );

        // Update the active index and tab
        this.activeIndex = 2;
        this.activeTab = '3';
      },
      (error: any) => {
        console.error('Upload failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload practitioner ID.',
        });
      }
    );
  }

  get f() {
    return this.practitionerIdForm.controls;
  }
}
