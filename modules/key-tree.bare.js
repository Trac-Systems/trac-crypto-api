// Apply Bare's import map before the dependency graph is linked.
module.exports = require("@metamask/key-tree", {
    with: { imports: "../package.json" },
});
