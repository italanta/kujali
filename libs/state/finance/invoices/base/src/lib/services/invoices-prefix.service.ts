import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InvoicesPrefix } from '@volk/model/crm/invoices';

import { InvoicesPrefixStore } from '../stores/invoice-prefix.store';

@Injectable({
  providedIn: 'root'
})
export class InvoicesPrefixService {

  constructor(private _invoicesPrefix$$: InvoicesPrefixStore) { }

  getInvoicePrefix() {
    return this._invoicesPrefix$$.get();
  }
  
  saveInvoicePrefix(prefix) {
    let prefixData: InvoicesPrefix = {
      prefix: prefix.invoicesPrefix ?? prefix.prefix,
      number: prefix.currentInvoiceNumber ?? prefix.number,
      extraNote: prefix.extraNote,
      termsAndConditionsDocUrl: prefix.termsAndConditionsDocUrl
    }

    debugger
    this._invoicesPrefix$$.set(prefixData as InvoicesPrefix);
  }
}
