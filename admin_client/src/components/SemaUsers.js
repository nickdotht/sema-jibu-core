import React, { Component } from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router';

import { fetchUsers, deleteUser } from 'actions/UserActions';
import UserList from './common/UserList';
import Button from './common/Button';
import Modal from './common/Modal';
import UserForm from './common/UserForm';

// TODO split up container and presentational components
import SeamaDatabaseError from './SeamaDatabaseError';
import SeamaServiceError from './SeamaServiceError';

class SemaUsers extends Component {
  constructor(props) {
    super(props);

    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.state = {
      show: false
    };
  }

  openCreateModal() {
    this.setState({ show: true });
  }

  closeCreateModal() {
    this.setState({ show: false });
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  showContent() {
    const { healthCheck, users, loading } = this.props;

    if (healthCheck.server !== 'Ok') {
      return SeamaServiceError();
    }
    if (healthCheck.database !== 'Ok') {
      return SeamaDatabaseError();
    }

    return (
      <div style={{ margin: '5px' }}>
        <div className="">
          <Button
            buttonStyle="primary"
            buttonSize="small"
            className="pull-right"
            onClick={this.openCreateModal}
            icon="plus"
            buttonText="Create User"
          />
          <h2>Users</h2>
        </div>
        {this.state.show && (
          <Modal
            show
            onClose={this.closeCreateModal}
            onSave={this.props.onSave}
            title="Create User"
            body={<UserForm />}
          />
        )}
        {!loading && (
          <UserList
            data={users}
            onDeleteClick={id => this.props.deleteUser(id)}
          />
        )}
      </div>
    );
  }

  render() {
    return this.showContent();
  }
}

function mapStateToProps(state) {
  return {
    healthCheck: state.healthCheck,
    users: state.user.users,
    loading: state.user.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
    fetchUsers: bindActionCreators(fetchUsers, dispatch),
    deleteUser: bindActionCreators(deleteUser, dispatch),
    onSave: () => dispatch(submit('userForm'))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SemaUsers)
);
