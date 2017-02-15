/**
 * Created by 100478903 on 2017-02-13.
 */
var map;
var addRating;

$(document).ready(function () {
    getFirebaseData();

    $("#submitRatingButton").click(function () {
        var stationId = $("#stationSelectionInput").val();
        var rating = $("#ratingValue").val();

        addRating(stationId, rating);
    });
});

function createSelectBox(data) {
    var stations = data.val();
    var outputDiv = $("#stationSelectDiv");

    outputDiv.empty();

    var select = $("<select class='form-control' id='stationSelectionInput' name='stationSelection'>");

    var i;
    for (i = 0; i < stations.length; i++) {
        var stationName = stations[i].stationName;
        var option = $("<option value='" + i + "'>" + stationName + "</option>");
        select.append(option);
    }

    outputDiv.append(select);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: createPoint(43.6425662, -79.3892455) // CN Tower
    });
}

function getFirebaseData() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBxyBeWHvoqud67VAPGjv4nQs--4BEMpQg",
        authDomain: "bikesharestatistics.firebaseapp.com",
        databaseURL: "https://bikesharestatistics.firebaseio.com",
        storageBucket: "bikesharestatistics.appspot.com",
        messagingSenderId: "306466104920"
    };


    // Initialize the default app
    var app = firebase.initializeApp(config);
    var db = app.database();

    db.ref('/stationBeanList/').once('value').then(function (snapshot) {
        console.log("data retrieve from db");
        addMarkers(map, snapshot);
        initGraph(snapshot);
        createSelectBox(snapshot);
    });

    function addRatingHandler(stationId, rating) {
        db.ref('/stationBeanList/' + stationId + '/ratings/').push().set({
            value: rating
        });
        alert ("Thank you for rating");
    }

    addRating = addRatingHandler;
}

function addMarkers(map, dataList) {
    var markerList = [];
    var coordinatesList = dataList.val();

    var i;
    for (i = 0; i < coordinatesList.length; i++) {
        var point = createPoint(coordinatesList[i].latitude, coordinatesList[i].longitude);
        var marker = new google.maps.Marker({
            position: point,
            map: map
        });

        markerList.push(marker);
    }

    return markerList;
}

function createPoint(lat, lang) {
    return {lat: lat, lng: lang};
}

function initGraph(data) {
    var stations = data.val();
    var dataObject = {};
    var labels = [];
    var bikeAvailabilityData = [];
    var bikeRatingData = [];
    var i;
    for (i = 0; i < stations.length; i++) {
        labels.push(stations[i].stationName);
        bikeAvailabilityData.push(stations[i].availableBikes);

        var averageRating = 0;
        var countRating = 0;
        var ratings = [];
        if (stations[i].ratings) {
            for (var property in stations[i].ratings) {
                if (stations[i].ratings.hasOwnProperty(property)) {
                    var value = stations[i].ratings[property].value;
                    var convertedValue = parseInt(value);
                    if (convertedValue) {
                        averageRating = averageRating + convertedValue;
                        countRating++;
                    }
                }
            }
            if (countRating > 0) {
                averageRating = averageRating / countRating;
            }
        }
        bikeRatingData.push(averageRating);
    }
    dataObject.labels = labels;
    dataObject.datasets = [
        {
            "label": "Bike Availability",
            "data": bikeAvailabilityData,
            "borderWidth": 0
        }
    ];

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: dataObject,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var ratingDataObject = {};
    ratingDataObject.labels = labels;
    ratingDataObject.datasets = [
        {
            "label": "Bike Ratings",
            "data": bikeRatingData,
            "borderWidth": 0
        }
    ];

    ctx = document.getElementById("ratingChart");
    var ratingChart = new Chart(ctx, {
        type: 'bar',
        data: ratingDataObject,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}