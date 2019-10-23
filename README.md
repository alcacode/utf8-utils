# utf8

Utilities to encode JavaScript characters (UTF-16) as UTF-8 character codes, and to decode UTF-8 character codes to UTF-16 encoded strings.

## encodeUTF8

Converts a UTF-16 encoded character (as in, the first character of a string) to a UTF-8 character code.

### Parameters

- char \<string> Character to encode.

### Returns

Number. A UTF-8 character code.

### Exceptions

Throws `TypeError` when type of `char` is not string.

Throws `Error` when a high surrogate is found without corresponding low surrogate.

### Example

```JavaScript
encodeUTF8("€") // 111000101000001010101100 (base 2)
```

## decodeUTF8

Converts a UTF-8 character code to a UTF-16 encoded string.

### Parameters

- charCode \<number> Valid UTF-8 character code.

### Returns

String. UTF-16 encoded representation of `charCode`.

### Exceptions

Throws `Error` when `charCode` produce an invalid UTF-16 character point. That is, if it is in the range 0xD800 .. 0xDBFF or exceeds 0x10FFFF.

### Example

```JavaScript
decodeUTF8(0b111000101000001010101100) // '€'
```
