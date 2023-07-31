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

import { BudgetLineAllocUI, BudgetLineUI } from './budget-line-view.interface';
import { BudgetAnalysisAggregate, DEFAULT_ANALYSIS_AGGREGATE } from './budget-analysis-aggregate.interface';

import { combineBudgetLineAndBudgetLineAllocs } from '../providers/combine-budget-lines-and-line-allocs.function';
import { CALCULATE_ALLOCATED_COSTS, CALCULATE_ALLOCATED_INCOME } from '../providers/calculate-month-amounts.provider';

export class OperationsBudgetsModel {

  private _sbS = new SubSink();

  currentYear = new Date().getFullYear();

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

  constructor(private _plans$$: BudgetPlansQuery,
              private _invoicesService: InvoicesService,
              private _expServices: ExpensesStateService,
              private _budgetsStateService$$: BudgetsStateService
  ) { }

  getAllTras() {
    this._sbS.sink = combineLatest([this._expServices.getExpensesAndAllocs(), this._invoicesService.getInvoicesAndAllocations()])
      .pipe(
        filter(([[expenses, expAllocs], [invoices, invAllocs]]) => !!expenses && !!invoices && !!invAllocs && !!expAllocs),
        tap(([[expenses, expAllocs], [invoices, invAllocs]]) => { this.invoices = invoices; this.invAllocs = invAllocs, this.expenses = expenses; this.expAllocs = expAllocs; }))
      .subscribe()

    this._sbS.sink = combineLatest([this.yearValue$, this.monthValue$, this.budgetValue$.pipe(startWith(null)),
    this._budgetsStateService$$.getAllBudgets()])
      .pipe(
        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => { this.activeBudget = !this.activeBudget?.name ? budgets[0] : this.activeBudget }),
        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => {
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
        map(([plans, budgetLines, budgetLineAllocs]) => {return {plans: plans, lines: combineBudgetLineAndBudgetLineAllocs(budgetLines, budgetLineAllocs)}}),
        tap((data: {plans: TransactionPlan[], lines: BudgetLineAllocUI[]}) => {
          const budgetLinesData = data.lines.filter((budgetLine) =>
            (budgetLine.year === Number(selectedYear) && budgetLine.month === selectedMonth && budgetLine.budgetId === this.activeBudget.id));
          const plan = data.plans.filter((plan) => plan.budgetId === this.activeBudget.id);
          this.allMonths = budgetLinesData.map((line) => this.createBudgetLine(line, plan!))
        }), tap(() => this.aggragateBudgetLine()));
  }

  createBudgetLine(budgetLine: BudgetLineAllocUI, plans: TransactionPlan[]): BudgetLineUI {
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
    
    this.allocatedExpenses = [];

    this.agg$$.next(this.agg);
    this.allDataIsReady = true;
  }

  calculateAllocatedIncome = (invoices: Invoice[]) => CALCULATE_ALLOCATED_INCOME(invoices, this.invAllocs);

  calculateAllocatedCosts = (expenses: Expenses[]) => CALCULATE_ALLOCATED_COSTS(expenses, this.expAllocs);
}