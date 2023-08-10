import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, switchMap, tap } from 'rxjs';

import { Timestamp } from '@firebase/firestore-types';

import { __DateFromStorage } from '@iote/time';

import { Expenses } from '@app/model/finance/operations/expenses';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { ExpensesStateService } from '@app/state/finance/operations/expenses';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';

import { DeleteModalComponent } from '@app/elements/modals';

import { ExpensesService } from '../../services/expenses.service';
import { ExpenseUI } from '../../model/expense.model';
import { CreateExpensesModalComponent } from '../../modals/create-expenses-modal/create-expenses-modal.component';

@Component({
  selector: 'app-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss'],
})
export class ExpensesPageComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'budget', 'date', 'amount' , 'vat', 'allocatedTo', 'actions'];

  dataSource = new MatTableDataSource();

  filter$$ = new BehaviorSubject<(Expenses) => boolean>((c) => true);
  filter$: Observable<{ expenses: Expenses[]}>

  showFilter: boolean;

  allTableData = this.dataSource.data;

  expenses: ExpenseUI[];

  allBudgetPlans: TransactionPlan[] = [];

  dataIsReady = false;

  constructor(private _router$$: Router,
              private _matDialog: MatDialog,
              private _expService: ExpensesService,
              private _budgetsStateService: BudgetsStateService,
              private _expensesStateService: ExpensesStateService
  ) {}

  ngOnInit(): void {
    this._sbS.sink = combineLatest([this._expensesStateService.getAllExpenses(), 
                                    this._expensesStateService.getAllExpensesAllocs(),
                                    this._budgetsStateService.getAllBudgets()])
                                            .pipe(tap(([expenses, expAllocs, budgets]) => this.getPlans(expenses)),
                                                  map(([expenses, expAllocs, budgets]) => 
                                                        this._expService.combineExpensesAndExpensesAllocs(expenses, expAllocs, budgets)),
                                                  map((ex) => this._expService.findExpenseRecords(ex.expenses, ex.budgets)),
                                                  tap((ex) => this.setExpensesData(ex)),
                                                  tap((d) => {this.dataIsReady = true}))
                                            .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setExpensesData(expenses: ExpenseUI[]) {    
    this.expenses = expenses;
    this.dataSource.data = this.expenses;
    this.allTableData = this.expenses;
  }

  getPlans(expenses: Expenses[]) {
    const budgetIds = expenses.map((b) => b.budgetId)!;
    if (budgetIds) {
      budgetIds.map((id) => {
        if (id != '') {
          this._expService.getPlans(id!).pipe(tap((plans) =>{
            this.allBudgetPlans.push(...plans);
          })).subscribe();
        }
      });
    }
  }

  getPlanName(planId: string) {
    const splitId = planId.split('-');
    const yearAndMonth =`${splitId[0]}-${splitId[1]}-`
    const name = this.allBudgetPlans.find((p) => p.id === planId.split(yearAndMonth)[1])?.lineName ?? '';
    return name ? `${name}: ${splitId[0]} - ${this.getMonthName(Number(splitId[1])) }`: '-';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (Invoice) => boolean) {    
    this.filter$$.next(value);
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  createNewExpense() {
    this._matDialog.open(CreateExpensesModalComponent, {
      disableClose: true,
      minWidth: '700px'
    }).afterClosed();
  }

  getDate(date: Timestamp) {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }
  
  viewExpense(expenseId: string) {
    console.log(expenseId);
    
    this._router$$.navigate(['operations' , 'expenses', expenseId]);
  }

  allocateTransactionEvent(expense: Expenses) {}

  editExpense(expense: Expenses) {}

  deleteExpense(expense: Expenses) {
    let deleteDialogRef = this._matDialog.open(DeleteModalComponent, {
      data: 'Expense',
      minWidth: 'fit-content'
    })

    deleteDialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption?.event == 'delete') {
        this._expensesStateService.deleteExpense(expense).subscribe()
      }
    })
  }

  getMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
  }
}
