import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { AllocateBankPaymentsHandler } from '@app/functions/finance/manage/payments';

const allocateBankPaymentsHandler = new AllocateBankPaymentsHandler();

export const allocateBankPayments = new KujaliFunction('allocateBankPayments',
                                    new RestRegistrar(), 
                                    [], 
                                    allocateBankPaymentsHandler)
                                    .build()
