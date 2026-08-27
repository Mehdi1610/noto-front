import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierNodeComponent } from './dossier-node';

describe('DossierNode', () => {
  let component: DossierNodeComponent;
  let fixture: ComponentFixture<DossierNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierNodeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
