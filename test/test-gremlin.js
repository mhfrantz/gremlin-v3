'use strict';

var _ = require('lodash');
var assert = require('assert');
var sinon = require('sinon');
var Gremlin = require('../lib/gremlin');
var GraphWrapper = require('../lib/graph-wrapper');

suite('gremlin', function () {
  var gremlin;
  var graph;
  var g;

  suiteSetup(function () {
    gremlin = new Gremlin();
  });

  setup(function () {
    var TinkerGraphFactory = gremlin.java.import('com.tinkerpop.gremlin.tinkergraph.structure.TinkerFactory');
    graph = TinkerGraphFactory.createClassicSync();
    g = new GraphWrapper(gremlin, graph);
  });

  test('Wrapped objects can be converted to JS objects using gremlin.toJSON', function (done) {
    g.v(2, function (err, res) {
      assert.ifError(err);
      gremlin.toJSON(res, function (err, json) {
        assert.ifError(err);
        assert(json.id === 2);
        done();
      });
    });
  });

  test('Wrapped objects can be converted to JS objects using gremlin.toJSONSync', function (done) {
    g.v(2, function (err, res) {
      assert.ifError(err);
      var json = gremlin.toJSONSync(res);
      assert(json.id === 2);
      done();
    });
  });

  test('gremlin.toJSON returns null when passed null', function (done) {
    gremlin.toJSON(null, function (err, json) {
      assert.ifError(err);
      assert.strictEqual(json, null);
      done();
    });
  });

  test('gremlin.toJSON returns undefined when passed undefined', function (done) {
    gremlin.toJSON(undefined, function (err, json) {
      assert.ifError(err);
      assert.strictEqual(json, undefined);
      done();
    });
  });

  test('gremlin.toList(jsarray) using callback API', function (done) {
    gremlin.toList(['a', 'b', 'c'], function (err, list) {
      assert.ifError(err);
      assert(gremlin.isType(list, 'java.util.Collection'));
      done();
    });
  });

  test('gremlin.toList(jsarray) using promise API', function (done) {
    gremlin.toList(['a', 'b', 'c'])
      .then(function (list) { assert(gremlin.isType(list, 'java.util.Collection')); }, assert.ifError)
      .done(done);
  });

});
