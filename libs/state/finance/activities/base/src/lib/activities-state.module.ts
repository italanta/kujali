import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityStore } from './stores/acitvity.store';
import { TaskStore } from './stores/tasks.store';

@NgModule({
  imports: [CommonModule],
  providers: []
})
export class ActivitiesStateModule {

  static forRoot(): ModuleWithProviders<ActivitiesStateModule>
  {
    return {
      ngModule: ActivitiesStateModule,
      providers: [
        ActivityStore,
        TaskStore
      ]
    };
  }
}
