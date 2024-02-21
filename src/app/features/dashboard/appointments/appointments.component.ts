import { Component } from "@angular/core";

import {
  routerTransitionSlideLeft,
  routerTransitionSlideRight,
  routerTransitionSlideUp,
} from 'app/core/utilities/animations';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
  animations: [
    routerTransitionSlideUp,
    routerTransitionSlideLeft,
    routerTransitionSlideRight,
  ],
})
export class AppointmentsComponent {}
