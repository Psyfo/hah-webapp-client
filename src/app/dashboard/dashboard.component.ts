import { Component } from '@angular/core';
import { MenuComponent } from '../features/menu/menu.component';
import { NavComponent } from '../features/nav/nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
