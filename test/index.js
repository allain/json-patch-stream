var assert = require('chai').assert,
    streamify = require('stream-array'),
    jsonPatchStream = require('..'),
    through2 = require('through2');

function collect(cb) {
  var data = [];

  var stream = through2.obj(function(item, enc, done) {
    data.push(item);
    done();
  });

  stream.on('finish', function() {
    cb(data);
  });

  return stream;
}

describe('json-patch-stream', function() {
  describe('toPatches', function() {
    it('should emit proper patch from empty doc', function(done) {
      streamify([{a: 10}, null]).pipe(jsonPatchStream.toPatches()).pipe(collect(function(result) {
        assert.deepEqual(result, [
          [
            {op: 'add', path: '/a', value: 10}
          ]
        ]);
        done();
      }));
    });

    it('emits empty patch when no change', function(done) {
      streamify([{}, null]).pipe(jsonPatchStream.toPatches()).pipe(collect(function(result) {
        assert.deepEqual(result, [[]]);
        done();
      }));
    });

    it('should emit proper patches for sequence', function(done) {
      streamify([{a: 10}, {a: 20}, null]).pipe(jsonPatchStream.toPatches()).pipe(collect(function(result) {
        assert.deepEqual(result, [
          [
            {op: 'add', path: '/a', value: 10}
          ],
          [
            {"op": "test", "path": "/a", "value": 10},
            {"op": "replace", "path": "/a", "value": 20}
          ]
        ]);
        done();
      }));
    });
  });

  describe('toDocs', function() {
    it('should emit proper doc from empty doc', function(done) {
      streamify([[{op: 'add', path: '/a', value: 10}], null]).pipe(jsonPatchStream.toDocs()).pipe(collect(function(result) {
        assert.deepEqual(result, [{a: 10}]);
        done();
      }));
    });

    it('emits empty doc when empty patch', function(done) {
      streamify([[], null]).pipe(jsonPatchStream.toDocs()).pipe(collect(function(result) {
        assert.deepEqual(result, [{}]);
        done();
      }));
    });

    it('should emit proper patches for sequence', function(done) {
      streamify([{a: 10}, {a: 20}, null]).pipe(jsonPatchStream.toPatches()).pipe(collect(function(result) {
        assert.deepEqual(result, [
          [{op: 'add', path: '/a', value: 10}],
          [{op: "test", path: "/a", value: 10}, {op: "replace", path: "/a", value: 20}]
        ]);
        done();
      }));
    });
  });

  describe('two way', function() {
    it('two way works', function(done) {
      var pipelineDocs = [{a: 10}, {b: false, c: "Testing"}];

      streamify(JSON.parse(JSON.stringify(pipelineDocs)))
        .pipe(jsonPatchStream.toPatches())
        .pipe(jsonPatchStream.toDocs())
        .pipe(collect(function(result) {
          assert.deepEqual(result, pipelineDocs);
          done();
        }));
    });
  });
});
