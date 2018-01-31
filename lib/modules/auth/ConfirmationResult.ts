/**
 * ConfirmationResult representation wrapper
 */
import { getNativeModule } from '../../utils/native';
import Auth from './';
import User from './User';

export default class ConfirmationResult {
  private _auth: Auth;
  private _verificationId: string;

  /**
   *
   * @param auth
   * @param verificationId The phone number authentication operation's verification ID.
   */
  constructor(auth: Auth, verificationId: string) {
    this._auth = auth;
    this._verificationId = verificationId;
  }

  /**
   *
   * @param verificationCode
   * @return {*}
   */
  confirm(verificationCode: string): Promise<User> {
    return getNativeModule(this._auth)
      ._confirmVerificationCode(verificationCode)
      .then(user => this._auth._setUser(user));
  }

  get verificationId(): string | null {
    return this._verificationId;
  }
}
