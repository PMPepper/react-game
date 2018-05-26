import React from 'react';

//Containers
import Text from '../containers/Text';


export default function ConfirmModal({baseClass, baseClassName, getElementClass, question, okLangKey, cancelLangKey, resultCallback}) {
  return <div className={baseClass}>
    <div className={getElementClass('questionHolder')}>
      {question}
    </div>
    <div className="g-btns">
      <button className="g-btn g-btn_size_small g-btn_secondary" type="button" onClick={() => {resultCallback && resultCallback(false)}}>
        <Text id={cancelLangKey} />
      </button>
      <button className="g-btn g-btn_size_small" type="button" onClick={() => {resultCallback && resultCallback(true)}}>
        <Text id={okLangKey} />
      </button>
    </div>
  </div>
}
