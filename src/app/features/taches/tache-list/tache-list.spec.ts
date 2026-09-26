import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheList } from './tache-list';

describe('TacheList', () => {
  let component: TacheList;
  let fixture: ComponentFixture<TacheList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheList],
    }).compileComponents();

    fixture = TestBed.createComponent(TacheList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
