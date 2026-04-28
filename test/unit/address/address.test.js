const test = require('brittle');

function runTests() {
  test.pause();

  require('./encoding.test.js');
  require('./generate.test.js');

  test.resume();
}

runTests();