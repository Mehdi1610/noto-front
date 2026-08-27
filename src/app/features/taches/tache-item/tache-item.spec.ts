import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheItem } from './tache-item';

describe('TacheItem', () => {
  let component: TacheItem;
  let fixture: ComponentFixture<TacheItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TacheItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
