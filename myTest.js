const api = require("./index.js");
const b4a = require("b4a");

const numToHex = (num) => {
    return num.toString(16);
}

const hextoNum = (hex) => {
    return parseInt(hex, 16);
}

// General test parameters
const networkId = api.MAINNET_ID;
const from = "trac1775p3gcxyxln9g52q0jqmfc9c4ypunxtpyrramqu4g5sj0ha6knqw3hmg9";
const secretKey = "c62b2bf6116548554e040a9a974fb6b7c44b4ade17fafa7dadb07b2a32ff82d8f7a818a30621bf32a28a03e40da705c5481e4ccb09063eec1caa29093efdd5a6";
const validity = "2a2ad7efae489f1152b974406d7919746a501b69d5dc44adc0c8dd37d7179958";

// transaction parameters
const to = "trac1ah5fzvpw7ht0audcm045d343khxsh59njxnz7c6gc7af5cm78hxqtp48jh";
// const amountDec = 1_000_000_000_000_000_000_000; // 1000 $TNK
const amountDec = 1_000_000_000_000_000_000; // 1 $TNK
const amount = numToHex(amountDec);
console.log("Amount as hex string:", amount);
console.log("Amount as number:", hextoNum(amount));

// operation parameters
const originBootstrap = "5adb970a73e20e8e2e896cd0c30cf025a0b32ec6fe026b98c6714115239607ac";
const destinationBootstrap = "b4adf37878871ebc30c87d8dfdc5be44e1e10cc41461a8d1d61e26b5a19416c9";
const validator = originBootstrap; // just for testing purposes
const contentHash = originBootstrap; // just for testing purposes

const buildTransaction = async () => {
    const preTx = await api.transaction.preBuild(from, to, amount, validity, networkId);
    const tx = api.transaction.build(preTx, b4a.from(secretKey, "hex"));
    const payload = {
        payload: tx
    }
    return payload;
};

const buildOperation = async () => {
    const preOp = await api.operation.preBuild(from, validator, contentHash, originBootstrap, destinationBootstrap, validity, networkId);
    const op = api.operation.build(preOp, b4a.from(secretKey, "hex"));
    const payload = {
        payload: op
    }
    return payload;
}

async function testFunction() {
    const payload = await buildTransaction();
    // const payload = await buildOperation();
    const decodedStr = b4a.from(payload.payload, 'base64').toString('ascii');
    const decodedObj = JSON.parse(decodedStr);

    console.log(JSON.stringify(payload));
    console.log("\n\n==============================\n\n");
    console.log("Payload length:", payload.payload.length);
    console.log("Decoded Payload String: ", decodedStr);
    console.log("Decoded Payload Object:", decodedObj);
}
testFunction();