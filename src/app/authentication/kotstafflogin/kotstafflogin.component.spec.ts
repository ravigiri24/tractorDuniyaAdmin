import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KotstaffloginComponent } from './kotstafflogin.component';

describe('KotstaffloginComponent', () => {
  let component: KotstaffloginComponent;
  let fixture: ComponentFixture<KotstaffloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotstaffloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KotstaffloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
