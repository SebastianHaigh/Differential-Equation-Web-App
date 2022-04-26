class AnalyticSolution {
	constructor() {}

	print() {
		return "x(t) = " + this.a + this.b + this.c;
	}

	print_exponential(constant_multiplier, exponent_multiplier, leading) {
		var output = "";

		if (constant_multiplier.is_zero()) {
			return output;
		}

		output += constant_multiplier.print(leading);

		if (exponent_multiplier.re() != 0) {
			output += "e^{" + exponent_multiplier.print_real() + "t}";
		}

		return output;
	}

}

class RepeatedRootSolution extends AnalyticSolution {
	constructor(root, position, velocity) {
		this.constant_a = 0;
		this.constant_b = 0;
		this.type = "Repeated Roots";
	}

	print() { return this.type; }
	time_series() {return new TimeSeries(); }
}

class DistinctRealRootSolution extends AnalyticSolution {
	constructor(root1, root2, position, velocity) {
		super();
		this.root1 = root1;
		this.root2 = root2;
		this.constant_a = new Constant( (velocity - (root2.re()*position))/(root1.re() - root2.re()) );
		this.constant_b = new Constant( position - this.constant_a.value );
		this.type = "Distinct Real Roots";
	}

	print() { 
		var s = "x(t) = ";
		s += super.print_exponential(this.constant_a, this.root1, true);
		s += super.print_exponential(this.constant_b, this.root2, false);

		return s;
	}

	time_series() {return new TimeSeries(); }
}

class ComplexRootSolution extends AnalyticSolution {
	constructor(root1, root2, position, velocity) {
		this.constant_a = 0;
		this.constant_b = 0;
		this.type = "Complex Roots";
	}

	print() { return this.type; }
	time_series() {return new TimeSeries(); }
}

class FirstOrderSolution extends AnalyticSolution {
	constructor(root, position, velocity) {
		this.constant_a = 0;
		this.type = "First Order";
	}

	print() { return this.type; }
	time_series() {return new TimeSeries(); }
}

function solve(differential_equation, initial_conditions) {

}

class Derivative {
	constructor(order) {
		this.order = order;
		if (order == 0) {
			this.notation = "x";
		} else if (order == 1) {
			this.notation = "\\frac{dx}{dt}";
		} else {
			this.notation = "\\frac{d^" + order + "x}{dt^" + order + "}";
		}
	}

	print() { return this.notation; }
}

class Constant {
	constructor(value) {
		this.value = value;
	}

	print(leading = true) {
		var output = "";

		if (leading && this.is_negative() || !leading) {
			output += this.print_sign();
		}

		if (Math.abs(this.value) != 1) {
			output += this.print_unsigned();
		}

		return output;
	}

	print_signed() {
			return this.print_sign() + this.print_unsigned();
	}

	print_unsigned() {
			if (Number.isInteger(this.value)) {
				return Math.abs(this.value);
			} else {
				return Math.abs(this.value).toFixed(2);
			}
			
	}

	print_sign() {
		if (this.is_negative()) {
			return "-";
		} else if (this.is_positive()) {
			return "+";
		} else {
			return "";
		}
	}

	is_positive() {
		return this.value > 0;
	}

	is_negative() {
		return this.value < 0;
	}

	is_zero() {
		return this.value == 0;
	}
}

class DifferentialEquationTerm {
	constructor(constant, order) {
		this.constant = new Constant(constant);
		this.derivative = new Derivative(order);
	}

	print_signed() {
		if (this.constant.value == 1 || this.constant.value == -1) {
			return this.constant.print_sign() + this.derivative.print();
		} else {
			return this.constant.print_signed() + this.derivative.print();
		}
	}

	print_unsigned() {
		if (this.constant.value == 1 || this.constant.value == -1) {
			return this.derivative.print();
		} else {
			return this.constant.print_unsigned() + this.derivative.print();
		}
	}

	is_positive() {
		return this.constant.is_positive();
	}

	is_negative() {
		return this.constant.is_negative();
	}

	is_zero() {
		return this.constant.is_zero();
	}

}

/**
 * A differential equation.
 * 
 * */ 

class SecondOrderDifferentialEquation {
	constructor(a, b, c, initial_conditions) {
		this.terms = [new DifferentialEquationTerm(a, 2), new DifferentialEquationTerm(b, 1), new DifferentialEquationTerm(c, 0)];
		var bob = b*b - 4*a*c;
		if (bob == 0) {
			var root_value = -b/(2*a);
			this.root1 = new Root(root_value);
			this.root2 = new Root(root_value);
		} else if (bob < 0) {
			var real_value = -b/(2*a);
			var imaginary_value = Math.sqrt(Math.abs(bob))/(2*a);
			this.root1 = new Root(real_value, imaginary_value);
			this.root2 = new Root(real_value, (-1)*imaginary_value);
		} else if (bob > 0){
			var real_value1 = (- b - Math.sqrt(bob)) / (2*a);
			var real_value2 = (- b + Math.sqrt(bob)) / (2*a);
			this.root1 = new Root(real_value1);
			this.root2 = new Root(real_value2);
		} 
	}

	print() {
		var s = "";
		var first_term = true;
		for(let i = 0; i < this.terms.length; i++) {

			// If the first term is negative then the sign of the constant 
			// should be printed:
			if (this.terms[i].is_negative() && first_term) {
				s += this.terms[i].print_signed();
				first_term = false;

			// If the first term is positive then the sign of the constant 
			// should not be printed:
			} else if (this.terms[i].is_positive() && first_term) {
				s += this.terms[i].print_unsigned();
				first_term = false;

			// For all other terms than the first the sign should be printed:
			} else if (!first_term) {
				s += this.terms[i].print_signed();
			}
		}
		return s + " = 0";
	}

	get_roots() {
		return [this.root1, this.root2];
	}

}

class FirstOrderDifferentialEquation {
	constructor(a, b, initial_conditions) {
		this.terms = [new DifferentialEquationTerm(a, 1), new DifferentialEquationTerm(b, 0)];
		var bob = b*b - 4*a*c;
		if (bob == 0) {
			var root_value = -b/(2*a);
			this.root1 = new Root(root_value);
			this.root2 = new Root(root_value);
		} else if (bob < 0) {
			var real_value = -b/(2*a);
			var imaginary_value = Math.sqrt(Math.abs(bob))/(2*a);
			this.root1 = new Root(real_value, imaginary_value);
			this.root2 = new Root(real_value, (-1)*imaginary_value);
		} else if (bob > 0){
			var real_value1 = (- b - Math.sqrt(bob)) / (2*a);
			var real_value2 = (- b + Math.sqrt(bob)) / (2*a);
			this.root1 = new Root(real_value1);
			this.root2 = new Root(real_value2);
		} 
	}
}

/**
 * A factory for creating differential equations.
 * 
 * Can construct 2nd and 1st order equations. If a is zero then the constructed 
 * differential equation will be 1st order, otherwise it will be 2nd order.
 */

class DifferentialEquationFactory {
	constructor() {}

	create_differential_equation(a, b, c) {
		if (a == 0) {
			return new FirstOrderDifferentialEquation(b, c);
		} else {
			return new SecondOrderDifferentialEquation(a, b, c);
		}
	}
}

class InitialConditions {
	constructor(position, velocity) {
		this.position = position;
		this.velocity = velocity;
	}
}


class Root {
	constructor(re, im = 0) {
		this.real = new Constant(re);
		this.imaginary = new Constant(im);;
	}

	re() {
		return this.real.value;
	}

	im() {
		return this.imaginary.value;
	}

	is_complex() {
		return !this.imaginary.is_zero();
	}

	print_real(leading = true) {
		return this.real.print(leading);
	}

	print() {
		if (this.is_complex()) {
			return "" + this.real.value + this.imaginary.value + "i";
		} else {
			return "" + this.real.value;
		}
	}
}


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
}