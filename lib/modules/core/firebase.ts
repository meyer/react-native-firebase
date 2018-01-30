/**
 * @providesModule Firebase
 * @flow
 */
import { NativeModules } from 'react-native';

import APPS from '../../utils/apps';
import INTERNALS from '../../utils/internals';
import App from './firebase-app';
import VERSION from '../../version';

import AdMob, {
  statics as AdMobStatics,
  MODULE_NAME as AdMobModuleName,
} from '../admob';
import Auth, {
  statics as AuthStatics,
  MODULE_NAME as AuthModuleName,
} from '../auth';
import Analytics, {
  statics as AnalyticsStatics,
  MODULE_NAME as AnalyticsModuleName,
} from '../analytics';
import Config, {
  statics as ConfigStatics,
  MODULE_NAME as ConfigModuleName,
} from '../config';
import Crash, {
  statics as CrashStatics,
  MODULE_NAME as CrashModuleName,
} from '../crash';
import Database, {
  statics as DatabaseStatics,
  MODULE_NAME as DatabaseModuleName,
} from '../database';
import Firestore, {
  statics as FirestoreStatics,
  MODULE_NAME as FirestoreModuleName,
} from '../firestore';
import Links, {
  statics as LinksStatics,
  MODULE_NAME as LinksModuleName,
} from '../links';
import Messaging, {
  statics as MessagingStatics,
  MODULE_NAME as MessagingModuleName,
} from '../messaging';
import Perf, {
  statics as PerformanceStatics,
  MODULE_NAME as PerfModuleName,
} from '../perf';
import Storage, {
  statics as StorageStatics,
  MODULE_NAME as StorageModuleName,
} from '../storage';
import Utils, {
  MODULE_NAME as UtilsModuleName,
  statics as UtilsStatics,
} from '../utils';

import { FirebaseOptions } from '../../types/index';

const FirebaseCoreModule = NativeModules.RNFirebase;

export class Firebase {
  admob: () => AdMob;
  analytics: () => Analytics;
  auth: () => Auth;
  config: () => Config;
  crash: () => Crash;
  database: () => Database;
  // fabric;
  firestore: () => Firestore;
  links: () => Links;
  messaging: () => Messaging;
  perf: () => Perf;
  storage: () => Storage;
  utils: () => Utils;

  constructor() {
    if (!FirebaseCoreModule) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_CORE);
    }
    APPS.initializeNativeApps();

    this.admob = APPS.moduleAndStatics(
      'analytics',
      AdMobStatics,
      AdMobModuleName
    );

    this.analytics = APPS.moduleAndStatics(
      'analytics',
      AnalyticsStatics,
      AnalyticsModuleName
    );

    this.auth = APPS.moduleAndStatics('auth', AuthStatics, AuthModuleName);

    this.config = APPS.moduleAndStatics(
      'config',
      ConfigStatics,
      ConfigModuleName
    );

    this.crash = APPS.moduleAndStatics('crash', CrashStatics, CrashModuleName);

    this.database = APPS.moduleAndStatics(
      'database',
      DatabaseStatics,
      DatabaseModuleName
    );

    // this.fabric = {
    //   crashlytics: APPS.moduleAndStatics(
    //     'crashlytics',
    //     CrashlyticsStatics,
    //     CrashlyticsMODULE_NAME
    //   ),
    // };

    this.firestore = APPS.moduleAndStatics(
      'firestore',
      FirestoreStatics,
      FirestoreModuleName
    );

    this.links = APPS.moduleAndStatics('links', LinksStatics, LinksModuleName);

    this.messaging = APPS.moduleAndStatics(
      'messaging',
      MessagingStatics,
      MessagingModuleName
    );

    this.perf = APPS.moduleAndStatics(
      'perf',
      PerformanceStatics,
      PerfModuleName
    );

    this.storage = APPS.moduleAndStatics(
      'storage',
      StorageStatics,
      StorageModuleName
    );

    this.utils = APPS.moduleAndStatics('utils', UtilsStatics, UtilsModuleName);
  }

  /**
   * Web SDK initializeApp
   *
   * @param options
   * @param name
   * @return {*}
   */
  initializeApp(options: FirebaseOptions, name: string): App {
    return APPS.initializeApp(options, name);
  }

  /**
   * Retrieves a Firebase app instance.
   *
   * When called with no arguments, the default app is returned.
   * When an app name is provided, the app corresponding to that name is returned.
   *
   * @param name
   * @return {*}
   */
  app(name?: string): App {
    return APPS.app(name);
  }

  /**
   * A (read-only) array of all initialized apps.
   * @return {Array}
   */
  get apps(): App[] {
    return APPS.apps();
  }

  /**
   * The current SDK version.
   * @return {string}
   */
  get SDK_VERSION(): string {
    return VERSION;
  }
}

export default new Firebase();
