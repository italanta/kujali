import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import * as moment from 'moment';

import { __DateToStorage } from '@iote/time';

import { Opportunity } from '@app/model/finance/opportunities';
import { Tags } from '@app/model/tags';

import { TagsStore } from '@app/state/tags';
import { ContactsStore } from '@app/state/finance/contacts';
import { CompaniesStore } from '@app/state/finance/companies';

import { DeleteModalComponent } from '@app/elements/modals';

import { OpportunitiesStore } from '../stores/opportunities.store';
import { ActiveOpportunityStore } from '../stores/active-opportunity.store';

@Injectable({
  providedIn: 'root',
})

export class OpportunitiesService {
  private _sbS = new SubSink();

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  contactsList: any;
  companiesList: any;

  contactSubmitted: boolean;
  companySubmitted: boolean;

  constructor(private _router$$: Router,
              private _dialog: MatDialog,
              private _bs: AngularFireFunctions,
              private _opportunity$$: OpportunitiesStore,
              private _opps$$: ActiveOpportunityStore,
              private _contacts$$: ContactsStore,
              private _companies$$: CompaniesStore,
              private _tags$$: TagsStore,
  ) 
  {
    this._sbS.sink = this._companies$$.get().subscribe((companies) => {
      this.companiesList = companies;
    });

    this._sbS.sink = this._contacts$$.get().subscribe((contacts) => {
      this.contactsList = contacts;
    });
  }

  getOpportunities(){
    return this._opportunity$$.get()
  }

  getActiveOpportunity(){
   return this._opps$$.get();
  }

  getContactNames(id: string): string {
    let contact = this.contactsList ? this.contactsList.find((contact) => contact.id == id): '';
    return contact?.fName ? contact.fName + ' ' + contact?.lName : '';
  }

  getCompanyNames(id: string): string {
    let company = this.companiesList ? this.companiesList.find((company) => company.id == id) ?? '' : '';
    return company?.name ? company.name : '';
  }

  getCompanyAndContacts () {
    return combineLatest([this._opps$$.get(), this._companies$$.get(),this._contacts$$.get()])
  }

  getCompanyAndContactsList () {
    return combineLatest([this._opportunity$$.get(), this._companies$$.get(),this._contacts$$.get()])
  }

  submitTagArray(tags) {
    let tagArray = tags.map((tags) => {
      return {
        id: tags,
        label: 'CONTACT.TAG.' + `${tags}`.toUpperCase(),
      };
    });

    tagArray.forEach((tag) => {
      this._sbS.sink = this._tags$$
        .add(tag as Tags, tag.id)
        .subscribe((c) => {});
    });
  }

  submitOps(orgId: string, addNewOpportunityForm: FormGroup, tags, contactFormGroup: FormGroup, companyFormGroup: FormGroup) 
  {
    let opps = addNewOpportunityForm.value;
    let contact = contactFormGroup;
    let company = companyFormGroup;

    opps.deadline = __DateToStorage(moment(addNewOpportunityForm.value.deadline));
    opps.status = 'New';
    opps.tags = tags;        
        
    if (company.valid || contact.valid){
      const data = {
        orgId: orgId,
        contact: contact.valid ? contact.value : '',
        company: company.valid ? company.value: '',
        opps: opps
      }      

      this._bs.httpsCallable('createOppsWithContactOrCompany')(data).subscribe();

    } else {
      opps.company = company.value.company
      opps.contact = contact.value.contact
      this.createOpps(opps)
    }
    
    this.submitTagArray(tags)
  }

  updateOpps(opps: FormGroup) {
    this._sbS.sink = this._opportunity$$.update(opps.value as Opportunity).subscribe((success) => {
      this._router$$.navigate(['opportunities', opps.value.id]);
    });
  }

  createOpps(opps: Opportunity) {
    this.cleanOpps(opps);    
    this._sbS.sink = this._opportunity$$.add(opps as Opportunity).subscribe();
  }

  cleanOpps(opps: Opportunity): Opportunity {
    let company: any = opps.company;
    let contact: any = opps.contact;

    if (typeof(company) != 'string'){
      opps.company = company.id
    }
    if (typeof(contact) != 'string'){
      opps.contact = contact.id
    }

    return opps
  } 
  
  deleteOpportunity(opps: Opportunity) {
    let deleteDialogRef = this._dialog.open(DeleteModalComponent, {
      data: 'Opportunity',
      minWidth: 'fit-content'
    })

    deleteDialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption?.event == 'delete') {
        this._opportunity$$.remove(opps).subscribe((success) => {
          this._router$$.navigate(['opportunities']);
        })
      }
    })
  }
}
