import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPayment } from './start-payment';

describe('StartPayment', () => {
  let component: StartPayment;
  let fixture: ComponentFixture<StartPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
