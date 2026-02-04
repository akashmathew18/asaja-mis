import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { LandingComponent } from './pages/landing/landing';
import { FirmLayoutComponent } from './layout/firm-layout/firm-layout';

import { PmuDashboard } from './modules/pmu/dashboard/dashboard';
import { PmuWood } from './modules/pmu/wood-expense/wood-expense';
import { PmuPlywood } from './modules/pmu/plywood-purchase/plywood-purchase';
import { PmuAccessories } from './modules/pmu/accessories/accessories';
import { PmuLabour } from './modules/pmu/labour/labour';
import { PmuTeamLedger } from './modules/pmu/team-ledger/team-ledger';
import { PmuAssetLedger } from './modules/pmu/asset-ledger/asset-ledger';
import { PmuOtherExpense } from './modules/pmu/other-expenses/other-expenses';
import { PmuReports } from './modules/pmu/reports/reports';
import { PmuPayments } from './modules/pmu/payments/payments';

export const routes: Routes = [

  // ---------- DEFAULT ----------
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ---------- AUTH ----------
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },


  // ---------- FIRM + PMU ----------
  {
    path: 'firms/:firmCode/pmu',
    component: FirmLayoutComponent,
    children: [

      // PMU HOME
      { path: 'dashboard', component: PmuDashboard },
      { path: 'reports', component: PmuReports },

      // PMU MODULES
      { path: 'wood-expense', component: PmuWood },
      { path: 'plywood-purchase', component: PmuPlywood },
      { path: 'accessories', component: PmuAccessories },
      { path: 'labour', component: PmuLabour },
      { path: 'team-ledger', component: PmuTeamLedger },
      { path: 'asset-ledger', component: PmuAssetLedger },
      { path: 'other-expense', component: PmuOtherExpense },
      {path: 'payments', component: PmuPayments},

      // DEFAULT INSIDE PMU
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---------- FALLBACK ----------
  { path: '**', redirectTo: 'login' }
];
