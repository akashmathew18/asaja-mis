import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-wood-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wood-expense.html'
})
export class PmuWood implements OnInit {

  firmCode!: string;

  form: any = {
    expense_date: '',
    wood_type: '',
    cubic: null,
    rate_per_cubic: null,
    cutting_expense: null,
    planing_expense: null,
    transportation_expense: null,
    team_name: '',
    remarks: ''
  };

  totalExpense = 0;
  list: any[] = [];

  teams: any[] = [];

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


  // ---------------- TOTAL CALCULATION ----------------
  calculateTotal() {
    const cubic = Number(this.form.cubic) || 0;
    const rate = Number(this.form.rate_per_cubic) || 0;
    const cut = Number(this.form.cutting_expense) || 0;
    const plan = Number(this.form.planing_expense) || 0;
    const trans = Number(this.form.transportation_expense) || 0;

    this.totalExpense = (cubic * rate) + cut + plan + trans;
    this.totalExpense = parseFloat(this.totalExpense.toFixed(2));
  }

  // ---------------- SAVE / UPDATE ----------------
  save(formRef: NgForm) {
    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      created_by: this.auth.getUser().userid,
      total_expense: this.totalExpense,
      ...this.form
    };

    // ---------- UPDATE ----------
    if (this.editMode && this.editId) {

      this.lastAction = 'update';

      this.backend.updatePmuWood({
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
    // ---------- ADD ----------
    else {

      this.lastAction = 'create';

      this.backend.addPmuWood(payload).subscribe({
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

  // ---------------- AFTER SUCCESS ----------------
  afterSuccess(formRef: NgForm) {

    this.loadList();
    this.resetForm();
    formRef.resetForm();

    this.successMsg = true;

    setTimeout(() => {
      this.successMsg = false;
      this.editMode = false;
      this.editId = null;
    }, 2000);

    this.saving = false;
  }

  // ---------------- LOAD LIST ----------------
  loadList() {
    this.backend.getPmuWoodList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();

      }
    });
  }

  // ---------------- RESET ----------------
  resetForm() {
    this.form = {
      expense_date: '',
      wood_type: '',
      cubic: null,
      rate_per_cubic: null,
      cutting_expense: null,
      planing_expense: null,
      transportation_expense: null,
      team_name: '',
      remarks: ''
    };
    this.totalExpense = 0;
  }

  // ---------------- EDIT ----------------
  editRow(row: any) {
    this.form = {
      expense_date: row.expense_date,
      wood_type: row.wood_type,
      cubic: row.cubic,
      rate_per_cubic: row.rate_per_cubic,
      cutting_expense: row.cutting_expense,
      planing_expense: row.planing_expense,
      transportation_expense: row.transportation_expense,
      team_name: row.team_name,
      remarks: row.remarks
    };

    this.totalExpense = row.total_expense;
    this.editMode = true;
    this.editId = row.id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------- DELETE ----------------
  deleteRow(id: number) {
    if (!confirm('Delete this record?')) return;

    this.backend.deletePmuWood({
      id: id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }

}
