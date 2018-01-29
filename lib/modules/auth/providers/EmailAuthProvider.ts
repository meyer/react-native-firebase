/**
 * EmailAuthProvider representation wrapper
 */
import { AuthCredential } from '../types';

const providerId = 'password';

export default class EmailAuthProvider {
  constructor() {
    throw new Error(
      '`new EmailAuthProvider()` is not supported on the native Firebase SDKs.'
    );
  }

  static get PROVIDER_ID(): string {
    return providerId;
  }

  static credential(email: string, password: string): AuthCredential {
    return {
      token: email,
      secret: password,
      providerId,
    };
  }
}
