import { RestRegistrar } from '@ngfi/functions';
import { KujaliFunction } from '../../../environments/kujali-func.class';

import { PromoteBudgetHandler } from '@app/functions/finance/budgeting';

const promoteBudgetHandler = new PromoteBudgetHandler();

export const promoteBudget = new KujaliFunction(
                            'promoteBudget',
                            new RestRegistrar(),
                            [],
                            promoteBudgetHandler)
                            .build()
