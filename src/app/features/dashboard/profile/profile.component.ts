import { Component } from "@angular/core";

import {
  routerTransitionSlideLeft,
  routerTransitionSlideRight,
  routerTransitionSlideUp,
} from 'app/core/utilities/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  animations: [
    routerTransitionSlideUp,
    routerTransitionSlideLeft,
    routerTransitionSlideRight,
  ],
})
export class ProfileComponent {}
