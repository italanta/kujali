import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { HttpParams } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

// import { BackendService } from '@ngfi/angular';

import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';
import { KuUser } from '@app/model/common/user';

@Injectable({
  providedIn: 'root'
})
export class ActivatePontoBankingService {

  constructor(@Inject('ENVIRONMENT') private _env: any,
              private _backendService: AngularFireFunctions,
  ) { }

  /**
   * @description Creates a url to redirect the user to Ponto onboarding as specified by the docs.
   *
   * @see https://documentation.ibanity.com/ponto-connect/products#access-authorization
   *
  */
  pontoConstructRedirectLink(data: any, org: Organisation, acc: FAccount, onboardingId: string) {

    const challengeString = '';
    const reconnectParam = data.isReconnect ? '>reconnect' : '';

    const queryParams =
      new HttpParams()
        .set('client_id', '7af1b5ee-6b0a-4492-923f-2426ef28e8ad')
        .set('redirect_uri', `https://project-kujali.web.app/operations/banking/connect-ponto`)
        .set('response_type', 'code')
        // Specified by Ibanity
        .set('scope', 'ai pi name offline_access')
        .set('state', org.id + '>' + acc.id + '>' + acc.name + reconnectParam)
        .set('code_challenge', challengeString)
        .set('code_challenge_method', 'S256')
        .set('onboarding_details_id', onboardingId);


    const generatedUrl = `https://sandbox-authorization.myponto.com/oauth2/auth?${queryParams.toString()}`;

    return generatedUrl;
  }

  /**
  * @description Creates an onboarding object to prefill user details in onboarding form.
  *
  * Onboarding object only lasts 5 minutes after creation.
  *
  * @see https://documentation.ibanity.com/ponto-connect/api/curl#create-onboarding-details
  *
 */
  pontocreateOnboardingDetails(org: Organisation, user: KuUser) {
    const body = { user, org: org};
    return this._backendService.httpsCallable('createPontoOnboardingDetails')(body);
  }


  /**
   * @see https://docs.swan.io/api/authentication/user-access-token
   * 
   * @returns string The url to redirect the user to
   */
  swanConstructOAuthRedirectLink(form: FormGroup, org: Organisation, account: FAccount) {
    const onBoardingID = form.get('inputOnBoardingIdCtrl')?.value
    const queryParams =
      new HttpParams()
        .set('client_id', this._env.swan.clientId)
        .set('response_type', 'code')
        .set('redirect_uri', `${this._env.baseUrl}accounting/swan-landing`)
        .set('state', org.id + '>' + account.id + '>' + account.name + '>' + onBoardingID)
        .set('scope', 'openid offline');

    const swanAuthUrl = 'https://oauth.swan.io/oauth2/auth'
    const reconnectUrl = `${swanAuthUrl}?${queryParams.toString()}`;
    return reconnectUrl;
  }
}