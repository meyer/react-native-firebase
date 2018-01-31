export default class VideoOptions {
  private _props: {
    startMuted: boolean;
  };

  constructor() {
    this._props = {
      startMuted: true,
    };
  }

  build() {
    return this._props;
  }

  setStartMuted(muted: boolean = true) {
    this._props.startMuted = muted;
    return this;
  }
}
