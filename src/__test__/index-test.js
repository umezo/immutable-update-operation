//@flow
const test = require('ava');
const {update} = require('..');

test('update simple object', function(t) {
  const target = {
    a: 1,
  };

  const result = update(target, ['a'], function(value) {
    return value + 5;
  });

  t.deepEqual(result, {a: 6});
  t.deepEqual(target, {a: 1});
});

test('update simple array', function(t) {
  const target = [0, 1, 2];
  const result = update(target, [1], function(value) {
    return value + 5;
  });

  t.deepEqual(result, [0, 6, 2]);
  t.deepEqual(target, [0, 1, 2]);
});

test('update nested array/array', function(t) {
  const target = [
    [0, 1, 2],
    [],
  ];
  const result = update(target, [0, 1], function(value) {
    return value + 5;
  });

  t.deepEqual(result, [[0, 6, 2], []]);
  t.deepEqual(target, [[0, 1, 2], []]);
});

test('update nested array/object/array finding with function', function(t) {
  const target = [
    {a: 1, items: [0, 1, 2]},
    {a: 2, items: []},
  ];
  const result = update(target, [
    function(obj) {return obj.a === 1;},
    'items',
    1,
  ], function(value) {
    return value + 5;
  });

  t.deepEqual(result, [{a: 1, items: [0, 6, 2]}, {a: 2, items: []}]);
  t.deepEqual(target, [{a: 1, items: [0, 1, 2]}, {a: 2, items: []}]);
});

test('update nested array with array', function(t) {
  const target = [
    [0, 1, 2],
    [],
  ];
  const result = update(target, [0], function() {
    return [4, 5, 6];
  });

  t.deepEqual(result, [[4, 5, 6], []]);
  t.deepEqual(target, [[0, 1, 2], []]);
});

test('update nested object with object', function(t) {
  const target = {
    a: {},
    b: {},
  };
  const result = update(target, ['b'], function() {
    return {updated: true};
  });

  t.deepEqual(result, {a: {}, b: {updated: true}});
  t.deepEqual(target, {a: {}, b: {}});
});
