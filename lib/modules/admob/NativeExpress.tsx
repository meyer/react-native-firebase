import * as React from 'react';
import AdMobComponent from './AdMobComponent';

const NativeExpress: React.SFC = ({ ...props }) => {
  return <AdMobComponent {...props} class="RNFirebaseAdMobNativeExpress" />;
};

NativeExpress.propTypes = AdMobComponent.propTypes;

NativeExpress.defaultProps = {
  size: 'SMART_BANNER',
};

export default NativeExpress;
