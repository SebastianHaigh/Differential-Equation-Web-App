const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sourcePath = path.join(__dirname, "..", "structures.js");
const source = fs.readFileSync(sourcePath, "utf8");

// Load browser-style globals so legacy tests can run under Node/QUnit.
vm.runInThisContext(source, { filename: "structures.js" });
