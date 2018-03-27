var rootComponent;

export function initializeState( root){
    console.log("Initializing rest services")
    rootComponent = root;
}

export function receiveSeamaUser(json) {
    var name = json.seamaUser;
    rootComponent.setState( {seamaUser:name});
    console.log("receiveSeamaUser - ", name)
}

export function fetchSeamaUser() {
    try {
        return fetch('/seama_user')
            .then(response => response.json())
            .then(json => receiveSeamaUser(json))
            .catch(function(error){
                console.log("fetchSeamaUser failed", error);
            });
    }catch (ex){
        console.log(ex)
    }
}

