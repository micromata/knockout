/*global Page*/
/*eslint no-unused-vars: 0*/

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function Page() {
  _classCallCheck(this, Page);

  this.body = ko.observable();

  this.links = window.links;
  this.cdn = window.cdn;
};
"use strict";

ko.bindingHandlers.highlight = {
  /* highlight: "langauge" */
  init: function init(element, va) {
    element.className = (element.className || "") + " language-" + va();
    window.Prism.highlightElement(element);
  }
};
"use strict";

function loadTemplates() {
  var uri = "./build/templates.html";
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== "string") {
      console.error("Unable to get templates:", html);
    } else {
      // ES5-<template> shim/polyfill:
      // unless 'content' of document.createElement('template')
      //   # see pv_shim_template_tag re. broken-template tags
      //   html = html.replace(/<\/template>/g, '</script>')
      //     .replace(/<template/g, '<script type="text/x-template"')
      $("<div id='_templates'>").append(html).appendTo(document.body);
    }
  });
}

function onApplicationUpdate() {
  location.reload();
}

function checkForApplicationUpdate() {
  var ac = applicationCache;
  if (ac) {
    switch (ac.status) {
      case ac.UPDATEREADY:
        onApplicationUpdate();
        break;
      case ac.CHECKING:
      case ac.OBSOLETE:
      case ac.DOWNLOADING:
        return new Promise(function () {
          // This never resolves; it reloads the page when the
          // update is complete.
          window.$root.body("updating-appcache");
          window.applicationCache.addEventListener("updateready", onApplicationUpdate);
        });
    }
  }
  return Promise.resolve();
}

function applyBindings() {
  ko.punches.enableAll();
  window.$root = new Page();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  window.$root.body("intro");
}

function start() {
  loadTemplates().then(applyBindings).then(checkForApplicationUpdate).then(pageLoaded);
}

$(start);

// Enable livereload in development
if (window.location.hostname === "localhost") {
  $.getScript("http://localhost:35729/livereload.js");
}
/**
 * @license Knockout.Punches
 * Enhanced binding syntaxes for Knockout 3+
 * (c) Michael Best
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Version 0.5.1
 */
'use strict';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['knockout'], factory);
    } else if (typeof module === 'object') {
        // CommonJS module
        var ko = require('knockout');
        factory(ko);
    } else {
        // Browser globals
        factory(window.ko);
    }
})(function (ko) {

    // Add a preprocess function to a binding handler.
    function addBindingPreprocessor(bindingKeyOrHandler, preprocessFn) {
        return chainPreprocessor(getOrCreateHandler(bindingKeyOrHandler), 'preprocess', preprocessFn);
    }

    // These utility functions are separated out because they're also used by
    // preprocessBindingProperty

    // Get the binding handler or create a new, empty one
    function getOrCreateHandler(bindingKeyOrHandler) {
        return typeof bindingKeyOrHandler === 'object' ? bindingKeyOrHandler : ko.getBindingHandler(bindingKeyOrHandler) || (ko.bindingHandlers[bindingKeyOrHandler] = {});
    }
    // Add a preprocess function
    function chainPreprocessor(obj, prop, fn) {
        if (obj[prop]) {
            // If the handler already has a preprocess function, chain the new
            // one after the existing one. If the previous function in the chain
            // returns a falsy value (to remove the binding), the chain ends. This
            // method allows each function to modify and return the binding value.
            var previousFn = obj[prop];
            obj[prop] = function (value, binding, addBinding) {
                value = previousFn.call(this, value, binding, addBinding);
                if (value) return fn.call(this, value, binding, addBinding);
            };
        } else {
            obj[prop] = fn;
        }
        return obj;
    }

    // Add a preprocessNode function to the binding provider. If a
    // function already exists, chain the new one after it. This calls
    // each function in the chain until one modifies the node. This
    // method allows only one function to modify the node.
    function addNodePreprocessor(preprocessFn) {
        var provider = ko.bindingProvider.instance;
        if (provider.preprocessNode) {
            var previousPreprocessFn = provider.preprocessNode;
            provider.preprocessNode = function (node) {
                var newNodes = previousPreprocessFn.call(this, node);
                if (!newNodes) newNodes = preprocessFn.call(this, node);
                return newNodes;
            };
        } else {
            provider.preprocessNode = preprocessFn;
        }
    }

    function addBindingHandlerCreator(matchRegex, callbackFn) {
        var oldGetHandler = ko.getBindingHandler;
        ko.getBindingHandler = function (bindingKey) {
            var match;
            return oldGetHandler(bindingKey) || (match = bindingKey.match(matchRegex)) && callbackFn(match, bindingKey);
        };
    }

    // Create shortcuts to commonly used ko functions
    var ko_unwrap = ko.unwrap;

    // Create "punches" object and export utility functions
    var ko_punches = ko.punches = {
        utils: {
            addBindingPreprocessor: addBindingPreprocessor,
            addNodePreprocessor: addNodePreprocessor,
            addBindingHandlerCreator: addBindingHandlerCreator,

            // previous names retained for backwards compitibility
            setBindingPreprocessor: addBindingPreprocessor,
            setNodePreprocessor: addNodePreprocessor
        }
    };

    ko_punches.enableAll = function () {
        // Enable interpolation markup
        enableInterpolationMarkup();
        enableAttributeInterpolationMarkup();

        // Enable auto-namspacing of attr, css, event, and style
        enableAutoNamespacedSyntax('attr');
        enableAutoNamespacedSyntax('css');
        enableAutoNamespacedSyntax('event');
        enableAutoNamespacedSyntax('style');

        // Make sure that Knockout knows to bind checked after attr.value (see #40)
        ko.bindingHandlers.checked.after.push('attr.value');

        // Enable filter syntax for text, html, and attr
        enableTextFilter('text');
        enableTextFilter('html');
        addDefaultNamespacedBindingPreprocessor('attr', filterPreprocessor);

        // Enable wrapped callbacks for click, submit, event, optionsAfterRender, and template options
        enableWrappedCallback('click');
        enableWrappedCallback('submit');
        enableWrappedCallback('optionsAfterRender');
        addDefaultNamespacedBindingPreprocessor('event', wrappedCallbackPreprocessor);
        addBindingPropertyPreprocessor('template', 'beforeRemove', wrappedCallbackPreprocessor);
        addBindingPropertyPreprocessor('template', 'afterAdd', wrappedCallbackPreprocessor);
        addBindingPropertyPreprocessor('template', 'afterRender', wrappedCallbackPreprocessor);
    };
    // Convert input in the form of `expression | filter1 | filter2:arg1:arg2` to a function call format
    // with filters accessed as ko.filters.filter1, etc.
    function filterPreprocessor(input) {
        // Check if the input contains any | characters; if not, just return
        if (input.indexOf('|') === -1) return input;

        // Split the input into tokens, in which | and : are individual tokens, quoted strings are ignored, and all tokens are space-trimmed
        var tokens = input.match(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\|\||[|:]|[^\s|:"'][^|:"']*[^\s|:"']|[^\s|:"']/g);
        if (tokens && tokens.length > 1) {
            // Append a line so that we don't need a separate code block to deal with the last item
            tokens.push('|');
            input = tokens[0];
            var lastToken,
                token,
                inFilters = false,
                nextIsFilter = false;
            for (var i = 1, token; token = tokens[i]; ++i) {
                if (token === '|') {
                    if (inFilters) {
                        if (lastToken === ':') input += 'undefined';
                        input += ')';
                    }
                    nextIsFilter = true;
                    inFilters = true;
                } else {
                    if (nextIsFilter) {
                        input = 'ko.filters[\'' + token + '\'](' + input;
                    } else if (inFilters && token === ':') {
                        if (lastToken === ':') input += 'undefined';
                        input += ',';
                    } else {
                        input += token;
                    }
                    nextIsFilter = false;
                }
                lastToken = token;
            }
        }
        return input;
    }

    // Set the filter preprocessor for a specific binding
    function enableTextFilter(bindingKeyOrHandler) {
        addBindingPreprocessor(bindingKeyOrHandler, filterPreprocessor);
    }

    var filters = {};

    // Convert value to uppercase
    filters.uppercase = function (value) {
        return String.prototype.toUpperCase.call(ko_unwrap(value));
    };

    // Convert value to lowercase
    filters.lowercase = function (value) {
        return String.prototype.toLowerCase.call(ko_unwrap(value));
    };

    // Return default value if the input value is empty or null
    filters['default'] = function (value, defaultValue) {
        value = ko_unwrap(value);
        if (typeof value === 'function') {
            return value;
        }
        if (typeof value === 'string') {
            return trim(value) === '' ? defaultValue : value;
        }
        return value == null || value.length == 0 ? defaultValue : value;
    };

    // Return the value with the search string replaced with the replacement string
    filters.replace = function (value, search, replace) {
        return String.prototype.replace.call(ko_unwrap(value), search, replace);
    };

    filters.fit = function (value, length, replacement, trimWhere) {
        value = ko_unwrap(value);
        if (length && ('' + value).length > length) {
            replacement = '' + (replacement || '...');
            length = length - replacement.length;
            value = '' + value;
            switch (trimWhere) {
                case 'left':
                    return replacement + value.slice(-length);
                case 'middle':
                    var leftLen = Math.ceil(length / 2);
                    return value.substr(0, leftLen) + replacement + value.slice(leftLen - length);
                default:
                    return value.substr(0, length) + replacement;
            }
        } else {
            return value;
        }
    };

    // Convert a model object to JSON
    filters.json = function (rootObject, space, replacer) {
        // replacer and space are optional
        return ko.toJSON(rootObject, replacer, space);
    };

    // Format a number using the browser's toLocaleString
    filters.number = function (value) {
        return (+ko_unwrap(value)).toLocaleString();
    };

    // Export the filters object for general access
    ko.filters = filters;

    // Export the preprocessor functions
    ko_punches.textFilter = {
        preprocessor: filterPreprocessor,
        enableForBinding: enableTextFilter
    };
    // Support dynamically-created, namespaced bindings. The binding key syntax is
    // "namespace.binding". Within a certain namespace, we can dynamically create the
    // handler for any binding. This is particularly useful for bindings that work
    // the same way, but just set a different named value, such as for element
    // attributes or CSS classes.
    var namespacedBindingMatch = /([^\.]+)\.(.+)/,
        namespaceDivider = '.';
    addBindingHandlerCreator(namespacedBindingMatch, function (match, bindingKey) {
        var namespace = match[1],
            namespaceHandler = ko.bindingHandlers[namespace];
        if (namespaceHandler) {
            var bindingName = match[2],
                handlerFn = namespaceHandler.getNamespacedHandler || defaultGetNamespacedHandler,
                handler = handlerFn.call(namespaceHandler, bindingName, namespace, bindingKey);
            ko.bindingHandlers[bindingKey] = handler;
            return handler;
        }
    });

    // Knockout's built-in bindings "attr", "event", "css" and "style" include the idea of
    // namespaces, representing it using a single binding that takes an object map of names
    // to values. This default handler translates a binding of "namespacedName: value"
    // to "namespace: {name: value}" to automatically support those built-in bindings.
    function defaultGetNamespacedHandler(name, namespace, namespacedName) {
        var handler = ko.utils.extend({}, this);
        function setHandlerFunction(funcName) {
            if (handler[funcName]) {
                handler[funcName] = function (element, valueAccessor) {
                    function subValueAccessor() {
                        var result = {};
                        result[name] = valueAccessor();
                        return result;
                    }
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[1] = subValueAccessor;
                    return ko.bindingHandlers[namespace][funcName].apply(this, args);
                };
            }
        }
        // Set new init and update functions that wrap the originals
        setHandlerFunction('init');
        setHandlerFunction('update');
        // Clear any preprocess function since preprocessing of the new binding would need to be different
        if (handler.preprocess) handler.preprocess = null;
        if (ko.virtualElements.allowedBindings[namespace]) ko.virtualElements.allowedBindings[namespacedName] = true;
        return handler;
    }

    // Adds a preprocess function for every generated namespace.x binding. This can
    // be called multiple times for the same binding, and the preprocess functions will
    // be chained. If the binding has a custom getNamespacedHandler method, make sure that
    // it's set before this function is used.
    function addDefaultNamespacedBindingPreprocessor(namespace, preprocessFn) {
        var handler = ko.getBindingHandler(namespace);
        if (handler) {
            var previousHandlerFn = handler.getNamespacedHandler || defaultGetNamespacedHandler;
            handler.getNamespacedHandler = function () {
                return addBindingPreprocessor(previousHandlerFn.apply(this, arguments), preprocessFn);
            };
        }
    }

    function autoNamespacedPreprocessor(value, binding, addBinding) {
        if (value.charAt(0) !== '{') return value;

        // Handle two-level binding specified as "binding: {key: value}" by parsing inner
        // object and converting to "binding.key: value"
        var subBindings = ko.expressionRewriting.parseObjectLiteral(value);
        ko.utils.arrayForEach(subBindings, function (keyValue) {
            addBinding(binding + namespaceDivider + keyValue.key, keyValue.value);
        });
    }

    // Set the namespaced preprocessor for a specific binding
    function enableAutoNamespacedSyntax(bindingKeyOrHandler) {
        addBindingPreprocessor(bindingKeyOrHandler, autoNamespacedPreprocessor);
    }

    // Export the preprocessor functions
    ko_punches.namespacedBinding = {
        defaultGetHandler: defaultGetNamespacedHandler,
        setDefaultBindingPreprocessor: addDefaultNamespacedBindingPreprocessor, // for backwards compat.
        addDefaultBindingPreprocessor: addDefaultNamespacedBindingPreprocessor,
        preprocessor: autoNamespacedPreprocessor,
        enableForBinding: enableAutoNamespacedSyntax
    };
    // Wrap a callback function in an anonymous function so that it is called with the appropriate
    // "this" value.
    function wrappedCallbackPreprocessor(val) {
        // Matches either an isolated identifier or something ending with a property accessor
        if (/^([$_a-z][$\w]*|.+(\.\s*[$_a-z][$\w]*|\[.+\]))$/i.test(val)) {
            return 'function(_x,_y,_z){return(' + val + ')(_x,_y,_z);}';
        } else {
            return val;
        }
    }

    // Set the wrappedCallback preprocessor for a specific binding
    function enableWrappedCallback(bindingKeyOrHandler) {
        addBindingPreprocessor(bindingKeyOrHandler, wrappedCallbackPreprocessor);
    }

    // Export the preprocessor functions
    ko_punches.wrappedCallback = {
        preprocessor: wrappedCallbackPreprocessor,
        enableForBinding: enableWrappedCallback
    };
    // Attach a preprocess function to a specific property of a binding. This allows you to
    // preprocess binding "options" using the same preprocess functions that work for bindings.
    function addBindingPropertyPreprocessor(bindingKeyOrHandler, property, preprocessFn) {
        var handler = getOrCreateHandler(bindingKeyOrHandler);
        if (!handler._propertyPreprocessors) {
            // Initialize the binding preprocessor
            chainPreprocessor(handler, 'preprocess', propertyPreprocessor);
            handler._propertyPreprocessors = {};
        }
        // Add the property preprocess function
        chainPreprocessor(handler._propertyPreprocessors, property, preprocessFn);
    }

    // In order to preprocess a binding property, we have to preprocess the binding itself.
    // This preprocess function splits up the binding value and runs each property's preprocess
    // function if it's set.
    function propertyPreprocessor(value, binding, addBinding) {
        if (value.charAt(0) !== '{') return value;

        var subBindings = ko.expressionRewriting.parseObjectLiteral(value),
            resultStrings = [],
            propertyPreprocessors = this._propertyPreprocessors || {};
        ko.utils.arrayForEach(subBindings, function (keyValue) {
            var prop = keyValue.key,
                propVal = keyValue.value;
            if (propertyPreprocessors[prop]) {
                propVal = propertyPreprocessors[prop](propVal, prop, addBinding);
            }
            if (propVal) {
                resultStrings.push('\'' + prop + '\':' + propVal);
            }
        });
        return '{' + resultStrings.join(',') + '}';
    }

    // Export the preprocessor functions
    ko_punches.preprocessBindingProperty = {
        setPreprocessor: addBindingPropertyPreprocessor, // for backwards compat.
        addPreprocessor: addBindingPropertyPreprocessor
    };
    // Wrap an expression in an anonymous function so that it is called when the event happens
    function makeExpressionCallbackPreprocessor(args) {
        return function expressionCallbackPreprocessor(val) {
            return 'function(' + args + '){return(' + val + ');}';
        };
    }

    var eventExpressionPreprocessor = makeExpressionCallbackPreprocessor('$data,$event');

    // Set the expressionCallback preprocessor for a specific binding
    function enableExpressionCallback(bindingKeyOrHandler, args) {
        var args = Array.prototype.slice.call(arguments, 1).join();
        addBindingPreprocessor(bindingKeyOrHandler, makeExpressionCallbackPreprocessor(args));
    }

    // Export the preprocessor functions
    ko_punches.expressionCallback = {
        makePreprocessor: makeExpressionCallbackPreprocessor,
        eventPreprocessor: eventExpressionPreprocessor,
        enableForBinding: enableExpressionCallback
    };

    // Create an "on" namespace for events to use the expression method
    ko.bindingHandlers.on = {
        getNamespacedHandler: function getNamespacedHandler(eventName) {
            var handler = ko.getBindingHandler('event' + namespaceDivider + eventName);
            return addBindingPreprocessor(handler, eventExpressionPreprocessor);
        }
    };
    // Performance comparison at http://jsperf.com/markup-interpolation-comparison
    function parseInterpolationMarkup(textToParse, outerTextCallback, expressionCallback) {
        function innerParse(text) {
            var innerMatch = text.match(/^([\s\S]*)}}([\s\S]*?)\{\{([\s\S]*)$/);
            if (innerMatch) {
                innerParse(innerMatch[1]);
                outerTextCallback(innerMatch[2]);
                expressionCallback(innerMatch[3]);
            } else {
                expressionCallback(text);
            }
        }
        var outerMatch = textToParse.match(/^([\s\S]*?)\{\{([\s\S]*)}}([\s\S]*)$/);
        if (outerMatch) {
            outerTextCallback(outerMatch[1]);
            innerParse(outerMatch[2]);
            outerTextCallback(outerMatch[3]);
        }
    }

    function trim(string) {
        return string == null ? '' : string.trim ? string.trim() : string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    }

    function interpolationMarkupPreprocessor(node) {
        // only needs to work with text nodes
        if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf('{{') !== -1 && (node.parentNode || {}).nodeName != 'TEXTAREA') {
            var addTextNode = function addTextNode(text) {
                if (text) nodes.push(document.createTextNode(text));
            };

            var wrapExpr = function wrapExpr(expressionText) {
                if (expressionText) nodes.push.apply(nodes, ko_punches_interpolationMarkup.wrapExpression(expressionText, node));
            };

            var nodes = [];

            parseInterpolationMarkup(node.nodeValue, addTextNode, wrapExpr);

            if (nodes.length) {
                if (node.parentNode) {
                    for (var i = 0, n = nodes.length, parent = node.parentNode; i < n; ++i) {
                        parent.insertBefore(nodes[i], node);
                    }
                    parent.removeChild(node);
                }
                return nodes;
            }
        }
    }

    if (!ko.virtualElements.allowedBindings.html) {
        // Virtual html binding
        // SO Question: http://stackoverflow.com/a/15348139
        var overridden = ko.bindingHandlers.html.update;
        ko.bindingHandlers.html.update = function (element, valueAccessor) {
            if (element.nodeType === 8) {
                var html = ko_unwrap(valueAccessor());
                if (html != null) {
                    var parsedNodes = ko.utils.parseHtmlFragment('' + html);
                    ko.virtualElements.setDomNodeChildren(element, parsedNodes);
                } else {
                    ko.virtualElements.emptyNode(element);
                }
            } else {
                overridden(element, valueAccessor);
            }
        };
        ko.virtualElements.allowedBindings.html = true;
    }

    function wrapExpression(expressionText, node) {
        var ownerDocument = node ? node.ownerDocument : document,
            closeComment = true,
            binding,
            expressionText = trim(expressionText),
            firstChar = expressionText[0],
            lastChar = expressionText[expressionText.length - 1],
            result = [],
            matches;

        if (firstChar === '#') {
            if (lastChar === '/') {
                binding = expressionText.slice(1, -1);
            } else {
                binding = expressionText.slice(1);
                closeComment = false;
            }
            if (matches = binding.match(/^([^,"'{}()\/:[\]\s]+)\s+([^\s:].*)/)) {
                binding = matches[1] + ':' + matches[2];
            }
        } else if (firstChar === '/') {} else if (firstChar === '{' && lastChar === '}') {
            binding = 'html:' + trim(expressionText.slice(1, -1));
        } else {
            binding = 'text:' + trim(expressionText);
        }

        if (binding) result.push(ownerDocument.createComment('ko ' + binding));
        if (closeComment) result.push(ownerDocument.createComment('/ko'));
        return result;
    };

    function enableInterpolationMarkup() {
        addNodePreprocessor(interpolationMarkupPreprocessor);
    }

    // Export the preprocessor functions
    var ko_punches_interpolationMarkup = ko_punches.interpolationMarkup = {
        preprocessor: interpolationMarkupPreprocessor,
        enable: enableInterpolationMarkup,
        wrapExpression: wrapExpression
    };

    var dataBind = 'data-bind';
    function attributeInterpolationMarkerPreprocessor(node) {
        if (node.nodeType === 1 && node.attributes.length) {
            var dataBindAttribute = node.getAttribute(dataBind);
            for (var attrs = ko.utils.arrayPushAll([], node.attributes), n = attrs.length, i = 0; i < n; ++i) {
                var attr = attrs[i];
                if (attr.specified && attr.name != dataBind && attr.value.indexOf('{{') !== -1) {
                    var addText = function addText(text) {
                        if (text) parts.push('"' + text.replace(/"/g, '\\"') + '"');
                    };

                    var addExpr = function addExpr(expressionText) {
                        if (expressionText) {
                            attrValue = expressionText;
                            parts.push('ko.unwrap(' + expressionText + ')');
                        }
                    };

                    var parts = [],
                        attrValue = '';

                    parseInterpolationMarkup(attr.value, addText, addExpr);

                    if (parts.length > 1) {
                        attrValue = '""+' + parts.join('+');
                    }

                    if (attrValue) {
                        var attrName = attr.name.toLowerCase();
                        var attrBinding = ko_punches_attributeInterpolationMarkup.attributeBinding(attrName, attrValue, node) || attributeBinding(attrName, attrValue, node);
                        if (!dataBindAttribute) {
                            dataBindAttribute = attrBinding;
                        } else {
                            dataBindAttribute += ',' + attrBinding;
                        }
                        node.setAttribute(dataBind, dataBindAttribute);
                        // Using removeAttribute instead of removeAttributeNode because IE clears the
                        // class if you use removeAttributeNode to remove the id.
                        node.removeAttribute(attr.name);
                    }
                }
            }
        }
    }

    function attributeBinding(name, value, node) {
        if (ko.getBindingHandler(name)) {
            return name + ':' + value;
        } else {
            return 'attr.' + name + ':' + value;
        }
    }

    function enableAttributeInterpolationMarkup() {
        addNodePreprocessor(attributeInterpolationMarkerPreprocessor);
    }

    var ko_punches_attributeInterpolationMarkup = ko_punches.attributeInterpolationMarkup = {
        preprocessor: attributeInterpolationMarkerPreprocessor,
        enable: enableAttributeInterpolationMarkup,
        attributeBinding: attributeBinding
    };

    return ko_punches;
});

// replace only with a closing comment
"use strict";

window.links = [{ href: "https://github.com/knockout/knockout",
  title: "Github",
  icon: "fa-github" }, { href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }];

window.cdn = [{ name: "Microsoft",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"
}];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2UuanMiLCJiaW5kaW5ncy5qcyIsImVudHJ5LmpzIiwia25vY2tvdXQucHVuY2hlcy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUFHTSxJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007d0JBRFYsSUFBSTs7QUFFTixNQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQTs7QUFFM0IsTUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFBO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQTtDQUN0Qjs7O0FDUkgsRUFBRSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUc7O0FBRTdCLE1BQUksRUFBRSxjQUFVLE9BQU8sRUFBRSxFQUFFLEVBQUU7QUFDM0IsV0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFBLEdBQUksWUFBWSxHQUFHLEVBQUUsRUFBRSxDQUFBO0FBQ25FLFVBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDdkM7Q0FDRixDQUFBOzs7QUNORCxTQUFTLGFBQWEsR0FBRztBQUN2QixNQUFJLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQTtBQUNsQyxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNoQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDcEIsUUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDNUIsYUFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUNoRCxNQUFNOzs7Ozs7QUFNTCxPQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUNaLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFD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QyxDQUFDO0tBQ2pFOztBQUVELFFBQUksdUNBQXVDLEdBQUcsVUFBVSxDQUFDLDRCQUE0QixHQUFHO0FBQ3BGLG9CQUFZLEVBQUUsd0NBQXdDO0FBQ3RELGNBQU0sRUFBRSxrQ0FBa0M7QUFDMUMsd0JBQWdCLEVBQUUsZ0JBQWdCO0tBQ3JDLENBQUM7O0FBRUUsV0FBTyxVQUFVLENBQUM7Q0FDckIsQ0FBQyxDQUFFOzs7OztBQ25sQkosTUFBTSxDQUFDLEtBQUssR0FBRyxDQUNiLEVBQUUsSUFBSSxFQUFFLHNDQUFzQztBQUM1QyxPQUFLLEVBQUUsUUFBUTtBQUNmLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsb0RBQW9EO0FBQzFELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsZ0RBQWdEO0FBQ3RELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxtQkFBbUIsRUFBQyxDQUM3QixDQUFBOztBQUdELE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FDWCxFQUFFLElBQUksRUFBRSxXQUFXO0FBQ2pCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSwyREFBMkQ7QUFDaEUsT0FBSyxFQUFFLGlFQUFpRTtDQUN6RSxFQUNELEVBQUUsSUFBSSxFQUFFLFlBQVk7QUFDbEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHlFQUF5RTtBQUM5RSxPQUFLLEVBQUUsdUVBQXVFO0NBQy9FLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmdsb2JhbCBQYWdlKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuY2xhc3MgUGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuICB9XG59XG4iLCJcbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gKGVsZW1lbnQuY2xhc3NOYW1lIHx8ICcnKSArIFwiIGxhbmd1YWdlLVwiICsgdmEoKVxuICAgIHdpbmRvdy5QcmlzbS5oaWdobGlnaHRFbGVtZW50KGVsZW1lbnQpXG4gIH1cbn1cbiIsIlxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgdmFyIHVyaSA9IFwiLi9idWlsZC90ZW1wbGF0ZXMuaHRtbFwiXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGdldCB0ZW1wbGF0ZXM6XCIsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKFwiPGRpdiBpZD0nX3RlbXBsYXRlcyc+XCIpXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICB3aW5kb3cuJHJvb3QuYm9keShcImludHJvXCIpXG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGxvYWRUZW1wbGF0ZXMoKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLyoqXG4gKiBAbGljZW5zZSBLbm9ja291dC5QdW5jaGVzXG4gKiBFbmhhbmNlZCBiaW5kaW5nIHN5bnRheGVzIGZvciBLbm9ja291dCAzK1xuICogKGMpIE1pY2hhZWwgQmVzdFxuICogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAqIFZlcnNpb24gMC41LjFcbiAqL1xuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2tub2Nrb3V0J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAvLyBDb21tb25KUyBtb2R1bGVcbiAgICAgICAgdmFyIGtvID0gcmVxdWlyZShcImtub2Nrb3V0XCIpO1xuICAgICAgICBmYWN0b3J5KGtvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSh3aW5kb3cua28pO1xuICAgIH1cbn0oZnVuY3Rpb24oa28pIHtcblxuLy8gQWRkIGEgcHJlcHJvY2VzcyBmdW5jdGlvbiB0byBhIGJpbmRpbmcgaGFuZGxlci5cbmZ1bmN0aW9uIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgcHJlcHJvY2Vzc0ZuKSB7XG4gICAgcmV0dXJuIGNoYWluUHJlcHJvY2Vzc29yKGdldE9yQ3JlYXRlSGFuZGxlcihiaW5kaW5nS2V5T3JIYW5kbGVyKSwgJ3ByZXByb2Nlc3MnLCBwcmVwcm9jZXNzRm4pO1xufVxuXG4vLyBUaGVzZSB1dGlsaXR5IGZ1bmN0aW9ucyBhcmUgc2VwYXJhdGVkIG91dCBiZWNhdXNlIHRoZXkncmUgYWxzbyB1c2VkIGJ5XG4vLyBwcmVwcm9jZXNzQmluZGluZ1Byb3BlcnR5XG5cbi8vIEdldCB0aGUgYmluZGluZyBoYW5kbGVyIG9yIGNyZWF0ZSBhIG5ldywgZW1wdHkgb25lXG5mdW5jdGlvbiBnZXRPckNyZWF0ZUhhbmRsZXIoYmluZGluZ0tleU9ySGFuZGxlcikge1xuICAgIHJldHVybiB0eXBlb2YgYmluZGluZ0tleU9ySGFuZGxlciA9PT0gJ29iamVjdCcgPyBiaW5kaW5nS2V5T3JIYW5kbGVyIDpcbiAgICAgICAgKGtvLmdldEJpbmRpbmdIYW5kbGVyKGJpbmRpbmdLZXlPckhhbmRsZXIpIHx8IChrby5iaW5kaW5nSGFuZGxlcnNbYmluZGluZ0tleU9ySGFuZGxlcl0gPSB7fSkpO1xufVxuLy8gQWRkIGEgcHJlcHJvY2VzcyBmdW5jdGlvblxuZnVuY3Rpb24gY2hhaW5QcmVwcm9jZXNzb3Iob2JqLCBwcm9wLCBmbikge1xuICAgIGlmIChvYmpbcHJvcF0pIHtcbiAgICAgICAgLy8gSWYgdGhlIGhhbmRsZXIgYWxyZWFkeSBoYXMgYSBwcmVwcm9jZXNzIGZ1bmN0aW9uLCBjaGFpbiB0aGUgbmV3XG4gICAgICAgIC8vIG9uZSBhZnRlciB0aGUgZXhpc3Rpbmcgb25lLiBJZiB0aGUgcHJldmlvdXMgZnVuY3Rpb24gaW4gdGhlIGNoYWluXG4gICAgICAgIC8vIHJldHVybnMgYSBmYWxzeSB2YWx1ZSAodG8gcmVtb3ZlIHRoZSBiaW5kaW5nKSwgdGhlIGNoYWluIGVuZHMuIFRoaXNcbiAgICAgICAgLy8gbWV0aG9kIGFsbG93cyBlYWNoIGZ1bmN0aW9uIHRvIG1vZGlmeSBhbmQgcmV0dXJuIHRoZSBiaW5kaW5nIHZhbHVlLlxuICAgICAgICB2YXIgcHJldmlvdXNGbiA9IG9ialtwcm9wXTtcbiAgICAgICAgb2JqW3Byb3BdID0gZnVuY3Rpb24odmFsdWUsIGJpbmRpbmcsIGFkZEJpbmRpbmcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcHJldmlvdXNGbi5jYWxsKHRoaXMsIHZhbHVlLCBiaW5kaW5nLCBhZGRCaW5kaW5nKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCB2YWx1ZSwgYmluZGluZywgYWRkQmluZGluZyk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW3Byb3BdID0gZm47XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG59XG5cbi8vIEFkZCBhIHByZXByb2Nlc3NOb2RlIGZ1bmN0aW9uIHRvIHRoZSBiaW5kaW5nIHByb3ZpZGVyLiBJZiBhXG4vLyBmdW5jdGlvbiBhbHJlYWR5IGV4aXN0cywgY2hhaW4gdGhlIG5ldyBvbmUgYWZ0ZXIgaXQuIFRoaXMgY2FsbHNcbi8vIGVhY2ggZnVuY3Rpb24gaW4gdGhlIGNoYWluIHVudGlsIG9uZSBtb2RpZmllcyB0aGUgbm9kZS4gVGhpc1xuLy8gbWV0aG9kIGFsbG93cyBvbmx5IG9uZSBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIG5vZGUuXG5mdW5jdGlvbiBhZGROb2RlUHJlcHJvY2Vzc29yKHByZXByb2Nlc3NGbikge1xuICAgIHZhciBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlci5pbnN0YW5jZTtcbiAgICBpZiAocHJvdmlkZXIucHJlcHJvY2Vzc05vZGUpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzUHJlcHJvY2Vzc0ZuID0gcHJvdmlkZXIucHJlcHJvY2Vzc05vZGU7XG4gICAgICAgIHByb3ZpZGVyLnByZXByb2Nlc3NOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGVzID0gcHJldmlvdXNQcmVwcm9jZXNzRm4uY2FsbCh0aGlzLCBub2RlKTtcbiAgICAgICAgICAgIGlmICghbmV3Tm9kZXMpXG4gICAgICAgICAgICAgICAgbmV3Tm9kZXMgPSBwcmVwcm9jZXNzRm4uY2FsbCh0aGlzLCBub2RlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdOb2RlcztcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwcm92aWRlci5wcmVwcm9jZXNzTm9kZSA9IHByZXByb2Nlc3NGbjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZEJpbmRpbmdIYW5kbGVyQ3JlYXRvcihtYXRjaFJlZ2V4LCBjYWxsYmFja0ZuKSB7XG4gICAgdmFyIG9sZEdldEhhbmRsZXIgPSBrby5nZXRCaW5kaW5nSGFuZGxlcjtcbiAgICBrby5nZXRCaW5kaW5nSGFuZGxlciA9IGZ1bmN0aW9uKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICByZXR1cm4gb2xkR2V0SGFuZGxlcihiaW5kaW5nS2V5KSB8fCAoKG1hdGNoID0gYmluZGluZ0tleS5tYXRjaChtYXRjaFJlZ2V4KSkgJiYgY2FsbGJhY2tGbihtYXRjaCwgYmluZGluZ0tleSkpO1xuICAgIH07XG59XG5cbi8vIENyZWF0ZSBzaG9ydGN1dHMgdG8gY29tbW9ubHkgdXNlZCBrbyBmdW5jdGlvbnNcbnZhciBrb191bndyYXAgPSBrby51bndyYXA7XG5cbi8vIENyZWF0ZSBcInB1bmNoZXNcIiBvYmplY3QgYW5kIGV4cG9ydCB1dGlsaXR5IGZ1bmN0aW9uc1xudmFyIGtvX3B1bmNoZXMgPSBrby5wdW5jaGVzID0ge1xuICAgIHV0aWxzOiB7XG4gICAgICAgIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3I6IGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IsXG4gICAgICAgIGFkZE5vZGVQcmVwcm9jZXNzb3I6IGFkZE5vZGVQcmVwcm9jZXNzb3IsXG4gICAgICAgIGFkZEJpbmRpbmdIYW5kbGVyQ3JlYXRvcjogYWRkQmluZGluZ0hhbmRsZXJDcmVhdG9yLFxuXG4gICAgICAgIC8vIHByZXZpb3VzIG5hbWVzIHJldGFpbmVkIGZvciBiYWNrd2FyZHMgY29tcGl0aWJpbGl0eVxuICAgICAgICBzZXRCaW5kaW5nUHJlcHJvY2Vzc29yOiBhZGRCaW5kaW5nUHJlcHJvY2Vzc29yLFxuICAgICAgICBzZXROb2RlUHJlcHJvY2Vzc29yOiBhZGROb2RlUHJlcHJvY2Vzc29yXG4gICAgfVxufTtcblxua29fcHVuY2hlcy5lbmFibGVBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gRW5hYmxlIGludGVycG9sYXRpb24gbWFya3VwXG4gICAgZW5hYmxlSW50ZXJwb2xhdGlvbk1hcmt1cCgpO1xuICAgIGVuYWJsZUF0dHJpYnV0ZUludGVycG9sYXRpb25NYXJrdXAoKTtcblxuICAgIC8vIEVuYWJsZSBhdXRvLW5hbXNwYWNpbmcgb2YgYXR0ciwgY3NzLCBldmVudCwgYW5kIHN0eWxlXG4gICAgZW5hYmxlQXV0b05hbWVzcGFjZWRTeW50YXgoJ2F0dHInKTtcbiAgICBlbmFibGVBdXRvTmFtZXNwYWNlZFN5bnRheCgnY3NzJyk7XG4gICAgZW5hYmxlQXV0b05hbWVzcGFjZWRTeW50YXgoJ2V2ZW50Jyk7XG4gICAgZW5hYmxlQXV0b05hbWVzcGFjZWRTeW50YXgoJ3N0eWxlJyk7XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBLbm9ja291dCBrbm93cyB0byBiaW5kIGNoZWNrZWQgYWZ0ZXIgYXR0ci52YWx1ZSAoc2VlICM0MClcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMuY2hlY2tlZC5hZnRlci5wdXNoKCdhdHRyLnZhbHVlJyk7XG5cbiAgICAvLyBFbmFibGUgZmlsdGVyIHN5bnRheCBmb3IgdGV4dCwgaHRtbCwgYW5kIGF0dHJcbiAgICBlbmFibGVUZXh0RmlsdGVyKCd0ZXh0Jyk7XG4gICAgZW5hYmxlVGV4dEZpbHRlcignaHRtbCcpO1xuICAgIGFkZERlZmF1bHROYW1lc3BhY2VkQmluZGluZ1ByZXByb2Nlc3NvcignYXR0cicsIGZpbHRlclByZXByb2Nlc3Nvcik7XG5cbiAgICAvLyBFbmFibGUgd3JhcHBlZCBjYWxsYmFja3MgZm9yIGNsaWNrLCBzdWJtaXQsIGV2ZW50LCBvcHRpb25zQWZ0ZXJSZW5kZXIsIGFuZCB0ZW1wbGF0ZSBvcHRpb25zXG4gICAgZW5hYmxlV3JhcHBlZENhbGxiYWNrKCdjbGljaycpO1xuICAgIGVuYWJsZVdyYXBwZWRDYWxsYmFjaygnc3VibWl0Jyk7XG4gICAgZW5hYmxlV3JhcHBlZENhbGxiYWNrKCdvcHRpb25zQWZ0ZXJSZW5kZXInKTtcbiAgICBhZGREZWZhdWx0TmFtZXNwYWNlZEJpbmRpbmdQcmVwcm9jZXNzb3IoJ2V2ZW50Jywgd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yKTtcbiAgICBhZGRCaW5kaW5nUHJvcGVydHlQcmVwcm9jZXNzb3IoJ3RlbXBsYXRlJywgJ2JlZm9yZVJlbW92ZScsIHdyYXBwZWRDYWxsYmFja1ByZXByb2Nlc3Nvcik7XG4gICAgYWRkQmluZGluZ1Byb3BlcnR5UHJlcHJvY2Vzc29yKCd0ZW1wbGF0ZScsICdhZnRlckFkZCcsIHdyYXBwZWRDYWxsYmFja1ByZXByb2Nlc3Nvcik7XG4gICAgYWRkQmluZGluZ1Byb3BlcnR5UHJlcHJvY2Vzc29yKCd0ZW1wbGF0ZScsICdhZnRlclJlbmRlcicsIHdyYXBwZWRDYWxsYmFja1ByZXByb2Nlc3Nvcik7XG59O1xuLy8gQ29udmVydCBpbnB1dCBpbiB0aGUgZm9ybSBvZiBgZXhwcmVzc2lvbiB8IGZpbHRlcjEgfCBmaWx0ZXIyOmFyZzE6YXJnMmAgdG8gYSBmdW5jdGlvbiBjYWxsIGZvcm1hdFxuLy8gd2l0aCBmaWx0ZXJzIGFjY2Vzc2VkIGFzIGtvLmZpbHRlcnMuZmlsdGVyMSwgZXRjLlxuZnVuY3Rpb24gZmlsdGVyUHJlcHJvY2Vzc29yKGlucHV0KSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGlucHV0IGNvbnRhaW5zIGFueSB8IGNoYXJhY3RlcnM7IGlmIG5vdCwganVzdCByZXR1cm5cbiAgICBpZiAoaW5wdXQuaW5kZXhPZignfCcpID09PSAtMSlcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuXG4gICAgLy8gU3BsaXQgdGhlIGlucHV0IGludG8gdG9rZW5zLCBpbiB3aGljaCB8IGFuZCA6IGFyZSBpbmRpdmlkdWFsIHRva2VucywgcXVvdGVkIHN0cmluZ3MgYXJlIGlnbm9yZWQsIGFuZCBhbGwgdG9rZW5zIGFyZSBzcGFjZS10cmltbWVkXG4gICAgdmFyIHRva2VucyA9IGlucHV0Lm1hdGNoKC9cIihbXlwiXFxcXF18XFxcXC4pKlwifCcoW14nXFxcXF18XFxcXC4pKid8XFx8XFx8fFt8Ol18W15cXHN8OlwiJ11bXnw6XCInXSpbXlxcc3w6XCInXXxbXlxcc3w6XCInXS9nKTtcbiAgICBpZiAodG9rZW5zICYmIHRva2Vucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vIEFwcGVuZCBhIGxpbmUgc28gdGhhdCB3ZSBkb24ndCBuZWVkIGEgc2VwYXJhdGUgY29kZSBibG9jayB0byBkZWFsIHdpdGggdGhlIGxhc3QgaXRlbVxuICAgICAgICB0b2tlbnMucHVzaCgnfCcpO1xuICAgICAgICBpbnB1dCA9IHRva2Vuc1swXTtcbiAgICAgICAgdmFyIGxhc3RUb2tlbiwgdG9rZW4sIGluRmlsdGVycyA9IGZhbHNlLCBuZXh0SXNGaWx0ZXIgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIHRva2VuOyB0b2tlbiA9IHRva2Vuc1tpXTsgKytpKSB7XG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICd8Jykge1xuICAgICAgICAgICAgICAgIGlmIChpbkZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RUb2tlbiA9PT0gJzonKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQgKz0gXCJ1bmRlZmluZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgKz0gJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXh0SXNGaWx0ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGluRmlsdGVycyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0SXNGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBcImtvLmZpbHRlcnNbJ1wiICsgdG9rZW4gKyBcIiddKFwiICsgaW5wdXQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbkZpbHRlcnMgJiYgdG9rZW4gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFRva2VuID09PSAnOicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCArPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCArPSBcIixcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCArPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV4dElzRmlsdGVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5wdXQ7XG59XG5cbi8vIFNldCB0aGUgZmlsdGVyIHByZXByb2Nlc3NvciBmb3IgYSBzcGVjaWZpYyBiaW5kaW5nXG5mdW5jdGlvbiBlbmFibGVUZXh0RmlsdGVyKGJpbmRpbmdLZXlPckhhbmRsZXIpIHtcbiAgICBhZGRCaW5kaW5nUHJlcHJvY2Vzc29yKGJpbmRpbmdLZXlPckhhbmRsZXIsIGZpbHRlclByZXByb2Nlc3Nvcik7XG59XG5cbnZhciBmaWx0ZXJzID0ge307XG5cbi8vIENvbnZlcnQgdmFsdWUgdG8gdXBwZXJjYXNlXG5maWx0ZXJzLnVwcGVyY2FzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUudG9VcHBlckNhc2UuY2FsbChrb191bndyYXAodmFsdWUpKTtcbn07XG5cbi8vIENvbnZlcnQgdmFsdWUgdG8gbG93ZXJjYXNlXG5maWx0ZXJzLmxvd2VyY2FzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2UuY2FsbChrb191bndyYXAodmFsdWUpKTtcbn07XG5cbi8vIFJldHVybiBkZWZhdWx0IHZhbHVlIGlmIHRoZSBpbnB1dCB2YWx1ZSBpcyBlbXB0eSBvciBudWxsXG5maWx0ZXJzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAodmFsdWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHZhbHVlID0ga29fdW53cmFwKHZhbHVlKTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB0cmltKHZhbHVlKSA9PT0gJycgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUubGVuZ3RoID09IDAgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZTtcbn07XG5cbi8vIFJldHVybiB0aGUgdmFsdWUgd2l0aCB0aGUgc2VhcmNoIHN0cmluZyByZXBsYWNlZCB3aXRoIHRoZSByZXBsYWNlbWVudCBzdHJpbmdcbmZpbHRlcnMucmVwbGFjZSA9IGZ1bmN0aW9uKHZhbHVlLCBzZWFyY2gsIHJlcGxhY2UpIHtcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlLmNhbGwoa29fdW53cmFwKHZhbHVlKSwgc2VhcmNoLCByZXBsYWNlKTtcbn07XG5cbmZpbHRlcnMuZml0ID0gZnVuY3Rpb24odmFsdWUsIGxlbmd0aCwgcmVwbGFjZW1lbnQsIHRyaW1XaGVyZSkge1xuICAgIHZhbHVlID0ga29fdW53cmFwKHZhbHVlKTtcbiAgICBpZiAobGVuZ3RoICYmICgnJyArIHZhbHVlKS5sZW5ndGggPiBsZW5ndGgpIHtcbiAgICAgICAgcmVwbGFjZW1lbnQgPSAnJyArIChyZXBsYWNlbWVudCB8fCAnLi4uJyk7XG4gICAgICAgIGxlbmd0aCA9IGxlbmd0aCAtIHJlcGxhY2VtZW50Lmxlbmd0aDtcbiAgICAgICAgdmFsdWUgPSAnJyArIHZhbHVlO1xuICAgICAgICBzd2l0Y2ggKHRyaW1XaGVyZSkge1xuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VtZW50ICsgdmFsdWUuc2xpY2UoLWxlbmd0aCk7XG4gICAgICAgICAgICBjYXNlICdtaWRkbGUnOlxuICAgICAgICAgICAgICAgIHZhciBsZWZ0TGVuID0gTWF0aC5jZWlsKGxlbmd0aCAvIDIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zdWJzdHIoMCwgbGVmdExlbikgKyByZXBsYWNlbWVudCArIHZhbHVlLnNsaWNlKGxlZnRMZW4tbGVuZ3RoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cigwLCBsZW5ndGgpICsgcmVwbGFjZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxufTtcblxuLy8gQ29udmVydCBhIG1vZGVsIG9iamVjdCB0byBKU09OXG5maWx0ZXJzLmpzb24gPSBmdW5jdGlvbihyb290T2JqZWN0LCBzcGFjZSwgcmVwbGFjZXIpIHsgICAgIC8vIHJlcGxhY2VyIGFuZCBzcGFjZSBhcmUgb3B0aW9uYWxcbiAgICByZXR1cm4ga28udG9KU09OKHJvb3RPYmplY3QsIHJlcGxhY2VyLCBzcGFjZSk7XG59O1xuXG4vLyBGb3JtYXQgYSBudW1iZXIgdXNpbmcgdGhlIGJyb3dzZXIncyB0b0xvY2FsZVN0cmluZ1xuZmlsdGVycy5udW1iZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAoK2tvX3Vud3JhcCh2YWx1ZSkpLnRvTG9jYWxlU3RyaW5nKCk7XG59O1xuXG4vLyBFeHBvcnQgdGhlIGZpbHRlcnMgb2JqZWN0IGZvciBnZW5lcmFsIGFjY2Vzc1xua28uZmlsdGVycyA9IGZpbHRlcnM7XG5cbi8vIEV4cG9ydCB0aGUgcHJlcHJvY2Vzc29yIGZ1bmN0aW9uc1xua29fcHVuY2hlcy50ZXh0RmlsdGVyID0ge1xuICAgIHByZXByb2Nlc3NvcjogZmlsdGVyUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZUZvckJpbmRpbmc6IGVuYWJsZVRleHRGaWx0ZXJcbn07XG4vLyBTdXBwb3J0IGR5bmFtaWNhbGx5LWNyZWF0ZWQsIG5hbWVzcGFjZWQgYmluZGluZ3MuIFRoZSBiaW5kaW5nIGtleSBzeW50YXggaXNcbi8vIFwibmFtZXNwYWNlLmJpbmRpbmdcIi4gV2l0aGluIGEgY2VydGFpbiBuYW1lc3BhY2UsIHdlIGNhbiBkeW5hbWljYWxseSBjcmVhdGUgdGhlXG4vLyBoYW5kbGVyIGZvciBhbnkgYmluZGluZy4gVGhpcyBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBiaW5kaW5ncyB0aGF0IHdvcmtcbi8vIHRoZSBzYW1lIHdheSwgYnV0IGp1c3Qgc2V0IGEgZGlmZmVyZW50IG5hbWVkIHZhbHVlLCBzdWNoIGFzIGZvciBlbGVtZW50XG4vLyBhdHRyaWJ1dGVzIG9yIENTUyBjbGFzc2VzLlxudmFyIG5hbWVzcGFjZWRCaW5kaW5nTWF0Y2ggPSAvKFteXFwuXSspXFwuKC4rKS8sIG5hbWVzcGFjZURpdmlkZXIgPSAnLic7XG5hZGRCaW5kaW5nSGFuZGxlckNyZWF0b3IobmFtZXNwYWNlZEJpbmRpbmdNYXRjaCwgZnVuY3Rpb24gKG1hdGNoLCBiaW5kaW5nS2V5KSB7XG4gICAgdmFyIG5hbWVzcGFjZSA9IG1hdGNoWzFdLFxuICAgICAgICBuYW1lc3BhY2VIYW5kbGVyID0ga28uYmluZGluZ0hhbmRsZXJzW25hbWVzcGFjZV07XG4gICAgaWYgKG5hbWVzcGFjZUhhbmRsZXIpIHtcbiAgICAgICAgdmFyIGJpbmRpbmdOYW1lID0gbWF0Y2hbMl0sXG4gICAgICAgICAgICBoYW5kbGVyRm4gPSBuYW1lc3BhY2VIYW5kbGVyLmdldE5hbWVzcGFjZWRIYW5kbGVyIHx8IGRlZmF1bHRHZXROYW1lc3BhY2VkSGFuZGxlcixcbiAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyRm4uY2FsbChuYW1lc3BhY2VIYW5kbGVyLCBiaW5kaW5nTmFtZSwgbmFtZXNwYWNlLCBiaW5kaW5nS2V5KTtcbiAgICAgICAga28uYmluZGluZ0hhbmRsZXJzW2JpbmRpbmdLZXldID0gaGFuZGxlcjtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgfVxufSk7XG5cbi8vIEtub2Nrb3V0J3MgYnVpbHQtaW4gYmluZGluZ3MgXCJhdHRyXCIsIFwiZXZlbnRcIiwgXCJjc3NcIiBhbmQgXCJzdHlsZVwiIGluY2x1ZGUgdGhlIGlkZWEgb2Zcbi8vIG5hbWVzcGFjZXMsIHJlcHJlc2VudGluZyBpdCB1c2luZyBhIHNpbmdsZSBiaW5kaW5nIHRoYXQgdGFrZXMgYW4gb2JqZWN0IG1hcCBvZiBuYW1lc1xuLy8gdG8gdmFsdWVzLiBUaGlzIGRlZmF1bHQgaGFuZGxlciB0cmFuc2xhdGVzIGEgYmluZGluZyBvZiBcIm5hbWVzcGFjZWROYW1lOiB2YWx1ZVwiXG4vLyB0byBcIm5hbWVzcGFjZToge25hbWU6IHZhbHVlfVwiIHRvIGF1dG9tYXRpY2FsbHkgc3VwcG9ydCB0aG9zZSBidWlsdC1pbiBiaW5kaW5ncy5cbmZ1bmN0aW9uIGRlZmF1bHRHZXROYW1lc3BhY2VkSGFuZGxlcihuYW1lLCBuYW1lc3BhY2UsIG5hbWVzcGFjZWROYW1lKSB7XG4gICAgdmFyIGhhbmRsZXIgPSBrby51dGlscy5leHRlbmQoe30sIHRoaXMpO1xuICAgIGZ1bmN0aW9uIHNldEhhbmRsZXJGdW5jdGlvbihmdW5jTmFtZSkge1xuICAgICAgICBpZiAoaGFuZGxlcltmdW5jTmFtZV0pIHtcbiAgICAgICAgICAgIGhhbmRsZXJbZnVuY05hbWVdID0gZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1YlZhbHVlQWNjZXNzb3IoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgICAgICAgICAgYXJnc1sxXSA9IHN1YlZhbHVlQWNjZXNzb3I7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1tuYW1lc3BhY2VdW2Z1bmNOYW1lXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU2V0IG5ldyBpbml0IGFuZCB1cGRhdGUgZnVuY3Rpb25zIHRoYXQgd3JhcCB0aGUgb3JpZ2luYWxzXG4gICAgc2V0SGFuZGxlckZ1bmN0aW9uKCdpbml0Jyk7XG4gICAgc2V0SGFuZGxlckZ1bmN0aW9uKCd1cGRhdGUnKTtcbiAgICAvLyBDbGVhciBhbnkgcHJlcHJvY2VzcyBmdW5jdGlvbiBzaW5jZSBwcmVwcm9jZXNzaW5nIG9mIHRoZSBuZXcgYmluZGluZyB3b3VsZCBuZWVkIHRvIGJlIGRpZmZlcmVudFxuICAgIGlmIChoYW5kbGVyLnByZXByb2Nlc3MpXG4gICAgICAgIGhhbmRsZXIucHJlcHJvY2VzcyA9IG51bGw7XG4gICAgaWYgKGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbbmFtZXNwYWNlXSlcbiAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tuYW1lc3BhY2VkTmFtZV0gPSB0cnVlO1xuICAgIHJldHVybiBoYW5kbGVyO1xufVxuXG4vLyBBZGRzIGEgcHJlcHJvY2VzcyBmdW5jdGlvbiBmb3IgZXZlcnkgZ2VuZXJhdGVkIG5hbWVzcGFjZS54IGJpbmRpbmcuIFRoaXMgY2FuXG4vLyBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgZm9yIHRoZSBzYW1lIGJpbmRpbmcsIGFuZCB0aGUgcHJlcHJvY2VzcyBmdW5jdGlvbnMgd2lsbFxuLy8gYmUgY2hhaW5lZC4gSWYgdGhlIGJpbmRpbmcgaGFzIGEgY3VzdG9tIGdldE5hbWVzcGFjZWRIYW5kbGVyIG1ldGhvZCwgbWFrZSBzdXJlIHRoYXRcbi8vIGl0J3Mgc2V0IGJlZm9yZSB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQuXG5mdW5jdGlvbiBhZGREZWZhdWx0TmFtZXNwYWNlZEJpbmRpbmdQcmVwcm9jZXNzb3IobmFtZXNwYWNlLCBwcmVwcm9jZXNzRm4pIHtcbiAgICB2YXIgaGFuZGxlciA9IGtvLmdldEJpbmRpbmdIYW5kbGVyKG5hbWVzcGFjZSk7XG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzSGFuZGxlckZuID0gaGFuZGxlci5nZXROYW1lc3BhY2VkSGFuZGxlciB8fCBkZWZhdWx0R2V0TmFtZXNwYWNlZEhhbmRsZXI7XG4gICAgICAgIGhhbmRsZXIuZ2V0TmFtZXNwYWNlZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhZGRCaW5kaW5nUHJlcHJvY2Vzc29yKHByZXZpb3VzSGFuZGxlckZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHByZXByb2Nlc3NGbik7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhdXRvTmFtZXNwYWNlZFByZXByb2Nlc3Nvcih2YWx1ZSwgYmluZGluZywgYWRkQmluZGluZykge1xuICAgIGlmICh2YWx1ZS5jaGFyQXQoMCkgIT09IFwie1wiKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAvLyBIYW5kbGUgdHdvLWxldmVsIGJpbmRpbmcgc3BlY2lmaWVkIGFzIFwiYmluZGluZzoge2tleTogdmFsdWV9XCIgYnkgcGFyc2luZyBpbm5lclxuICAgIC8vIG9iamVjdCBhbmQgY29udmVydGluZyB0byBcImJpbmRpbmcua2V5OiB2YWx1ZVwiXG4gICAgdmFyIHN1YkJpbmRpbmdzID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwodmFsdWUpO1xuICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChzdWJCaW5kaW5ncywgZnVuY3Rpb24oa2V5VmFsdWUpIHtcbiAgICAgICAgYWRkQmluZGluZyhiaW5kaW5nICsgbmFtZXNwYWNlRGl2aWRlciArIGtleVZhbHVlLmtleSwga2V5VmFsdWUudmFsdWUpO1xuICAgIH0pO1xufVxuXG4vLyBTZXQgdGhlIG5hbWVzcGFjZWQgcHJlcHJvY2Vzc29yIGZvciBhIHNwZWNpZmljIGJpbmRpbmdcbmZ1bmN0aW9uIGVuYWJsZUF1dG9OYW1lc3BhY2VkU3ludGF4KGJpbmRpbmdLZXlPckhhbmRsZXIpIHtcbiAgICBhZGRCaW5kaW5nUHJlcHJvY2Vzc29yKGJpbmRpbmdLZXlPckhhbmRsZXIsIGF1dG9OYW1lc3BhY2VkUHJlcHJvY2Vzc29yKTtcbn1cblxuLy8gRXhwb3J0IHRoZSBwcmVwcm9jZXNzb3IgZnVuY3Rpb25zXG5rb19wdW5jaGVzLm5hbWVzcGFjZWRCaW5kaW5nID0ge1xuICAgIGRlZmF1bHRHZXRIYW5kbGVyOiBkZWZhdWx0R2V0TmFtZXNwYWNlZEhhbmRsZXIsXG4gICAgc2V0RGVmYXVsdEJpbmRpbmdQcmVwcm9jZXNzb3I6IGFkZERlZmF1bHROYW1lc3BhY2VkQmluZGluZ1ByZXByb2Nlc3NvciwgICAgLy8gZm9yIGJhY2t3YXJkcyBjb21wYXQuXG4gICAgYWRkRGVmYXVsdEJpbmRpbmdQcmVwcm9jZXNzb3I6IGFkZERlZmF1bHROYW1lc3BhY2VkQmluZGluZ1ByZXByb2Nlc3NvcixcbiAgICBwcmVwcm9jZXNzb3I6IGF1dG9OYW1lc3BhY2VkUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZUZvckJpbmRpbmc6IGVuYWJsZUF1dG9OYW1lc3BhY2VkU3ludGF4XG59O1xuLy8gV3JhcCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGluIGFuIGFub255bW91cyBmdW5jdGlvbiBzbyB0aGF0IGl0IGlzIGNhbGxlZCB3aXRoIHRoZSBhcHByb3ByaWF0ZVxuLy8gXCJ0aGlzXCIgdmFsdWUuXG5mdW5jdGlvbiB3cmFwcGVkQ2FsbGJhY2tQcmVwcm9jZXNzb3IodmFsKSB7XG4gICAgLy8gTWF0Y2hlcyBlaXRoZXIgYW4gaXNvbGF0ZWQgaWRlbnRpZmllciBvciBzb21ldGhpbmcgZW5kaW5nIHdpdGggYSBwcm9wZXJ0eSBhY2Nlc3NvclxuICAgIGlmICgvXihbJF9hLXpdWyRcXHddKnwuKyhcXC5cXHMqWyRfYS16XVskXFx3XSp8XFxbLitcXF0pKSQvaS50ZXN0KHZhbCkpIHtcbiAgICAgICAgcmV0dXJuICdmdW5jdGlvbihfeCxfeSxfeil7cmV0dXJuKCcgKyB2YWwgKyAnKShfeCxfeSxfeik7fSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG59XG5cbi8vIFNldCB0aGUgd3JhcHBlZENhbGxiYWNrIHByZXByb2Nlc3NvciBmb3IgYSBzcGVjaWZpYyBiaW5kaW5nXG5mdW5jdGlvbiBlbmFibGVXcmFwcGVkQ2FsbGJhY2soYmluZGluZ0tleU9ySGFuZGxlcikge1xuICAgIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yKTtcbn1cblxuLy8gRXhwb3J0IHRoZSBwcmVwcm9jZXNzb3IgZnVuY3Rpb25zXG5rb19wdW5jaGVzLndyYXBwZWRDYWxsYmFjayA9IHtcbiAgICBwcmVwcm9jZXNzb3I6IHdyYXBwZWRDYWxsYmFja1ByZXByb2Nlc3NvcixcbiAgICBlbmFibGVGb3JCaW5kaW5nOiBlbmFibGVXcmFwcGVkQ2FsbGJhY2tcbn07XG4vLyBBdHRhY2ggYSBwcmVwcm9jZXNzIGZ1bmN0aW9uIHRvIGEgc3BlY2lmaWMgcHJvcGVydHkgb2YgYSBiaW5kaW5nLiBUaGlzIGFsbG93cyB5b3UgdG9cbi8vIHByZXByb2Nlc3MgYmluZGluZyBcIm9wdGlvbnNcIiB1c2luZyB0aGUgc2FtZSBwcmVwcm9jZXNzIGZ1bmN0aW9ucyB0aGF0IHdvcmsgZm9yIGJpbmRpbmdzLlxuZnVuY3Rpb24gYWRkQmluZGluZ1Byb3BlcnR5UHJlcHJvY2Vzc29yKGJpbmRpbmdLZXlPckhhbmRsZXIsIHByb3BlcnR5LCBwcmVwcm9jZXNzRm4pIHtcbiAgICB2YXIgaGFuZGxlciA9IGdldE9yQ3JlYXRlSGFuZGxlcihiaW5kaW5nS2V5T3JIYW5kbGVyKTtcbiAgICBpZiAoIWhhbmRsZXIuX3Byb3BlcnR5UHJlcHJvY2Vzc29ycykge1xuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBiaW5kaW5nIHByZXByb2Nlc3NvclxuICAgICAgICBjaGFpblByZXByb2Nlc3NvcihoYW5kbGVyLCAncHJlcHJvY2VzcycsIHByb3BlcnR5UHJlcHJvY2Vzc29yKTtcbiAgICAgICAgaGFuZGxlci5fcHJvcGVydHlQcmVwcm9jZXNzb3JzID0ge307XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgcHJvcGVydHkgcHJlcHJvY2VzcyBmdW5jdGlvblxuICAgIGNoYWluUHJlcHJvY2Vzc29yKGhhbmRsZXIuX3Byb3BlcnR5UHJlcHJvY2Vzc29ycywgcHJvcGVydHksIHByZXByb2Nlc3NGbik7XG59XG5cbi8vIEluIG9yZGVyIHRvIHByZXByb2Nlc3MgYSBiaW5kaW5nIHByb3BlcnR5LCB3ZSBoYXZlIHRvIHByZXByb2Nlc3MgdGhlIGJpbmRpbmcgaXRzZWxmLlxuLy8gVGhpcyBwcmVwcm9jZXNzIGZ1bmN0aW9uIHNwbGl0cyB1cCB0aGUgYmluZGluZyB2YWx1ZSBhbmQgcnVucyBlYWNoIHByb3BlcnR5J3MgcHJlcHJvY2Vzc1xuLy8gZnVuY3Rpb24gaWYgaXQncyBzZXQuXG5mdW5jdGlvbiBwcm9wZXJ0eVByZXByb2Nlc3Nvcih2YWx1ZSwgYmluZGluZywgYWRkQmluZGluZykge1xuICAgIGlmICh2YWx1ZS5jaGFyQXQoMCkgIT09IFwie1wiKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB2YXIgc3ViQmluZGluZ3MgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCh2YWx1ZSksXG4gICAgICAgIHJlc3VsdFN0cmluZ3MgPSBbXSxcbiAgICAgICAgcHJvcGVydHlQcmVwcm9jZXNzb3JzID0gdGhpcy5fcHJvcGVydHlQcmVwcm9jZXNzb3JzIHx8IHt9O1xuICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChzdWJCaW5kaW5ncywgZnVuY3Rpb24oa2V5VmFsdWUpIHtcbiAgICAgICAgdmFyIHByb3AgPSBrZXlWYWx1ZS5rZXksIHByb3BWYWwgPSBrZXlWYWx1ZS52YWx1ZTtcbiAgICAgICAgaWYgKHByb3BlcnR5UHJlcHJvY2Vzc29yc1twcm9wXSkge1xuICAgICAgICAgICAgcHJvcFZhbCA9IHByb3BlcnR5UHJlcHJvY2Vzc29yc1twcm9wXShwcm9wVmFsLCBwcm9wLCBhZGRCaW5kaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbCkge1xuICAgICAgICAgICAgcmVzdWx0U3RyaW5ncy5wdXNoKFwiJ1wiICsgcHJvcCArIFwiJzpcIiArIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFwie1wiICsgcmVzdWx0U3RyaW5ncy5qb2luKFwiLFwiKSArIFwifVwiO1xufVxuXG4vLyBFeHBvcnQgdGhlIHByZXByb2Nlc3NvciBmdW5jdGlvbnNcbmtvX3B1bmNoZXMucHJlcHJvY2Vzc0JpbmRpbmdQcm9wZXJ0eSA9IHtcbiAgICBzZXRQcmVwcm9jZXNzb3I6IGFkZEJpbmRpbmdQcm9wZXJ0eVByZXByb2Nlc3NvciwgICAgIC8vIGZvciBiYWNrd2FyZHMgY29tcGF0LlxuICAgIGFkZFByZXByb2Nlc3NvcjogYWRkQmluZGluZ1Byb3BlcnR5UHJlcHJvY2Vzc29yXG59O1xuLy8gV3JhcCBhbiBleHByZXNzaW9uIGluIGFuIGFub255bW91cyBmdW5jdGlvbiBzbyB0aGF0IGl0IGlzIGNhbGxlZCB3aGVuIHRoZSBldmVudCBoYXBwZW5zXG5mdW5jdGlvbiBtYWtlRXhwcmVzc2lvbkNhbGxiYWNrUHJlcHJvY2Vzc29yKGFyZ3MpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gZXhwcmVzc2lvbkNhbGxiYWNrUHJlcHJvY2Vzc29yKHZhbCkge1xuICAgICAgICByZXR1cm4gJ2Z1bmN0aW9uKCcrYXJncysnKXtyZXR1cm4oJyArIHZhbCArICcpO30nO1xuICAgIH07XG59XG5cbnZhciBldmVudEV4cHJlc3Npb25QcmVwcm9jZXNzb3IgPSBtYWtlRXhwcmVzc2lvbkNhbGxiYWNrUHJlcHJvY2Vzc29yKFwiJGRhdGEsJGV2ZW50XCIpO1xuXG4vLyBTZXQgdGhlIGV4cHJlc3Npb25DYWxsYmFjayBwcmVwcm9jZXNzb3IgZm9yIGEgc3BlY2lmaWMgYmluZGluZ1xuZnVuY3Rpb24gZW5hYmxlRXhwcmVzc2lvbkNhbGxiYWNrKGJpbmRpbmdLZXlPckhhbmRsZXIsIGFyZ3MpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuam9pbigpO1xuICAgIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgbWFrZUV4cHJlc3Npb25DYWxsYmFja1ByZXByb2Nlc3NvcihhcmdzKSk7XG59XG5cbi8vIEV4cG9ydCB0aGUgcHJlcHJvY2Vzc29yIGZ1bmN0aW9uc1xua29fcHVuY2hlcy5leHByZXNzaW9uQ2FsbGJhY2sgPSB7XG4gICAgbWFrZVByZXByb2Nlc3NvcjogbWFrZUV4cHJlc3Npb25DYWxsYmFja1ByZXByb2Nlc3NvcixcbiAgICBldmVudFByZXByb2Nlc3NvcjogZXZlbnRFeHByZXNzaW9uUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZUZvckJpbmRpbmc6IGVuYWJsZUV4cHJlc3Npb25DYWxsYmFja1xufTtcblxuLy8gQ3JlYXRlIGFuIFwib25cIiBuYW1lc3BhY2UgZm9yIGV2ZW50cyB0byB1c2UgdGhlIGV4cHJlc3Npb24gbWV0aG9kXG5rby5iaW5kaW5nSGFuZGxlcnMub24gPSB7XG4gICAgZ2V0TmFtZXNwYWNlZEhhbmRsZXI6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGtvLmdldEJpbmRpbmdIYW5kbGVyKCdldmVudCcgKyBuYW1lc3BhY2VEaXZpZGVyICsgZXZlbnROYW1lKTtcbiAgICAgICAgcmV0dXJuIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoaGFuZGxlciwgZXZlbnRFeHByZXNzaW9uUHJlcHJvY2Vzc29yKTtcbiAgICB9XG59O1xuLy8gUGVyZm9ybWFuY2UgY29tcGFyaXNvbiBhdCBodHRwOi8vanNwZXJmLmNvbS9tYXJrdXAtaW50ZXJwb2xhdGlvbi1jb21wYXJpc29uXG5mdW5jdGlvbiBwYXJzZUludGVycG9sYXRpb25NYXJrdXAodGV4dFRvUGFyc2UsIG91dGVyVGV4dENhbGxiYWNrLCBleHByZXNzaW9uQ2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBpbm5lclBhcnNlKHRleHQpIHtcbiAgICAgICAgdmFyIGlubmVyTWF0Y2ggPSB0ZXh0Lm1hdGNoKC9eKFtcXHNcXFNdKil9fShbXFxzXFxTXSo/KVxce1xceyhbXFxzXFxTXSopJC8pO1xuICAgICAgICBpZiAoaW5uZXJNYXRjaCkge1xuICAgICAgICAgICAgaW5uZXJQYXJzZShpbm5lck1hdGNoWzFdKTtcbiAgICAgICAgICAgIG91dGVyVGV4dENhbGxiYWNrKGlubmVyTWF0Y2hbMl0pO1xuICAgICAgICAgICAgZXhwcmVzc2lvbkNhbGxiYWNrKGlubmVyTWF0Y2hbM10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwcmVzc2lvbkNhbGxiYWNrKHRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBvdXRlck1hdGNoID0gdGV4dFRvUGFyc2UubWF0Y2goL14oW1xcc1xcU10qPylcXHtcXHsoW1xcc1xcU10qKX19KFtcXHNcXFNdKikkLyk7XG4gICAgaWYgKG91dGVyTWF0Y2gpIHtcbiAgICAgICAgb3V0ZXJUZXh0Q2FsbGJhY2sob3V0ZXJNYXRjaFsxXSk7XG4gICAgICAgIGlubmVyUGFyc2Uob3V0ZXJNYXRjaFsyXSk7XG4gICAgICAgIG91dGVyVGV4dENhbGxiYWNrKG91dGVyTWF0Y2hbM10pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nID09IG51bGwgPyAnJyA6XG4gICAgICAgIHN0cmluZy50cmltID9cbiAgICAgICAgICAgIHN0cmluZy50cmltKCkgOlxuICAgICAgICAgICAgc3RyaW5nLnRvU3RyaW5nKCkucmVwbGFjZSgvXltcXHNcXHhhMF0rfFtcXHNcXHhhMF0rJC9nLCAnJyk7XG59XG5cbmZ1bmN0aW9uIGludGVycG9sYXRpb25NYXJrdXBQcmVwcm9jZXNzb3Iobm9kZSkge1xuICAgIC8vIG9ubHkgbmVlZHMgdG8gd29yayB3aXRoIHRleHQgbm9kZXNcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAmJiBub2RlLm5vZGVWYWx1ZSAmJiBub2RlLm5vZGVWYWx1ZS5pbmRleE9mKCd7eycpICE9PSAtMSAmJiAobm9kZS5wYXJlbnROb2RlIHx8IHt9KS5ub2RlTmFtZSAhPSBcIlRFWFRBUkVBXCIpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIGFkZFRleHROb2RlKHRleHQpIHtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIG5vZGVzLnB1c2goZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHdyYXBFeHByKGV4cHJlc3Npb25UZXh0KSB7XG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvblRleHQpXG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaC5hcHBseShub2Rlcywga29fcHVuY2hlc19pbnRlcnBvbGF0aW9uTWFya3VwLndyYXBFeHByZXNzaW9uKGV4cHJlc3Npb25UZXh0LCBub2RlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VJbnRlcnBvbGF0aW9uTWFya3VwKG5vZGUubm9kZVZhbHVlLCBhZGRUZXh0Tm9kZSwgd3JhcEV4cHIpXG5cbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gbm9kZXMubGVuZ3RoLCBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShub2Rlc1tpXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlcztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKCFrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLmh0bWwpIHtcbiAgICAvLyBWaXJ0dWFsIGh0bWwgYmluZGluZ1xuICAgIC8vIFNPIFF1ZXN0aW9uOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNTM0ODEzOVxuICAgIHZhciBvdmVycmlkZGVuID0ga28uYmluZGluZ0hhbmRsZXJzLmh0bWwudXBkYXRlO1xuICAgIGtvLmJpbmRpbmdIYW5kbGVycy5odG1sLnVwZGF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9IGtvX3Vud3JhcCh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICAgICAgaWYgKGh0bWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWROb2RlcyA9IGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KCcnICsgaHRtbCk7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBwYXJzZWROb2Rlcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdmVycmlkZGVuKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzLmh0bWwgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiB3cmFwRXhwcmVzc2lvbihleHByZXNzaW9uVGV4dCwgbm9kZSkge1xuICAgIHZhciBvd25lckRvY3VtZW50ID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCA6IGRvY3VtZW50LFxuICAgICAgICBjbG9zZUNvbW1lbnQgPSB0cnVlLFxuICAgICAgICBiaW5kaW5nLFxuICAgICAgICBleHByZXNzaW9uVGV4dCA9IHRyaW0oZXhwcmVzc2lvblRleHQpLFxuICAgICAgICBmaXJzdENoYXIgPSBleHByZXNzaW9uVGV4dFswXSxcbiAgICAgICAgbGFzdENoYXIgPSBleHByZXNzaW9uVGV4dFtleHByZXNzaW9uVGV4dC5sZW5ndGggLSAxXSxcbiAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgIG1hdGNoZXM7XG5cbiAgICBpZiAoZmlyc3RDaGFyID09PSAnIycpIHtcbiAgICAgICAgaWYgKGxhc3RDaGFyID09PSAnLycpIHtcbiAgICAgICAgICAgIGJpbmRpbmcgPSBleHByZXNzaW9uVGV4dC5zbGljZSgxLCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiaW5kaW5nID0gZXhwcmVzc2lvblRleHQuc2xpY2UoMSk7XG4gICAgICAgICAgICBjbG9zZUNvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hlcyA9IGJpbmRpbmcubWF0Y2goL14oW14sXCIne30oKVxcLzpbXFxdXFxzXSspXFxzKyhbXlxcczpdLiopLykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcgPSBtYXRjaGVzWzFdICsgJzonICsgbWF0Y2hlc1syXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmlyc3RDaGFyID09PSAnLycpIHtcbiAgICAgICAgLy8gcmVwbGFjZSBvbmx5IHdpdGggYSBjbG9zaW5nIGNvbW1lbnRcbiAgICB9IGVsc2UgaWYgKGZpcnN0Q2hhciA9PT0gJ3snICYmIGxhc3RDaGFyID09PSAnfScpIHtcbiAgICAgICAgYmluZGluZyA9IFwiaHRtbDpcIiArIHRyaW0oZXhwcmVzc2lvblRleHQuc2xpY2UoMSwgLTEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBiaW5kaW5nID0gXCJ0ZXh0OlwiICsgdHJpbShleHByZXNzaW9uVGV4dCk7XG4gICAgfVxuXG4gICAgaWYgKGJpbmRpbmcpXG4gICAgICAgIHJlc3VsdC5wdXNoKG93bmVyRG9jdW1lbnQuY3JlYXRlQ29tbWVudChcImtvIFwiICsgYmluZGluZykpO1xuICAgIGlmIChjbG9zZUNvbW1lbnQpXG4gICAgICAgIHJlc3VsdC5wdXNoKG93bmVyRG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIi9rb1wiKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIGVuYWJsZUludGVycG9sYXRpb25NYXJrdXAoKSB7XG4gICAgYWRkTm9kZVByZXByb2Nlc3NvcihpbnRlcnBvbGF0aW9uTWFya3VwUHJlcHJvY2Vzc29yKTtcbn1cblxuLy8gRXhwb3J0IHRoZSBwcmVwcm9jZXNzb3IgZnVuY3Rpb25zXG52YXIga29fcHVuY2hlc19pbnRlcnBvbGF0aW9uTWFya3VwID0ga29fcHVuY2hlcy5pbnRlcnBvbGF0aW9uTWFya3VwID0ge1xuICAgIHByZXByb2Nlc3NvcjogaW50ZXJwb2xhdGlvbk1hcmt1cFByZXByb2Nlc3NvcixcbiAgICBlbmFibGU6IGVuYWJsZUludGVycG9sYXRpb25NYXJrdXAsXG4gICAgd3JhcEV4cHJlc3Npb246IHdyYXBFeHByZXNzaW9uXG59O1xuXG5cbnZhciBkYXRhQmluZCA9ICdkYXRhLWJpbmQnO1xuZnVuY3Rpb24gYXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmtlclByZXByb2Nlc3Nvcihub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgJiYgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgICB2YXIgZGF0YUJpbmRBdHRyaWJ1dGUgPSBub2RlLmdldEF0dHJpYnV0ZShkYXRhQmluZCk7XG4gICAgICAgIGZvciAodmFyIGF0dHJzID0ga28udXRpbHMuYXJyYXlQdXNoQWxsKFtdLCBub2RlLmF0dHJpYnV0ZXMpLCBuID0gYXR0cnMubGVuZ3RoLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcbiAgICAgICAgICAgIGlmIChhdHRyLnNwZWNpZmllZCAmJiBhdHRyLm5hbWUgIT0gZGF0YUJpbmQgJiYgYXR0ci52YWx1ZS5pbmRleE9mKCd7eycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IFtdLCBhdHRyVmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhZGRUZXh0KHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKCdcIicgKyB0ZXh0LnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhZGRFeHByKGV4cHJlc3Npb25UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHByZXNzaW9uVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlID0gZXhwcmVzc2lvblRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKCdrby51bndyYXAoJyArIGV4cHJlc3Npb25UZXh0ICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJzZUludGVycG9sYXRpb25NYXJrdXAoYXR0ci52YWx1ZSwgYWRkVGV4dCwgYWRkRXhwcik7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgPSAnXCJcIisnICsgcGFydHMuam9pbignKycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJOYW1lID0gYXR0ci5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyQmluZGluZyA9IGtvX3B1bmNoZXNfYXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmt1cC5hdHRyaWJ1dGVCaW5kaW5nKGF0dHJOYW1lLCBhdHRyVmFsdWUsIG5vZGUpIHx8IGF0dHJpYnV0ZUJpbmRpbmcoYXR0ck5hbWUsIGF0dHJWYWx1ZSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YUJpbmRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kQXR0cmlidXRlID0gYXR0ckJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFCaW5kQXR0cmlidXRlICs9ICcsJyArIGF0dHJCaW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGRhdGFCaW5kLCBkYXRhQmluZEF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVzaW5nIHJlbW92ZUF0dHJpYnV0ZSBpbnN0ZWFkIG9mIHJlbW92ZUF0dHJpYnV0ZU5vZGUgYmVjYXVzZSBJRSBjbGVhcnMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsYXNzIGlmIHlvdSB1c2UgcmVtb3ZlQXR0cmlidXRlTm9kZSB0byByZW1vdmUgdGhlIGlkLlxuICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlQmluZGluZyhuYW1lLCB2YWx1ZSwgbm9kZSkge1xuICAgIGlmIChrby5nZXRCaW5kaW5nSGFuZGxlcihuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZSArICc6JyArIHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnYXR0ci4nICsgbmFtZSArICc6JyArIHZhbHVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZW5hYmxlQXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmt1cCgpIHtcbiAgICBhZGROb2RlUHJlcHJvY2Vzc29yKGF0dHJpYnV0ZUludGVycG9sYXRpb25NYXJrZXJQcmVwcm9jZXNzb3IpO1xufVxuXG52YXIga29fcHVuY2hlc19hdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya3VwID0ga29fcHVuY2hlcy5hdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya3VwID0ge1xuICAgIHByZXByb2Nlc3NvcjogYXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmtlclByZXByb2Nlc3NvcixcbiAgICBlbmFibGU6IGVuYWJsZUF0dHJpYnV0ZUludGVycG9sYXRpb25NYXJrdXAsXG4gICAgYXR0cmlidXRlQmluZGluZzogYXR0cmlidXRlQmluZGluZ1xufTtcblxuICAgIHJldHVybiBrb19wdW5jaGVzO1xufSkpO1xuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJHaXRodWJcIixcbiAgICBpY29uOiBcImZhLWdpdGh1YlwifSxcbiAgeyBocmVmOiBcImh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFmb3J1bS9rbm9ja291dGpzXCIsXG4gICAgdGl0bGU6IFwiR29vZ2xlIEdyb3Vwc1wiLFxuICAgIGljb246IFwiZmEtZ29vZ2xlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3RhZ3Mva25vY2tvdXQuanMvaW5mb1wiLFxuICAgIHRpdGxlOiBcIlN0YWNrT3ZlcmZsb3dcIixcbiAgICBpY29uOiBcImZhLXN0YWNrLW92ZXJmbG93XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdFwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmVcIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LWRlYnVnLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXCJcbiAgfVxuXVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9