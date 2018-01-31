import { NativeModules } from 'react-native';
import App from '../modules/core/firebase-app';
import INTERNALS from './internals';
import { isAndroid, isObject, isString } from './';

import { FirebaseNamespace, FirebaseOptions, Dict } from '../types';

// import ModuleBase from './ModuleBase';

const FirebaseCoreModule = NativeModules.RNFirebase;

const APPS: Dict<App> = {};
const APP_MODULES: Dict<Dict> = {};
const DEFAULT_APP_NAME = '[DEFAULT]';

export default {
  DEFAULT_APP_NAME,

  app(name?: string): App {
    const _name = name ? name.toUpperCase() : DEFAULT_APP_NAME;
    const app = APPS[_name];
    if (!app) throw new Error(INTERNALS.STRINGS.ERROR_APP_NOT_INIT(_name));
    return app;
  },

  apps(): App[] {
    // $FlowBug: Object.values always returns mixed type: https://github.com/facebook/flow/issues/2221
    return Object.values(APPS);
  },

  /**
   * @param statics
   * @param InstanceClass
   * @return {function()}
   * @private
   */
  appModule<M>(app: App, InstanceClass) {
    const namespace = InstanceClass.NAMESPACE;
    return (): M => {
      const appString = app.toString();

      if (!APP_MODULES[appString]) {
        APP_MODULES[appString] = {};
      }

      if (
        isAndroid &&
        namespace !== 'utils' &&
        !INTERNALS.FLAGS.checkedPlayServices
      ) {
        INTERNALS.FLAGS.checkedPlayServices = true;
        app.utils().checkPlayServicesAvailability();
      }

      if (!APP_MODULES[appString][namespace]) {
        APP_MODULES[appString][namespace] = new (InstanceClass as any)(
          app,
          app.options
        );
      }

      return APP_MODULES[appString][namespace];
    };
  },

  deleteApp(name: string): Promise<boolean> {
    const app = APPS[name];
    if (!app) return Promise.resolve(true);

    // https://firebase.google.com/docs/reference/js/firebase.app.App#delete
    return app.delete().then(() => {
      delete APPS[name];
      return true;
    });
  },

  /**
   * Web SDK initializeApp
   *
   * @param options
   * @param name
   * @return {*}
   */
  initializeApp(options: FirebaseOptions, name: string): App {
    if (name && !isString(name)) {
      throw new Error(INTERNALS.STRINGS.ERROR_INIT_STRING_NAME);
    }

    const _name = (name || DEFAULT_APP_NAME).toUpperCase();

    // return an existing app if found
    // todo in v4 remove deprecation and throw an error
    if (APPS[_name]) {
      console.warn(INTERNALS.STRINGS.WARN_INITIALIZE_DEPRECATION);
      return APPS[_name];
    }

    // only validate if app doesn't already exist
    // to allow apps already initialized natively
    // to still go through init without erroring (backwards compatibility)
    if (!isObject(options)) {
      throw new Error(INTERNALS.STRINGS.ERROR_INIT_OBJECT);
    }

    if (!options.apiKey) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('apiKey'));
    }

    if (!options.appId) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('appId'));
    }

    if (!options.databaseURL) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('databaseURL'));
    }

    if (!options.messagingSenderId) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('messagingSenderId'));
    }

    if (!options.projectId) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('projectId'));
    }

    if (!options.storageBucket) {
      throw new Error(INTERNALS.STRINGS.ERROR_MISSING_OPT('storageBucket'));
    }

    APPS[_name] = new App(_name, options);

    return APPS[_name];
  },

  /**
   * Bootstraps all native app instances that were discovered on boot
   */
  initializeNativeApps() {
    for (let i = 0, len = FirebaseCoreModule.apps.length; i < len; i++) {
      const app = FirebaseCoreModule.apps[i];
      const options = Object.assign({}, app);
      delete options.name;
      APPS[app.name] = new App(app.name, options, true);
    }
  },

  /**
   *
   * @param statics
   * @param InstanceClass
   * @return {function(App=)}
   */
  moduleAndStatics(namespace: FirebaseNamespace, statics, moduleName: string) {
    const getModule = (app?: App) => {
      let _app = app;

      // throw an error if it's not a valid app instance
      if (_app && !(_app instanceof App)) {
        throw new Error(INTERNALS.STRINGS.ERROR_NOT_APP(namespace));
      } else if (!_app) {
        // default to the 'DEFAULT' app if no arg provided - will throw an error
        // if default app not initialized
        _app = this.app(DEFAULT_APP_NAME);
      }

      const module =
        namespace === 'crashlytics' ? _app.fabric[namespace] : _app[namespace];
      return module();
    };

    return Object.assign(getModule, statics, {
      nativeModuleExists: !!NativeModules[moduleName],
    });
  },
};
