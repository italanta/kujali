import { GetMetabaseUrlHandler } from "@app/functions/data/db";

import { RestRegistrar } from "@ngfi/functions";

import { KujaliFunction } from '../../../../environments/kujali-func.class';

const handler = new GetMetabaseUrlHandler();

export const getMetabaseUrl = new KujaliFunction("getMetabaseUrl",
                                                  new RestRegistrar(),
                                                  [], handler).build();