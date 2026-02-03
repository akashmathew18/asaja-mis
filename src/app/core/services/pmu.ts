import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common';

@Injectable({
  providedIn: 'root'
})

export class Pmu {


  // private baseUrl = 'http://localhost/mis/api';
  // private baseUrl = 'https://mis.asajaitsolutions.com/api';
  private baseUrl = '';

  constructor(private http: HttpClient, private common: CommonService) {
    this.baseUrl = common.baseUrl;
  }

  // ---------- PMU REPORTS ----------
  post(endpoint: string, firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/reports/${endpoint}`,
      { firm_code: firmCode }
    );
  }
  // ---------- PMU WOOD ----------
  addPmuWood(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/wood/add.php`,
      data
    );
  }

  getPmuWoodList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/wood/list.php`,
      { firm_code: firmCode }
    );
  }

  // ---------- CRUD OPERATIONS----------
  // UPDATE
  updatePmuWood(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/wood/update.php`,
      data
    );
  }

  deletePmuWood(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/wood/delete.php`,
      data
    );
  }

  // ---------- PMU PLYWOOD ----------
  addPmuPlywood(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/plywood/add.php`,
      data
    );
  }

  getPmuPlywoodList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/plywood/list.php`,
      { firm_code: firmCode }
    );
  }

  updatePmuPlywood(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/plywood/update.php`, data);
  }

  deletePmuPlywood(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/plywood/delete.php`, data);
  }


  // ---------- PMU TEAM LEDGER ----------
  addPmuTeamLedger(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/team-ledger/add.php`,
      data
    );
  }

  getPmuTeamLedgerList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/team-ledger/list.php`,
      { firm_code: firmCode }
    );
  }

  // ---------- CRUD OPERATIONS----------
  updatePmuTeamLedger(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/team-ledger/update.php`, data);
  }

  deletePmuTeamLedger(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/team-ledger/delete.php`, data);
  }

  // ---------- PMU ACCESSORIES ----------
  addPmuAccessories(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/accessories/add.php`,
      data
    );
  }

  getPmuAccessoriesList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/accessories/list.php`,
      { firm_code: firmCode }
    );
  }

  // ---------- CRUD OPERATIONS----------
  updatePmuAccessories(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/accessories/update.php`, data);
  }

  deletePmuAccessories(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/accessories/delete.php`, data);
  }


  // ---------- PMU ASSET LEDGER ----------
  addPmuAsset(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/asset-ledger/add.php`,
      data
    );
  }

  getPmuAssetList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/asset-ledger/list.php`,
      { firm_code: firmCode }
    );
  }

  // ----------- CRUD OPERATIONS----------
  updatePmuAsset(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/asset-ledger/update.php`, data);
  }

  deletePmuAsset(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/asset-ledger/delete.php`, data);
  }

  // ---------- PMU LABOUR ----------
  addPmuLabour(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/labour/add.php`,
      data
    );
  }

  getPmuLabourList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/labour/list.php`,
      { firm_code: firmCode }
    );
  }


  // UPDATE
  updatePmuLabour(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/labour/update.php`,
      data
    );
  }

  // DELETE
  deletePmuLabour(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/labour/delete.php`, data
    );
  }



  // ---------- PMU OTHER EXPENSE ----------
  addPmuOtherExpense(data: any) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/other-expense/add.php`,
      data
    );
  }

  getPmuOtherExpenseList(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/other-expense/list.php`,
      { firm_code: firmCode }
    );
  }


  updatePmuOtherExpense(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/other-expense/update.php`, data);
  }

  deletePmuOtherExpense(data: any) {
    return this.http.post(`${this.baseUrl}/modules/pmu/other-expense/delete.php`, data);
  }

}
