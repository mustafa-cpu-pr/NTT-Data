import { Component } from '@angular/core';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicTableComponent, HttpClientModule], // Include HttpClientModule here
  template: '<app-dynamic-table></app-dynamic-table>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
