QUnit.test( "DifferentialEquationTerm Test: Positive unit leading term prints with only derivative.", function( assert ) { 
    // Arrange
    let term = new DifferentialEquationTerm(1, 0);
    var expected = "x"

    // Act
    var actual = term.print();

    // Assert
    assert.equal( actual, expected, "Value should be x." ); 
}); 

QUnit.test( "DifferentialEquationTerm Test: Negative unit leading term prints with negative derivative.", function( assert ) { 
    // Arrange
    let term = new DifferentialEquationTerm(-1, 0);
    var expected = "-x"

    // Act
    var actual = term.print();

    // Assert
    assert.equal( actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "DifferentialEquationTerm Test: Term with zero constant prints as empty string.", function( assert ) { 
    // Arrange
    let term = new DifferentialEquationTerm(0, 0);
    var expected = ""

    // Act
    var actual = term.print();

    // Assert
    assert.equal( actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "DifferentialEquationFactory.", function( assert ) { 
    // Arrange
    let equation_factory = new DifferentialEquationFactory();

    // Act
    var actual = equation_factory.create_differential_equation(1,2,3);

    // Assert
    assert.equal( actual.order(), 2, "Value should be -x." ); 
}); 


QUnit.test( "OK.", function( assert ) { 
    // Arrange
    var dataObject = {
		type: 0,
		roots: [{Re: 0, Im: 0}],
		root1: {Re: 0, Im: 0}, 
		root2: {Re: 0, Im: 0}, 
		diffEqconts: {a: 1, b: 2, c: 3},
		intCon: {t: 0, x: 1, xdash: 1},
		solConstants: {A: 0, B: 0}, 
		timeSeries: [{t: 0, x: 0}],
		stepResponse: [{t: 0, x: 0}],
		differential_equation: 0,
		solution: 0};
    let equation_factory = new DifferentialEquationFactory();
    let solution_factory = new SolutionFactory();


    // Act
    var dO = solution(dataObject, equation_factory, solution_factory);

    // Assert
    assert.equal( dO.differential_equation, 2, "Value should be -x." ); 
}); 

