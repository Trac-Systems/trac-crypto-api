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
// testFunction();

function testBuildTransaction() {
    let from = "trac1w26lfcrlwhnndne2g8wuz0geufhygzttnxxnvnywj492v0amc9ds6jax3r";
    let to = "trac1nh84vgtdt3phmewcjl5g2msd5zal5dz62qxvxctrt3ekvymsscwql7zjcz";
    let amount = "0DE0B6B3A763FFFF"; // 1 TNK
    let validity = "cf639bbf44193db970809a6f3b891f681c13ba54da611d4219629f3de8f2ac05";
    let networkId = api.MAINNET_ID;
    let secretKey = "fe4e4e064e7bec80d33cb61a65f09da07631094d80c4aebd83d48ad163f7ab8172b5f4e07f75e736cf2a41ddc13d19e26e44096b998d364c8e954aa63fbbc15b";
    api.transaction.preBuild(from, to, amount, validity, networkId)
    .then(preTx => {
        const tx = api.transaction.build(preTx, b4a.from(secretKey, "hex"));
        const payload = {
            payload: tx
        }
        console.log(JSON.stringify(payload));
    });
}
// testBuildTransaction();

async function createAddress() {
    const keyPair = await api.address.generate("trac");
    const address = keyPair.address;
    console.log("Generated Address:", address);
    console.log("Private Key:", b4a.toString(keyPair.secretKey, "hex"));
}
// createAddress();

async function isAddressValid(address) {
    console.log("Testing address: ", address);
    console.log("Is valid address format?", api.address.isValid(address));
    console.log("decoded Address Buffer (pub key):", api.address.decode(address).toString('hex'));
}

isAddressValid("trac19wyqu9g80pn95d8cwkzn3e3qk09rj7tsf4vv4sh8mzjh8dmwcwkqp9rql4");