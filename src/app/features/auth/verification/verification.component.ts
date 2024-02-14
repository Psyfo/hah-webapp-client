import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Messages, MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { VerificationService } from './verification.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [MessagesModule, ToastModule, CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
})
export class VerificationComponent implements OnInit {
  route = inject(ActivatedRoute);
  verificationService = inject(VerificationService);
  messagesService = inject(MessageService);

  message: string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const token = params['token'];
      this.verifyToken(token);
    });
  }

  verifyToken(token: string) {
    this.verificationService.verifyToken(token).subscribe(
      (response) => {
        this.message = response.message;
        console.log('Response: ', response);
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your account has been verified. You can now log in.',
        });
      },
      (error) => {
        console.log('Error: ', error);
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error verifying your account.',
        });
      }
    );
  }
}
