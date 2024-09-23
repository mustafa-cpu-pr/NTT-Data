import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-form',
  templateUrl: './chart-form.component.html',
  styleUrls: ['./chart-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule] 
})
export class ChartFormComponent {
  chartForm: FormGroup;
  // Static EventEmitter to trigger chart refresh
  static refreshChart = new EventEmitter<void>();

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Initialize the form with FormBuilder
    this.chartForm = this.fb.group({
      series: [''],
      colors: [''],
      tooltip: [''],
      dataLabels: ['']
    });
  }

  saveConfig() {
    // Convert form values to appropriate types and structure
    const config = {
      series: JSON.parse(this.chartForm.value.series),
      colors: JSON.parse(this.chartForm.value.colors),
      tooltip: JSON.parse(this.chartForm.value.tooltip),
      dataLabels: JSON.parse(this.chartForm.value.dataLabels)
    };

    // POST the configuration to the backend
    this.http.post('http://localhost:3000/api/chart-config', config)
      .subscribe({
        next: (response) => {
          console.log('Config saved:', response);
          // Notify the ChartViewComponent to refresh the chart
          ChartFormComponent.refreshChart.emit();
        },
        error: (err) => console.error('Error saving config:', err)
      });
  }
  
}
