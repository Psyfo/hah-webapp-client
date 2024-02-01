import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HahButtonComponent } from 'app/shared/components/hah-button/hah-button.component';
import { HahTextInputComponent } from 'app/shared/components/hah-text-input/hah-text-input.component';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [HahTextInputComponent, HahButtonComponent],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.css',
})
export class Step1Component {
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  nextStep(): void {
    console.log(this.route.url);
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }
}
