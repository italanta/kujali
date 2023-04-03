
/**
 * Allocation status of a fully calculated allocation.
 *    Used in Invoice- and PaymentBase allocation-aggregators
*/
export enum ArtifactAllocationStatus
{
  Full = 1,
  Partial = 5,
  Unallocated = 0
}
