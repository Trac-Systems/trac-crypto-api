const test = require("brittle");

function runTests() {
    test.pause();

    require("./mnemonic/mnemonic.test.js");
    require("./hash/hash.test.js");
    require("./address/address.test.js");
    require("./nonce/nonce.test.js");
    require("./signature/signature.test.js");
    require("./data/data.test.js");
    require("./utils/utils.test.js");
    require("./compat/dom.test.js");
    require("./compat/sodium.test.js");
    require("./transaction/transaction.test.js");
    require("./operation/operation.test.js");
    require("./runtime/runtime.test.js");

    test.resume();
}

runTests();
