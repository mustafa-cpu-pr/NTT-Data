import { Component } from '@angular/core';

@Component({
  selector: 'app-chart-refresh',
  standalone: true,
  imports: [],
  templateUrl: './chart-refresh.component.html',
  styleUrl: './chart-refresh.component.css'
})
export class ChartRefreshComponent {
  constructor() {}

  refreshPage() {
    // Refresh the page when button is clicked
    window.location.reload();
  }

}
