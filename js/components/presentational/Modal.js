import React from 'react';
import PropTypes from 'prop-types';

//Containers
import Text from '../containers/Text';

//Presentational
import Portal from './Portal';
import ErrorBoundary from './ErrorBoundary';

//Helpers
import {elementToString} from '../../helpers/ReactHelpers';
import {getFocusableElements} from '../../helpers/DOMHelpers';


//The component
export default function Modal({
  baseClass, baseClassName, getElementClass,
  escCloses, clickOutsideCloses, title, contentLabel, hasCloseBtn,
  error, warning, success, info,
  isOpen, isClosing, rootElement, setRootElement, onModalOpen, requestClose, onContentClick, stateChildren
}, context) {
  return <Portal
    isOpened={isOpen||isClosing}
    onOpen={() =>{setTimeout(onModalOpen, 0)}}
  >
    <article
      ref={setRootElement}
      aria-label={elementToString(contentLabel, context)}
      aria-modal="true"
      className={baseClass}
      tabIndex="0"
      onFocus={(e) => {
        const focusable = getFocusableElements(rootElement);

        if(focusable[0] == e.target) {
          focusable[focusable.length-2].focus();
        }

        if(focusable[focusable.length-1] == e.target) {
          focusable[1].focus();
        }
      }}
      onKeyDown={(e) => {
        if(escCloses && e.which == 27) {
          requestClose(e);
        }
      }}
    >
      <span tabIndex="0" className="u-offscreen"></span>
      <div className={getElementClass('overlay')} onClick={clickOutsideCloses ? requestClose : null}></div>
      <section
        className={getElementClass('content')}
        role={error ? 'alertdialog' : 'dialog'}
        onClick={onContentClick}
      >
        <header className={getElementClass('header')}>
          {success && <i className={getElementClass('icon', {type: 'success'})+' fa fa-check-circle-o'} aria-hidden="true"></i>}
          {info && <i className={getElementClass('icon', {type: 'info'})+' fa fa-info-circle'} aria-hidden="true"></i>}
          {(error || warning) && <i className={getElementClass('icon', {type: 'error'})+' fa fa-exclamation-triangle'} aria-hidden="true"></i>}

          <h2 className={getElementClass('title')}>{title || contentLabel}</h2>
          {hasCloseBtn && <button type="button" className={getElementClass('closeBtn')+' js-closeModalBtn'}>
            <i className={getElementClass(['closeBtn', 'icon'])+' fa fa-times'} aria-hidden="true"></i>
            <span className="u-offscreen"><Text id="modal-close" /></span>
          </button>}
        </header>
        <div className={getElementClass('body')}>
          <ErrorBoundary>
            {stateChildren}
          </ErrorBoundary>
        </div>
      </section>
      <span tabIndex="0" className="u-offscreen"></span>{/*What's this for? Is it something to do with focus management? I think so...*/}
    </article>
  </Portal>
}

Modal.defaultProps = {
  hasCloseBtn: true,
  clickOutsideCloses: false,
  escCloses: true,
  transitionTime: 0.3,
  isOpen: PropTypes.bool.isRequired
};

Modal.contextTypes = {
  store: PropTypes.object
};
