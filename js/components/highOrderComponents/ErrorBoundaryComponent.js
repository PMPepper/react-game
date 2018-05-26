import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import BEMComponent from './BEMComponent';

import Text from '../containers/Text';

function defaultMerge(ownProps, addedProps) {
  return {...ownProps, ...addedProps};
}

function Component() {
  return function(PresentationalComponent) {
    return class ErrorBoundaryComponent extends React.Component {
      constructor(props) {
        super(props);

        this.state = {hasError: false};
      }

      componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true, error, info});

        //TODO Log error to error reporting service
      }

      render() {
        if (this.state.hasError) {
          return <PresentationalComponent error={this.state.error} info={this.state.info} {...this.props} />;
        }

        return this.props.children;
      }
    }
  }
}

export default compose(
  BEMComponent('errorBoundary'),
  Component()
);
