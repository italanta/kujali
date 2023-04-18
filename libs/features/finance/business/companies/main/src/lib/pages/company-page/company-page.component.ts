import { Component, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@app/model/finance/companies';
import { Opportunity } from '@app/model/finance/opportunities';
// import { AppClaimDomains } from '@app/model/access-control';

import { CompaniesStore } from '@app/state/finance/companies';
import { OpportunitiesStore } from '@app/state/finance/opportunities';
// import { _CheckPermission } from '@app/state/access-control';

import { AddNewCompanyComponent } from '@app/features/finance/business/companies/create';

const DATA: Company[] = []

@Component({
  selector: 'app-finance-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.scss']
})
export class CompanyPageComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  displayedColumns: string[] = ['logoImgUrl', 'name', 'manager', 'headquarters', 'opportunities', 'tags'];
  dataSource = new MatTableDataSource(DATA);

  filter$$ = new BehaviorSubject<(Compamy) => boolean>((c) => true);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  opps$: Observable<Opportunity[]>;
  oppsList: Opportunity[];

  showFilter: boolean;

  allTableData = this.dataSource.data;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_COMPANIES = AppClaimDomains.CompanyCreate;

  constructor(private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private cdref: ChangeDetectorRef,
              private _translateService: TranslateService,
              private _companies$$: CompaniesStore,
              private _opps$$: OpportunitiesStore
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'name', direction: 'asc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.opps$ = this._opps$$.get()
    this._sbS.sink = this.opps$.subscribe(opps => this.oppsList = opps)

    this._sbS.sink =
      combineLatest([this.filter$$.asObservable(), this._companies$$.get()])
        .subscribe(([filter, cs]) => 
        {
          const filterRecords = cs.filter(filter);

          this.dataSource.data = filterRecords;
          this.allTableData = this.dataSource.data        
      });
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  fieldsFilter(value: (Company) => boolean) {    
    this.filter$$.next(value);    
  }

  getActiveOpps(companyId: string) {
    return this.oppsList?.filter(opps => {return opps.company == companyId}).length
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  viewcompany(id: string) {
    this.router.navigate(['/companies', id]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddNewDialog() {
    this._sbS.sink = this.dialog.open(AddNewCompanyComponent, {panelClass: 'full-width-dialog'})
    .afterClosed().subscribe();
  }
  ngOnDestroy = () => this._sbS.unsubscribe();
}
