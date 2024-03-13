import { Component, OnInit, inject } from "@angular/core";
import { AdminService } from "app/core/services/admin.service";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
  animations: [routerTransitionSlideUp],
})
export class AdminHomeComponent implements OnInit {
  adminService = inject(AdminService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.adminService.getAdminByEmail(email).subscribe(
        (admin) => {
          if (admin) {
            // this.messageService.add({
            //   severity: 'success',
            //   summary: 'Welcome',
            //   detail: `Welcome back, ${admin.email}!`,
            // });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching admin details',
          });
        }
      );
    }
  }
}
