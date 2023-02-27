import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectmoneyComponent } from './collectmoney.component';

describe('CollectmoneyComponent', () => {
  let component: CollectmoneyComponent;
  let fixture: ComponentFixture<CollectmoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectmoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectmoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
