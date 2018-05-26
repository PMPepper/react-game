import React from 'react';
import PropTypes from 'prop-types';


//Containers
import Text from '../containers/Text';

//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactRenderable} from '../../helpers/ExtendedPropTypes';

export default function GenericConfirmation({
  baseClass, baseClassName, getElementClass,
  onConfirm, onCancel,
  confirmMsg = <Text id="genericConfirmation-confirm" />, cancelMsg = <Text id="genericConfirmation-cancel" />,
  children, elementProps = null, getRef = null
}) {
  return <div {...elementProps} ref={getRef} className={baseClass}>
    <div className={getElementClass('question')}>
      {children}
    </div>

    <div className="g-btns">
      <button className="g-btn" type="button" onClick={onConfirm}>{confirmMsg}</button>
      <button className="g-btn g-btn_secondary" type="button" onClick={onCancel}>{cancelMsg}</button>
    </div>
  </div>
}

GenericConfirmation.propTypes = {
  ...propTypes,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmMsg: isReactRenderable,
  cancelMsg: isReactRenderable
};
