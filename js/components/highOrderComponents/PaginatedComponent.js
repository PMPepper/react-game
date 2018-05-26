import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName, withPropsOnChange, compose} from 'recompose';

//Helpers
import {isPositiveNonZeroInteger} from '../../helpers/ExtendedPropTypes';


//Consts
const defaultDefaultPerPage = 25;


//The Component
export default function PaginatedComponent({defaultPerPage = defaultDefaultPerPage, paginatedProp = 'children', perPageProp = 'perPage', pageProp = 'currentPage', setTotalPagesProp = 'setTotalPages'} = {}) {

  return (PresentationalComponent) => {
    const Component = ({__PaginatedComponent__children, __PaginatedComponent__page, __PaginatedComponent__perPage, __PaginatedComponent__numPages, ...props}) => {
      return <PresentationalComponent {...props} numPages={__PaginatedComponent__numPages}>{__PaginatedComponent__children.slice((__PaginatedComponent__page-1) * __PaginatedComponent__perPage, __PaginatedComponent__page * __PaginatedComponent__perPage)}</PresentationalComponent>
    }

    const ComposedComponent = compose(withPropsOnChange(
      [paginatedProp, perPageProp, pageProp, setTotalPagesProp],
      (props, nextProps) => {
        const useProps = nextProps || props;

        const children = paginatedProp == 'children' ? React.Children.toArray(useProps[paginatedProp]) : useProps[paginatedProp];
        const perPage = useProps[perPageProp];
        const numPages = Math.ceil(children.length / perPage);

        if(useProps[setTotalPagesProp]) {
          useProps[setTotalPagesProp](numPages);
        }

        return {
          __PaginatedComponent__children: children,
          __PaginatedComponent__perPage: perPage,
          __PaginatedComponent__numPages: numPages,
          __PaginatedComponent__page: useProps[pageProp]
        }
      }
    ))(Component);

    ComposedComponent.displayName = `Paginated(${getDisplayName(PresentationalComponent)})`;

    ComposedComponent.propTypes = {
      [perPageProp]: isPositiveNonZeroInteger,
      [pageProp]: isPositiveNonZeroInteger,
      [setTotalPagesProp]: PropTypes.func
    };

    if(paginatedProp !== 'children') {
      ComposedComponent.propTypes[paginatedProp] = PropTypes.array;
    }

    ComposedComponent.defaultProps = {
      [perPageProp]: defaultPerPage,
      [pageProp]: 1
    }

    return ComposedComponent;
  };
}
