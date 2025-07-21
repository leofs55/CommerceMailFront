import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsFeedbacks } from './clients-feedbacks';

describe('ClientsFeedbacks', () => {
  let component: ClientsFeedbacks;
  let fixture: ComponentFixture<ClientsFeedbacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsFeedbacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsFeedbacks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
