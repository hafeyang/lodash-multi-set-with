
/**
 * multi_set_with is a lodash extension to set any field in an object with spcified context
 // const data = { base: 10, items: [{ a: 1, b: 2 }, { a: 4, b: 2 }, { b: 2 }] };
 // console.log(multiSetWith(data, "items.$.a,b", (v, context) => v * context.m, { m: 2 }));
 // console.log(_(data).multiSetWith("items.$.a,b", (v, context) => v * context.m, { m: 2 }));
 // returns  { base: 10,items: [ { a: 2, b: 4 }, { a: 8, b: 4 }, { b: 4, a: NaN } ] }
 */
const _ = require('lodash');

/**
 * determine object is plan object
 * @param {*} o object to test
 * @returns {Boolean} is plan object
 */
const isObject = o => Object.prototype.toString.call(o) === "[object Object]";

/**
 * get filtered immediate children elements
 * @param {*} o  object
 * @returns {Array} filtered children array
 */
const getFilteredChildren = (o, k = "") => {
  const keys = k.split(",");
  let children = [];
  if (Array.isArray(o) || isObject(o)) {
    const target = k === "$" ? _(o) : _(o).pick(keys);
    const targetKeys = target.keys().value();
    children = target.values().value().map((v, i) => ({
      value: v,
      key: targetKeys[i],
      parent: o
    }));
  }
  return children;
};
// console.log(getFilteredChildren({ a: 1, b: 2 }, "$"));
// console.log(getFilteredChildren({ a: 1, b: 2 }, "a,b"));
// console.log(getFilteredChildren([1,2], "0,1"));
// console.log(getFilteredChildren([1,2], "$"));
// console.log(getFilteredChildren("", "$"));

const multiSetWith = (root, expr, replacer = v => v, context = {}) => {
  const exprChunks = expr.split('.');
  const level = 0;
  let arr = getFilteredChildren(root, exprChunks[level]);
  arr.forEach((row) => { row.level = level; });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].level < exprChunks.length - 1) {
      const children = getFilteredChildren(arr[i].value, exprChunks[arr[i].level + 1]);
      children.forEach((row) => { row.level = arr[i].level + 1; });
      arr = arr.concat(children);
    }
    if (arr[i].level === exprChunks.length - 1) { // tail
      arr[i].parent[arr[i].key] = replacer(arr[i].value, Object.assign({}, context, arr[i]));
    }
  }
  return root;
};
// const data = { base: 10, items: [{ a: 1, b: 2, c: 5 }, { a: 4, b: 2, c: 5 }, { b: 2, c: 5 }] };
// console.log(multiSetWith(data, "$.$.a"));
// console.log(multiSetWith(
//   data,
//   "items.$.a,b",
//   (v, context) => v * context.m * context.parent.c,
//   { m: 2 }
// ));


// extend lodash
_.mixin({ multiSetWith });

module.exports = multiSetWith;