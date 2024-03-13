import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IPatient } from "app/core/models/patient.interface";
import { environment } from "environments/environment";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  http = inject(HttpClient);

  register(email: string, password: string) {
    console.log(this.apiUrl);

    return this.http
      .post(`${this.apiUrl}/patients`, { email, password }, this.httpOptions)
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  registerPractitioner(email: string, password: string) {
    console.log(this.apiUrl);

    return this.http
      .post(
        `${this.apiUrl}/practitioners`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  patientEmailExists(email: string) {
    return this.http.get(`${this.apiUrl}/patients/exists/${email}`).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  practitionerEmailExists(email: string) {
    return this.http.get(`${this.apiUrl}/practitioners/exists/${email}`).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }
}
