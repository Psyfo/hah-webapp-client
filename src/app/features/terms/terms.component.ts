import { Component } from '@angular/core';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
  animations: [routerTransitionSlideUp],
})
export class TermsComponent {}
