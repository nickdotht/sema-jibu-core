import * as types from 'actions/actionTypes';


export function receiveSeamaUser(json) {
    var name = json.seamaUser
    return {type: types.RECEIVE_SEMA_USER, seamaUser: name};
}

export function fetchSeamaUser() {
    return dispatch => {
        return fetch('/seama_user')
            .then(response => response.json())
            .then(json => dispatch(receiveSeamaUser(json)));
    };
}

