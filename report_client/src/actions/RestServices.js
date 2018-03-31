var rootComponent;

export function initializeState( root){
    console.log("Initializing rest services")
    rootComponent = root;
}

// export function receiveSeamaUser(json) {
//     var name = json.seamaUser;
//     rootComponent.setState( {seamaUser:name});
//     console.log("receiveSeamaUser - ", name)
// }
//
// export function fetchSeamaUser() {
//     return fetch('/seama_user')
//         .then(response => response.json())
//         .then(json => receiveSeamaUser(json))
//         .catch(function(error){
//             console.log("fetchSeamaUser failed", error);
//         });
// }

export function receiveSeamaKiosks(json) {
    var kiosk = json.kiosks;
    rootComponent.setState( {seamaKiosk:kiosk});
    console.log("receiveSeamaUser - ", kiosk)
}

export function fetchSeamaKiosks() {
    return fetch('/untapped/kiosks')
        .then(response => response.json())
        .then(json => receiveSeamaKiosks(json))
        .catch(function(error){
            console.log("fetchSeamaKiosks failed", error);
        });
}

export function receiveWaterQuality(json) {
    rootComponent.updateWaterQualityState(json);
    console.log("receiveSeamaWaterQuality - ", json)
}

export function fetchWaterQuality( params) {
    var urlParms = queryParams(params);
    var url = '/untapped/water-quality?' + urlParms;
    return fetch(url)
        .then(response => response.json())
        .then(json => receiveWaterQuality(json))
        .catch(function(error){
            console.log("fetchWaterQuality failed", error);
        });
}

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}