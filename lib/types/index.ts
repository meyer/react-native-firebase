import Crashlytics from '../modules/fabric/crashlytics';
import Firestore from '../modules/firestore';

// import FieldValue from '../modules/firestore/FieldValue';
// import GeoPoint from '../modules/firestore/GeoPoint';
// import Reference from '../modules/database/reference';

/* Core types */
export type FirebaseError = {
  message: string;
  name: string;
  code: string;
  stack: string;
  path: string;
  details: string;
  modifiers: string;
};

export type FirebaseModuleConfig = {
  events?: string[];
  moduleName: FirebaseModuleName;
  multiApp: boolean;
  namespace: FirebaseNamespace;
};

export type FirebaseModuleName =
  | 'RNFirebaseAdmob'
  | 'RNFirebaseAnalytics'
  | 'RNFirebaseAuth'
  | 'RNFirebaseRemoteConfig'
  | 'RNFirebaseCrash'
  | 'RNFirebaseCrashlytics'
  | 'RNFirebaseDatabase'
  | 'RNFirebaseFirestore'
  | 'RNFirebaseLinks'
  | 'RNFirebaseMessaging'
  | 'RNFirebasePerformance'
  | 'RNFirebaseStorage'
  | 'RNFirebaseUtils';

export type FirebaseNamespace =
  | 'admob'
  | 'analytics'
  | 'auth'
  | 'config'
  | 'crash'
  | 'crashlytics'
  | 'database'
  | 'firestore'
  | 'links'
  | 'messaging'
  | 'perf'
  | 'storage'
  | 'utils';

export type FirebaseOptions = {
  apiKey: string;
  appId: string;
  databaseURL: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
};

export type DatabaseModifier = {
  id: string;
  type: 'orderBy' | 'limit' | 'filter';
  name?: string;
  key?: string;
  limit?: number;
  value?: any;
  valueType?: string;
};

/* Fabric types */
export type CrashlyticsModule = Crashlytics;

export type FabricModule = {
  crashlytics: CrashlyticsModule;
};

/* Firestore types */
export type FirestoreModule = Firestore;

export type FirestoreNativeDocumentChange = {
  document: FirestoreNativeDocumentSnapshot;
  newIndex: number;
  oldIndex: number;
  type: string;
};

export type FirestoreNativeDocumentSnapshot = {
  data: Dict<FirestoreTypeMap>;
  metadata: FirestoreSnapshotMetadata;
  path: string;
};

export type FirestoreSnapshotMetadata = {
  fromCache: boolean;
  hasPendingWrites: boolean;
};

export type FirestoreQueryDirection = 'DESC' | 'desc' | 'ASC' | 'asc';
export type FirestoreQueryOperator = '<' | '<=' | '=' | '==' | '>' | '>=';

// export interface FSArrayType {
//   type: 'array';
//   value: any[];
// }

// export interface FSBooleanType {
//   type: 'boolean';
//   value: boolean;
// }

// export interface FSDateType {
//   type: 'date';
//   value: Date;
// }

// export interface FSDocumentIdType {
//   type: 'documentid';
//   value: string;
// }

// export interface FSFieldValueType {
//   type: 'array';
//   value: FieldValue;
// }

// export interface FSGeopointType {
//   type: 'geopoint';
//   value: GeoPoint;
// }

// export interface FSNullType {
//   type: 'null';
//   value: null;
// }

// export interface FSNumberType {
//   type: 'number';
//   value: number;
// }

// export interface FSObjectType {
//   type: 'object';
//   value: object;
// }

// export interface FSReferenceType {
//   type: 'reference';
//   value: Reference;
// }

// export interface FSStringType {
//   type: 'string';
//   value: string;
// }

// export type FirestoreTypeMap =
//   | FSArrayType
//   | FSBooleanType
//   | FSDateType
//   | FSDocumentIdType
//   | FSFieldValueType
//   | FSGeopointType
//   | FSNullType
//   | FSNumberType
//   | FSObjectType
//   | FSReferenceType
//   | FSStringType;

export type FirestoreTypeMap = {
  type:
    | 'array'
    | 'boolean'
    | 'date'
    | 'documentid'
    | 'fieldvalue'
    | 'geopoint'
    | 'null'
    | 'number'
    | 'object'
    | 'reference'
    | 'string';
  value: any;
};

export type FirestoreWriteOptions = {
  merge?: boolean;
};

export interface Dict<T = any> {
  [key: string]: T;
}
