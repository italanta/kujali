import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { round as __round, flatMap as __flatMap, cloneDeep as __cloneDeep } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Invoice } from '@app/model/finance/invoices';

import { InvoiceModelService } from '../../services/invoice-model.service';
import { InvoiceFormsService } from '../../services/invoice-forms.service';

@Component({
  selector: 'kujali-invoices-products',
  templateUrl: './invoices-products.component.html',
  styleUrls: ['./invoices-products.component.scss']
})
export class InvoicesProductsComponent implements OnInit {

  private _sbS = new SubSink();

  @Input() orderInvoice: Invoice;
  @Input() invoiceFormGroup: FormGroup;

  @Input() currency: Observable<string>;

  productsLoaded: boolean = false;

  activeOrderId: string;
  activeOrder: any;
  orderStatus: string;

  invoiceCurrency: string = 'EUR';

  subTotal: number = 0;
  vatTotal: number = 0;
  finalTotal: number = 0;
  uniqueVat: any;

  items = ['Item 1'];
  expandedIndex = 0;

  productsArray: FormArray;

  isEditMode: boolean;

  _page: string[];

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;
  // readonly CAN_EDIT_INVOICES = AppClaimDomains.InvEdit;

  constructor(private _router$$: Router,
              private _cdf: ChangeDetectorRef,
              private _invoiceFormService: InvoiceFormsService,
              private _invoicesModelService: InvoiceModelService,
  ) { }

  ngOnInit(): void {    
    this._page = this._router$$.url.split('/');
    this.currency.subscribe((c) => {this.invoiceCurrency = c})

    this.productsArray = this.invoiceFormGroup.get('products') as FormArray;

    this.isEditMode = this._page.length > 2 && this._page[3] === 'edit' ? true : false;
  }

  autoFillProductData(productData: any, productIndex: number) {
    let patchP = this.productsArray.at(productIndex) as FormGroup;
    patchP.patchValue({cost : productData.option.value.sellingPrice, vat: productData.option.value.tax});
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : user;
  }

  ngAfterContentChecked(): void {
    this.getSubToTalData();
    this.productsArray = this.invoiceFormGroup.get('products') as FormArray;
    this.productsArray.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  ngAfterViewInit(): void {
    const page = this._router$$.url.split('/')[2];
    this.activeOrderId = page;
    this.productsLoaded = true;
    this._cdf.detectChanges();
  }

  getDate(date: any) {
    if (date && this._page[2] != 'create') {
      return __DateFromStorage(date).format("DD/MM/YYYY");
    }
    return '-'
  }

  getInvoiceProducts(){
    return this.invoiceFormGroup.get('products') as FormArray;
  }

  addInvoiceItem() {
    this.productsArray.push(this._invoiceFormService.newProduct());
  }

  removeInvoiceProduct(productIndex: number) {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(productIndex);
    }
  }

  getDiscountFields(item: any) {
    return item.controls.discount as FormArray;
  }

  addDiscount(item: any) {
    item.controls.discount.push(new FormControl(0));
  }

  discountTotal(product : any): number {
    return this._invoicesModelService.discountTotal(product);
  }

  calculateProductTotal(product: any) {    
    return this._invoicesModelService.calculateProductTotal(product);
  }

  getVat(vat: any) {
    return this._invoicesModelService.getVat(vat);
  }

  getSubToTalData() {
    this.productsArray.valueChanges.subscribe((quotes: any) => {
      let result: any = this._invoicesModelService.getSubTotals(quotes, this.uniqueVat);
      this.uniqueVat = result.uniqueVat;
      this.subTotal = __round(result.totalResult, 2);
      this.vatTotal = __round(result.totalVatResult, 2);
      this.finalTotal = this.subTotal + this.vatTotal;
    });
  }

  dropProduct(event: CdkDragDrop<any>) {
    this._invoicesModelService.dropProduct(event, this.productsArray, this.invoiceFormGroup);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
