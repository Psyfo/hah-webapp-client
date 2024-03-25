import { Component } from '@angular/core';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  animations: [routerTransitionSlideUp],
})
export class FaqComponent {}
