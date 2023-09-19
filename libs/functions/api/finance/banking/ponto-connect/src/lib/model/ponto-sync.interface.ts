/**
 * @see https://documentation.ibanity.com/ponto-connect/1/api/curl#synchronization-attributes
 */
export interface PontoSynchronization {
  /** Identifier of the resource to be synchronized */
  resourceId: string;

  /** Type of the resource to be synchronized. Currently must be account */
  resourceType: "account";

  /** What is being synchronized. Account information such as balance is updated using accountDetails, while accountTransactions is used to synchronize the transactions. */
  subtype: 'accountDetails' | 'accountTransactions';

  /** Current status of the synchronization, which changes from pending to running to success or error */
  status?: 'pending' | 'running' | 'success' | 'error';

  /** When this synchronization was created. */
  createdAt?: string

  /** When this synchronization was last synchronized successfully. Formatted according to ISO8601 spec */
  updatedAt?: string;

  /** Details of any errors that have occurred during synchronization, due to invalid authorization or technical failure. See possible errors */
  errors?: {
    detail: string;
    /**
     * Error code pre-defined by Ponto
     * @see https://documentation.ibanity.com/ponto-connect/1/api/curl#sync
     * */
    code: PontoSyncErrorCodes | string;
  }[];
}

export enum PontoSyncErrorCodes{
  AuthInvalid = 'authorizationInvalid',
  AuthRevoked = 'authorizationRevoked',
  AuthExpired = 'authorizationExpired',
  TechinalFailure = 'technicalFailure'
}
