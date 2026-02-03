import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackendconnectionService } from '../../../core/services/backendconnection';

@Component({
  selector: 'app-pmu-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class PmuDashboard implements OnInit {

  firmCode!: string;

  totalWoodExpense = 0;
  totalPlywoodPurchase = 0;
  totalAccessories = 0;
  totalLabourCost = 0;
  totalOtherExpenses = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendconnectionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log("TESTING DASHBOARD INIT");

    this.route.parent?.paramMap.subscribe(params => {
      const code = params.get('firmCode');
      if (!code) {
        console.error('firmCode missing');
        return;
      }
      console.log("FIRM CODE:", code);
      this.firmCode = code;
      this.loadTotals(); // YOUR API CALL HERE
    });
  }


  loadTotals() {
    this.backend.getPmuDashboardTotals(this.firmCode)
      .subscribe((res: any) => {
        if (!res.success) return;
        console.log(res);

        this.totalWoodExpense = res.wood;
        this.totalPlywoodPurchase = res.plywood;
        this.totalAccessories = res.accessories;
        this.totalLabourCost = res.labour;
        this.totalOtherExpenses = res.other_expense;

        this.cdr.markForCheck();
      });
  }


  goTo(module: string) {
    // ✅ RELATIVE navigation keeps firmCode automatically
    this.router.navigate([module], {
      relativeTo: this.route.parent
    });
  }
}
