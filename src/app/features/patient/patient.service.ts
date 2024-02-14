import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  getPatients() {
    return this.http.get<any>(`${this.apiUrl}/patients`);
  }
  getPatientById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }
  getPatientByEmail(email: string) {
    return this.http.get<any>(`${this.apiUrl}/patients/email/${email}`);
  }
  createPatient(patient: any) {
    return this.http.post<any>(`${this.apiUrl}/patients`, patient);
  }
  updatePatient(patient: any) {
    return this.http.put<any>(`${this.apiUrl}/patients/${patient.id}`, patient);
  }
  deletePatient(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/patients/${id}`);
  }
}
