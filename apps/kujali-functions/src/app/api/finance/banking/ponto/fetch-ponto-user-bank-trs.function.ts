import { PubSubRegistrar, RestRegistrar } from '@ngfi/functions';

import { FetchPontoUserBankTrsHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from '../../../../../environments/kujali-func.class';

const handler = new FetchPontoUserBankTrsHandler();

export const fetchPontoUserBankTransactions = new KujaliFunction("fetchPontoUserBankTransactions",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                .build();

export const fetchPontoUserBankTransactionsPubsub = new KujaliFunction<{ orgId?: string, orgAccId: string}, any>
                                            ("fetchPontoUserBankTransactionsPubsub",
                                              new PubSubRegistrar('fetchPontoUserBankTransactionsPubsub'),
                                              [],
                                              handler)
                                              .build();
