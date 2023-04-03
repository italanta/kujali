import { round as __round } from "lodash";

import { Invoice } from "@app/model/finance/invoices";

export function CALC_INV_TOTAL (invoice: Invoice) {
  let products = invoice.products;
  let totals = products.map((order) => {
    const total =
      order.cost * order.qty - (order.cost * order.qty * order.discount! ?? 0) / 100;
    return {
      totalSum: total,
      vat: total * (order.vat / 100),
    };
  });

  var totalResult = totals.reduce(function (order: any, value: any) {
    return order + value.totalSum + value.vat;
  }, 0);

  return __round(totalResult, 2);
}