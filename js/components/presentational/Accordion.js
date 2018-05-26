import React from 'react';
import PropTypes from 'prop-types';


//Containers
import Text from '../containers/Text';


//helpers
import {propTypes} from '../highOrderComponents/BEMComponent';


//presentational
import {SingleVerticalSlideTransition} from '../presentational/Transitions';


//This component is Pure

export default function Accordion({id, baseClass, baseClassName, getElementClass, children, selectedIndex, allowCollapseAll, onRequestChangeSelected, elementProps = null, getRef = null}, context) {
  const hasAnOpenTab = allowCollapseAll || selectedIndex  >= 0;
  const numChildren = React.Children.count(children);
  const childElements = [];

  return <div {...elementProps} ref={getRef} className={baseClass} role="tablist">{
    React.Children.toArray(children).map((child, index) => {
      const isThisTabOpen = index === selectedIndex;
      const tabModifiers = isThisTabOpen ? {open: true} : null;
      const canBeToggled = !isThisTabOpen || allowCollapseAll;
      const childLabel = child.props.label;

      return [
        <h3
          className={getElementClass('title', tabModifiers)}
          key={child.key+'--title'}
        >
          {numChildren == 1 && !allowCollapseAll ?
            <span className={getElementClass(['title', 'btn'], tabModifiers)}>
              <span className={getElementClass(['title', 'text'], tabModifiers)}>{childLabel}</span>
            </span>
            :
            <button
              id={`${id}-${index}-tab`}
              aria-controls={`${id}-${index}-body`}
              type="button"
              role="tab"
              aria-selected={isThisTabOpen ? 'true' : undefined}
              className={getElementClass(['title', 'btn'], tabModifiers)}
              onClick={onRequestChangeSelected ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequestChangeSelected(index, childElements[index]);
              } : null}
              tabIndex={(!hasAnOpenTab || numChildren == 1 || selectedIndex == index) ? 0 : -1}
              ref={(elem) => {childElements[index] = elem}}
              onKeyDown={onRequestChangeSelected ? (e) => {
                let newSelectedIndex = selectedIndex;

                switch(e.which) {
                  case 40://down
                  case 39://right
                    newSelectedIndex++;

                    if(newSelectedIndex >= numChildren) {
                      newSelectedIndex = 0;
                    }
                    break;
                  case 38://up
                  case 37://left
                    newSelectedIndex--;

                    if(newSelectedIndex < 0) {
                      newSelectedIndex = numChildren - 1;
                    }
                    break;
                  case 36://home
                    newSelectedIndex = 0;
                    break;
                  case 35://end
                    newSelectedIndex = numChildren - 1;
                    break;
                  default:
                    //Don't do anything
                    return;
                }

                onRequestChangeSelected(newSelectedIndex, childElements[newSelectedIndex]);

                e.preventDefault();
              } : null}
            >
              <span className={getElementClass(['title', 'text'], tabModifiers)}>{childLabel}</span>
            </button>
          }
        </h3>,
        <div
          key={`${id}-${index}-body`}
          id={`${id}-${index}-body`}
          role="tabpanel"
          aria-hidden={isThisTabOpen ? 'true' : undefined}
        >
          <div
            className={getElementClass('body', tabModifiers)}
          >
            <SingleVerticalSlideTransition>{isThisTabOpen && <div className={getElementClass(['body', 'content'], tabModifiers)}>{child.props.children}</div>}</SingleVerticalSlideTransition>
          </div>
        </div>
      ];
    })}</div>
};

Accordion.contextTypes = {
  store: PropTypes.object
}

Accordion.defaultProps = {
  allowCollapseAll: false
};

Accordion.propTypes = {
  ...propTypes,
  id: PropTypes.string.isRequired,
  onRequestChangeSelected: PropTypes.func,
  allowCollapseAll: PropTypes.bool
}
