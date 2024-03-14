import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    }),
  };

  uploadPatientId(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('email', email);
    console.log('Form Data: ', formData);

    return this.http.post<any>(`${this.apiUrl}/upload/patient-id`, formData);
  }

  uploadPractitionerId(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('email', email);
    console.log('Form Data: ', formData);

    return this.http.post<any>(
      `${this.apiUrl}/upload/practitioner-id`,
      formData
    );
  }

  uploadPatientAvatar(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('email', email);
    console.log('Form Data: ', formData);

    return this.http.post<any>(
      `${this.apiUrl}/upload/patient-avatar`,
      formData
    );
  }

  uploadPractitionerAvatar(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('email', email);
    console.log('Form Data: ', formData);

    return this.http.post<any>(
      `${this.apiUrl}/upload/practitioner-avatar`,
      formData
    );
  }

  uploadAdminAvatar(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('email', email);
    console.log('Form Data: ', formData);

    return this.http.post<any>(`${this.apiUrl}/upload/admin-avatar`, formData);
  }
}
