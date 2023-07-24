import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAccountPageComponent } from './single-account-page.component';

describe('SingleAccountPageComponent', () => {
  let component: SingleAccountPageComponent;
  let fixture: ComponentFixture<SingleAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleAccountPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
