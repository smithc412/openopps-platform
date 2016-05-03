var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
require('./casperConfig.js');
/**
 *
 * Home page tests
 *
 */

before(function() {
  console.log('before', process.env.TEST_ROOT);
  casper.start(process.env.TEST_ROOT);
});

describe('Home page', function() {

  it('should have success status', function() {
    console.log('should have success status');

    casper.then(function() {
      assert.equal(this.status().currentHTTPStatus , 200);
    });
  });

  it('should have correct title', function() {
    casper.then(function() {
      assert.equal(casper.getTitle(), "Open Opportunities");
    });
  });

  xit('should link to /tasks', function() {
    casper.then(function() {
      casper.waitForText('Browse opportunities', function afterPageText() {
        casper.click('a.nav-link');
        assert.equal(casper.getCurrentUrl(), process.env.TEST_ROOT + '/tasks');
      });
    });
  });

});
