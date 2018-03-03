# lodash-multil-set-with
`lodash-multil-set-with` a [lodash](https://github.com/lodash/lodash) mixin used to manipulate javascript object elegantly

assume we want mapping `status` value in an object `[{toreview:{status:1},reviewed:{status:2}},toreview:{status:1},reviewed:{status:2}}]`

here is the code :

```js

const arr = [{toreview:{status:1},reviewed:{status:2}},{toreview:{status:1},reviewed:{status:2}}];

const mapping = (s) => ({1:"pending",2:"done"}[s]);

arr.forEach((row)=>{
  row.toreview.status = mapping(row.toreview.status);
  row.reviewed.status = mapping(row.reviewed.status);
});

```
now we can code like this:
```js

const _ = require('lodash');
require('lodash-multi-set-with'); // now we have `multiSetWith` method

_.multiSetWith(arr,"*.toreview,reviewed.status",mapping);

```

## API

`_.multiSetWith(object, expression, mapping, [context]):object`

### `expression`:

* `key.subkey` object key or array index
* `key1,key2` multiple sibling keys or array indexes
* `$` all keys

### `context`:

you can access `parent` `level` in context ,merged with `context` argument


```js
const data = { base: 10, items: [{ a: 1, b: 2, c: 5 }, { a: 4, b: 2, c: 5 }, { b: 2, c: 5 }] };

const res = _(data).multiSetWith(
  "items.$.a,b",
  // context.m :2 context.parent.c: sibling field
  (v, context) => v * context.m * context.parent.c,
  { m: 2 }
).value();

// { base: 10, items: [{ a: 10, b: 20, c: 5 }, { a: 40, b: 20, c: 5 }, { b: 20, c: 5 }] }


```


## Deployment

clone this repo

`npm i`

`npm run test` run tests

depth filtering object inspired from [https://gist.github.com/hafeyang/1d1295005cb58fb1ab0925216ccefe08](https://gist.github.com/hafeyang/1d1295005cb58fb1ab0925216ccefe08)

## Built With

* [Travis CI](https://travis-ci.org)

## Authors

* [hafeyang](https://github.com/hafeyang)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details