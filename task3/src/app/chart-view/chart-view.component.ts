import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ChartFormComponent } from '../chart-form/chart-form.component'; 

declare var Highcharts: any;

@Component({
  selector: 'app-chart-view',
  standalone: true,
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class ChartViewComponent implements OnInit, OnDestroy {
  Highcharts: any = (window as any)['Highcharts'];
  chartOptions: any = {};
  private refreshSubscription!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchChartConfig();

    this.refreshSubscription = ChartFormComponent.refreshChart.subscribe(() => {
      this.fetchChartConfig();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchChartConfig() {
    this.http.get('http://localhost:2000/api/chart-config')
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
    this.chartOptions = {
      chart: {
        type: 'hexbin', // Use heatmap for hexagonal heatmaps
        plotBackgroundColor: null,
        plotBorderWidth: 1
      },
      title: {
        text: 'Hexbin Honeycomb Heatmap'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: null,
        reversed: true
      },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
      },
      tooltip: {
        pointFormat: '{point.x} x {point.y}: <b>{point.value}</b>'
      },
      series: [{
        name: 'Data',
        data: config.dataPoints, // Coordinates and values
        type: 'heatmap',
        color: config.colorScheme // Color scheme for heatmap
      }]
    };

    if (this.Highcharts) {
      this.Highcharts.chart('container', this.chartOptions);
    } else {
      console.error('Highcharts is not available.');
    }
  }
}
