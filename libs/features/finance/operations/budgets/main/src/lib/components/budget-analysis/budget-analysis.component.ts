import { Component, Input, OnInit } from '@angular/core';
import { BudgetAnalysisAggregate } from '../../model/budget-analysis-aggregate.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget-analysis',
  templateUrl: './budget-analysis.component.html',
  styleUrls: ['./budget-analysis.component.scss'],
})
export class BudgetAnalysisComponent implements OnInit {

  @Input() agg$: Observable<BudgetAnalysisAggregate>;

  constructor() { }

  ngOnInit(): void {}

  absolute = (number: number) => Math.abs(number);
}
