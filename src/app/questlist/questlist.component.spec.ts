import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestlistComponent } from './questlist.component';

describe('QuestlistComponent', () => {
  let component: QuestlistComponent;
  let fixture: ComponentFixture<QuestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
