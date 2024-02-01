import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HahButtonComponent,
    HahTextInputComponent,
    CommonModule,

    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  router = inject(Router);

  constructor() {}

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
