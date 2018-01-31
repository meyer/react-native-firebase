/*
 * @flow
 */
import { NativeModules } from 'react-native';

import APPS from '../../utils/apps';
import { SharedEventEmitter } from '../../utils/events';
import INTERNALS from '../../utils/internals';
import { isObject } from '../../utils';

import AdMob from '../admob';
import Auth from '../auth';
import Analytics from '../analytics';
import Config from '../config';
import Crash from '../crash';
import Crashlytics from '../fabric/crashlytics';
import Database from '../database';
import Firestore from '../firestore';
import Links from '../links';
import Messaging from '../messaging';
import Performance from '../perf';
import Storage from '../storage';
import Utils from '../utils';

import { FirebaseOptions, Dict } from '../../types';

const FirebaseCoreModule = NativeModules.RNFirebase;

export default class App {
  private _extendedProps: Dict<boolean>;
  private _initialized: boolean = false;
  /** @private */
  _name: string;
  // private _nativeInitialized: boolean = false;
  private _options: FirebaseOptions;

  admob: () => AdMob;
  analytics: () => Analytics;
  auth: () => Auth;
  config: () => Config;
  crash: () => Crash;
  database: () => Database;
  fabric: {
    crashlytics: () => Crashlytics;
  };
  firestore: () => Firestore;
  links: () => Links;
  messaging: () => Messaging;
  perf: () => Performance;
  storage: () => Storage;
  utils: () => Utils;

  constructor(
    name: string,
    options: FirebaseOptions,
    fromNative: boolean = false
  ) {
    this._name = name;
    this._options = Object.assign({}, options);

    if (fromNative) {
      this._initialized = true;
      // this._nativeInitialized = true;
    } else if (options.databaseURL && options.apiKey) {
      FirebaseCoreModule.initializeApp(
        this._name,
        this._options,
        (error, result) => {
          this._initialized = true;
          SharedEventEmitter.emit(`AppReady:${this._name}`, { error, result });
        }
      );
    }

    // modules
    this.admob = APPS.appModule<AdMob>(this, AdMob);
    this.analytics = APPS.appModule<Analytics>(this, Analytics);
    this.auth = APPS.appModule<Auth>(this, Auth);
    this.config = APPS.appModule<Config>(this, Config);
    this.crash = APPS.appModule<Crash>(this, Crash);
    this.database = APPS.appModule<Database>(this, Database);
    this.fabric = {
      crashlytics: APPS.appModule<Crashlytics>(this, Crashlytics),
    };
    this.firestore = APPS.appModule<Firestore>(this, Firestore);
    this.links = APPS.appModule<Links>(this, Links);
    this.messaging = APPS.appModule<Messaging>(this, Messaging);
    this.perf = APPS.appModule<Performance>(this, Performance);
    this.storage = APPS.appModule<Storage>(this, Storage);
    this.utils = APPS.appModule<Utils>(this, Utils);
    this._extendedProps = {};
  }

  /**
   *
   * @return {*}
   */
  get name(): string {
    return this._name;
  }

  /**
   *
   * @return {*}
   */
  get options(): FirebaseOptions {
    return Object.assign({}, this._options);
  }

  /**
   * Undocumented firebase web sdk method that allows adding additional properties onto
   * a firebase app instance.
   *
   * See: https://github.com/firebase/firebase-js-sdk/blob/master/tests/app/firebase_app.test.ts#L328
   *
   * @param props
   */
  extendApp(props: any) {
    if (!isObject(props))
      throw new Error(
        INTERNALS.STRINGS.ERROR_MISSING_ARG('Object', 'extendApp')
      );
    const keys = Object.keys(props);

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];

      if (!this._extendedProps[key] && Object.hasOwnProperty.call(this, key)) {
        throw new Error(INTERNALS.STRINGS.ERROR_PROTECTED_PROP(key));
      }

      // $FlowBug: Flow doesn't support indexable signatures on classes: https://github.com/facebook/flow/issues/1323
      this[key] = props[key];
      this._extendedProps[key] = true;
    }
  }

  /**
   *
   * @return {Promise}
   */
  delete() {
    return Promise.reject(
      new Error(
        INTERNALS.STRINGS.ERROR_UNSUPPORTED_CLASS_METHOD('app', 'delete')
      )
    );
    // TODO only the ios sdk currently supports delete, add back in when android also supports it
    // if (this._name === APPS.DEFAULT_APP_NAME && this._nativeInitialized) {
    //   return Promise.reject(
    //     new Error('Unable to delete the default native firebase app instance.'),
    //   );
    // }
    //
    // return FirebaseCoreModule.deleteApp(this._name);
  }

  /**
   *
   * @return {*}
   */
  onReady(): Promise<App> {
    if (this._initialized) return Promise.resolve(this);

    return new Promise((resolve, reject) => {
      SharedEventEmitter.once(`AppReady:${this._name}`, ({ error }) => {
        if (error) return reject(new Error(error)); // error is a string as it's from native
        return resolve(this); // return app
      });
    });
  }
}
