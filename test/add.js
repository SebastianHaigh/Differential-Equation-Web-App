

QUnit.test('add two numbers', assert => {
  let ts = new TimeSeries();
  ts.push(1,3);
  assert.equal(ts.at(0).data, 3, '1 + 1 = 2');
});