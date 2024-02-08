import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// custom-email.validator.ts

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null; // If no value, don't perform validation
    }

    const errors: ValidationErrors = {};

    // Check if email starts with a special character
    if (/^[!@#$%^&*(),.?":{}|<>]/.test(email)) {
      errors['startsWithSpecialCharacter'] = true;
      errors['policy'] = true;
    }

    // Check if last part of email (e.g., '.com') has a minimum of two characters
    const lastPart = email.split('.').pop();
    if (lastPart && lastPart.length < 2) {
      errors['lastPartLength'] = true;
      errors['policy'] = true;
    }

    // Check if last part of email (e.g., 'com') contains a special character
    if (lastPart && /[!@#$%^&*(),.?":{}|<>]/.test(lastPart)) {
      errors['lastPartSpecialCharacter'] = true;
      errors['policy'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
