var through2 = require('through2');
var jiff = require('jiff');

function objectHash(obj) {
  return obj.id || obj._id || obj.hash || JSON.stringify(obj);
}

function toPatches(doc, hashObject) {
  doc = doc || {};

  return through2.obj(function(newDoc, encoding, cb) {
    var patch = jiff.diff(doc, newDoc, objectHash);
    if (!patch) return cb(new Error('Unable to create patch'));
    this.push(patch);
    doc = newDoc;
    cb();
  });
}

function toDocs(doc) {
  doc = doc || {};

  return through2.obj(function(patch, encoding, cb) {
    try {
      doc = jiff.patch(patch, doc);
      this.push(doc);
      cb();
    } catch(e) {
      cb(e);
    }
  });
}

module.exports = {
  toPatches: toPatches,
  toDocs: toDocs
};
