import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions, healthCheckActions } from 'actions';
import { withRouter } from 'react-router';

class SeamaToolbar extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('tokenExpired', this.handleExpiredEvent.bind(this));
  }

  handleExpiredEvent(event) {
    console.log('tokenExpired');
    this.props.authActions.logout();
  }

  componentWillUnmount() {
    window.removeEventListener('tokenExpired', this.handleExpiredEvent);
  }

  logOut() {
    console.log('logout');
    this.props.authActions.logout();
  }

  render() {
    const {
      healthCheck,
      currentUser: { first_name, last_name }
    } = this.props;

    return (
      <div className="SeamaNavToolbar" id="semaToolbar">
        <Navbar
          bsStyle="inverse"
          style={{
            marginBottom: '0px',
            borderRadius: 0
          }}
        >
          <Navbar.Text>
            Welcome
            {' '}
            {first_name}
            {' '}
            {last_name}
          </Navbar.Text>
          <Navbar.Text>
            Version:
            {this.props.Version}
          </Navbar.Text>
          <Navbar.Text>
            Server:
            {healthCheck.server === 'Ok'
              ? healthCheck.version
              : healthCheck.server}
          </Navbar.Text>
          <Nav pullRight>
            <NavItem onClick={this.logOut} href="#">
              Logout
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logState: state.auth.LogState,
    currentUser: state.auth.currentUser,
    healthCheck: state.healthCheck
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SeamaToolbar)
);
