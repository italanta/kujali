import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { round as __round, flatMap as __flatMap, 
groupBy as __groupBy } from 'lodash';

import { Logger } from '@iote/bricks-angular';

// import { InvoicePdfComponent } from '@app/features/finance/operations/invoices/details/invoice-documents';

@Injectable({
  providedIn: 'root'
})
export class InvoiceModelService 
{  
  constructor(private _fb: FormBuilder,
              private dialog: MatDialog,
              private _logger: Logger) 
  { }

  showFormPreview(pdfdata: any) {    
    // const dialogRef = this.dialog.open(InvoicePdfComponent, {
    //   width: '816px',
    //   height: '1054px',
    //   data: {
    //     customer: pdfdata.customer,
    //     company: pdfdata.company,
    //     invoice: pdfdata.invoice,
    //     currency: pdfdata.currency,
    //     printInvoice: pdfdata.printInvoice,
    //     invoiceNumber: pdfdata.invoiceNumber
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {});
  }

  calculateProductTotal(item: any) {    
    const cost = item.value.cost;
    const qty = item.value.qty;
    const discount = item.value.discount;

    const totalCost = cost * qty;
    return __round((totalCost - totalCost * (discount / 100)), 2);
  }

  discountTotal(item : any): number {
    const cost = item.value.cost;
    const qty = item.value.qty;
    const discount = item.value.discount;

    return __round((cost * qty) * (discount / 100), 2);
  }

  getFormValues(products: any) {
    let totals: any = products.map((product) => {        
      const total =
      product.cost * product.qty - (product.cost * product.qty * product.discount) / 100;
      return {
        totalSum: total,
        vat: total * (product.vat / 100),
        vatPercent: product.vat
      };
    });
    return totals;
  }

  getVat(vat: any) {
    var totalVatResult = vat.reduce(function (quote: any, value: any) {
      return quote + value.vat;
    }, 0);
    let uVat = {
      vat: vat[0].vatPercent,
      total: __round(totalVatResult, 2)
    }
    return uVat;
  }

  getSubTotals(quotes: any, uniqueVat) {
    let totals = this.getFormValues(quotes);
      
    let vats = __groupBy(totals, 'vatPercent');
    uniqueVat = Object.values(vats);     
    
    var totalResult = totals.reduce(function (quote: any, value: any) {
      return quote + value.totalSum;
    }, 0);

    var totalVatResult = totals.reduce(function (quote: any, value: any) {
      return quote + value.vat;
    }, 0);

    let result = {
      totalResult: totalResult,
      totalVatResult: totalVatResult,
      uniqueVat: uniqueVat
    }
    return result;
  }
  
  dropProduct(event: CdkDragDrop<any>, productsArray: FormArray, invoices: FormGroup) {
    moveItemInArray(productsArray.controls, event.previousIndex, event.currentIndex);
    invoices.value.products = this.swapIndexes(event, invoices);
  }

  swapIndexes(event: CdkDragDrop<any>, invoices: FormGroup) {
    let form =  invoices.value.products;

    let temp = form[event.currentIndex];
    form[event.currentIndex] = form[event.previousIndex];
    form[event.previousIndex] = temp
    return form;
  }
}
