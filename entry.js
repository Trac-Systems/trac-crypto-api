import signatureModule from "./modules/signature.js";
import utilsModule from "./modules/utils.js";
import b4a from "b4a";
import sodium from "sodium-universal";

const { sign, verify } = signatureModule;
const { memzero } = utilsModule;

window.TracCryptoApi = {
  sign,
  verify,
  memzero,
  b4a,
  sodium,
};
