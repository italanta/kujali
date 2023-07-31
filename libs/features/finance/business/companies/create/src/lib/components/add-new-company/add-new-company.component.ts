import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { sortBy as __sortBy, flatMap as __flatMap } from 'lodash';

import { AppClaimDomains } from '@app/model/access-control';

import { ContactsService } from '@app/state/finance/contacts'
import { CompaniesService } from '@app/state/finance/companies';
import { OrganisationService } from '@app/state/organisation';
import { TagsService } from '@app/state/tags';

import { _PhoneOrEmailValidator } from '@app/elements/forms/validators';

import { CREATE_COMPANY_FORM } from '../../model/create-company-form.model';


@Component({
  selector: 'add-new-company',
  templateUrl: './add-new-company.component.html',
  styleUrls: ['./add-new-company.component.scss'],
})
export class AddNewCompanyComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  addNewCompanyFormGroup: FormGroup;

  contactList: any[];
  filteredContactList: any;

  submitted = false;
  showContact = false;

  orgId: string;
  selectedValue: string;

  countryCode: string = '32';

  tags: string[] = [];
  tagCtrl: FormControl = new FormControl();
  selectable = false;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  allTags: string[];
  filteredTags: Observable<string[]>;

  lang: 'fr' | 'en' | 'nl';

  readonly CAN_CREATE_CONTACTS = AppClaimDomains.ContactCreate;

  constructor(private _FB: FormBuilder,
              private _tagsService: TagsService,
              private _contact$$: ContactsService,
              private _org$$: OrganisationService,
              private _companyService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.addNewCompanyFormGroup = CREATE_COMPANY_FORM(this._FB);

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((tag: string | '') => {
        return tag ? this._filter(tag) : this.allTags?.slice();
      })
    );
  }

  private _filter(value) {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  public get contact(): any {
    return this.addNewCompanyFormGroup.get('contactDetails') as FormGroup;
  }

  getPageData() {
    this._sbS.sink = this._org$$.getActiveOrg().subscribe((org) => {
      this.orgId = org.id!;
    });

    this._contact$$.getContacts().subscribe((contacts) => {
      contacts = __sortBy(contacts, ['fName'])
        .map((c) => ({ ...c, fullName: `${c.fName} ${c.lName}` }))
        .filter((contact) => {
          return contact.company == '' || contact.company == null;
        });
      this.contactList = contacts;
      this.filteredContactList = this.contactList.slice();
    });

    this._sbS.sink = this._tagsService.getTagsStore().subscribe((tags) => {
      this.allTags = __flatMap(tags, 'id');
    });
  }

  onCountryChange(country: any) {
    this.countryCode = country.dialCode;
  }

  get contactForm() {
    return this.addNewCompanyFormGroup.get('contactDetails') as FormGroup;
  }

  submitForm() {
    this.submitted = true;
    const company: any = this.addNewCompanyFormGroup.value;

    if (!this.showContact && company.name != '' && company.hq != '') {
      delete company.contactDetails;
      this._companyService.createOnlyCompany(this.orgId, company, this.tags);
    }

    if (this.addNewCompanyFormGroup.valid) {
      delete company.contact;
      this._companyService.createCompanyWithContact(this.orgId, company, this.tags, this.countryCode);
      this.showContact = false;
    }
  }

  getCountryCode(country) {
    this.countryCode = country;
  }

  toggleContact() {
    this.showContact = !this.showContact;
  }

  //tags
  add(event: MatChipInputEvent): void {
    this._tagsService.addTag(event, this.tags, this.tagCtrl);
  }

  remove(tag: string): void {
    this._tagsService.removeTag(tag, this.tags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  ngOnDestroy = () => {
    this._sbS.unsubscribe();
  };
}
