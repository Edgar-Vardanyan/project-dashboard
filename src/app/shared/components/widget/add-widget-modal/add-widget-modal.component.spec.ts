import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWidgetModalComponent } from './add-widget-modal.component';

describe('AddWidgetModalComponent', () => {
  let component: AddWidgetModalComponent;
  let fixture: ComponentFixture<AddWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWidgetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
