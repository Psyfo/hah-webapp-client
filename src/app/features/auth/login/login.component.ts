import { Component } from '@angular/core';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HahTextInputComponent, HahButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
