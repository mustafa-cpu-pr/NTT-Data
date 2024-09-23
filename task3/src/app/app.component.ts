import { Component } from '@angular/core';
import { ChartFormComponent } from './chart-form/chart-form.component'; // Update this path
import { ChartViewComponent } from './chart-view/chart-view.component';
import { ChartRefreshComponent } from "./chart-refresh/chart-refresh.component"; // Update this path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChartFormComponent, ChartViewComponent, ChartRefreshComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'highcharts-app';
}
