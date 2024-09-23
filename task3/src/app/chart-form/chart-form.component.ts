import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chart-form',
  templateUrl: './chart-form.component.html',
  styleUrls: ['./chart-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class ChartFormComponent {
  chartForm: FormGroup;
  static refreshChart = new EventEmitter<void>();

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.chartForm = this.fb.group({
      dataPoints: [''], // Coordinates and values for hexagonal heatmap
      colorScheme: [''], // Define color scheme for heatmap
      tooltip: [''], // Tooltip information for hover
      dataLabels: [''] // Data labels for the chart
    });
  }

  saveConfig() {
    const config = {
      dataPoints: JSON.parse(this.chartForm.value.dataPoints),
      colorScheme: JSON.parse(this.chartForm.value.colorScheme),
      tooltip: JSON.parse(this.chartForm.value.tooltip),
      dataLabels: JSON.parse(this.chartForm.value.dataLabels) // Include dataLabels in the config
    };

    this.http.post('http://localhost:2000/api/chart-config', config)
      .subscribe({
        next: (response) => {
          console.log('Config saved:', response);
          ChartFormComponent.refreshChart.emit();
        },
        error: (err) => console.error('Error saving config:', err)
      });
  }
}
