# JavaScript Practice Sheet for Angular Dev Interviews (25 Q&A)

A targeted set of 25 JavaScript questions with clear, concise answers and code snippets—focused on ES6+ fundamentals, async behavior, immutability, `this`/closures, and JS principles that underpin Angular + TypeScript work.

---

## 1) What’s the difference between `var`, `let`, and `const`?
**Answer:**
- `var`: function-scoped, hoisted with initialization to `undefined`, can be redeclared.
- `let`: block-scoped, hoisted but temporal dead zone (not initialized), cannot be redeclared in the same scope.
- `const`: block-scoped, must be initialized, binding is immutable (but object contents can still mutate).

```js
function test() {
  console.log(a); // undefined
  // console.log(b); // ReferenceError (TDZ)
  var a = 1;
  let b = 2;
  const c = 3;
}
```

---

## 2) Explain hoisting for functions and variables.
**Answer:**
- Function declarations are hoisted entirely (callable before definition).
- Variable declarations (`var`, `let`, `const`) are hoisted, but only `var` gets initialized to `undefined`; `let`/`const` stay in the TDZ until their declaration.

```js
f(); // works
function f(){}

console.log(x); // undefined
var x = 10;

console.log(y); // ReferenceError
let y = 20;
```

---

## 3) What is a closure and why does it matter?
**Answer:**
A closure is when a function retains access to variables from its lexical scope even after the outer function has returned. Useful for private state (services), event handlers, and factory patterns.

```js
function makeCounter() {
  let c = 0;
  return () => ++c;
}
const inc = makeCounter();
inc(); // 1
inc(); // 2
```

---

## 4) Explain `this` in regular functions vs arrow functions.
**Answer:**
- Regular functions: `this` is dynamic—depends on call site (`obj.method()`, `call/apply/bind`, or `undefined`/global in strict mode).
- Arrow functions: `this` is lexically bound to the surrounding scope (no own `this`).

```js
const obj = {
  name: 'Satyajeet',
  greet() { console.log(this.name); }, // 'Satyajeet'
  greetArrow: () => console.log(this.name) // likely undefined
};
obj.greet();
obj.greetArrow();
```

---

## 5) How do `call`, `apply`, and `bind` differ?
**Answer:**
- `call(thisArg, ...args)` – invoke immediately with this + args.
- `apply(thisArg, argsArray)` – invoke immediately with this + array.
- `bind(thisArg, ...args)` – returns a new function with bound `this` and optional preset args.

```js
function greet(a,b){ console.log(this.name, a, b); }
const user = { name: 'Satyajeet' };
greet.call(user, 1, 2);
greet.apply(user, [1,2]);
const g = greet.bind(user, 1);
g(2);
```

---

## 6) What is the event loop? Explain microtasks vs macrotasks.
**Answer:**
- Macrotasks: `setTimeout`, `setInterval`, I/O, DOM events.
- Microtasks: Promises (`.then`), `queueMicrotask`, `MutationObserver`.
Microtasks run before the next macrotask after current synchronous code finishes.

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Output: A D C B
```

---

## 7) Output ordering with Promises and setTimeout.
```js
Promise.resolve()
  .then(() => console.log('P1'))
  .then(() => console.log('P2'));

setTimeout(() => console.log('T1'), 0);

console.log('S');
```
**Answer:** `S` (sync), then microtasks `P1`, `P2`, then macrotask `T1`. Order: `S`, `P1`, `P2`, `T1`.

---

## 8) Shallow vs deep copy with spread.
**Answer:**
Spread (`{...obj}` / `[...arr]`) makes a shallow copy: nested objects/arrays still reference the same memory.

```js
const state = { user: { name: 'X' }, list: [1,2] };
const copy = { ...state };
copy.user.name = 'Y';
console.log(state.user.name); // 'Y' (same nested reference)
```

---

## 9) Immutable updates for arrays/objects.
**Answer:** Use spread, `map`, `filter`, etc.

```js
const arr = [1,2,3];
const arr2 = arr.map(x => x === 2 ? 20 : x);

const obj = {a:1,b:2};
const obj2 = { ...obj, b: 99 };
```

---

## 10) `map` vs `forEach` vs `reduce` use cases.
**Answer:**
- `map`: transform elements; returns new array.
- `forEach`: iterate with side effects; returns `undefined`.
- `reduce`: accumulate to a single value (sum, group, object).

```js
[1,2,3].map(x => x*2);
[1,2,3].forEach(x => console.log(x));
[1,2,3].reduce((sum,x)=>sum+x,0);
```

---

## 11) Difference between `==` and `===`.
**Answer:**
- `===`: strict equality (no type coercion).
- `==`: abstract equality with coercion—can be surprising (`'' == 0` is true, `null == undefined` is true). Prefer `===`.

---

## 12) Destructuring with defaults and renaming.
**Answer:**

```js
const { a = 1, b: beta = 2 } = { b: 5 };
console.log(a, beta); // 1, 5
```

---

## 13) Template literals and tagged templates.
**Answer:**
Template literals: backticks with interpolation. Tagged templates: a function processes the template parts + values.

```js
const name = 'Satyajeet';
console.log(`Hello ${name}`);

function tag(strings, ...vals) {
  // strings = ['Hello ', ''], vals = ['Satyajeet']
  return strings[0].toUpperCase() + vals[0].toLowerCase();
}
tag`Hello ${name}`;
```

---

## 14) How modules work (`import`/`export`) and why they matter.
**Answer:**
ES6 modules use static `import/export`. Tree-shakeable, scoped, and predictable order. Angular/TypeScript compiles them; using modules enables lazy loading and clean boundaries.

```js
// math.js
export function add(a,b){ return a+b; }
// index.js
import { add } from './math.js';
```

---

## 15) Prototype and class syntax relationship.
**Answer:**
Classes are syntactic sugar over prototypes. Methods are stored on `ClassName.prototype`.

```js
class Person {
  greet(){ console.log('hi'); }
}
console.log(typeof Person); // 'function'
console.log(Person.prototype.greet); // function
```

---

## 16) What are `Map` and `Set` good for?
**Answer:**
- `Map`: key-value store with keys of any type, maintains insertion order.
- `Set`: unique values collection.

```js
const m = new Map([['a',1]]);
m.set({k:1}, 'val');

const s = new Set([1,2,2,3]); // {1,2,3}
```

---

## 17) Debounce a function.
**Answer:**

```js
function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
```

---

## 18) Throttle a function.
**Answer:**

```js
function throttle(fn, interval = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
```

---

## 19) `this` gotcha and fix.
```js
const user = {
  name: 'Satyajeet',
  greet() { console.log(`Hi ${this.name}`); }
};
const g = user.greet;
g(); // ?
```
**Answer:** `this` is `undefined` (strict mode) or global, so prints `Hi undefined`. Fix by binding or calling via object.

```js
const g2 = user.greet.bind(user);
g2();
user.greet();
```

---

## 20) Error handling with `async/await`.
**Answer:** Use `try/catch` around `await`. Be mindful of parallel vs sequential awaits.

```js
async function load() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error('Failed: ' + err.message);
  }
}
```

---

## 21) Converting callback to Promise.
**Answer:** Wrap callback-style APIs.

```js
function readFilePromise(readFile, path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

---

## 22) `for...of`, `for...in`, and iterables.
**Answer:**
- `for...in`: enumerates keys (including inherited) of objects—avoid on arrays.
- `for...of`: iterates values of an iterable (arrays, strings, Maps, Sets).
- Iterables implement `[Symbol.iterator]`.

```js
for (const v of [10,20]) console.log(v);
for (const k in {a:1,b:2}) console.log(k);
```

---

## 23) Custom iterable.
**Answer:** Implement `[Symbol.iterator]` that returns an object with `next()`.

```js
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    return {
      next: () => (cur <= this.to)
        ? { value: cur++, done: false }
        : { done: true }
    };
  }
};
for (const n of range) console.log(n); // 1,2,3
```

---

## 24) Promise chaining vs `async/await` pitfalls.
**Answer:**
- Chaining: errors propagate via `.catch`, but nested chains can get messy.
- `async/await`: linear style; avoid awaiting sequentially when you can parallelize.

```js
// Sequential
const a = await getA();
const b = await getB();
// Parallel
const [a2, b2] = await Promise.all([getA(), getB()]);
```

---

## 25) How does async code affect Angular change detection (conceptually)?
**Answer:**
Angular (Zone.js) patches async APIs (Promise microtasks, timers) to know when tasks complete and trigger change detection. Using immutable patterns and minimizing unnecessary async churn improves performance, especially with OnPush components.

---

## Bonus Quick Challenges

### A) Output order challenge
```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);
// Answer: 1,5,3,4,2
```

### B) Shallow copy gotcha
```js
const a = [{x:1}];
const b = [...a];
b[0].x = 99;
console.log(a[0].x); // 99 (same reference)
```

### C) Optional chaining & nullish coalescing
```js
const user = { profile: { name: 'S' } };
const nick = user?.profile?.nickname ?? 'N/A';
console.log(nick); // 'N/A'
```

### D) Merge arrays immutably
```js
const a1 = [1,2], a2 = [3];
const merged = [...a1, ...a2]; // [1,2,3]
```

### E) Arrow vs method in utilities (conceptual)
Prefer arrow functions for lexical `this` in JS utilities; in Angular components, use class methods (Angular handles template binding).

---

## Drill Plan (3–5 days)
- **Day 1:** Scope, hoisting, closures, `this`, `bind/apply/call`
- **Day 2:** Arrays/objects: map/filter/reduce; immutability; shallow vs deep copy
- **Day 3:** Promises, `async/await`, event loop (microtask vs macrotask)
- **Day 4:** Iterables, Map/Set, modules; error handling patterns
- **Day 5:** Integrate JS concepts with Angular mental models (OnPush, async flows); timed quizzes
