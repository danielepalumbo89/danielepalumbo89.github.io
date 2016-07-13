---
layout: post
title:  "Leaflet Mobile Map"
date: 2016-06-05
---

<h2>Leaflet Mobile Map</h2>
<div>
<head>
  <title> Leaflet tutorial </title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
  <style>
    body {
      padding: 0;
      margin: 0;
    }
    html, body, #map {
      height: 100%;
    }
  </style>
</head>

<body>
<div id="map" class="leaflet-container leaflet-touch leaflet-fade-anim" tabindex="0" style="position: relative;" </div>

<script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script>

<script>
/* JavaScript goes here. */


var map = L.map('map');

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuaXB3IiwiYSI6IkZiVWVtMzgifQ.PVjmr2mCPJOFrOBt3lL7ww', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(map);

  map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

</script>
