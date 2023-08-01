import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@app/model/finance/companies';
import { KuUser } from '@app/model/common/user';

import { ActiveCompanyStore, CompaniesService, CompaniesStore } from '@app/state/finance/companies';
import { ActiveOrgStore, OrganisationService } from '@app/state/organisation';

import { PermissionsStateService } from '@app/state/organisation';

import { TagsFormFieldComponent } from '@app/elements/forms/form-fields';

import { ChangeProfilePictureComponent } from '../../components/change-profile-picture/change-profile-picture.component';

import { AppClaimDomains } from '@app/model/access-control';

@Component({
  selector: 'companies-edit-page',
  templateUrl: './companies-edit-page.component.html',
  styleUrls: ['./companies-edit-page.component.scss']
})

export class CompaniesEditPageComponent implements OnInit, AfterViewInit {

  private _sbS = new SubSink();

  @ViewChild(TagsFormFieldComponent) tagsComponent: TagsFormFieldComponent;
  companyForm: FormGroup;

  orgId: string;

  orgUsers : KuUser[];
  filteredUsers : KuUser[];

  company$: Observable<Company>;
  company: Company;
  companyData: Company;
  companyTags: string[];

  isShown: boolean
  canEditCompanyDetails: boolean = false;

  countryCode: string = '32';

  lang: 'fr' | 'en' | 'nl';

  readonly CAN_DELETE_COMPANIES = AppClaimDomains.CompanyDelete;
  readonly CAN_EDIT_COMPANY = AppClaimDomains.CompanyEdit;

  constructor(private location: Location,
              private _company$$: ActiveCompanyStore,
              private _companies$$: CompaniesStore,
              private _translateService: TranslateService,
              private _dialog: MatDialog,
              private _fb: FormBuilder,
              private _orgsService$$: OrganisationService,
              private _org$$ : ActiveOrgStore,
              private _companiesService: CompaniesService,
              private _permissionsService: PermissionsStateService
  )   
  { }

  ngOnInit() {
    this.lang = this._translateService.initialise();

    this.getPageData();

    this._sbS.sink = this._company$$.get()
        .subscribe((company) => {
          if (company) {
            this.companyData = company;
            this._initForm(this.companyData);
            this._getOrgUsers();
            this._checkPermissions();
          }
        });
  }

  ngAfterViewInit () {
    this.companyData?.tags!.forEach(element => {
      this.tagsComponent?.tags.push(element);
    });
  }

  private _checkPermissions() {
    this._sbS.sink = this._permissionsService.checkAccessRight((p: any) => p.CompanySettings.CanEditCompanies).pipe(take(1)).subscribe((permissions) => {
      if (!permissions) {
        this.companyForm.disable();
        this.tagsComponent.canEdit = true;
        this._permissionsService.throwInsufficientPermissions();
      }
    })
  }

  getPageData() {
    this._sbS.sink = this._org$$.get().subscribe((org) => { this.orgId = org?.id!});     
  }

  private _getOrgUsers () {
    this._sbS.sink = this._orgsService$$.getOrgUsersDetails().subscribe((users) => {
      this.orgUsers = users;      
      this.filteredUsers = this.orgUsers.slice();  
    });
  }

  private _initForm(c: Company) {
    this.companyForm = this._fb.group({
      id:[],
      email: [c?.email ?? ''],
      phone: [c?.phone ?? ''],
      name: [c.name ?? ''],
      tags: [c?.tags ?? ''],
      hq: [c.hq ?? ''],
      facebook: [c?.facebook ?? ''],
      linkedin: [c?.linkedin ?? ''],
      vatNo: [c?.vatNo ?? ''],
      accManager: [c?.accManager ?? ''],
      website: [c?.website ?? ''],
      slogan: [c?.slogan ?? ''],
      restricted: [c?.restricted ?? false],
      accessibleBy: [c?.accessibleBy ?? ''],
    });
  }

  initTags(tags: string[]) {
    tags.forEach(tags => {
      this.companyTags.push(tags)
    });
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  onCountryChange(country: any) {
    this.countryCode = country.dialCode;
  }

  submit(val: Company) {
    this.company = val
    this.tagsComponent.tags = [];

    this.tagsComponent.tags.forEach(tag => {
      this.company.tags?.push(tag)
    });

    this._sbS.sink =
      this._companies$$.update(this.company)
        .subscribe((success) => {
          this.location.back();
        });
  }

  updateCompany() {
    this.companyForm.value.id = this.companyData.id;
    this.companyForm.value.tags = this.tagsComponent.tags;
    this.submit(this.companyForm.value)
  }

  newProfileImg() {
    this._dialog.open(ChangeProfilePictureComponent)
      .afterClosed()
      .subscribe();
  }

  deleteCompany(company: Company) {
    this._companiesService.deleteCompany(company);
  }

  ngOnDestroy = () => this._sbS.unsubscribe()
}
