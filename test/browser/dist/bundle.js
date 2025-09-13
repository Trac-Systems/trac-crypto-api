function Be(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
var Ft = { exports: {} };
function uA(h) {
  throw new Error('Could not dynamically require "' + h + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Kt = { exports: {} }, vt, bA;
function ct() {
  if (bA) return vt;
  bA = 1, vt = o;
  class h extends Error {
  }
  h.prototype.name = "AssertionError";
  function o(a, C) {
    if (!a) {
      var s = new h(C);
      throw Error.captureStackTrace && Error.captureStackTrace(s, o), s;
    }
  }
  return vt;
}
var wA;
function bt() {
  return wA || (wA = 1, (function(h) {
    var o = ct(), a = (function() {
      var C = 65536, s = globalThis.crypto || globalThis.msCrypto;
      function n(f, i) {
        for (let A = 0; A < i; A += C)
          s.getRandomValues(new Uint8Array(f.buffer, A + f.byteOffset, Math.min(i - A, C)));
      }
      function r(f, i) {
        new Uint8Array(f.buffer, f.byteOffset, i).set(s.randomBytes(i));
      }
      function e() {
        throw new Error("No secure random number generator available");
      }
      return s && s.getRandomValues ? n : uA != null && (s = uA("crypto"), s && s.randomBytes) ? r : e;
    })();
    Object.defineProperty(h.exports, "randombytes", {
      value: a
    }), h.exports.randombytes_buf = function(C) {
      o(C, "out must be given"), a(C, C.byteLength);
    };
  })(Kt)), Kt.exports;
}
var Tt, SA;
function ue() {
  if (SA) return Tt;
  SA = 1;
  function h(n) {
    return new Uint8Array(n);
  }
  function o(n) {
    a(n), s().port1.postMessage(n.buffer, [n.buffer]);
  }
  function a(n) {
    n.fill(0);
  }
  var C;
  function s() {
    if (C) return C;
    var n = globalThis.MessageChannel;
    return n == null && ({ MessageChannel: n } = uA("worker_threads")), C = new n(), C;
  }
  return Tt = {
    sodium_malloc: h,
    sodium_free: o,
    sodium_memzero: a
  }, Tt;
}
var Nt = { exports: {} }, dA;
function wt() {
  return dA || (dA = 1, (function(h) {
    h.exports = {
      crypto_verify_16: a,
      crypto_verify_32: C,
      crypto_verify_64: s
    };
    function o(n, r, e, f, i) {
      var A = 0;
      for (let I = 0; I < i; I++) A |= n[r + I] ^ e[f + I];
      return (1 & A - 1 >>> 8) - 1;
    }
    Object.defineProperty(h.exports, "vn", {
      value: o
    });
    function a(n, r, e, f) {
      return o(n, r, e, f, 16) === 0;
    }
    function C(n, r, e, f) {
      return o(n, r, e, f, 32) === 0;
    }
    function s(n, r, e, f) {
      return o(n, r, e, f, 64) === 0;
    }
  })(Nt)), Nt.exports;
}
var Ht, DA;
function Qe() {
  if (DA) return Ht;
  DA = 1;
  const h = ct(), { vn: o } = wt();
  function a(n) {
    const r = n.byteLength;
    for (var e = 1, f = 0; f < r; f++)
      e += n[f], n[f] = e, e >>= 8;
  }
  function C(n, r) {
    return h(n.byteLength === r.byteLength, "buffers must be the same size"), o(n, 0, r, 0, n.byteLength) === 0;
  }
  function s(n) {
    var r = 0;
    for (let e = 0; e < n.length; e++) r |= n[e];
    return r === 0;
  }
  return Ht = {
    sodium_increment: a,
    sodium_memcmp: C,
    sodium_is_zero: s
  }, Ht;
}
var Qt = { exports: {} }, Dt = { exports: {} }, Gt, UA;
function de() {
  if (UA) return Gt;
  UA = 1;
  function h(C) {
    return C.length;
  }
  function o(C) {
    const s = C.byteLength;
    let n = "";
    for (let r = 0; r < s; r++)
      n += String.fromCharCode(C[r]);
    return n;
  }
  function a(C, s, n = 0, r = h(s)) {
    const e = Math.min(r, C.byteLength - n);
    for (let f = 0; f < e; f++)
      C[n + f] = s.charCodeAt(f);
    return e;
  }
  return Gt = {
    byteLength: h,
    toString: o,
    write: a
  }, Gt;
}
var Rt, YA;
function De() {
  if (YA) return Rt;
  YA = 1;
  const h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = new Uint8Array(256);
  for (let n = 0; n < h.length; n++)
    o[h.charCodeAt(n)] = n;
  o[
    /* - */
    45
  ] = 62, o[
    /* _ */
    95
  ] = 63;
  function a(n) {
    let r = n.length;
    return n.charCodeAt(r - 1) === 61 && r--, r > 1 && n.charCodeAt(r - 1) === 61 && r--, r * 3 >>> 2;
  }
  function C(n) {
    const r = n.byteLength;
    let e = "";
    for (let f = 0; f < r; f += 3)
      e += h[n[f] >> 2] + h[(n[f] & 3) << 4 | n[f + 1] >> 4] + h[(n[f + 1] & 15) << 2 | n[f + 2] >> 6] + h[n[f + 2] & 63];
    return r % 3 === 2 ? e = e.substring(0, e.length - 1) + "=" : r % 3 === 1 && (e = e.substring(0, e.length - 2) + "=="), e;
  }
  function s(n, r, e = 0, f = a(r)) {
    const i = Math.min(f, n.byteLength - e);
    for (let A = 0, I = 0; I < i; A += 4) {
      const g = o[r.charCodeAt(A)], y = o[r.charCodeAt(A + 1)], c = o[r.charCodeAt(A + 2)], u = o[r.charCodeAt(A + 3)];
      n[I++] = g << 2 | y >> 4, n[I++] = (y & 15) << 4 | c >> 2, n[I++] = (c & 3) << 6 | u & 63;
    }
    return i;
  }
  return Rt = {
    byteLength: a,
    toString: C,
    write: s
  }, Rt;
}
var qt, MA;
function Ue() {
  if (MA) return qt;
  MA = 1;
  function h(s) {
    return s.length >>> 1;
  }
  function o(s) {
    const n = s.byteLength;
    s = new DataView(s.buffer, s.byteOffset, n);
    let r = "", e = 0;
    for (let f = n - n % 4; e < f; e += 4)
      r += s.getUint32(e).toString(16).padStart(8, "0");
    for (; e < n; e++)
      r += s.getUint8(e).toString(16).padStart(2, "0");
    return r;
  }
  function a(s, n, r = 0, e = h(n)) {
    const f = Math.min(e, s.byteLength - r);
    for (let i = 0; i < f; i++) {
      const A = C(n.charCodeAt(i * 2)), I = C(n.charCodeAt(i * 2 + 1));
      if (A === void 0 || I === void 0)
        return s.subarray(0, i);
      s[r + i] = A << 4 | I;
    }
    return f;
  }
  qt = {
    byteLength: h,
    toString: o,
    write: a
  };
  function C(s) {
    if (s >= 48 && s <= 57) return s - 48;
    if (s >= 65 && s <= 70) return s - 65 + 10;
    if (s >= 97 && s <= 102) return s - 97 + 10;
  }
  return qt;
}
var Ot, LA;
function Ye() {
  if (LA) return Ot;
  LA = 1;
  function h(C) {
    let s = 0;
    for (let n = 0, r = C.length; n < r; n++) {
      const e = C.charCodeAt(n);
      if (e >= 55296 && e <= 56319 && n + 1 < r) {
        const f = C.charCodeAt(n + 1);
        if (f >= 56320 && f <= 57343) {
          s += 4, n++;
          continue;
        }
      }
      e <= 127 ? s += 1 : e <= 2047 ? s += 2 : s += 3;
    }
    return s;
  }
  let o;
  if (typeof TextDecoder < "u") {
    const C = new TextDecoder();
    o = function(n) {
      return C.decode(n);
    };
  } else
    o = function(s) {
      const n = s.byteLength;
      let r = "", e = 0;
      for (; e < n; ) {
        let f = s[e];
        if (f <= 127) {
          r += String.fromCharCode(f), e++;
          continue;
        }
        let i = 0, A = 0;
        if (f <= 223 ? (i = 1, A = f & 31) : f <= 239 ? (i = 2, A = f & 15) : f <= 244 && (i = 3, A = f & 7), n - e - i > 0) {
          let I = 0;
          for (; I < i; )
            f = s[e + I + 1], A = A << 6 | f & 63, I += 1;
        } else
          A = 65533, i = n - e;
        r += String.fromCodePoint(A), e += i + 1;
      }
      return r;
    };
  let a;
  if (typeof TextEncoder < "u") {
    const C = new TextEncoder();
    a = function(n, r, e = 0, f = h(r)) {
      const i = Math.min(f, n.byteLength - e);
      return C.encodeInto(r, n.subarray(e, e + i)), i;
    };
  } else
    a = function(s, n, r = 0, e = h(n)) {
      const f = Math.min(e, s.byteLength - r);
      s = s.subarray(r, r + f);
      let i = 0, A = 0;
      for (; i < n.length; ) {
        const I = n.codePointAt(i);
        if (I <= 127) {
          s[A++] = I, i++;
          continue;
        }
        let g = 0, y = 0;
        for (I <= 2047 ? (g = 6, y = 192) : I <= 65535 ? (g = 12, y = 224) : I <= 2097151 && (g = 18, y = 240), s[A++] = y | I >> g, g -= 6; g >= 0; )
          s[A++] = 128 | I >> g & 63, g -= 6;
        i += I >= 65536 ? 2 : 1;
      }
      return f;
    };
  return Ot = {
    byteLength: h,
    toString: o,
    write: a
  }, Ot;
}
var Pt, mA;
function Me() {
  if (mA) return Pt;
  mA = 1;
  function h(C) {
    return C.length * 2;
  }
  function o(C) {
    const s = C.byteLength;
    let n = "";
    for (let r = 0; r < s - 1; r += 2)
      n += String.fromCharCode(C[r] + C[r + 1] * 256);
    return n;
  }
  function a(C, s, n = 0, r = h(s)) {
    const e = Math.min(r, C.byteLength - n);
    let f = e;
    for (let i = 0; i < s.length && !((f -= 2) < 0); ++i) {
      const A = s.charCodeAt(i), I = A >> 8, g = A % 256;
      C[n + i * 2] = g, C[n + i * 2 + 1] = I;
    }
    return e;
  }
  return Pt = {
    byteLength: h,
    toString: o,
    write: a
  }, Pt;
}
var FA;
function St() {
  return FA || (FA = 1, (function(h, o) {
    const a = de(), C = De(), s = Ue(), n = Ye(), r = Me(), e = new Uint8Array(Uint16Array.of(255).buffer)[0] === 255;
    function f(B) {
      switch (B) {
        case "ascii":
          return a;
        case "base64":
          return C;
        case "hex":
          return s;
        case "utf8":
        case "utf-8":
        case void 0:
        case null:
          return n;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return r;
        default:
          throw new Error(`Unknown encoding: ${B}`);
      }
    }
    function i(B) {
      return B instanceof Uint8Array;
    }
    function A(B) {
      try {
        return f(B), !0;
      } catch {
        return !1;
      }
    }
    function I(B, l, S) {
      const R = new Uint8Array(B);
      return l !== void 0 && o.fill(R, l, 0, R.byteLength, S), R;
    }
    function g(B) {
      return new Uint8Array(B);
    }
    function y(B) {
      return new Uint8Array(B);
    }
    function c(B, l) {
      return f(l).byteLength(B);
    }
    function u(B, l) {
      if (B === l) return 0;
      const S = Math.min(B.byteLength, l.byteLength);
      B = new DataView(B.buffer, B.byteOffset, B.byteLength), l = new DataView(l.buffer, l.byteOffset, l.byteLength);
      let R = 0;
      for (let p = S - S % 4; R < p; R += 4) {
        const M = B.getUint32(R, e), N = l.getUint32(R, e);
        if (M !== N) break;
      }
      for (; R < S; R++) {
        const p = B.getUint8(R), M = l.getUint8(R);
        if (p < M) return -1;
        if (p > M) return 1;
      }
      return B.byteLength > l.byteLength ? 1 : B.byteLength < l.byteLength ? -1 : 0;
    }
    function w(B, l) {
      l === void 0 && (l = B.reduce((p, M) => p + M.byteLength, 0));
      const S = new Uint8Array(l);
      let R = 0;
      for (const p of B) {
        if (R + p.byteLength > S.byteLength) {
          const M = p.subarray(0, S.byteLength - R);
          return S.set(M, R), S;
        }
        S.set(p, R), R += p.byteLength;
      }
      return S;
    }
    function K(B, l, S = 0, R = 0, p = B.byteLength) {
      if (p > 0 && p < R || p === R || B.byteLength === 0 || l.byteLength === 0) return 0;
      if (S < 0) throw new RangeError("targetStart is out of range");
      if (R < 0 || R >= B.byteLength) throw new RangeError("sourceStart is out of range");
      if (p < 0) throw new RangeError("sourceEnd is out of range");
      S >= l.byteLength && (S = l.byteLength), p > B.byteLength && (p = B.byteLength), l.byteLength - S < p - R && (p = l.length - S + R);
      const M = p - R;
      return B === l ? l.copyWithin(S, R, p) : l.set(B.subarray(R, p), S), M;
    }
    function F(B, l) {
      if (B === l) return !0;
      if (B.byteLength !== l.byteLength) return !1;
      const S = B.byteLength;
      B = new DataView(B.buffer, B.byteOffset, B.byteLength), l = new DataView(l.buffer, l.byteOffset, l.byteLength);
      let R = 0;
      for (let p = S - S % 4; R < p; R += 4)
        if (B.getUint32(R, e) !== l.getUint32(R, e)) return !1;
      for (; R < S; R++)
        if (B.getUint8(R) !== l.getUint8(R)) return !1;
      return !0;
    }
    function D(B, l, S, R, p) {
      if (typeof l == "string" ? typeof S == "string" ? (p = S, S = 0, R = B.byteLength) : typeof R == "string" && (p = R, R = B.byteLength) : typeof l == "number" ? l = l & 255 : typeof l == "boolean" && (l = +l), S < 0 || B.byteLength < S || B.byteLength < R)
        throw new RangeError("Out of range index");
      if (S === void 0 && (S = 0), R === void 0 && (R = B.byteLength), R <= S) return B;
      if (l || (l = 0), typeof l == "number")
        for (let M = S; M < R; ++M)
          B[M] = l;
      else {
        l = i(l) ? l : x(l, p);
        const M = l.byteLength;
        for (let N = 0; N < R - S; ++N)
          B[N + S] = l[N % M];
      }
      return B;
    }
    function x(B, l, S) {
      return typeof B == "string" ? U(B, l) : Array.isArray(B) ? t(B) : ArrayBuffer.isView(B) ? Q(B) : P(B, l, S);
    }
    function U(B, l) {
      const S = f(l), R = new Uint8Array(S.byteLength(B));
      return S.write(R, B, 0, R.byteLength), R;
    }
    function t(B) {
      const l = new Uint8Array(B.length);
      return l.set(B), l;
    }
    function Q(B) {
      const l = new Uint8Array(B.byteLength);
      return l.set(B), l;
    }
    function P(B, l, S) {
      return new Uint8Array(B, l, S);
    }
    function b(B, l, S, R) {
      return T(B, l, S, R) !== -1;
    }
    function v(B, l, S, R, p) {
      if (B.byteLength === 0) return -1;
      if (typeof S == "string" ? (R = S, S = 0) : S === void 0 ? S = p ? 0 : B.length - 1 : S < 0 && (S += B.byteLength), S >= B.byteLength) {
        if (p) return -1;
        S = B.byteLength - 1;
      } else if (S < 0)
        if (p) S = 0;
        else return -1;
      if (typeof l == "string")
        l = x(l, R);
      else if (typeof l == "number")
        return l = l & 255, p ? B.indexOf(l, S) : B.lastIndexOf(l, S);
      if (l.byteLength === 0) return -1;
      if (p) {
        let M = -1;
        for (let N = S; N < B.byteLength; N++)
          if (B[N] === l[M === -1 ? 0 : N - M]) {
            if (M === -1 && (M = N), N - M + 1 === l.byteLength) return M;
          } else
            M !== -1 && (N -= N - M), M = -1;
      } else {
        S + l.byteLength > B.byteLength && (S = B.byteLength - l.byteLength);
        for (let M = S; M >= 0; M--) {
          let N = !0;
          for (let G = 0; G < l.byteLength; G++)
            if (B[M + G] !== l[G]) {
              N = !1;
              break;
            }
          if (N) return M;
        }
      }
      return -1;
    }
    function T(B, l, S, R) {
      return v(
        B,
        l,
        S,
        R,
        !0
        /* first */
      );
    }
    function Z(B, l, S, R) {
      return v(
        B,
        l,
        S,
        R,
        !1
        /* last */
      );
    }
    function O(B, l, S) {
      const R = B[l];
      B[l] = B[S], B[S] = R;
    }
    function j(B) {
      const l = B.byteLength;
      if (l % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let S = 0; S < l; S += 2) O(B, S, S + 1);
      return B;
    }
    function W(B) {
      const l = B.byteLength;
      if (l % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let S = 0; S < l; S += 4)
        O(B, S, S + 3), O(B, S + 1, S + 2);
      return B;
    }
    function $(B) {
      const l = B.byteLength;
      if (l % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let S = 0; S < l; S += 8)
        O(B, S, S + 7), O(B, S + 1, S + 6), O(B, S + 2, S + 5), O(B, S + 3, S + 4);
      return B;
    }
    function tt(B) {
      return B;
    }
    function k(B, l, S = 0, R = B.byteLength) {
      const p = B.byteLength;
      return S >= p || R <= S ? "" : (S < 0 && (S = 0), R > p && (R = p), (S !== 0 || R < p) && (B = B.subarray(S, R)), f(l).toString(B));
    }
    function d(B, l, S, R, p) {
      return S === void 0 ? p = "utf8" : R === void 0 && typeof S == "string" ? (p = S, S = void 0) : p === void 0 && typeof R == "string" && (p = R, R = void 0), f(p).write(B, l, S, R);
    }
    function _(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setFloat64(S, l, !0), S + 8;
    }
    function Y(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setFloat32(S, l, !0), S + 4;
    }
    function m(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setUint32(S, l, !0), S + 4;
    }
    function L(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setInt32(S, l, !0), S + 4;
    }
    function H(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getFloat64(l, !0);
    }
    function At(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getFloat32(l, !0);
    }
    function q(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getUint32(l, !0);
    }
    function J(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getInt32(l, !0);
    }
    function et(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setFloat64(S, l, !1), S + 8;
    }
    function z(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setFloat32(S, l, !1), S + 4;
    }
    function E(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setUint32(S, l, !1), S + 4;
    }
    function ft(B, l, S) {
      return S === void 0 && (S = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).setInt32(S, l, !1), S + 4;
    }
    function nt(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getFloat64(l, !1);
    }
    function it(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getFloat32(l, !1);
    }
    function It(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getUint32(l, !1);
    }
    function at(B, l) {
      return l === void 0 && (l = 0), new DataView(B.buffer, B.byteOffset, B.byteLength).getInt32(l, !1);
    }
    h.exports = o = {
      isBuffer: i,
      isEncoding: A,
      alloc: I,
      allocUnsafe: g,
      allocUnsafeSlow: y,
      byteLength: c,
      compare: u,
      concat: w,
      copy: K,
      equals: F,
      fill: D,
      from: x,
      includes: b,
      indexOf: T,
      lastIndexOf: Z,
      swap16: j,
      swap32: W,
      swap64: $,
      toBuffer: tt,
      toString: k,
      write: d,
      writeDoubleLE: _,
      writeFloatLE: Y,
      writeUInt32LE: m,
      writeInt32LE: L,
      readDoubleLE: H,
      readFloatLE: At,
      readUInt32LE: q,
      readInt32LE: J,
      writeDoubleBE: et,
      writeFloatBE: z,
      writeUInt32BE: E,
      writeInt32BE: ft,
      readDoubleBE: nt,
      readFloatBE: it,
      readUInt32BE: It,
      readInt32BE: at
    };
  })(Dt, Dt.exports)), Dt.exports;
}
var Vt, KA;
function Le() {
  if (KA) return Vt;
  KA = 1;
  const h = ct(), o = St();
  Vt = s;
  const a = 128;
  var C = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ];
  function s() {
    return this instanceof s ? (this.hh = new Int32Array(8), this.hl = new Int32Array(8), this.buffer = new Uint8Array(128), this.finalised = !1, this.bytesRead = 0, this.pos = 0, this.hh[0] = 1779033703, this.hh[1] = 3144134277, this.hh[2] = 1013904242, this.hh[3] = 2773480762, this.hh[4] = 1359893119, this.hh[5] = 2600822924, this.hh[6] = 528734635, this.hh[7] = 1541459225, this.hl[0] = 4089235720, this.hl[1] = 2227873595, this.hl[2] = 4271175723, this.hl[3] = 1595750129, this.hl[4] = 2917565137, this.hl[5] = 725511199, this.hl[6] = 4215389547, this.hl[7] = 327033209, this) : new s();
  }
  s.prototype.update = function(i, A) {
    h(this.finalised === !1, "Hash instance finalised");
    var [I, g] = r(i, A);
    this.bytesRead += g;
    const y = g + this.pos & -128;
    this.buffer.set(I.subarray(0, a - this.pos), this.pos);
    const c = this.pos;
    return g -= a - this.pos, g >= 0 && (e(this.hh, this.hl, this.buffer, 128), this.pos = 0), g > 127 && (e(this.hh, this.hl, I.subarray(a - c, y - c), y - a), g %= 128), this.buffer.set(I.subarray(I.byteLength - g)), this.pos = this.bytesRead & 127, this.buffer.fill(0, this.pos), this;
  }, s.prototype.digest = function(i, A = 0) {
    if (h(this.finalised === !1, "Hash instance finalised"), this.finalised = !0, this.buffer.fill(0, this.pos), this.buffer[this.pos] = 128, this.pos > 111 && (e(this.hh, this.hl, this.buffer, 128), this.buffer.fill(0), this.pos = 0), n(this.buffer, 120, this.bytesRead / 536870912 | 0, this.bytesRead << 3), e(this.hh, this.hl, this.buffer, 128), i instanceof Uint8Array && i.byteLength > 63) {
      for (let g = 0; g < 8; g++) n(i, 8 * g + A, this.hh[g], this.hl[g]);
      return i;
    }
    const I = new Uint8Array(64);
    for (let g = 0; g < 8; g++) n(I, 8 * g, this.hh[g], this.hl[g]);
    return typeof i == "string" ? o.toString(I, i) : I;
  };
  function n(i, A, I, g) {
    i[A] = I >> 24 & 255, i[A + 1] = I >> 16 & 255, i[A + 2] = I >> 8 & 255, i[A + 3] = I & 255, i[A + 4] = g >> 24 & 255, i[A + 5] = g >> 16 & 255, i[A + 6] = g >> 8 & 255, i[A + 7] = g & 255;
  }
  function r(i, A) {
    var I = o.from(i, A);
    return [I, I.byteLength];
  }
  function e(i, A, I, g) {
    for (var y = new Int32Array(16), c = new Int32Array(16), u, w, K, F, D, x, U, t, Q, P, b, v, T, Z, O, j, W, $, tt, k, d, _, Y, m, L, H, At = i[0], q = i[1], J = i[2], et = i[3], z = i[4], E = i[5], ft = i[6], nt = i[7], it = A[0], It = A[1], at = A[2], B = A[3], l = A[4], S = A[5], R = A[6], p = A[7], M = 0; g >= 128; ) {
      for (tt = 0; tt < 16; tt++)
        k = 8 * tt + M, y[tt] = I[k + 0] << 24 | I[k + 1] << 16 | I[k + 2] << 8 | I[k + 3], c[tt] = I[k + 4] << 24 | I[k + 5] << 16 | I[k + 6] << 8 | I[k + 7];
      for (tt = 0; tt < 80; tt++)
        if (u = At, w = q, K = J, F = et, D = z, x = E, U = ft, t = nt, Q = it, P = It, b = at, v = B, T = l, Z = S, O = R, j = p, d = nt, _ = p, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = (z >>> 14 | l << 18) ^ (z >>> 18 | l << 14) ^ (l >>> 9 | z << 23), _ = (l >>> 14 | z << 18) ^ (l >>> 18 | z << 14) ^ (z >>> 9 | l << 23), Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, d = z & E ^ ~z & ft, _ = l & S ^ ~l & R, Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, d = C[tt * 2], _ = C[tt * 2 + 1], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, d = y[tt % 16], _ = c[tt % 16], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, W = L & 65535 | H << 16, $ = Y & 65535 | m << 16, d = W, _ = $, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = (At >>> 28 | it << 4) ^ (it >>> 2 | At << 30) ^ (it >>> 7 | At << 25), _ = (it >>> 28 | At << 4) ^ (At >>> 2 | it << 30) ^ (At >>> 7 | it << 25), Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, d = At & q ^ At & J ^ q & J, _ = it & It ^ it & at ^ It & at, Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, t = L & 65535 | H << 16, j = Y & 65535 | m << 16, d = F, _ = v, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = W, _ = $, Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, F = L & 65535 | H << 16, v = Y & 65535 | m << 16, q = u, J = w, et = K, z = F, E = D, ft = x, nt = U, At = t, It = Q, at = P, B = b, l = v, S = T, R = Z, p = O, it = j, tt % 16 === 15)
          for (k = 0; k < 16; k++)
            d = y[k], _ = c[k], Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = y[(k + 9) % 16], _ = c[(k + 9) % 16], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, W = y[(k + 1) % 16], $ = c[(k + 1) % 16], d = (W >>> 1 | $ << 31) ^ (W >>> 8 | $ << 24) ^ W >>> 7, _ = ($ >>> 1 | W << 31) ^ ($ >>> 8 | W << 24) ^ ($ >>> 7 | W << 25), Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, W = y[(k + 14) % 16], $ = c[(k + 14) % 16], d = (W >>> 19 | $ << 13) ^ ($ >>> 29 | W << 3) ^ W >>> 6, _ = ($ >>> 19 | W << 13) ^ (W >>> 29 | $ << 3) ^ ($ >>> 6 | W << 26), Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, y[k] = L & 65535 | H << 16, c[k] = Y & 65535 | m << 16;
      d = At, _ = it, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[0], _ = A[0], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[0] = At = L & 65535 | H << 16, A[0] = it = Y & 65535 | m << 16, d = q, _ = It, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[1], _ = A[1], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[1] = q = L & 65535 | H << 16, A[1] = It = Y & 65535 | m << 16, d = J, _ = at, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[2], _ = A[2], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[2] = J = L & 65535 | H << 16, A[2] = at = Y & 65535 | m << 16, d = et, _ = B, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[3], _ = A[3], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[3] = et = L & 65535 | H << 16, A[3] = B = Y & 65535 | m << 16, d = z, _ = l, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[4], _ = A[4], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[4] = z = L & 65535 | H << 16, A[4] = l = Y & 65535 | m << 16, d = E, _ = S, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[5], _ = A[5], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[5] = E = L & 65535 | H << 16, A[5] = S = Y & 65535 | m << 16, d = ft, _ = R, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[6], _ = A[6], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[6] = ft = L & 65535 | H << 16, A[6] = R = Y & 65535 | m << 16, d = nt, _ = p, Y = _ & 65535, m = _ >>> 16, L = d & 65535, H = d >>> 16, d = i[7], _ = A[7], Y += _ & 65535, m += _ >>> 16, L += d & 65535, H += d >>> 16, m += Y >>> 16, L += m >>> 16, H += L >>> 16, i[7] = nt = L & 65535 | H << 16, A[7] = p = Y & 65535 | m << 16, M += 128, g -= 128;
    }
  }
  function f(i) {
    if (!(this instanceof f)) return new f(i);
    this.pad = o.alloc(128), this.inner = s(), this.outer = s();
    const A = o.alloc(64);
    i.byteLength > 128 && (s().update(i).digest(A), i = A), this.pad.fill(54);
    for (let I = 0; I < i.byteLength; I++)
      this.pad[I] ^= i[I];
    this.inner.update(this.pad), this.pad.fill(92);
    for (let I = 0; I < i.byteLength; I++)
      this.pad[I] ^= i[I];
    this.outer.update(this.pad), this.pad.fill(0), A.fill(0);
  }
  return f.prototype.update = function(i, A) {
    return this.inner.update(i, A), this;
  }, f.prototype.digest = function(i, A = 0) {
    return this.outer.update(this.inner.digest()), this.outer.digest(i, A);
  }, s.HMAC = f, Vt;
}
var Ut = { exports: {} }, Jt, vA;
function me() {
  if (vA) return Jt;
  vA = 1;
  var h = (n, r) => function() {
    return r || (0, n[Object.keys(n)[0]])((r = { exports: {} }).exports, r), r.exports;
  }, o = /* @__PURE__ */ (() => {
    for (var n = new Uint8Array(128), r = 0; r < 64; r++)
      n[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (e) => {
      for (var f = e.length, i = new Uint8Array((f - (e[f - 1] == "=") - (e[f - 2] == "=")) * 3 / 4 | 0), A = 0, I = 0; A < f; ) {
        var g = n[e.charCodeAt(A++)], y = n[e.charCodeAt(A++)], c = n[e.charCodeAt(A++)], u = n[e.charCodeAt(A++)];
        i[I++] = g << 2 | y >> 4, i[I++] = y << 4 | c >> 2, i[I++] = c << 6 | u;
      }
      return i;
    };
  })(), a = h({
    "wasm-binary:./sha512.wat"(n, r) {
      r.exports = o("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");
    }
  }), C = a(), s = new WebAssembly.Module(C);
  return Jt = (n) => new WebAssembly.Instance(s, n).exports, Jt;
}
var TA;
function Fe() {
  if (TA) return Ut.exports;
  TA = 1;
  const h = ct(), o = St(), a = typeof WebAssembly < "u" && me()({
    imports: {
      debug: {
        log(...c) {
          console.log(...c.map((u) => (u >>> 0).toString(16).padStart(8, "0")));
        },
        log_tee(c) {
          return console.log((c >>> 0).toString(16).padStart(8, "0")), c;
        }
      }
    }
  });
  let C = 0;
  const s = [];
  Ut.exports = i;
  const n = Ut.exports.SHA512_BYTES = 64, r = 80, e = 216, f = 128;
  function i() {
    if (!(this instanceof i)) return new i();
    if (!a) throw new Error("WASM not loaded. Wait for Sha512.ready(cb)");
    s.length || (s.push(C), C += e), this.finalized = !1, this.digestLength = n, this.pointer = s.pop(), this.pos = 0, this.wasm = a, this._memory = new Uint8Array(a.memory.buffer), this._memory.fill(0, this.pointer, this.pointer + e), this.pointer + this.digestLength > this._memory.length && this._realloc(this.pointer + e);
  }
  i.prototype._realloc = function(c) {
    a.memory.grow(Math.max(0, Math.ceil(Math.abs(c - this._memory.length) / 65536))), this._memory = new Uint8Array(a.memory.buffer);
  }, i.prototype.update = function(c, u) {
    h(this.finalized === !1, "Hash instance finalized"), C % 8 !== 0 && (C += 8 - C % 8), h(C % 8 === 0, "input should be aligned for int64");
    const [w, K] = g(c, u);
    return h(w instanceof Uint8Array, "input must be Uint8Array or Buffer"), C + c.length > this._memory.length && this._realloc(C + c.length), this._memory.fill(0, C, C + y(K, f) - f), this._memory.set(w.subarray(0, f - this.pos), this.pointer + r + this.pos), this._memory.set(w.subarray(f - this.pos), C), this.pos = this.pos + K & 127, a.sha512(this.pointer, C, K, 0), this;
  }, i.prototype.digest = function(c, u = 0) {
    h(this.finalized === !1, "Hash instance finalized"), this.finalized = !0, s.push(this.pointer);
    const w = this.pointer + r + this.pos;
    this._memory.fill(0, w, this.pointer + r + f), a.sha512(this.pointer, C, 0, 1);
    const K = this._memory.subarray(this.pointer, this.pointer + this.digestLength);
    if (!c)
      return K;
    if (typeof c == "string")
      return o.toString(K, c);
    h(c instanceof Uint8Array, "output must be Uint8Array or Buffer"), h(
      c.byteLength >= this.digestLength + u,
      "output must have at least 'SHA512_BYTES' bytes remaining"
    );
    for (let F = 0; F < this.digestLength; F++)
      c[F + u] = K[F];
    return c;
  }, i.WASM = a, i.WASM_SUPPORTED = typeof WebAssembly < "u", i.ready = function(c) {
    return c || (c = I), a ? (c(), Promise.resolve()) : c(new Error("WebAssembly not supported"));
  }, i.prototype.ready = i.ready;
  function A(c) {
    if (!(this instanceof A)) return new A(c);
    this.pad = o.alloc(128), this.inner = i(), this.outer = i();
    const u = o.alloc(64);
    c.byteLength > 128 && (i().update(c).digest(u), c = u), this.pad.fill(54);
    for (let w = 0; w < c.byteLength; w++)
      this.pad[w] ^= c[w];
    this.inner.update(this.pad), this.pad.fill(92);
    for (let w = 0; w < c.byteLength; w++)
      this.pad[w] ^= c[w];
    this.outer.update(this.pad), this.pad.fill(0), u.fill(0);
  }
  A.prototype.update = function(c, u) {
    return this.inner.update(c, u), this;
  }, A.prototype.digest = function(c, u = 0) {
    return this.outer.update(this.inner.digest()), this.outer.digest(c, u);
  }, i.HMAC = A;
  function I() {
  }
  function g(c, u) {
    var w = o.from(c, u);
    return [w, w.byteLength];
  }
  function y(c, u) {
    return c + u - 1 & -u;
  }
  return Ut.exports;
}
var NA;
function _e() {
  if (NA) return Qt.exports;
  NA = 1;
  const h = Le(), o = Fe();
  var a = h;
  return Qt.exports = function() {
    return new a();
  }, Qt.exports.ready = function(C) {
    o.ready(function() {
      C();
    });
  }, Qt.exports.WASM_SUPPORTED = o.SUPPORTED, Qt.exports.WASM_LOADED = !1, Qt.exports.SHA512_BYTES = 64, o.ready(function(C) {
    C || (Qt.exports.WASM_LOADED = !0, Qt.exports = a = o);
  }), Qt.exports;
}
var kt, HA;
function Ke() {
  if (HA) return kt;
  HA = 1;
  const { crypto_verify_32: h } = wt(), o = _e(), a = ct(), C = 32, s = 32;
  function n(e, f, i) {
    a(e.byteLength === C, "out should be 'crypto_auth_BYTES' in length"), a(i.byteLength === s, "key should be 'crypto_auth_KEYBYTES' in length");
    const A = new Uint8Array(64), I = o.HMAC(i);
    I.update(f), I.digest(A), e.set(A.subarray(0, 32));
  }
  function r(e, f, i) {
    a(e.byteLength === C, "h should be 'crypto_auth_BYTES' in length"), a(i.byteLength === s, "key should be 'crypto_auth_KEYBYTES' in length");
    const A = o.HMAC(i).update(f).digest();
    return h(e, 0, A, 0);
  }
  return kt = {
    crypto_auth_BYTES: C,
    crypto_auth_KEYBYTES: s,
    crypto_auth: n,
    crypto_auth_verify: r
  }, kt;
}
var jt, GA;
function Lt() {
  if (GA) return jt;
  GA = 1;
  const h = _e(), o = ct();
  if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  const a = 64, C = a;
  function s(r, e, f) {
    return o(r.byteLength === a, "out must be 'crypto_hash_sha512_BYTES' bytes long"), h().update(e.subarray(0, f)).digest(r), 0;
  }
  function n(r, e, f) {
    return s(r, e, f);
  }
  return jt = {
    crypto_hash: n,
    crypto_hash_sha512: s,
    crypto_hash_sha512_BYTES: a,
    crypto_hash_BYTES: C
  }, jt;
}
var Xt, RA;
function le() {
  if (RA) return Xt;
  if (RA = 1, new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  var h = function(D) {
    var x, U = new Float64Array(16);
    if (D) for (x = 0; x < D.length; x++) U[x] = D[x];
    return U;
  }, o = new Uint8Array(32);
  o[0] = 9;
  var a = h(), C = h([1]), s = h([56129, 1]), n = h([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), r = h([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), e = h([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), f = h([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), i = h([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
  function A(D, x, U) {
    for (var t = 0; t < 16; t++) D[t] = x[t] + U[t];
  }
  function I(D, x, U) {
    for (var t = 0; t < 16; t++) D[t] = x[t] - U[t];
  }
  function g(D, x, U) {
    var t, Q, P = 0, b = 0, v = 0, T = 0, Z = 0, O = 0, j = 0, W = 0, $ = 0, tt = 0, k = 0, d = 0, _ = 0, Y = 0, m = 0, L = 0, H = 0, At = 0, q = 0, J = 0, et = 0, z = 0, E = 0, ft = 0, nt = 0, it = 0, It = 0, at = 0, B = 0, l = 0, S = 0, R = U[0], p = U[1], M = U[2], N = U[3], G = U[4], V = U[5], X = U[6], ot = U[7], rt = U[8], ht = U[9], st = U[10], gt = U[11], Et = U[12], Ct = U[13], yt = U[14], xt = U[15];
    t = x[0], P += t * R, b += t * p, v += t * M, T += t * N, Z += t * G, O += t * V, j += t * X, W += t * ot, $ += t * rt, tt += t * ht, k += t * st, d += t * gt, _ += t * Et, Y += t * Ct, m += t * yt, L += t * xt, t = x[1], b += t * R, v += t * p, T += t * M, Z += t * N, O += t * G, j += t * V, W += t * X, $ += t * ot, tt += t * rt, k += t * ht, d += t * st, _ += t * gt, Y += t * Et, m += t * Ct, L += t * yt, H += t * xt, t = x[2], v += t * R, T += t * p, Z += t * M, O += t * N, j += t * G, W += t * V, $ += t * X, tt += t * ot, k += t * rt, d += t * ht, _ += t * st, Y += t * gt, m += t * Et, L += t * Ct, H += t * yt, At += t * xt, t = x[3], T += t * R, Z += t * p, O += t * M, j += t * N, W += t * G, $ += t * V, tt += t * X, k += t * ot, d += t * rt, _ += t * ht, Y += t * st, m += t * gt, L += t * Et, H += t * Ct, At += t * yt, q += t * xt, t = x[4], Z += t * R, O += t * p, j += t * M, W += t * N, $ += t * G, tt += t * V, k += t * X, d += t * ot, _ += t * rt, Y += t * ht, m += t * st, L += t * gt, H += t * Et, At += t * Ct, q += t * yt, J += t * xt, t = x[5], O += t * R, j += t * p, W += t * M, $ += t * N, tt += t * G, k += t * V, d += t * X, _ += t * ot, Y += t * rt, m += t * ht, L += t * st, H += t * gt, At += t * Et, q += t * Ct, J += t * yt, et += t * xt, t = x[6], j += t * R, W += t * p, $ += t * M, tt += t * N, k += t * G, d += t * V, _ += t * X, Y += t * ot, m += t * rt, L += t * ht, H += t * st, At += t * gt, q += t * Et, J += t * Ct, et += t * yt, z += t * xt, t = x[7], W += t * R, $ += t * p, tt += t * M, k += t * N, d += t * G, _ += t * V, Y += t * X, m += t * ot, L += t * rt, H += t * ht, At += t * st, q += t * gt, J += t * Et, et += t * Ct, z += t * yt, E += t * xt, t = x[8], $ += t * R, tt += t * p, k += t * M, d += t * N, _ += t * G, Y += t * V, m += t * X, L += t * ot, H += t * rt, At += t * ht, q += t * st, J += t * gt, et += t * Et, z += t * Ct, E += t * yt, ft += t * xt, t = x[9], tt += t * R, k += t * p, d += t * M, _ += t * N, Y += t * G, m += t * V, L += t * X, H += t * ot, At += t * rt, q += t * ht, J += t * st, et += t * gt, z += t * Et, E += t * Ct, ft += t * yt, nt += t * xt, t = x[10], k += t * R, d += t * p, _ += t * M, Y += t * N, m += t * G, L += t * V, H += t * X, At += t * ot, q += t * rt, J += t * ht, et += t * st, z += t * gt, E += t * Et, ft += t * Ct, nt += t * yt, it += t * xt, t = x[11], d += t * R, _ += t * p, Y += t * M, m += t * N, L += t * G, H += t * V, At += t * X, q += t * ot, J += t * rt, et += t * ht, z += t * st, E += t * gt, ft += t * Et, nt += t * Ct, it += t * yt, It += t * xt, t = x[12], _ += t * R, Y += t * p, m += t * M, L += t * N, H += t * G, At += t * V, q += t * X, J += t * ot, et += t * rt, z += t * ht, E += t * st, ft += t * gt, nt += t * Et, it += t * Ct, It += t * yt, at += t * xt, t = x[13], Y += t * R, m += t * p, L += t * M, H += t * N, At += t * G, q += t * V, J += t * X, et += t * ot, z += t * rt, E += t * ht, ft += t * st, nt += t * gt, it += t * Et, It += t * Ct, at += t * yt, B += t * xt, t = x[14], m += t * R, L += t * p, H += t * M, At += t * N, q += t * G, J += t * V, et += t * X, z += t * ot, E += t * rt, ft += t * ht, nt += t * st, it += t * gt, It += t * Et, at += t * Ct, B += t * yt, l += t * xt, t = x[15], L += t * R, H += t * p, At += t * M, q += t * N, J += t * G, et += t * V, z += t * X, E += t * ot, ft += t * rt, nt += t * ht, it += t * st, It += t * gt, at += t * Et, B += t * Ct, l += t * yt, S += t * xt, P += 38 * H, b += 38 * At, v += 38 * q, T += 38 * J, Z += 38 * et, O += 38 * z, j += 38 * E, W += 38 * ft, $ += 38 * nt, tt += 38 * it, k += 38 * It, d += 38 * at, _ += 38 * B, Y += 38 * l, m += 38 * S, Q = 1, t = P + Q + 65535, Q = Math.floor(t / 65536), P = t - Q * 65536, t = b + Q + 65535, Q = Math.floor(t / 65536), b = t - Q * 65536, t = v + Q + 65535, Q = Math.floor(t / 65536), v = t - Q * 65536, t = T + Q + 65535, Q = Math.floor(t / 65536), T = t - Q * 65536, t = Z + Q + 65535, Q = Math.floor(t / 65536), Z = t - Q * 65536, t = O + Q + 65535, Q = Math.floor(t / 65536), O = t - Q * 65536, t = j + Q + 65535, Q = Math.floor(t / 65536), j = t - Q * 65536, t = W + Q + 65535, Q = Math.floor(t / 65536), W = t - Q * 65536, t = $ + Q + 65535, Q = Math.floor(t / 65536), $ = t - Q * 65536, t = tt + Q + 65535, Q = Math.floor(t / 65536), tt = t - Q * 65536, t = k + Q + 65535, Q = Math.floor(t / 65536), k = t - Q * 65536, t = d + Q + 65535, Q = Math.floor(t / 65536), d = t - Q * 65536, t = _ + Q + 65535, Q = Math.floor(t / 65536), _ = t - Q * 65536, t = Y + Q + 65535, Q = Math.floor(t / 65536), Y = t - Q * 65536, t = m + Q + 65535, Q = Math.floor(t / 65536), m = t - Q * 65536, t = L + Q + 65535, Q = Math.floor(t / 65536), L = t - Q * 65536, P += Q - 1 + 37 * (Q - 1), Q = 1, t = P + Q + 65535, Q = Math.floor(t / 65536), P = t - Q * 65536, t = b + Q + 65535, Q = Math.floor(t / 65536), b = t - Q * 65536, t = v + Q + 65535, Q = Math.floor(t / 65536), v = t - Q * 65536, t = T + Q + 65535, Q = Math.floor(t / 65536), T = t - Q * 65536, t = Z + Q + 65535, Q = Math.floor(t / 65536), Z = t - Q * 65536, t = O + Q + 65535, Q = Math.floor(t / 65536), O = t - Q * 65536, t = j + Q + 65535, Q = Math.floor(t / 65536), j = t - Q * 65536, t = W + Q + 65535, Q = Math.floor(t / 65536), W = t - Q * 65536, t = $ + Q + 65535, Q = Math.floor(t / 65536), $ = t - Q * 65536, t = tt + Q + 65535, Q = Math.floor(t / 65536), tt = t - Q * 65536, t = k + Q + 65535, Q = Math.floor(t / 65536), k = t - Q * 65536, t = d + Q + 65535, Q = Math.floor(t / 65536), d = t - Q * 65536, t = _ + Q + 65535, Q = Math.floor(t / 65536), _ = t - Q * 65536, t = Y + Q + 65535, Q = Math.floor(t / 65536), Y = t - Q * 65536, t = m + Q + 65535, Q = Math.floor(t / 65536), m = t - Q * 65536, t = L + Q + 65535, Q = Math.floor(t / 65536), L = t - Q * 65536, P += Q - 1 + 37 * (Q - 1), D[0] = P, D[1] = b, D[2] = v, D[3] = T, D[4] = Z, D[5] = O, D[6] = j, D[7] = W, D[8] = $, D[9] = tt, D[10] = k, D[11] = d, D[12] = _, D[13] = Y, D[14] = m, D[15] = L;
  }
  function y(D, x) {
    g(D, x, x);
  }
  function c(D, x, U) {
    for (var t, Q = ~(U - 1), P = 0; P < 16; P++)
      t = Q & (D[P] ^ x[P]), D[P] ^= t, x[P] ^= t;
  }
  function u(D, x) {
    var U, t, Q, P = h(), b = h();
    for (U = 0; U < 16; U++) b[U] = x[U];
    for (F(b), F(b), F(b), t = 0; t < 2; t++) {
      for (P[0] = b[0] - 65517, U = 1; U < 15; U++)
        P[U] = b[U] - 65535 - (P[U - 1] >> 16 & 1), P[U - 1] &= 65535;
      P[15] = b[15] - 32767 - (P[14] >> 16 & 1), Q = P[15] >> 16 & 1, P[14] &= 65535, c(b, P, 1 - Q);
    }
    for (U = 0; U < 16; U++)
      D[2 * U] = b[U] & 255, D[2 * U + 1] = b[U] >> 8;
  }
  function w(D, x) {
    var U;
    for (U = 0; U < 16; U++) D[U] = x[2 * U] + (x[2 * U + 1] << 8);
    D[15] &= 32767;
  }
  function K(D, x) {
    var U = h(), t;
    for (t = 0; t < 16; t++) U[t] = x[t];
    for (t = 253; t >= 0; t--)
      y(U, U), t !== 2 && t !== 4 && g(U, U, x);
    for (t = 0; t < 16; t++) D[t] = U[t];
  }
  function F(D) {
    var x, U, t = 1;
    for (x = 0; x < 16; x++)
      U = D[x] + t + 65535, t = Math.floor(U / 65536), D[x] = U - t * 65536;
    D[0] += t - 1 + 37 * (t - 1);
  }
  return Xt = {
    gf: h,
    A,
    Z: I,
    M: g,
    S: y,
    sel25519: c,
    pack25519: u,
    unpack25519: w,
    inv25519: K,
    gf0: a,
    gf1: C,
    _9: o,
    _121665: s,
    D: n,
    D2: r,
    X: e,
    Y: f,
    I: i
  }, Xt;
}
var zt, qA;
function mt() {
  if (qA) return zt;
  qA = 1;
  const { _9: h, _121665: o, gf: a, inv25519: C, pack25519: s, unpack25519: n, sel25519: r, A: e, M: f, Z: i, S: A } = le(), I = 32, g = 32;
  zt = {
    crypto_scalarmult: y,
    crypto_scalarmult_base: c,
    crypto_scalarmult_BYTES: I,
    crypto_scalarmult_SCALARBYTES: g
  };
  function y(w, K, F) {
    u(w, I), u(K, g), u(F, I);
    var D = new Uint8Array(32), x = new Float64Array(80), U, t, Q = a(), P = a(), b = a(), v = a(), T = a(), Z = a();
    for (t = 0; t < 31; t++) D[t] = K[t];
    for (D[31] = K[31] & 127 | 64, D[0] &= 248, n(x, F), t = 0; t < 16; t++)
      P[t] = x[t], v[t] = Q[t] = b[t] = 0;
    for (Q[0] = v[0] = 1, t = 254; t >= 0; --t)
      U = D[t >>> 3] >>> (t & 7) & 1, r(Q, P, U), r(b, v, U), e(T, Q, b), i(Q, Q, b), e(b, P, v), i(P, P, v), A(v, T), A(Z, Q), f(Q, b, Q), f(b, P, T), e(T, Q, b), i(Q, Q, b), A(P, Q), i(b, v, Z), f(Q, b, o), e(Q, Q, v), f(b, b, Q), f(Q, v, Z), f(v, P, x), A(P, T), r(Q, P, U), r(b, v, U);
    for (t = 0; t < 16; t++)
      x[t + 16] = Q[t], x[t + 32] = b[t], x[t + 48] = P[t], x[t + 64] = v[t];
    var O = x.subarray(32), j = x.subarray(16);
    return C(O, O), f(j, j, O), s(w, j), 0;
  }
  function c(w, K) {
    return y(w, K, h);
  }
  function u(w, K) {
    if (!w || w.length < K) throw new Error("Argument must be a buffer" + (" of length " + K));
  }
  return zt;
}
var Wt = { exports: {} }, Bt = { exports: {} }, ut = { exports: {} }, Zt, OA;
function ve() {
  if (OA) return Zt;
  OA = 1;
  var h = (n, r) => function() {
    return r || (0, n[Object.keys(n)[0]])((r = { exports: {} }).exports, r), r.exports;
  }, o = /* @__PURE__ */ (() => {
    for (var n = new Uint8Array(128), r = 0; r < 64; r++)
      n[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (e) => {
      for (var f = e.length, i = new Uint8Array((f - (e[f - 1] == "=") - (e[f - 2] == "=")) * 3 / 4 | 0), A = 0, I = 0; A < f; ) {
        var g = n[e.charCodeAt(A++)], y = n[e.charCodeAt(A++)], c = n[e.charCodeAt(A++)], u = n[e.charCodeAt(A++)];
        i[I++] = g << 2 | y >> 4, i[I++] = y << 4 | c >> 2, i[I++] = c << 6 | u;
      }
      return i;
    };
  })(), a = h({
    "wasm-binary:./blake2b.wat"(n, r) {
      r.exports = o("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");
    }
  }), C = a(), s = WebAssembly.compile(C);
  return Zt = async (n) => (await WebAssembly.instantiate(await s, n)).exports, Zt;
}
var PA;
function Te() {
  if (PA) return ut.exports;
  PA = 1;
  var h = ct(), o = St(), a = null, C = typeof WebAssembly < "u" && ve()().then((c) => {
    a = c;
  }), s = 64, n = [];
  ut.exports = g;
  var r = ut.exports.BYTES_MIN = 16, e = ut.exports.BYTES_MAX = 64;
  ut.exports.BYTES = 32;
  var f = ut.exports.KEYBYTES_MIN = 16, i = ut.exports.KEYBYTES_MAX = 64;
  ut.exports.KEYBYTES = 32;
  var A = ut.exports.SALTBYTES = 16, I = ut.exports.PERSONALBYTES = 16;
  function g(c, u, w, K, F) {
    if (!(this instanceof g)) return new g(c, u, w, K, F);
    if (!a) throw new Error("WASM not loaded. Wait for Blake2b.ready(cb)");
    c || (c = 32), F !== !0 && (h(c >= r, "digestLength must be at least " + r + ", was given " + c), h(c <= e, "digestLength must be at most " + e + ", was given " + c), u != null && (h(u instanceof Uint8Array, "key must be Uint8Array or Buffer"), h(u.length >= f, "key must be at least " + f + ", was given " + u.length), h(u.length <= i, "key must be at least " + i + ", was given " + u.length)), w != null && (h(w instanceof Uint8Array, "salt must be Uint8Array or Buffer"), h(w.length === A, "salt must be exactly " + A + ", was given " + w.length)), K != null && (h(K instanceof Uint8Array, "personal must be Uint8Array or Buffer"), h(K.length === I, "personal must be exactly " + I + ", was given " + K.length))), n.length || (n.push(s), s += 216), this.digestLength = c, this.finalized = !1, this.pointer = n.pop(), this._memory = new Uint8Array(a.memory.buffer), this._memory.fill(0, 0, 64), this._memory[0] = this.digestLength, this._memory[1] = u ? u.length : 0, this._memory[2] = 1, this._memory[3] = 1, w && this._memory.set(w, 32), K && this._memory.set(K, 48), this.pointer + 216 > this._memory.length && this._realloc(this.pointer + 216), a.blake2b_init(this.pointer, this.digestLength), u && (this.update(u), this._memory.fill(0, s, s + u.length), this._memory[this.pointer + 200] = 128);
  }
  g.prototype._realloc = function(c) {
    a.memory.grow(Math.max(0, Math.ceil(Math.abs(c - this._memory.length) / 65536))), this._memory = new Uint8Array(a.memory.buffer);
  }, g.prototype.update = function(c) {
    return h(this.finalized === !1, "Hash instance finalized"), h(c instanceof Uint8Array, "input must be Uint8Array or Buffer"), s + c.length > this._memory.length && this._realloc(s + c.length), this._memory.set(c, s), a.blake2b_update(this.pointer, s, s + c.length), this;
  }, g.prototype.digest = function(c) {
    if (h(this.finalized === !1, "Hash instance finalized"), this.finalized = !0, n.push(this.pointer), a.blake2b_final(this.pointer), !c || c === "binary")
      return this._memory.slice(this.pointer + 128, this.pointer + 128 + this.digestLength);
    if (typeof c == "string")
      return o.toString(this._memory, c, this.pointer + 128, this.pointer + 128 + this.digestLength);
    h(c instanceof Uint8Array && c.length >= this.digestLength, "input must be Uint8Array or Buffer");
    for (var u = 0; u < this.digestLength; u++)
      c[u] = this._memory[this.pointer + 128 + u];
    return c;
  }, g.prototype.final = g.prototype.digest, g.WASM = a, g.SUPPORTED = typeof WebAssembly < "u", g.ready = function(c) {
    return c || (c = y), C ? C.then(() => c(), c) : c(new Error("WebAssembly not supported"));
  }, g.prototype.ready = g.ready, g.prototype.getPartialHash = function() {
    return this._memory.slice(this.pointer, this.pointer + 216);
  }, g.prototype.setPartialHash = function(c) {
    this._memory.set(c, this.pointer);
  };
  function y() {
  }
  return ut.exports;
}
var VA;
function pe() {
  if (VA) return Bt.exports;
  VA = 1;
  var h = ct(), o = Te();
  function a(b, v, T) {
    var Z = b[v] + b[T], O = b[v + 1] + b[T + 1];
    Z >= 4294967296 && O++, b[v] = Z, b[v + 1] = O;
  }
  function C(b, v, T, Z) {
    var O = b[v] + T;
    T < 0 && (O += 4294967296);
    var j = b[v + 1] + Z;
    O >= 4294967296 && j++, b[v] = O, b[v + 1] = j;
  }
  function s(b, v) {
    return b[v] ^ b[v + 1] << 8 ^ b[v + 2] << 16 ^ b[v + 3] << 24;
  }
  function n(b, v, T, Z, O, j) {
    var W = A[O], $ = A[O + 1], tt = A[j], k = A[j + 1];
    a(i, b, v), C(i, b, W, $);
    var d = i[Z] ^ i[b], _ = i[Z + 1] ^ i[b + 1];
    i[Z] = _, i[Z + 1] = d, a(i, T, Z), d = i[v] ^ i[T], _ = i[v + 1] ^ i[T + 1], i[v] = d >>> 24 ^ _ << 8, i[v + 1] = _ >>> 24 ^ d << 8, a(i, b, v), C(i, b, tt, k), d = i[Z] ^ i[b], _ = i[Z + 1] ^ i[b + 1], i[Z] = d >>> 16 ^ _ << 16, i[Z + 1] = _ >>> 16 ^ d << 16, a(i, T, Z), d = i[v] ^ i[T], _ = i[v + 1] ^ i[T + 1], i[v] = _ >>> 31 ^ d << 1, i[v + 1] = d >>> 31 ^ _ << 1;
  }
  var r = new Uint32Array([
    4089235720,
    1779033703,
    2227873595,
    3144134277,
    4271175723,
    1013904242,
    1595750129,
    2773480762,
    2917565137,
    1359893119,
    725511199,
    2600822924,
    4215389547,
    528734635,
    327033209,
    1541459225
  ]), e = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9,
    12,
    5,
    1,
    15,
    14,
    13,
    4,
    10,
    0,
    7,
    6,
    3,
    9,
    2,
    8,
    11,
    13,
    11,
    7,
    14,
    12,
    1,
    3,
    9,
    5,
    0,
    15,
    4,
    8,
    6,
    2,
    10,
    6,
    15,
    14,
    9,
    11,
    3,
    0,
    8,
    12,
    2,
    13,
    7,
    1,
    4,
    10,
    5,
    10,
    2,
    8,
    4,
    7,
    6,
    1,
    5,
    15,
    11,
    9,
    14,
    3,
    12,
    13,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3
  ], f = new Uint8Array(e.map(function(b) {
    return b * 2;
  })), i = new Uint32Array(32), A = new Uint32Array(32);
  function I(b, v) {
    var T = 0;
    for (T = 0; T < 16; T++)
      i[T] = b.h[T], i[T + 16] = r[T];
    for (i[24] = i[24] ^ b.t, i[25] = i[25] ^ b.t / 4294967296, v && (i[28] = ~i[28], i[29] = ~i[29]), T = 0; T < 32; T++)
      A[T] = s(b.b, 4 * T);
    for (T = 0; T < 12; T++)
      n(0, 8, 16, 24, f[T * 16 + 0], f[T * 16 + 1]), n(2, 10, 18, 26, f[T * 16 + 2], f[T * 16 + 3]), n(4, 12, 20, 28, f[T * 16 + 4], f[T * 16 + 5]), n(6, 14, 22, 30, f[T * 16 + 6], f[T * 16 + 7]), n(0, 10, 20, 30, f[T * 16 + 8], f[T * 16 + 9]), n(2, 12, 22, 24, f[T * 16 + 10], f[T * 16 + 11]), n(4, 14, 16, 26, f[T * 16 + 12], f[T * 16 + 13]), n(6, 8, 18, 28, f[T * 16 + 14], f[T * 16 + 15]);
    for (T = 0; T < 16; T++)
      b.h[T] = b.h[T] ^ i[T] ^ i[T + 16];
  }
  var g = new Uint8Array([
    0,
    0,
    0,
    0,
    //  0: outlen, keylen, fanout, depth
    0,
    0,
    0,
    0,
    //  4: leaf length, sequential mode
    0,
    0,
    0,
    0,
    //  8: node offset
    0,
    0,
    0,
    0,
    // 12: node offset
    0,
    0,
    0,
    0,
    // 16: node depth, inner length, rfu
    0,
    0,
    0,
    0,
    // 20: rfu
    0,
    0,
    0,
    0,
    // 24: rfu
    0,
    0,
    0,
    0,
    // 28: rfu
    0,
    0,
    0,
    0,
    // 32: salt
    0,
    0,
    0,
    0,
    // 36: salt
    0,
    0,
    0,
    0,
    // 40: salt
    0,
    0,
    0,
    0,
    // 44: salt
    0,
    0,
    0,
    0,
    // 48: personal
    0,
    0,
    0,
    0,
    // 52: personal
    0,
    0,
    0,
    0,
    // 56: personal
    0,
    0,
    0,
    0
    // 60: personal
  ]);
  function y(b, v, T, Z) {
    g.fill(0), this.b = new Uint8Array(128), this.h = new Uint32Array(16), this.t = 0, this.c = 0, this.outlen = b, g[0] = b, v && (g[1] = v.length), g[2] = 1, g[3] = 1, T && g.set(T, 32), Z && g.set(Z, 48);
    for (var O = 0; O < 16; O++)
      this.h[O] = r[O] ^ s(g, O * 4);
    v && (c(this, v), this.c = 128);
  }
  y.prototype.update = function(b) {
    return h(b instanceof Uint8Array, "input must be Uint8Array or Buffer"), c(this, b), this;
  }, y.prototype.digest = function(b) {
    var v = !b || b === "binary" || b === "hex" ? new Uint8Array(this.outlen) : b;
    return h(v instanceof Uint8Array, 'out must be "binary", "hex", Uint8Array, or Buffer'), h(v.length >= this.outlen, "out must have at least outlen bytes of space"), u(this, v), b === "hex" ? w(v) : v;
  }, y.prototype.final = y.prototype.digest, y.ready = function(b) {
    o.ready(function() {
      b();
    });
  };
  function c(b, v) {
    for (var T = 0; T < v.length; T++)
      b.c === 128 && (b.t += b.c, I(b, !1), b.c = 0), b.b[b.c++] = v[T];
  }
  function u(b, v) {
    for (b.t += b.c; b.c < 128; )
      b.b[b.c++] = 0;
    I(b, !0);
    for (var T = 0; T < b.outlen; T++)
      v[T] = b.h[T >> 2] >> 8 * (T & 3);
    return v;
  }
  function w(b) {
    for (var v = "", T = 0; T < b.length; T++) v += K(b[T]);
    return v;
  }
  function K(b) {
    return b < 16 ? "0" + b.toString(16) : b.toString(16);
  }
  var F = y;
  Bt.exports = function(v, T, Z, O, j) {
    return j !== !0 && (h(v >= D, "outlen must be at least " + D + ", was given " + v), h(v <= x, "outlen must be at most " + x + ", was given " + v), T != null && (h(T instanceof Uint8Array, "key must be Uint8Array or Buffer"), h(T.length >= U, "key must be at least " + U + ", was given " + T.length), h(T.length <= t, "key must be at most " + t + ", was given " + T.length)), Z != null && (h(Z instanceof Uint8Array, "salt must be Uint8Array or Buffer"), h(Z.length === Q, "salt must be exactly " + Q + ", was given " + Z.length)), O != null && (h(O instanceof Uint8Array, "personal must be Uint8Array or Buffer"), h(O.length === P, "personal must be exactly " + P + ", was given " + O.length))), new F(v, T, Z, O);
  }, Bt.exports.ready = function(b) {
    o.ready(function() {
      b();
    });
  }, Bt.exports.WASM_SUPPORTED = o.SUPPORTED, Bt.exports.WASM_LOADED = !1;
  var D = Bt.exports.BYTES_MIN = 16, x = Bt.exports.BYTES_MAX = 64;
  Bt.exports.BYTES = 32;
  var U = Bt.exports.KEYBYTES_MIN = 16, t = Bt.exports.KEYBYTES_MAX = 64;
  Bt.exports.KEYBYTES = 32;
  var Q = Bt.exports.SALTBYTES = 16, P = Bt.exports.PERSONALBYTES = 16;
  return o.ready(function(b) {
    b || (Bt.exports.WASM_LOADED = !0, Bt.exports = o);
  }), Bt.exports;
}
var JA;
function QA() {
  return JA || (JA = 1, (function(h) {
    var o = pe();
    if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
    h.exports.crypto_generichash_PRIMITIVE = "blake2b", h.exports.crypto_generichash_BYTES_MIN = o.BYTES_MIN, h.exports.crypto_generichash_BYTES_MAX = o.BYTES_MAX, h.exports.crypto_generichash_BYTES = o.BYTES, h.exports.crypto_generichash_KEYBYTES_MIN = o.KEYBYTES_MIN, h.exports.crypto_generichash_KEYBYTES_MAX = o.KEYBYTES_MAX, h.exports.crypto_generichash_KEYBYTES = o.KEYBYTES, h.exports.crypto_generichash_WASM_SUPPORTED = o.WASM_SUPPORTED, h.exports.crypto_generichash_WASM_LOADED = !1, h.exports.crypto_generichash = function(a, C, s) {
      o(a.length, s).update(C).final(a);
    }, h.exports.crypto_generichash_ready = o.ready, h.exports.crypto_generichash_batch = function(a, C, s) {
      for (var n = o(a.length, s), r = 0; r < C.length; r++)
        n.update(C[r]);
      n.final(a);
    }, h.exports.crypto_generichash_instance = function(a, C) {
      return C == null && (C = h.exports.crypto_generichash_BYTES), o(C, a);
    }, o.ready(function(a) {
      h.exports.crypto_generichash_WASM_LOADED = o.WASM_LOADED;
    });
  })(Wt)), Wt.exports;
}
var $t = {}, tA, kA;
function Ne() {
  if (kA) return tA;
  kA = 1;
  var h = (n, r) => function() {
    return r || (0, n[Object.keys(n)[0]])((r = { exports: {} }).exports, r), r.exports;
  }, o = /* @__PURE__ */ (() => {
    for (var n = new Uint8Array(128), r = 0; r < 64; r++)
      n[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (e) => {
      for (var f = e.length, i = new Uint8Array((f - (e[f - 1] == "=") - (e[f - 2] == "=")) * 3 / 4 | 0), A = 0, I = 0; A < f; ) {
        var g = n[e.charCodeAt(A++)], y = n[e.charCodeAt(A++)], c = n[e.charCodeAt(A++)], u = n[e.charCodeAt(A++)];
        i[I++] = g << 2 | y >> 4, i[I++] = y << 4 | c >> 2, i[I++] = c << 6 | u;
      }
      return i;
    };
  })(), a = h({
    "wasm-binary:./xsalsa20.wat"(n, r) {
      r.exports = o("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");
    }
  }), C = a(), s = new WebAssembly.Module(C);
  return tA = (n) => new WebAssembly.Instance(s, n).exports, tA;
}
var AA, jA;
function be() {
  if (jA) return AA;
  jA = 1;
  var h = typeof WebAssembly < "u" && Ne()(), o = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]), a = 144, C = a, s = [];
  AA = n, n.NONCEBYTES = 24, n.KEYBYTES = 32, n.core_hsalsa20 = i, n.SIGMA = o;
  function n(A, I) {
    if (!(this instanceof n)) return new n(A, I);
    if (!A || A.length < 24) throw new Error("nonce must be at least 24 bytes");
    if (!I || I.length < 32) throw new Error("key must be at least 32 bytes");
    this._xor = h ? new r(A, I) : new e(A, I);
  }
  n.prototype.update = function(A, I) {
    if (!A) throw new Error("input must be Uint8Array or Buffer");
    return I || (I = new Uint8Array(A.length)), A.length && this._xor.update(A, I), I;
  }, n.prototype.final = n.prototype.finalize = function() {
    this._xor.finalize(), this._xor = null;
  };
  function r(A, I) {
    s.length || (s.push(a), a += 64), this._pointer = s.pop(), this._nonce = this._pointer + 8, this._key = this._nonce + 24, this._overflow = 0, this._memory = new Uint8Array(h.memory.buffer), this._memory.fill(0, this._pointer, this._pointer + 8), this._memory.set(A, this._nonce), this._memory.set(I, this._key);
  }
  r.prototype.realloc = function(A) {
    h.memory.grow(Math.ceil(Math.abs(A - this._memory.length) / 65536)), this._memory = new Uint8Array(h.memory.buffer);
  }, r.prototype.update = function(A, I) {
    var g = this._overflow + A.length, y = a + this._overflow;
    C = a + g, C >= this._memory.length && this.realloc(C), this._memory.set(A, y), h.xsalsa20_xor(this._pointer, a, a, g, this._nonce, this._key), I.set(this._memory.subarray(y, a + g)), this._overflow = g & 63;
  }, r.prototype.finalize = function() {
    this._memory.fill(0, this._pointer, this._key + 32), C > a && (this._memory.fill(0, a, C), C = 0), s.push(this._pointer);
  };
  function e(A, I) {
    this._s = new Uint8Array(32), this._z = new Uint8Array(16), this._overflow = 0, i(this._s, A, I, o);
    for (var g = 0; g < 8; g++) this._z[g] = A[g + 16];
  }
  e.prototype.update = function(A, I) {
    for (var g = new Uint8Array(64), y = 0, c = this._overflow, u = A.length + this._overflow, w = this._z, K = -this._overflow, F = -this._overflow; u >= 64; ) {
      for (f(g, w, this._s, o); c < 64; c++) I[F + c] = A[K + c] ^ g[c];
      for (y = 1, c = 8; c < 16; c++)
        y += w[c] & 255 | 0, w[c] = y & 255, y >>>= 8;
      u -= 64, F += 64, K += 64, c = 0;
    }
    if (u > 0)
      for (f(g, w, this._s, o); c < u; c++) I[F + c] = A[K + c] ^ g[c];
    this._overflow = u & 63;
  }, e.prototype.finalize = function() {
    this._s.fill(0), this._z.fill(0);
  };
  function f(A, I, g, y) {
    for (var c = y[0] & 255 | (y[1] & 255) << 8 | (y[2] & 255) << 16 | (y[3] & 255) << 24, u = g[0] & 255 | (g[1] & 255) << 8 | (g[2] & 255) << 16 | (g[3] & 255) << 24, w = g[4] & 255 | (g[5] & 255) << 8 | (g[6] & 255) << 16 | (g[7] & 255) << 24, K = g[8] & 255 | (g[9] & 255) << 8 | (g[10] & 255) << 16 | (g[11] & 255) << 24, F = g[12] & 255 | (g[13] & 255) << 8 | (g[14] & 255) << 16 | (g[15] & 255) << 24, D = y[4] & 255 | (y[5] & 255) << 8 | (y[6] & 255) << 16 | (y[7] & 255) << 24, x = I[0] & 255 | (I[1] & 255) << 8 | (I[2] & 255) << 16 | (I[3] & 255) << 24, U = I[4] & 255 | (I[5] & 255) << 8 | (I[6] & 255) << 16 | (I[7] & 255) << 24, t = I[8] & 255 | (I[9] & 255) << 8 | (I[10] & 255) << 16 | (I[11] & 255) << 24, Q = I[12] & 255 | (I[13] & 255) << 8 | (I[14] & 255) << 16 | (I[15] & 255) << 24, P = y[8] & 255 | (y[9] & 255) << 8 | (y[10] & 255) << 16 | (y[11] & 255) << 24, b = g[16] & 255 | (g[17] & 255) << 8 | (g[18] & 255) << 16 | (g[19] & 255) << 24, v = g[20] & 255 | (g[21] & 255) << 8 | (g[22] & 255) << 16 | (g[23] & 255) << 24, T = g[24] & 255 | (g[25] & 255) << 8 | (g[26] & 255) << 16 | (g[27] & 255) << 24, Z = g[28] & 255 | (g[29] & 255) << 8 | (g[30] & 255) << 16 | (g[31] & 255) << 24, O = y[12] & 255 | (y[13] & 255) << 8 | (y[14] & 255) << 16 | (y[15] & 255) << 24, j = c, W = u, $ = w, tt = K, k = F, d = D, _ = x, Y = U, m = t, L = Q, H = P, At = b, q = v, J = T, et = Z, z = O, E, ft = 0; ft < 20; ft += 2)
      E = j + q | 0, k ^= E << 7 | E >>> 25, E = k + j | 0, m ^= E << 9 | E >>> 23, E = m + k | 0, q ^= E << 13 | E >>> 19, E = q + m | 0, j ^= E << 18 | E >>> 14, E = d + W | 0, L ^= E << 7 | E >>> 25, E = L + d | 0, J ^= E << 9 | E >>> 23, E = J + L | 0, W ^= E << 13 | E >>> 19, E = W + J | 0, d ^= E << 18 | E >>> 14, E = H + _ | 0, et ^= E << 7 | E >>> 25, E = et + H | 0, $ ^= E << 9 | E >>> 23, E = $ + et | 0, _ ^= E << 13 | E >>> 19, E = _ + $ | 0, H ^= E << 18 | E >>> 14, E = z + At | 0, tt ^= E << 7 | E >>> 25, E = tt + z | 0, Y ^= E << 9 | E >>> 23, E = Y + tt | 0, At ^= E << 13 | E >>> 19, E = At + Y | 0, z ^= E << 18 | E >>> 14, E = j + tt | 0, W ^= E << 7 | E >>> 25, E = W + j | 0, $ ^= E << 9 | E >>> 23, E = $ + W | 0, tt ^= E << 13 | E >>> 19, E = tt + $ | 0, j ^= E << 18 | E >>> 14, E = d + k | 0, _ ^= E << 7 | E >>> 25, E = _ + d | 0, Y ^= E << 9 | E >>> 23, E = Y + _ | 0, k ^= E << 13 | E >>> 19, E = k + Y | 0, d ^= E << 18 | E >>> 14, E = H + L | 0, At ^= E << 7 | E >>> 25, E = At + H | 0, m ^= E << 9 | E >>> 23, E = m + At | 0, L ^= E << 13 | E >>> 19, E = L + m | 0, H ^= E << 18 | E >>> 14, E = z + et | 0, q ^= E << 7 | E >>> 25, E = q + z | 0, J ^= E << 9 | E >>> 23, E = J + q | 0, et ^= E << 13 | E >>> 19, E = et + J | 0, z ^= E << 18 | E >>> 14;
    j = j + c | 0, W = W + u | 0, $ = $ + w | 0, tt = tt + K | 0, k = k + F | 0, d = d + D | 0, _ = _ + x | 0, Y = Y + U | 0, m = m + t | 0, L = L + Q | 0, H = H + P | 0, At = At + b | 0, q = q + v | 0, J = J + T | 0, et = et + Z | 0, z = z + O | 0, A[0] = j >>> 0 & 255, A[1] = j >>> 8 & 255, A[2] = j >>> 16 & 255, A[3] = j >>> 24 & 255, A[4] = W >>> 0 & 255, A[5] = W >>> 8 & 255, A[6] = W >>> 16 & 255, A[7] = W >>> 24 & 255, A[8] = $ >>> 0 & 255, A[9] = $ >>> 8 & 255, A[10] = $ >>> 16 & 255, A[11] = $ >>> 24 & 255, A[12] = tt >>> 0 & 255, A[13] = tt >>> 8 & 255, A[14] = tt >>> 16 & 255, A[15] = tt >>> 24 & 255, A[16] = k >>> 0 & 255, A[17] = k >>> 8 & 255, A[18] = k >>> 16 & 255, A[19] = k >>> 24 & 255, A[20] = d >>> 0 & 255, A[21] = d >>> 8 & 255, A[22] = d >>> 16 & 255, A[23] = d >>> 24 & 255, A[24] = _ >>> 0 & 255, A[25] = _ >>> 8 & 255, A[26] = _ >>> 16 & 255, A[27] = _ >>> 24 & 255, A[28] = Y >>> 0 & 255, A[29] = Y >>> 8 & 255, A[30] = Y >>> 16 & 255, A[31] = Y >>> 24 & 255, A[32] = m >>> 0 & 255, A[33] = m >>> 8 & 255, A[34] = m >>> 16 & 255, A[35] = m >>> 24 & 255, A[36] = L >>> 0 & 255, A[37] = L >>> 8 & 255, A[38] = L >>> 16 & 255, A[39] = L >>> 24 & 255, A[40] = H >>> 0 & 255, A[41] = H >>> 8 & 255, A[42] = H >>> 16 & 255, A[43] = H >>> 24 & 255, A[44] = At >>> 0 & 255, A[45] = At >>> 8 & 255, A[46] = At >>> 16 & 255, A[47] = At >>> 24 & 255, A[48] = q >>> 0 & 255, A[49] = q >>> 8 & 255, A[50] = q >>> 16 & 255, A[51] = q >>> 24 & 255, A[52] = J >>> 0 & 255, A[53] = J >>> 8 & 255, A[54] = J >>> 16 & 255, A[55] = J >>> 24 & 255, A[56] = et >>> 0 & 255, A[57] = et >>> 8 & 255, A[58] = et >>> 16 & 255, A[59] = et >>> 24 & 255, A[60] = z >>> 0 & 255, A[61] = z >>> 8 & 255, A[62] = z >>> 16 & 255, A[63] = z >>> 24 & 255;
  }
  function i(A, I, g, y) {
    for (var c = y[0] & 255 | (y[1] & 255) << 8 | (y[2] & 255) << 16 | (y[3] & 255) << 24, u = g[0] & 255 | (g[1] & 255) << 8 | (g[2] & 255) << 16 | (g[3] & 255) << 24, w = g[4] & 255 | (g[5] & 255) << 8 | (g[6] & 255) << 16 | (g[7] & 255) << 24, K = g[8] & 255 | (g[9] & 255) << 8 | (g[10] & 255) << 16 | (g[11] & 255) << 24, F = g[12] & 255 | (g[13] & 255) << 8 | (g[14] & 255) << 16 | (g[15] & 255) << 24, D = y[4] & 255 | (y[5] & 255) << 8 | (y[6] & 255) << 16 | (y[7] & 255) << 24, x = I[0] & 255 | (I[1] & 255) << 8 | (I[2] & 255) << 16 | (I[3] & 255) << 24, U = I[4] & 255 | (I[5] & 255) << 8 | (I[6] & 255) << 16 | (I[7] & 255) << 24, t = I[8] & 255 | (I[9] & 255) << 8 | (I[10] & 255) << 16 | (I[11] & 255) << 24, Q = I[12] & 255 | (I[13] & 255) << 8 | (I[14] & 255) << 16 | (I[15] & 255) << 24, P = y[8] & 255 | (y[9] & 255) << 8 | (y[10] & 255) << 16 | (y[11] & 255) << 24, b = g[16] & 255 | (g[17] & 255) << 8 | (g[18] & 255) << 16 | (g[19] & 255) << 24, v = g[20] & 255 | (g[21] & 255) << 8 | (g[22] & 255) << 16 | (g[23] & 255) << 24, T = g[24] & 255 | (g[25] & 255) << 8 | (g[26] & 255) << 16 | (g[27] & 255) << 24, Z = g[28] & 255 | (g[29] & 255) << 8 | (g[30] & 255) << 16 | (g[31] & 255) << 24, O = y[12] & 255 | (y[13] & 255) << 8 | (y[14] & 255) << 16 | (y[15] & 255) << 24, j = c, W = u, $ = w, tt = K, k = F, d = D, _ = x, Y = U, m = t, L = Q, H = P, At = b, q = v, J = T, et = Z, z = O, E, ft = 0; ft < 20; ft += 2)
      E = j + q | 0, k ^= E << 7 | E >>> 25, E = k + j | 0, m ^= E << 9 | E >>> 23, E = m + k | 0, q ^= E << 13 | E >>> 19, E = q + m | 0, j ^= E << 18 | E >>> 14, E = d + W | 0, L ^= E << 7 | E >>> 25, E = L + d | 0, J ^= E << 9 | E >>> 23, E = J + L | 0, W ^= E << 13 | E >>> 19, E = W + J | 0, d ^= E << 18 | E >>> 14, E = H + _ | 0, et ^= E << 7 | E >>> 25, E = et + H | 0, $ ^= E << 9 | E >>> 23, E = $ + et | 0, _ ^= E << 13 | E >>> 19, E = _ + $ | 0, H ^= E << 18 | E >>> 14, E = z + At | 0, tt ^= E << 7 | E >>> 25, E = tt + z | 0, Y ^= E << 9 | E >>> 23, E = Y + tt | 0, At ^= E << 13 | E >>> 19, E = At + Y | 0, z ^= E << 18 | E >>> 14, E = j + tt | 0, W ^= E << 7 | E >>> 25, E = W + j | 0, $ ^= E << 9 | E >>> 23, E = $ + W | 0, tt ^= E << 13 | E >>> 19, E = tt + $ | 0, j ^= E << 18 | E >>> 14, E = d + k | 0, _ ^= E << 7 | E >>> 25, E = _ + d | 0, Y ^= E << 9 | E >>> 23, E = Y + _ | 0, k ^= E << 13 | E >>> 19, E = k + Y | 0, d ^= E << 18 | E >>> 14, E = H + L | 0, At ^= E << 7 | E >>> 25, E = At + H | 0, m ^= E << 9 | E >>> 23, E = m + At | 0, L ^= E << 13 | E >>> 19, E = L + m | 0, H ^= E << 18 | E >>> 14, E = z + et | 0, q ^= E << 7 | E >>> 25, E = q + z | 0, J ^= E << 9 | E >>> 23, E = J + q | 0, et ^= E << 13 | E >>> 19, E = et + J | 0, z ^= E << 18 | E >>> 14;
    A[0] = j >>> 0 & 255, A[1] = j >>> 8 & 255, A[2] = j >>> 16 & 255, A[3] = j >>> 24 & 255, A[4] = d >>> 0 & 255, A[5] = d >>> 8 & 255, A[6] = d >>> 16 & 255, A[7] = d >>> 24 & 255, A[8] = H >>> 0 & 255, A[9] = H >>> 8 & 255, A[10] = H >>> 16 & 255, A[11] = H >>> 24 & 255, A[12] = z >>> 0 & 255, A[13] = z >>> 8 & 255, A[14] = z >>> 16 & 255, A[15] = z >>> 24 & 255, A[16] = _ >>> 0 & 255, A[17] = _ >>> 8 & 255, A[18] = _ >>> 16 & 255, A[19] = _ >>> 24 & 255, A[20] = Y >>> 0 & 255, A[21] = Y >>> 8 & 255, A[22] = Y >>> 16 & 255, A[23] = Y >>> 24 & 255, A[24] = m >>> 0 & 255, A[25] = m >>> 8 & 255, A[26] = m >>> 16 & 255, A[27] = m >>> 24 & 255, A[28] = L >>> 0 & 255, A[29] = L >>> 8 & 255, A[30] = L >>> 16 & 255, A[31] = L >>> 24 & 255;
  }
  return AA;
}
var XA;
function _A() {
  return XA || (XA = 1, (function(h) {
    const o = be();
    if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
    h.crypto_stream_KEYBYTES = 32, h.crypto_stream_NONCEBYTES = 24, h.crypto_stream_PRIMITIVE = "xsalsa20", h.crypto_stream_xsalsa20_MESSAGEBYTES_MAX = Number.MAX_SAFE_INTEGER, h.crypto_stream = function(C, s, n) {
      C.fill(0), h.crypto_stream_xor(C, C, s, n);
    }, h.crypto_stream_xor = function(C, s, n, r) {
      const e = o(n, r);
      e.update(s, C), e.final();
    }, h.crypto_stream_xor_instance = function(C, s) {
      return new a(C, s);
    };
    function a(C, s) {
      this._instance = o(C, s);
    }
    a.prototype.update = function(C, s) {
      this._instance.update(s, C);
    }, a.prototype.final = function() {
      this._instance.finalize(), this._instance = null;
    };
  })($t)), $t;
}
var eA, zA;
function lA() {
  if (zA) return eA;
  if (zA = 1, new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  var h = function(o) {
    this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0;
    var a, C, s, n, r, e, f, i;
    a = o[0] & 255 | (o[1] & 255) << 8, this.r[0] = a & 8191, C = o[2] & 255 | (o[3] & 255) << 8, this.r[1] = (a >>> 13 | C << 3) & 8191, s = o[4] & 255 | (o[5] & 255) << 8, this.r[2] = (C >>> 10 | s << 6) & 7939, n = o[6] & 255 | (o[7] & 255) << 8, this.r[3] = (s >>> 7 | n << 9) & 8191, r = o[8] & 255 | (o[9] & 255) << 8, this.r[4] = (n >>> 4 | r << 12) & 255, this.r[5] = r >>> 1 & 8190, e = o[10] & 255 | (o[11] & 255) << 8, this.r[6] = (r >>> 14 | e << 2) & 8191, f = o[12] & 255 | (o[13] & 255) << 8, this.r[7] = (e >>> 11 | f << 5) & 8065, i = o[14] & 255 | (o[15] & 255) << 8, this.r[8] = (f >>> 8 | i << 8) & 8191, this.r[9] = i >>> 5 & 127, this.pad[0] = o[16] & 255 | (o[17] & 255) << 8, this.pad[1] = o[18] & 255 | (o[19] & 255) << 8, this.pad[2] = o[20] & 255 | (o[21] & 255) << 8, this.pad[3] = o[22] & 255 | (o[23] & 255) << 8, this.pad[4] = o[24] & 255 | (o[25] & 255) << 8, this.pad[5] = o[26] & 255 | (o[27] & 255) << 8, this.pad[6] = o[28] & 255 | (o[29] & 255) << 8, this.pad[7] = o[30] & 255 | (o[31] & 255) << 8;
  };
  return h.prototype.blocks = function(o, a, C) {
    for (var s = this.fin ? 0 : 2048, n, r, e, f, i, A, I, g, y, c, u, w, K, F, D, x, U, t, Q, P = this.h[0], b = this.h[1], v = this.h[2], T = this.h[3], Z = this.h[4], O = this.h[5], j = this.h[6], W = this.h[7], $ = this.h[8], tt = this.h[9], k = this.r[0], d = this.r[1], _ = this.r[2], Y = this.r[3], m = this.r[4], L = this.r[5], H = this.r[6], At = this.r[7], q = this.r[8], J = this.r[9]; C >= 16; )
      n = o[a + 0] & 255 | (o[a + 1] & 255) << 8, P += n & 8191, r = o[a + 2] & 255 | (o[a + 3] & 255) << 8, b += (n >>> 13 | r << 3) & 8191, e = o[a + 4] & 255 | (o[a + 5] & 255) << 8, v += (r >>> 10 | e << 6) & 8191, f = o[a + 6] & 255 | (o[a + 7] & 255) << 8, T += (e >>> 7 | f << 9) & 8191, i = o[a + 8] & 255 | (o[a + 9] & 255) << 8, Z += (f >>> 4 | i << 12) & 8191, O += i >>> 1 & 8191, A = o[a + 10] & 255 | (o[a + 11] & 255) << 8, j += (i >>> 14 | A << 2) & 8191, I = o[a + 12] & 255 | (o[a + 13] & 255) << 8, W += (A >>> 11 | I << 5) & 8191, g = o[a + 14] & 255 | (o[a + 15] & 255) << 8, $ += (I >>> 8 | g << 8) & 8191, tt += g >>> 5 | s, y = 0, c = y, c += P * k, c += b * (5 * J), c += v * (5 * q), c += T * (5 * At), c += Z * (5 * H), y = c >>> 13, c &= 8191, c += O * (5 * L), c += j * (5 * m), c += W * (5 * Y), c += $ * (5 * _), c += tt * (5 * d), y += c >>> 13, c &= 8191, u = y, u += P * d, u += b * k, u += v * (5 * J), u += T * (5 * q), u += Z * (5 * At), y = u >>> 13, u &= 8191, u += O * (5 * H), u += j * (5 * L), u += W * (5 * m), u += $ * (5 * Y), u += tt * (5 * _), y += u >>> 13, u &= 8191, w = y, w += P * _, w += b * d, w += v * k, w += T * (5 * J), w += Z * (5 * q), y = w >>> 13, w &= 8191, w += O * (5 * At), w += j * (5 * H), w += W * (5 * L), w += $ * (5 * m), w += tt * (5 * Y), y += w >>> 13, w &= 8191, K = y, K += P * Y, K += b * _, K += v * d, K += T * k, K += Z * (5 * J), y = K >>> 13, K &= 8191, K += O * (5 * q), K += j * (5 * At), K += W * (5 * H), K += $ * (5 * L), K += tt * (5 * m), y += K >>> 13, K &= 8191, F = y, F += P * m, F += b * Y, F += v * _, F += T * d, F += Z * k, y = F >>> 13, F &= 8191, F += O * (5 * J), F += j * (5 * q), F += W * (5 * At), F += $ * (5 * H), F += tt * (5 * L), y += F >>> 13, F &= 8191, D = y, D += P * L, D += b * m, D += v * Y, D += T * _, D += Z * d, y = D >>> 13, D &= 8191, D += O * k, D += j * (5 * J), D += W * (5 * q), D += $ * (5 * At), D += tt * (5 * H), y += D >>> 13, D &= 8191, x = y, x += P * H, x += b * L, x += v * m, x += T * Y, x += Z * _, y = x >>> 13, x &= 8191, x += O * d, x += j * k, x += W * (5 * J), x += $ * (5 * q), x += tt * (5 * At), y += x >>> 13, x &= 8191, U = y, U += P * At, U += b * H, U += v * L, U += T * m, U += Z * Y, y = U >>> 13, U &= 8191, U += O * _, U += j * d, U += W * k, U += $ * (5 * J), U += tt * (5 * q), y += U >>> 13, U &= 8191, t = y, t += P * q, t += b * At, t += v * H, t += T * L, t += Z * m, y = t >>> 13, t &= 8191, t += O * Y, t += j * _, t += W * d, t += $ * k, t += tt * (5 * J), y += t >>> 13, t &= 8191, Q = y, Q += P * J, Q += b * q, Q += v * At, Q += T * H, Q += Z * L, y = Q >>> 13, Q &= 8191, Q += O * m, Q += j * Y, Q += W * _, Q += $ * d, Q += tt * k, y += Q >>> 13, Q &= 8191, y = (y << 2) + y | 0, y = y + c | 0, c = y & 8191, y = y >>> 13, u += y, P = c, b = u, v = w, T = K, Z = F, O = D, j = x, W = U, $ = t, tt = Q, a += 16, C -= 16;
    this.h[0] = P, this.h[1] = b, this.h[2] = v, this.h[3] = T, this.h[4] = Z, this.h[5] = O, this.h[6] = j, this.h[7] = W, this.h[8] = $, this.h[9] = tt;
  }, h.prototype.finish = function(o, a) {
    var C = new Uint16Array(10), s, n, r, e;
    if (this.leftover) {
      for (e = this.leftover, this.buffer[e++] = 1; e < 16; e++) this.buffer[e] = 0;
      this.fin = 1, this.blocks(this.buffer, 0, 16);
    }
    for (s = this.h[1] >>> 13, this.h[1] &= 8191, e = 2; e < 10; e++)
      this.h[e] += s, s = this.h[e] >>> 13, this.h[e] &= 8191;
    for (this.h[0] += s * 5, s = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += s, s = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += s, C[0] = this.h[0] + 5, s = C[0] >>> 13, C[0] &= 8191, e = 1; e < 10; e++)
      C[e] = this.h[e] + s, s = C[e] >>> 13, C[e] &= 8191;
    for (C[9] -= 8192, n = (s ^ 1) - 1, e = 0; e < 10; e++) C[e] &= n;
    for (n = ~n, e = 0; e < 10; e++) this.h[e] = this.h[e] & n | C[e];
    for (this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, r = this.h[0] + this.pad[0], this.h[0] = r & 65535, e = 1; e < 8; e++)
      r = (this.h[e] + this.pad[e] | 0) + (r >>> 16) | 0, this.h[e] = r & 65535;
    o[a + 0] = this.h[0] >>> 0 & 255, o[a + 1] = this.h[0] >>> 8 & 255, o[a + 2] = this.h[1] >>> 0 & 255, o[a + 3] = this.h[1] >>> 8 & 255, o[a + 4] = this.h[2] >>> 0 & 255, o[a + 5] = this.h[2] >>> 8 & 255, o[a + 6] = this.h[3] >>> 0 & 255, o[a + 7] = this.h[3] >>> 8 & 255, o[a + 8] = this.h[4] >>> 0 & 255, o[a + 9] = this.h[4] >>> 8 & 255, o[a + 10] = this.h[5] >>> 0 & 255, o[a + 11] = this.h[5] >>> 8 & 255, o[a + 12] = this.h[6] >>> 0 & 255, o[a + 13] = this.h[6] >>> 8 & 255, o[a + 14] = this.h[7] >>> 0 & 255, o[a + 15] = this.h[7] >>> 8 & 255;
  }, h.prototype.update = function(o, a, C) {
    var s, n;
    if (this.leftover) {
      for (n = 16 - this.leftover, n > C && (n = C), s = 0; s < n; s++)
        this.buffer[this.leftover + s] = o[a + s];
      if (C -= n, a += n, this.leftover += n, this.leftover < 16)
        return;
      this.blocks(this.buffer, 0, 16), this.leftover = 0;
    }
    if (C >= 16 && (n = C - C % 16, this.blocks(o, a, n), a += n, C -= n), C) {
      for (s = 0; s < C; s++)
        this.buffer[this.leftover + s] = o[a + s];
      this.leftover += C;
    }
  }, eA = h, eA;
}
var rA, WA;
function we() {
  if (WA) return rA;
  WA = 1;
  const h = ct(), o = lA(), { crypto_verify_16: a } = wt(), C = 16, s = 32;
  rA = {
    crypto_onetimeauth: r,
    crypto_onetimeauth_verify: e,
    crypto_onetimeauth_BYTES: C,
    crypto_onetimeauth_KEYBYTES: s,
    crypto_onetimeauth_PRIMITIVE: "poly1305"
  };
  function r(f, i, A) {
    h(f.byteLength === C, "mac must be 'crypto_onetimeauth_BYTES' bytes"), h(i.byteLength != null, "msg must be buffer"), h(A.byteLength === s, "key must be 'crypto_onetimeauth_KEYBYTES' bytes");
    var I = new o(A);
    I.update(i, 0, i.byteLength), I.finish(f, 0);
  }
  function e(f, i, A) {
    h(f.byteLength === C, "mac must be 'crypto_onetimeauth_BYTES' bytes"), h(i.byteLength != null, "msg must be buffer"), h(A.byteLength === s, "key must be 'crypto_onetimeauth_KEYBYTES' bytes");
    var I = new Uint8Array(16);
    return r(I, i, A), a(f, 0, I, 0);
  }
  return rA;
}
var iA, ZA;
function Se() {
  if (ZA) return iA;
  ZA = 1;
  const h = ct(), { crypto_stream: o, crypto_stream_xor: a } = _A(), { crypto_onetimeauth: C, crypto_onetimeauth_verify: s, crypto_onetimeauth_BYTES: n, crypto_onetimeauth_KEYBYTES: r } = we(), e = 32, f = 24, i = 32, A = 16, I = 16;
  iA = {
    crypto_secretbox: g,
    crypto_secretbox_open: y,
    crypto_secretbox_detached: c,
    crypto_secretbox_open_detached: u,
    crypto_secretbox_easy: w,
    crypto_secretbox_open_easy: K,
    crypto_secretbox_KEYBYTES: e,
    crypto_secretbox_NONCEBYTES: f,
    crypto_secretbox_ZEROBYTES: i,
    crypto_secretbox_BOXZEROBYTES: A,
    crypto_secretbox_MACBYTES: I
  };
  function g(F, D, x, U) {
    h(F.byteLength === D.byteLength, "c must be 'm.byteLength' bytes");
    const t = D.byteLength;
    h(t >= i, "mlen must be at least 'crypto_secretbox_ZEROBYTES'"), h(x.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(U.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes"), a(F, D, x, U), C(
      F.subarray(A, A + n),
      F.subarray(A + n, F.byteLength),
      F.subarray(0, r)
    ), F.fill(0, 0, A);
  }
  function y(F, D, x, U) {
    h(D.byteLength === F.byteLength, "c must be 'm.byteLength' bytes");
    const t = F.byteLength;
    h(t >= i, "mlen must be at least 'crypto_secretbox_ZEROBYTES'"), h(x.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(U.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes");
    const Q = new Uint8Array(r);
    return o(Q, x, U), s(
      D.subarray(A, A + n),
      D.subarray(A + n, D.byteLength),
      Q
    ) === !1 ? !1 : (a(F, D, x, U), F.fill(0, 0, 32), !0);
  }
  function c(F, D, x, U, t) {
    h(F.byteLength === x.byteLength, "o must be 'msg.byteLength' bytes"), h(D.byteLength === I, "mac must be 'crypto_secretbox_MACBYTES' bytes"), h(U.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(t.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes");
    const Q = new Uint8Array(x.byteLength + D.byteLength);
    return w(Q, x, U, t), D.set(Q.subarray(0, D.byteLength)), F.set(Q.subarray(D.byteLength)), !0;
  }
  function u(F, D, x, U, t) {
    h(D.byteLength === F.byteLength, "o must be 'msg.byteLength' bytes"), h(x.byteLength === I, "mac must be 'crypto_secretbox_MACBYTES' bytes"), h(U.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(t.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes");
    const Q = new Uint8Array(D.byteLength + x.byteLength);
    return Q.set(x), Q.set(D, x.byteLength), K(F, Q, U, t);
  }
  function w(F, D, x, U) {
    h(F.byteLength === D.byteLength + I, "o must be 'msg.byteLength + crypto_secretbox_MACBYTES' bytes"), h(x.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(U.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes");
    const t = new Uint8Array(i + D.byteLength), Q = new Uint8Array(t.byteLength);
    t.set(D, i), g(Q, t, x, U), F.set(Q.subarray(A));
  }
  function K(F, D, x, U) {
    h(D.byteLength === F.byteLength + I, "box must be 'msg.byteLength + crypto_secretbox_MACBYTES' bytes"), h(x.byteLength === f, "n must be 'crypto_secretbox_NONCEBYTES' bytes"), h(U.byteLength === e, "k must be 'crypto_secretbox_KEYBYTES' bytes");
    const t = new Uint8Array(A + D.byteLength), Q = new Uint8Array(t.byteLength);
    return t.set(D, A), y(Q, t, x, U) === !1 ? !1 : (F.set(Q.subarray(i)), !0);
  }
  return iA;
}
var nA, $A;
function He() {
  if ($A) return nA;
  $A = 1;
  const { crypto_hash_sha512: h } = Lt(), { crypto_scalarmult: o, crypto_scalarmult_base: a } = mt(), { randombytes: C } = bt(), { crypto_generichash_batch: s } = QA(), { crypto_stream_xsalsa20_MESSAGEBYTES_MAX: n } = _A(), {
    crypto_secretbox_open_easy: r,
    crypto_secretbox_easy: e,
    crypto_secretbox_detached: f,
    crypto_secretbox_open_detached: i
  } = Se(), A = be(), I = ct(), g = 32, y = 32, c = 24, u = 32, w = 16, K = 48, F = 32, D = 32, x = 16, t = n - 16;
  nA = {
    crypto_box_easy: j,
    crypto_box_open_easy: tt,
    crypto_box_keypair: Q,
    crypto_box_seed_keypair: P,
    crypto_box_seal: b,
    crypto_box_seal_open: v,
    crypto_box_PUBLICKEYBYTES: g,
    crypto_box_SECRETKEYBYTES: y,
    crypto_box_NONCEBYTES: c,
    crypto_box_ZEROBYTES: u,
    crypto_box_BOXZEROBYTES: w,
    crypto_box_SEALBYTES: K,
    crypto_box_SEEDBYTES: F,
    crypto_box_BEFORENMBYTES: D,
    crypto_box_MACBYTES: x
  };
  function Q(_, Y) {
    return k(_, g), k(Y, y), C(Y, 32), a(_, Y);
  }
  function P(_, Y, m) {
    I(_.byteLength === g, "pk should be 'crypto_box_PUBLICKEYBYTES' bytes"), I(Y.byteLength === y, "sk should be 'crypto_box_SECRETKEYBYTES' bytes"), I(Y.byteLength === F, "sk should be 'crypto_box_SEEDBYTES' bytes");
    const L = new Uint8Array(64);
    return h(L, m, 32), Y.set(L.subarray(0, 32)), L.fill(0), a(_, Y);
  }
  function b(_, Y, m) {
    k(_, K + Y.length), k(m, g);
    var L = _.subarray(0, g), H = new Uint8Array(y);
    Q(L, H);
    var At = new Uint8Array(c);
    s(At, [L, m]);
    var q = new Uint8Array(g);
    o(q, H, m);
    var J = new Uint8Array(D), et = new Uint8Array(16);
    A.core_hsalsa20(J, et, q, A.SIGMA), e(_.subarray(L.length), Y, At, J), d(H);
  }
  function v(_, Y, m, L) {
    k(Y, K), k(_, Y.length - K), k(m, g), k(L, y);
    var H = Y.subarray(0, g), At = new Uint8Array(c);
    s(At, [H, m]);
    var q = new Uint8Array(g);
    o(q, L, H);
    var J = new Uint8Array(D), et = new Uint8Array(16);
    return A.core_hsalsa20(J, et, q, A.SIGMA), r(_, Y.subarray(H.length), At, J);
  }
  function T(_, Y, m) {
    const L = new Uint8Array(16), H = new Uint8Array(32);
    return I(o(H, m, Y) === 0), A.core_hsalsa20(_, L, H, A.SIGMA), !0;
  }
  function Z(_, Y, m, L, H) {
    return f(_, Y, m, L, H);
  }
  function O(_, Y, m, L, H, At) {
    k(Y, x), k(L, c), k(H, g), k(At, y);
    const q = new Uint8Array(D);
    I(T(q, H, At));
    const J = Z(_, Y, m, L, q);
    return d(q), J;
  }
  function j(_, Y, m, L, H) {
    return I(
      _.length >= Y.length + x,
      "c should be at least 'm.length + crypto_box_MACBYTES' bytes"
    ), I(
      Y.length <= t,
      "m should be at most 'crypto_box_MESSAGEBYTES_MAX' bytes"
    ), O(
      _.subarray(x, Y.length + x),
      _.subarray(0, x),
      Y,
      m,
      L,
      H
    );
  }
  function W(_, Y, m, L, H) {
    return i(_, Y, m, L, H);
  }
  function $(_, Y, m, L, H, At) {
    const q = new Uint8Array(D);
    I(T(q, H, At));
    const J = W(_, Y, m, L, q);
    return d(q), J;
  }
  function tt(_, Y, m, L, H) {
    return I(
      Y.length >= _.length + x,
      "c should be at least 'm.length + crypto_box_MACBYTES' bytes"
    ), $(
      _,
      Y.subarray(x, _.length + x),
      Y.subarray(0, x),
      m,
      L,
      H
    );
  }
  function k(_, Y) {
    if (!_ || Y && _.length < Y) throw new Error("Argument must be a buffer" + (Y ? " of length " + Y : ""));
  }
  function d(_) {
    for (let Y = 0; Y < _.length; Y++) _[Y] = 0;
  }
  return nA;
}
var _t = { exports: {} }, Yt = { exports: {} }, te;
function Ge() {
  if (te) return Yt.exports;
  te = 1;
  const h = ct(), o = St();
  Yt.exports = e;
  const a = Yt.exports.SHA256_BYTES = 32, C = 64, s = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  function n(I, g, y, c) {
    var u = ((I >>> 17 | I << 15) ^ (I >>> 19 | I << 13) ^ I >>> 10) + g, w = ((y >>> 7 | y << 25) ^ (y >>> 18 | y << 14) ^ y >>> 3) + c;
    return u + w << 0;
  }
  function r(I, g) {
    var y, c, u, w, K, F, [D, x, U, t, Q, P, b, v] = I;
    const T = new Uint32Array(64);
    for (let O = 0; O < 16; O++) T[O] = A(g[O]);
    for (let O = 16; O < 64; O++) T[O] = n(T[O - 2], T[O - 7], T[O - 15], T[O - 16]);
    for (let O = 0; O < 64; O += 4) Z(O);
    I[0] = I[0] + D, I[1] = I[1] + x, I[2] = I[2] + U, I[3] = I[3] + t, I[4] = I[4] + Q, I[5] = I[5] + P, I[6] = I[6] + b, I[7] = I[7] + v;
    function Z(O) {
      y = Q & P ^ ~Q & b, c = D & x ^ D & U ^ x & U, u = (D >>> 2 | D << 30) ^ (D >>> 13 | D << 19) ^ (D >>> 22 | D << 10), w = (Q >>> 6 | Q << 26) ^ (Q >>> 11 | Q << 21) ^ (Q >>> 25 | Q << 7), K = v + y + w + T[O] + s[O], F = u + c, v = t + K, t = K + F, y = v & Q ^ ~v & P, c = t & D ^ t & x ^ D & x, u = (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10), w = (v >>> 6 | v << 26) ^ (v >>> 11 | v << 21) ^ (v >>> 25 | v << 7), K = b + y + w + T[O + 1] + s[O + 1], F = u + c, b = U + K, U = K + F, y = b & v ^ ~b & Q, c = U & t ^ U & D ^ t & D, u = (U >>> 2 | U << 30) ^ (U >>> 13 | U << 19) ^ (U >>> 22 | U << 10), w = (b >>> 6 | b << 26) ^ (b >>> 11 | b << 21) ^ (b >>> 25 | b << 7), K = P + y + w + T[O + 2] + s[O + 2], F = u + c, P = x + K, x = K + F, y = P & b ^ ~P & v, c = x & U ^ x & t ^ U & t, u = (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10), w = (P >>> 6 | P << 26) ^ (P >>> 11 | P << 21) ^ (P >>> 25 | P << 7), K = Q + y + w + T[O + 3] + s[O + 3], F = u + c, Q = D + K, D = K + F;
    }
  }
  function e() {
    return this instanceof e ? (this.buffer = new ArrayBuffer(64), this.bytesRead = 0, this.pos = 0, this.digestLength = a, this.finalised = !1, this.load = new Uint8Array(this.buffer), this.words = new Uint32Array(this.buffer), this.state = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]), this) : new e();
  }
  e.prototype.update = function(I, g) {
    h(this.finalised === !1, "Hash instance finalised");
    var [y, c] = i(I, g), u = 0;
    for (this.bytesRead += c; c > 0 && (this.load.set(y.subarray(u, u + C - this.pos), this.pos), u += C - this.pos, c -= C - this.pos, !(c < 0)); )
      this.pos = 0, r(this.state, this.words);
    return this.pos = this.bytesRead & 63, this.load.fill(0, this.pos), this;
  }, e.prototype.digest = function(I, g = 0) {
    h(this.finalised === !1, "Hash instance finalised"), this.finalised = !0, this.load.fill(0, this.pos), this.load[this.pos] = 128, this.pos > 55 && (r(this.state, this.words), this.words.fill(0), this.pos = 0);
    const y = new DataView(this.buffer);
    y.setUint32(56, this.bytesRead / 2 ** 29), y.setUint32(60, this.bytesRead << 3), r(this.state, this.words);
    const c = new Uint8Array(this.state.map(A).buffer);
    if (!I)
      return new Uint8Array(c);
    if (typeof I == "string")
      return o.toString(c, I);
    h(I instanceof Uint8Array, "input must be Uint8Array or Buffer"), h(I.byteLength >= this.digestLength + g, "input not large enough for digest");
    for (let u = 0; u < this.digestLength; u++)
      I[u + g] = c[u];
    return I;
  };
  function f(I) {
    if (!(this instanceof f)) return new f(I);
    this.pad = o.alloc(64), this.inner = e(), this.outer = e();
    const g = o.alloc(32);
    I.byteLength > 64 && (e().update(I).digest(g), I = g), this.pad.fill(54);
    for (let y = 0; y < I.byteLength; y++)
      this.pad[y] ^= I[y];
    this.inner.update(this.pad), this.pad.fill(92);
    for (let y = 0; y < I.byteLength; y++)
      this.pad[y] ^= I[y];
    this.outer.update(this.pad), this.pad.fill(0), g.fill(0);
  }
  f.prototype.update = function(I, g) {
    return this.inner.update(I, g), this;
  }, f.prototype.digest = function(I, g = 0) {
    return this.outer.update(this.inner.digest()), this.outer.digest(I, g);
  }, e.HMAC = f;
  function i(I, g) {
    var y = o.from(I, g);
    return [y, y.byteLength];
  }
  function A(I) {
    var g = (I & 16711935) >>> 8 | (I & 16711935) << 24, y = (I & 4278255360) << 8 | (I & 4278255360) >>> 24;
    return g | y;
  }
  return Yt.exports;
}
var Mt = { exports: {} }, fA, Ae;
function Re() {
  if (Ae) return fA;
  Ae = 1;
  var h = (n, r) => function() {
    return r || (0, n[Object.keys(n)[0]])((r = { exports: {} }).exports, r), r.exports;
  }, o = /* @__PURE__ */ (() => {
    for (var n = new Uint8Array(128), r = 0; r < 64; r++)
      n[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (e) => {
      for (var f = e.length, i = new Uint8Array((f - (e[f - 1] == "=") - (e[f - 2] == "=")) * 3 / 4 | 0), A = 0, I = 0; A < f; ) {
        var g = n[e.charCodeAt(A++)], y = n[e.charCodeAt(A++)], c = n[e.charCodeAt(A++)], u = n[e.charCodeAt(A++)];
        i[I++] = g << 2 | y >> 4, i[I++] = y << 4 | c >> 2, i[I++] = c << 6 | u;
      }
      return i;
    };
  })(), a = h({
    "wasm-binary:./sha256.wat"(n, r) {
      r.exports = o("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");
    }
  }), C = a(), s = new WebAssembly.Module(C);
  return fA = (n) => new WebAssembly.Instance(s, n).exports, fA;
}
var ee;
function qe() {
  if (ee) return Mt.exports;
  ee = 1;
  const h = ct(), o = St(), a = typeof WebAssembly < "u" && Re()({
    imports: {
      debug: {
        log(...c) {
          console.log(...c.map((u) => (u >>> 0).toString(16).padStart(8, "0")));
        },
        log_tee(c) {
          return console.log((c >>> 0).toString(16).padStart(8, "0")), c;
        }
      }
    }
  });
  let C = 0;
  const s = [];
  Mt.exports = i;
  const n = Mt.exports.SHA256_BYTES = 32, r = 40, e = 108, f = 64;
  function i() {
    if (!(this instanceof i)) return new i();
    if (!a) throw new Error("WASM not loaded. Wait for Sha256.ready(cb)");
    s.length || (s.push(C), C += e), this.finalized = !1, this.digestLength = n, this.pointer = s.pop(), this.pos = 0, this._memory = new Uint8Array(a.memory.buffer), this._memory.fill(0, this.pointer, this.pointer + e), this.pointer + this.digestLength > this._memory.length && this._realloc(this.pointer + e);
  }
  i.prototype._realloc = function(c) {
    a.memory.grow(Math.max(0, Math.ceil(Math.abs(c - this._memory.length) / 65536))), this._memory = new Uint8Array(a.memory.buffer);
  }, i.prototype.update = function(c, u) {
    h(this.finalized === !1, "Hash instance finalized"), C % 4 !== 0 && (C += 4 - C % 4), h(C % 4 === 0, "input shoud be aligned for int32");
    const [w, K] = g(c, u);
    return h(w instanceof Uint8Array, "input must be Uint8Array or Buffer"), C + K > this._memory.length && this._realloc(C + c.length), this._memory.fill(0, C, C + y(K, f) - f), this._memory.set(w.subarray(0, f - this.pos), this.pointer + r + this.pos), this._memory.set(w.subarray(f - this.pos), C), this.pos = this.pos + K & 63, a.sha256(this.pointer, C, K, 0), this;
  }, i.prototype.digest = function(c, u = 0) {
    h(this.finalized === !1, "Hash instance finalized"), this.finalized = !0, s.push(this.pointer);
    const w = this.pointer + r + this.pos;
    this._memory.fill(0, w, this.pointer + r + f), a.sha256(this.pointer, C, 0, 1);
    const K = this._memory.subarray(this.pointer, this.pointer + this.digestLength);
    if (!c)
      return K;
    if (typeof c == "string")
      return o.toString(K, c);
    h(c instanceof Uint8Array, "output must be Uint8Array or Buffer"), h(
      c.byteLength >= this.digestLength + u,
      "output must have at least 'SHA256_BYTES' bytes remaining"
    );
    for (let F = 0; F < this.digestLength; F++)
      c[F + u] = K[F];
    return c;
  }, i.WASM = a, i.WASM_SUPPORTED = typeof WebAssembly < "u", i.ready = function(c) {
    return c || (c = I), a ? (c(), Promise.resolve()) : c(new Error("WebAssembly not supported"));
  }, i.prototype.ready = i.ready;
  function A(c) {
    if (!(this instanceof A)) return new A(c);
    this.pad = o.alloc(64), this.inner = i(), this.outer = i();
    const u = o.alloc(32);
    c.byteLength > 64 && (i().update(c).digest(u), c = u), this.pad.fill(54);
    for (let w = 0; w < c.byteLength; w++)
      this.pad[w] ^= c[w];
    this.inner.update(this.pad), this.pad.fill(92);
    for (let w = 0; w < c.byteLength; w++)
      this.pad[w] ^= c[w];
    this.outer.update(this.pad), this.pad.fill(0), u.fill(0);
  }
  A.prototype.update = function(c, u) {
    return this.inner.update(c, u), this;
  }, A.prototype.digest = function(c, u = 0) {
    return this.outer.update(this.inner.digest()), this.outer.digest(c, u);
  }, i.HMAC = A;
  function I() {
  }
  function g(c, u) {
    var w = o.from(c, u);
    return [w, w.byteLength];
  }
  function y(c, u) {
    return c + u - 1 & -u;
  }
  return Mt.exports;
}
var re;
function Oe() {
  if (re) return _t.exports;
  re = 1;
  const h = Ge(), o = qe();
  var a = h;
  return _t.exports = function() {
    return new a();
  }, _t.exports.ready = function(C) {
    o.ready(function() {
      C();
    });
  }, _t.exports.WASM_SUPPORTED = o.WASM_SUPPORTED, _t.exports.WASM_LOADED = !1, _t.exports.SHA256_BYTES = 32, o.ready(function(C) {
    C || (_t.exports.WASM_LOADED = !0, _t.exports = a = o);
  }), _t.exports;
}
var hA, ie;
function Pe() {
  if (ie) return hA;
  ie = 1;
  const h = Oe(), o = ct();
  if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  const a = 32;
  function C(s, n, r) {
    return o(s.byteLength === a, "out must be 'crypto_hash_sha256_BYTES' bytes long"), h().update(n.subarray(0, r)).digest(s), 0;
  }
  return hA = {
    crypto_hash_sha256: C,
    crypto_hash_sha256_BYTES: a
  }, hA;
}
var oA = { exports: {} }, ne;
function Ve() {
  return ne || (ne = 1, (function(h) {
    const o = ct(), a = bt().randombytes_buf, C = pe();
    h.exports.crypto_kdf_PRIMITIVE = "blake2b", h.exports.crypto_kdf_BYTES_MIN = 16, h.exports.crypto_kdf_BYTES_MAX = 64, h.exports.crypto_kdf_CONTEXTBYTES = 8, h.exports.crypto_kdf_KEYBYTES = 32;
    function s(n, r) {
      var e = 1, f = 0;
      for (n[0] = r & 255; ++f < 8 && (e *= 256); )
        n[f] = r / e & 255;
    }
    h.exports.crypto_kdf_derive_from_key = function(r, e, f, i) {
      o(r.length >= h.exports.crypto_kdf_BYTES_MIN, "subkey must be at least crypto_kdf_BYTES_MIN"), o(e >= 0 && e <= 9007199254740991, "subkey_id must be safe integer"), o(f.length >= h.exports.crypto_kdf_CONTEXTBYTES, "context must be at least crypto_kdf_CONTEXTBYTES");
      var A = new Uint8Array(C.PERSONALBYTES), I = new Uint8Array(C.SALTBYTES);
      A.set(f, 0, h.exports.crypto_kdf_CONTEXTBYTES), s(I, e);
      var g = Math.min(r.length, h.exports.crypto_kdf_BYTES_MAX);
      C(g, i.subarray(0, h.exports.crypto_kdf_KEYBYTES), I, A, !0).final(r);
    }, h.exports.crypto_kdf_keygen = function(r) {
      o(r.length >= h.exports.crypto_kdf_KEYBYTES, "out.length must be crypto_kdf_KEYBYTES"), a(r.subarray(0, h.exports.crypto_kdf_KEYBYTES));
    };
  })(oA)), oA.exports;
}
var IA, fe;
function Je() {
  if (fe) return IA;
  fe = 1;
  const { crypto_scalarmult_base: h } = mt(), { crypto_generichash: o } = QA(), { randombytes_buf: a } = bt(), C = ct(), s = 32, n = 32, r = 32;
  function e(i, A) {
    return C(i.byteLength === n, "pk must be 'crypto_kx_PUBLICKEYBYTES' bytes"), C(A.byteLength === r, "sk must be 'crypto_kx_SECRETKEYBYTES' bytes"), a(A, r), h(i, A);
  }
  function f(i, A, I) {
    return C(i.byteLength === n, "pk must be 'crypto_kx_PUBLICKEYBYTES' bytes"), C(A.byteLength === r, "sk must be 'crypto_kx_SECRETKEYBYTES' bytes"), C(I.byteLength === s, "seed must be 'crypto_kx_SEEDBYTES' bytes"), o(A, I), h(i, A);
  }
  return IA = {
    crypto_kx_keypair: e,
    crypto_kx_seed_keypair: f,
    crypto_kx_SEEDBYTES: s,
    crypto_kx_SECRETKEYBYTES: r,
    crypto_kx_PUBLICKEYBYTES: n
  }, IA;
}
var aA = {}, sA, he;
function ke() {
  if (he) return sA;
  he = 1;
  const h = ct();
  sA = a;
  const o = [1634760805, 857760878, 2036477234, 1797285236];
  function a(r, e, f) {
    h(e.byteLength === 32), h(r.byteLength === 8 || r.byteLength === 12);
    const i = new Uint32Array(r.buffer, r.byteOffset, r.byteLength / 4), A = new Uint32Array(e.buffer, e.byteOffset, e.byteLength / 4);
    f || (f = 0), h(f < Number.MAX_SAFE_INTEGER), this.finalized = !1, this.pos = 0, this.state = new Uint32Array(16);
    for (let I = 0; I < 4; I++) this.state[I] = o[I];
    for (let I = 0; I < 8; I++) this.state[4 + I] = A[I];
    return this.state[12] = f & 4294967295, i.byteLength === 8 ? (this.state[13] = (f && 18446744069414584e3) >> 32, this.state[14] = i[0], this.state[15] = i[1]) : (this.state[13] = i[0], this.state[14] = i[1], this.state[15] = i[2]), this;
  }
  a.prototype.update = function(r, e) {
    h(!this.finalized, "cipher finalized."), h(
      r.byteLength >= e.byteLength,
      "output cannot be shorter than input."
    );
    let f = e.length, i = this.pos % 64;
    this.pos += f;
    let A = 0, I = C(this.state);
    for (; i > 0 && f > 0; )
      r[A] = e[A++] ^ I[i], i = i + 1 & 63, i || this.state[12]++, f--;
    for (; f > 0; ) {
      if (I = C(this.state), f < 64) {
        for (let g = 0; g < f; g++)
          r[A] = e[A++] ^ I[i++], i &= 63;
        return;
      }
      for (; i < 64; )
        r[A] = e[A++] ^ I[i++];
      this.state[12]++, i = 0, f -= 64;
    }
  }, a.prototype.final = function() {
    this.state.fill(0), this.pos = 0, this.finalized = !0;
  };
  function C(r) {
    const e = new Uint32Array(16);
    for (let f = 16; f--; ) e[f] = r[f];
    for (let f = 0; f < 20; f += 2)
      n(e, 0, 4, 8, 12), n(e, 1, 5, 9, 13), n(e, 2, 6, 10, 14), n(e, 3, 7, 11, 15), n(e, 0, 5, 10, 15), n(e, 1, 6, 11, 12), n(e, 2, 7, 8, 13), n(e, 3, 4, 9, 14);
    for (let f = 0; f < 16; f++)
      e[f] += r[f];
    return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  }
  function s(r, e) {
    return r << e | r >>> 32 - e;
  }
  function n(r, e, f, i, A) {
    r[e] += r[f], r[A] ^= r[e], r[A] = s(r[A], 16), r[i] += r[A], r[f] ^= r[i], r[f] = s(r[f], 12), r[e] += r[f], r[A] ^= r[e], r[A] = s(r[A], 8), r[i] += r[A], r[f] ^= r[i], r[f] = s(r[f], 7);
  }
  return sA;
}
var oe;
function pA() {
  return oe || (oe = 1, (function(h) {
    const o = ct(), a = ke();
    if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
    h.crypto_stream_chacha20_KEYBYTES = 32, h.crypto_stream_chacha20_NONCEBYTES = 8, h.crypto_stream_chacha20_MESSAGEBYTES_MAX = Number.MAX_SAFE_INTEGER, h.crypto_stream_chacha20_ietf_KEYBYTES = 32, h.crypto_stream_chacha20_ietf_NONCEBYTES = 12, h.crypto_stream_chacha20_ietf_MESSAGEBYTES_MAX = 2 ** 32, h.crypto_stream_chacha20 = function(C, s, n) {
      C.fill(0), h.crypto_stream_chacha20_xor(C, C, s, n);
    }, h.crypto_stream_chacha20_xor = function(C, s, n, r) {
      o(
        n.byteLength === h.crypto_stream_chacha20_NONCEBYTES,
        "n should be crypto_stream_chacha20_NONCEBYTES"
      ), o(
        r.byteLength === h.crypto_stream_chacha20_KEYBYTES,
        "k should be crypto_stream_chacha20_KEYBYTES"
      );
      const e = new a(n, r);
      e.update(C, s), e.final();
    }, h.crypto_stream_chacha20_xor_ic = function(C, s, n, r, e) {
      o(
        n.byteLength === h.crypto_stream_chacha20_NONCEBYTES,
        "n should be crypto_stream_chacha20_NONCEBYTES"
      ), o(
        e.byteLength === h.crypto_stream_chacha20_KEYBYTES,
        "k should be crypto_stream_chacha20_KEYBYTES"
      );
      const f = new a(n, e, r);
      f.update(C, s), f.final();
    }, h.crypto_stream_chacha20_xor_instance = function(C, s) {
      return o(
        C.byteLength === h.crypto_stream_chacha20_NONCEBYTES,
        "n should be crypto_stream_chacha20_NONCEBYTES"
      ), o(
        s.byteLength === h.crypto_stream_chacha20_KEYBYTES,
        "k should be crypto_stream_chacha20_KEYBYTES"
      ), new a(C, s);
    }, h.crypto_stream_chacha20_ietf = function(C, s, n) {
      C.fill(0), h.crypto_stream_chacha20_ietf_xor(C, C, s, n);
    }, h.crypto_stream_chacha20_ietf_xor = function(C, s, n, r) {
      o(
        n.byteLength === h.crypto_stream_chacha20_ietf_NONCEBYTES,
        "n should be crypto_stream_chacha20_ietf_NONCEBYTES"
      ), o(
        r.byteLength === h.crypto_stream_chacha20_ietf_KEYBYTES,
        "k should be crypto_stream_chacha20_ietf_KEYBYTES"
      );
      const e = new a(n, r);
      e.update(C, s), e.final();
    }, h.crypto_stream_chacha20_ietf_xor_ic = function(C, s, n, r, e) {
      o(
        n.byteLength === h.crypto_stream_chacha20_ietf_NONCEBYTES,
        "n should be crypto_stream_chacha20_ietf_NONCEBYTES"
      ), o(
        e.byteLength === h.crypto_stream_chacha20_ietf_KEYBYTES,
        "k should be crypto_stream_chacha20_ietf_KEYBYTES"
      );
      const f = new a(n, e, r);
      f.update(C, s), f.final();
    }, h.crypto_stream_chacha20_ietf_xor_instance = function(C, s) {
      return o(
        C.byteLength === h.crypto_stream_chacha20_ietf_NONCEBYTES,
        "n should be crypto_stream_chacha20_ietf_NONCEBYTES"
      ), o(
        s.byteLength === h.crypto_stream_chacha20_ietf_KEYBYTES,
        "k should be crypto_stream_chacha20_ietf_KEYBYTES"
      ), new a(C, s);
    };
  })(aA)), aA;
}
var gA, Ie;
function je() {
  if (Ie) return gA;
  Ie = 1;
  const { crypto_stream_chacha20_ietf: h, crypto_stream_chacha20_ietf_xor_ic: o } = pA(), { crypto_verify_16: a } = wt(), C = lA(), s = ct(), n = 32, r = 0, e = 12, f = 16, i = Number.MAX_SAFE_INTEGER, A = new Uint8Array(16);
  function I(w, K, F, D, x, U) {
    if (F === null) return I(w, K, new Uint8Array(0), D, x, U);
    s(
      w.byteLength === K.byteLength + f,
      "ciphertext should be 'crypto_aead_chacha20poly1305_ietf_ABYTES' longer than message"
    ), s(
      x.byteLength === e,
      "npub should be 'crypto_aead_chacha20poly1305_ietf_NPUBBYTES' long"
    ), s(
      U.byteLength === n,
      "k should be 'crypto_aead_chacha20poly1305_ietf_KEYBYTES' long"
    ), s(K.byteLength <= i, "message is too large");
    const t = g(
      w.subarray(0, K.byteLength),
      w.subarray(K.byteLength),
      K,
      F,
      D,
      x,
      U
    );
    return K.byteLength + t;
  }
  function g(w, K, F, D, x, U, t) {
    if (D === null) return g(w, K, F, new Uint8Array(0), x, U, t);
    s(w.byteLength === F.byteLength, "ciphertext should be same length than message"), s(
      U.byteLength === e,
      "npub should be 'crypto_aead_chacha20poly1305_ietf_NPUBBYTES' long"
    ), s(
      t.byteLength === n,
      "k should be 'crypto_aead_chacha20poly1305_ietf_KEYBYTES' long"
    ), s(F.byteLength <= i, "message is too large"), s(
      K.byteLength <= f,
      "mac should be 'crypto_aead_chacha20poly1305_ietf_ABYTES' long"
    );
    const Q = new Uint8Array(64);
    var P = new Uint8Array(8);
    h(Q, U, t);
    const b = new C(Q);
    return Q.fill(0), b.update(D, 0, D.byteLength), b.update(A, 0, 16 - D.byteLength & 15), o(w, F, U, 1, t), b.update(w, 0, F.byteLength), b.update(A, 0, 16 - F.byteLength & 15), u(P, 0, D.byteLength), b.update(P, 0, P.byteLength), u(P, 0, F.byteLength), b.update(P, 0, P.byteLength), b.finish(K, 0), P.fill(0), f;
  }
  function y(w, K, F, D, x, U) {
    if (D === null) return y(w, K, F, new Uint8Array(0), x, U);
    if (s(
      w.byteLength === F.byteLength - f,
      "message should be 'crypto_aead_chacha20poly1305_ietf_ABYTES' shorter than ciphertext"
    ), s(
      x.byteLength === e,
      "npub should be 'crypto_aead_chacha20poly1305_ietf_NPUBBYTES' long"
    ), s(
      U.byteLength === n,
      "k should be 'crypto_aead_chacha20poly1305_ietf_KEYBYTES' long"
    ), s(w.byteLength <= i, "message is too large"), F.byteLength < f) throw new Error("could not verify data");
    return c(
      w,
      K,
      F.subarray(0, F.byteLength - f),
      F.subarray(F.byteLength - f),
      D,
      x,
      U
    ), F.byteLength - f;
  }
  function c(w, K, F, D, x, U, t) {
    if (x === null) return c(w, K, F, D, new Uint8Array(0), U, t);
    s(F.byteLength === w.byteLength, "message should be same length than ciphertext"), s(
      U.byteLength === e,
      "npub should be 'crypto_aead_chacha20poly1305_ietf_NPUBBYTES' long"
    ), s(
      t.byteLength === n,
      "k should be 'crypto_aead_chacha20poly1305_ietf_KEYBYTES' long"
    ), s(w.byteLength <= i, "message is too large"), s(
      D.byteLength <= f,
      "mac should be 'crypto_aead_chacha20poly1305_ietf_ABYTES' long"
    );
    const Q = new Uint8Array(64), P = new Uint8Array(8), b = new Uint8Array(f);
    h(Q, U, t);
    const v = new C(Q);
    Q.fill(0), v.update(x, 0, x.byteLength), v.update(A, 0, 16 - x.byteLength & 15);
    const T = F.byteLength;
    v.update(F, 0, T), v.update(A, 0, 16 - T & 15), u(P, 0, x.byteLength), v.update(P, 0, P.byteLength), u(P, 0, T), v.update(P, 0, P.byteLength), v.finish(b, 0), s(b.byteLength === 16);
    const Z = a(b, 0, D, 0);
    if (b.fill(0), P.fill(0), !Z)
      throw w.fill(0), new Error("could not verify data");
    o(w, F, U, 1, t);
  }
  function u(w, K, F) {
    w.fill(0, 0, 8);
    const D = new DataView(w.buffer, w.byteOffset, w.byteLength);
    D.setUint32(K, F & 4294967295, !0), D.setUint32(K + 4, F / 2 ** 32 & 4294967295, !0);
  }
  return gA = {
    crypto_aead_chacha20poly1305_ietf_encrypt: I,
    crypto_aead_chacha20poly1305_ietf_encrypt_detached: g,
    crypto_aead_chacha20poly1305_ietf_decrypt: y,
    crypto_aead_chacha20poly1305_ietf_decrypt_detached: c,
    crypto_aead_chacha20poly1305_ietf_ABYTES: f,
    crypto_aead_chacha20poly1305_ietf_KEYBYTES: n,
    crypto_aead_chacha20poly1305_ietf_NPUBBYTES: e,
    crypto_aead_chacha20poly1305_ietf_NSECBYTES: r,
    crypto_aead_chacha20poly1305_ietf_MESSAGEBYTES_MAX: i
  }, gA;
}
var cA, ae;
function Xe() {
  if (ae) return cA;
  ae = 1;
  const { sodium_malloc: h } = ue(), o = ct();
  if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  const a = 32, C = 16, s = 32, n = 16;
  function r(u, w) {
    return u &= 4294967295, w &= 4294967295, u << w | u >>> 32 - w;
  }
  function e(u, w) {
    o(u instanceof Uint8Array, "src not byte array");
    let K = u[w];
    return K |= u[w + 1] << 8, K |= u[w + 2] << 16, K |= u[w + 3] << 24, K;
  }
  function f(u, w, K) {
    o(u instanceof Uint8Array, "dest not byte array");
    var F = 1, D = 0;
    for (u[K] = w & 255; ++D < 4 && (F *= 256); )
      u[K + D] = w / F & 255;
  }
  function i(u, w, K, F, D) {
    u[w] += u[K], u[D] = r(u[D] ^ u[w], 16), u[F] += u[D], u[K] = r(u[K] ^ u[F], 12), u[w] += u[K], u[D] = r(u[D] ^ u[w], 8), u[F] += u[D], u[K] = r(u[K] ^ u[F], 7);
  }
  function A(u, w, K, F) {
    o(u instanceof Uint8Array && u.length === 32, "out is not an array of 32 bytes"), o(K instanceof Uint8Array && K.length === 32, "k is not an array of 32 bytes"), o(F === null || F instanceof Uint8Array && F.length === 16, "c is not null or an array of 16 bytes");
    let D = 0;
    const x = new Uint32Array(16);
    for (F ? (x[0] = e(F, 0), x[1] = e(F, 4), x[2] = e(F, 8), x[3] = e(F, 12)) : (x[0] = 1634760805, x[1] = 857760878, x[2] = 2036477234, x[3] = 1797285236), x[4] = e(K, 0), x[5] = e(K, 4), x[6] = e(K, 8), x[7] = e(K, 12), x[8] = e(K, 16), x[9] = e(K, 20), x[10] = e(K, 24), x[11] = e(K, 28), x[12] = e(w, 0), x[13] = e(w, 4), x[14] = e(w, 8), x[15] = e(w, 12), D = 0; D < 10; D++)
      i(x, 0, 4, 8, 12), i(x, 1, 5, 9, 13), i(x, 2, 6, 10, 14), i(x, 3, 7, 11, 15), i(x, 0, 5, 10, 15), i(x, 1, 6, 11, 12), i(x, 2, 7, 8, 13), i(x, 3, 4, 9, 14);
    return f(u, x[0], 0), f(u, x[1], 4), f(u, x[2], 8), f(u, x[3], 12), f(u, x[12], 16), f(u, x[13], 20), f(u, x[14], 24), f(u, x[15], 28), 0;
  }
  function I() {
    return a;
  }
  function g() {
    return C;
  }
  function y() {
    return s;
  }
  function c() {
    return n;
  }
  return cA = {
    crypto_core_hchacha20_INPUTBYTES: C,
    LOAD32_LE: e,
    STORE32_LE: f,
    QUARTERROUND: i,
    crypto_core_hchacha20: A,
    crypto_core_hchacha20_outputbytes: I,
    crypto_core_hchacha20_inputbytes: g,
    crypto_core_hchacha20_keybytes: y,
    crypto_core_hchacha20_constbytes: c
  }, cA;
}
var EA, se;
function ze() {
  if (se) return EA;
  se = 1;
  const h = ct(), { randombytes_buf: o } = bt(), {
    crypto_stream_chacha20_ietf: a,
    crypto_stream_chacha20_ietf_xor: C,
    crypto_stream_chacha20_ietf_xor_ic: s,
    crypto_stream_chacha20_ietf_KEYBYTES: n
  } = pA(), { crypto_core_hchacha20: r, crypto_core_hchacha20_INPUTBYTES: e } = Xe(), f = lA(), { sodium_increment: i, sodium_is_zero: A, sodium_memcmp: I } = Qe(), g = 16, y = 4, c = 8, w = 32, F = 24, x = 1 + 16, U = Number.MAX_SAFE_INTEGER, t = Number.MAX_SAFE_INTEGER, Q = 1, P = new Uint8Array([0]), b = new Uint8Array([1]), v = new Uint8Array([2]), T = new Uint8Array([b | v]), Z = w + c + y + 8, O = 0, j = w, W = j + c + y, $ = new Uint8Array(16);
  function tt(q, J) {
    let et = 1, z = 0;
    for (q[0] = J & 255; ++z < 8 && (et *= 256); )
      q[z] = J / et & 255;
  }
  function k(q) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    );
    const J = q.subarray(j, W);
    for (let et = 0; et < y; et++)
      J[et] = 0;
    J[0] = 1;
  }
  function d(q) {
    h(q.length === w), o(q);
  }
  function _(q, J, et) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    ), h(J instanceof Uint8Array && J.length === F, "out not byte array of length crypto_secretstream_xchacha20poly1305_HEADERBYTES"), h(et instanceof Uint8Array && et.length === w, "key not byte array of length crypto_secretstream_xchacha20poly1305_KEYBYTES");
    const z = q.subarray(O, j), E = q.subarray(j, W), ft = q.subarray(W);
    o(J, F), r(z, J, et, null), k(q);
    for (let nt = 0; nt < c; nt++)
      E[nt + y] = J[nt + e];
    ft.fill(0);
  }
  function Y(q, J, et) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    ), h(
      J instanceof Uint8Array && J.length === F,
      "_in not byte array of length crypto_secretstream_xchacha20poly1305_HEADERBYTES"
    ), h(
      et instanceof Uint8Array && et.length === w,
      "key not byte array of length crypto_secretstream_xchacha20poly1305_KEYBYTES"
    );
    const z = q.subarray(O, j), E = q.subarray(j, W), ft = q.subarray(W);
    r(z, J, et, null), k(q);
    for (let nt = 0; nt < c; nt++)
      E[nt + y] = J[nt + e];
    ft.fill(0);
  }
  function m(q) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    );
    const J = q.subarray(O, j), et = q.subarray(j, W), z = new Uint8Array(
      n + c
    );
    let E;
    for (E = 0; E < n; E++)
      z[E] = J[E];
    for (E = 0; E < c; E++)
      z[n + E] = et[y + E];
    for (C(z, z, et, J), E = 0; E < n; E++)
      J[E] = z[E];
    for (E = 0; E < c; E++)
      et[y + E] = z[n + E];
    k(q);
  }
  function L(q, J, et, z, E) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    ), z || (z = new Uint8Array(0));
    const ft = q.subarray(O, j), nt = q.subarray(j, W), it = new Uint8Array(64), It = new Uint8Array(8);
    h(U <= t), a(it, nt, ft);
    const at = new f(it);
    it.fill(0), at.update(z, 0, z.byteLength), at.update($, 0, 16 - z.byteLength & 15), it[0] = E[0], s(it, it, nt, 1, ft), at.update(it, 0, it.byteLength), J[0] = it[0];
    const B = J.subarray(1, J.byteLength);
    s(B, et, nt, 2, ft), at.update(B, 0, et.byteLength), at.update($, 0, 16 - it.byteLength + et.byteLength & 15), tt(It, z.byteLength), at.update(It, 0, It.byteLength), tt(It, it.byteLength + et.byteLength), at.update(It, 0, It.byteLength);
    const l = J.subarray(1 + et.byteLength, J.byteLength);
    return at.finish(l, 0), h(g >= c), At(
      nt.subarray(y, nt.length),
      l,
      c
    ), i(nt), ((E[0] & v) !== 0 || A(nt.subarray(0, y))) && m(q), x + et.byteLength;
  }
  function H(q, J, et, z, E) {
    h(
      q.byteLength === Z,
      "state is should be crypto_secretstream_xchacha20poly1305_STATEBYTES long"
    ), E || (E = new Uint8Array(0));
    const ft = q.subarray(O, j), nt = q.subarray(j, W), it = new Uint8Array(64), It = new Uint8Array(8), at = new Uint8Array(g);
    h(
      z.byteLength >= x,
      "ciphertext is too short."
    );
    const B = z.byteLength - x;
    a(it, nt, ft);
    const l = new f(it);
    it.fill(0), l.update(E, 0, E.byteLength), l.update($, 0, 16 - E.byteLength & 15), it.fill(0), it[0] = z[0], s(it, it, nt, 1, ft), et[0] = it[0], it[0] = z[0], l.update(it, 0, it.byteLength);
    const S = z.subarray(1, z.length);
    l.update(S, 0, B), l.update($, 0, 16 - it.byteLength + B & 15), tt(It, E.byteLength), l.update(It, 0, It.byteLength), tt(It, it.byteLength + J.byteLength), l.update(It, 0, It.byteLength), l.finish(at, 0);
    const R = z.subarray(1 + B, z.length);
    if (!I(at, R))
      throw at.fill(0), new Error("MAC could not be verified.");
    return s(J, S.subarray(0, J.length), nt, 2, ft), At(
      nt.subarray(y, nt.length),
      at,
      c
    ), i(nt), ((et & v) !== 0 || A(nt.subarray(0, y))) && m(q), B;
  }
  function At(q, J, et) {
    for (let z = 0; z < et; z++)
      q[z] ^= J[z];
  }
  return EA = {
    crypto_secretstream_xchacha20poly1305_keygen: d,
    crypto_secretstream_xchacha20poly1305_init_push: _,
    crypto_secretstream_xchacha20poly1305_init_pull: Y,
    crypto_secretstream_xchacha20poly1305_rekey: m,
    crypto_secretstream_xchacha20poly1305_push: L,
    crypto_secretstream_xchacha20poly1305_pull: H,
    crypto_secretstream_xchacha20poly1305_STATEBYTES: Z,
    crypto_secretstream_xchacha20poly1305_ABYTES: x,
    crypto_secretstream_xchacha20poly1305_HEADERBYTES: F,
    crypto_secretstream_xchacha20poly1305_KEYBYTES: w,
    crypto_secretstream_xchacha20poly1305_MESSAGEBYTES_MAX: U,
    crypto_secretstream_xchacha20poly1305_TAGBYTES: Q,
    crypto_secretstream_xchacha20poly1305_TAG_MESSAGE: P,
    crypto_secretstream_xchacha20poly1305_TAG_PUSH: b,
    crypto_secretstream_xchacha20poly1305_TAG_REKEY: v,
    crypto_secretstream_xchacha20poly1305_TAG_FINAL: T
  }, EA;
}
var lt = {}, CA, ge;
function We() {
  if (ge) return CA;
  ge = 1;
  var h = (n, r) => function() {
    return r || (0, n[Object.keys(n)[0]])((r = { exports: {} }).exports, r), r.exports;
  }, o = /* @__PURE__ */ (() => {
    for (var n = new Uint8Array(128), r = 0; r < 64; r++)
      n[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (e) => {
      for (var f = e.length, i = new Uint8Array((f - (e[f - 1] == "=") - (e[f - 2] == "=")) * 3 / 4 | 0), A = 0, I = 0; A < f; ) {
        var g = n[e.charCodeAt(A++)], y = n[e.charCodeAt(A++)], c = n[e.charCodeAt(A++)], u = n[e.charCodeAt(A++)];
        i[I++] = g << 2 | y >> 4, i[I++] = y << 4 | c >> 2, i[I++] = c << 6 | u;
      }
      return i;
    };
  })(), a = h({
    "wasm-binary:./siphash24.wat"(n, r) {
      r.exports = o("AGFzbQEAAAABBgFgAn9/AAMCAQAFBQEBCpBOBxQCBm1lbW9yeQIAB3NpcGhhc2gAAArdCAHaCAIIfgJ/QvXKzYPXrNu38wAhAkLt3pHzlszct+QAIQNC4eSV89bs2bzsACEEQvPK0cunjNmy9AAhBUEIKQMAIQdBECkDACEIIAGtQjiGIQYgAUEHcSELIAAgAWogC2shCiAFIAiFIQUgBCAHhSEEIAMgCIUhAyACIAeFIQICQANAIAAgCkYNASAAKQMAIQkgBSAJhSEFIAIgA3whAiADQg2JIQMgAyAChSEDIAJCIIkhAiAEIAV8IQQgBUIQiSEFIAUgBIUhBSACIAV8IQIgBUIViSEFIAUgAoUhBSAEIAN8IQQgA0IRiSEDIAMgBIUhAyAEQiCJIQQgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAmFIQIgAEEIaiEADAALCwJAAkACQAJAAkACQAJAAkAgCw4HBwYFBAMCAQALIAYgADEABkIwhoQhBgsgBiAAMQAFQiiGhCEGCyAGIAAxAARCIIaEIQYLIAYgADEAA0IYhoQhBgsgBiAAMQACQhCGhCEGCyAGIAAxAAFCCIaEIQYLIAYgADEAAIQhBgsgBSAGhSEFIAIgA3whAiADQg2JIQMgAyAChSEDIAJCIIkhAiAEIAV8IQQgBUIQiSEFIAUgBIUhBSACIAV8IQIgBUIViSEFIAUgAoUhBSAEIAN8IQQgA0IRiSEDIAMgBIUhAyAEQiCJIQQgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAaFIQIgBEL/AYUhBCACIAN8IQIgA0INiSEDIAMgAoUhAyACQiCJIQIgBCAFfCEEIAVCEIkhBSAFIASFIQUgAiAFfCECIAVCFYkhBSAFIAKFIQUgBCADfCEEIANCEYkhAyADIASFIQMgBEIgiSEEIAIgA3whAiADQg2JIQMgAyAChSEDIAJCIIkhAiAEIAV8IQQgBUIQiSEFIAUgBIUhBSACIAV8IQIgBUIViSEFIAUgAoUhBSAEIAN8IQQgA0IRiSEDIAMgBIUhAyAEQiCJIQQgAiADfCECIANCDYkhAyADIAKFIQMgAkIgiSECIAQgBXwhBCAFQhCJIQUgBSAEhSEFIAIgBXwhAiAFQhWJIQUgBSAChSEFIAQgA3whBCADQhGJIQMgAyAEhSEDIARCIIkhBCACIAN8IQIgA0INiSEDIAMgAoUhAyACQiCJIQIgBCAFfCEEIAVCEIkhBSAFIASFIQUgAiAFfCECIAVCFYkhBSAFIAKFIQUgBCADfCEEIANCEYkhAyADIASFIQMgBEIgiSEEQQAgAiADIAQgBYWFhTcDAAs=");
    }
  }), C = a(), s = new WebAssembly.Module(C);
  return CA = (n) => new WebAssembly.Instance(s, n).exports, CA;
}
var yA, ce;
function Ze() {
  if (ce) return yA;
  ce = 1, yA = r;
  function h(e, f) {
    var i = e.l + f.l, A = {
      h: e.h + f.h + (i / 2 >>> 31) >>> 0,
      l: i >>> 0
    };
    e.h = A.h, e.l = A.l;
  }
  function o(e, f) {
    e.h ^= f.h, e.h >>>= 0, e.l ^= f.l, e.l >>>= 0;
  }
  function a(e, f) {
    var i = {
      h: e.h << f | e.l >>> 32 - f,
      l: e.l << f | e.h >>> 32 - f
    };
    e.h = i.h, e.l = i.l;
  }
  function C(e) {
    var f = e.l;
    e.l = e.h, e.h = f;
  }
  function s(e, f, i, A) {
    h(e, f), h(i, A), a(f, 13), a(A, 16), o(f, e), o(A, i), C(e), h(i, f), h(e, A), a(f, 17), a(A, 21), o(f, i), o(A, e), C(i);
  }
  function n(e, f) {
    return e[f + 3] << 24 | e[f + 2] << 16 | e[f + 1] << 8 | e[f];
  }
  function r(e, f, i) {
    var A = { h: n(i, 4), l: n(i, 0) }, I = { h: n(i, 12), l: n(i, 8) }, g = { h: A.h, l: A.l }, y = A, c = { h: I.h, l: I.l }, u = I, w, K = 0, F = f.length, D = F - 7, x = new Uint8Array(new ArrayBuffer(8));
    for (o(g, { h: 1936682341, l: 1886610805 }), o(c, { h: 1685025377, l: 1852075885 }), o(y, { h: 1819895653, l: 1852142177 }), o(u, { h: 1952801890, l: 2037671283 }); K < D; )
      w = { h: n(f, K + 4), l: n(f, K) }, o(u, w), s(g, c, y, u), s(g, c, y, u), o(g, w), K += 8;
    x[7] = F;
    for (var U = 0; K < F; )
      x[U++] = f[K++];
    for (; U < 7; )
      x[U++] = 0;
    w = {
      h: x[7] << 24 | x[6] << 16 | x[5] << 8 | x[4],
      l: x[3] << 24 | x[2] << 16 | x[1] << 8 | x[0]
    }, o(u, w), s(g, c, y, u), s(g, c, y, u), o(g, w), o(y, { h: 0, l: 255 }), s(g, c, y, u), s(g, c, y, u), s(g, c, y, u), s(g, c, y, u);
    var t = g;
    o(t, c), o(t, y), o(t, u), e[0] = t.l & 255, e[1] = t.l >> 8 & 255, e[2] = t.l >> 16 & 255, e[3] = t.l >> 24 & 255, e[4] = t.h & 255, e[5] = t.h >> 8 & 255, e[6] = t.h >> 16 & 255, e[7] = t.h >> 24 & 255;
  }
  return yA;
}
var xA, Ee;
function $e() {
  if (Ee) return xA;
  Ee = 1;
  var h = ct(), o = typeof WebAssembly < "u" && We()(), a = Ze();
  xA = r;
  var C = r.BYTES = 8, s = r.KEYBYTES = 16;
  r.WASM_SUPPORTED = !!o, r.WASM_LOADED = !!o;
  var n = new Uint8Array(o ? o.memory.buffer : 0);
  function r(f, i, A, I) {
    return A || (A = new Uint8Array(8)), I !== !0 && (h(A.length >= C, "output must be at least " + C), h(i.length >= s, "key must be at least " + s)), o ? (f.length + 24 > n.length && e(f.length + 24), n.set(i, 8), n.set(f, 24), o.siphash(24, f.length), A.set(n.subarray(0, 8))) : a(A, f, i), A;
  }
  function e(f) {
    o.memory.grow(Math.max(0, Math.ceil(Math.abs(f - n.length) / 65536))), n = new Uint8Array(o.memory.buffer);
  }
  return xA;
}
var Ce;
function tr() {
  if (Ce) return lt;
  Ce = 1;
  var h = $e();
  if (new Uint16Array([1])[0] !== 1) throw new Error("Big endian architecture is not supported.");
  lt.crypto_shorthash_PRIMITIVE = "siphash24", lt.crypto_shorthash_BYTES = h.BYTES, lt.crypto_shorthash_KEYBYTES = h.KEYBYTES, lt.crypto_shorthash_WASM_SUPPORTED = h.WASM_SUPPORTED, lt.crypto_shorthash_WASM_LOADED = h.WASM_LOADED, lt.crypto_shorthash = o;
  function o(a, C, s, n) {
    h(C, s, a, n);
  }
  return lt;
}
var BA, ye;
function Ar() {
  if (ye) return BA;
  ye = 1;
  const { crypto_verify_32: h } = wt(), { crypto_hash: o } = Lt(), {
    gf: a,
    gf0: C,
    gf1: s,
    D: n,
    D2: r,
    X: e,
    Y: f,
    I: i,
    A,
    Z: I,
    M: g,
    S: y,
    sel25519: c,
    pack25519: u,
    inv25519: w,
    unpack25519: K
  } = le(), { randombytes: F } = bt(), { crypto_scalarmult_BYTES: D } = mt(), { crypto_hash_sha512_BYTES: x } = Lt(), U = ct(), t = 32, Q = 64, P = 32, b = 64, v = b, T = t, Z = Q, O = P;
  BA = {
    crypto_sign_keypair: Y,
    crypto_sign_seed_keypair: m,
    crypto_sign: q,
    crypto_sign_detached: J,
    crypto_sign_open: z,
    crypto_sign_verify_detached: E,
    crypto_sign_BYTES: v,
    crypto_sign_PUBLICKEYBYTES: T,
    crypto_sign_SECRETKEYBYTES: Z,
    crypto_sign_SEEDBYTES: O,
    crypto_sign_ed25519_PUBLICKEYBYTES: t,
    crypto_sign_ed25519_SECRETKEYBYTES: Q,
    crypto_sign_ed25519_SEEDBYTES: P,
    crypto_sign_ed25519_BYTES: b,
    crypto_sign_ed25519_pk_to_curve25519: at,
    crypto_sign_ed25519_sk_to_curve25519: S,
    crypto_sign_ed25519_sk_to_pk: l,
    unpackneg: et,
    pack: k
  };
  function j(p, M) {
    for (let N = 0; N < 16; N++) p[N] = M[N] | 0;
  }
  function W(p, M) {
    var N = a(), G;
    for (G = 0; G < 16; G++) N[G] = M[G];
    for (G = 250; G >= 0; G--)
      y(N, N), G !== 1 && g(N, N, M);
    for (G = 0; G < 16; G++) p[G] = N[G];
  }
  function $(p, M) {
    var N = a(), G = a(), V = a(), X = a(), ot = a(), rt = a(), ht = a(), st = a(), gt = a();
    I(N, p[1], p[0]), I(gt, M[1], M[0]), g(N, N, gt), A(G, p[0], p[1]), A(gt, M[0], M[1]), g(G, G, gt), g(V, p[3], M[3]), g(V, V, r), g(X, p[2], M[2]), A(X, X, X), I(ot, G, N), I(rt, X, V), A(ht, X, V), A(st, G, N), g(p[0], ot, rt), g(p[1], st, ht), g(p[2], ht, rt), g(p[3], ot, st);
  }
  function tt(p, M, N) {
    var G;
    for (G = 0; G < 4; G++)
      c(p[G], M[G], N);
  }
  function k(p, M) {
    var N = a(), G = a(), V = a();
    w(V, M[2]), g(N, M[0], V), g(G, M[1], V), u(p, G), p[31] ^= ft(N) << 7;
  }
  function d(p, M, N) {
    var G = [a(M[0]), a(M[1]), a(M[2]), a(M[3])], V, X;
    for (j(p[0], C), j(p[1], s), j(p[2], s), j(p[3], C), X = 255; X >= 0; --X)
      V = N[X / 8 | 0] >> (X & 7) & 1, tt(p, G, V), $(G, p), $(p, p), tt(p, G, V);
  }
  function _(p, M) {
    var N = [a(), a(), a(), a()];
    j(N[0], e), j(N[1], f), j(N[2], s), g(N[3], e, f), d(p, N, M);
  }
  function Y(p, M, N) {
    R(p, T), R(M, Z);
    var G = new Uint8Array(64), V = [a(), a(), a(), a()], X;
    for (N || F(M, 32), o(G, M, 32), G[0] &= 248, G[31] &= 127, G[31] |= 64, _(V, G), k(p, V), X = 0; X < 32; X++) M[X + 32] = p[X];
  }
  function m(p, M, N) {
    return R(N, O), M.set(N), Y(p, M, !0);
  }
  var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
  function H(p, M) {
    var N, G, V, X;
    for (G = 63; G >= 32; --G) {
      for (N = 0, V = G - 32, X = G - 12; V < X; ++V)
        M[V] += N - 16 * M[G] * L[V - (G - 32)], N = M[V] + 128 >> 8, M[V] -= N * 256;
      M[V] += N, M[G] = 0;
    }
    for (N = 0, V = 0; V < 32; V++)
      M[V] += N - (M[31] >> 4) * L[V], N = M[V] >> 8, M[V] &= 255;
    for (V = 0; V < 32; V++) M[V] -= N * L[V];
    for (G = 0; G < 32; G++)
      M[G + 1] += M[G] >> 8, p[G] = M[G] & 255;
  }
  function At(p) {
    var M = new Float64Array(64);
    for (let N = 0; N < 64; N++) M[N] = p[N];
    for (let N = 0; N < 64; N++) p[N] = 0;
    H(p, M);
  }
  function q(p, M, N) {
    R(p, v + M.length), R(M, 0), R(N, Z);
    var G = M.length, V = new Uint8Array(64), X = new Uint8Array(64), ot = new Uint8Array(64), rt, ht, st = new Float64Array(64), gt = [a(), a(), a(), a()];
    o(V, N, 32), V[0] &= 248, V[31] &= 127, V[31] |= 64;
    var Et = G + 64;
    for (rt = 0; rt < G; rt++) p[64 + rt] = M[rt];
    for (rt = 0; rt < 32; rt++) p[32 + rt] = V[32 + rt];
    for (o(ot, p.subarray(32), G + 32), At(ot), _(gt, ot), k(p, gt), rt = 32; rt < 64; rt++) p[rt] = N[rt];
    for (o(X, p, G + 64), At(X), rt = 0; rt < 64; rt++) st[rt] = 0;
    for (rt = 0; rt < 32; rt++) st[rt] = ot[rt];
    for (rt = 0; rt < 32; rt++)
      for (ht = 0; ht < 32; ht++)
        st[rt + ht] += X[rt] * V[ht];
    return H(p.subarray(32), st), Et;
  }
  function J(p, M, N) {
    var G = new Uint8Array(M.length + v);
    q(G, M, N);
    for (let V = 0; V < v; V++) p[V] = G[V];
  }
  function et(p, M) {
    var N = a(), G = a(), V = a(), X = a(), ot = a(), rt = a(), ht = a();
    return j(p[2], s), K(p[1], M), y(V, p[1]), g(X, V, n), I(V, V, p[2]), A(X, p[2], X), y(ot, X), y(rt, ot), g(ht, rt, ot), g(N, ht, V), g(N, N, X), W(N, N), g(N, N, V), g(N, N, X), g(N, N, X), g(p[0], N, X), y(G, p[0]), g(G, G, X), nt(G, V) || g(p[0], p[0], i), y(G, p[0]), g(G, G, X), nt(G, V) ? (ft(p[0]) === M[31] >> 7 && I(p[0], a(), p[0]), g(p[3], p[0], p[1]), !0) : !1;
  }
  function z(p, M, N) {
    R(p, M.length - v), R(M, v), R(N, T);
    var G = M.length, V = new Uint8Array(M.length), X, ot = new Uint8Array(32), rt = new Uint8Array(64), ht = [a(), a(), a(), a()], st = [a(), a(), a(), a()];
    if (G < 64 || !et(st, N)) return !1;
    for (X = 0; X < G; X++) V[X] = M[X];
    for (X = 0; X < 32; X++) V[X + 32] = N[X];
    if (o(rt, V, G), At(rt), d(ht, st, rt), _(st, M.subarray(32)), $(ht, st), k(ot, ht), G -= 64, !h(M, 0, ot, 0)) {
      for (X = 0; X < G; X++) V[X] = 0;
      return !1;
    }
    for (X = 0; X < G; X++) p[X] = M[X + 64];
    return !0;
  }
  function E(p, M, N) {
    R(p, v);
    var G = new Uint8Array(M.length + v), V = 0;
    for (V = 0; V < v; V++) G[V] = p[V];
    for (V = 0; V < M.length; V++) G[V + v] = M[V];
    return z(M, G, N);
  }
  function ft(p) {
    var M = new Uint8Array(32);
    return u(M, p), M[0] & 1;
  }
  function nt(p, M) {
    var N = new Uint8Array(32), G = new Uint8Array(32);
    return u(N, p), u(G, M), h(N, 0, G, 0);
  }
  function it(p, M) {
    d(p, M, L);
  }
  function It(p) {
    var M = [a(), a(), a(), a()];
    it(M, p);
    var N = 0;
    for (let G = 0; G < 16; G++)
      N |= M[0][G] & 65535;
    return N === 0;
  }
  function at(p, M) {
    R(p, T), R(M, t);
    var N = [a(), a(), a(), a()], G = a([1]), V = a([1]);
    U(
      B(M) && et(N, M) && It(N),
      "Cannot convert key: bad point"
    );
    for (let X = 0; X < N.length; X++)
      u(p, N[X]);
    return I(V, V, N[1]), A(G, G, N[1]), w(V, V), g(G, G, V), u(p, G), 0;
  }
  function B(p) {
    Uint8Array.from([]);
    var M = [
      // 0 (order 4)
      Uint8Array.from([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]),
      // 1 (order 1)
      Uint8Array.from([
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]),
      // 2707385501144840649318225287225658788936804267575313519463743609750303402022(order 8)
      Uint8Array.from([
        38,
        232,
        149,
        143,
        194,
        178,
        39,
        176,
        69,
        195,
        244,
        137,
        242,
        239,
        152,
        240,
        213,
        223,
        172,
        5,
        211,
        198,
        51,
        57,
        177,
        56,
        2,
        136,
        109,
        83,
        252,
        5
      ]),
      // 55188659117513257062467267217118295137698188065244968500265048394206261417927 (order 8)
      Uint8Array.from([
        199,
        23,
        106,
        112,
        61,
        77,
        216,
        79,
        186,
        60,
        11,
        118,
        13,
        16,
        103,
        15,
        42,
        32,
        83,
        250,
        44,
        57,
        204,
        198,
        78,
        199,
        253,
        119,
        146,
        172,
        3,
        122
      ]),
      // p-1 (order 2)
      Uint8Array.from([
        236,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        127
      ]),
      //  p (=0 order 4)
      Uint8Array.from([
        237,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        127
      ]),
      // p + 1 (=1 order 1)
      Uint8Array.from([
        238,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        127
      ])
    ], N = new Uint8Array(7), G;
    R(M, 7);
    for (let X = 0; X < M.length; X++)
      for (G = 0; G < 31; G++)
        N[X] |= p[G] ^ M[X][G];
    for (let X = 0; X < M.length; X++)
      N[X] |= p[G] & 127 ^ M[X][G];
    var V = 0;
    for (let X = 0; X < M.length; X++)
      V |= N[X] - 1;
    return (V >> 8 & 1) === 0;
  }
  function l(p, M) {
    return R(p, t), p.set(M.subarray(P)), p;
  }
  function S(p, M) {
    U(p && p.byteLength === D, "curveSk must be 'crypto_sign_SECRETKEYBYTES' long"), U(M && M.byteLength === Q, "edSk must be 'crypto_sign_ed25519_SECRETKEYBYTES' long");
    var N = new Uint8Array(x);
    return o(N, M, 32), N[0] &= 248, N[31] &= 127, N[31] |= 64, p.set(N.subarray(0, D)), N.fill(0), p;
  }
  function R(p, M, N = "Argument") {
    if (!p || M && p.length < M) throw new Error(N + " must be a buffer" + (M ? " of length " + M : ""));
  }
  return BA;
}
var xe;
function er() {
  return xe || (xe = 1, (function(h) {
    o(bt()), o(ue()), o(Qe()), o(wt()), o(Ke()), o(He()), o(QA()), o(Lt()), o(Pe()), o(Ve()), o(Je()), o(je()), o(we()), o(mt()), o(Se()), o(ze()), o(tr()), o(Ar()), o(_A()), o(pA());
    function o(a) {
      Object.keys(a).forEach(function(C) {
        h.exports[C] = a[C];
      });
    }
  })(Ft)), Ft.exports;
}
var rr = er();
const pt = /* @__PURE__ */ Be(rr);
var ir = St();
const dt = /* @__PURE__ */ Be(ir);
pt.crypto_sign_PUBLICKEYBYTES;
const nr = pt.crypto_sign_SECRETKEYBYTES, fr = pt.crypto_sign_BYTES;
function hr(h, o) {
  if (!dt.isBuffer(o) || !dt.isBuffer(h))
    throw new Error("Invalid message or private key format. Expected Buffers.");
  if (o.length !== nr)
    throw new Error("Invalid private key length");
  const a = dt.alloc(fr);
  return pt.crypto_sign_detached(a, h, o), a;
}
function or(h, o, a) {
  try {
    return pt.crypto_sign_verify_detached(h, o, a);
  } catch (C) {
    console.error(C);
  }
  return !1;
}
const Ir = {
  sign: hr,
  verify: or
};
function ar(h) {
  dt.isBuffer(h) && pt.sodium_memzero(h);
}
const sr = {
  memzero: ar
}, { sign: gr, verify: cr } = Ir, { memzero: Er } = sr;
window.TracCryptoApi = {
  sign: gr,
  verify: cr,
  memzero: Er,
  b4a: dt,
  sodium: pt
};
