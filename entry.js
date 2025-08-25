import signatureModule from "./modules/signature.js";
import b4a from "b4a";
import sodium from "sodium-universal";

const { sign, verify } = signatureModule;

window.TracCryptoApi = {
  sign,
  verify,
  b4a,
  sodium,
};
