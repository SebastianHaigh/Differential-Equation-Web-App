// The below require this file to know what document means, I would like to try 
// and encapsulate this if I can

var aSlider = document.getElementById("aSlider");
var bSlider = document.getElementById("bSlider");
var cSlider = document.getElementById("cSlider");
var ic1Slider = document.getElementById("ic1Slider");
var ic2Slider = document.getElementById("ic2Slider");
var aOutput = document.getElementById("aOutput");
var bOutput = document.getElementById("bOutput");
var cOutput = document.getElementById("cOutput");
var ic1Output = document.getElementById("ic1Output");
var ic2Output = document.getElementById("ic2Output");
//var resetButton = document.getElementById("resetButton");

// I do not know what this is doing, I will have to find out by experimenting 
// and then document the purpose.
aOutput.innerHTML = aSlider.value; 
bOutput.innerHTML = bSlider.value;
cOutput.innerHTML = cSlider.value;
ic1Output.innerHTML = ic1Slider.value;
ic2Output.innerHTML = ic2Slider.value;

// Update the current slider value (each time you drag the slider handle)

// I am not convinced that the data object should be created or defined in this file.
var data_object = initDataObject(0, 0, 0, 0, 0);

data_object = solution(data_object);

// Initialisation of plots and the ball simulation (should this be in a file 
// called sliderControl?)

InitChart(data_object.timeSeries);

poleplot([data_object.root1, data_object.root2]);

initBall(data_object.intCon.x);

// State variable, what are all the possibel values that this can take?
var state = 0;

// What does refresh interval id do?
var refreshIntervalId;

// Below is the set up for call back function for slider controls this seems 
// fine, but needs to be documented and possibly refactored.

resetButton.onclick = function() {
	data_object = updateAll(data_object);
};

startButton.onclick = function() {
	if (state == 1) {
		clearInterval(refreshIntervalId);
		$("#interval3").text(refreshIntervalId);
	};
	d3.selectAll("svg > *").remove();
	data_object = solution(data_object);
	InitChart(data_object.timeSeries);
	poleplot([data_object.root1, data_object.root2]);
	refreshIntervalId = ball(data_object.timeSeries);
	$("#interval3").text(refreshIntervalId);
	state = 1;
};


aSlider.oninput = function() {
	data_object.diffEqconts.a = (this.value)/10;
    $("#aOutput").text(data_object.diffEqconts.a);
	data_object = updateAll(data_object);
};

bSlider.oninput = function() {
	data_object.diffEqconts.b = (this.value)/10;
    $("#bOutput").text(data_object.diffEqconts.b);
	data_object = updateAll(data_object);
};
cSlider.oninput = function() {
	data_object.diffEqconts.c = (this.value)/10;
    $("#cOutput").text(data_object.diffEqconts.c);
	data_object = updateAll(data_object);
};
ic1Slider.oninput = function() {
	data_object.intCon.x = (this.value)/10;
    $("#ic1Output").text(data_object.intCon.x);
	data_object = updateAll(data_object);
};

ic2Slider.oninput = function() {
	data_object.intCon.xdash = (this.value)/10;
    $("#ic2Output").text(data_object.intCon.xdash);
	data_object = updateAll(data_object);
};

// Data object should be a class 

class DataObject {
	constructor() {}
};


class TimeSeries {
	constructor() {
		this.series = [];
	}

	push(time, data) { this.series.push({time: time, data: data}); }

	at(i) { 
		if (i < this.length()) {
			return this.series[i]; 
		} else {
			return {time: -1, data: -1};
		}
	}

	length() { return this.series.length; }
};

function initDataObject(a, b, c, u, v) {
	var dataObject = {
		type: 0,
		root1: {Re: 0, Im: 0}, 
		root2: {Re: 0, Im: 0}, 
		diffEqconts: {a: a, b: b, c: c},
		intCon: {t: 0, x: u, xdash: v},
		solConstants: {A: 0, B: 0}, 
		timeSeries: [{t: 0, x: 0}],
		stepResponse: [{t: 0, x: 0}],
		ts: new TimeSeries()};
	return dataObject;
};

function updateAll(data_object) {
	d3.selectAll("svg > *").remove();
	data_object = solution(data_object);
	InitChart(data_object.timeSeries);
	initBall(data_object.intCon.x);
	poleplot([data_object.root1, data_object.root2]);
	return data_object;
};

setInterval(function() {
	var solOut;
	var sign = " ";
	var signb = " ";
	var signc = " ";
	if(data_object.solConstants.B<0) {
		sign = " ";
	} else {
		sign = "+";
	}
	if (data_object.diffEqconts.b < 0) {
		signb = " ";
	} else {
		signb = "+";
	}
	if (data_object.diffEqconts.c < 0) {
		signc = " ";
	} else {
		signc = "+";
	}
		
	
var mathOut = " " + data_object.diffEqconts.a + "\\frac{d^2x}{dt^2}" +signb+ " " + data_object.diffEqconts.b + "\\frac{dx}{dt}" + signc + " " + data_object.diffEqconts.c + "x = 0, \\: x(0) = " + data_object.intCon.x + ", x'(0) = " + data_object.intCon.xdash ;

if (data_object.type == 1) {
	solOut =  "x(t) = " + data_object.solConstants.A.toFixed(2) + "e^{" + data_object.root1.Re.toFixed(2) + "t}" +sign+ "" + data_object.solConstants.B.toFixed(2) + "e^{" + data_object.root2.Re.toFixed(2) + "t}";
};

if (data_object.type == 2) {
solOut =  "x(t) = e^{" + data_object.root1.Re.toFixed(2) + "t}(" + data_object.solConstants.A.toFixed(2) + "\\cos(" + data_object.root1.Im.toFixed(2) +"t)" +sign+ "" + data_object.solConstants.B.toFixed(2) + "\\sin(" + Math.abs(data_object.root2.Im.toFixed(2)) +"t))";
};

	var math = MathJax.Hub.getAllJax("diffEq")[0];
	MathJax.Hub.Queue(["Text",math,mathOut]);
	var math2 = MathJax.Hub.getAllJax("solEq")[0];
	MathJax.Hub.Queue(["Text",math2,solOut]);
}, 600)