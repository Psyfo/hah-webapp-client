import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-hah-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hah-text-input.component.html',
  styleUrl: './hah-text-input.component.css',
})
export class HahTextInputComponent {
  @Input() type: string = 'text';
  @Input() label: string = 'Label';
  @Input() placeholder: string = '';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() isRequired: boolean = false;
  value: any;
  error: string | null = "here's an error";
}
