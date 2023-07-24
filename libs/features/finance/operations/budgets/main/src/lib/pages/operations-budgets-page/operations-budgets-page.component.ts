import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { BehaviorSubject, Subject, combineLatest, filter, map, startWith, switchMap, tap } from 'rxjs';

import { flatMap as __flatMap, groupBy as __groupBy } from 'lodash';

import { MONTHS, YEARS } from '@app/model/finance/planning/time';
import { Expenses, ExpensesAllocation } from '@app/model/finance/operations/expenses';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { Budget, BudgetLine, BudgetLinesAllocation } from '@app/model/finance/planning/budgets';

import { InvoicesService } from '@app/state/finance/invoices';
import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

import { AllocateInvoiceToLineModalComponent } from '../../modals/allocate-invoice-to-line-modal/allocate-invoice-to-line-modal.component';
import { CompareBudgetsModalComponent } from '../../modals/compare-budgets-modal/compare-budgets-modal.component';

import { CALCULATE_ALLOCATED_COSTS, CALCULATE_ALLOCATED_INCOME } from '../../providers/calculate-month-amounts.provider';

import { BudgetLineAllocUI, BudgetLineUI } from '../../model/budget-line-view.interface';
import { BudgetAnalysisAggregate, DEFAULT_ANALYSIS_AGGREGATE, resetBudgetAnalysisAggregate } from '../../model/budget-analysis-aggregate.interface';

@Component({
  selector: 'app-operations-budgets-page',
  templateUrl: './operations-budgets-page.component.html',
  styleUrls: ['./operations-budgets-page.component.scss'],
})
export class OperationsBudgetsPageComponent implements OnInit {

  private _sbS = new SubSink();

  currentYear = new Date().getFullYear();

  displayedColumns: string[] = ['name', 'total', 'expenses', 'invoices', 'actions'];
  
  dataSource = new MatTableDataSource();

  allMonths: BudgetLineUI[];

  allMonthsList = MONTHS;
  month = this.allMonthsList[0];
  activeMonth = MONTHS[0].month.toString();
  monthValue$ = new BehaviorSubject(MONTHS[0]);

  allYearsList = YEARS;
  activeYear = this.currentYear;
  yearValue$ = new BehaviorSubject(this.currentYear);

  budgets: Budget[];
  filteredBudgets: Budget[];
  activeBudget: Budget;
  budgetValue$ = new Subject();

  invoices: Invoice[];
  invAllocs: InvoiceAllocation[];
  expenses: Expenses[];
  expAllocs: ExpensesAllocation[];

  allocatedInvoices: Invoice[] = [];
  allocatedExpenses: Expenses[] = [];

  activeBudgetLine: BudgetLine;
  budgetLineAllocs: BudgetLinesAllocation[];

  agg: BudgetAnalysisAggregate = DEFAULT_ANALYSIS_AGGREGATE;
  agg$$: BehaviorSubject<BudgetAnalysisAggregate> = new BehaviorSubject(this.agg);
  
  allDataIsReady: boolean = false;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _plans$$: BudgetPlansQuery,
              private _invoicesService: InvoicesService,
              private _expServices: ExpensesStateService,
              private _budgetsStateService$$: BudgetsStateService
  ) { }

  ngOnInit(): void {
    this.getAllTras();
  }

  getAllTras() {
    this._sbS.sink = combineLatest([this._expServices.getExpensesAndAllocs(), this._invoicesService.getInvoicesAndAllocations() ])
                        .pipe(
                          filter(([[expenses, expAllocs], [invoices, invAllocs]]) => !!expenses && !!invoices && !!invAllocs && !!expAllocs),
                          tap(([[expenses, expAllocs], [invoices, invAllocs]]) => 
                                  { this.invoices = invoices; this.invAllocs = invAllocs, this.expenses = expenses; this.expAllocs = expAllocs; }))
                        .subscribe()

    this._sbS.sink = combineLatest([this.yearValue$, this.monthValue$, this.budgetValue$.pipe(startWith(null)),
                                    this._budgetsStateService$$.getAllBudgets()])
                                      .pipe(
                                        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                { this.activeBudget = !this.activeBudget?.name ? budgets[0] : this.activeBudget }),
                                        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                { 
                                                  this.budgets = budgets.filter((budget) => budget.status === 1);
                                                  this.filteredBudgets = this.budgets;
                                                }),
                                        switchMap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                this.combineData(Number(selectedYear), selectedMonth.month)))
                                      .subscribe();
  }

  combineData(selectedYear: number, selectedMonth: number) {    
    return combineLatest(([this._plans$$.getPlans(this.activeBudget), this._budgetsStateService$$.getBudgetLine(),
                            this._budgetsStateService$$.getBudgetLineAllocs()]))
      .pipe(
        map(([plans, budgetLines, budgetLineAllocs]) => {return {plans: plans, lines: this.combineBudgetLineAndBudgetLineAllocs(budgetLines, budgetLineAllocs)}}),
        tap((data: {plans: TransactionPlan[], lines: BudgetLineAllocUI[]}) => {
          const budgetLinesData = data.lines.filter((budgetLine) =>
            (budgetLine.year === Number(selectedYear) && budgetLine.month === selectedMonth && budgetLine.budgetId === this.activeBudget.id));
          const plan = data.plans.filter((plan) => plan.budgetId === this.activeBudget.id);
          this.allMonths = budgetLinesData.map((line) => this.createBudgetLine(line, plan!))
        }), tap(() => this.aggragateBudgetLine()));
  }

  combineBudgetLineAndBudgetLineAllocs(budgetLines: BudgetLine[], budgetLineAllocs: BudgetLinesAllocation[]): BudgetLineAllocUI[] {
    return budgetLines.map((bLine) => {
      const allocs = budgetLineAllocs.find((alloc) => alloc.id === bLine.id)! ?? {};
      return { ...bLine, ...allocs };
    });
  }

  createBudgetLine(budgetLine: BudgetLineAllocUI, plans: TransactionPlan[]): BudgetLineUI {
    // this.allocatedExpenses = [];
    this.allocatedInvoices = [];

    let allExp: any = [];

    const budgetLinePlan = plans.find((plan) => plan.id === budgetLine.lineId);
    const expIds = budgetLine.elements?.filter((el) => el.allocMode == -1).map((element) => element.withId);
    const invIds = budgetLine.elements?.filter((el) => el.allocMode == 1).map((element) => element.withId);
    
    if (expIds?.length > 0) {
      const el = this.expenses?.filter((exp) => expIds?.includes(exp.id!));
      this.allocatedExpenses.push(...el!);
      allExp = el!;
    }

    if (invIds?.length > 0)
      this.allocatedInvoices = this.invoices?.filter((inv) => invIds?.includes(inv.id!));
    
    const budgetLineData: BudgetLineUI = {
      amount: budgetLine.amount,
      baseAmount: budgetLine.baseAmount,
      budgetName: this.activeBudget.name,
      lineName: budgetLinePlan?.lineName!,
      allocatedExpenses: {allExp: allExp, allocatedExpenses: this.allocatedExpenses},
      allocatedInvoices: this.allocatedInvoices,
      mode: budgetLine.mode as any,
    }
    return budgetLineData;
  }

  aggragateBudgetLine() {
    const tottalIncome = this.allMonths.filter((line) => line.mode == 1).reduce((acc, line) => acc + line.amount, 0);
    const tottalCost = Math.abs(this.allMonths.filter((line) => line.mode == -1).reduce((acc, line) => acc + line.amount, 0));

    const difference = tottalIncome - Math.abs(tottalCost);

    this.agg = {tottalIncome, tottalCost, difference};
    this.agg.allocatedIncome = this.calculateAllocatedIncome(this.allocatedInvoices);
    this.agg.allocatedCost = this.calculateAllocatedCosts(this.allocatedExpenses);
    
    this.agg$$.next(this.agg);
    this.allDataIsReady = true;
  }

  budgetChanged(budget: MatSelectChange) {
    this.agg = resetBudgetAnalysisAggregate();
    this.activeBudget = budget.value;
    this.budgetValue$.next(budget.value);
  }

  yearChanged(year: MatSelectChange) {
    this.agg = resetBudgetAnalysisAggregate();
    this.activeYear = year.value;
    this.yearValue$.next(year.value);
  }

  monthChanged(month: MatSelectChange) {
    this.agg = resetBudgetAnalysisAggregate();
    this.activeMonth = (month.value.month - 1).toString();
    this.month = month.value;
    this.monthValue$.next(month.value);
  }

  absolute = (number: number) => Math.abs(number);

  allocateLineToInvoice(line: BudgetLineUI) {
    this._dialog.open(AllocateInvoiceToLineModalComponent, {
      minWidth: '700px',
      data: { budgetLine: line }
    });
  }

  calculateAllocatedIncome = (invoices: Invoice[]) => CALCULATE_ALLOCATED_INCOME(invoices, this.invAllocs);

  calculateAllocatedCosts = (expenses: Expenses[]) => CALCULATE_ALLOCATED_COSTS(expenses, this.expAllocs);

  goToAllocation(mode: 1 | -1, id: string) {
    if (mode === 1)
      this._router$$.navigate(['business/invoices', id, 'edit']);
    else
      this._router$$.navigate(['operations/expenses']);
  }

  compareBudgets() {
    this._dialog.open(CompareBudgetsModalComponent, {
      minWidth: '1000px',
      minHeight: '800px',
    });
  }
}
