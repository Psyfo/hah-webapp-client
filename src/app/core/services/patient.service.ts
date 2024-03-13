import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IPatient } from "app/core/models/patient.interface";
import { environment } from "environments/environment";

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  http = inject(HttpClient);

  createPatient(patient: IPatient) {
    return this.http.post<IPatient>(
      `${this.apiUrl}/patients`,
      patient,
      this.httpOptions
    );
  }

  getPatients() {
    return this.http.get<IPatient[]>(`${this.apiUrl}/patients`);
  }

  getActivePatients() {
    return this.http.get<IPatient[]>(`${this.apiUrl}/patients/active`);
  }

  getBlockedPatients() {
    return this.http.get<IPatient[]>(`${this.apiUrl}/patients/blocked`);
  }

  getDeletedPatients() {
    return this.http.get<IPatient[]>(`${this.apiUrl}/patients/deleted`);
  }

  getPatientById(id: number) {
    return this.http.get<IPatient>(`${this.apiUrl}/patients/${id}`);
  }

  getPatientByEmail(email: string) {
    return this.http.get<IPatient>(`${this.apiUrl}/patients/email/${email}`);
  }

  updatePatient(patient: IPatient) {
    return this.http.patch<IPatient>(
      `${this.apiUrl}/patients/${patient.id}`,
      patient,
      this.httpOptions
    );
  }

  updatePatientByEmail(patient: IPatient) {
    return this.http.patch<IPatient>(
      `${this.apiUrl}/patients/email/${patient.email}`,
      patient,
      this.httpOptions
    );
  }

  deletePatient(patient: IPatient) {
    return this.http.delete<IPatient>(`${this.apiUrl}/patients/${patient.id}`);
  }

  deletePatientByEmail(patient: IPatient) {
    return this.http.delete<IPatient>(
      `${this.apiUrl}/patients/email/${patient.email}`
    );
  }

  blockPatientByEmail(patient: IPatient) {
    return this.http.patch<IPatient>(
      `${this.apiUrl}/patients/block/${patient.email}`,
      patient,
      this.httpOptions
    );
  }

  reactivatePatientByEmail(patient: IPatient) {
    return this.http.patch<IPatient>(
      `${this.apiUrl}/patients/reactivate/${patient.email}`,
      patient,
      this.httpOptions
    );
  }
}
