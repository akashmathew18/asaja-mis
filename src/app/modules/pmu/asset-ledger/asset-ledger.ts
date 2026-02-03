import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Pmu } from '../../../core/services/pmu';

@Component({
  selector: 'app-pmu-asset-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-ledger.html'
})
export class PmuAssetLedger implements OnInit {

  firmCode!: string;

  form: any = this.defaultForm();

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

  ngOnInit(): void {
    this.firmCode = this.route.parent?.snapshot.paramMap.get('firmCode') || '';
    if (this.firmCode) {
      this.loadList();
    }
  }

  defaultForm() {
    return {
      asset_name: '',
      company_name: '',
      purchase_date: '',
      warranty: 'No',
      warranty_expiry: '',
      asset_amount: null,
      remarks: ''
    };
  }

  onWarrantyChange() {
    if (this.form.warranty === 'No') {
      this.form.warranty_expiry = '';
    }
  }

  save(formRef: NgForm) {
    if (formRef.invalid || this.saving) return;

    this.saving = true;
    this.successMsg = false;

    const payload = {
      firm_code: this.firmCode,
      created_by: this.auth.getUserid(),
      asset_name: this.form.asset_name,
      company_name: this.form.company_name,
      purchase_date: this.form.purchase_date,
      warranty: this.form.warranty,
      warranty_expiry:
        this.form.warranty === 'Yes' ? this.form.warranty_expiry : null,
      asset_amount: this.form.asset_amount,
      remarks: this.form.remarks
    };

    if (this.editMode && this.editId) {
      this.lastAction = 'update';
      this.backend.updatePmuAsset({
        asset_id: this.editId,
        ...payload
      }).subscribe(() => this.afterSuccess(formRef));
    } else {
      this.lastAction = 'create';
      this.backend.addPmuAsset(payload)
        .subscribe(() => this.afterSuccess(formRef));
    }
  }

  afterSuccess(formRef: NgForm) {
    this.loadList();
    this.form = this.defaultForm();
    formRef.resetForm(this.form);

    this.editMode = false;
    this.editId = null;

    this.successMsg = true;
    this.saving = false;

    setTimeout(() => (this.successMsg = false), 2000);
  }

  loadList() {
    this.backend.getPmuAssetList(this.firmCode).subscribe((res: any) => {
      if (res.success) {
        this.list = res.data;
        this.cdr.markForCheck();
      }
    });
  }

  editRow(row: any) {
    this.form = {
      asset_name: row.asset_name,
      company_name: row.company_name,
      purchase_date: row.purchase_date,
      warranty: row.warranty,
      warranty_expiry: row.warranty_expiry,
      asset_amount: row.asset_amount,
      remarks: row.remarks
    };

    this.editMode = true;
    this.editId = row.asset_id;
    this.onWarrantyChange();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteRow(asset_id: number) {
    if (!confirm('Delete this asset?')) return;

    this.backend.deletePmuAsset({
      asset_id,
      firm_code: this.firmCode
    }).subscribe(() => this.loadList());
  }
}
