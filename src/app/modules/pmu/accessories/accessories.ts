import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessories.html'
})
export class PmuAccessories implements OnInit {

  firmCode!: string;

  form: any = {
    purchase_date: '',
    accessory_name: '',
    amount: null,
    transportation: null,
    other_expense: null,
    paid: 'No',
    remarks: ''
  };

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
      console.error('firmCode missing in accessories module');
      return;
    }

    this.loadList();
  }

  // ---------------- TOTAL ----------------
  calculateTotal() {
    const amt = Number(this.form.amount) || 0;
    const trans = Number(this.form.transportation) || 0;
    const other = Number(this.form.other_expense) || 0;

    this.totalExpense = amt + trans + other;
    this.cdr.markForCheck();
  }

  // ---------------- SAVE / UPDATE ----------------
  save(formRef: NgForm) {
    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      created_by: this.auth.getUserid
(),
      total_expense: this.totalExpense,
      ...this.form
    };

    // UPDATE
    if (this.editMode && this.editId) {

      this.backend.updatePmuAccessories({
        id: this.editId,
        ...payload
      }).subscribe({
        next: () => this.afterSuccess(formRef, 'update'),
        error: () => {
          alert('Server error');
          this.saving = false;
        }
      });

    }
    // ADD
    else {

      this.backend.addPmuAccessories(payload).subscribe({
        next: () => this.afterSuccess(formRef, 'create'),
        error: () => {
          alert('Server error');
          this.saving = false;
        }
      });

    }
  }

  // ---------------- AFTER SUCCESS ----------------
  afterSuccess(formRef: NgForm, type: 'create' | 'update') {
    this.lastAction = type;

    this.loadList();
    this.resetForm();
    formRef.resetForm();

    this.editMode = false;
    this.editId = null;

    this.successMsg = true;
    setTimeout(() => this.successMsg = false, 2000);

    this.saving = false;
  }

  // ---------------- LOAD LIST ----------------
  loadList() {
    this.backend.getPmuAccessoriesList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  // ---------------- EDIT ----------------
  editRow(row: any) {
    this.form = {
      purchase_date: row.purchase_date,
      accessory_name: row.accessory_name,
      amount: row.amount,
      transportation: row.transportation,
      other_expense: row.other_expense,
      paid: row.paid,
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

    this.backend.deletePmuAccessories({
      id: id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }

  // ---------------- RESET ----------------
  resetForm() {
    this.form = {
      purchase_date: '',
      accessory_name: '',
      amount: null,
      transportation: null,
      other_expense: null,
      paid: 'No',
      remarks: ''
    };
    this.totalExpense = 0;
  }
}
