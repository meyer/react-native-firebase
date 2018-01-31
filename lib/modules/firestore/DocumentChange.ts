/**
 * @flow
 * DocumentChange representation wrapper
 */
import DocumentSnapshot from './DocumentSnapshot';

import Firestore from './';
import { FirestoreNativeDocumentChange } from '../../types';

/**
 * @class DocumentChange
 */
export default class DocumentChange {
  private _document: DocumentSnapshot;
  private _newIndex: number;
  private _oldIndex: number;
  private _type: string;

  constructor(firestore: Firestore, nativeData: FirestoreNativeDocumentChange) {
    this._document = new DocumentSnapshot(firestore, nativeData.document);
    this._newIndex = nativeData.newIndex;
    this._oldIndex = nativeData.oldIndex;
    this._type = nativeData.type;
  }

  get doc(): DocumentSnapshot {
    return this._document;
  }

  get newIndex(): number {
    return this._newIndex;
  }

  get oldIndex(): number {
    return this._oldIndex;
  }

  get type(): string {
    return this._type;
  }
}
