import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { ContactsStore } from './stores/contacts.store';
import { ActiveContactStore } from './stores/active-contact.store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],

  providers: []
})
export class ContactsStateModule {
  static forRoot(): ModuleWithProviders<ContactsStateModule> {
    return {
      ngModule: ContactsStateModule,
      providers: [
        ContactsStore,
        ActiveContactStore,
      ]
    };
  }
}
