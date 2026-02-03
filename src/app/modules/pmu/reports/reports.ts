import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BackendconnectionService } from '../../../core/services/backendconnection';
import { CommonModule } from '@angular/common';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class PmuReports implements OnInit {

  firmCode!: string;

  general: any[] = [];
  wood: any[] = [];
  plywood: any[] = [];
  accessories: any[] = [];
  labour: any[] = [];
  team: any[] = [];
  assets: any[] = [];
  other: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private backend: Pmu,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.firmCode = this.route.parent?.snapshot.paramMap.get('firmCode')!;
    this.loadAll();
  }

  loadAll() {
    this.backend.post('reports/general.php', this.firmCode).subscribe((r: any) => this.general = r.data);
    this.backend.post('reports/wood.php', this.firmCode).subscribe((r: any) => this.wood = r.data);
    this.backend.post('reports/plywood.php', this.firmCode).subscribe((r: any) => this.plywood = r.data);
    this.backend.post('reports/accessories.php', this.firmCode).subscribe((r: any) => this.accessories = r.data);
    this.backend.post('reports/labour.php', this.firmCode).subscribe((r: any) => this.labour = r.data);
    this.backend.post('reports/team.php', this.firmCode).subscribe((r: any) => this.team = r.data);
    this.backend.post('reports/assets.php', this.firmCode).subscribe((r: any) => this.assets = r.data);
    this.backend.post('reports/other-expense.php', this.firmCode).subscribe((r: any) => this.other = r.data);
    this.cdr.markForCheck();

  }

  exportExcel(name: string, data: any[]) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, `${name}.xlsx`);
  }

  exportPdf(name: string, data: any[]) {
    const doc = new jsPDF();
    autoTable(doc, { head: [Object.keys(data[0] || {})], body: data.map(o => Object.values(o)) });
    doc.save(`${name}.pdf`);
  }
}
