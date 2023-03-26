import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';

import { take } from 'rxjs/operators';

import { __DateToStorage } from '@iote/time';

import { TranslateService } from '@ngfi/multi-lang';

import { Contact } from '@volk/model/crm/contacts';

import { TagsService } from '@volk/state/crm/tags';

import { DeleteModalComponent } from '@volk/elements/crm/modals';
import { FileStorageService } from '@volk/features/crm/files';

import { ContactsStore, ActiveContactStore } from '../..';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private _sbS = new SubSink();

  contact: Contact;
  val: Contact;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _router$$: Router,
              private location: Location,
              public dialog: MatDialog,
              // private _tags$$: TagsService,
              private _contacts$$: ContactsStore,
              private _contact$$: ActiveContactStore,
              private _snackBar: MatSnackBar,
              private _translateService: TranslateService,
              // private _fileStorageService$$: FileStorageService
  ) {}

  getContacts(){
    return this._contacts$$.get();
  }

  getActiveContact() {
    return this._contact$$.get();
  }

  capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }

  removePeriods(str: string) {
    const cleaned = str.split('.').join('');
    return cleaned;
  }

  updateContact(contactForm: FormGroup) {
    if (contactForm.value.dob._isValid) {
      contactForm.value.dob = __DateToStorage(contactForm.value.dob);
    } else {
      contactForm.value.dob = '';
    }    
    this._sbS.sink = this._contacts$$.update(contactForm.value as Contact)
      .subscribe((success) => {
        this.location.back();
      });
  }

  updatePhotoUrl(fileUrl: string) {
    this._sbS.sink = this._contact$$.get().pipe(take(1))
      .subscribe((c) => {
        if (c.logoImgUrl && c.logoImgUrl != '') {
          this._fileStorageService$$.deleteSingleFile(c.logoImgUrl!).subscribe();
        }
        c.logoImgUrl = fileUrl;
        this._sbS.sink = this._contacts$$.update(c).pipe(take(1)).subscribe();
      });
  }

  addNewContact(
    addNewContactFormGroup: FormGroup,
    countryCode: string,
    tags?: string[]
  ) {
    addNewContactFormGroup.value.tags = tags;
    addNewContactFormGroup.value.fName = this.capitalizeFirstLetter(
      addNewContactFormGroup.value.fName
    );

    let phone = addNewContactFormGroup.value.phone;

    if (phone != '') {
      addNewContactFormGroup.value.phone = '+' + countryCode + phone;
    }

    this._tags$$.createTags(tags!);

    this._sbS.sink = this._contacts$$
      .add(addNewContactFormGroup.value as Contact)
      .subscribe((result) => {
        this.openSnackBar();
        this.dialog.closeAll();
      });
  }

  deleteContact(contact: Contact) {
    let deleteDialogRef = this.dialog.open(DeleteModalComponent, {
      data: 'Contact',
      minWidth: 'fit-content'
    })

    deleteDialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption?.event == 'delete') {
        this._contacts$$.remove(contact).subscribe((success) => {
          this._router$$.navigate(['contacts']);
        })
      }
    })
  }

  openSnackBar() {
    this._snackBar.open(
      this._translateService.translate('CONTACT.SNACKBAR.CREATE-CONTACT'),
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration : 2000
      }
    );
  }
}
