# json-patch-stream

JSON-patch utilities for transforming a stream of JSON documents into a stream of JSON patches and vice versa

[![build status](https://secure.travis-ci.org/allain/json-patch-stream.png)](http://travis-ci.org/allain/json-patch-stream)

## Installation

This module is installed via npm:

``` bash
$ npm install json-patch-stream
```

## Example Usage

``` js
var streamify = require('stream-array'),
var stdout = require('stdout');

var jsonPatchStream = require('json-patch-stream');

streamify([{"a": 10}, {"a": 20}])
  .pipe(jsonPatchStream.toPatches())
  .pipe(stdout());

// Ouputs these two json patches
// [ { op: 'add', path: '/a', value: 10 } ]
// [ { op: 'test', path: '/a', value: 10 }, {} op: 'replace', path: '/a', value: 20 } ]

streamify([
  [ { op: 'add', path: '/a', value: 10 } ],
  [ { op: 'test', path: '/a', value: 10 }, {} op: 'replace', path: '/a', value: 20 } ]
])
.pipe(jsonPatchStream.toDocs())
.pipe(stdout());

// Outputs these two docs
// {"a": 10}
// {"a": 20}
```
