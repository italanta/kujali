
import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';


const conf = config()['firebase'];
admin.initializeApp(conf);

export * from './app/finance/budgeting/promote-budget.function';
export * from './app/finance/budgeting/calculate-budget-headers.function';

export * from './app/data/db/create-surreal-db-payments.function';

export * from './app/api/finance/banking/ponto/fetch-ponto-user-bank-access.function';
export * from './app/api/finance/banking/ponto/fetch-ponto-user-bank-trs.function';
// export * from './app/api/finance/banking/ponto/activate-ponto-payments.function';
export * from './app/api/finance/banking/ponto/create-ponto-onboarding-details.function';
export * from './app/api/finance/banking/ponto/disconnect-ponto.function';
export * from './app/api/finance/banking/ponto/get-ponto-org-details.function';
export * from './app/api/finance/banking/ponto/ponto-reauth-request.function';
export * from './app/api/finance/banking/ponto/set-selected-bank-account.function';
export * from './app/api/finance/banking/ponto/update-ponto-connection.function';

export * from './app/finance/manage/payments/allocate-payments.function';
