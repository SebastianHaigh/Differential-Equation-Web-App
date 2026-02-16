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


QUnit.test( "Solution Tests: Complex root with zero cosine term and non-zero sine term.", function( assert ) { 
    // Arrange
    let root1 = new Root(-0.25, 1.1);
    let root2 = new Root(-0.25, -1.1);
    var position = 0;
    var velocity = 2;
    let solution = new ComplexRootSolution(root1, root2, position, velocity);
    var expected = "x(t) = 1.82e^{-0.25t}\\sin(1.10t)"
    // Act
    var actual = solution.print();

    // Assert
    assert.equal(actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "Solution Tests: Complex root with non-zero cosine term and zero sine term.", function( assert ) { 
    // Arrange
    let root1 = new Root(2, 1.1);
    let root2 = new Root(2, -1.1);
    var position = 2;
    var velocity = 4;
    let solution = new ComplexRootSolution(root1, root2, position, velocity);
    var expected = "x(t) = 2e^{2t}\\cos(1.10t)"
    // Act
    var actual = solution.print();

    // Assert
    assert.equal(actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "Solution Tests: Complex root with zero cosine and sine terms.", function( assert ) { 
    // Arrange
    let root1 = new Root(2, 1.1);
    let root2 = new Root(2, -1.1);
    var position = 0;
    var velocity = 0;
    let solution = new ComplexRootSolution(root1, root2, position, velocity);
    var expected = "x(t) = 0"
    // Act
    var actual = solution.print();

    // Assert
    assert.equal(actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "Solution Tests: unit exponential term and non-zero sine and cosine terms", function( assert ) { 
    // Arrange
    let root1 = new Root(0, 1.1);
    let root2 = new Root(0, -1.1);
    var position = 3;
    var velocity = 4;
    let solution = new ComplexRootSolution(root1, root2, position, velocity);
    var expected = "x(t) = 3\\cos(1.10t)+3.64\\sin(1.10t)"
    // Act
    var actual = solution.print();

    // Assert
    assert.equal(actual, expected, "Value should be -x." ); 
}); 

QUnit.test( "Solution Tests: Repeated Root with A and B non-zero", function( assert ) { 
    // Arrange
    let root = new Root(1, 0);
    var position = 2;
    var velocity = 4;
    let solution = new RepeatedRootSolution(root, position, velocity);
    var expected = "x(t) = e^{t}(2+2t)"
    // Act
    var actual = solution.print();

    // Assert
    assert.equal(actual, expected, "Value should be x(t) = e^{t}(2+2t)." ); 
}); 

QUnit.test( "First-order equations use the root -b/a", function( assert ) {
    // Arrange
    let equation = new FirstOrderDifferentialEquation(2, 1);

    // Act
    let root = equation.get_roots()[0];

    // Assert
    assert.equal(root.re(), -0.5, "Root should be -b/a.");
});

QUnit.test( "pure_imaginary only true for complex roots with zero real part", function( assert ) {
    // Arrange
    let purelyImaginary = new Root(0, 2);
    let realOnly = new Root(0, 0);
    let complexWithRealPart = new Root(1, 2);

    // Assert
    assert.true(purelyImaginary.pure_imaginary(), "0 + bi should be pure imaginary.");
    assert.false(realOnly.pure_imaginary(), "0 + 0i is not complex.");
    assert.false(complexWithRealPart.pure_imaginary(), "a + bi (a != 0) is not pure imaginary.");
});

