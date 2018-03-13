import * as types from './actionTypes';


export function receiveStuff(json) {
    var array = json.map( name => name.username)
    return {type: types.RECEIVE_STUFF, stuff: array};
}

export function fetchStuff() {
    return dispatch => {
        return fetch('/users')
        .then(response => response.json())
        .then(json => dispatch(receiveStuff(json)));
    };
}

