import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { BackendService } from '@ngfi/angular';
import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@volk/model/crm/companies';
import { Contact } from '@volk/model/crm/contacts';

import { CompaniesStore } from '@app/state/finance/companies';
import { TagsService } from '@volk/state/crm/tags'
import { ContactsStore } from '@volk/state/crm/contacts';

import { DeleteModalComponent } from '@volk/elements/crm/modals';

@Injectable({
  providedIn: 'root',
})

export class CompaniesService implements OnDestroy {
  private _sbS = new SubSink();

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _router$$: Router,
              public dialog: MatDialog,
              private _translateService: TranslateService,
              private _snackBar: MatSnackBar,
              private _companies$$: CompaniesStore,
              private _contacts$$: ContactsStore,
              private _tagsService:  TagsService,
              private _bs: BackendService
  ) { }

  getCompanies() {
    return this._companies$$.get();
  }
  
  capitalizeFirstLetter(str : string) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }

  updateContactWithNewCompany(company: Company, contact: Contact, tags: any[]) {
    this._sbS.sink = this._companies$$.add(company as Company).subscribe((company) => {
      if (company) {
        contact.company = company.id;
        this._contacts$$.update(contact).subscribe((success) => {
          if (success) {
            this._tagsService.createTags(tags);
            this._router$$.navigate(['companies', company.id]);
            this.openSnackBar();
            this.dialog.closeAll();
          }
        })
      }
    });
  }

  createContactWithNewCompany(company: Company, contact: Contact, tags: any[]) {
    this._sbS.sink = this._companies$$.add(company as Company).subscribe((company) => {
      if (company) {
        contact.company = company.id;
        this._contacts$$.add(contact).subscribe((success) => {
          if (success) {
            this._tagsService.createTags(tags);
            this._router$$.navigate(['companies', company.id]);
            this.openSnackBar();
            this.dialog.closeAll();
          }
        })
      }
    });
  }

  createOnlyCompany(orgId: string, company: any, tags) {    
    company.name = this.capitalizeFirstLetter(company.name);
    company.tags = tags;
    
    if (company.contact != "") {
      let contact = company.contact;
      company.contact = '';
      this.updateContactWithNewCompany(company, contact, tags);
    } else {
      delete company.contactDetails;
      this._sbS.sink = this._companies$$.add(company as Company).subscribe((company) => {
        if (company) {
          this._tagsService.createTags(tags);
          this._router$$.navigate(['companies', company.id]);
          this.openSnackBar();
          this.dialog.closeAll();
        }
      });
    }
  }

  createCompanyWithContact(orgId: string, companyDetails: any, tags, countryCode) {
    let contactDetails = companyDetails.contactDetails 

    companyDetails.tags = tags;
    contactDetails.fName = this.capitalizeFirstLetter(contactDetails.fName)

    if (contactDetails.phone != ""){
      contactDetails.phone = '+' + countryCode + contactDetails.phone;
    }
    
    const contact: Contact = {
      fName: contactDetails.fName,
      lName: contactDetails.lName,
      phone: contactDetails.phone,
      email: contactDetails.email,
      role: [],
      gender: '',
      mainLanguage: '',
      logoImgUrl: '',
      company: '',
      tags: [],
      address: '',
      facebook: '',
      linkedin: '',
      dob: ''
    };

    delete companyDetails.contactDetails;    
    this.createContactWithNewCompany(companyDetails, contact, tags);
  }

  openSnackBar() {
    this._snackBar.open(
      this._translateService.translate('COMPANY.SNACKBAR.CREATE-COMPANY'),
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2000,
      }
    );
  }

  deleteCompany(company: Company) {
    let deleteDialogRef = this.dialog.open(DeleteModalComponent, {
      data: 'Company',
      minWidth: 'fit-content'
    })

    deleteDialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption?.event == 'delete') {
        this._companies$$.remove(company).subscribe((success) => {
          this._router$$.navigate(['companies']);
        });
      }
    })
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}