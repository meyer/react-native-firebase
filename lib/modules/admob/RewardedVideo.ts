import { NativeModules } from 'react-native';
import { statics } from './';
import AdRequest from './AdRequest';
import { SharedEventEmitter } from '../../utils/events';
import { nativeToJSError } from '../../utils';

const FirebaseAdMob = NativeModules.RNFirebaseAdMob;

let subscriptions = [];

export default class RewardedVideo {
  admob: object;
  adUnit: string;
  loaded: boolean;

  constructor(admob: object, adUnit: string) {
    for (let i = 0, len = subscriptions.length; i < len; i++) {
      subscriptions[i].remove();
    }
    subscriptions = [];

    this.admob = admob;
    this.adUnit = adUnit;
    this.loaded = false;
    SharedEventEmitter.removeAllListeners(`rewarded_video_${adUnit}`);
    SharedEventEmitter.addListener(
      `rewarded_video_${adUnit}`,
      this._onRewardedVideoEvent
    );
  }

  /**
   * Handle a JS emit event
   * @param event
   * @private
   */
  private _onRewardedVideoEvent = event => {
    const eventType = `rewarded_video:${this.adUnit}:${event.type}`;

    let emitData = Object.assign({}, event);

    switch (event.type) {
      case 'onAdLoaded':
        this.loaded = true;
        break;
      case 'onAdFailedToLoad':
        emitData = nativeToJSError(event.payload.code, event.payload.message);
        emitData.type = event.type;
        break;
      default:
    }

    SharedEventEmitter.emit(eventType, emitData);
    SharedEventEmitter.emit(`rewarded_video:${this.adUnit}:*`, emitData);
  };

  /**
   * Load an ad with an instance of AdRequest
   * @param request
   * @returns {*}
   */
  loadAd(request?: AdRequest) {
    let adRequest;

    if (!request || !Object.keys(request)) {
      adRequest = new AdRequest().addTestDevice().build();
    } else {
      adRequest = request;
    }

    return FirebaseAdMob.rewardedVideoLoadAd(this.adUnit, adRequest);
  }

  /**
   * Return a local instance of isLoaded
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }

  /**
   * Show the advert - will only show if loaded
   * @returns {*}
   */
  show() {
    if (this.loaded) {
      FirebaseAdMob.rewardedVideoShowAd(this.adUnit);
    }
  }

  /**
   * Listen to an Ad event
   * @param eventType
   * @param listenerCb
   * @returns {null}
   */
  on(eventType, listenerCb) {
    const types = {
      ...statics.EventTypes,
      ...statics.RewardedVideoEventTypes,
    };

    if (!types[eventType]) {
      console.warn(
        `Invalid event type provided, must be one of: ${Object.keys(types).join(
          ', '
        )}`
      );
      return null;
    }

    const sub = SharedEventEmitter.addListener(
      `rewarded_video:${this.adUnit}:${eventType}`,
      listenerCb
    );
    subscriptions.push(sub);
    return sub;
  }
}
