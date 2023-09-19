import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

import { ActivatePontoPaymentsHandler } from '@app/functions/api/finance/banking/ponto-connect';

const handler = new ActivatePontoPaymentsHandler();

export const activatePontoPayments = new KujaliFunction("activatePontoPayments",
                                                  new RestRegistrar(),
                                                  [], handler)
                                                  .build();
