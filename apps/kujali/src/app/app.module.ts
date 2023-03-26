import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialBricksModule, MaterialBricksRootModule } from '@iote/bricks-angular';
import { NgFireModule } from '@ngfi/angular';
import { MultiLangRootModule } from '@ngfi/multi-lang';

import { AuthorisationModule } from '@app/elements/base/authorisation';
import { AppConfigurationModule } from '@app/elements/base/configuration';
import { DateConfigurationModule } from '@app/elements/base/date-time';
import { FirebaseConfigurationModule } from '@app/elements/base/firebase';

import { UserStateModule } from '@app/state/user';
import { OrgStateModule } from '@app/state/organisation';
import { BankingStateModule } from '@app/state/finance/banking';
import { CostTypesStateModule } from '@app/state/finance/cost-types';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

import { ActivitiesStateModule } from '@app/state/finance/activities';
import { CompaniesStateModule } from '@app/state/finance/companies';
import { ContactsStateModule } from '@app/state/finance/contacts';
import { InvoicesStateModule } from '@app/state/finance/invoices';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, AngularFirestoreModule, AngularFireFunctionsModule, NgFireModule,
    AngularFireAnalyticsModule,
    HttpClientModule,

    MaterialBricksModule,
    MaterialBricksRootModule.forRoot(),

    UserStateModule.forRoot(),
    AuthorisationModule.forRoot(environment, environment.production),

    AppConfigurationModule.forRoot(environment, environment.production),
    DateConfigurationModule.forRoot(),
    FirebaseConfigurationModule.forRoot(!environment.production, environment.useEmulators),
    MultiLangRootModule.forRoot(true),
    // UserNavModule,

    MatProgressBarModule,

    // AppConfigModule.forRoot(),


    //banking
    BankingStateModule.forRoot(),

    // DataModule.forRoot(),
    OrgStateModule.forRoot(),
    BudgetsStateModule.forRoot(),
    CostTypesStateModule.forRoot(),

    ActivitiesStateModule.forRoot(),
    CompaniesStateModule.forRoot(),
    ContactsStateModule.forRoot(),
    InvoicesStateModule.forRoot(),

    // FlowsStateModule.forRoot(),
    // ChatsStateModule.forRoot(),
    // MessagingStateModule.forRoot(),
    // CommChannelsStateModule.forRoot(),

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
