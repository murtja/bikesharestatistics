/**
 * Created by 100478903 on 2017-02-13.
 */

// TODO https://codepen.io/hubpork/pen/xriIz

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: createPoint(43.6425662, -79.3892455) // CN Tower
    });

    addMarkers(map);
}

function getCoordinatesList(){
    return [
        createPoint(43.6425662, -79.3892455),
        createPoint(43.6671223, -79.3956618)
    ]
}

function addMarkers(map) {
    var coordinatesList = getCoordinatesList();
    var markerList = [];

    var i;
    for(i=0; i<coordinatesList.length; i++){
        var marker = new google.maps.Marker({
            position: coordinatesList[i],
            map: map
        });

        markerList.push(marker);
    }

    return markerList;
}

function createPoint(lat, lang) {
    return {lat: lat, lng: lang};
}