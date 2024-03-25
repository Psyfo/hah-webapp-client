import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { MessageService } from "primeng/api";
import { Messages, MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { VerificationService } from "../../../core/services/verification.service";

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [MessagesModule, ToastModule, CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
  animations: [routerTransitionSlideUp],
})
export class VerificationComponent implements OnInit {
  route = inject(ActivatedRoute);
  verificationService = inject(VerificationService);
  messagesService = inject(MessageService);

  message: string = '';
  waiting: boolean = true;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const token = params['token'];
      this.verifyToken(token);
    });
  }

  verifyToken(token: string) {
    setTimeout(() => {
      this.verificationService.verifyToken(token).subscribe(
        (response) => {
          this.message = response.message;
          this.waiting = false;
          console.log('Response: ', response);
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Congratulations! Your email has been verified.',
          });
        },
        (error) => {
          this.message =
            'Sorry! Your link is invalid or expired. Please request a new verification email by logging into your account.';
          this.waiting = false;
          console.log('Error: ', error);
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Verification link invalid or expired.',
          });
        }
      );
    }, 2000);
  }
}
