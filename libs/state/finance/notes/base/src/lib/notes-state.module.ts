import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesStore } from './stores/notes.store';


@NgModule({
  imports: [CommonModule],
})
export class NotesStateModule {

  static forRoot(): ModuleWithProviders<NotesStateModule>
  {
    return {
      ngModule: NotesStateModule,
      providers: [
        NotesStore
      ]
    };
  }
}
