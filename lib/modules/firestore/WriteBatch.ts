/**
 * @flow
 * WriteBatch representation wrapper
 */
import FieldPath from './FieldPath';
import { mergeFieldPathData } from './utils';
import { buildNativeMap } from './utils/serialize';
import { isObject, isString } from '../../utils';
import { getNativeModule } from '../../utils/native';

import DocumentReference from './DocumentReference';
import Firestore from './';
import { FirestoreWriteOptions } from '../../types';

export enum WriteType {
  DELETE = 'DELETE',
  SET = 'SET',
  UPDATE = 'UPDATE',
}

export type DocumentWrite = {
  data?: any;
  options?: any;
  path: string;
  type: keyof typeof WriteType;
};

/**
 * @class WriteBatch
 */
export default class WriteBatch {
  private _firestore: Firestore;
  private _writes: DocumentWrite[];

  constructor(firestore: Firestore) {
    this._firestore = firestore;
    this._writes = [];
  }

  commit(): Promise<void> {
    return getNativeModule(this._firestore).documentBatch(this._writes);
  }

  delete(docRef: DocumentReference): WriteBatch {
    // TODO: Validation
    // validate.isDocumentReference('docRef', docRef);
    // validate.isOptionalPrecondition('deleteOptions', deleteOptions);
    this._writes.push({
      path: docRef.path,
      type: WriteType.DELETE,
    });

    return this;
  }

  set(
    docRef: DocumentReference,
    data: any,
    writeOptions?: FirestoreWriteOptions
  ) {
    // TODO: Validation
    // validate.isDocumentReference('docRef', docRef);
    // validate.isDocument('data', data);
    // validate.isOptionalPrecondition('writeOptions', writeOptions);
    const nativeData = buildNativeMap(data);
    this._writes.push({
      data: nativeData,
      options: writeOptions,
      path: docRef.path,
      type: WriteType.SET,
    });

    return this;
  }

  update(docRef: DocumentReference, ...args: any[]): WriteBatch {
    // TODO: Validation
    // validate.isDocumentReference('docRef', docRef);
    let data = {};
    if (args.length === 1) {
      if (!isObject(args[0])) {
        throw new Error(
          'WriteBatch.update failed: If using two arguments, the second must be an object.'
        );
      }
      // eslint-disable-next-line prefer-destructuring
      data = args[0];
    } else if (args.length % 2 === 1) {
      throw new Error(
        'WriteBatch.update failed: Must have a document reference, followed by either a single object argument, or equal numbers of key/value pairs.'
      );
    } else {
      for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        if (isString(key)) {
          data[key] = value;
        } else if (key instanceof FieldPath) {
          data = mergeFieldPathData(data, key._segments, value);
        } else {
          throw new Error(
            `WriteBatch.update failed: Argument at index ${i} must be a string or FieldPath`
          );
        }
      }
    }

    const nativeData = buildNativeMap(data);
    this._writes.push({
      data: nativeData,
      path: docRef.path,
      type: WriteType.UPDATE,
    });

    return this;
  }
}
