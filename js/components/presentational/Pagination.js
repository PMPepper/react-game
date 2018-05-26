import React from 'react';
import PropTypes from 'prop-types';
import rangeInclusive from 'range-inclusive';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Containers
import Text from '../containers/Text';


//Helpers
import {isPositiveNonZeroInteger, isPositiveInteger} from '../../helpers/ExtendedPropTypes';
import {propTypes} from '../highOrderComponents/BEMComponent';


//This component is Pure

function Pagination({currentPage, perPage, totalResults, onRequestPagination, baseClass, baseClassName, getElementClass, optionsToDisplay = 7, elementProps = null, getRef = null}) {
  const totalPages = Math.ceil(totalResults / perPage);

  if(totalPages <= 1) {
    return null;
  }

  if(optionsToDisplay%2 == 0 ) {
    optionsToDisplay++;//needs to be an odd number
  }

  const offsetCount = Math.floor((optionsToDisplay - 5)/2); //how many numbers beside the current page should be shown, e.g. if optionsToDisplay = 7, currentPage = 6 and totalPages = 10, then 1 ... 5, 6, 7 ... 10 offset count is 1 (1 back and 1 forward from the current page)

  function renderPosition(position) {
    if(position == 1) {
      return renderPage(1);//start
    } else if(position == optionsToDisplay) {
      return renderPage(totalPages);//end
    }

    if((position == 2 && currentPage > 4) || ((position == (optionsToDisplay-1)) && ((totalPages - currentPage) >= 4))) {
      return <i key={'spacer-'+position} className={getElementClass('spacer')+' fa fa-ellipsis-h'} aria-hidden="true"></i>
    }

    //map position to page
    let positionCurrentPageOffset = 3 + offsetCount;

    //once you rearch the end, minus more from the start (-4 becomes -5, etc)
    if(currentPage + offsetCount + 2 > totalPages) {
      positionCurrentPageOffset -= totalPages - currentPage - offsetCount - 2;
    }

    return renderPage(position + Math.max(0, currentPage - positionCurrentPageOffset));
  }

  function renderPage(page) {
    const modifiers = {first: page === 1 ? null : undefined, last: page === totalPages ? null : undefined, current: page == currentPage ? null : undefined};

    if(page == currentPage) {
      return <span key={page} className={getElementClass('page', modifiers)}>{page}</span>
    }

    return <button key={page} className={getElementClass('page', modifiers)} type="button" onClick={(e) => {onRequestPagination(page, e);}}>{page}</button>
  }

  return <div {...elementProps} ref={getRef} className={baseClass}>
    <button disabled={currentPage == 1} onClick={(e) => {onRequestPagination(currentPage - 1, e);}} className={getElementClass('prev', {disabled: currentPage == 1 ? null : undefined})} type="button">
      <i className="fa fa-chevron-left" aria-hidden="true"></i>
      <span className="u-offscreen"><Text id="pagination-prev" /></span>
    </button>

    {rangeInclusive(1, Math.min(totalPages, optionsToDisplay)).map((position) => {
      return renderPosition(position);
    })}

    <button disabled={currentPage == totalPages} onClick={(e) => {onRequestPagination(currentPage + 1, e);}} className={getElementClass('next', {disabled: currentPage == totalPages ? null : undefined})} type="button">
      <i className="fa fa-chevron-right" aria-hidden="true"></i>
      <span className="u-offscreen"><Text id="pagination-next" /></span>
    </button>
  </div>
}


export default compose(
  BEMComponent('pagination')
)(Pagination);

Pagination.propTypes = {
  ...propTypes,
  currentPage: isPositiveNonZeroInteger.isRequired,
  perPage: isPositiveNonZeroInteger.isRequired,
  totalResults: isPositiveInteger.isRequired,
  onRequestPagination: PropTypes.func,
  optionsToDisplay: isPositiveNonZeroInteger
}
