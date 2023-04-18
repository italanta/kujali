import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ContactsPageComponent } from './pages/contacts-page.component';


const CONTACTS_ROUTES: Route[] = [
  { path: '', component: ContactsPageComponent },
  // {
  //   path: ':id',
  //   loadChildren: () => import('libs/features/crm/contacts/details/view/src/lib/features-crm-contacts-details-view.module').then(m => m.FeaturesCrmContactsDetailsViewModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(CONTACTS_ROUTES)],
  exports: [RouterModule]
})
export class ContactsRouterModule { }
