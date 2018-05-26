import React from 'react';
import PropTypes from 'prop-types';


//HOCs
import ErrorBoundaryComponent from '../highOrderComponents/ErrorBoundaryComponent';


//Containers
import FormattedText from '../containers/FormattedText';
import Text from '../containers/Text';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';

function errorToObject(error) {
  const obj = {};

  Object.getOwnPropertyNames(error).forEach(function (key) {
      obj[key] = error[key];
  });

  return obj;
}

let BaseErrorBoundary = null

if(process.env.NODE_ENV !== 'production') {
  //Dev error boundary
  BaseErrorBoundary = function({error, info, baseClass, baseClassName, getElementClass, ...rest}) {
    return <div className={baseClass} {...rest}>
      <h2 className={getElementClass('title')}><Text id="errorboundary-title" /></h2>
      <h3 className={getElementClass('subTitle')}><Text id="errorboundary-error-title" /></h3>
      <p className={getElementClass('error')}>{error.message}</p>
      <p className={getElementClass('errorStack')}>{error.stack}</p>

      <h3 className={getElementClass('subTitle')}><Text id="errorboundary-componentStack-title" /></h3>
      <p className={getElementClass('componentStack')}>{info.componentStack}</p>
    </div>;
  }
} else {
  //Production error boundary
  BaseErrorBoundary = function({error, info, baseClass, getElementClass}) {
    return <div className={baseClass}>
      <h2 className={getElementClass('title')}><Text id="errorboundary-title" /></h2>
      <p className={getElementClass('errorText')}><FormattedText id="errorboundary-text" params={[error.message]} /></p>
    </div>;
  }
}

export default ErrorBoundaryComponent(BaseErrorBoundary);


BaseErrorBoundary.propTypes = {
  ...propTypes,
  error: PropTypes.object.isRequired,
  info: PropTypes.object
}
