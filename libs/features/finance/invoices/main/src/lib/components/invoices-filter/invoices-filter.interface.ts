/**
 * Selected filter header options for invoices page.
 */
 export interface InvoicesFilter 
 {
   isFiltered: boolean;
 
   allowedAssigned: string[];
   allowedCompanies: string[];
   allowedContacts: string[];
   allowedDeadline: any;
   allowedStatus: string[];
 
   search: string;
 }
 
 export function __NullInvoicesFilter() : InvoicesFilter
 {
   return {
     isFiltered: false,
 
     allowedAssigned: [],
     allowedCompanies: [],
     allowedContacts: [],
     allowedDeadline: '',
     allowedStatus: [],
 
     search: ''
   }
 }