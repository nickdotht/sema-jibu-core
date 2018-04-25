import * as allActions from './ActionTypes';

export function receiveHealthCheck(data) {
    console.log("receiveHealthCheck - ", data.toString())
    return {type: allActions.RECEIVE_HEALTHCHECK, healthCheck: data};
}


export function fetchHealthCheck() {
    return (dispatch) => {
        fetch('/untapped/health-check', {credentials: 'include'})
            .then(response =>
                response.json().then(data => ({
                    data:data,
                    status: response.status
                }))
            )
            .then(response => {
                if(response.status === 200){
                    dispatch(receiveHealthCheck(response.data))
                }else{
                    var data = {server: "failed", database: "n/a"};
                    dispatch(receiveHealthCheck(data))

                }
            })
            .catch(function(error){
                // This means the service isn't running.
                var data = {server: "failed", database: "n/a"};
                dispatch(receiveHealthCheck(data))
            });
        ;
    };
}

