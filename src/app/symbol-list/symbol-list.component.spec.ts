import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolListComponent } from './symbol-list.component';

describe('SymbolListComponent', () => {
  let component: SymbolListComponent;
  let fixture: ComponentFixture<SymbolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
