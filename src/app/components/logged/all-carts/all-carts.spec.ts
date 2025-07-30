import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCarts } from './all-carts';

describe('AllCarts', () => {
  let component: AllCarts;
  let fixture: ComponentFixture<AllCarts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCarts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCarts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
