import { IObject } from "@iote/bricks";

export interface Allocation extends IObject {
  // unique to invoice
  invoiceId: string;

  // unique to payment
  paymentId: string;

  // payment amount
  amount: number;
}