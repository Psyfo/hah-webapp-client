import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-get-started',
  standalone: true,
  imports: [ToastModule, MessagesModule, ButtonModule],
  templateUrl: './get-started.component.html',
  styleUrl: './get-started.component.css',
})
export class GetStartedComponent {
  router = inject(Router);
  messageService = inject(MessagesModule);

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
