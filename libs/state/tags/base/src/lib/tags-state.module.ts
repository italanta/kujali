import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsStore } from './stores/tags.store';

@NgModule({
  imports: [CommonModule],
})
export class TagsStateModule {
  static forRoot(): ModuleWithProviders<TagsStateModule>
  {
    return {
      ngModule: TagsStateModule,
      providers: [
        TagsStore
      ]
    };
  }
}