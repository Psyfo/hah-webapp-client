import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerAppointmentsComponent } from './practitioner-appointments.component';

describe('PractitionerAppointmentsComponent', () => {
  let component: PractitionerAppointmentsComponent;
  let fixture: ComponentFixture<PractitionerAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PractitionerAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PractitionerAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
