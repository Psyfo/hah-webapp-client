import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { IPatient } from 'app/models/patient.interface';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahDropdownComponent } from 'app/shared/components/hah-dropdown/hah-dropdown.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropdownModule } from 'primeng/dropdown';

declare var $: any;
@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    HahButtonComponent,
    HahTextInputComponent,
    HahDropdownComponent,
    NgbDropdown,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    DropdownModule,
    FontAwesomeModule,
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.css',
})
export class Step2Component implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit() {
    // subscribe to router event
    this.route.queryParams.subscribe((params) => {
      //this.patient = params as IPatient;
      this.previousPatient = params;
      console.log(params);
    });
  }

  patient: IPatient = {} as IPatient; // Adjust the type based on the actual type of your patient object
  previousPatient: any;

  firstName: string = '';
  firstNameTouched: boolean = false;
  firstNameError: string = '';
  lastName: string = '';
  lastNameTouched: boolean = false;
  lastNameError: string = '';
  gender: string = '';
  genderTouched: boolean = false;
  genderError: string = '';
  dob: Date = new Date();
  dobTouched: boolean = false;
  dobError: string = '';

  nextStep(): void {
    console.log('patient', this.patient);
    console.log('firstName', this.firstName);
    console.log('lastName', this.lastName);
    console.log('dob', this.dob);
    console.log('gender', this.gender);

    if (this.firstNameError === '' && this.lastNameError === '') {
      console.log('step 2 valid');
      this.patient.firstName = this.firstName;
      this.patient.lastName = this.lastName;
      this.patient.dob = this.dob;
      this.patient.gender = this.gender;
      this.patient.email = this.previousPatient.email;
      this.patient.password = this.previousPatient.password;

      this.router.navigate(['../step3'], {
        relativeTo: this.route,
        queryParams: this.patient,
      });
    }
  }

  previousStep(): void {
    this.router.navigate(['../step1'], { relativeTo: this.route });
  }

  dateNavigation(event: any): void {
    console.log('Navigated to:', event.next);
  }

  previous(): void {
    this.router.navigate(['../step1'], { relativeTo: this.route });
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.cdr.detectChanges();
  }

  onFirstNameTouched(): void {
    this.firstNameTouched = true;
    this.validateFirstName();
  }
  onFirstNameChanged(event: Event): void {
    const firstNameInput = <HTMLInputElement>event.target;
    this.firstName = firstNameInput.value;
    this.validateFirstName();
  }
  private validateFirstName(): void {
    if (this.firstName === '' && this.firstNameTouched) {
      this.firstNameError = 'firstName is required';
    } else {
      this.firstNameError = ''; // Clear the error if the email is valid
    }
  }

  onLastNameTouched(): void {
    this.lastNameTouched = true;
    this.validateLastName();
  }
  onLastNameChanged(event: Event): void {
    const lastNameInput = <HTMLInputElement>event.target;
    this.lastName = lastNameInput.value;
    this.validateLastName();
  }
  private validateLastName(): void {
    if (this.lastName === '' && this.lastNameTouched) {
      this.lastNameError = 'lastName is required';
    } else {
      this.lastNameError = ''; // Clear the error if the email is valid
    }
  }

  onDOBTouched(): void {
    this.dobTouched = true;
    //this.validateDOB();
  }
  onDOBChanged(event: Event): void {
    // const dobInput = <HTMLInputElement>event.target;
    // this.dob = new Date(dobInput.value);
    // this.validateDOB();
  }
  private validateDOB(): void {}

  onGenderTouched(): void {
    this.genderTouched = true;
    //this.validateGender();
  }
  onGenderChanged(event: Event): void {
    // const genderInput = <HTMLInputElement>event.target;
    // this.gender = new Date(genderInput.value);
    // this.validateGender();
  }
  private validateGender(): void {}
}
