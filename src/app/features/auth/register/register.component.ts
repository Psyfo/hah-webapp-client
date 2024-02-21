import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { routerTransitionSlideUp } from "app/core/utilities/animations";
import { customEmailValidator } from "app/core/validators/email.validator";
import { customPasswordValidator } from "app/core/validators/password.validator";
import { IPatient, IPatientEmailExists } from "app/models/patient.interface";
import { HahButtonComponent } from "app/shared/components/hah-button/hah-button.component";
import { HahTextInputComponent } from "app/shared/components/hah-text-input/hah-text-input.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { RegisterService } from "./register.service";

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HahButtonComponent,
    HahTextInputComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessagesModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [routerTransitionSlideUp],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  registerService = inject(RegisterService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);

  registerForm!: FormGroup;

  isFormSubmitted = false;
  passwordSymbols = '(!"#\$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)';
  patientEmailExists = false;
  messages: any[] = [];
  ref: DynamicDialogRef | undefined;
  // All countries
  // length 252
  countries = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Åland Islands', code: 'AX' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua & Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Caribbean Netherlands', code: 'BQ' },
    { name: 'Bosnia & Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Bouvet Island', code: 'BV' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Indian Ocean Territory', code: 'IO' },
    { name: 'Brunei', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cape Verde', code: 'CV' },
    { name: 'Cayman Islands', code: 'KY' },
    { name: 'Central African Republic', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Christmas Island', code: 'CX' },
    { name: 'Cocos (Keeling) Islands', code: 'CC' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros', code: 'KM' },
    { name: 'Congo - Brazzaville', code: 'CG' },
    { name: 'Congo - Kinshasa', code: 'CD' },
    { name: 'Cook Islands', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Côte d’Ivoire', code: 'CI' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Curaçao', code: 'CW' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czechia', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Falkland Islands (Islas Malvinas)', code: 'FK' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'French Southern Territories', code: 'TF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Heard & McDonald Islands', code: 'HM' },
    { name: 'Vatican City', code: 'VA' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Isle of Man', code: 'IM' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'North Korea', code: 'KP' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Kosovo', code: 'XK' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Laos', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macao', code: 'MO' },
    { name: 'North Macedonia', code: 'MK' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mayotte', code: 'YT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia', code: 'FM' },
    { name: 'Moldova', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Montserrat', code: 'MS' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar (Burma)', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Curaçao', code: 'AN' },
    { name: 'New Caledonia', code: 'NC' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Niue', code: 'NU' },
    { name: 'Norfolk Island', code: 'NF' },
    { name: 'Northern Mariana Islands', code: 'MP' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Palestine', code: 'PS' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Pitcairn Islands', code: 'PN' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Puerto Rico', code: 'PR' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Réunion', code: 'RE' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russia', code: 'RU' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'St. Barthélemy', code: 'BL' },
    { name: 'St. Helena', code: 'SH' },
    { name: 'St. Kitts & Nevis', code: 'KN' },
    { name: 'St. Lucia', code: 'LC' },
    { name: 'St. Martin', code: 'MF' },
    { name: 'St. Pierre & Miquelon', code: 'PM' },
    { name: 'St. Vincent & Grenadines', code: 'VC' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Marino', code: 'SM' },
    { name: 'São Tomé & Príncipe', code: 'ST' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Serbia', code: 'CS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Sint Maarten', code: 'SX' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Solomon Islands', code: 'SB' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'South Georgia & South Sandwich Islands', code: 'GS' },
    { name: 'South Sudan', code: 'SS' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Suriname', code: 'SR' },
    { name: 'Svalbard & Jan Mayen', code: 'SJ' },
    { name: 'Eswatini', code: 'SZ' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Syria', code: 'SY' },
    { name: 'Taiwan', code: 'TW' },
    { name: 'Tajikistan', code: 'TJ' },
    { name: 'Tanzania', code: 'TZ' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Timor-Leste', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tokelau', code: 'TK' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad & Tobago', code: 'TT' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Turkmenistan', code: 'TM' },
    { name: 'Turks & Caicos Islands', code: 'TC' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'United States', code: 'US' },
    { name: 'U.S. Outlying Islands', code: 'UM' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'British Virgin Islands', code: 'VG' },
    { name: 'U.S. Virgin Islands', code: 'VI' },
    { name: 'Wallis & Futuna', code: 'WF' },
    { name: 'Western Sahara', code: 'EH' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' },
  ];

  //getters for form controls
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, customPasswordValidator()]],
      terms: [false, [Validators.requiredTrue]],
    });
    this.registerForm.valueChanges.subscribe((value: any) => {
      //console.log(value);
    });
  }

  onSubmit() {
    this.isFormSubmitted = true;

    // check if email exists
    if (this.registerForm.invalid) {
      return;
    } else {
      this.registerService.patientEmailExists(this.f['email'].value).subscribe(
        (data: any) => {
          console.log('data', data);

          this.patientEmailExists = data.exists;

          if (this.patientEmailExists) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Patient email exists',
              life: 5000,
              closable: false,
            });

            this.confirmationService.confirm({
              message: 'Patient email exists. Do you want to login instead?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.router.navigate(['/login']);
              },
              reject: () => {
                this.resetEmail();
              },
            });

            return;
          } else {
            this.registerService
              .register(this.f['email'].value, this.f['password'].value)
              .subscribe(
                (data: any) => {
                  console.log('data', data);

                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail:
                      'Patient registered. Please check your email to verify your account.',
                    life: 5000,
                    closable: false,
                  });

                  setTimeout(() => {
                    this.router.navigate(['/get-started']);
                  }, 3000);
                },
                (error) => {
                  console.log('error', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      error.message || 'An error occurred. Please try again.',
                    life: 5000,
                    closable: false,
                  });
                }
              );
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resetEmail() {
    this.f['email'].reset();
    this.patientEmailExists = false;
  }

  showDialog() {}

  closeDialog() {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    console.log('register form', this.registerForm);
  }
}
