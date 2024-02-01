import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.css',
})
export class Step3Component {
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  previous(): void {
    this.router.navigate(['../step2'], { relativeTo: this.route });
  }
}
