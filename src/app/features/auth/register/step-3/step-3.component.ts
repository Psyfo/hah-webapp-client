import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPatient } from 'app/models/patient.interface';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';

@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [FormsModule, HahButtonComponent],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.css',
})
export class Step3Component {
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

  countryCode: string = '';
  countryCodeTouched: boolean = false;
  countryCodeError: string = '';
  phoneNumber: string = '';
  phoneNumberTouched: boolean = false;
  phoneNumberError: string = '';

  previous(): void {
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }
  register(): void {
    console.log('countryCode', this.countryCode);
    console.log('phoneNumber', this.phoneNumber);

    if (this.countryCodeError === '' && this.phoneNumberError === '') {
      console.log('step 3 valid');
      this.patient.email = this.previousPatient.email;
      this.patient.password = this.previousPatient.password;
      this.patient.firstName = this.previousPatient.firstName;
      this.patient.lastName = this.previousPatient.lastName;
      this.patient.dob = this.previousPatient.dob;
      this.patient.gender = this.previousPatient.gender;
      this.patient.phoneNumber = this.countryCode + this.phoneNumber;
      console.log('patient', this.patient);
      this.router.navigate(['/login']);
    }
  }

  onCountryCodeChanged(): void {
    this.countryCodeTouched = true;
    if (this.countryCode === '') {
      this.countryCodeError = 'Country code is required';
    } else {
      this.countryCodeError = '';
    }
  }
  onPhoneNumberChanged(): void {
    this.phoneNumberTouched = true;
    if (this.phoneNumber === '') {
      this.phoneNumberError = 'Phone number is required';
    } else {
      this.phoneNumberError = '';
    }
  }
  onPhoneNumberTouched(): void {
    this.phoneNumberTouched = true;
  }
  onCountryCodeTouched(): void {
    this.countryCodeTouched = true;
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
}
