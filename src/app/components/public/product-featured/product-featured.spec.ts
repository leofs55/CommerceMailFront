import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFeatured } from './product-featured';

describe('ProductFeatured', () => {
  let component: ProductFeatured;
  let fixture: ComponentFixture<ProductFeatured>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFeatured]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFeatured);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
