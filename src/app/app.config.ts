import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { routes } from './app.routes';

import {
  BrowserAnimationsModule,
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  // configure app-wide providers here

  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideNoopAnimations(),
    MessageService,
    DialogService,
    ConfirmationService,
    importProvidersFrom([
      CommonModule,
      ToastModule,
      BrowserAnimationsModule,
      DialogModule,
    ]),
  ],
};
