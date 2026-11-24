// Pear v2's static parser skips require() calls with options.
// Explicitly include the dependency and its import map in the bundle.
require.resolve("@metamask/key-tree");
require.resolve("../package.json");

// Apply Bare's import map before the dependency graph is linked.
module.exports = require("@metamask/key-tree", {
    with: { imports: "../package.json" },
});
