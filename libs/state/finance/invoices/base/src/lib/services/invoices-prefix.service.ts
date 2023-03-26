import { Injectable } from '@angular/core';

import { InvoicesPrefix } from '@app/model/finance/invoices';

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

    this._invoicesPrefix$$.set(prefixData as InvoicesPrefix);
  }
}
