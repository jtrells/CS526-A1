'use strict';

// Main program object. Hang 'global' functions and variables off App
var App = App || {};

(function(){

    // iife global
    var self = this || {};

    App.initMap = function() {

        // get the width of the map div from the bootstrap library
        var width = d3.select(".mapDiv").node().clientWidth;
        var height = width * 0.85;

        console.log(width);

        // set the height of the map
        d3.select("#mapid").style("height", height);

        // access the map div and store it
        self.map =  L.map('mapid').setView([41.8781, -87.6298], 14);

        // create the map with the open streetmap tiles
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(self.map);

    };

})();