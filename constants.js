import sodium from 'sodium-universal';

export const TRAC_PUB_KEY_SIZE = sodium.crypto_sign_PUBLICKEYBYTES;
export const TRAC_PRIV_KEY_SIZE = sodium.crypto_sign_SECRETKEYBYTES;
export const TRAC_SIGNATURE_SIZE = sodium.crypto_sign_BYTES;
export const NONCE_SIZE = 32;