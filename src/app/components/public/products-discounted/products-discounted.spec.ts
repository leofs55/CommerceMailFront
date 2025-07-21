import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDiscounted } from './products-discounted';

describe('ProductsDiscounted', () => {
  let component: ProductsDiscounted;
  let fixture: ComponentFixture<ProductsDiscounted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDiscounted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsDiscounted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
