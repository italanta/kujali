import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunitiesStore } from './stores/opportunities.store';
import { ActiveOpportunityStore } from './stores/active-opportunity.store';
import { OpportunityTypesStore } from './stores/opportunity-types.store';

@NgModule({
  imports: [CommonModule],
})
export class OpportunitiesStateModule {
  static forRoot(): ModuleWithProviders<OpportunitiesStateModule>
  {
    return {
      ngModule: OpportunitiesStateModule,
      providers: [
        OpportunitiesStore,
        ActiveOpportunityStore,
        OpportunityTypesStore
      ]
    };
  }
}
