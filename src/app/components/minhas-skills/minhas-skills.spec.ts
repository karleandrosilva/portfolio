import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasSkills } from './minhas-skills';

describe('MinhasSkills', () => {
  let component: MinhasSkills;
  let fixture: ComponentFixture<MinhasSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
