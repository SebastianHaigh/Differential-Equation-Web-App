
QUnit.test("InitialConditions stores constructor values", function(assert) {
  let initialConditions = new InitialConditions(1, 3);
  assert.equal(initialConditions.position, 1, "Position should be stored.");
  assert.equal(initialConditions.velocity, 3, "Velocity should be stored.");
});