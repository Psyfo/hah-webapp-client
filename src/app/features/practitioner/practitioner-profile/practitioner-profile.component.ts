import { Component } from '@angular/core';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';

@Component({
  selector: 'app-practitioner-profile',
  standalone: true,
  imports: [],
  templateUrl: './practitioner-profile.component.html',
  styleUrl: './practitioner-profile.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerProfileComponent {}
