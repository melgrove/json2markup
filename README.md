# json2markup

[![NPM version](https://img.shields.io/npm/v/json2markup.svg?style=flat)](https://www.npmjs.com/package/json2markup)

Converts JSON into formatted markup. Creates nested ordered and unordered lists in either HTML or Markdown. Has an extremely simple API with optional HTML sanitization. Arrays are interpreted as ordered lists and objects are interpreted as unordered lists.

## Usage

```javascript
const json2markup = require('json2markup');
```

### json2markup(objectToConvert, config)

**`objectToConvert`** *required* (`string`, `object`, or `array`): *Strings are interpreted as JSON and parsed, objects and arrays are interpreted literally*

**`config`** *optional* (`object`): *Configuration properties*

- `return` (`'html'` or `'markdown'`, default `'html'`): Output file type
- `sanitize` (`boolean`): Sanitize HTML?

**Returns** (`string`):  HTML or Markdown string

---

### Examples

**`example.json`**

```json
{
	"unordered lists are created from objects": {
        "foo": true,
        "bar": false
    },
    "ordered lists are created from arrays": [
        "this is an example",
        {
            "nested": true,
            "more nesting": [
                true,
                [
                    "even",
                    {
                        "more": "and",
                        "even": "more"
                    }
                ]
            ]
        },
        "another element"
    ]
}
```

**`example.js`**

```javascript
const json2markup = require('json2markup');
const fs = require('fs')

let myJSON = fs.readFileSync('example.json', 'utf8')

json2markup(myJSON, {return: 'markdown'})
```

**Returns:**

*   unordered lists are created from objects:
    *   foo: true
    *   bar: false
*   ordered lists are created from arrays:
    1.  this is an example
    2.  *   nested: true
        *   more nesting:
            1.  true
            2.  1.  even
                2.  *   more: and
                    *   even: more
    3.  another element

**Or with HTML:**

```javascript
json2markup(myJSON)
```

**Returns:**

```html
<ul><li>unordered lists are created from objects: <ul><li>foo: true</li><li>bar: false</li></ul></li><li>ordered lists are created from arrays: <ol><li>this is an example</li><li><ul><li>nested: true</li><li>more nesting: <ol><li>true</li><li><ol><li>even</li><li><ul><li>more: and</li><li>even: more</li></ul></li></ol></li></ol></li></ul></li><li>another element</li></ol></li></ul>
```

---

**You can also pass JavaScript objects and arrays, and sanitize HTML**

```javascript
const obj = {
    one: ['foo', 'bar', 'baz'],
    two: "don't mind<body onafterprint=alert(1)> me!"
}

json2markup(obj, {return: 'markdown', sanitize: true})
```

**Returns:**

*   one:
    1.  foo
    2.  bar
    3.  baz
*   two: don't mind me!

























