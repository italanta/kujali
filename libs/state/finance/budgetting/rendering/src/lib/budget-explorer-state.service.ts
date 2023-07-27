import { Injectable } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/compat/functions";

import { BehaviorSubject, combineLatest, filter, map, Observable, Subscription, switchMap, take, tap } from "rxjs";

import { Logger } from "@iote/bricks-angular";

import { Budget, BudgetStatus } from "@app/model/finance/planning/budgets";
import { LoadedPlanTrInput, PlanTrInput, TransactionPlan } from "@app/model/finance/planning/budget-items";
import { RenderedBudget, RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { FinancialExplorerState, _DEFAULT_FINANCIAL_EXPLORER_STATE, 
         _FIRST_YEAR_OF_BUDGET, _YEARS_RANGE_OF_BUDGET } from "@app/model/finance/planning/budget-rendering-state";

import { BudgetQuery } from "./queries/budget.query";
import { BudgetPlansQuery } from "./queries/budget-lines.query";
import { BudgetRendererService } from "./queries/budget-renderer.service";

import { ChildBudgetManager } from "./model/child-budget-manager.model";
import { TransactionPlannerManager } from "./model/transaction-planner-manager";
import { __ScopeStateToYear } from "./model/scope-table-to-year.function";

/**
 * This model manages the financial year explorer state.
 *  
 * It controls:
 *  - The year to visualize
 *  - The active budget
 *  - The rendering of the budget
 * 
 * @exposes Key observables which depict the current state, as well as methods to update the state.
 * 
 * Local @redux pattern
 */
@Injectable()
export class FinancialExplorerStateService
{
  /** Actual state object. Actions by the components are processed on this object. */
  private _state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
  /** Subject which controls the state. */
  private _state$$  = new BehaviorSubject<FinancialExplorerState>(this._state);

  // State dependencies
  private _budgetPlan$$!: TransactionPlannerManager;
  private _childBudgets$$!: ChildBudgetManager;

  private _budget$!: Observable<RenderedBudget>;

  /** 
   * This subscription has two uses:
   *  (1) The state is dependent on the rendered budget as calculated from the backend.
   *        In cases of multi-tenant usage, someone else might override the budget currently being rendered.
   *        Warn the user that if they submit changes now, his/her changes will affect the user editing the budget.
   *      TODO: Have editable button which locks/controls the state of a budget.
   *  (2) 
   */
  private _budgetSubscr!: Subscription;

  constructor(private _budget$$: BudgetQuery,
              private _budgetPlans$: BudgetPlansQuery,
              private _renderer: BudgetRendererService,
              private _logger: Logger,
              private _bs: AngularFireFunctions
              )
  { }

  /** Return the active explorer state. */
  public get = () => this._state$$.asObservable()
          .pipe(filter(s => s.loaded),
                tap(s => __ScopeStateToYear(s)),
                filter(s => !!s));

  /** Triggers an update to the state, meaning something changed in  */
  private _triggerUpdate = () => this._state$$.next(this._state);

  public getState = () => this._state;

  //
  // SECTION - UPDATE STATE
  // 
  
  public setYear(year: number) {
    this._state.year = year;
    this._triggerUpdate();
  }

  // Transaction planner
  /** Load in the transaction planner data, so we can edit/create the transaction plan. */
  public loadTransactionPlannerData(tr: PlanTrInput) : LoadedPlanTrInput
  {
    const cmd = <unknown> tr as LoadedPlanTrInput;
    cmd.year = this._state.year;
    cmd.trMode = tr.isInCreateMode ? 'create' : 'edit';

    if(tr?.occurence?.lineId)
    {
      const plan = this._budgetPlan$$.find(tr.occurence.lineId, cmd.year, tr.fromMonth);

      if(plan.mode === 'not_found')
        throw new Error('Line to edit somehow disappeared?');
      
      // Use the month to check if user clicked a transaction he/she wants to edit,
      //    or if the user wants to add a complete new line
      cmd.trUpdateMode = plan.mode;
      cmd.tr = plan.plan;
    }

    return cmd;
  }

  /** Store a new transaction on the planner */
  public addTransaction = (tr: TransactionPlan)    => this._budgetPlan$$.add(tr);
  /** Update an existing transaction on the planner */
  public updateTransaction = (tr: TransactionPlan) => this._budgetPlan$$.update(tr);

  //
  // SECTION - PERSIST STATE
  //


  //
  // SECTION - INITIALISE
  //
   /**
   * This service initialises the state of the financial explorer.
   * 
   * @param budgetId - Id of the budget to render.
   */
  public init(budgetId: string)
  {
    if(this._budgetSubscr)
      this._budgetSubscr.unsubscribe();

    // Start initialisation
    this._state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
    this._triggerUpdate();
  
    // We listen to the rendered budget. 
    // If this changes (thus Budget source fires multiple times) -> someone else edited the budget while I was editing).
    // TODO(ian): Lock changes to Budget when someone is editing [else this will cause an annoying bug]
    const budget$ = this._budget$$.get(budgetId);

    this._budgetSubscr = 
      budget$.subscribe(b => 
            this._startInitialisation(b));

    return this.get();
  }

  /**
   * Initialises the state on first load of the rendered budget.
   * The page-state is controlled through a local Redux-like pattern meaning updates from after this method are localized 
   *  to the page.
   * 
   * This method sets up the initialisation of the local state.
   * 
   * @param {Budget} - The budget for which to load the explorer.
   */
  private _startInitialisation(b: Budget)// children: RenderedChildBudget[], plans: TransactionPlan[])
  {
    // 1. Start initialisation - Set initial state params
    this._state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
    
    this._state.year = _FIRST_YEAR_OF_BUDGET(b); 
    this._state.years = _YEARS_RANGE_OF_BUDGET(b);
    
    this._triggerUpdate();

    // 2. Load in the transaction explorer table
    const plans$ = this._budgetPlans$.getPlans(b);
    const children$ = this._budget$$.getBudgetChildren$(b);

    this._budgetSubscr.add(
      // Initialize dependencies
      combineLatest([children$, plans$])
        .pipe(take(1)) // Initialisation so we only want one
        .subscribe(([c, p]) => this._finalizeInit(b, c, p)));
  }
    
  private _finalizeInit(b: Budget, c: RenderedChildBudget[], p: TransactionPlan[])
  {
    // Initialise the state manager for the child budgets. 
    this._childBudgets$$ = new ChildBudgetManager(c, b, this._budget$$);
    this._budgetPlan$$   = new TransactionPlannerManager(p);

    // The final load loop. The following lines manage state and auto-update the state in 
    //    case of local changes
    this._budget$ = combineLatest(
          [this._childBudgets$$.getBudgetChildren$(),
           this._budgetPlan$$.getTransactionPlans$()])
      .pipe(
        map(([children, transactions]) =>
          this._renderer.render(b, children, transactions)));
    
    // Once we have the data, update state and set loaded
    this._budgetSubscr.add(
      this._budget$.subscribe(b => 
      {
        this._state.budget = b;
        this._state.loaded = true;

        this._triggerUpdate();
      })
    );
  }

  submitBudget(budgetInput: Budget) {
    let state$ = this._state$$;
    let plans$ = this._budgetPlan$$.getTransactionPlans$();

    const save$ = combineLatest(([state$, plans$]))
                      .pipe(
                        filter(([state, plans]) => !!state && !!plans),
                        switchMap(([state, plans]) => this._budgetPlans$.savePlans(state.budget, plans)));

    if (budgetInput.status == BudgetStatus.InUse) 
      return combineLatest([save$, this.activateBudget()]);
    else
      return save$;
  }

  activateBudget() {
    const state$ = this._state$$;
    const plans$ = this._budgetPlan$$.getTransactionPlans$();

    let promoteBudgetData: {budget: FinancialExplorerState, plans: TransactionPlan[]};

    return combineLatest([state$, plans$])
                              .pipe(
                                    filter(([state, plans]) => !!state && !!plans),
                                    tap(([state, plans]) => promoteBudgetData = {budget: state, plans: plans}),
                                    switchMap(() => this._bs.httpsCallable('promoteBudget')(promoteBudgetData)));
  }
}