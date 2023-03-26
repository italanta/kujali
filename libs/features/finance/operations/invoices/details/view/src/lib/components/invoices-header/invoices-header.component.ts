import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngfi/multi-lang';

// import { AppClaimDomains } from '@app/model/access-control';

@Component({
  selector: 'kujali-invoices-header',
  templateUrl: './invoices-header.component.html',
  styleUrls: ['./invoices-header.component.scss']
})
export class InvoicesHeaderComponent implements OnInit {

  @Input() invoiceNumber: string;
    
  @Output() saveInvoiceProgressEvent = new EventEmitter();
  @Output() deleteInvoiceEvent = new EventEmitter();
  @Output() copyInvoiceEvent = new EventEmitter();

  isEditMode: boolean;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;
  // readonly CAN_EDIT_INVOICES = AppClaimDomains.InvEdit;
  // readonly CAN_DELETE_INVOICE = AppClaimDomains.InvDelete;

  constructor(private _router$$: Router,
              private _translateService: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.lang = this._translateService.initialise();
    const page = this._router$$.url.split('/')[2];

    if (page != 'create') {
      this.isEditMode = true;
    }
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  saveProgress() {
    this.saveInvoiceProgressEvent.emit();
  }

  copyInvoice() {
    this.copyInvoiceEvent.emit();
  }

  deleteInvoice() {
    this.deleteInvoiceEvent.emit();
  }

  goBack(){
    this._router$$.navigate(['invoices']);
  }

}
