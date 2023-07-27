import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { map, Observable, Subscription, take } from 'rxjs';

import { Month, MONTHS, YEARS } from '@app/model/finance/planning/time';
import { NULL_AMOUNT_PER_MONTH } from '@app/model/finance/planning/budget-defaults';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { CellInput, PlanTrInput } from '@app/model/finance/planning/budget-items';

import { PlanTransactionModalComponent } from '@app/features/budgetting/budget-planning';

// import { CellTransactionOccurrenceModal } from '../../../transaction-planner/components/cell-tr-occurrence-modal/cell-tr-occurrence-modal.component';

@Component({
  selector: 'app-financial-plan-table',
  styleUrls: ['financial-plan-table.component.scss'],
  templateUrl: 'financial-plan-table.component.html',
})
export class FinancialPlanTableComponent implements OnInit
{
  subscr!: Subscription;

  /** Months (view always represents a year) */
  monthColumns = MONTHS;
  /** Years (TODO: Determine dynamically) */
  years: Array<number> = YEARS; 
  /* Listing of the columns to render */
  columns!: string[];

  /** Budget ID to which this table is linked */
  budgetId!: string;

  @Input() type!: BudgetRowType;
  
  @Input() total$! : Observable<BudgetRowYear>;
  total!  : BudgetRowYear;
  @Input() rows$!  : Observable<BudgetRowYear[]>;

  /** Class ID. Is aligned to type of table  */
  @Input() classId!: 'cost' | 'income' | 'result'; 

  @Input() allowAdd = true;
  @Input() nameField = true;
  @Input() isInEditMode: boolean;

  datasource$!  : Observable<BudgetRowYear[]>;

  savingTransactions: number = 0;

  loaded= false;

  constructor(private _router$$: Router,
              public dialog: MatDialog,
              // private _plannedTransactionService: PlanTransactionService
  ) {

  }

  ngOnInit()
  {
    this.budgetId = this._router$$.url.split('/')[2];
    // Initialise columns
    this.columns = ['transactionCat'].concat(this.nameField ? [] : [])
                                     .concat(MONTHS.map((m) => m.slug))
                                    .concat('total').concat('action');

    // hijacking the stream to remove unneccesary headers for cost and income
    if (this.rows$) {
      this.datasource$ = this.rows$.pipe(
        map((rows) => 
            rows.filter((row) => this.classId != 'result'
              ? row.isHeader === false && (row.name !== 'BUDGETTING.LINES.COST' && row.name !== 'BUDGETTING.LINES.INCOME')
              : row
              )))
    }
    
    // Unpack total as we need it for small aggregated visualisations.
    this.subscr = 
      this.total$.subscribe(total => {
        this.total = total;
      });
  }

  //
  // -- SECTION TABLE STRUCTURE & VISUALISATIONS
  //

  /** Get the category name (for higher-level roles) */
  getCategory(row: BudgetRowYear): string {
    return (row.isHeader || row.type == 'childResult')
              ? row.name as string
              : row.name;
  }

  /** Get name if applicable (only for non-typed rows) */
  getName(row: BudgetRowYear) {
    return !row.isHeader ? row.name : '';
  }

  /** Get cell amount */
  getAmount(cell: BudgetRowYear, column: Month) 
  {
    return this._formatPrice(Math.abs(this._getCellValue(cell, column).amount));
  }

  /** Aggregate the total of a budget line (count all row amounts together). */
  getTotalAmountM(column: Month)
  {
    return this._formatPrice(Math.abs(this._getCellValueForTotal(column).amount));
  }

  /** Calculate the total of a column */
  getTableTotalAmount()
  {
    try {
      return this.total ? this._formatPrice(Math.abs(this.total.totalYear as number))
                        : '0';
    }
    catch(e) { return 0; }
  }

  /** Calculate the total of a row. */
  getRowTotal(row: BudgetRowYear)
  {
    try {
      return this._formatPrice(row.totalYear as number);
    }
    catch(e) { return 0; }
  }

  //
  // -- SECTION CELL VALUE CALCULATIONS
  //

  /**  */
  private _getCellValueForTotal(column: Month) {
    try {
      return this.total.amountsMonth[column.month - 1];
    }
    catch(e) { return NULL_AMOUNT_PER_MONTH() }
  }

  /**  */
  private _getCellValue(row: BudgetRowYear, column: Month)
  {
    try {
      return row.amountsMonth[column.month - 1];
    }
    catch (e) { return NULL_AMOUNT_PER_MONTH(); }
  }

  /** Format a price to an easy readable number */
  private _formatPrice(price: number) {
    return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  openCellModal(cell: CellInput, column: Month)
  {        
    if (this.classId !== 'result') {
      const data = (cell && !cell.isHeader) ? (this.getTransactionPlanInput(column, cell)): {}
                  
      this.dialog.open(PlanTransactionModalComponent, { data: {data: data, column: column, year: cell.year}})
                 .afterClosed()
                 .subscribe((saving: Observable<boolean> | false) => 
                    { if (saving) this._addCounterSaving(saving); });
    }
  }

  getTransactionPlanInput(column: Month, cell: CellInput): PlanTrInput {
    let tr = {
      isInCreateMode: false,
      fromMonth: column.month,
      type: this.type,
      budgetId: this.budgetId, 
      occurence: cell.amountsMonth[column.month - 1].plan
    } as PlanTrInput;

    return tr;
  }


  /** Counter for when transactions are being saved. */
  private _addCounterSaving(transaction: Observable<boolean>) 
  {
    this.savingTransactions++;

    transaction.pipe(take(1))
                .subscribe(_ => {
                  if (this.savingTransactions && this.savingTransactions > 0) {
                    this.savingTransactions--;
                  }
                });
  }

  deleteTransaction(transaction) {
    let isConfirmed = confirm("Are you sure you want to delete this transaction? Click ok to continue"); 

    if(isConfirmed) {
      // this._plannedTransactionService.deletePlannedTransaction(transaction);
    }
  }


  //
  // -- SECTION CSS
  //

  /** Get class for the row visualisation. */
  getClassesCell(row: BudgetRowYear, col: Month)
  {
    const classes: string[] = [];
    const value = this._getCellValue(row, col);

    if (row.isHeader || row.type == 'childResult' || row.type == '')
      classes.push(this._getClassesTotal(value.amount));
    else
    {
      classes.push('cell-intrct');
      if (value.isOccurenceStart) classes.push('occurence-start');
    }
    return classes;
  }

  /** Get classes for a single cell */
  getClassesM(column: Month)
  {
    return this._getClassesTotal(this._getCellValueForTotal(column).amount);
  }

  /** Get classes for a row */
  getClassesRow(row: BudgetRowYear) {
    return (row.isHeader) ? ['header-row'] : [];
  }

  /** Get classes for a row total */
  getRowTotalClasses(row: BudgetRowYear)
  {
    try {
      const value = row.total;
      return this._getClassesTotal(value as number);
    }
    catch(e) { return ''; }
  }

  /** Get classes for a column total */
  getTableTotalClasses() {
    try {
      return this.total ? this._getClassesTotal(this.total.total as number) : '';
    }
    catch(e) { return ''; }
  }
  
  /** 
   * Get classes for a budget total cell 
   */
  private _getClassesTotal(value: number) 
  { 
    return (value == 0) ? ('zero') : (value > 0 ? 'positive' : 'negative');
  }
}
