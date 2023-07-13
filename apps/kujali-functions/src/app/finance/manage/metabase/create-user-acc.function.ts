import { CreateUserMetabaseAccHandler } from "@app/functions/data/db";
import { RestRegistrar } from "@ngfi/functions";
import { KujaliFunction } from "apps/kujali-functions/src/environments/kujali-func.class";

const handler = new CreateUserMetabaseAccHandler;

export const createUserMetabaseAcc = new KujaliFunction("createUserMetabaseAcc ",
                                                  new RestRegistrar(),
                                                  [], handler).build();