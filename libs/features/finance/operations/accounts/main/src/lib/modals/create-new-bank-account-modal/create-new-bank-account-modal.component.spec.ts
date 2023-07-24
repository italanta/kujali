import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewBankAccountModalComponent } from './create-new-bank-account-modal.component';

describe('CreateNewBankAccountModalComponent', () => {
  let component: CreateNewBankAccountModalComponent;
  let fixture: ComponentFixture<CreateNewBankAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewBankAccountModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewBankAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
