import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CanAccessContactsDetailGuard, IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ContactsPageComponent } from './pages/contacts-page.component';

const CONTACTS_ROUTES: Route[] = [
  { path: '', component: ContactsPageComponent },
  {
    path: ':id',
    loadChildren: () => import('libs/features/finance/business/contacts/details/view/src/lib/contacts-view.module').then(m => m.ContactsViewModule),
    canActivate: [IsLoggedInGuard, CanAccessContactsDetailGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(CONTACTS_ROUTES)],
  exports: [RouterModule]
})
export class ContactsRouterModule { }
