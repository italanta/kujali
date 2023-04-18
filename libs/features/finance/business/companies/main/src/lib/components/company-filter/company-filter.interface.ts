/**
 * Selected filter header options for contacts page.
 */
 export interface CompanyFilter 
 {
   isFiltered: boolean;
 
   allowedCompanies: string[];
   allowedHqs: string[];
   allowedTags: string[];
 
   /** String-based filter for the remaining allowed contacts after initial filter. */
   search: string;
 }
 
 export function __NullCompanyFilter() : CompanyFilter
 {
   return {
     isFiltered: false,
 
     allowedCompanies: [],
     allowedHqs: [],
     allowedTags: [],
 
     search: ''
   }
 }