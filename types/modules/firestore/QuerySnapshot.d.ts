/**
 * @flow
 * QuerySnapshot representation wrapper
 */
import DocumentChange from './DocumentChange';
import DocumentSnapshot from './DocumentSnapshot';
import Firestore from './';
import { FirestoreNativeDocumentChange, FirestoreNativeDocumentSnapshot, FirestoreSnapshotMetadata } from '../../types';
import Query from './Query';
export declare type QuerySnapshotNativeData = {
    changes: FirestoreNativeDocumentChange[];
    documents: FirestoreNativeDocumentSnapshot[];
    metadata: FirestoreSnapshotMetadata;
};
/**
 * @class QuerySnapshot
 */
export default class QuerySnapshot {
    _changes: DocumentChange[];
    _docs: DocumentSnapshot[];
    _metadata: FirestoreSnapshotMetadata;
    _query: Query;
    constructor(firestore: Firestore, query: Query, nativeData: QuerySnapshotNativeData);
    readonly docChanges: DocumentChange[];
    readonly docs: DocumentSnapshot[];
    readonly empty: boolean;
    readonly metadata: FirestoreSnapshotMetadata;
    readonly query: Query;
    readonly size: number;
    forEach(callback: (DocumentSnapshot) => any): void;
}
