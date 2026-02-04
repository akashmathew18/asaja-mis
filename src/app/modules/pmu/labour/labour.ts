import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-labour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labour.html'
})
export class PmuLabour implements OnInit {

  firmCode!: string;

  basisOptions = ['COT', 'Daily'];
  paidOptions = ['Yes', 'No'];

  form: any = {
    work_date: '',
    team_name: '',
    basis: 'COT',

    cot_count: null,
    rate_per_cot: null,

    labour_count: null,
    rate_per_labour: null,

    // paid: 'No',
    remarks: ''
  };

  totalAmount = 0;
  list: any[] = [];

  teams: any[] = [];


  isEditingPrefill = false;


  saving = false;
  successMsg = false;

  editMode = false;
  editId: number | null = null;
  lastAction: 'create' | 'update' = 'create';

  constructor(
    private route: ActivatedRoute,
    private backend: Pmu,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  // ---------------- INIT ----------------
  ngOnInit(): void {
    // ✅ firmCode lives on PARENT route
    this.firmCode = this.route.parent?.snapshot.paramMap.get('firmCode')!;

    if (!this.firmCode) {
      console.error('❌ firmCode missing in wood-expense');
      return;
    }
    this.loadTeams();
    this.loadList();
  }

  loadTeams() {
    this.backend.getPmuTeams(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.teams = res.data;
        this.cdr.markForCheck();
      }
    });
  }


  /* ---------------- BASIS CHANGE ---------------- */
  onBasisChange() {
    if (this.form.basis === 'COT') {
      this.form.labour_count = null;
      this.form.rate_per_labour = null;
    } else {
      this.form.cot_count = null;
      this.form.rate_per_cot = null;
    }
    this.totalAmount = 0;
  }


  // -------- TOTAL CALC --------
  calculateTotal() {

    if (this.form.basis === 'COT') {
      const c = Number(this.form.cot_count) || 0;
      const r = Number(this.form.rate_per_cot) || 0;
      this.totalAmount = c * r;
      this.totalAmount = Number(this.totalAmount.toFixed(2));
    }

    if (this.form.basis === 'Daily') {
      const d = Number(this.form.labour_count) || 0;
      const r = Number(this.form.rate_per_labour) || 0;
      this.totalAmount = d * r;
      this.totalAmount = Number(this.totalAmount.toFixed(2));
    }
  }

  // -------- SAVE --------
  save(formRef: NgForm) {

    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      created_by: this.auth.getUserid
        (),
      work_date: this.form.work_date,
      team_name: this.form.team_name,
      basis: this.form.basis,

      cot_count: this.form.basis === 'COT' ? this.form.cot_count : null,
      rate_per_cot: this.form.basis === 'COT' ? this.form.rate_per_cot : null,

      labour_count: this.form.basis === 'Daily' ? this.form.labour_count : null,
      rate_per_labour: this.form.basis === 'Daily' ? this.form.rate_per_labour : null,

      total_amount: this.totalAmount,
      paid: this.form.paid,
      remarks: this.form.remarks
    };

    // ---------- UPDATE ----------
    if (this.editMode && this.editId) {

      this.lastAction = 'update';

      this.backend.updatePmuLabour({
        id: this.editId,
        ...payload
      }).subscribe({
        next: (res: any) => {
          if (!res.success) {
            alert(res.message || 'Update failed');
            this.saving = false;
            return;
          }
          this.afterSuccess(formRef);
        },
        error: () => {
          alert('Server error');
          this.saving = false;
        }
      });

    }
    else {

      this.lastAction = 'create';

      this.backend.addPmuLabour(payload).subscribe({
        next: (res: any) => {

          if (!res.success) {
            alert(res.message || 'Save failed');
            this.saving = false;
            return;
          }

          this.afterSuccess(formRef);

        },
        error: () => {
          alert('Server error');
          this.saving = false;
        }
      });
    }
  }


  afterSuccess(formRef: NgForm) {

    this.loadList();
    this.resetForm();
    formRef.resetForm();

    this.successMsg = true;

    setTimeout(() => {
      this.successMsg = false;
      this.editMode = false;
      this.editId = null;
      this.lastAction = 'create';
    }, 2000);
    this.saving = false;
  }

  // -------- LIST --------
  loadList() {
    this.backend.getPmuLabourList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  // -------- RESET --------
  resetForm() {
    this.form = {
      work_date: '',
      team_name: '',
      basis: 'COT',
      cot_count: null,
      rate_per_cot: null,
      labour_count: null,
      rate_per_labour: null,
      paid: 'No',
      remarks: ''
    };

    this.totalAmount = 0;
    this.editMode = false;
    this.editId = null;
    this.lastAction = 'create';
  }


  editRow(row: any) {
    this.isEditingPrefill = true; // ✅ IMPORTANT

    this.form = {
      work_date: row.work_date,
      team_name: row.team_name,
      basis: row.basis,
      cot_count: row.cot_count,
      rate_per_cot: row.rate_per_cot,
      labour_count: row.labour_count,
      rate_per_labour: row.rate_per_labour,
      paid: row.paid,
      remarks: row.remarks
    };

    this.totalAmount = row.total_amount;
    this.editMode = true;
    this.editId = row.id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // ---------------- DELETE ----------------
  deleteRow(id: number) {
    if (!confirm('Delete this record?')) return;

    this.backend.deletePmuLabour({
      id: id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }
}