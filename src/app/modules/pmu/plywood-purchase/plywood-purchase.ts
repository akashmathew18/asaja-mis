import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-plywood-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plywood-purchase.html'
})
export class PmuPlywood implements OnInit {

  firmCode!: string;

  form: any = {
    purchase_date: '',
    square_feet: null,
    rate_per_sqft: null,
    transportation: 0,
    paid: 'No',
    remarks: ''
  };

  sqftAmount = 0;
  totalExpense = 0;

  list: any[] = [];

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
      console.error('❌ firmCode missing in plywood-purchase');
      return;
    }

    this.loadList();
  }

  // ---------------- TOTAL CALCULATION ----------------
  calculateTotal() {
    const sqft = Number(this.form.square_feet) || 0;
    const rate = Number(this.form.rate_per_sqft) || 0;
    const transport = Number(this.form.transportation) || 0;

    this.sqftAmount = sqft * rate;
    this.totalExpense = this.sqftAmount + transport;
    this.totalExpense = Number(this.totalExpense.toFixed(2));
  }

  // ---------------- SAVE / UPDATE ----------------
  save(formRef: NgForm) {
    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      purchase_date: this.form.purchase_date,
      square_feet: this.form.square_feet,
      rate_per_sqft: this.form.rate_per_sqft,
      sqft_amount: this.sqftAmount,
      transportation: this.form.transportation,
      paid: this.form.paid,
      total_expense: this.totalExpense,
      created_by: this.auth.getUserid
(),
      remarks: this.form.remarks
    };

    // ---------- UPDATE ----------
    if (this.editMode && this.editId) {

      this.lastAction = 'update';

      this.backend.updatePmuPlywood({
        id: this.editId,
        ...payload
      }).subscribe({
        next: () => this.afterSuccess(formRef),
        error: () => {
          alert('Server error');
          this.saving = false;
        }
      });

    }
    // ---------- ADD ----------
    else {

      this.lastAction = 'create';

      this.backend.addPmuPlywood(payload).subscribe({
        next: () => this.afterSuccess(formRef),
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
    this.backend.getPmuPlywoodList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();

      }
    });
  }

  // ---------------- RESET ----------------
  resetForm() {
    this.form = {
      purchase_date: '',
      square_feet: null,
      rate_per_sqft: null,
      transportation: 0,
      paid: 'No',
      remarks: ''
    };
    this.sqftAmount = 0;
    this.totalExpense = 0;
  }

  // ---------------- EDIT ----------------
  editRow(row: any) {

    this.form = {
      purchase_date: row.purchase_date,
      square_feet: row.square_feet,
      rate_per_sqft: row.rate_per_sqft,
      transportation: row.transportation,
      paid: row.paid,
      remarks: row.remarks
    };

    this.sqftAmount = row.sqft_amount;
    this.totalExpense = row.total_expense;

    this.editMode = true;
    this.editId = row.id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------- DELETE ----------------
  deleteRow(id: number) {
    if (!confirm('Delete this record?')) return;

    this.backend.deletePmuPlywood({
      id: id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }

}
