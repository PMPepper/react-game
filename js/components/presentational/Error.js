import React from 'react';
import PropTypes from 'prop-types';

//HOCs
import ListComponent from '../highOrderComponents/ListComponent';


//Containers
import Text from '../containers/Text';


//Helpers
import {isReactRenderable} from '../../helpers/ExtendedPropTypes';

const ErrorList = ({items}) => {
  return <ul className="g-basicUL">
    {items.map((item, index) => {
      return <li className="g-basicUL-item" key={index}>{item}</li>
    })}
  </ul>
}


export default function ErrorComponent({error, errorBaseClass = 'error g-space', retry = null, cancel = null, titleLangKey = 'errorComponent-title', elementProps = null, getRef = null}) {
  if(error instanceof Array && error.length > 1) {
    error = <ErrorList items={error} />
  } else {
    error = <p className="g-bodyCopy">{error instanceof Array ? error[0] : error}</p>
  }
  return <div {...elementProps} ref={getRef} className={errorBaseClass}>
    <h3 className="g-h3"><Text id={titleLangKey} /></h3>
    {error}
    {(cancel || retry) && <div className="g-btns">
      {cancel && <button onClick={cancel} className="g-btn g-btn_size_small"><Text id="errorComponent-cancel" /></button>}
      {retry && <button onClick={retry} className="g-btn g-btn_size_small"><Text id="errorComponent-retry" /></button>}
    </div>}
  </div>
}

ErrorComponent.propTypes = {
  error: isReactRenderable,
  retry: PropTypes.func,
  cancel: PropTypes.func,
  errorBaseClass: PropTypes.string
};
