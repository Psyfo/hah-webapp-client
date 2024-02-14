import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // configure app-wide providers here

  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideNoopAnimations(),
    MessageService,
    importProvidersFrom([CommonModule, ToastModule, BrowserAnimationsModule]),
  ],
};
