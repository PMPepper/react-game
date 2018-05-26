import React from 'react';
import PropTypes from 'prop-types';

//Containers
import InputText from '../containers/forms/InputText';
import Text from '../containers/Text';

//Others
import {isReactRenderable} from '../../helpers/ExtendedPropTypes';
import {propTypes} from '../highOrderComponents/BEMComponent';


const defaultLabel = <Text id="searchBox-label" />

export default function SearchBox({baseClass, baseClassName, getElementClass, searchString, setSearchString, id, label = null}) {
  return <div className={baseClass}>
    <label htmlFor={id} className={getElementClass('label')}>{label || defaultLabel}</label>
    <span className={getElementClass('input')}>
      <InputText id={id} name="alertsPage-search" value={searchString} setValue={setSearchString} />
    </span>
  </div>
}

SearchBox.propTypes = {
  ...propTypes,
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: isReactRenderable
};
