import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common';

@Injectable({
  providedIn: 'root'
})
export class BackendconnectionService {

  private baseUrl = '';



  constructor(private http: HttpClient, private common: CommonService) {
    this.baseUrl = common.baseUrl;
  }

  // ---------- AUTH ----------
  login(data: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/login.php`, data);
  }

  // ---------- FIRMS ----------
  getAllFirms() {
    return this.http.get(`${this.baseUrl}/firms/get_firms.php`);
  }



  // ---------- PMU DASHBOARD TOTALS ----------
  getPmuDashboardTotals(firmCode: string) {
    return this.http.post(
      `${this.baseUrl}/modules/pmu/dashboard/totals.php`,
      { firm_code: firmCode }
    );
  }

}
