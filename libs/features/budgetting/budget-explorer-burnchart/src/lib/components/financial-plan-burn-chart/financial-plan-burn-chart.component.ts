import { Component, Input, OnInit } from '@angular/core';

import { clone as ___clone, drop as ___drop, take as ___take } from 'lodash';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Options } from '@angular-slider/ngx-slider';

import { MONTHS } from '@app/model/finance/planning/time';

import { Budget } from '@app/model/finance/planning/budgets';
import { RenderedBudget, ___CreateGraphBalanceLine, 
          ___CreateGraphBlocks, ___CreateGraphLabels } from '@app/model/finance/planning/budget-rendering';

import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';

@Component({
  selector: 'app-financial-plan-burn-chart',
  templateUrl: './financial-plan-burn-chart.component.html',
  styleUrls: ['./financial-plan-burn-chart.component.scss']
})
export class FinancialPlanBurnChartComponent implements OnInit
{
  @Input() state$! : Observable<FinancialExplorerState>;

  budget$!: Observable<RenderedBudget>;
  year$!  : Observable<number>;

  MIN_YEAR = 0;
  MAX_YEAR = 5;

  sliderMinValue = 0;
  sliderMaxValue = 5;
  sliderValues$$ : BehaviorSubject<{ min: number, max: number }> = new BehaviorSubject(null as any);
  sliderValues$  = this.sliderValues$$.asObservable().pipe(filter(s => s != null));
  sliderOptions!: Options;

  balanceLine$!: Observable<number[]>;
  balanceLineDisplay!: number[];

  resultBlocks$!: Observable<{ label: string, data: number[] }[]>;
  resultsBlocksDisplay!: { label: string, data: number[], backgroundColor: string }[];
  
  labels$!: Observable<string[]>;
  labelsDisplay!: string[];

  isLoaded = false;

  ngOnInit()
  {
    this.budget$ = this.state$.pipe(map(st => st.budget));
    this.year$   = this.state$.pipe(map(st => st.year));
   
    // Kick off slider init by setting range values
    this.budget$.subscribe(budget => this._initSliderRange(budget));

    // Mold the graph data to be displayable on graph
    this.balanceLine$  = this.state$.pipe(map(rT => ___CreateGraphBalanceLine(rT.scopedBalance)));
    this.resultBlocks$ = this.state$.pipe(map(rT => ___CreateGraphBlocks(rT)));
    this.labels$       = this.state$.pipe(map(rT => ___CreateGraphLabels(rT.budget.balance.amountsYear)));
    
    // Filter the correct range of graph values based on slider settings.
    combineLatest([this.balanceLine$, this.sliderValues$])
      .subscribe(([balanceLine, slider]) => { this.balanceLineDisplay = this._valuesForSlider(balanceLine, slider) });
    
    combineLatest([this.resultBlocks$, this.sliderValues$])
      .subscribe(([resultBlocks, slider]) => { this.resultsBlocksDisplay = resultBlocks.map((rB: any) => this._resultBlocksForSlider(rB, slider)) });
    
    combineLatest([this.labels$, this.sliderValues$])
      .subscribe(([labels, slider]) => {
        this.labelsDisplay = this._valuesForSlider(labels, slider);
        
        this.isLoaded = true;
      });
    
    this.year$.subscribe(y => this._setYear(y));
  }

  private _initSliderRange(budget: Budget)
  {
    this.MIN_YEAR = budget.startYear;
    this.MAX_YEAR = budget.startYear + budget.duration;

    this.sliderOptions = {
      floor: 0, ceil: ((this.MAX_YEAR % this.MIN_YEAR) * 12) - 1, showTicks: true, tickStep: 12,
      translate: (value: number): string => { return 'Y' + Math.ceil((value + 1) / 12) + ' - ' + MONTHS[value % 12].slug; }
    };
  
    this.sliderMinValue = (new Date().getFullYear() > this.MIN_YEAR) ? ((new Date().getFullYear() % this.MIN_YEAR) * 12)
                                                                     : 0;
    this.sliderMaxValue = this.sliderMinValue + 11;                                                      
    this.rangeChange();
  }

  private _setYear(year: number) {
    this.sliderMinValue = (year % this.MIN_YEAR) * 12;
    this.sliderMaxValue = this.sliderMinValue + 11;

    this.rangeChange();
  }

  rangeChange() {
    this.sliderValues$$.next({ min: this.sliderMinValue, max: this.sliderMaxValue });
  }

  private _resultBlocksForSlider(resultBlock: { label: string, data: number[], backgroundColor: string }, slider: { min: number, max: number })
  {
    const block = ___clone(resultBlock);
    block.data = this._valuesForSlider(block.data, slider);
    return block;
  }

  /** Take a segment of x years out of full slice. */
  private _valuesForSlider(allValues: any[], slider: {min: number, max: number}) {
    const minIndex = slider.min;
    const maxIndex = slider.max;

    return  ___take(___drop(allValues, minIndex), maxIndex + 1 - minIndex);
  }

}
