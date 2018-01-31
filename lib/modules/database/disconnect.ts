/**
 * @flow
 * Disconnect representation wrapper
 */
import { typeOf } from '../../utils';
import { getNativeModule } from '../../utils/native';
import Database from './';
import Reference from './reference';

/**
 * @url https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
 * @class Disconnect
 */
export default class Disconnect {
  private _database: Database;
  ref: Reference;
  path: string;

  /**
   *
   * @param ref
   */
  constructor(ref: Reference) {
    this.ref = ref;
    this.path = ref.path;
    this._database = ref._database;
  }

  /**
   * @url https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#set
   * @param value
   * @returns {*}
   */
  set(value: any): Promise<void> {
    return getNativeModule(this._database).onDisconnectSet(this.path, {
      type: typeOf(value),
      value,
    });
  }

  /**
   * @url https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#update
   * @param values
   * @returns {*}
   */
  update(values: any): Promise<void> {
    return getNativeModule(this._database).onDisconnectUpdate(
      this.path,
      values
    );
  }

  /**
   * @url https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#remove
   * @returns {*}
   */
  remove(): Promise<void> {
    return getNativeModule(this._database).onDisconnectRemove(this.path);
  }

  /**
   * @url https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#cancel
   * @returns {*}
   */
  cancel(): Promise<void> {
    return getNativeModule(this._database).onDisconnectCancel(this.path);
  }
}
