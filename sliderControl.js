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
var bobby = document.getElementById("oldbob");
//var resetButton = document.getElementById("resetButton");


// I do not know what this is doing, I will have to find out by experimenting 
// and then document the purpose.
aOutput.innerHTML = aSlider.value; 
bOutput.innerHTML = bSlider.value;
cOutput.innerHTML = cSlider.value;
ic1Output.innerHTML = ic1Slider.value;
ic2Output.innerHTML = ic2Slider.value;

MathJax.Hub.Config({processSectionDelay: 0, processUpdateTime: 0, processUpdateDelay: 0});

// Update the current slider value (each time you drag the slider handle)

// I am not convinced that the data object should be created or defined in this file.
var data_object = initDataObject(0, 0, 0, 0, 0);

// Initialisation of plots and the ball simulation (should this be in a file 
// called sliderControl?)



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
	//data_object = solution(data_object);
	data_object = solve_equation(data_object);
	InitChart(data_object.timeSeries);
	var roots = data_object.differential_equation.get_roots();
	var roots_for_pole_plot = [];
	for (let i = 0; i < roots.length; i++) {
		roots_for_pole_plot[i] = {Re: roots[i].re(), Im: roots[i].im()};
	}
	poleplot(roots_for_pole_plot);
	refreshIntervalId = ball(data_object.timeSeries);
	$("#interval3").text(refreshIntervalId);
	state = 1;
};

aSlider.oninput = function() {
	data_object.constants.a = (this.value)/100;
    $("#aOutput").text(data_object.constants.a);
	data_object = updateAll(data_object);
};

bSlider.oninput = function() {
	data_object.constants.b = (this.value)/100;
    $("#bOutput").text(data_object.constants.b);
	data_object = updateAll(data_object);
};
cSlider.oninput = function() {
	data_object.constants.c = (this.value)/100;
    $("#cOutput").text(data_object.constants.c);
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

/**
 * Initialises the Global data object.
 *  
 * This object stores all of the relevant information needed for the display.
 * */ 
function initDataObject(a, b, c, u, v) {
	var dataObject = {
		type: 0,
		roots: [{Re: 0, Im: 0}],
		constants: {a: a, b: b, c: c},
		intCon: {t: 0, x: u, xdash: v},
		timeSeries: [{t: 0, x: 0}],
		stepResponse: [{t: 0, x: 0}],
		differential_equation: 0,
		solution: 0};
	return dataObject;
};

function solve_equation(data_object) {
	let equation_factory = new DifferentialEquationFactory();
	let solution_factory = new SolutionFactory();
	data_object.differential_equation = equation_factory.create_differential_equation(data_object.constants.a, data_object.constants.b, data_object.constants.c);
	data_object.solution = solution_factory.new_solution(data_object.differential_equation, data_object.intCon.x, data_object.intCon.xdash);
	data_object.timeSeries = data_object.solution.time_series(0.1, 1000);

	return data_object;
};

function updateAll(data_object) {
	d3.selectAll("svg > *").remove();
	data_object = solve_equation(data_object);
	InitChart(data_object.solution.time_series(0.1, 1000));
	initBall(data_object.intCon.x);
	var roots = data_object.differential_equation.get_roots();
	var roots_for_pole_plot = [];
	for (let i = 0; i < roots.length; i++) {
		roots_for_pole_plot[i] = {Re: roots[i].re(), Im: roots[i].im()};
	}
	poleplot(roots_for_pole_plot);
	updateRootDisplay(roots[0], roots[1]);
	return data_object;
};

function updateRootDisplay(root1, root2) {
	$("#sigma1").text(root1.print_real());
	$("#sigma2").text(root2.print_real());

	$("#omega1").text(Math.abs(root1.im()).toFixed(2));
	$("#omega2").text(Math.abs(root2.im()).toFixed(2));
	if (root1.im() < 0) {
		$("#sign1").text("-");
	} else {
		$("#sign1").text("+");
	}
  
	if (root2.im() < 0) {
		$("#sign2").text("-");
	} else {
		$("#sign2").text("+");
	}
};

// Interval for updating MathJax
setInterval(function() {

	var math = MathJax.Hub.getAllJax("diffEq")[0];
	MathJax.Hub.Queue(["Text",math,data_object.differential_equation.print()]);
	var math2 = MathJax.Hub.getAllJax("solEq")[0];
	MathJax.Hub.Queue(["Text",math2,data_object.solution.print()]);

}, 500)