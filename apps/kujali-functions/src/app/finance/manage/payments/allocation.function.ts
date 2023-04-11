import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { AllocateHandler } from '@app/functions/finance/manage/payments';

const allocationHandler = new AllocateHandler();

export const doAllocations = new KujaliFunction('doAllocations',
                                    new RestRegistrar(), 
                                    [], 
                                    allocationHandler)
                                    .build()
