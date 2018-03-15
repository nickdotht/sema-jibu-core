import * as types from 'actions/actionTypes';


export function receiveStuff(json) {
    var array = json.map( name => name.username)
    return {type: types.RECEIVE_SEMA_USER, stuff: array};
}

export function fetchStuff() {
    return dispatch => {
        return fetch('/users')
        .then(response => response.json())
        .then(json => dispatch(receiveStuff(json)));
    };
}

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

// export function fetchSeamaUser() {
//     return {type: types.RECEIVE_SEMA_USER, seamaUser: "Whiskey"};
// }


