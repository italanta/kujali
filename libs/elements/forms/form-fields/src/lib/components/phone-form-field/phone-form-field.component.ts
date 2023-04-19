import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'volk-crm-phone-form-field',
  templateUrl: './phone-form-field.component.html',
  styleUrls: ['./phone-form-field.component.scss']

})

export class PhoneFormFieldComponent implements OnInit {

  @Input() dataForm: FormGroup

  countryCode: string = '32';

  constructor ()  { }

  ngOnInit() { }

  validatePhoneNumber(event: any) {
    return event.charCode >= 48 && event.charCode <= 57;
  }
}
