/**
 * Utilities to convert UTF-16 encoded strings (i.e. JavaScript strings) into
 * UTF-8 character codes and UTF-8 character codes into UTF-16 encoded strings.
 * 
 * @author alcacode
 * @version 1.0.0
 * @module utf8
 */

 
/**
 * Converts a _single_ UTF-16 encoded character (encoding used in JavaScript) to
 * a UTF-8 character code.
 * @param char Character to encode
 * @see decodeUTF8
 */
export function encodeUTF8(char: string) {
        if (typeof char !== "string")
                throw new TypeError("argument is not a string");

        let charCode = 0;
        let HI = char.charCodeAt(0);
        let LO = 0;

        // UTF-16 surrogate pairs
        if (HI >= 0xD800 && HI <= 0xDBFF) {
                if (isNaN(char.charCodeAt(1)))
                        throw new Error("missing UTF-16 surrogate pair")

                LO = char.charCodeAt(1) - 0xDC00;
                HI = (HI - 0xD800) << 10;
                charCode = 0x10000;
        }

        charCode += HI | LO;
        
        // Character codes 0..127 are encoded identically.
        if (charCode <= 0x7F)
                return charCode;

        let bitLen = 0;
        let offset = 0;
        let tmp = 0;
        let head = 0x80;
        while ((charCode >>> offset) > (0x1F >> (bitLen >> 3)) && 32 ^ bitLen) {
                tmp  |= (0x80 | ((charCode & (0x3F << offset)) >>> offset)) << bitLen;
                head |= (head >> 1) ^ head;
                bitLen += 8;
                offset += 6;
        }

        return (((head | (charCode >>> offset)) << bitLen) | tmp) >>> 0;
}

/**
 * Decodes a _single_ UTF-8 character code into a regular JavaScript string (UTF-16).
 * @param charCode Valid UTF-8 character code
 * @throws 
 * @see encodeUTF8
 */
export function decodeUTF8(charCode: number) {
        charCode = (charCode | 0) >>> 0;

        if (charCode < 0 || charCode > 0xFFFFFFFF)
                throw new RangeError("invalid UTF-8 character code")

        // Character codes 0..127 are encoded identically.
        if (charCode <= 0x7F)
                return String.fromCharCode(charCode);

        let bitLen = 24;
        while (!(charCode >>> bitLen))
                bitLen -= 8;

        // Grab the data bits from the first byte.
        // Offset by length in bits minus the length of all continuation bits.
        let HI = ((charCode >>> bitLen) & (0x3F >> (bitLen >> 3))) << (6 * (bitLen >> 3));
        let LO = 0;

        while ((bitLen -= 8) >= 0)
                HI += ((charCode >>> bitLen) & 0x3F) << ((bitLen >> 3) * 6);

        // Ensure code point is valid
        if ((HI >= 0xD800 && HI <= 0xDBFF) || HI > 0x10FFFF)
                throw new Error("UTF-16 encoding error");

        // UTF-16 surrogate pairs
        if (HI >= 0x10000) {
                HI -= 0x10000;
                LO = 0xDC00 + (HI & 0x3FF);
                HI = 0xD800 + (HI >>> 10);

                return String.fromCharCode(HI) + String.fromCharCode(LO);
        }

        return String.fromCharCode(HI);
}