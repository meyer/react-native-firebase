/*
 * @flow
 */
import { windowOrGlobal } from './';

import ModuleBase from './ModuleBase';

declare var window: any;

(base => {
  window = base || window;
  // $FlowFixMe: Why are we using localStorage at all?
  if (!window.localStorage) window.localStorage = {};
})(windowOrGlobal);

// clean up time

const NATIVE_LOGGERS: { [key: string]: any } = {};

const getModuleKey = (module: ModuleBase): string =>
  `${module.app.name}:${module.namespace}`;

export const getLogger = (module: ModuleBase) => {
  const key = getModuleKey(module);
  return NATIVE_LOGGERS[key];
};

export const initialiseLogger = (module: ModuleBase, logNamespace: string) => {
  const key = getModuleKey(module);
  if (!NATIVE_LOGGERS[key]) {
    // eslint-disable-next-line global-require
    NATIVE_LOGGERS[key] = require('bows')(`🔥 ${logNamespace.toUpperCase()}`);
  }
};

export default class Log {
  static createLogger(namespace: string) {
    // eslint-disable-next-line global-require
    return require('bows')(namespace);
  }

  static setLevel(booleanOrDebugString: boolean | string) {
    window.localStorage.debug = booleanOrDebugString;
    window.localStorage.debugColors = !!booleanOrDebugString;
  }
}
