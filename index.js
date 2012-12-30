// builtin
var fs = require('fs');
var path = require('path');

// node 0.6 support
fs.existsSync = fs.existsSync || path.existsSync;

// main_paths are the paths where our mainprog will be able to load from
// we store these to avoid grabbing the modules that were loaded as a result
// of a dependency module loading its dependencies, we only care about deps our
// mainprog loads
// remove trailing node_modules
var main_paths = require.main.paths.map(function(p) {
    return path.dirname(p);
});

module.exports = function() {
    var paths = Object.keys(require.cache);

    // module information
    var infos = {};

    // paths we have already inspected to avoid traversing again
    var seen = {};

    paths.forEach(function(p) {
        var dir = p;

        (function updir() {
            dir = path.dirname(dir);

            if (!dir || seen[dir]) {
                return;
            }
            else if (main_paths.indexOf(dir) < 0) {
                return updir();
            }

            var pkgfile = path.join(dir, 'package.json');
            var exists = fs.existsSync(pkgfile);

            seen[dir] = true;

            // travel up the tree if no package.json here
            if (!exists) {
                return updir();
            }

            try {
                var info = JSON.parse(fs.readFileSync(pkgfile, 'utf8'));
                infos[info.name] = info.version;
            } catch (e) {};
        })();
    });

    return infos;
};
