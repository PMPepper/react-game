import React from 'react';
import PropTypes from 'prop-types';

import {propTypes} from '../highOrderComponents/BEMComponent';

//This component is pure

//TODO get list of all modifiers

function CompoundIcon({baseClass, baseClassName, getElementClass, icons, elementProps = null, getRef = null}) {
  return <span {...elementProps} ref={getRef} className={baseClass}>
    {icons.map((icon, index) => {
      const style = {top: icon.top+'%', left: icon.left+'%', fontSize: icon.size ? icon.size+'em' : 'inherit'};

      if(icon.rotate) {//is set, and not 0
        style.transform = `rotate(${icon.rotate}deg)`;
        style.transformOrigin = '50% 50%';
      }

      return <i
        key={icon.icon+', '+icon.top+', '+icon.left+', '+icon.size}
        className={getElementClass('icon')+' fa fa-'+icon.icon}
        aria-hidden="true"
        style={style}></i>
    })}
  </span>
}

CompoundIcon.propTypes = {
  ...propTypes,
  icons: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    size: PropTypes.number,
    rotate: PropTypes.number
  })),
  modifiers: PropTypes.object
}

export default CompoundIcon;
