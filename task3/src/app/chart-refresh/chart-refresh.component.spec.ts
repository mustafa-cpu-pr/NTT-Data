import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRefreshComponent } from './chart-refresh.component';

describe('ChartRefreshComponent', () => {
  let component: ChartRefreshComponent;
  let fixture: ComponentFixture<ChartRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartRefreshComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
