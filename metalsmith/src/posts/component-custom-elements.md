---
layout: post.hbs
kind: documentation
title: Custom Component Elements
cat: 3
subCat: Components
---

Custom elements provide a convenient way of injecting [components](#component-overview) into your views.

* [Table of contents injected here]
{:toc}

### Introduction

Custom elements are a syntactical alternative to the [`component` binding](component-binding.html) (and in fact, custom elements make use of a component binding behind the scenes).

For example, instead of writing this:

```html
<div data-bind='component: { name: "flight-deals", params: { from: "lhr", to: "sfo" } }'></div>
```

... you can write:

```html
<flight-deals params='from: "lhr", to: "sfo"'></flight-deals>
```

This allows for a very modern, [WebComponents](http://www.w3.org/TR/components-intro/)-like way to organize your code, while retaining support for even very old browsers (see [custom elements and IE 6 to 8](#note-custom-elements-and-internet-explorer-6-to-8)).

### Example

This example declares a component, and then injects two instances of it into a view. See the source code below.

```html
<live-example params='id: "component-custom-element"'></live-example>
```

Note: In more realistic cases, you would typically load component viewmodels and templates from external files, instead of hardcoding them into the registration. See [an example](#component-overview.html#example-loading-the-likedislike-widget-from-external-files-on-demand) and [registration documentation](#component-registration).

### Passing parameters

As you have seen in the examples above, you can use a `params` attribute to supply parameters to the component viewmodel. The contents of the `params` attribute are interpreted like a JavaScript object literal (just like a `data-bind` attribute), so you can pass arbitrary values of any type. Example:

```html
<unrealistic-component
    params='stringValue: "hello",
            numericValue: 123,
            boolValue: true,
            objectValue: { a: 1, b: 2 },
            dateValue: new Date(),
            someModelProperty: myModelValue,
            observableSubproperty: someObservable().subprop'>
</unrealistic-component>
```

#### Communication between parent and child components

If you refer to model properties in a `params` attribute, then you are of course referring to the properties on the viewmodel outside the component (the 'parent' or 'host' viewmodel), since the component itself is not instantiated yet. In the above example, `myModelValue` would be a property on the parent viewmodel, and would be received by the child component viewmodel's constructor as `params.someModelProperty`.

This is how you can pass properties from a parent viewmodel to a child component. If the properties themselves are observable, then the parent viewmodel will be able to observe and react to any new values inserted into them by the child component.

#### Passing observable expressions

In the following example,

```html
<some-component
    params='simpleExpression: 1 + 1,
            simpleObservable: myObservable,
            observableExpression: myObservable() + 1'>
</some-component>
```

... the component viewmodel's `params` parameter will contain three values:

  * `simpleExpression`
      * This will be the numeric value `2`. It will not be an observable or computed value, since there are no observables involved.

        In general, if a parameter's evaluation does not involve evaluating an observable (in this case, the value did not involve observables at all), then the value is passed literally. If the value was an object, then the child component could mutate it, but since it's not observable the parent would not know the child had done so.

  * `simpleObservable`
      * This will be the [`ko.observable`](observables.html) instance declared on the parent viewmodel as `myObservable`. It is not a wrapper --- it's the actual same instance as referenced by the parent. So if the child viewmodel writes to this observable, the parent viewmodel will receive that change.

        In general, if a parameter's evaluation does not involve evaluating an observable (in this case, the observable was simply passed without evaluating it), then the value is passed literally.

  * `observableExpression`
      * This one is trickier. The expression itself, when evaluated, reads an observable. That observable's value could change over time, so the expression result could change over time.

        To ensure that the child component can react to changes in the expression value, Knockout **automatically upgrades this parameter to a computed property**. So, the child component will be able to read `params.observableExpression()` to get the current value, or use `params.observableExpression.subscribe(...)`, etc.

        In general, with custom elements, if a parameter's evaluation involves evaluating an observable, then Knockout automatically constructs a `ko.computed` value to give the expression's result, and supplies that to the component.

In summary, the general rule is:

  1. If a parameter's evaluation **does not** involve evaluating an observable/computed, it is passed literally.
  2. If a parameter's evaluation **does** involve evaluating one or more observables/computeds, it is passed as a computed property so that you can react to changes in the parameter value.

### Passing markup into components

Sometimes you may want to create a component that receives markup and uses it as part of its output. For example, you may want to build a "container" UI element such as a grid, list, dialog, or tab set that can receive and bind arbitrary markup inside itself.

Consider a special list component that can be invoked as follows:

```html
<my-special-list params="items: someArrayOfPeople">
    <!-- Look, I'm putting markup inside a custom element -->
    The person <em data-bind="text: name"></em>
    is <em data-bind="text: age"></em> years old.
</my-special-list>
```

By default, the DOM nodes inside `<my-special-list>` will be stripped out (without being bound to any viewmodel) and replaced by the component's output. However, those DOM nodes aren't lost: they are remembered, and are supplied to the component in two ways:

 * As an array, `$componentTemplateNodes`, available to any binding expression in the component's template (i.e., as a [binding context](binding-context.html) property). Usually this is the most convenient way to use the supplied markup. See the example below.
 * As an array, `componentInfo.templateNodes`, passed to its [`createViewModel` function](component-registration.html#a-createviewmodel-factory-function)

The component can then choose to use the supplied DOM nodes as part of its output however it wishes, such as by using `template: { nodes: $componentTemplateNodes }` on any element in the component's template.

For example, the `my-special-list` component's template can reference `$componentTemplateNodes` so that its output includes the supplied markup. Here's the complete working example:

<live-example params='id: "component-markdown-example"'></live-example>

This "special list" example does nothing more than insert a heading above each list item. But the same technique can be used to create sophisticated grids, dialogs, tab sets, and so on, since all that is needed for such UI elements is common UI markup (e.g., to define the grid or dialog's heading and borders) wrapped around arbitrary supplied markup.

This technique is also possible when using components *without* custom elements, i.e., [passing markup when using the `component` binding directly](component-binding.html#note-passing-markup-to-components).

### Controlling custom element tag names

By default, Knockout assumes that your custom element tag names correspond exactly to the names of components registered using `ko.components.register`. This convention-over-configuration strategy is ideal for most applications.

If you want to have different custom element tag names, you can override `getComponentNameForNode` to control this. For example,

```javascript
ko.components.getComponentNameForNode = function(node) {
    var tagNameLower = node.tagName && node.tagName.toLowerCase();

    if (ko.components.isRegistered(tagNameLower)) {
        // If the element's name exactly matches a preregistered
        // component, use that component
        return tagNameLower;
    } else if (tagNameLower === "special-element") {
        // For the element <special-element>, use the component
        // "MySpecialComponent" (whether or not it was preregistered)
        return "MySpecialComponent";
    } else {
        // Treat anything else as not representing a component
        return null;
    }
}
```

You can use this technique if, for example, you want to control which subset of registered components may be used as custom elements.

### Registering custom elements {#registering-custom-elements}

If you are using the default component loader, and hence are registering your components using `ko.components.register`, then there is nothing extra you need to do. Components registered this way are immediately available for use as custom elements.

If you have implemented a [custom component loader](component-loaders.html), and are not using `ko.components.register`, then you need to tell Knockout about any element names you wish to use as custom elements. To do this, simply call `ko.components.register` - you don't need to specify any configuration, since your custom component loader won't be using the configuration anyway. For example,

```javascript
ko.components.register('my-custom-element', { /* No config needed */ });
```

Alternatively, you can [override `getComponentNameForNode`](#controlling-custom-element-tag-names) to control dynamically which elements map to which component names, independently of preregistration.

### Note: Combining custom elements with regular bindings

A custom element can have a regular `data-bind` attribute (in addition to any `params` attribute) if needed. For example,

```html
<products-list params='category: chosenCategory'
               data-bind='visible: shouldShowProducts'>
</products-list>
```

However, it does not make sense to use bindings that would modify the element's contents, such as the [`text`](text-binding.html) or [`template`](template-binding.html) bindings, since they would overwrite the template injected by your component.

Knockout will prevent the use of any bindings that use [`controlsDescendantBindings`](custom-bindings-controlling-descendant-bindings.html), because this also would clash with the component when trying to bind its viewmodel to the injected template. Therefore if you want to use a control flow binding such as `if` or `foreach`, then you must wrap it around your custom element rather than using it directly on the custom element, e.g.,:

```html
<!-- ko if: someCondition -->
    <products-list></products-list>
<!-- /ko -->
```

or:

```html
<ul data-bind='foreach: allProducts'>
    <product-details params='product: $data'></product-details>
</ul>
```

### Note: Custom elements cannot be self-closing

You must write `<my-custom-element></my-custom-element>`, and **not** `<my-custom-element />`. Otherwise, your custom element is not closed and subsequent elements will be parsed as child elements.

This is a limitation of the HTML specification and is outside the scope of what Knockout can control. HTML parsers, following the HTML specification, [ignore any self-closing slashes](http://dev.w3.org/html5/spec-author-view/syntax.html#syntax-start-tag) (except on a small number of special "foreign elements", which are hardcoded into the parser). HTML is not the same as XML.

### Note: Custom elements and Internet Explorer 6 to 8

Knockout tries hard to spare developers the pain of dealing with cross-browser compatiblity issues, especially those relating to older browsers! Even though custom elements provide a very modern style of web development, they still work on all commonly-encountered browsers:

 * HTML5-era browsers, which includes **Internet Explorer 9** and later, automatically allow for custom elements with no difficulties.
 * **Internet Explorer 6 to 8** also supports custom elements, *but only if they are registered before the HTML parser encounters any of those elements*.

IE 6-8's HTML parser will discard any unrecognized elements. To ensure it doesn't throw out your custom elements, you must do one of the following:

 * Ensure you call `ko.components.register('your-component')` *before* the HTML parser sees any `<your-component>` elements
 * Or, at least call `document.createElement('your-component')` *before* the HTML parser sees any `<your-component>` elements. You can ignore the result of the `createElement` call --- all that matters is that you have called it.

For example, if you structure your page like this, then everything will be OK:

```html
<!DOCTYPE html>
<html>
    <body>
        <script src='some-script-that-registers-components.js'></script>

        <my-custom-element></my-custom-element>
    </body>
</html>
```

If you're working with AMD, then you might prefer a structure like this:

```html
<!DOCTYPE html>
<html>
    <body>
        <script>
            // Since the components aren't registered until the AMD module
            // loads, which is asynchronous, the following prevents IE6-8's
            // parser from discarding the custom element
            document.createElement('my-custom-element');
        </script>

        <script src='require.js' data-main='app/startup'></script>

        <my-custom-element></my-custom-element>
    </body>
</html>
```

Or if you really don't like the hackiness of the `document.createElement` call, then you could use a [`component` binding](component-binding.html) for your top-level component instead of a custom element. As long as all other components are registered before your `ko.applyBindings` call, they can be used as custom elements on IE6-8 without futher trouble:

```html
<!DOCTYPE html>
<html>
    <body>
        <!-- The startup module registers all other KO components before calling
             ko.applyBindings(), so they are OK as custom elements on IE6-8 -->
        <script src='require.js' data-main='app/startup'></script>

        <div data-bind='component: "my-custom-element"'></div>
    </body>
</html>
```

### Advanced: Accessing `$raw` parameters

Consider the following unusual case, in which `useObservable1`, `observable1`, and `observable2` are all observables:

```html
<some-component
    params='myExpr: useObservable1() ? observable1 : observable2'>
</some-component>
```

Since evaluating `myExpr` involves reading an observable (`useObservable1`), KO will supply the parameter to the component as a computed property.

However, the value of the computed property is itself an observable. This would seem to lead to an awkward scenario, where reading its current value would involve double-unwrapping (i.e., `params.myExpr()()`, where the first parentheses give the value of the expression, and the second give the value of the resulting observable instance).

This double-unwrapping would be ugly, inconvenient, and unexpected, so Knockout automatically sets up the generated computed property (`params.myExpr`) to unwrap its value for you. That is, the component can read `params.myExpr()` to get the value of whichever observable has been selected (`observable1` or `observable2`), without the need for double-unwrapping.

In the unlikely event that you *don't* want the automatic unwrapping, because you want to access the `observable1`/`observable2` instances directly, you can read values from `params.$raw`. For example,

```javascript
function MyComponentViewModel(params) {
    var currentObservableInstance = params.$raw.myExpr();

    // Now currentObservableInstance is either observable1 or observable2
    // and you would read its value with "currentObservableInstance()"
}
```

This should be a very unusual scenario, so normally you will not need to work with `$raw`.
