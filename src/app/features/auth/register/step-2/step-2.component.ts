import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
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
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.css',
})
export class Step2Component {
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  cities: any[] = ['Cairo', 'Alexandria', 'Giza'];
  selectedCity: any = this.cities[0];

  nextStep(): void {
    this.router.navigate(['../step3'], { relativeTo: this.route });
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
}
