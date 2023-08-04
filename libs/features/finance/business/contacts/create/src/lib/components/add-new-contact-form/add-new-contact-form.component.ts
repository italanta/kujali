import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { sortBy as __sortBy, flatMap as __flatMap } from 'lodash';

import { Company } from '@app/model/finance/companies';

import { ContactsService } from '@app/state/finance/contacts'
import { CompaniesStore } from '@app/state/finance/companies'
import { TagsService } from '@app/state/tags';

import { _PhoneOrEmailValidator } from '@app/elements/forms/validators';
import { RolesFormFieldComponent } from '@app/elements/forms/form-fields';

import { CREATE_CONTACT_FORM } from '../model/create-contact-form.model';

@Component({
  selector: 'add-new-contact-form',
  templateUrl: './add-new-contact-form.component.html',
  styleUrls: ['./add-new-contact-form.component.scss'],
})
export class AddNewContactFormComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild(RolesFormFieldComponent) rolesComponent: RolesFormFieldComponent;

  companies: Company[];
  filteredCompanies: Company[];

  addNewContactFormGroup: FormGroup;
  isCompanyFilled: boolean = false;
  submitted = false;

  contactCompany: Company;
  countryCode: string = '32';

  //tags
  tags: string[] = [];
  tagCtrl = new FormControl();
  selectable = false;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  filteredTags: Observable<string[]>;
  allTags: string[];

  lang: 'fr' | 'en' | 'nl';

  constructor(private _fb: FormBuilder,
              private _tagsService: TagsService,
              private _companies$$: CompaniesStore,
              private _ContactService: ContactsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.addNewContactFormGroup = CREATE_CONTACT_FORM(this._fb);

    this.contactCompany = this.data;

    if (this.contactCompany) {
      this.isCompanyFilled = true;
      this.addNewContactFormGroup.patchValue({company : this.data.id});
      this.addNewContactFormGroup.controls['company'].disable();
    }

    this.getPageData();

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((tag: string | '') => {
        return tag ? this._filter(tag) : this.allTags?.slice();
      })
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  getPageData() {
    this._sbS.sink = this._companies$$.get().subscribe((companies) => {
      this.companies = __sortBy(companies, ['name']);
      this.filteredCompanies = this.companies.slice();
    });

    this._sbS.sink = this._tagsService.getTagsStore().subscribe((tags) => {
      this.allTags = __flatMap(tags, 'id');
    });
  }
  
  getCountryCode(country: any) {
    this.countryCode = country;
  }

  onSubmitForm() {
    this.submitted = true;

    if (this.addNewContactFormGroup.valid && this.rolesComponent.roles.valid) {
      let roleArray = this.rolesComponent.roles.value;

      if (this.isCompanyFilled) {
        this.addNewContactFormGroup.value.company = this.contactCompany.id;
      }

      this.addNewContactFormGroup.value.role = roleArray;
      this._ContactService.addNewContact(
        this.addNewContactFormGroup,
        this.countryCode,
        this.tags
      );
      this.submitted = false;
    }
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

  get phone() { return this.addNewContactFormGroup.get('phone') }
  get email() { return this.addNewContactFormGroup.get('email') }
  get fName() { return this.addNewContactFormGroup.get('fName') }
  get lName() { return this.addNewContactFormGroup.get('lName') }
  get role() { return this.addNewContactFormGroup.get('role') }

  ngOnDestroy = () => {this._sbS.unsubscribe()}
}
