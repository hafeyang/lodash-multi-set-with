

const { test } = require('ava');
const _ = require('lodash');
require('../index');

test('multi_set_with: should return as expected', async (t) => {
  const data = { base: 10, items: [{ a: 1, b: 2, c: 5 }, { a: 4, b: 2, c: 5 }, { b: 2, c: 5 }] };
  const res = _(data).multiSetWith("items.$.a,b", (v, context) => v * context.m * context.parent.c, { m: 2 }).value();
  t.deepEqual(res, { base: 10, items: [{ a: 10, b: 20, c: 5 }, { a: 40, b: 20, c: 5 }, { b: 20, c: 5 }] });

  const data2 = { a: { b: 1 }, c: { d: 2 } };
  const res2 = _(data2).multiSetWith("a,c.$", v => v + 1).value();
  t.deepEqual(res2, { a: { b: 2 }, c: { d: 3 } });
});

test('multi_set_with: should return as expected when using $$', async (t) => {
  const data = {
    P: [
      {
        id: 1002,
        from: 1517788800,
        to: 1519833599,
        item: { a: 1 }
      }
    ]
  };
  const res = _(data).multiSetWith("$.$.item", () => undefined).value();
  t.deepEqual(res, {
    P:
      [{
        id: 1002,
        from: 1517788800,
        to: 1519833599,
        item: undefined
      }]
  });
});
test('multi_set_with: should return as expected when using $$', async (t) => {
  const data = {
    P: [
      {
        id: 1002,
        from: 1517788800,
        to: 1519833599,
        item: { a: 1 }
      }
    ]
  };
  const res = _(data).multiSetWith("$.$", (p) => _.omit(p, ['item'])).value();
  t.deepEqual(res, {
    P:
      [{
        id: 1002,
        from: 1517788800,
        to: 1519833599
      }]
  });
});

