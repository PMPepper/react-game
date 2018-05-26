import React from 'react';
import PropTypes from 'prop-types';

import Text from '../containers/Text';

export default function Loading({loadingElementClass = 'g-loadingHolder', loadingTextLangKey = 'loading', elementProps = null, getRef = null}) {
  return <div {...elementProps} ref={getRef} className={loadingElementClass}>
    <div className="loading"></div>
    <span className="u-offscreen"><Text id={loadingTextLangKey} /></span>
  </div>
}

Loading.propTypes = {
  loadingElementClass: PropTypes.string,
  loadingTextLangKey: PropTypes.string
}
