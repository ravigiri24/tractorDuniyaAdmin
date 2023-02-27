import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailycollectionComponent } from './dailycollection.component';

describe('DailycollectionComponent', () => {
  let component: DailycollectionComponent;
  let fixture: ComponentFixture<DailycollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailycollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailycollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
