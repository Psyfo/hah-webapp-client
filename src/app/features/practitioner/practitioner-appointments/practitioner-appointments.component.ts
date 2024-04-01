import { Component } from '@angular/core';
import { routerTransitionSlideUp } from 'app/core/utilities/animations';

@Component({
  selector: 'app-practitioner-appointments',
  standalone: true,
  imports: [],
  templateUrl: './practitioner-appointments.component.html',
  styleUrl: './practitioner-appointments.component.css',
  animations: [routerTransitionSlideUp],
})
export class PractitionerAppointmentsComponent {}
