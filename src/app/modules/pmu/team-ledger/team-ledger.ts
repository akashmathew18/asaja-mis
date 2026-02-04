import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pmu } from '../../../core/services/pmu';

@Component({
    selector: 'app-pmu-team-ledger',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './team-ledger.html'
})
export class PmuTeamLedger implements OnInit {

    firmCode!: string;

    teamName = '';
    search = '';
    fromDate = '';
    toDate = '';

    teams: any[] = [];
    ledger: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private pmu: Pmu,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.firmCode = this.route.parent?.snapshot.paramMap.get('firmCode')!;
        this.loadTeams();
        this.loadLedger();
    }

    loadTeams() {
        this.pmu.getPmuTeams(this.firmCode).subscribe((r: any) => {
            if (r.success) this.teams = r.data;
            this.cdr.markForCheck();
        });
    }

    loadLedger() {
        this.pmu.getTeamLedger({
            firm_code: this.firmCode,
            team_name: this.teamName || undefined,
            search: this.search || undefined,
            from_date: this.fromDate || undefined,
            to_date: this.toDate || undefined
        }).subscribe((r: any) => {
            if (r.success) this.ledger = r.data;
            this.cdr.markForCheck();
        });
    }

    clearFilters() {
        this.teamName = '';
        this.search = '';
        this.fromDate = '';
        this.toDate = '';
        this.loadLedger();
    }

    hasFilters(): boolean {
        return !!(this.teamName || this.search || this.fromDate || this.toDate);
    }


    finalBalance(): number {
        if (!this.ledger.length) return 0;
        return Number(this.ledger[this.ledger.length - 1].balance || 0);
    }
}
