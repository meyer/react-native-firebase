/**
 * @flow
 * UploadTask representation wrapper
 */
import { isFunction } from './../../utils';
import Storage, { statics } from './';
import StorageReference from './reference';

export const UPLOAD_TASK = 'upload';
export const DOWNLOAD_TASK = 'download';

export type UploadTaskSnapshotType = {
  bytesTransferred: number;
  downloadURL: string | null;
  metadata: any; // TODO flow type def for https://firebase.google.com/docs/reference/js/firebase.storage.FullMetadata.html
  ref: StorageReference;
  state:
    | typeof statics.TaskState.RUNNING
    | typeof statics.TaskState.PAUSED
    | typeof statics.TaskState.SUCCESS
    | typeof statics.TaskState.CANCELLED
    | typeof statics.TaskState.ERROR;
  task: StorageTask;
  totalBytes: number;
};

export type FuncSnapshotType =
  | null
  | ((snapshot: UploadTaskSnapshotType) => any);

export type FuncErrorType = null | ((error: Error) => any);

export type NextOrObserverType =
  | null
  | {
      next?: FuncSnapshotType;
      error?: FuncErrorType;
      complete?: FuncSnapshotType;
    }
  | FuncSnapshotType;

export interface TaskError extends Error {
  code?: number;
}

/**
 * @url https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask
 */
export default class StorageTask {
  type: typeof UPLOAD_TASK | typeof DOWNLOAD_TASK;
  ref: StorageReference;
  storage: Storage;
  path: string;
  then: () => Promise<any>;
  catch: () => Promise<any>;

  constructor(
    type: typeof UPLOAD_TASK | typeof DOWNLOAD_TASK,
    promise: Promise<any>,
    storageRef: StorageReference
  ) {
    this.type = type;
    this.ref = storageRef;
    this.storage = storageRef._storage;
    this.path = storageRef.path;

    // 'proxy' original promise
    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);
  }

  /**
   * Intercepts a native snapshot result object attaches ref / task instances
   * and calls the original function
   * @returns {Promise.<T>}
   * @private
   */
  private _interceptSnapshotEvent(f?: (snapshot) => any) {
    if (!isFunction(f)) return null;
    return snapshot => {
      const _snapshot = Object.assign({}, snapshot);
      _snapshot.task = this;
      _snapshot.ref = this.ref;
      return f && f(_snapshot);
    };
  }

  /**
   * Intercepts a error object form native and converts to a JS Error
   * @param f
   * @returns {*}
   * @private
   */
  private _interceptErrorEvent(f?: (error) => any) {
    if (!isFunction(f)) return null;
    return error => {
      const _error: TaskError = new Error(error.message);
      // $FlowFixMe
      _error.code = error.code;
      return f && f(_error);
    };
  }

  /**
   *
   * @param nextOrObserver
   * @param error
   * @param complete
   * @returns {function()}
   * @private
   */
  private _subscribe(
    nextOrObserver: NextOrObserverType,
    error: FuncErrorType,
    complete: FuncSnapshotType
  ): Function {
    let _error;
    let _next;
    let _complete;

    if (typeof nextOrObserver === 'function') {
      _error = this._interceptErrorEvent(error);
      _next = this._interceptSnapshotEvent(nextOrObserver);
      _complete = this._interceptSnapshotEvent(complete);
    } else if (nextOrObserver) {
      _error = this._interceptErrorEvent(nextOrObserver.error);
      _next = this._interceptSnapshotEvent(nextOrObserver.next);
      _complete = this._interceptSnapshotEvent(nextOrObserver.complete);
    }

    if (_next) {
      this.storage._addListener(
        this.path,
        statics.TaskEvent.STATE_CHANGED,
        _next
      );
    }
    if (_error) {
      this.storage._addListener(this.path, `${this.type}_failure`, _error);
    }
    if (_complete) {
      this.storage._addListener(this.path, `${this.type}_success`, _complete);
    }

    return () => {
      if (_next)
        this.storage._removeListener(
          this.path,
          statics.TaskEvent.STATE_CHANGED,
          _next
        );
      if (_error)
        this.storage._removeListener(this.path, `${this.type}_failure`, _error);
      if (_complete)
        this.storage._removeListener(
          this.path,
          `${this.type}_success`,
          _complete
        );
    };
  }

  /**
   *
   * @param event
   * @param nextOrObserver
   * @param error
   * @param complete
   * @returns {function()}
   */
  on(
    event: string = statics.TaskEvent.STATE_CHANGED,
    nextOrObserver: NextOrObserverType,
    error: FuncErrorType,
    complete: FuncSnapshotType
  ): Function {
    if (!event) {
      throw new Error(
        "StorageTask.on listener is missing required string argument 'event'."
      );
    }

    if (event !== statics.TaskEvent.STATE_CHANGED) {
      throw new Error(
        `StorageTask.on event argument must be a string with a value of '${
          statics.TaskEvent.STATE_CHANGED
        }'`
      );
    }

    // if only event provided return the subscriber function
    if (!nextOrObserver && !error && !complete) {
      return this._subscribe.bind(this);
    }

    return this._subscribe(nextOrObserver, error, complete);
  }

  pause() {
    throw new Error(
      '.pause() is not currently supported by react-native-firebase'
    );
  }

  resume() {
    // todo
    throw new Error(
      '.resume() is not currently supported by react-native-firebase'
    );
  }

  cancel() {
    // todo
    throw new Error(
      '.cancel() is not currently supported by react-native-firebase'
    );
  }
}
