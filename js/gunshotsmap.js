function GunShotsMap(container, controls, width, height, data){
  this.map = {};
  this.map.margin = { top: 20, right: 10, bottom: 40, left: 90 };
  this.map.height = height;
  this.map.width = width;

  this.map.data = data;
  this.container = container;
  this.controls = controls;

  this.map.svg = null;
  this.map.path = null;
  this.map.tooltip = null;
  this.map.radius = null;

  this.map.max = { males: 0, females: 0, all: 0, value: 0 };
  this.map.min = { males: 9999, females: 9999, all: 9999, value:0 };
}

GunShotsMap.prototype = {
    constructor: GunShotsMap,

    createControls: function() {
      var self = this;

      // create radio buttons selectors
      var values = ['male', 'female', 'all'];
      var container = d3.select(self.controls);

      var genders = container.selectAll().data(values)
            .enter().append("span");

      genders.append("input")
          .attr("type", "radio")
          .attr("name", "gender")
          .attr("value", function(d){ return d })
          .attr("class", "gender");

      genders.append("label").text(function(d){ return d; });
      d3.select('input[value="all"]').node().checked = true;

      d3.selectAll(".gender")
        .on("click", function(d){
          this.checked = true;
          self.update();
        });
    },

    createTooltip: function(){
      this.map.tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);
    },

    setMinMaxValues: function(){
        var self = this,
            map = self.map;

        var info = map.data.objects.counties.geometries;
        for (i = 0; i < info.length; i++){
            var males = info[i].properties.males;
            var females = info[i].properties.females;
            var total = males + females;

            if (males < map.min.males) map.min.males = males;
            if (males > map.max.males) map.max.males = males;
            if (females < map.min.females) map.min.females = females;
            if (females > map.max.females) map.max.females = females;
            if (total < map.min.all) map.min.all = total;
            if (total > map.max.all) map.max.all = total;
        }
    },

    setRadius: function(){
        var map = this.map;
        var selectedGender = d3.select('input[name="gender"]:checked').node().value;

        var min, max;
        if (selectedGender == "male"){
            min = map.min.males;
            max = map.max.males;
        } else if (selectedGender == "female"){
            min = map.min.females;
            max = map.max.females;
        } else {
            min = map.min.all;
            max = map.max.all;
        }

        map.max.value = max;
        map.min.value = min;
        map.radius = d3.scale.sqrt()
            .domain([min, max])
            .range([0, 80]);
    },

    update: function(){
        var self = this,
            map = self.map;

        var selectedGender = d3.select('input[name="gender"]:checked').node().value;
        map.svg.selectAll(".countyData").remove();
        map.svg.select(".legend").remove();
        self.setRadius();

        map.svg.append("g")
            .attr("class", "bubble")
          .selectAll("circle")
            .data(topojson.feature(map.data, map.data.objects.counties).features
              .sort(function(a, b) {
                if (selectedGender == "all")
                  return (b.properties.males + b.properties.females) - (a.properties.males + a.properties.females);
                else if (selectedGender == "males")
                  return b.properties.males - a.properties.males;
                else return b.properties.females - a.properties.females;
              }))
          .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + map.path.centroid(d) + ")"; })
            .attr("class", "countyData")
            .attr("r", function(d) {
                var males = 0, females = 0;
                if (d.properties.males != null && d.properties.males != undefined)
                  males = d.properties.males;
                if (d.properties.females != null && d.properties.females != undefined)
                  females = d.properties.females;

                 if (selectedGender == "all")
                  return map.radius(males + females);
                 else if (selectedGender == "male")
                  return map.radius(males);
                 else
                  return map.radius(females);
            })
            .on("mouseover", function(d){
                map.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                map.tooltip.html(d.properties.name + "<br/>" +
                         "Males:" + d.properties.males + "<br/>" +
                         "Females:" + d.properties.females + "<br/>" +
                         "Total:" + (d.properties.males + d.properties.females)  + "<br/>")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                map.tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

            var legend = map.svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (map.width - 100) + "," + (map.height - 20) + ")")
              .selectAll("g")
                .data([map.max.value/4, map.max.value/2, map.max.value])
              .enter().append("g");

            legend.append("circle")
                .attr("cy", function(d) { return -map.radius(d); })
                .attr("r", map.radius);

            legend.append("text")
                .attr("y", function(d) { return -2 * map.radius(d); })
                .attr("dy", "1.3em")
                .text(d3.format(".1s"));
    },

    init: function() {
        var self = this,
            map = self.map;

        // set up container properties
        //var x = d3.select(self.container).style("width");
        //var y = d3.select(self.container).style("height");

        //map.width = parseInt(x) - map.margin.left - map.margin.right,
  		  //map.height = parseInt(y) - map.margin.top - map.margin.bottom;
        map.width = map.width - map.margin.left - map.margin.right,
        map.height = map.height - map.margin.top - map.margin.bottom;

        map.svg = d3.select(self.container).append("svg")
          .attr({
              width: map.width + map.margin.left + map.margin.right,
              height: map.height + map.margin.top + map.margin.bottom
          })
          .append("g")
            .attr("transform", "translate(" + map.margin.left + ","
                                            + map.margin.top + ")");

        // set up d3 geo projections and add map borders
        map.path = d3.geo.path().projection(null);
        map.svg.append("path")
          .datum(topojson.feature(map.data, map.data.objects.nation))
          .attr("class", "land")
          .attr("d", map.path);

        map.svg.append("path")
          .datum(topojson.mesh(map.data, map.data.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "border border--state")
          .attr("d", map.path);

        self.createControls();
        self.createTooltip();
        self.setMinMaxValues();
        self.update();
    }
}
