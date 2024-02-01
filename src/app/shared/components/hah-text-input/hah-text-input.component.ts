import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';

import {
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-hah-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hah-text-input.component.html',
  styleUrl: './hah-text-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HahTextInputComponent),
      multi: true,
    },
  ],
})
export class HahTextInputComponent {
  @Input() inputClass: string = 'form-control';
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() labelText: string = 'Label';
  @Input() labelFor: string = '';
  @Input() placeholder: string = '';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() isRequired: boolean = false;
  @Input() isEmail: boolean = false;
  @Input() customValidation: ((value: string) => boolean) | null = null;
  @Input() isDisabled: boolean = false;
  @Input() caption: string | null = null;
  @Input() value: string = '';

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  private touched: boolean = false;

  onValueChange(newValue: any): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }

  onInputBlur(): void {
    this.touched = true;
  }

  errorMessage: string = ''; // not sure if still using

  hasError(): boolean {
    if (this.touched) {
      if (this.isRequired && !this.value) {
        this.inputClass = 'form-control form-control-error';
        this.getErrorMessage('This field is required');
        return true;
      }

      if (
        this.isEmail &&
        this.type === 'email' &&
        this.value &&
        !this.validateEmail(this.value)
      ) {
        this.inputClass = 'form-control form-control-error';
        this.getErrorMessage('Please enter a valid email');
        return true;
      }

      if (
        this.type === 'password' &&
        this.value &&
        !this.validatePassword(this.value)
      ) {
        this.inputClass = 'form-control form-control-error';
        this.getErrorMessage(`
            1. Min length: 10 characters
2. Include at least 1 lowercase character
3. Include at least 1 UPPERCASE character
4. Include at least 1 number
5. Include at least 1 special character (Special characters list between double quotes)
          `);
        return true;
      }

      if (this.customValidation && !this.customValidation(this.value)) {
        this.inputClass = 'form-control form-control-error';
        this.getErrorMessage('Please enter a valid value');
        return true;
      }

      return false;
    }
    return false;
  }

  getErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  private validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private validatePassword(password: string): boolean {
    // 1. Min length: 10 characters
    if (password.length < 10) {
      return false;
    }

    // 2. Include at least 1 lowercase character
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // 3. Include at least 1 UPPERCASE character
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // 4. Include at least 1 number
    if (!/\d/.test(password)) {
      return false;
    }

    // 5. Include at least 1 special character
    const specialCharacters = /[!@#$%^&*()_+,\-.\/:;<=>?@\[\]^_{|}~]/;
    if (!specialCharacters.test(password)) {
      return false;
    }

    // All criteria met
    return true;
  }
}
