import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router';
import SeamaDatabaseError from './SeamaDatabaseError';
import SeamaServiceError from './SeamaServiceError';

class SemaProducts extends Component {
  render() {
    return this.showContent();
  }

  showContent(props) {
    if (this.props.healthCheck.server !== 'Ok') {
      return SeamaServiceError(props);
    }
    if (this.props.healthCheck.database !== 'Ok') {
      return SeamaDatabaseError(props);
    }
    return <div style={this.getHeight()}>Sema Products go here</div>;
  }

  getHeight() {
    let windowHeight = window.innerHeight;
    // TODO 52px is the height of the toolbar. (Empirical)
    windowHeight -= 52;
    const height = `${windowHeight.toString()}px`;
    return { height };
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SemaProducts)
);
