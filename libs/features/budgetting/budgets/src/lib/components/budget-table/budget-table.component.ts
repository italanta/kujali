import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable, tap } from 'rxjs';

import { Organisation } from '@app/model/organisation';
import { Budget, BudgetRecord } from '@app/model/finance/planning/budgets';

import { OrganisationService } from '@app/state/organisation';

import { ShareBudgetModalComponent } from '../share-budget-modal/share-budget-modal.component';
import { CreateBudgetModalComponent } from '../create-budget-modal/create-budget-modal.component';
import { ChildBudgetsModalComponent } from '../../modals/child-budgets-modal/child-budgets-modal.component';
import { ManageBudgetAccessComponent } from '../../modals/manage-budget-access/manage-budget-access.component';

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.scss'],
})

export class BudgetTableComponent {

  private _sbS = new SubSink();

  @Input() budgets$: Observable<{overview: BudgetRecord[], budgets: any[]}>;
  @Input() canPromote = false;

  @Output() doPromote: EventEmitter<void> = new EventEmitter();

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['name', 'status', 'startYear', 'duration', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  org: Organisation;
  overviewBudgets: BudgetRecord[] = [];

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _org$$: OrganisationService
  ) {}

  ngOnInit(): void {
    this._sbS.sink = this._org$$.getActiveOrg().pipe(tap((org) => this.org = org)).subscribe();
    this._sbS.sink = this.budgets$.pipe(tap((o) => {
      this.overviewBudgets = o.overview;
      this.dataSource.data = o.budgets;
    })).subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  hasManageAccess(budget: Budget) {
    return (budget.createdBy !== this.org.activeUser?.id) && !(this.org.activeUser?.roles[this.org.id!].admin);
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  promote = () => {if (this.canPromote) this.doPromote.emit()};

  manageBudgetAccess(budget: Budget) {
    this._dialog.open(ManageBudgetAccessComponent, {data: budget, minWidth: '600px', minHeight: 'fit-content'});
  }
  
  /** Open share screen to configure budget access. */
  openShareBudgetDialog(parent: Budget | false): void 
  {
    this._dialog.open(ShareBudgetModalComponent, {
      panelClass: 'no-pad-dialog',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  /** Open clone screen to clone and reconfigure budget. */
  openCloneBudgetDialog(parent: Budget | false): void {
    this._dialog.open(CreateBudgetModalComponent, {
      height: 'fit-content',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  openChildBudgetDialog(parent : Budget): void 
  { 
    let children: any = this.overviewBudgets.find((budget) => budget.budget.id === parent.id)!?.children;
    children = children?.map((child) => child.budget)
    this._dialog.open(ChildBudgetsModalComponent, {
      height: 'fit-content',
      minWidth: '600px',
      data: {parent: parent, budgets: children}
    });
  }

  goToDetail(budgetId: string, action: string) {
    this._router$$.navigate(['budgets', budgetId, action]).then(() => this._dialog.closeAll());
  }

  deleteBudget(budget: Budget) {

  }

  translateStatus(status: number) {
    switch (status) {
      case 1:
        return 'BUDGET.STATUS.ACTIVE';
      case 0:
        return 'BUDGET.STATUS.DESIGN';
      case 9:
        return 'BUDGET.STATUS.NO-USE';
      case -1:
        return 'BUDGET.STATUS.DELETED';
      default:
        return '';
    }
  }
}
