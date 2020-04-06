var mainChart = function() {
    var config = {
        el: null,
        dimensions: [],
        useRepulsion: false,
        useTooltip: true,
        tooltipFormatter: function(d) {
            return d;

    }
    };

    var events = d3.dispatch('panelEnter', 'panelLeave', 'dotEnter', 'dotLeave');
    var el = null;

    //Define the variables:
    var size = 500;
    var margin = 50;
    var dotRadius = 6;
    //var colorScale= d3.scale.category10();
    var colorScale= d3.scale.ordinal().range(['#ff8533', '#80ff80']);
    var width = 400;
    var height = 400;
    var newsize = 1000;

    //Define Force properties:
   var force = d3.layout.force()
                        .chargeDistance(0)
                        .charge(-20)
                        .friction(0.2);
                        //.linkDistance(40);



    var render = function(data) {

        data = dataStandard(data);
        var arr = dimensions
                        .map(function(d) {
                        return d;
                        });

        //Function for standardizing the data
        function dataStandard(data) {
                            data.forEach(myFunction);
                           // Object.keys(data).forEach(myFunction);
                            function myFunction(item){
                                dimensions.forEach(function(dimension){
                                    item[dimension] = +item[dimension];
                                })
                            }

                           var x = {};
                                dimensions.forEach(myFunction_new);
                                function myFunction_new(dimension){
                                    x[dimension] = d3.scale.linear()
                                                        .domain(d3.extent(data
                                                        .map(function(d, i) {
                                                        return d[dimension];
                                             })))
                                                        .range([0, 1]);
                                }

                            data.forEach(myFunction_new2);
                            function myFunction_new2(item){
                                dimensions.forEach(function(dimension){
                                    item[dimension] = x[dimension](item[dimension]);
                                });
                            }

                                return data;
                        };


        var arr_len = arr.length;
        //console.log(arr_len);

        var math = Math.PI * 2;
        //console.log(math);

        //Define our scale:
        var newScale = d3.scale.linear()
                           .domain([0, arr_len])
                           .range([0, math]);



        //Define the chart rad, node count:
        var chartRadius = size/2  - margin;
        var nodeCount = data.length;

        // Prepare the column field to be used for future "force.size"

        var columns = dimensions.map(function(d, i) {
            var angle = newScale(i);
            var x = 200 + Math.sin(angle) * chartRadius;
            var y = 200 + Math.cos(angle) * chartRadius;
            return {
                index: nodeCount + i,
                x: x,
                y: y,
                fixed: true,
                name: d
            };
        });


        //prepare for nodes related data:
       var nodesData = [];
        data.forEach(function(d, i) {
            arr.forEach(function(m, n) {
                nodesData.push({
                    source: i,
                    target: nodeCount + n,
                    value: d[m]
                });
            });
        });

//console.log(nodesData)


            force.size([width, height])
            //.resume()
            .linkStrength(function(d){
                return d.value;
            })
            .nodes(data.concat(columns))
            .links(nodesData)
            .start();

        // Basic structure
        var svg = d3
                    .select(config.el)
                    .append('svg')
                    .attr("width", 700)
                    .attr("height", 500);


        var g = svg.append('g')
            .attr({
                transform: 'translate(' + [100, 50] + ')'
            });

         var repulse =  g.append('circle')
                               .classed('panel', true)
                               .attr({
                                    r: chartRadius,
                                    cx: chartRadius,
                                    cy: chartRadius
                        })

                        if(config.useRepulsion) {
            g.on('mouseenter', function(d) {
                force.chargeDistance(80).alpha(0.2);
                events.panelEnter();
            });
            g.on('mouseleave', function(d) {
                force.chargeDistance(0).resume();
                events.panelLeave();
            });
        }


//Code for colours:
var colorsx =function(d) {
    return d['target'];
}

var colorsy = function(d) {
    return d3.scale.category10();
}

/*var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); */


        //Dots functionality inside Circle with force drag:
        var nodes = g.selectAll('circle.dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr("r", dotRadius)
            .attr("fill", function(d,i){
                return colorScale(colorsx(d));
            })
            .style("opacity",1.0)



            nodes.on('mouseenter', function(d) {
                if(config.useTooltip) {
                    var mouse = d3.mouse(config.el);
                    tooltip.setText(config.tooltipFormatter(d)).setPosition(mouse[0], mouse[1]).show();
                }
                events.dotEnter(d);
                this.classList.add('active');
            })
            .on('mouseout', function(d) {
                if(config.useTooltip) {
                    tooltip.hide();
                }
                events.dotLeave(d);
                this.classList.remove('active');
            });


    force.on('tick', function() {
            if(config.drawLinks) {
                links.attr("x1", function(d){
                        return d.source.x;
                })
                    .attr("y1", function(d){
                        return d.source.y;
                    })
                    .attr("x2", function(d){
                        return d.target.x;
                    })
                    .attr("y2", function(d){
                        return d.target.y;
                    });
            }

            nodes.attr("cx", function(d){
                return d.x;
            })

                .attr("cy", function(d){
                    return d.y;
                });
        });

//NEWTEST:
var plotIns = function(){

            var test = g.selectAll('circle.dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr("r", dotRadius)
            .attr("fill", function(d,i){
                return colorScale(colorsx(d));
            })
            .style("opacity",0.5)


            test.attr("cx", function(d){
                return d.x;
            })
                .attr("cy", function(d){
                    return d.y;
                });

    }

            //Function to change OPACITY for our nodes:
            d3.select("#slider").on("input", function () {

                g.selectAll('circle.dot')

                        .style("opacity", d3.select("#slider").property("value")/100);
                });


                var dragn = d3.behavior.drag()

                .on("drag", function(d,i) {

                         tempx = d3.event.x - chartRadius;
						 tempy = d3.event.y - chartRadius;
						 newAngle = Math.atan2(tempy , tempx) ;
						newAngle = newAngle<0? 2*Math.PI + newAngle : newAngle;
						//console.log(newAngle);
						newposX = 200 + Math.cos(newAngle) * chartRadius;
						newposY = 200 + Math.sin(newAngle) * chartRadius;
						d3.select(this).attr('cx', newposX).attr('cy', newposY);

						//return newposX, newposY;
						d3.selectAll('circle.dot').remove();
                        plotIns();


                        var test = g.selectAll('circle.dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr("r", dotRadius)
            .attr("fill", function(d,i){
                return colorScale(colorsy(d));
            })
            .style("opacity",0.5)


            .attr("cx", function(d){
                return d.x;
            })
            .attr("cy", function(d){
                return d.y;
                });

                })

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

        //DESIGN THE ANCHORS

        var labelNodes = g.selectAll('circle.label-node')
            .data(columns)
            .enter()
            .append('circle')
            .attr("r",8)
            .attr("fill", "#003399")
            .attr("cx",function(d){
                return d.x;
            })
            .attr("cy", function(d){
                return d.y;
            })
            .call(dragn)
            //.on('drag', dragn)

.on("mouseover", function(d) {
            $(".demo").show();
                document.getElementById("demo").innerHTML = '<img width ="300" height="300" src="http://localhost:5000/d3_flask/plots/image'+ d.name +' "/>';
            })



        .on("mouseout", function(d) {
            $(".demo").hide();
        });


            //Text Anchors and their function
        var labels = g.selectAll('text.label')
            .data(columns)
            .enter()
            .append('text')
            .attr('x', function(d){
                return d.x;
            })
            .attr('y', function(d){
                return d.y;
            })
            .attr('text-anchor', "start")
            .text(function(d) {
                return d.name;
            })
            .attr("fill","black");

//SCATTERPLOT1:

      var newmargin = {top: 10, right: 30, bottom: 30, left: 60},
          newwidth = 300 - newmargin.left - newmargin.right,
          newheight = 200 - newmargin.top - newmargin.bottom;

var x = d3.scale.linear().range([0, newwidth]);
var y = d3.scale.linear().range([newheight, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);


// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", newwidth + newmargin.left + newmargin.right)
    .attr("height", newheight + newmargin.top + newmargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + newmargin.left + "," + newmargin.top + ")");



  // Add dots
  svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.acousticness); } )
      .attr("cy", function (d) { return y(d.energy); } )
      .attr("r", 2)
      .style("fill", "#4db34d")

      .on('mouseenter', function(d) {
                if(config.useTooltip) {
                    var mouse = d3.mouse(config.el);
                    tooltip.setText(config.tooltipFormattern(d)).setPosition(mouse[0], mouse[1]).show();
                }
                events.dotEnter(d);
                this.classList.add('active');
            })
            .on('mouseout', function(d) {
                if(config.useTooltip) {
                    tooltip.hide();
                }
                events.dotLeave(d);
                this.classList.remove('active');
            });

       // Add the X Axis
    svg2.append("g")
        .attr("class", "x axis")
        .attr("fill","black")
        .attr("transform", "translate(0," + newheight + ")")
        .call(xAxis)

     svg2.append("text")
      .attr("transform",
            "translate(" + (newwidth/2) + " ," +
                           (newheight + newmargin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Acousticness")
      .style("fill", "orange");


    // Add the Y Axis
    svg2.append("g")
        .attr("class", "y axis")
        .attr("fill","black")
        .call(yAxis);

         svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - newmargin.left)
      .attr("x",0 - (newheight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill","orange")
      .text("Energy");
//END of SCATTERPLOT 1

//SCATTERPLOT 2:

var x = d3.scale.linear().range([0, newwidth]);
var y = d3.scale.linear().range([newheight, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);


// append the svg object to the body of the page
var svg3 = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", newwidth + newmargin.left + newmargin.right)
    .attr("height", newheight + newmargin.top + newmargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + newmargin.left + "," + newmargin.top + ")");

//Read the data



  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.loudness); } )
      .attr("cy", function (d) { return y(d.energy); } )
      .attr("r", 2)
      .style("fill", "#4db34d")

      .on('mouseenter', function(d) {
                if(config.useTooltip) {
                    var mouse = d3.mouse(config.el);
                    tooltip.setText(config.tooltipFormatterm(d)).setPosition(mouse[0], mouse[1]).show();
                }
                events.dotEnter(d);
                this.classList.add('active');
            })
            .on('mouseout', function(d) {
                if(config.useTooltip) {
                    tooltip.hide();
                }
                events.dotLeave(d);
                this.classList.remove('active');
            });

       // Add the X Axis
    svg3.append("g")
        .attr("class", "x axis")
        .attr("fill","black")
        .attr("transform", "translate(0," + newheight + ")")
        .call(xAxis)

     svg3.append("text")
      .attr("transform",
            "translate(" + (newwidth/2) + " ," +
                           (newheight + newmargin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Loudness")
      .style("fill", "orange");


    // Add the Y Axis
    svg3.append("g")
        .attr("class", "y axis")
        .attr("fill","black")
        .call(yAxis);

         svg3.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - newmargin.left)
      .attr("x",0 - (newheight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill","orange")
      .text("Energy");
//END of Scatterplot 2

//SCATTERPLOT 3:
var svg4 = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", newwidth + newmargin.left + newmargin.right)
    .attr("height", newheight + newmargin.top + newmargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + newmargin.left + "," + newmargin.top + ")");

//Read the data



  // Add dots
  svg4.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.danceability); } )
      .attr("cy", function (d) { return y(d.loudness); } )
      .attr("r", 2)
      .style("fill", "#4db34d")

      .on('mouseenter', function(d) {
                if(config.useTooltip) {
                    var mouse = d3.mouse(config.el);
                    tooltip.setText(config.tooltipFormattero(d)).setPosition(mouse[0], mouse[1]).show();
                }
                events.dotEnter(d);
                this.classList.add('active');
            })
            .on('mouseout', function(d) {
                if(config.useTooltip) {
                    tooltip.hide();
                }
                events.dotLeave(d);
                this.classList.remove('active');
            });

       // Add the X Axis
    svg4.append("g")
        .attr("class", "x axis")
        .attr("fill","black")
        .attr("transform", "translate(0," + newheight + ")")
        .call(xAxis)

     svg4.append("text")
      .attr("transform",
            "translate(" + (newwidth/2) + " ," +
                           (newheight + newmargin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Danceability")
      .style("fill", "orange");


    // Add the Y Axis
    svg4.append("g")
        .attr("class", "y axis")
        .attr("fill","black")
        .call(yAxis);

         svg4.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - newmargin.left)
      .attr("x",0 - (newheight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill","orange")
      .text("Loudness");

//END of Scatterplot3



//TOOLTIP on DOTS:
var tooltipContainer = d3.select(config.el)
            .append('div')
            .attr({
                id: 'radviz-tooltip'
            });
        var tooltip = tooltipComponent(tooltipContainer.node());

        return this;

    };

    var setConfig = function(_config) {
        config = utils.mergeAll(config, _config);
        return this;
    };

   var backtopage = {
        render: render,
        config: setConfig
    };

    //testing


d3.rebind(backtopage, events, 'on');

    return backtopage;


};

