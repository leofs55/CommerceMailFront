import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToPayment } from './redirect-to-payment';

describe('RedirectToPayment', () => {
  let component: RedirectToPayment;
  let fixture: ComponentFixture<RedirectToPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectToPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
