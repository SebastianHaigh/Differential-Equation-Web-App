QUnit.test( "Constant Test: Positive unit leading constant prints as empty string.", function( assert ) { 
    // Arrange
    let constant = new Constant(1);

    // Act
    var value = constant.print();

    // Assert
    assert.equal( value, "", "Value should be an empty string." ); 
}); 

QUnit.test( "Constant Test: Positive unit non-leading constant prints as plus sign.", function( assert ) { 
    // Arrange
    let constant = new Constant(1);

    // Act
    var value = constant.print(false);

    // Assert
    assert.equal( value, "+", "Value should be a plus sign." ); 
}); 

QUnit.test( "Constant Test: Negative unit leading constant prints as minus sign.", function( assert ) { 
    // Arrange
    let constant = new Constant(-1);

    // Act
    var value = constant.print();

    // Assert
    assert.equal( value, "-", "Value should be a minus sign." ); 
}); 

QUnit.test( "Constant Test: Negative unit non-leading constant prints as minus sign.", function( assert ) { 
    // Arrange
    let constant = new Constant(-1);

    // Act
    var value = constant.print(false);

    // Assert
    assert.equal( value, "-", "Value should be a minus sign." ); 
}); 

QUnit.test( "Constant Test: Floating point constant prints to 2 d.p.", function( assert ) { 
    // Arrange
    let constant = new Constant(1.23456789);

    // Act
    var value = constant.print();

    // Assert
    assert.equal( value, "1.23", "Value should be printed to 2 d.p." ); 
}); 

QUnit.test( "Constant Test: Integer constant prints as integer.", function( assert ) { 
    // Arrange
    let constant = new Constant(2);

    // Act
    var value = constant.print();

    // Assert
    assert.equal( value, "2", "Value should be printed as integer." ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing cosine of 0.", function( assert ) { 
    // Arrange
    let constant = new MultiplicativeConstant(2);
    let frequency = new MultiplicativeConstant(0);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_cosine_term(constant, frequency);

    // Assert
    assert.equal( value, "2", "Value should be 2." ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing non leading cosine of 0.", function( assert ) { 
    // Arrange
    let constant = new Constant(2);
    let frequency = new Constant(0);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_cosine_term(constant, frequency, false);

    // Assert
    assert.equal( value, "+2", "Value should be +2." ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing cosine term with multiplier of zero.", function( assert ) { 
    // Arrange
    let constant = new Constant(0);
    let frequency = new Constant(1);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_cosine_term(constant, frequency, false);

    // Assert
    assert.equal( value, "0", "Value should be 0" ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing leading cosine term with unity amplitude and frequency", function( assert ) { 
    // Arrange
    let constant = new Constant(1);
    let frequency = new Constant(1);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_cosine_term(constant, frequency);

    // Assert
    assert.equal( value, "\\cos(t)", "Value should be \\cos(t)" ); 
}); 


QUnit.test( "AnalyticSolution Test: Printing sine of 0.", function( assert ) { 
    // Arrange
    let constant = new Constant(2);
    let frequency = new Constant(0);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_sine_term(constant, frequency);

    // Assert
    assert.equal( value, "0", "Value should be 0." ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing non leading sine of 0.", function( assert ) { 
    // Arrange
    let constant = new Constant(2);
    let frequency = new Constant(0);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_sine_term(constant, frequency, false);

    // Assert
    assert.equal( value, "0", "Value should be 0." ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing sine term with multiplier of zero.", function( assert ) { 
    // Arrange
    let constant = new Constant(0);
    let frequency = new Constant(1);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_sine_term(constant, frequency, false);

    // Assert
    assert.equal( value, "0", "Value should be 0" ); 
}); 

QUnit.test( "AnalyticSolution Test: Printing leading sine term with unity amplitude and frequency", function( assert ) { 
    // Arrange
    let constant = new MultiplicativeConstant(1);
    let frequency = new MultiplicativeConstant(1);
    let solution = new AnalyticSolution();

    // Act
    var value = solution.print_sine_term(constant, frequency);

    // Assert
    assert.equal( value, "\\sin(t)", "Value should be \\sin(t)" ); 
}); 


QUnit.test( "ComplexRootSolution Test: Printing leading sine term with unity amplitude and frequency", function( assert ) { 
    // Arrange
    let root1 = new Root(0, 1);
    let root2 = new Root(0, -1);
    let solution = new ComplexRootSolution(root1, root2, 0, 1);

    // Act
    var value = solution.print();

    // Assert
    assert.equal( value, "x(t) = \\sin(t)", "Value should be \\cos(t)" ); 
}); 


QUnit.test( "ZerothOrderSolutionTest", function( assert ) { 
    // Arrange
    let de = new ZerothOrderDifferentialEquation(10);
    let factory = new SolutionFactory();

    // Act
    let solution = factory.new_solution(de, 0, 0);

    // Assert
    assert.equal( solution.print(), "x(t) = 0", "Should print x(t) = 0" ); 
}); 

QUnit.test( "ZerothOrderSolutionTest: With Factory", function( assert ) { 
    // Arrange
    let de_factory = new DifferentialEquationFactory();
    let de = de_factory.create_differential_equation(0, 0, 10);
    let factory = new SolutionFactory();

    // Act
    var solution = factory.new_solution(de, 0, 0);

    // Assert
    assert.equal( solution.print(), "x(t) = 0", "Should print x(t) = 0" ); 
}); 

QUnit.test( "Solution Time Series", function( assert ) { 
    // Arrange
    let de_factory = new DifferentialEquationFactory();
    let de = de_factory.create_differential_equation(1, 1, 10);
    let factory = new SolutionFactory();

    // Act
    var solution = factory.new_solution(de, 2, 0);
    var time_series = solution.time_series(0.1, 1000);

    // Assert
    assert.equal( solution.print(), "x(t) = e^{-0.50t}(2\\cos(3.12t)+0.32\\sin(3.12t))", "Should print x(t) = e^{-0.50t}(2\\cos(3.12t)+0.32\\sin(3.12t))" ); 
}); 

QUnit.test( "Differential Equation with only second order term.", function( assert ) { 
    // Arrange
    let de_factory = new DifferentialEquationFactory();
    let de = de_factory.create_differential_equation(1, 0, 0);
    let factory = new SolutionFactory();

    // Act
    var solution = factory.new_solution(de, 2, 0);
    var time_series = solution.time_series(0.1, 1000);

    // Assert
    assert.equal( solution.print(), "x(t) = 2", "Should print x(t) = 2" ); 
}); 