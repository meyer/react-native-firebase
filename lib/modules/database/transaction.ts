/**
 * @flow
 * Database Transaction representation wrapper
 */
import { getAppEventName, SharedEventEmitter } from '../../utils/events';
import { getLogger } from '../../utils/log';
import { getNativeModule } from '../../utils/native';
import Database from './';
import { Dict } from '../../types/index';

let transactionId = 0;

/**
 * Uses the push id generator to create a transaction id
 * @returns {number}
 * @private
 */
const generateTransactionId = (): number => transactionId++;

export interface Reference {
  path: string;
}

export interface TEvent {
  type?: string;
  id?: any;
  value?: any;
  error?: string;
  committed?: boolean;
  snapshot?: any;
}

/**
 * @class TransactionHandler
 */
export default class TransactionHandler {
  private _database: Database;
  // marked as protected instead of private because tsc thinks its unused
  protected _transactionListener;
  private _transactions: Dict;

  constructor(database: Database) {
    this._transactions = {};
    this._database = database;

    this._transactionListener = SharedEventEmitter.addListener(
      getAppEventName(this._database, 'database_transaction_event'),
      this._handleTransactionEvent
    );
  }

  /**
   * Add a new transaction and start it natively.
   * @param reference
   * @param transactionUpdater
   * @param onComplete
   * @param applyLocally
   */
  add(
    reference: Reference,
    transactionUpdater: Function,
    onComplete?: Function,
    applyLocally: boolean = false
  ) {
    const id = generateTransactionId();

    this._transactions[id] = {
      id,
      reference,
      transactionUpdater,
      onComplete,
      applyLocally,
      completed: false,
      started: true,
    };

    getNativeModule(this._database).transactionStart(
      reference.path,
      id,
      applyLocally
    );
  }

  /**
   *  INTERNALS
   */

  /**
   *
   * @param event
   * @returns {*}
   * @private
   */
  private _handleTransactionEvent = (event: TEvent = {}) => {
    switch (event.type) {
      case 'update':
        return this._handleUpdate(event);
      case 'error':
        return this._handleError(event);
      case 'complete':
        return this._handleComplete(event);
      default:
        getLogger(this._database).warn(
          `Unknown transaction event type: '${event.type}'`,
          event
        );
        return undefined;
    }
  };

  /**
   *
   * @param event
   * @private
   */
  private _handleUpdate = (event: TEvent = {}) => {
    let newValue;
    const { id, value } = event;

    try {
      const transaction = this._transactions[id];
      if (!transaction) return;

      newValue = transaction.transactionUpdater(value);
    } finally {
      let abort = false;

      if (newValue === undefined) {
        abort = true;
      }

      getNativeModule(this._database).transactionTryCommit(id, {
        value: newValue,
        abort,
      });
    }
  };

  /**
   *
   * @param event
   * @private
   */
  private _handleError = (event: TEvent = {}) => {
    const transaction = this._transactions[event.id];
    if (transaction && !transaction.completed) {
      transaction.completed = true;
      try {
        transaction.onComplete(event.error, false, null);
      } finally {
        setImmediate(() => {
          delete this._transactions[event.id];
        });
      }
    }
  };

  /**
   *
   * @param event
   * @private
   */
  private _handleComplete = (event: TEvent = {}) => {
    const transaction = this._transactions[event.id];
    if (transaction && !transaction.completed) {
      transaction.completed = true;
      try {
        transaction.onComplete(
          null,
          event.committed,
          Object.assign({}, event.snapshot)
        );
      } finally {
        setImmediate(() => {
          delete this._transactions[event.id];
        });
      }
    }
  };
}
