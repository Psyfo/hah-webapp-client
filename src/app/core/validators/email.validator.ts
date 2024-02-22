import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom-email.validator.ts

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null; // If no value, don't perform validation
    }

    const errors: ValidationErrors = {};

    // Check if email starts with a special character
    if (/^[!@#$%^&*(),?":{}|<>-_~]/.test(email)) {
      errors['startsWithSpecialCharacter'] = true;
      errors['policy'] = true;
    }

    //Check if email starts with a hyphen
    if (/^-.+@/.test(email)) {
      // If the test passes, it means a hyphen is found at the very beginning before '@'
      errors['containsHyphenAtBeginning'] = true;
      errors['policy'] = true;
    }

    // Check if email contains a special character before the '@' portion
    if (/^[^!@#$%^&*(),?":{}|<>~]*@/.test(email)) {
      // If the test fails, it means no special character is before '@'
      // Your code logic for handling this case goes here
    } else {
      // Handle the case where a special character is found before '@'
      errors['containsSpecialCharacter'] = true;
      errors['policy'] = true;
    }

    // Check if last part of email (e.g., '.com') has a minimum of two characters
    const lastPart = email.split('.').pop();
    if (lastPart && lastPart.length < 2) {
      errors['lastPartLength'] = true;
      errors['policy'] = true;
    }

    // Check if last part of email (e.g., 'com') contains a special character
    if (lastPart && /[!@#$%^&*(),.?":{}|<>-_~]/.test(lastPart)) {
      errors['lastPartSpecialCharacter'] = true;
      errors['policy'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
