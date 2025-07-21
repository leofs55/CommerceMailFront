import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDiscounted } from './product-discounted';

describe('ProductDiscounted', () => {
  let component: ProductDiscounted;
  let fixture: ComponentFixture<ProductDiscounted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDiscounted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDiscounted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
