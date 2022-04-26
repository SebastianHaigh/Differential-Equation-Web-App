//class AnalyticSolution {
//	constructor() {
//
//	}
//	print();
//}


solution = function(dO) {
   dO = makeGrid(dO);
   dO = findRoots(dO);
	if (dO.type == 1 || dO.type == 4) {
		var i;
		for (i = 0; i < dO.timeSeries.length; i++) {
			dO.timeSeries[i] = distinctRealRoots(dO.root1.Re, dO.root2.Re, dO.solConstants, dO.timeSeries[i].t);
		}
	}

	if (dO.type == 2) {
		var i;
		for (i = 0; i < dO.timeSeries.length; i++) {
			dO.timeSeries[i] = complexRoots(dO.root1, dO.solConstants, dO.timeSeries[i].t);
		}
	}

	if (dO.type == 3) {
		var i;
		for (i = 0; i < dO.timeSeries.length; i++) {
			dO.timeSeries[i] = repeatedRoots(dO.root1.Re, dO.solConstants, dO.timeSeries[i].t);
		}
	}
	
	if (dO.type == 5) {
		var i 
		for (i = 0; i < dO.timeSeries.length; i++) {
			dO.timeSeries[i] = 0;
		}
	}

	return dO;
};

function findRoots(dO) {
	var a = dO.diffEqconts.a;
	var b = dO.diffEqconts.b;
	var c = dO.diffEqconts.c;
	var x = dO.intCon.x;
	var xdash = dO.intCon.xdash;
	var roots, constants;
	dO.type = determineRootType(a, b, c);
	
	if (dO.type == 1) {
		roots = getRootsDistinct(a, b, c);
		constants = distinctRootsConstants(dO.root1, dO.root2, x, xdash);
	}
	if (dO.type == 2) {
		roots = getRootsComplex(a, b, c);
		constants = complexRootsConstants(dO.root1, x, xdash);
		
	}
	if (dO.type == 3) {
		roots = getRootsRepeated(a, b, c);
		constants = repeatedRootsConstants(dO.root1, x, xdash);
		
	}
	if (dO.type == 4) {
		roots = getRootsFirstOrder(a, b, c);
		constants = firstOrderConstants(dO.root1, x, xdash);
	
	}
	if (dO.type == 5) {
		roots = getRootsZerothOrder(a, b, c);
		constants = zerothOrderConstants();
	}
	updateRootDisplay(roots.root1, roots.root2);
	updateConstantDisplay(constants.A, constants.B);
	dO.root1 = roots.root1;
	dO.root2 = roots.root2;
	dO.solConstants = constants;
	return dO;
};

function updateConstantDisplay(A, B) {
	$("#constant1").text(A.toFixed(2));
	$("#constant2").text(B.toFixed(2));
};

function updateRootDisplay(root1, root2) {
	$("#sigma1").text(root1.Re.toFixed(2));
	$("#sigma2").text(root2.Re.toFixed(2));
	$("#omega1").text(Math.abs(root1.Im).toFixed(2));
	$("#omega2").text(Math.abs(root2.Im).toFixed(2));
	if (root1.Im < 0) {
		$("#sign1").text("-");
	} else {
		$("#sign1").text("+");
	}
  
	if (root2.Im < 0) {
		$("#sign2").text("-");
	} else {
		$("#sign2").text("+");
	}
};

function getRootsDistinct(a, b, c) {
	var sigma1 = (-b + Math.sqrt((b*b) - (4*a*c)))/(2*a);
	var sigma2 = (-b - Math.sqrt((b*b) - (4*a*c)))/(2*a);
	return {root1: {Re: sigma1, Im: 0}, root2: {Re: sigma2, Im: 0}};
};

function getRootsComplex(a, b, c) {
	var sigma = -b/(2*a);
	var omega1 = Math.sqrt(Math.abs((b*b) - (4*a*c)))/(2*a);
	var omega2 = omega1 * (-1)
	return {root1: {Re: sigma, Im: omega1}, root2: {Re: sigma, Im: omega2}};
};

function getRootsRepeated(a, b, c) {
	var sigma = -b/(2*a);
	return {root1: {Re: sigma, Im: 0}, root2: {Re: sigma, Im: 0}};
};

function getRootsFirstOrder(a, b, c) {
	var sigma = -c/b;
	return {root1: {Re: sigma, Im: 0}, root2: {Re: 0, Im: 0}};
};

function getRootsZerothOrder(a, b, c) {
	var sigma = -c;
	return {root1: {Re: sigma, Im: 0}, root2: {Re: 0, Im: 0}};
};

function determineRootType(a, b, c) {
	var bSquared = Math.pow(b, 2);
	var ac4 = 4*a*c;
	var type;
	if (bSquared > ac4 && a != 0) {
		$("#solutionType").text("Distinct Real Roots");
		type = 1;
	}
	if (bSquared < ac4) { 
		$("#solutionType").text("Complex Roots");
		type = 2;
	}
	if (bSquared == ac4) {
		$("#solutionType").text("Repeated Real Roots");
		type = 3;
	}
	if (a == 0) {
		$("#solutionType").text("First Order");
		type = 4;
	}
	if (a == 0 && b ==0) {
		$("#solutionType").text("Zeroth Order");
		type = 5;
	}
	return type;
};

distinctRootsConstants = function(root1, root2, x, xdash) {
	var A, B;
	A = (xdash - (root2.Re*x))/(root1.Re - root2.Re);
	B = x - A;
	return {A: A, B: B};
};

complexRootsConstants = function(root, x, xdash) {
	var A, B;
	A = x;
	B = (xdash - x*root.Re)/(Math.abs(root.Im));
	return {A: A, B: B};
};

repeatedRootsConstants = function(root, x, xdash) {
	var A, B;
	A = x;
	B = xdash - x*root.Re;
	return {A: A, B: B};
};

firstOrderConstants = function(root, x, xdash) {
	var A, B;
	A = xdash/root.Re;
	B = x - A;
	return {A: A, B: B};
};

zerothOrderConstants = function() {
	return {A: 0, B: 0};
};

makeGrid = function(dO) {
	var i;
	var dt = 0.1;
	for (i = 0; i < 1000; i++) {
		dO.timeSeries[i]  = {t: dt * i, x: 0};
		dO.stepResponse[i] = {t: dt * i, x: 0};
	}
	return dO;
};

distinctRealRoots = function(root1, root2, constants, point) {
	outputPoint = constants.A*Math.exp(root1*point) + constants.B*Math.exp(root2*point);
	return {t: point, x: outputPoint};
};

complexRoots = function(root, constants, point) {
	var ex = Math.exp(root.Re*point);
	var cos = Math.cos(root.Im*point);
	var sin = Math.sin(root.Im*point);
	outputPoint = ex*(constants.A*cos + constants.B*sin);
	return {t: point, x: outputPoint};
};

repeatedRoots = function(root, constants, point) {
	outputPoint = Math.exp(root*point)*(constants.A*point + constants.B);
	return {t: point, x: outputPoint};
};
