import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IPatient } from 'app/models/patient.interface';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [HahTextInputComponent, HahButtonComponent, FormsModule],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.css',
})
export class Step1Component {
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // subscribe to router event
    // this.route.queryParams.subscribe((params) => {
    //   if (params) {
    //     this.patient = params as IPatient;
    //   }
    //   console.log(params);
    // });
  }

  patient: IPatient = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: new Date(),
    gender: '',
    phoneNumber: '',
  } as IPatient;

  email: string = '';
  emailTouched: boolean = false;
  emailError: string = '';
  password: string = '';
  passwordTouched: boolean = false;
  passwordError: string = '';

  buttonDisabled: boolean = true;

  constructor() {}

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  nextStep(): void {
    if (
      this.emailError === '' &&
      this.passwordError === '' &&
      this.emailTouched &&
      this.passwordTouched
    ) {
      console.log('valid');
      this.patient.email = this.email;
      this.patient.password = this.password;
      this.router.navigate(['../step2'], {
        relativeTo: this.route,
        queryParams: this.patient,
      });
    }
  }
  onEmailTouched(): void {
    this.emailTouched = true;
    this.validateEmail();
  }
  onEmailChanged(event: Event): void {
    const emailInput = <HTMLInputElement>event.target;
    this.email = emailInput.value;
    this.validateEmail();
  }
  private validateEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this.email === '' && this.emailTouched) {
      this.emailError = 'Email is required';
    } else if (
      this.email &&
      this.emailTouched &&
      !emailPattern.test(this.email)
    ) {
      this.emailError = 'Invalid email format';
    } else {
      this.emailError = ''; // Clear the error if the email is valid
    }
  }
  onPasswordTouched(): void {
    this.passwordTouched = true;
    this.validatePassword();
  }
  onPasswordChanged(event: Event): void {
    const passwordInput = <HTMLInputElement>event.target;
    this.password = passwordInput.value;
    this.validatePassword();
  }
  private validatePassword(): void {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$/;

    if (this.password === '' && this.passwordTouched) {
      this.passwordError = 'password is required';
    } else if (
      this.password &&
      this.passwordTouched &&
      !passwordPattern.test(this.password)
    ) {
      this.passwordError = `Invalid password format
      1. Min length: 10 characters
      2. Include at least 1 lowercase character
      3. Include at least 1 UPPERCASE character
      4. Include at least 1 number
      5. Include at least 1 special character `;
    } else {
      this.passwordError = ''; // Clear the error if the email is valid
    }
  }
}
