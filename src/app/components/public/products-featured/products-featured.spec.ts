import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFeatured } from './products-featured';

describe('ProductsFeatured', () => {
  let component: ProductsFeatured;
  let fixture: ComponentFixture<ProductsFeatured>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFeatured]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsFeatured);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
