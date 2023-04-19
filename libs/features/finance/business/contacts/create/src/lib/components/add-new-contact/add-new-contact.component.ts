import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'add-new-contact',
  templateUrl: './add-new-contact.component.html',
  styleUrls: ['./add-new-contact.component.scss'],
})

export class AddNewContactComponent implements OnInit {

  @Input() contact: FormGroup;
  @Output() countryCodeEvent = new EventEmitter();

  countryCode: string = '32';

  lang: 'fr' | 'en' | 'nl';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void { }

  onCountryChange(country: any) {
    this.countryCodeEvent.emit(country.dialCode)
  }
}
