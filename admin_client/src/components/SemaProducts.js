import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as healthCheckActions from 'actions/healthCheckActions';
import SeamaDatabaseError from './SeamaDatabaseError';
import SeamaServiceError from './SeamaServiceError';

import Button from './common/Button';

class SemaProducts extends Component {
  constructor(props) {
    super(props);
    this.showSeamaErrors = this.showSeamaErrors.bind(this);
  }

  showSeamaErrors() {
    if (this.props.healthCheck.server !== 'Ok') {
      return SeamaServiceError(this.props);
    }
    if (this.props.healthCheck.database !== 'Ok') {
      return SeamaDatabaseError(this.props);
    }
  }

  render() {
    return (
      <div className="">
        {this.showSeamaErrors()}
        <div className="">
          <Button
            buttonStyle="primary"
            className="pull-right"
            icon="plus"
            buttonText="Create Product"
          />
          <h2>Products</h2>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    healthCheck: state.healthCheck
  };
}

function mapDispatchToProps(dispatch) {
  return {
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SemaProducts);
