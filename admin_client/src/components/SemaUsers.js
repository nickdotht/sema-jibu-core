import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router';
import { RingLoader } from 'react-spinners';

import { fetchUsers, deleteUser, createUser } from 'actions/UserActions';
import UserList from './common/UserList';
import Button from './common/Button';
import Modal from './common/Modal';
import UserForm from './common/UserForm';
import './common/style.css';

// TODO split up container and presentational components
import SeamaDatabaseError from './SeamaDatabaseError';
import SeamaServiceError from './SeamaServiceError';
import { createLoadingSelector } from '../reducers/selectors';

class SemaUsers extends Component {
  constructor(props) {
    super(props);

    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.editUser = this.editUser.bind(this);
    this.state = {
      show: false,
      editMode: false,
      editUser: {}
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  clearState() {
    this.setState({ show: false, editMode: false, editUser: {} });
  }

  editUser(id) {
    const { users } = this.props;
    const user = users.filter(user => id === user.id);
    this.setState({ editMode: true, editUser: user });
    this.openCreateModal();
  }

  openCreateModal() {
    this.setState({ show: true });
  }

  closeCreateModal() {
    this.clearState();
  }

  showContent() {
    const { healthCheck, users, loading } = this.props;
    const { editMode } = this.state;

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
            title={editMode ? 'Edit User' : 'Create User'}
            body={(
              <UserForm
                user={this.state.editUser}
                onSubmit={values => {
                  editMode
                    ? this.props.updateUser(values)
                    : this.props.createUser(values);
                  this.closeCreateModal();
                }}
              />
)}
          />
        )}
        {loading && (
          <div className="spinner">
            <RingLoader color="#36D7B7" />
          </div>
        )}
        {!loading && (
          <UserList
            data={users}
            onEditClick={id => this.editUser(id)}
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

const loadingSelector = createLoadingSelector(['FETCH_USERS']);
function mapStateToProps(state) {
  return {
    healthCheck: state.healthCheck,
    users: state.users,
    loading: loadingSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
    fetchUsers: bindActionCreators(fetchUsers, dispatch),
    deleteUser: bindActionCreators(deleteUser, dispatch),
    createUser: bindActionCreators(createUser, dispatch),
    updateUser: values => console.log('edit users ', values),
    onSave: () => dispatch(submit('userForm'))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SemaUsers)
);
