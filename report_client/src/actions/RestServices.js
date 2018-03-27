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
    return fetch('/seama_user')
        .then(response => response.json())
        .then(json => receiveSeamaUser(json))
        .catch(function(error){
            console.log("fetchSeamaUser failed", error);
        });
}

export function receiveSeamaKiosks(json) {
    var kiosk = json.kiosks;
    rootComponent.setState( {seamaKiosk:kiosk});
    console.log("receiveSeamaUser - ", kiosk)
}

export function fetchSeamaKiosks() {
    return fetch('/seama_kiosks')
        .then(response => response.json())
        .then(json => receiveSeamaKiosks(json))
        .catch(function(error){
            console.log("fetchSeamaKiosks failed", error);
        });
}

