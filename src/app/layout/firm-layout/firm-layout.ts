import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-firm-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './firm-layout.html'
})
export class FirmLayoutComponent implements OnInit {

  firmCode!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    // ✅ read firmCode from URL
    // this.firmCode = this.route.snapshot.paramMap.get('firmCode')!;
    this.route.paramMap.subscribe(params => {
    this.firmCode = params.get('firmCode')!;
  });
  }

  goDashboard() {
    this.router.navigate([`/firms/${this.firmCode}/pmu/dashboard`]);
  }

  goReports() {
    this.router.navigate([`/firms/${this.firmCode}/pmu/reports`]);
  }

  backToFirms() {
    this.router.navigate(['/landing']);
  }

  logout() {
    this.auth.logout();
  }
}
