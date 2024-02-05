import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom-password.validator.ts

export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null; // If no value, don't perform validation
    }

    const errors: ValidationErrors = {};

    // Check for your password criteria
    if (password.length < 10) {
      errors['minLength'] = true;
      errors['policy'] = true;
    }

    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
      errors['policy'] = true;
    }

    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = true;
      errors['policy'] = true;
    }

    if (!/\d/.test(password)) {
      errors['digit'] = true;
      errors['policy'] = true;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors['specialCharacter'] = true;
      errors['policy'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
