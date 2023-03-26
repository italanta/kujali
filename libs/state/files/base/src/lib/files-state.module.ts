import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileStorageService } from './services/file-storage.service';

@NgModule({
  imports: [CommonModule],
})

export class FilesStateModule {
  static forRoot(): ModuleWithProviders<FilesStateModule> {
    return {
      ngModule: FilesStateModule,
      providers: [
        FileStorageService
      ]
    };
  }
}
