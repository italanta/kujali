import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { Allocation } from '@app/model/finance/allocations';


const ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/allocs`;

/**
 * @class Allocation Handler.
 *
 * @description Creates an allocation object for a given bank transaction/invoice.

 */
export class AllocateHandler extends FunctionHandler<{orgId: string, allocs: Allocation[]}, Allocation[]>
{
  public async execute(data: {orgId: string, allocs: Allocation[]}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AllocateHandler].execute: allocating trs for: ${data.orgId}`);
    tools.Logger.log(() => `[AllocateHandler].execute: allocs: ${JSON.stringify(data.allocs.length)}`);

    // create allocation
    const _allocsRepo =  tools.getRepository<Allocation>(ALLOCS_REPO(data.orgId));
    const alloc$ = data.allocs.map((alloc) => _allocsRepo.create(alloc));

    const allocsCreated = await Promise.all(alloc$);
    return allocsCreated;
  }
}