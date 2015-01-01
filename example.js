var streamify = require('stream-array');
var stdout = require('stdout');

var jsonPatchStream = require('./index.js');

streamify([{a: 10},{a: 20}, null])
  .pipe(jsonPatchStream.toPatches())
  .pipe(stdout());

streamify([
  [ { op: 'add', path: '/a', value: 10 } ],
  [ { op: 'test', path: '/a', value: 10 }, { op: 'replace', path: '/a', value: 20 } ]
])
  .pipe(jsonPatchStream.toDocs())
  .pipe(stdout());
