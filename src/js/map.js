function Map(container, zoom, data, lat, long){
    this.map = {};
    this.map.container = container;
    this.map.zoom = zoom;
    this.map.data = data;
    this.map.center_lat = lat;
    this.map.center_long = long
    this.map.leaflet_map = null;

    this.init();
}

Map.prototype ={
    constructor: Map,

    init: function(){
        var self = this || {},
            map = self.map;

        map.leaflet_map = L.map(map.container).setView([map.center_lat, map.center_long], map.zoom);

        // create the map with the open streetmap tiles
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map.leaflet_map);

        for (var i = 0; i < map.data.length; i++){
            L.circle([map.data[i].LAT, map.data[i].LONG], 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(map.leaflet_map);
        }

    }
}



