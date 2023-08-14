
import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';


const conf = config()['firebase'];

admin.initializeApp(conf);

// business/companies
export * from './app/companies/create-company-with-contact.function';

// business/contacts
export * from './app/contacts/update-contact-with-company.function';

// business/opps
export * from './app/opportunities/create-opps-with-contacts-or-company.function';

// users
export * from './app/users/create-new-user.function';

// orgs
export * from './app/organisation/on-create-organisation.function';
export * from './app/organisation/delete-user-from-organisation.function';
export * from './app/organisation/delete-organisation-from-user.function';

export * from './app/finance/budgeting/promote-budget.function';
export * from './app/finance/budgeting/calculate-budget-headers.function';

export * from './app/data/db/create-surreal-db-payments.function';

export * from './app/api/finance/banking/ponto/fetch-ponto-user-bank-access.function';
export * from './app/api/finance/banking/ponto/fetch-ponto-user-bank-trs.function';
export * from './app/api/finance/banking/ponto/activate-ponto-payments.function';
export * from './app/api/finance/banking/ponto/initiate-ponto-payment.function';
export * from './app/api/finance/banking/ponto/trigger-synchronization.function';
export * from './app/api/finance/banking/ponto/create-ponto-onboarding-details.function';
export * from './app/api/finance/banking/ponto/disconnect-ponto.function';
export * from './app/api/finance/banking/ponto/get-ponto-org-details.function';
export * from './app/api/finance/banking/ponto/ponto-reauth-request.function';
export * from './app/api/finance/banking/ponto/set-selected-bank-account.function';
export * from './app/api/finance/banking/ponto/update-ponto-connection.function';

export * from './app/finance/manage/expenses/allocate-expenses.function';
export * from './app/finance/manage/expenses/delete-expense-props.function';

export * from './app/finance/manage/common/allocation.function';
export * from './app/finance/manage/common/deallocation.function';

export * from './app/finance/manage/invoices/allocate-payments-to-invoice.function';
export * from './app/finance/manage/payments/allocate-invoices-to-payment.function';
export * from './app/finance/manage/metabase/get-metabase-url.function';