function TopoMap(container, data){
    this.map = {};
    this.map.margin = { top: 20, right: 10, bottom: 40, left: 90 };
    this.map.height = 0;
    this.map.width = 0;
    this.map.container = container;

    this.map.data = data;

    this.map.svg = null;
    this.map.path = null;
    this.map.tooltip = null;

    this.init();
}

TopoMap.prototype = {
    constructor: TopoMap,

    update: function(){
        var self = this,
            map = self.map;
    },

    init: function() {
        var self = this,
            map = self.map;

        // set up container properties
        var x = d3.select(map.container).style("width");
        var y = d3.select(map.container).style("height");

        map.width = parseInt(x) - map.margin.left - map.margin.right;
        map.height = parseInt(y) - map.margin.top - map.margin.bottom;
        //map.width = x - map.margin.left - map.margin.right,
            //map.height = map.height - map.margin.top - map.margin.bottom;

        map.svg = d3.select(map.container).append("svg")
            .attr({
                width: map.width + map.margin.left + map.margin.right,
                height: map.height + map.margin.top + map.margin.bottom
            })
            .append("g")
            .attr("transform", "translate(" + map.margin.left + ","
            + map.margin.top + ")");

        // set up d3 geo projections and add map borders
        var projection = d3.geo.albersUsa()
            .scale(1280).translate([map.width / 2, map.height / 2]);

        map.path = d3.geo.path().projection(projection);

        map.svg.append("path")
            .datum(topojson.feature(map.data, map.data.objects.land))
            .attr("class", "land")
            .attr("d", map.path);

        map.svg.append("path")
            .datum(topojson.mesh(map.data, map.data.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", map.path);

        map.svg.append("path")
            .datum(topojson.mesh(map.data, map.data.objects.counties, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", map.path);

        self.update();
    }
}
