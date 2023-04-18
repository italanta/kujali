import { Invoice, InvoiceAllocation } from "@app/model/finance/invoices";

export function COMBINE_INVOICE_AND_INVOICE_ALLLOCS(invoices: Invoice[], invoiceAllocations: InvoiceAllocation[]) {
  return invoices.map((inv) => {
    const allocs = invoiceAllocations.find((alloc) => alloc.id === inv.id);
    return allocs ? { ...inv, ...allocs } : inv;
  });
}