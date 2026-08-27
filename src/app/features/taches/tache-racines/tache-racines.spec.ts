import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheRacines } from './tache-racines';

describe('TacheRacines', () => {
  let component: TacheRacines;
  let fixture: ComponentFixture<TacheRacines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheRacines],
    }).compileComponents();

    fixture = TestBed.createComponent(TacheRacines);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
