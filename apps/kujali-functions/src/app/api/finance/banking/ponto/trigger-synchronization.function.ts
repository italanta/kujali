import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

import { TriggerPontoSyncHandler } from '@app/functions/api/finance/banking/ponto-connect';

const handler = new TriggerPontoSyncHandler();

export const triggerSynchronization = new KujaliFunction("triggerSynchronization",
                                                  new RestRegistrar(),
                                                  [], handler)
                                                  .build();
