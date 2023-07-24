import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsBudgetsPageComponent } from './operations-budgets-page.component';

describe('OperationsBudgetsPageComponent', () => {
  let component: OperationsBudgetsPageComponent;
  let fixture: ComponentFixture<OperationsBudgetsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsBudgetsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsBudgetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
