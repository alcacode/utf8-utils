"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encodeUTF8(char) {
    if (typeof char !== "string")
        throw new TypeError("argument is not a string");
    var charCode = 0;
    var HI = char.charCodeAt(0);
    var LO = 0;
    if (HI >= 0xD800 && HI <= 0xDBFF) {
        if (isNaN(char.charCodeAt(1)))
            throw new Error("missing UTF-16 surrogate pair");
        LO = char.charCodeAt(1) - 0xDC00;
        HI = (HI - 0xD800) << 10;
        charCode = 0x10000;
    }
    charCode += HI | LO;
    if (charCode <= 0x7F)
        return charCode;
    var bitLen = 0;
    var offset = 0;
    var tmp = 0;
    var head = 0x80;
    while ((charCode >>> offset) > (0x1F >> (bitLen >> 3)) && 32 ^ bitLen) {
        tmp |= (0x80 | ((charCode & (0x3F << offset)) >>> offset)) << bitLen;
        head |= (head >> 1) ^ head;
        bitLen += 8;
        offset += 6;
    }
    return (((head | (charCode >>> offset)) << bitLen) | tmp) >>> 0;
}
exports.encodeUTF8 = encodeUTF8;
function decodeUTF8(charCode) {
    charCode = (charCode | 0) >>> 0;
    if (charCode < 0 || charCode > 0xFFFFFFFF)
        throw new RangeError("invalid UTF-8 character code");
    if (charCode <= 0x7F)
        return String.fromCharCode(charCode);
    var bitLen = 24;
    while (!(charCode >>> bitLen))
        bitLen -= 8;
    var HI = ((charCode >>> bitLen) & (0x3F >> (bitLen >> 3))) << (6 * (bitLen >> 3));
    var LO = 0;
    while ((bitLen -= 8) >= 0)
        HI += ((charCode >>> bitLen) & 0x3F) << ((bitLen >> 3) * 6);
    if ((HI >= 0xD800 && HI <= 0xDBFF) || HI > 0x10FFFF)
        throw new Error("UTF-16 encoding error");
    if (HI >= 0x10000) {
        HI -= 0x10000;
        LO = 0xDC00 + (HI & 0x3FF);
        HI = 0xD800 + (HI >>> 10);
        return String.fromCharCode(HI) + String.fromCharCode(LO);
    }
    return String.fromCharCode(HI);
}
exports.decodeUTF8 = decodeUTF8;
