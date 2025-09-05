import crypto from 'crypto';
import util from 'util';
globalThis.TextEncoder = util.TextEncoder;
import { SLIP10Node } from '@metamask/key-tree';
import test from 'brittle';
import api from '../../../index.js';
import b4a from 'b4a';


test("Can derive a key", async (t) => {
    const mnemonic = api.mnemonic.generate();

    const node = await SLIP10Node.fromDerivationPath({
      curve: 'ed25519',
      derivationPath: [`bip39:${mnemonic}`, `slip10:0'`],
    });

    console.log("PUB_KEY: ", node.publicKey.toString('hex'));
    console.log("PRIV_KEY: ", node.privateKey.toString('hex'));
    
    // Derive the child node at m / 0' / 1' / 2'. This results in a new SLIP10Node.
    // Note that you cannot derive unhardened child nodes when using Ed25519.
    const childNode = await node.derive([`slip10:1'`, `slip10:2'`]);

    console.log("PUB_KEY: ", childNode.publicKey.toString('hex'));
    console.log("PRIV_KEY: ", childNode.privateKey.toString('hex'));

    // const result = await api.address.generate(hrp);
});