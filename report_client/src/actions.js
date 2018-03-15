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

export function fetchSeamaUser() {
    return {type: types.RECEIVE_SEMA_USER, seamaUser: "Whiskey"};
}


