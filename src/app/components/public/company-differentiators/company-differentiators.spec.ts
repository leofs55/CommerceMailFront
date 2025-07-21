import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDifferentiators } from './company-differentiators';

describe('CompanyDifferentiators', () => {
  let component: CompanyDifferentiators;
  let fixture: ComponentFixture<CompanyDifferentiators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDifferentiators]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDifferentiators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
