import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

interface TableColumn {
  column: string;
  dataKey: string;
  colspan?: number;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [FormsModule, MatTableModule, CommonModule],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  rows: number = 0;
  columns: number = 0;
  tableData: MatTableDataSource<any> = new MatTableDataSource<any>();
  tableColumns: TableColumn[] = [];
  displayedColumns: string[] = [];
  groupBy: string = '';
  columnSpan: number = 1;
  rowSpan: number = 1;
  jsonDataInput: string = ''; // Input field for JSON data

  constructor(private http: HttpClient) {}

  // Method to handle file input and parse Excel file
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as any[][];
      this.parseExcelData(json);
    };
    reader.readAsArrayBuffer(file);
  }

  // Method to parse Excel data and update table
  parseExcelData(data: any[][]) {
    if (data.length === 0) return;

    this.rows = data.length - 1; // Exclude header row
    this.columns = data[0].length;

    const headers = data[0];
    this.tableColumns = headers.map((header: string, index: number) => ({
      column: header,
      dataKey: `col${index}`
    }));
    this.displayedColumns = this.tableColumns.map(col => col.dataKey);

    const rows = data.slice(1).map(row => {
      const rowData: any = {};
      row.forEach((cell: any, index: number) => {
        rowData[`col${index}`] = cell;
      });
      return rowData;
    });

    this.tableData.data = rows;
  }

  // Method to generate the table based on rows and columns input
  generateTable() {
    if (this.rows <= 0 || this.columns <= 0) return;

    this.tableColumns = [];
    this.tableData.data = []; // Clear existing data
    this.displayedColumns = [];

    for (let i = 0; i < this.columns; i++) {
      const columnName = `Column ${i + 1}`;
      const dataKey = `col${i}`;
      this.tableColumns.push({ column: columnName, dataKey: dataKey });
      this.displayedColumns.push(dataKey);
    }

    for (let i = 0; i < this.rows; i++) {
      const row: any = {};
      for (let j = 0; j < this.columns; j++) {
        row[`col${j}`] = `Row ${i + 1} Col ${j + 1}`; // Sample data
      }
      this.tableData.data.push(row);
    }
  }

  // Method to fetch JSON data from the server and render it in the table
  generateJsonData() {
    this.http.get<any[]>('http://localhost:4500/api/users').subscribe(data => {
      this.parseJsonData(data);
    });
  }

  // Method to parse JSON data and update the table
  parseJsonData(data: any[]) {
    this.tableData.data = []; // Clear existing data
    this.tableColumns = [];
    this.displayedColumns = [];

    if (data.length === 0) return;

    this.tableColumns = Object.keys(data[0]).map((key: string, index: number) => ({
      column: key,
      dataKey: `col${index}`
    }));

    this.displayedColumns = this.tableColumns.map(col => col.dataKey);

    const rows = data.map((row: any) => {
      const rowData: any = {};
      Object.keys(row).forEach((key, index) => {
        rowData[`col${index}`] = row[key];
      });
      return rowData;
    });

    this.tableData.data = rows; // Update with new rows
  }

  // Method to handle form submission and send data to the backend
  submitData() {
    const jsonData = this.tableData.data.map(row => {
      const data: any = {};
      this.displayedColumns.forEach(column => {
        data[column] = row[column];
      });
      return data;
    });

    this.http.post('http://localhost:4500/api/generate', jsonData).subscribe(response => {
      console.log('Data submitted to backend:', response);
    }, error => {
      console.error('Error submitting data:', error);
    });
  }

  // Method to send input JSON data to the server
  sendJsonData() {
    const jsonData = JSON.parse(this.jsonDataInput);
    this.http.post('http://localhost:4500/api/generate', jsonData).subscribe(response => {
      console.log('JSON data submitted:', response);
      this.parseJsonData(response as any[]); // Update the table with the new data
    }, error => {
      console.error('Error submitting JSON data:', error);
    });
  }
}
