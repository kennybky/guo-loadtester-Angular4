import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingProjectComponent } from './existing-projects.component';

describe('ExistingProjectComponent', () => {
  let component: ExistingProjectComponent;
  let fixture: ComponentFixture<ExistingProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
