
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

import { SubSink } from 'subsink';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';

// import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { ContactsStore } from '@app/state/finance/contacts';
// import { _CheckPermission } from '@app/state/access-control';

import { __NullContactsFilter } from '../components/contacts-filter/contacts-filter.interface';

import { AddNewContactFormComponent } from '@app/features/finance/business/contacts/create';

const DATA: Contact[] = []

@Component({
  selector: 'app-crm-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent implements OnInit, AfterViewInit, OnDestroy
{
  private _sbS = new SubSink();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['imageurl', 'fullName', 'phone', 'email', 'company', 'roles', 'tags'];

  dataSource = new MatTableDataSource(DATA);

  filter$$ = new BehaviorSubject<(Contact) => boolean>((c) => true);
  filter$: Observable<{ companies: Company[]}>

  showFilter: boolean;

  allTableData = this.dataSource.data;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_CONTACTS = AppClaimDomains.ContactCreate;

  constructor(private router: Router, 
              public dialog: MatDialog,
              private cdref: ChangeDetectorRef,
              private _translateService: TranslateService,
              private _snackBar: MatSnackBar,
              private _oppsService: OpportunitiesService,
              private _contacts$$: ContactsStore,
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'fullName', direction: 'asc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this._sbS.sink =
      combineLatest([this.filter$$.asObservable(), this._contacts$$.get()])
        .subscribe(([filter, cs]) => 
        {
          let contacts = cs.map((c) => {
            return { ...c, fullName: `${c.fName} ${c.lName}` }
          });

          const filterRecords = contacts.filter(filter);
          this.dataSource.data = filterRecords;
          this.allTableData = this.dataSource.data        
      });
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getCompanyNames(id: string): string {
    return this._oppsService.getCompanyNames(id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (Contact) => boolean) {    
    this.filter$$.next(value);
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  openAddNewDialog() {
    this._sbS.sink = this.dialog.open(AddNewContactFormComponent, {minWidth: '700px'})
    .afterClosed().subscribe();
  }

  viewContact(id: string) {
    this.router.navigate(['/contacts', id]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}
