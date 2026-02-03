import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-other-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './other-expenses.html'
})
export class PmuOtherExpense implements OnInit {

  firmCode!: string;

  form: any = this.defaultForm();
  list: any[] = [];

  expenseTitles: any[] = [];

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



  ngOnInit(): void {
    this.firmCode = this.route.parent?.snapshot.paramMap.get('firmCode')!;
    this.loadExpenseTitles();
    this.loadList();
  }

  loadExpenseTitles() {
    this.backend.getExpenseTitleList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.expenseTitles = res.data;
      }
    });
  }


  defaultForm() {
    return {
      expense_date: '',
      expense_title_code: '',
      expense_title: '',
      amount: null,
      remarks: ''
    };
  }

  save(formRef: NgForm) {
    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      created_by: this.auth.getUserid(),
      ...this.form
    };

    if (this.editMode && this.editId) {
      this.lastAction = 'update';
      this.backend.updatePmuOtherExpense({
        id: this.editId,
        ...payload
      }).subscribe(() => this.afterSuccess(formRef));
    } else {
      this.lastAction = 'create';
      this.backend.addPmuOtherExpense(payload)
        .subscribe(() => this.afterSuccess(formRef));
    }
  }

  afterSuccess(formRef: NgForm) {
    this.loadList();
    this.form = this.defaultForm();
    formRef.resetForm(this.form);

    this.successMsg = true;
    this.saving = false;
    this.editMode = false;
    this.editId = null;

    setTimeout(() => (this.successMsg = false), 2000);
  }

  loadList() {
    this.backend.getPmuOtherExpenseList(this.firmCode)
      .subscribe((res: any) => {
        if (res.success) {
          this.list = res.data;
          this.cdr.markForCheck();
        }
      });
  }

  editRow(row: any) {
    this.form = {
      expense_date: row.expense_date,
      expense_title: row.expense_title,
      amount: row.amount,
      remarks: row.remarks
    };

    this.editMode = true;
    this.editId = row.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteRow(id: number) {
    if (!confirm('Delete this expense?')) return;

    this.backend.deletePmuOtherExpense({
      id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }
}
