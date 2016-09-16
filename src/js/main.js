'use strict';

// Main program object. Hang 'global' functions and variables off App
var App = App || {};

(function(){

    // iife global
    var self = this || {};

    App.initMap = function() {

        d3.csv('../..//data/us_states.csv', function(error, data){
            if (error) return console.error(error);

            d3.select("#states_cmp").selectAll("p")
                .data(data).enter().append("p")
                .attr("class", "us-state-cmp")
                .text(function(d){ return d.StateCode; });
        });

        d3.csv('../..//data/illinois_counties.csv', function(error, data){
            if (error) return console.error(error);

            /*
            d3.select("#regional_cmp_list").selectAll("p")
                .data(data).enter().append("p")
                .attr("class", "county-cmp")
                .text(function(d){ return d.County; });*/
        });

        d3.csv('../..//data/test_centers2.csv', function(error, data){
            if (error) return console.error(error);

            d3.json('../..//data/us-expenses.json', function(error, us) {
                var nat_map_src, nat_map_cmp;

                // get the width of the map div from the bootstrap library
                var width = d3.select("#national_mapid_src").node().clientWidth;
                var height = width * 0.85;

                var data_illinois = data.filter(function (d) {
                    return d.STATE_ABBREVIATION == "IL"
                });
                var data_chicago = data.filter(function (d) {
                    return d.COUNTY == "Cook"
                });

                // set the height of the national maps
                d3.select("#national_mapid_src").style("height", 800);
                new TopoMap('#national_mapid_src', us);
                //nat_map_src = new Map("national_mapid_src", 4, data, 37.0902, -95.7129);

                d3.select("#national_mapid_cmp").style("height", 800);
                new TopoMap('#national_mapid_cmp', us);
                //nat_map_cmp = new Map("national_mapid_cmp", 4, data, 37.0902, -95.7129);

                d3.select("#regional_map_src").style("height", height);
                d3.select("#regional_map_cmp").style("height", height);
                d3.select("#local_map_src").style("height", height);
                d3.select("#local_map_cmp").style("height", height);

                new Map("regional_map_src", 8, data_illinois, 40.6331, -89.3985);
                new Map("regional_map_cmp", 8, data_illinois, 40.6331, -89.3985);
                new Map("local_map_src", 12, data_chicago, 41.8781, -87.6298);
                new Map("local_map_cmp", 12, data_chicago, 41.8781, -87.6298);
            });
        });
    };

})();