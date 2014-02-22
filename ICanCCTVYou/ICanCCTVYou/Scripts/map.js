
var lat;
var lng;
var map;

var resultsLayer;
var markerCache;
var zoomLevel = 16;

$.ajaxSetup({
    beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Latitude', lat);
        xhr.setRequestHeader('X-Longitude', lng);
    }
});

var centerPoint = L.AwesomeMarkers.icon({
    icon: 'bullseye',
    prefix: 'fa',
    markerColor: 'green'
});

var redMarker = L.AwesomeMarkers.icon({
    icon: 'video-camera',
    prefix: 'fa',
    markerColor: 'red'
});

var greenMarker = L.AwesomeMarkers.icon({
    icon: 'video-camera',
    prefix: 'fa',
    markerColor: 'orange'
});

function scrollMap(position) {
    // Scrolls the map so that it is centered at (position.coords.latitude, position.coords.longitude)

    lat = position.coords.latitude;
    lng = position.coords.longitude;

    console.log("Map Setup - lat:" + lat + " lng:" + lng);

    resultsLayer.clearLayers();

    var center = L.latLng(lat, lng);
    map.setView(center, zoomLevel);

    var marker = L.marker([lat, lng], { icon: centerPoint })
                            .bindPopup(
                                '<p><strong>You!</strong><br />' +
                                    'Lat:' + lat + '<br />' +
                                    'Lng:' + lng + '<br />' + '</p>'
                            );

    var radius = L.circle([lat, lng], 50);

    resultsLayer.addLayer(marker);
    //resultsLayer.addLayer(radius);

    zoomLevel = map.getZoom()
    var bounds = map.getBounds();
    var center = map.getCenter();

    //if (zoomLevel > 9) {



        $.get('/Home/GetCameras', {
            north: bounds.getNorthWest().lat,
            east: bounds.getSouthEast().lng,
            south: bounds.getSouthEast().lat,
            west: bounds.getNorthWest().lng
        }).done(function (results) {
            $.each(results.Cameras, function (index, value) {
                var marker = L.marker([value.Latitude, value.Longitude], { icon: redMarker })
                    .bindPopup(
                        '<p><strong>' + value.LocationName + '</strong><br />' +
                            value.CameraNumber + '<br />' +
                            'Lat:' + value.Latitude + '<br />' +
                            'Lng:' + value.Longitude + '<br />' +
                           value.CCTVScheme + '</p>'
                    );

                addMarker(value.CameraNumber, marker);
                resultsLayer.addLayer(marker);

               // if (zoomLevel > 15) {
                    var radius = L.circle([value.Latitude, value.Longitude], 50, { fillColor: 'red' });
                    resultsLayer.addLayer(radius);
               // }
            });


            $.each(results.NearestCameras, function (index, value) {
                var nearestMarker = getMarkers(value.CameraNumber);

                resultsLayer.removeLayer(nearestMarker);

                var marker = L.marker([value.Latitude, value.Longitude], { icon: greenMarker })
                        .bindPopup(
                            '<p><strong>' + value.LocationName + '</strong><br />' +
                                value.CameraNumber + '<br />' +
                                'Lat:' + value.Latitude + '<br />' +
                            'Lng:' + value.Longitude + '<br />' +
                               value.CCTVScheme + '</p>'
                        );

                addMarker(marker);
                resultsLayer.addLayer(marker);
            });

        });

   // }



    
}

function error(msg) {
    console.log("Geo not Supported")
}




if (navigator.geolocation) {
    //var watchId = navigator.geolocation.watchPosition(scrollMap);
    navigator.geolocation.getCurrentPosition(scrollMap);
    setupMap();
} else {
    error('not supported');
}




function setupMap() {
    var gmapLayer = new L.Google('ROADMAP');
    resultsLayer = L.layerGroup();

    map = L.map('map', {
        layers: [gmapLayer, resultsLayer],
        center: [55.856, -4.257],
        zoom: 12,
        maxBounds: L.latLngBounds([49, 15], [60, -25])
    });

    markerCache = {};

    map.on('zoomend', function () {
        //alert("zoom recenter")
        zoomLevel = map.getZoom();
      //  map.setView([lat, lng], zoomLevel);
    });


}

function addMarker(key, marker) {
    markerCache[key] = markerCache[key] || [];
    markerCache[key].push(marker);
}

function getMarkers(latlng) {
    var key = latlng.toString();
    return markerCache[key];
}





//$(function () {

//    var gmapLayer = new L.Google('ROADMAP');
//    var resultsLayer = L.layerGroup();

//    var map = L.map('map', {
//        layers: [gmapLayer, resultsLayer],
//        center: [55.856, -4.257],
//        zoom: 12,
//        maxBounds: L.latLngBounds([49, 15], [60, -25])
//    });

//    var redMarker = L.AwesomeMarkers.icon({
//        icon: 'video-camera',
//        prefix: 'fa',
//        markerColor: 'red'
//    });

//    var greenMarker = L.AwesomeMarkers.icon({
//        icon: 'video-camera',
//        prefix: 'fa',
//        markerColor: 'orange'
//    });

//    var centerPoint = L.AwesomeMarkers.icon({
//        icon: 'bullseye',
//        prefix: 'fa',
//        markerColor: 'green'
//    });

//    var markerCache = {};

//    function addMarker(key, marker) {
//        //var latlng = marker.getLatLng(),
//        // key = latlng.toString();

//        markerCache[key] = markerCache[key] || [];
//        markerCache[key].push(marker);
//    }

//    function getMarkers(latlng) {
//        var key = latlng.toString();
//        return markerCache[key];
//    }

//    map.locate({ setView: true, maxZoom: 12 });

//    var loadMarkers = function () {
//        resultsLayer.clearLayers();
//        markerCache = {};
//        var zoomLevel = map.getZoom()

//        if (zoomLevel > 9) {
//            var bounds = map.getBounds();
//            var center = map.getCenter();
//            console.log(map.getZoom());
//            //add a center point marker
//            var marker = L.marker([center.lat, center.lng], { icon: centerPoint })
//                        .bindPopup(
//                            '<p><strong>You!</strong><br />' +
//                                'Lat:' + center.Latitude + '<br />' +
//                                'Lng:' + center.Longitude + '<br />' + '</p>'
//                        );

//            var radius = L.circle([center.lat, center.lng], 50);

//            //addMarker(value.CameraNumber, marker);
//            resultsLayer.addLayer(marker);
//            resultsLayer.addLayer(radius);


//            console.log("map moved")
//            $.get('/Home/GetCameras', {
//                north: bounds.getNorthWest().lat,
//                east: bounds.getSouthEast().lng,
//                south: bounds.getSouthEast().lat,
//                west: bounds.getNorthWest().lng,
//                lat: center.lat,
//                lng: center.lng
//            }).done(function (results) {
//                $.each(results.Cameras, function (index, value) {
//                    //debugger;
//                    var marker = L.marker([value.Latitude, value.Longitude], { icon: redMarker })
//                        .bindPopup(
//                            '<p><strong>' + value.LocationName + '</strong><br />' +
//                                value.CameraNumber + '<br />' +
//                                'Lat:' + value.Latitude + '<br />' +
//                                'Lng:' + value.Longitude + '<br />' +
//                               value.CCTVScheme + '</p>'
//                        );

//                    addMarker(value.CameraNumber,marker);
//                    resultsLayer.addLayer(marker);

//                    if (zoomLevel > 15) {
//                        var radius = L.circle([value.Latitude, value.Longitude], 15, {fillColor: 'red'});
//                        resultsLayer.addLayer(radius);
//                    }
//                });


//                $.each(results.NearestCameras, function (index, value) {
//                    var nearestMarker = getMarkers(value.CameraNumber);

//                    resultsLayer.removeLayer(nearestMarker);

//                    var marker = L.marker([value.Latitude, value.Longitude], { icon: greenMarker })
//                            .bindPopup(
//                                '<p><strong>' + value.LocationName + '</strong><br />' +
//                                    value.CameraNumber + '<br />' +
//                                    'Lat:' + value.Latitude + '<br />' +
//                                'Lng:' + value.Longitude + '<br />' +
//                                   value.CCTVScheme + '</p>'
//                            );

//                    addMarker(marker);
//                    resultsLayer.addLayer(marker);
//                });





//            });
//        }
//    };

//    loadMarkers();
//    map.on('moveend', loadMarkers);
//});