import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard.page';

describe('DashboardComponent', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage],
    });
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
