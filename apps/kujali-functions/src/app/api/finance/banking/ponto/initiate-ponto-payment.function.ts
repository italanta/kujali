import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

import { InitiatePontoPaymentHandler } from '@app/functions/api/finance/banking/ponto-connect';

const handler = new InitiatePontoPaymentHandler();

export const initiatePontoPayment = new KujaliFunction("initiatePontoPayment",
                                                  new RestRegistrar(),
                                                  [], handler)
                                                  .build();
