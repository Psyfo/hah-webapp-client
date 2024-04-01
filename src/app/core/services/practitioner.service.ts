import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { IPractitioner } from '../models/practitioner.interface';

@Injectable({
  providedIn: 'root',
})
export class PractitionerService {
  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  http = inject(HttpClient);

  createPractitioner(practitioner: IPractitioner) {
    return this.http.post<IPractitioner>(
      `${this.apiUrl}/practitioners`,
      practitioner,
      this.httpOptions
    );
  }

  getPractitioners() {
    return this.http.get<IPractitioner[]>(`${this.apiUrl}/practitioners`);
  }

  getActivePractitioners() {
    return this.http.get<IPractitioner[]>(
      `${this.apiUrl}/practitioners/active`
    );
  }

  getBlockedPractitioners() {
    return this.http.get<IPractitioner[]>(
      `${this.apiUrl}/practitioners/blocked`
    );
  }

  getDeletedPractitioners() {
    return this.http.get<IPractitioner[]>(
      `${this.apiUrl}/practitioners/deleted`
    );
  }

  getPractitionerById(id: number) {
    return this.http.get<IPractitioner>(`${this.apiUrl}/practitioners/${id}`);
  }

  getPractitionerByEmail(email: string) {
    return this.http.get<IPractitioner>(
      `${this.apiUrl}/practitioners/email/${email}`
    );
  }

  updatePractitioner(practitioner: IPractitioner) {
    return this.http.patch<IPractitioner>(
      `${this.apiUrl}/practitioners/${practitioner.id}`,
      practitioner,
      this.httpOptions
    );
  }

  updatePractitionerByEmail(practitioner: IPractitioner) {
    return this.http.patch<IPractitioner>(
      `${this.apiUrl}/practitioners/email/${practitioner.email}`,
      practitioner,
      this.httpOptions
    );
  }

  deletePractitioner(practitioner: IPractitioner) {
    return this.http.delete<IPractitioner>(
      `${this.apiUrl}/practitioners/${practitioner.id}`
    );
  }

  deletePractitionerByEmail(practitioner: IPractitioner) {
    return this.http.delete<IPractitioner>(
      `${this.apiUrl}/practitioners/email/${practitioner.email}`
    );
  }

  blockPractitionerByEmail(practitioner: IPractitioner) {
    return this.http.patch<IPractitioner>(
      `${this.apiUrl}/practitioners/block/${practitioner.email}`,
      practitioner,
      this.httpOptions
    );
  }

  reactivatePractitionerByEmail(practitioner: IPractitioner) {
    return this.http.patch<IPractitioner>(
      `${this.apiUrl}/practitioners/reactivate/${practitioner.email}`,
      practitioner,
      this.httpOptions
    );
  }

  forgotPassword(email: string) {
    return this.http.post<IPractitioner>(
      `${this.apiUrl}/practitioners/forgot-password`,
      { email: email },
      this.httpOptions
    );
  }

  resetPassword(oldPassword: string, newPassword: string) {
    return this.http.post<IPractitioner>(
      `${this.apiUrl}/practitioners/reset-password`,
      { oldPassword, newPassword },
      this.httpOptions
    );
  }
}
