import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { BackendconnectionService } from '../../core/services/backendconnection';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html'
})
export class LandingComponent implements OnInit {

  role = '';
  firms: any[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private backend: BackendconnectionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.loadFirms();
    setTimeout(() => {
    }, 1000);
  }

  loadFirms() {
    this.backend.getAllFirms().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.firms = res.data;
          console.log(this.firms);
          this.cdr.markForCheck();
        }
        this.loading = false;
      },
      error: () => {
        alert('Failed to load firms');
        this.loading = false;
      }
    });
  }

  openFirm(firm: any) {
    if (firm.module === 'pmu') {
      this.router.navigate([`/firms/${firm.firm_code}/pmu/dashboard`]);
    } else {
      alert('Module not implemented yet');
    }
  }

  logout() {
    this.auth.logout();
  }
}
