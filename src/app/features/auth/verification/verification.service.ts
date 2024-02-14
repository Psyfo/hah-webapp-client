import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  route = inject(ActivatedRoute);
  http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  verifyToken(token: string) {
    return this.http.get<any>(`${this.apiUrl}/auth/verify/${token}`).pipe(
      tap(
        (response: any) => {
          console.log('Response: ', response);
        },
        (error: any) => {
          console.log('Error: ', error);
        }
      )
    );
  }
}
