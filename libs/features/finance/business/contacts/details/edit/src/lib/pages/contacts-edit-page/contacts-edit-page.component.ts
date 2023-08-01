import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { sortBy as __sortBy } from 'lodash';

import { __DateToStorage } from '@iote/time';
import { TranslateService } from '@ngfi/multi-lang';

import { Contact } from '@app/model/finance/contacts';
import { Role } from '@app/model/roles';

import { ActiveContactStore, ContactsService } from '@app/state/finance/contacts';
import { ContactRolesStore } from '@app/state/roles';
import { CompaniesService } from '@app/state/finance/companies';
import { PermissionsStateService } from '@app/state/organisation';

import { RolesFormFieldComponent, TagsFormFieldComponent } from '@app/elements/forms/form-fields';

import { AppClaimDomains } from '@app/model/access-control';

import { ChangeProfilePictureComponent } from '../../components/change-profile-picture/change-profile-picture.component';


@Component({
  selector: 'contacts-edit-page',
  templateUrl: './contacts-edit-page.component.html',
  styleUrls: ['./contacts-edit-page.component.scss'],
})
export class ContactsEditPageComponent implements OnInit {
  @ViewChild(TagsFormFieldComponent) tagsComponent: TagsFormFieldComponent;
  @ViewChild(RolesFormFieldComponent) rolesComponent: RolesFormFieldComponent;

  private _sbS = new SubSink();

  contactForm: FormGroup;
  role = new FormControl();
  roles$: Observable<Role[]>;

  contact$: Observable<Contact>;

  contact: Contact;
  contactId: string;

  genderCategory = [
    { value: this._translateService.translate('CONTACT.GENDER-SELECT.MALE') },
    { value: this._translateService.translate('CONTACT.GENDER-SELECT.FEMALE') },
  ];

  languageCategory = [
    { value: this._translateService.translate('CONTACT.MAIN-LANG.ENGLISH') },
    { value: this._translateService.translate('CONTACT.MAIN-LANG.DUTCH') },
    { value: this._translateService.translate('CONTACT.MAIN-LANG.FRENCH') },
  ];

  lang: 'fr' | 'en' | 'nl';
  companies: any;
  filteredCompanies: any;

  canEditContactDetails: boolean;

  readonly CAN_DELETE_CONTACTS = AppClaimDomains.ContactDelete;
  readonly CAN_EDIT_CONTACT = AppClaimDomains.ContactEdit;

  constructor(private _dialog: MatDialog,
              private _fb: FormBuilder,
              private _contact$$: ActiveContactStore,
              private _rolesStore$$: ContactRolesStore,
              private _translateService: TranslateService,
              private _contactService: ContactsService,
              private _companyService: CompaniesService,
              private _permissionsService: PermissionsStateService
  ) {}

  ngOnInit() {
    this.lang = this._translateService.initialise();

    this.roles$ = this._rolesStore$$.get();
    this.getActiveContact();
    this.getCompanies();

    this._checkPermissions();
  }

  ngAfterViewInit() {
    this.contact?.tags!.forEach((element) => {
      this.tagsComponent?.tags.push(element);
    });
  }

  private _checkPermissions() {
    this._sbS.sink = this._permissionsService
      .checkAccessRight((p: any) => p.ContactsSettings.CanEditContacts)
      .pipe(take(1))
      .subscribe((permissions) => {
        if (!permissions) {
          this.contactForm.disable();
          this.canEditContactDetails = false;
          this.tagsComponent.canEdit = true;
          this._permissionsService.throwInsufficientPermissions();
        }
      });
  }

  getActiveContact() {
    this._sbS.sink = this._contact$$.get().subscribe((contact) => {
      if (contact) {
        this.contact = contact;
        this._initForm(this.contact);
      }
    });
  }

  getCompanies() {
    this._sbS.sink = this._companyService
      .getCompanies()
      .subscribe((companies) => {
        this.companies = __sortBy(companies, ['name']);
        this.filteredCompanies = this.companies.slice();
      });
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  private _initForm(c: Contact) {
    this.contactForm = this._fb.group({
      id: [c.id],
      email: [c?.email ?? ''],
      fName: [c?.fName ?? ''],
      lName: [c?.lName ?? ''],
      role: [c?.role ?? []],
      phone: [c?.phone ?? ''],
      company: [c?.company ?? ''],
      tags: [c?.tags ?? ''],
      mainLanguage: [c?.mainLanguage ?? ''],
      address: [c?.address ?? ''],
      facebook: [c?.facebook ?? ''],
      linkedin: [c?.linkedin ?? ''],
      dob: [moment(c.dob.seconds * 1000) ?? ''],
      gender: [c?.gender ?? ''],
      restricted: [c?.restricted ?? false],
      accessibleBy: [c?.accessibleBy ?? []],
    });
  }

  updateContact() {
    this.contactForm.value.tags = this.tagsComponent.tags;
    this._contactService.updateContact(this.contactForm);
  }

  newProfileImg() {
    this._dialog.open(ChangeProfilePictureComponent).afterClosed().subscribe();
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  deleteContact(contact: Contact) {
    this._contactService.deleteContact(contact);
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}
