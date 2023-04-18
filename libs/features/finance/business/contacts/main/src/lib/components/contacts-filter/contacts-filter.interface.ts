/**
 * Selected filter header options for contacts page.
 */
 export interface ContactsFilter 
 {
   isFiltered: boolean;
 
   allowedCompanies: string[];
   allowedRoles: string[];
   allowedTags: string[];
 
   /** String-based filter for the remaining allowed contacts after initial filter. */
   search: string;
 }
 
 export function __NullContactsFilter() : ContactsFilter
 {
   return {
     isFiltered: false,
 
     allowedCompanies: [],
     allowedRoles: [],
     allowedTags: [],
 
     search: ''
   }
 }