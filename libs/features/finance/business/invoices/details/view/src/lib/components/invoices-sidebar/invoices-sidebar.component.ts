import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

// import { AppClaimDomains } from '@app/model/access-control';
import { Invoice } from '@app/model/finance/invoices';

import { InvoicesService } from '@app/state/finance/invoices';

@Component({
  selector: 'kujali-invoices-sidebar',
  templateUrl: './invoices-sidebar.component.html',
  styleUrls: ['./invoices-sidebar.component.scss']
})
export class InvoicesSidebarComponent implements OnInit {

  private _sbS = new SubSink();
  @Input() canEditInvoice: boolean;
  @Input() activeInvoice: Invoice;
  
  @Output() showPreviewEvent = new EventEmitter();
  @Output() sendInvoiceEvent = new EventEmitter();
  @Output() downloadInvoiceEvent = new EventEmitter();
  @Output() currencyChangedEvent = new EventEmitter();
  @Output() includeStructuredMessageEvent = new EventEmitter<boolean>();
  
  isEditMode: boolean =  false;
  hasStructuredMessage: boolean = false;

  disabled:boolean = false;

  currency: string = 'EUR';

  // readonly CAN_SEND_INVOICE = AppClaimDomains.InvSend;

  constructor(private _router$$: Router,
              private _invoiceService$$: InvoicesService,
  ) { }

  ngOnInit(): void {
    let page = this._router$$.url.split('/');
    if (page.length > 3 && page[3] == 'edit') {
      this.isEditMode = true;
      this.getActiveInvoice();
    }
  }

  getActiveInvoice() {
    this._sbS.sink = this._invoiceService$$.getActiveInvoice().subscribe((invoice) => {
      if (invoice) {
        this.hasStructuredMessage = invoice.structuredMessage != '' ? true : false;
        this.currency = invoice.currency;
        this.currencyChangedEvent.emit(invoice.currency);
      }
    })
  }

  sendInvoice () {
    this.disabled = true;
    this.sendInvoiceEvent.emit();
    setTimeout(() => {
      this.disabled = false
    }, 2000);
  }

  showPreview(){
    this.showPreviewEvent.emit();
  }

  downloadInvoice() {
    this.downloadInvoiceEvent.emit();
  }

  currencyChanged(currency: MatSelectChange){
    this.currencyChangedEvent.emit(currency.value);
  }

  includeStructuredMessage(event: MatSlideToggleChange){
    this.includeStructuredMessageEvent.emit(event.checked);
  }
}
