import React from 'react';
import PropTypes from 'prop-types';


//Containers
import Text from '../containers/Text';


//helpers
import {propTypes} from '../highOrderComponents/BEMComponent';


//This component is Pure

export default function Tabs({id, baseClass, baseClassName, getElementClass, children, selectedIndex, onRequestChangeSelected, elementProps = null, getRef = null}) {
  const numChildren = React.Children.count(children);
  const childElements = [];

  if(!children || numChildren === 0) {
    return null;
  }

  if(numChildren < 2) {
    onRequestChangeSelected = null;
  }

  const childrenArray = React.Children.toArray(children);

  return <div {...elementProps} ref={getRef} className={baseClass}>
    <ul className={getElementClass('tabsList')} role="tablist">{
      childrenArray.map((child, index) => {
        const tabId = `${id}-${index}-tab`;
        const isOpen = index == selectedIndex;
        let childLabel = child.props.labelStr || child.props.label;
        const tabModifiers = !isOpen && numChildren !== 0 ?
          null
          :
          {open: isOpen && null, onlyTab: numChildren === 1 && null};

        return <li
          onClick={onRequestChangeSelected ? (e) => {
            e.preventDefault();
            e.stopPropagation();
            onRequestChangeSelected(index, childElements[index]);
          } : null}
          ref={(elem) => {childElements[index] = elem;}}
          onKeyDown={onRequestChangeSelected ? (e) => {
            let newSelectedIndex = selectedIndex;

            switch(e.which) {
              case 38://up
              case 39://right
                newSelectedIndex++;

                if(newSelectedIndex >= numChildren) {
                  newSelectedIndex = 0;
                }
                break;
              case 37://left
              case 40://down
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
          className={getElementClass('tab', tabModifiers)}
          key={tabId}
          id={tabId}
          role="tab"
          aria-posinset={index+1}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-selected={isOpen ? 'true' : 'false'}
          aria-label={childLabel}
          aria-controls={`${id}-${index}-tab`}
          tabIndex={(numChildren > 1 && isOpen) ? 0 : undefined}
        >
          <span className={getElementClass('tabLabel', tabModifiers)}>{child.props.label}</span>
          {index == 0 && <span className="u-offscreen u-isFocussed">
            <Text text="You can move between tabs using the cursor keys." id="tabs-accessibility-instructions" />
          </span>}
        </li>
      })}
    </ul>
    <div className={getElementClass('content')}>{
      childrenArray.map((child, index) => {
        const panelId = `${id}-${index}-panel`;
        const isOpen = index === selectedIndex;
        const panelModifiers = isOpen ? {open: null} : null;

        return <div
          className={getElementClass('tabpanel', panelModifiers)}
          role="tabpanel"
          id={panelId}
          key={panelId}
          aria-labelledby={`${id}-${index}-tab`}
        >
          {child.props.children}
        </div>
      })
    }</div>
  </div>
}

Tabs.propTypes = {
  ...propTypes,
  id: PropTypes.string.isRequired,
  onRequestChangeSelected: PropTypes.func
}
