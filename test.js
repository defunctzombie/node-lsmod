var assert = require('assert');
var lsmod = require('./');

test('basic', function() {
    var modules = lsmod();
    assert.equal(modules.lsmod, require('./package.json').version);
    assert.equal(modules.mocha, '1.7.4');

    // diff is a dep of mocha and we should not get it as a result
    assert.equal(modules.diff, undefined);
});
