class SolutionFactory {
	constructor() {}

	/**
	 * 
	 * @param {DifferentialEquation} differential_equation 
	 * @param {number} position 
	 * @param {number} velocity 
	 * @returns {AnalyticSolution}
	 */
	new_solution(differential_equation, position, velocity) {
		var roots = differential_equation.get_roots();
		if (differential_equation.order() == 2) {
			if (roots[0].is_complex()) {
				return new ComplexRootSolution(roots[0], roots[1], position, velocity);
			}

			if (roots[0].re() == roots[1].re()) {
				return new RepeatedRootSolution(roots[0], position, velocity);
			} else {
				return new DistinctRealRootSolution(roots[0], roots[1], position, velocity);
			}
		} else if (differential_equation.order() == 1) {
			return new FirstOrderSolution(roots[0], position, velocity);
		} else {
			return new ZerothOrderSolution();
		}
	}
}

class AnalyticSolution {
	constructor() {}

	/**
	 * Print an exponential of the form Ae^{bt}
	 * 
	 * @param {MultiplicativeConstant} constant_multiplier 
	 * @param {MultiplicativeConstant} exponent_multiplier 
	 * @param {bool} leading 
	 * @returns {string}
	 */
	print_exponential(constant_multiplier, exponent_multiplier, leading) {
		var output = "";

		if (constant_multiplier.is_zero()) {
			return "0";
		}

		output += constant_multiplier.print(leading);

		if (exponent_multiplier.re() != 0) {
			output += "e^{" + exponent_multiplier.print_real() + "t}";
		}

		return output;
	}

	/**
	 * Print a cosine term of the form A\\cos(bt)
	 * 
	 * @param {MultiplicativeConstant} constant_multiplier 
	 * @param {MultiplicativeConstant} frequency 
	 * @param {boolean} leading 
	 * @returns 
	 */
	print_cosine_term(constant_multiplier, frequency, leading = true) {
		var output = "";

		if (constant_multiplier.is_zero()) {
			return "0";
		} else if (frequency.is_zero()) {
			return constant_multiplier.print(leading);
		} else {
			return constant_multiplier.print(leading) + this.print_cosine(frequency);
		}
	}

	print_cosine(frequency) {
		var freq = frequency.print_unsigned();
		if (freq == "1") {
			return "\\cos(t)"
		} else if (freq == "0") {
			return "1";
		} else {
			return "\\cos(" + freq + "t)";
		}
	}

	/**
	 * Print a sine term of the form A\\sin(bt)
	 * 
	 * @param {MultiplicativeConstant} constant_multiplier 
	 * @param {MultiplicativeConstant} frequency 
	 * @param {boolean} leading 
	 * @returns 
	 */
	print_sine_term(constant_multiplier, frequency, leading = true) {
		if (constant_multiplier.is_zero() || frequency.is_zero()) {
			return "0";
		}
		return constant_multiplier.print(leading) + this.print_sine(frequency);
	}

	print_sine(frequency) {
		var freq = frequency.print_unsigned();
		if (freq == "1") {
			return "\\sin(t)"
		} else if (freq == "0") {
			return "0";
		} else {
			return "\\sin(" + freq + "t)";
		}
		
	}
}

class RepeatedRootSolution extends AnalyticSolution {
	constructor(root, position, velocity) {
		super();
		this.root = root;
		this.constant_a = new Constant( position );
		this.constant_b = new Constant( velocity - (position * root.re()));
		this.type = "Repeated Roots";
	}

	print() { 
		var output = "x(t) = "
		
		if (this.constant_a.is_zero() && this.constant_b.is_zero()) {
			return output + "0";
		} else if (!this.constant_a.is_zero() && this.constant_b.is_zero()) {
			return output + super.print_exponential(this.constant_a, this.root, true);
		} else if (this.constant_a.is_zero() && !this.constant_b.is_zero()) {
			output += this.constant_b.print() + "t";
			return output + super.print_exponential(new MultiplicativeConstant(1), this.root, true);
		} else {
			output += super.print_exponential(new MultiplicativeConstant(1), this.root, true);
			return output + "(" + this.constant_a.print() + this.constant_b.print(false) + "t)";
		}
	}

	time_series(dt, num_points) {
		var output = [{t: 0, x: 0}];
		for (let i = 0; i < num_points; i++) {
			var point = dt * i;
			var value = Math.exp(this.root.re()*point)*(this.constant_b.value*point + this.constant_a.value);
			output[i] = {t: point, x: value};
		}
		
		return output;
	}
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
		var output = "x(t) = ";
		output += super.print_exponential(this.constant_a, this.root1, true);
		output += super.print_exponential(this.constant_b, this.root2, false);

		return output;
	}

	time_series(dt, num_points) {
		var output = [{t: 0, x: 0}];
		for (let i = 0; i < num_points; i++) {
			var point = dt * i;
			var value = this.constant_a.value*Math.exp(this.root1.re()*point) + this.constant_b.value*Math.exp(this.root2.re()*point);
			output[i] = {t: point, x: value};
		}
		
		return output;
	}
}

/**
 * Solution for 2nd order differential equations of the form ax''(t) + bx'(t) + cx(t) = 0.
 * 
 * */
class ComplexRootSolution extends AnalyticSolution {

	/**
	 * Constructs an instance of ComplexRootSolution
	 * 
	 * @param {Root} root1 
	 * @param {Root} root2 
	 * @param {number} position 
	 * @param {number} velocity 
	 */
	constructor(root1, root2, position, velocity) {
		super();
		this.root1 = root1;
		this.root2 = root2;
		this.constant_a = new Constant (position);
		this.constant_b = new Constant ( (velocity - (position*root1.re()) ) / (Math.abs(root1.im())) );
		this.type = "Complex Roots";
	}

	/**
	 * print the equation of the solution to LaTeX.
	 * 
	 * @returns {string} A string containing the equation in LaTeX form.
	 */
	print() { 
		var output = "x(t) = ";

		var cos_term = super.print_cosine_term(this.constant_a, this.root2.imaginary);
		var sine_term = super.print_sine_term(this.constant_b, this.root2.imaginary);
		if (cos_term != "0" && sine_term == "0") {
			output += super.print_exponential(this.constant_a, this.root1);
			output += super.print_cosine_term(new MultiplicativeConstant(1), this.root2.imaginary);
		}

		if (cos_term == "0" && sine_term != "0") {
			output += super.print_exponential(this.constant_b, this.root1);
			output += super.print_sine_term(new MultiplicativeConstant(1), this.root2.imaginary);
		} 
		
		if (cos_term != "0" && sine_term != "0" && !this.root1.pure_imaginary()) {
			output += super.print_exponential(new MultiplicativeConstant(1), this.root1);
			output += "(" + super.print_cosine_term(this.constant_a, this.root2.imaginary);
			output += super.print_sine_term(this.constant_b, this.root2.imaginary, false) + ")";
		}

		if (cos_term != "0" && sine_term != "0" && this.root1.pure_imaginary()) {
			output += super.print_cosine_term(this.constant_a, this.root2.imaginary);
			output += super.print_sine_term(this.constant_b, this.root2.imaginary, false);
		}

		if (cos_term == "0" && sine_term == "0") {
			output += "0";
		}
		return output;
	}

	time_series(dt, num_points) {
		var output = [{t: 0, x: 0}];
		for (let i = 0; i < num_points; i++) {
			var point = dt * i;
			var ex = Math.exp(this.root1.re()*point);
			var cos = Math.cos(this.root1.im()*point);
			var sin = Math.sin(this.root1.im()*point);
			var value = ex*(this.constant_a.value*cos + this.constant_b.value*sin);
			output[i] = {t: point, x: value};
		}
		
		return output;
	}
}

/**
 * Solutions for equations of the form ax' + bx = 0.
 */
class FirstOrderSolution extends AnalyticSolution {
	constructor(root, position) {
		super();
		this.constant_a = new MultiplicativeConstant(position);
		this.root = root;
	}

	print() { 
		var output = "x(t) = ";
		if (this.constant_a.is_zero()) {
			output += "0";
		} else {
			output += super.print_exponential(this.constant_a, this.root);
		}
		return output; 
	}

	time_series(dt, num_points) {
		var output = [{t: 0, x: 0}];
		for (let i = 0; i < num_points; i++) {
			var point = dt * i;
			var value = this.constant_a.value*Math.exp(this.root.re()*point);
			output[i] = {t: point, x: value};
		}
		
		return output;
	}
}

/**
 * Solutions for equations of the form ax = 0.
 */
class ZerothOrderSolution extends AnalyticSolution {
	constructor() {
		super();
	}

	print() { 
		return "x(t) = 0";
	}

	time_series(dt, num_points) {
		var output = [{t: 0, x: 0}];
		for (let i = 0; i < num_points; i++) {
			var point = dt * i;
			
			output[i] = {t: point, x: 0};
		}
		
		return output;
	}
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

	is_unity() {
		return Math.abs(this.value) == 1;
	}
}


/**
 * A class to hold constants that multiplies variables.
 */
 class MultiplicativeConstant extends Constant {
	constructor(value) {
		super(value);
	}

	/**
	 * Prints a string of LaTeX representing the constant.
	 * 
	 * If the constant value is one then the numeric value of the constant is 
	 * omitted and only the sign is printed ("+" or "-"). If the value is 
	 * leading, the sign of the constant will only be printed if it is negative. 
	 * 
	 * @param {bool} leading 
	 * @returns {string}
	 */
	print(leading = true) {
		var output = "";

		if (leading && super.is_negative() || !leading) {
			output += super.print_sign();
		}

		if (!super.is_unity()) {
			output += super.print_unsigned();
		}

		return output;
	}
}


/**
 * A class to hold constants that are added to variables
 */
class AdditiveConstant extends Constant {
	constructor(value) {
		super(value);
	}

	/**
	 * Prints a string of LaTeX representing the constant.
	 * 
	 * If the constant value is zero then this will always an empty string (""). 
	 * If the value is leading, the sign of the constant will only be printed if 
	 * it is negative. 
	 * 
	 * @param {bool} leading 
	 * @returns {string}
	 */
	print(leading = true) {
		var output = "";

		if (super.is_zero()) {
			return "";
		}

		if (leading && super.is_negative() || !leading) {
			output += super.print_sign();
		}
		
		output += super.print_unsigned();

		return output;
	}
}

class DifferentialEquationTerm {
	constructor(constant, order) {
		this.constant = new Constant(constant);
		this.derivative = new Derivative(order);
	}

	print(leading = true) {
		if (this.constant.is_zero()) {
			return "";
		} else {
			return this.constant.print(leading) + this.derivative.print();
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

class DifferentialEquation {
	constructor(terms) {
		this.terms = terms;
	}

	print() {
		var output = "";
		var is_first_term = true;
		for (let i = 0; i < this.terms.length; i++) {
			if (!this.terms[i].is_zero() && is_first_term) {
				output += this.terms[i].print();
				is_first_term = false;
			} else if (!is_first_term) {
				output += this.terms[i].print(false);
			}
		}
		return output + " = 0";
	}

	order() { return this.terms.length - 1; }

}

class SecondOrderDifferentialEquation extends DifferentialEquation {
	constructor(a, b, c) {
		super([new DifferentialEquationTerm(a, 2), new DifferentialEquationTerm(b, 1), new DifferentialEquationTerm(c, 0)]);
		var discriminant = b*b - 4*a*c;
		if (discriminant == 0) {
			var root_value = -b/(2*a);
			this.root1 = new Root(root_value);
			this.root2 = new Root(root_value);
		} else if (discriminant < 0) {
			var real_value = -b/(2*a);
			var imaginary_value = Math.sqrt(Math.abs(discriminant))/(2*a);
			this.root1 = new Root(real_value, imaginary_value);
			this.root2 = new Root(real_value, (-1)*imaginary_value);
		} else if (discriminant > 0){
			var real_value1 = (- b - Math.sqrt(discriminant)) / (2*a);
			var real_value2 = (- b + Math.sqrt(discriminant)) / (2*a);
			this.root1 = new Root(real_value1);
			this.root2 = new Root(real_value2);
		} 
	}

	get_roots() {
		return [this.root1, this.root2];
	}

}

class FirstOrderDifferentialEquation extends DifferentialEquation {
	constructor(a, b) {
		super([new DifferentialEquationTerm(a, 1), new DifferentialEquationTerm(b, 0)]);
		var root_value = b/Math.abs(a);
		this.root = new Root(root_value);
	}

	get_roots() { return [this.root]; }
}

class ZerothOrderDifferentialEquation extends DifferentialEquation {
	constructor(a) {
		super([new DifferentialEquationTerm(a, 0)]);
		this.root = new Root(0);
	}

	get_roots() { return [this.root]; }
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
		if (a == 0 && b == 0) {
			return new ZerothOrderDifferentialEquation(c);
		} else if (a == 0) {
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

	/**
	 * Returns the numeric value of the real part of the number.
	 * 
	 * @returns {number}
	 */
	re() {
		return this.real.value;
	}

	im() {
		return this.imaginary.value;
	}

	/**
	 * Returns true if this root has a non-zero imaginary part.
	 * 
	 * @returns {boolean}
	 */
	is_complex() {
		return !this.imaginary.is_zero();
	}

	/**
	 * Returns true if this root is complex and with zero real part.
	 * 
	 * @returns {boolean}
	 */
	pure_imaginary() {
		return this.is_complex && this.real.is_zero();	
	}

	print_real(leading = true) {
		return this.real.print(leading);
	}

	
	print() {
		if (this.is_complex()) {
			return "" + this.real.print(false) + this.imaginary.print(false) + "i";
		} else {
			return "" + this.real.print(false);
		}
	}
}

