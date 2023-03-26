
/** Returns whether the current base pages has notes. */
export function __IsValidFinanceObjectDomain(type: string)
{
  return ['companies', 'contacts', 'opportunities'].indexOf(type) >= 0;
}

// export function __artifectToRoute(validatedArtifectLoader: { type: string | boolean, id: string | boolean })
// {
//   return `${validatedArtifectLoader.type}/${validatedArtifectLoader.id}`;
// }
