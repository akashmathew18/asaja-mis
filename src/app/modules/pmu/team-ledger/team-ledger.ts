import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-team-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-ledger.html',
  styleUrls: ['./team-ledger.css']
})
export class PmuTeamLedger implements OnInit {

  firmCode!: string;

  entryTypes = ['ADVANCE', 'PAYMENT'];

  form: any = {
    entry_date: '',
    team_name: '',
    entry_type: 'ADVANCE',
    amount: null,
    remarks: ''
  };

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
      console.error('❌ firmCode missing in team-ledger');
      return;
    }

    this.loadList();
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
      ...this.form
    };

    // ---------- UPDATE ----------
    if (this.editMode && this.editId) {

      this.lastAction = 'update';

      this.backend.updatePmuTeamLedger({
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

      this.backend.addPmuTeamLedger(payload)
        .subscribe({
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
    this.backend.getPmuTeamLedgerList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  // ---------------- RESET ----------------
  resetForm() {
    this.form = {
      entry_date: '',
      team_name: '',
      entry_type: 'ADVANCE',
      amount: null,
      remarks: ''
    };
  }

  // ---------------- EDIT ----------------
  editRow(row: any) {
    this.form = {
      entry_date: row.entry_date,
      team_name: row.team_name,
      entry_type: row.entry_type,
      amount: row.amount,
      remarks: row.remarks
    };

    this.editMode = true;
    this.editId = row.id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------- DELETE ----------------
  deleteRow(id: number) {
    if (!confirm('Delete this record?')) return;

    this.backend.deletePmuTeamLedger({
      id: id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }
}
