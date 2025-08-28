import address from './modules/address.js';
import hash from './modules/hash.js';
import mnemonic from './modules/mnemonic.js';
import nonce from './modules/nonce.js';
import signature from './modules/signature.js';
import data from './modules/data.js';
import utils from './modules/utils.js';

const sign = signature.sign;

export default {
    address,
    hash,
    mnemonic,
    nonce,
    signature,
    data,
    utils,
    sign
};