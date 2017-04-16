---
layout: post.hbs
kind: documentation
title: ifnot
cat: 4
subCat: Control flow
---

### Purpose
The `ifnot` binding is exactly the same as [the `if` binding](#if-binding), except that it inverts the result of whatever expression you pass to it. For more details, see documentation for [the `if` binding](#if-binding).

### Note: "ifnot" is the same as a negated "if"

The following markup:

```html
<div data-bind="ifnot: someProperty">...</div>
```

... is equivalent to the following:

```html
<div data-bind="if: !someProperty()">...</div>
```

... assuming that `someProperty` is *observable* and hence you need to invoke it as a function to obtain the current value.

The only reason to use `ifnot` instead of a negated `if` is just as a matter of taste: many developers feel that it looks tidier.
