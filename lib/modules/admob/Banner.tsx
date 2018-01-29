import * as React from 'react';
import AdMobComponent from './AdMobComponent';

const Banner: React.SFC = ({ ...props }) => {
  return <AdMobComponent {...props} class="RNFirebaseAdMobBanner" />;
};

Banner.propTypes = AdMobComponent.propTypes;

Banner.defaultProps = {
  size: 'SMART_BANNER',
};

export default Banner;
