import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ChartFormComponent } from '../chart-form/chart-form.component'; 

@Component({
  selector: 'app-chart-view',
  standalone: true,
  imports: [], 
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class ChartViewComponent implements OnInit, OnDestroy {
  Highcharts: any = (window as any)['Highcharts']; // Access Highcharts from window object
  chartOptions: any = {}; // Type for chart options is 'any'
  private refreshSubscription!: Subscription; // Use ! to assert that it will be initialized

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchChartConfig();

    // Subscribe to the refresh event from ChartFormComponent
    this.refreshSubscription = ChartFormComponent.refreshChart.subscribe(() => {
      this.fetchChartConfig();
    });
  }

  ngOnDestroy() {
    // Clean up subscription to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchChartConfig() {
    this.http.get('http://localhost:3000/api/chart-config')
      .subscribe({
        next: (config: any) => {
          this.initializeChart(config);
        },
        error: (err) => {
          console.error('Error fetching chart configuration:', err);
        }
      });
  }

  initializeChart(config: any) {
    // Update chartOptions and render the chart
    this.chartOptions = {
      chart: {
        type: 'packedbubble'
      },
      series: config.series,
      colors: config.colors,
      tooltip: config.tooltip,
      dataLabels: config.dataLabels
    };
    
    // Check if Highcharts is available and render the chart
    if (this.Highcharts) {
      this.Highcharts.chart('container', this.chartOptions);
    } else {
      console.error('Highcharts is not available.');
    }
  }
}
