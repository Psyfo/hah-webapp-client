import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IAdmin } from 'app/models/admin.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  http = inject(HttpClient);

  createAdmin(admin: any) {
    return this.http.post<IAdmin>(
      `${this.apiUrl}/admins`,
      admin,
      this.httpOptions
    );
  }

  getAdmins() {
    return this.http.get<IAdmin[]>(`${this.apiUrl}/admins`);
  }

  getAdminById(id: number) {
    return this.http.get<IAdmin>(`${this.apiUrl}/admins/${id}`);
  }

  getAdminByEmail(email: string) {
    return this.http.get<IAdmin>(`${this.apiUrl}/admins/email/${email}`);
  }

  updateAdmin(admin: IAdmin) {
    return this.http.patch<IAdmin>(
      `${this.apiUrl}/admins/${admin.id}`,
      admin,
      this.httpOptions
    );
  }

  deleteAdmin(admin: IAdmin) {
    return this.http.delete<IAdmin>(`${this.apiUrl}/admins/${admin.id}`);
  }
}
