function InitChart(lineData) {

var yMax = d3.max(lineData, function (d) { return d.x;});
var yMin = d3.min(lineData, function (d) { return d.x;});
var yMinAbs = Math.abs(yMin);
var yMaxAbs = Math.abs(yMax);

var dMin, dMax;

if (yMinAbs > yMax) {
	dMin = yMin - 2;
	dMax = yMinAbs +2;
} else if (yMax == 0 && yMin == 0) {
	dMin = -2;
	dMax = 2;
} else {
	dMin = yMax*(-1) - 2;
	dMax = yMax +2;
}
	

  var timeSeries = d3.select("#visualisation"),
    WIDTH = 500,
    HEIGHT = 300,
    MARGINS = {
      top: 20,
      right: 50,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear()
		.range([MARGINS.left, WIDTH - MARGINS.right])
		.domain([
		d3.min(lineData, function (d) { return d.t; }),
		d3.max(lineData, function (d) { return d.t;})]),

	
	
    yRange = d3.scale.linear()
		.range([HEIGHT - MARGINS.top, MARGINS.bottom])
		.domain([dMin, dMax]),

		//(-1)*d3.max(lineData, function (d) { return d.x;}),
		//d3.max(lineData, function (d) { return d.x;})
		
    xAxis = d3.svg.axis()
		.scale(xRange)
		.tickSize(5)
		.tickSubdivide(true),

    yAxis = d3.svg.axis()
		.scale(yRange)
		.tickSize(5)
		.orient("left")
		.tickSubdivide(true);

    timeSeries.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (HEIGHT/2) + ")")
		.call(xAxis);

	timeSeries.append("svg:g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (MARGINS.left) + ",0)")
		.call(yAxis);

	var lineFunc = d3.svg.line()
		.x(function (d) { return xRange(d.t); })
		.y(function (d) { return yRange(d.x); })
		.interpolate('basis');

	timeSeries.append("svg:path")
		.attr("d", lineFunc(lineData))
		.attr("stroke", "#FF6700")
		.attr("stroke-width", 2)
		.attr("fill", "none");

};

class Ball {
	constructor(ball_area) {
		this.current_position = 0;
		this.ball_area = ball_area;
	};
}

class BallArea {
	constructor(width, height) {
		this.area = d3.select("#ball").attr("width", width).style("height", height);
	}
}

function initBall(x) {
	var ballArea = createBallPlotArea();
	var ball = createBall(x, ballArea);
};

function createBall(x, ballArea) {
	var initPosition = 600 + (x*50);
	
	var ball = ballArea.append("circle")
		.attr("cx",initPosition)
		.attr("cy",50)
		.style("fill","#CC008E")
		.attr("r",20);
	return ball;
};

function createBallPlotArea() {
	var ballArea = d3.select("#ball").attr("width",1200).style("height",100);
	return ballArea;
};

function ball(data) {
	
	var ballArea = createBallPlotArea();
	var initPosition = 600 + (data[0].x*50);
	var ball = ballArea.append("circle")
		.attr("cx",initPosition)
		.attr("cy",50)
		.style("fill","#CC008E")
		.attr("r",20);
	var interval = 10;
	var sum = 0;
	
	refreshIntervalId = setInterval(function() {	  
		var p = data.shift();
		var v = (p.x*50) + 600;
		v = Math.floor(v);
        $("#interval").text(data.length);
		sum = sum + data.length;
		$("#interval2").text(sum);
		ball.transition()
			.duration(interval)
			.attr("cx",v)
			.attr("cy",50)
			.style("fill","#CC008E")
			.attr("r",20);
	}, interval);
	return refreshIntervalId;

};

function poleplot(dataset) {
	
	var w = 300;
	var h = 300;
	var padding = 20;
	
			//Create scale functions
	var pxScale = d3.scale.linear()
		.domain([-5, 5])
		.range([padding, w - padding * 2]);

	var pyScale = d3.scale.linear()
		.domain([-5, 5])
		.range([h - padding, padding]);

	var prScale = d3.scale.linear()
		.domain([-6, 6])
		.range([2, 5]);
			
			//Define X axis
	var pxAxis = d3.svg.axis()
		.scale(pxScale)
		.orient("bottom")
		.ticks(5);

			//Define Y axis
	var pyAxis = d3.svg.axis()
		.scale(pyScale)
		.orient("left")
		.ticks(5);

			//Create SVG element
	var splane = d3.select("#poleplot")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

			//Create circles
	splane.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("stroke", "#000000")
		.attr("fill", "#45FF00")
		.attr("cx", function(d) { return pxScale(d.Re); })
		.attr("cy", function(d) { return pyScale(d.Im); })
		.attr("r", 4);
			//Create X axis
	splane.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h + padding/10)/2 + ")")
		.call(pxAxis);
			
			//Create Y axis
	splane.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (w-padding)/2 + ",0)")
		.call(pyAxis);
			
};