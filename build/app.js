/*global Page*/
/*eslint no-unused-vars: 0*/

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function Page() {
  _classCallCheck(this, Page);

  this.body = ko.observable();
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
  window.$root.body("main");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2UuanMiLCJlbnRyeS5qcyIsImtub2Nrb3V0LnB1bmNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUdNLElBQUksR0FDRyxTQURQLElBQUksR0FDTTt3QkFEVixJQUFJOztBQUVOLE1BQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFBO0NBQzVCOzs7QUNMSCxTQUFTLGFBQWEsR0FBRztBQUN2QixNQUFJLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQTtBQUNsQyxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNoQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDcEIsUUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDNUIsYUFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUNoRCxNQUFNOzs7Ozs7QUFNTCxPQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUNaLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDM0I7R0FDRixDQUFDLENBQUE7Q0FDTDs7QUFFRCxTQUFTLG1CQUFtQixHQUFHO0FBQzdCLFVBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtDQUNsQjs7QUFFRCxTQUFTLHlCQUF5QixHQUFHO0FBQ25DLE1BQUksRUFBRSxHQUFHLGdCQUFnQixDQUFBO0FBQ3pCLE1BQUksRUFBRSxFQUFFO0FBQ04sWUFBUSxFQUFFLENBQUMsTUFBTTtBQUNmLFdBQUssRUFBRSxDQUFDLFdBQVc7QUFDakIsMkJBQW1CLEVBQUUsQ0FBQTtBQUNyQixjQUFLO0FBQUEsQUFDUCxXQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDakIsV0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ2pCLFdBQUssRUFBRSxDQUFDLFdBQVc7QUFDakIsZUFBTyxJQUFJ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U0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JKLDRCQUFJLENBQUMsaUJBQWlCLEVBQUU7QUFDcEIsNkNBQWlCLEdBQUcsV0FBVyxDQUFBO3lCQUNsQyxNQUFNO0FBQ0gsNkNBQWlCLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQzt5QkFDMUM7QUFDRCw0QkFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzs7O0FBRy9DLDRCQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbkM7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7O0FBRUQsYUFBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxZQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1QixtQkFBTyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztTQUM3QixNQUFNO0FBQ0gsbUJBQU8sT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1NBQ3ZDO0tBQ0o7O0FBRUQsYUFBUyxrQ0FBa0MsR0FBRztBQUMxQywyQkFBbUIsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQ2pFOztBQUVELFFBQUksdUNBQXVDLEdBQUcsVUFBVSxDQUFDLDRCQUE0QixHQUFHO0FBQ3BGLG9CQUFZLEVBQUUsd0NBQXdDO0FBQ3RELGNBQU0sRUFBRSxrQ0FBa0M7QUFDMUMsd0JBQWdCLEVBQUUsZ0JBQWdCO0tBQ3JDLENBQUM7O0FBRUUsV0FBTyxVQUFVLENBQUM7Q0FDckIsQ0FBQyxDQUFFIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIFBhZ2UqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG4gIH1cbn1cbiIsIlxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgdmFyIHVyaSA9IFwiLi9idWlsZC90ZW1wbGF0ZXMuaHRtbFwiXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGdldCB0ZW1wbGF0ZXM6XCIsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKFwiPGRpdiBpZD0nX3RlbXBsYXRlcyc+XCIpXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICB3aW5kb3cuJHJvb3QuYm9keShcIm1haW5cIilcbn1cblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgbG9hZFRlbXBsYXRlcygpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKVxuICAgIC50aGVuKHBhZ2VMb2FkZWQpXG59XG5cblxuJChzdGFydClcblxuLy8gRW5hYmxlIGxpdmVyZWxvYWQgaW4gZGV2ZWxvcG1lbnRcbmlmICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnKSB7XG4gICQuZ2V0U2NyaXB0KFwiaHR0cDovL2xvY2FsaG9zdDozNTcyOS9saXZlcmVsb2FkLmpzXCIpXG59XG4iLCIvKipcbiAqIEBsaWNlbnNlIEtub2Nrb3V0LlB1bmNoZXNcbiAqIEVuaGFuY2VkIGJpbmRpbmcgc3ludGF4ZXMgZm9yIEtub2Nrb3V0IDMrXG4gKiAoYykgTWljaGFlbCBCZXN0XG4gKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICogVmVyc2lvbiAwLjUuMVxuICovXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsna25vY2tvdXQnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIC8vIENvbW1vbkpTIG1vZHVsZVxuICAgICAgICB2YXIga28gPSByZXF1aXJlKFwia25vY2tvdXRcIik7XG4gICAgICAgIGZhY3Rvcnkoa28pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KHdpbmRvdy5rbyk7XG4gICAgfVxufShmdW5jdGlvbihrbykge1xuXG4vLyBBZGQgYSBwcmVwcm9jZXNzIGZ1bmN0aW9uIHRvIGEgYmluZGluZyBoYW5kbGVyLlxuZnVuY3Rpb24gYWRkQmluZGluZ1ByZXByb2Nlc3NvcihiaW5kaW5nS2V5T3JIYW5kbGVyLCBwcmVwcm9jZXNzRm4pIHtcbiAgICByZXR1cm4gY2hhaW5QcmVwcm9jZXNzb3IoZ2V0T3JDcmVhdGVIYW5kbGVyKGJpbmRpbmdLZXlPckhhbmRsZXIpLCAncHJlcHJvY2VzcycsIHByZXByb2Nlc3NGbik7XG59XG5cbi8vIFRoZXNlIHV0aWxpdHkgZnVuY3Rpb25zIGFyZSBzZXBhcmF0ZWQgb3V0IGJlY2F1c2UgdGhleSdyZSBhbHNvIHVzZWQgYnlcbi8vIHByZXByb2Nlc3NCaW5kaW5nUHJvcGVydHlcblxuLy8gR2V0IHRoZSBiaW5kaW5nIGhhbmRsZXIgb3IgY3JlYXRlIGEgbmV3LCBlbXB0eSBvbmVcbmZ1bmN0aW9uIGdldE9yQ3JlYXRlSGFuZGxlcihiaW5kaW5nS2V5T3JIYW5kbGVyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBiaW5kaW5nS2V5T3JIYW5kbGVyID09PSAnb2JqZWN0JyA/IGJpbmRpbmdLZXlPckhhbmRsZXIgOlxuICAgICAgICAoa28uZ2V0QmluZGluZ0hhbmRsZXIoYmluZGluZ0tleU9ySGFuZGxlcikgfHwgKGtvLmJpbmRpbmdIYW5kbGVyc1tiaW5kaW5nS2V5T3JIYW5kbGVyXSA9IHt9KSk7XG59XG4vLyBBZGQgYSBwcmVwcm9jZXNzIGZ1bmN0aW9uXG5mdW5jdGlvbiBjaGFpblByZXByb2Nlc3NvcihvYmosIHByb3AsIGZuKSB7XG4gICAgaWYgKG9ialtwcm9wXSkge1xuICAgICAgICAvLyBJZiB0aGUgaGFuZGxlciBhbHJlYWR5IGhhcyBhIHByZXByb2Nlc3MgZnVuY3Rpb24sIGNoYWluIHRoZSBuZXdcbiAgICAgICAgLy8gb25lIGFmdGVyIHRoZSBleGlzdGluZyBvbmUuIElmIHRoZSBwcmV2aW91cyBmdW5jdGlvbiBpbiB0aGUgY2hhaW5cbiAgICAgICAgLy8gcmV0dXJucyBhIGZhbHN5IHZhbHVlICh0byByZW1vdmUgdGhlIGJpbmRpbmcpLCB0aGUgY2hhaW4gZW5kcy4gVGhpc1xuICAgICAgICAvLyBtZXRob2QgYWxsb3dzIGVhY2ggZnVuY3Rpb24gdG8gbW9kaWZ5IGFuZCByZXR1cm4gdGhlIGJpbmRpbmcgdmFsdWUuXG4gICAgICAgIHZhciBwcmV2aW91c0ZuID0gb2JqW3Byb3BdO1xuICAgICAgICBvYmpbcHJvcF0gPSBmdW5jdGlvbih2YWx1ZSwgYmluZGluZywgYWRkQmluZGluZykge1xuICAgICAgICAgICAgdmFsdWUgPSBwcmV2aW91c0ZuLmNhbGwodGhpcywgdmFsdWUsIGJpbmRpbmcsIGFkZEJpbmRpbmcpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIHZhbHVlLCBiaW5kaW5nLCBhZGRCaW5kaW5nKTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbcHJvcF0gPSBmbjtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cblxuLy8gQWRkIGEgcHJlcHJvY2Vzc05vZGUgZnVuY3Rpb24gdG8gdGhlIGJpbmRpbmcgcHJvdmlkZXIuIElmIGFcbi8vIGZ1bmN0aW9uIGFscmVhZHkgZXhpc3RzLCBjaGFpbiB0aGUgbmV3IG9uZSBhZnRlciBpdC4gVGhpcyBjYWxsc1xuLy8gZWFjaCBmdW5jdGlvbiBpbiB0aGUgY2hhaW4gdW50aWwgb25lIG1vZGlmaWVzIHRoZSBub2RlLiBUaGlzXG4vLyBtZXRob2QgYWxsb3dzIG9ubHkgb25lIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgbm9kZS5cbmZ1bmN0aW9uIGFkZE5vZGVQcmVwcm9jZXNzb3IocHJlcHJvY2Vzc0ZuKSB7XG4gICAgdmFyIHByb3ZpZGVyID0ga28uYmluZGluZ1Byb3ZpZGVyLmluc3RhbmNlO1xuICAgIGlmIChwcm92aWRlci5wcmVwcm9jZXNzTm9kZSkge1xuICAgICAgICB2YXIgcHJldmlvdXNQcmVwcm9jZXNzRm4gPSBwcm92aWRlci5wcmVwcm9jZXNzTm9kZTtcbiAgICAgICAgcHJvdmlkZXIucHJlcHJvY2Vzc05vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZXMgPSBwcmV2aW91c1ByZXByb2Nlc3NGbi5jYWxsKHRoaXMsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKCFuZXdOb2RlcylcbiAgICAgICAgICAgICAgICBuZXdOb2RlcyA9IHByZXByb2Nlc3NGbi5jYWxsKHRoaXMsIG5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld05vZGVzO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3ZpZGVyLnByZXByb2Nlc3NOb2RlID0gcHJlcHJvY2Vzc0ZuO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkQmluZGluZ0hhbmRsZXJDcmVhdG9yKG1hdGNoUmVnZXgsIGNhbGxiYWNrRm4pIHtcbiAgICB2YXIgb2xkR2V0SGFuZGxlciA9IGtvLmdldEJpbmRpbmdIYW5kbGVyO1xuICAgIGtvLmdldEJpbmRpbmdIYW5kbGVyID0gZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgIHJldHVybiBvbGRHZXRIYW5kbGVyKGJpbmRpbmdLZXkpIHx8ICgobWF0Y2ggPSBiaW5kaW5nS2V5Lm1hdGNoKG1hdGNoUmVnZXgpKSAmJiBjYWxsYmFja0ZuKG1hdGNoLCBiaW5kaW5nS2V5KSk7XG4gICAgfTtcbn1cblxuLy8gQ3JlYXRlIHNob3J0Y3V0cyB0byBjb21tb25seSB1c2VkIGtvIGZ1bmN0aW9uc1xudmFyIGtvX3Vud3JhcCA9IGtvLnVud3JhcDtcblxuLy8gQ3JlYXRlIFwicHVuY2hlc1wiIG9iamVjdCBhbmQgZXhwb3J0IHV0aWxpdHkgZnVuY3Rpb25zXG52YXIga29fcHVuY2hlcyA9IGtvLnB1bmNoZXMgPSB7XG4gICAgdXRpbHM6IHtcbiAgICAgICAgYWRkQmluZGluZ1ByZXByb2Nlc3NvcjogYWRkQmluZGluZ1ByZXByb2Nlc3NvcixcbiAgICAgICAgYWRkTm9kZVByZXByb2Nlc3NvcjogYWRkTm9kZVByZXByb2Nlc3NvcixcbiAgICAgICAgYWRkQmluZGluZ0hhbmRsZXJDcmVhdG9yOiBhZGRCaW5kaW5nSGFuZGxlckNyZWF0b3IsXG5cbiAgICAgICAgLy8gcHJldmlvdXMgbmFtZXMgcmV0YWluZWQgZm9yIGJhY2t3YXJkcyBjb21waXRpYmlsaXR5XG4gICAgICAgIHNldEJpbmRpbmdQcmVwcm9jZXNzb3I6IGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IsXG4gICAgICAgIHNldE5vZGVQcmVwcm9jZXNzb3I6IGFkZE5vZGVQcmVwcm9jZXNzb3JcbiAgICB9XG59O1xuXG5rb19wdW5jaGVzLmVuYWJsZUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBFbmFibGUgaW50ZXJwb2xhdGlvbiBtYXJrdXBcbiAgICBlbmFibGVJbnRlcnBvbGF0aW9uTWFya3VwKCk7XG4gICAgZW5hYmxlQXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmt1cCgpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG8tbmFtc3BhY2luZyBvZiBhdHRyLCBjc3MsIGV2ZW50LCBhbmQgc3R5bGVcbiAgICBlbmFibGVBdXRvTmFtZXNwYWNlZFN5bnRheCgnYXR0cicpO1xuICAgIGVuYWJsZUF1dG9OYW1lc3BhY2VkU3ludGF4KCdjc3MnKTtcbiAgICBlbmFibGVBdXRvTmFtZXNwYWNlZFN5bnRheCgnZXZlbnQnKTtcbiAgICBlbmFibGVBdXRvTmFtZXNwYWNlZFN5bnRheCgnc3R5bGUnKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IEtub2Nrb3V0IGtub3dzIHRvIGJpbmQgY2hlY2tlZCBhZnRlciBhdHRyLnZhbHVlIChzZWUgIzQwKVxuICAgIGtvLmJpbmRpbmdIYW5kbGVycy5jaGVja2VkLmFmdGVyLnB1c2goJ2F0dHIudmFsdWUnKTtcblxuICAgIC8vIEVuYWJsZSBmaWx0ZXIgc3ludGF4IGZvciB0ZXh0LCBodG1sLCBhbmQgYXR0clxuICAgIGVuYWJsZVRleHRGaWx0ZXIoJ3RleHQnKTtcbiAgICBlbmFibGVUZXh0RmlsdGVyKCdodG1sJyk7XG4gICAgYWRkRGVmYXVsdE5hbWVzcGFjZWRCaW5kaW5nUHJlcHJvY2Vzc29yKCdhdHRyJywgZmlsdGVyUHJlcHJvY2Vzc29yKTtcblxuICAgIC8vIEVuYWJsZSB3cmFwcGVkIGNhbGxiYWNrcyBmb3IgY2xpY2ssIHN1Ym1pdCwgZXZlbnQsIG9wdGlvbnNBZnRlclJlbmRlciwgYW5kIHRlbXBsYXRlIG9wdGlvbnNcbiAgICBlbmFibGVXcmFwcGVkQ2FsbGJhY2soJ2NsaWNrJyk7XG4gICAgZW5hYmxlV3JhcHBlZENhbGxiYWNrKCdzdWJtaXQnKTtcbiAgICBlbmFibGVXcmFwcGVkQ2FsbGJhY2soJ29wdGlvbnNBZnRlclJlbmRlcicpO1xuICAgIGFkZERlZmF1bHROYW1lc3BhY2VkQmluZGluZ1ByZXByb2Nlc3NvcignZXZlbnQnLCB3cmFwcGVkQ2FsbGJhY2tQcmVwcm9jZXNzb3IpO1xuICAgIGFkZEJpbmRpbmdQcm9wZXJ0eVByZXByb2Nlc3NvcigndGVtcGxhdGUnLCAnYmVmb3JlUmVtb3ZlJywgd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yKTtcbiAgICBhZGRCaW5kaW5nUHJvcGVydHlQcmVwcm9jZXNzb3IoJ3RlbXBsYXRlJywgJ2FmdGVyQWRkJywgd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yKTtcbiAgICBhZGRCaW5kaW5nUHJvcGVydHlQcmVwcm9jZXNzb3IoJ3RlbXBsYXRlJywgJ2FmdGVyUmVuZGVyJywgd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yKTtcbn07XG4vLyBDb252ZXJ0IGlucHV0IGluIHRoZSBmb3JtIG9mIGBleHByZXNzaW9uIHwgZmlsdGVyMSB8IGZpbHRlcjI6YXJnMTphcmcyYCB0byBhIGZ1bmN0aW9uIGNhbGwgZm9ybWF0XG4vLyB3aXRoIGZpbHRlcnMgYWNjZXNzZWQgYXMga28uZmlsdGVycy5maWx0ZXIxLCBldGMuXG5mdW5jdGlvbiBmaWx0ZXJQcmVwcm9jZXNzb3IoaW5wdXQpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgaW5wdXQgY29udGFpbnMgYW55IHwgY2hhcmFjdGVyczsgaWYgbm90LCBqdXN0IHJldHVyblxuICAgIGlmIChpbnB1dC5pbmRleE9mKCd8JykgPT09IC0xKVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG5cbiAgICAvLyBTcGxpdCB0aGUgaW5wdXQgaW50byB0b2tlbnMsIGluIHdoaWNoIHwgYW5kIDogYXJlIGluZGl2aWR1YWwgdG9rZW5zLCBxdW90ZWQgc3RyaW5ncyBhcmUgaWdub3JlZCwgYW5kIGFsbCB0b2tlbnMgYXJlIHNwYWNlLXRyaW1tZWRcbiAgICB2YXIgdG9rZW5zID0gaW5wdXQubWF0Y2goL1wiKFteXCJcXFxcXXxcXFxcLikqXCJ8JyhbXidcXFxcXXxcXFxcLikqJ3xcXHxcXHx8W3w6XXxbXlxcc3w6XCInXVtefDpcIiddKlteXFxzfDpcIiddfFteXFxzfDpcIiddL2cpO1xuICAgIGlmICh0b2tlbnMgJiYgdG9rZW5zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gQXBwZW5kIGEgbGluZSBzbyB0aGF0IHdlIGRvbid0IG5lZWQgYSBzZXBhcmF0ZSBjb2RlIGJsb2NrIHRvIGRlYWwgd2l0aCB0aGUgbGFzdCBpdGVtXG4gICAgICAgIHRva2Vucy5wdXNoKCd8Jyk7XG4gICAgICAgIGlucHV0ID0gdG9rZW5zWzBdO1xuICAgICAgICB2YXIgbGFzdFRva2VuLCB0b2tlbiwgaW5GaWx0ZXJzID0gZmFsc2UsIG5leHRJc0ZpbHRlciA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMSwgdG9rZW47IHRva2VuID0gdG9rZW5zW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gJ3wnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluRmlsdGVycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFRva2VuID09PSAnOicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCArPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCArPSAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5leHRJc0ZpbHRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5GaWx0ZXJzID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRJc0ZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IFwia28uZmlsdGVyc1snXCIgKyB0b2tlbiArIFwiJ10oXCIgKyBpbnB1dDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluRmlsdGVycyAmJiB0b2tlbiA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VG9rZW4gPT09ICc6JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0ICs9IFwidW5kZWZpbmVkXCI7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ICs9IFwiLFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ICs9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXh0SXNGaWx0ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbn1cblxuLy8gU2V0IHRoZSBmaWx0ZXIgcHJlcHJvY2Vzc29yIGZvciBhIHNwZWNpZmljIGJpbmRpbmdcbmZ1bmN0aW9uIGVuYWJsZVRleHRGaWx0ZXIoYmluZGluZ0tleU9ySGFuZGxlcikge1xuICAgIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgZmlsdGVyUHJlcHJvY2Vzc29yKTtcbn1cblxudmFyIGZpbHRlcnMgPSB7fTtcblxuLy8gQ29udmVydCB2YWx1ZSB0byB1cHBlcmNhc2VcbmZpbHRlcnMudXBwZXJjYXNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50b1VwcGVyQ2FzZS5jYWxsKGtvX3Vud3JhcCh2YWx1ZSkpO1xufTtcblxuLy8gQ29udmVydCB2YWx1ZSB0byBsb3dlcmNhc2VcbmZpbHRlcnMubG93ZXJjYXNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50b0xvd2VyQ2FzZS5jYWxsKGtvX3Vud3JhcCh2YWx1ZSkpO1xufTtcblxuLy8gUmV0dXJuIGRlZmF1bHQgdmFsdWUgaWYgdGhlIGlucHV0IHZhbHVlIGlzIGVtcHR5IG9yIG51bGxcbmZpbHRlcnNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgdmFsdWUgPSBrb191bndyYXAodmFsdWUpO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHRyaW0odmFsdWUpID09PSAnJyA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS5sZW5ndGggPT0gMCA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlO1xufTtcblxuLy8gUmV0dXJuIHRoZSB2YWx1ZSB3aXRoIHRoZSBzZWFyY2ggc3RyaW5nIHJlcGxhY2VkIHdpdGggdGhlIHJlcGxhY2VtZW50IHN0cmluZ1xuZmlsdGVycy5yZXBsYWNlID0gZnVuY3Rpb24odmFsdWUsIHNlYXJjaCwgcmVwbGFjZSkge1xuICAgIHJldHVybiBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UuY2FsbChrb191bndyYXAodmFsdWUpLCBzZWFyY2gsIHJlcGxhY2UpO1xufTtcblxuZmlsdGVycy5maXQgPSBmdW5jdGlvbih2YWx1ZSwgbGVuZ3RoLCByZXBsYWNlbWVudCwgdHJpbVdoZXJlKSB7XG4gICAgdmFsdWUgPSBrb191bndyYXAodmFsdWUpO1xuICAgIGlmIChsZW5ndGggJiYgKCcnICsgdmFsdWUpLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgICAgICByZXBsYWNlbWVudCA9ICcnICsgKHJlcGxhY2VtZW50IHx8ICcuLi4nKTtcbiAgICAgICAgbGVuZ3RoID0gbGVuZ3RoIC0gcmVwbGFjZW1lbnQubGVuZ3RoO1xuICAgICAgICB2YWx1ZSA9ICcnICsgdmFsdWU7XG4gICAgICAgIHN3aXRjaCAodHJpbVdoZXJlKSB7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwbGFjZW1lbnQgKyB2YWx1ZS5zbGljZSgtbGVuZ3RoKTtcbiAgICAgICAgICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRMZW4gPSBNYXRoLmNlaWwobGVuZ3RoIC8gMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cigwLCBsZWZ0TGVuKSArIHJlcGxhY2VtZW50ICsgdmFsdWUuc2xpY2UobGVmdExlbi1sZW5ndGgpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyKDAsIGxlbmd0aCkgKyByZXBsYWNlbWVudDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuXG4vLyBDb252ZXJ0IGEgbW9kZWwgb2JqZWN0IHRvIEpTT05cbmZpbHRlcnMuanNvbiA9IGZ1bmN0aW9uKHJvb3RPYmplY3QsIHNwYWNlLCByZXBsYWNlcikgeyAgICAgLy8gcmVwbGFjZXIgYW5kIHNwYWNlIGFyZSBvcHRpb25hbFxuICAgIHJldHVybiBrby50b0pTT04ocm9vdE9iamVjdCwgcmVwbGFjZXIsIHNwYWNlKTtcbn07XG5cbi8vIEZvcm1hdCBhIG51bWJlciB1c2luZyB0aGUgYnJvd3NlcidzIHRvTG9jYWxlU3RyaW5nXG5maWx0ZXJzLm51bWJlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuICgra29fdW53cmFwKHZhbHVlKSkudG9Mb2NhbGVTdHJpbmcoKTtcbn07XG5cbi8vIEV4cG9ydCB0aGUgZmlsdGVycyBvYmplY3QgZm9yIGdlbmVyYWwgYWNjZXNzXG5rby5maWx0ZXJzID0gZmlsdGVycztcblxuLy8gRXhwb3J0IHRoZSBwcmVwcm9jZXNzb3IgZnVuY3Rpb25zXG5rb19wdW5jaGVzLnRleHRGaWx0ZXIgPSB7XG4gICAgcHJlcHJvY2Vzc29yOiBmaWx0ZXJQcmVwcm9jZXNzb3IsXG4gICAgZW5hYmxlRm9yQmluZGluZzogZW5hYmxlVGV4dEZpbHRlclxufTtcbi8vIFN1cHBvcnQgZHluYW1pY2FsbHktY3JlYXRlZCwgbmFtZXNwYWNlZCBiaW5kaW5ncy4gVGhlIGJpbmRpbmcga2V5IHN5bnRheCBpc1xuLy8gXCJuYW1lc3BhY2UuYmluZGluZ1wiLiBXaXRoaW4gYSBjZXJ0YWluIG5hbWVzcGFjZSwgd2UgY2FuIGR5bmFtaWNhbGx5IGNyZWF0ZSB0aGVcbi8vIGhhbmRsZXIgZm9yIGFueSBiaW5kaW5nLiBUaGlzIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIGJpbmRpbmdzIHRoYXQgd29ya1xuLy8gdGhlIHNhbWUgd2F5LCBidXQganVzdCBzZXQgYSBkaWZmZXJlbnQgbmFtZWQgdmFsdWUsIHN1Y2ggYXMgZm9yIGVsZW1lbnRcbi8vIGF0dHJpYnV0ZXMgb3IgQ1NTIGNsYXNzZXMuXG52YXIgbmFtZXNwYWNlZEJpbmRpbmdNYXRjaCA9IC8oW15cXC5dKylcXC4oLispLywgbmFtZXNwYWNlRGl2aWRlciA9ICcuJztcbmFkZEJpbmRpbmdIYW5kbGVyQ3JlYXRvcihuYW1lc3BhY2VkQmluZGluZ01hdGNoLCBmdW5jdGlvbiAobWF0Y2gsIGJpbmRpbmdLZXkpIHtcbiAgICB2YXIgbmFtZXNwYWNlID0gbWF0Y2hbMV0sXG4gICAgICAgIG5hbWVzcGFjZUhhbmRsZXIgPSBrby5iaW5kaW5nSGFuZGxlcnNbbmFtZXNwYWNlXTtcbiAgICBpZiAobmFtZXNwYWNlSGFuZGxlcikge1xuICAgICAgICB2YXIgYmluZGluZ05hbWUgPSBtYXRjaFsyXSxcbiAgICAgICAgICAgIGhhbmRsZXJGbiA9IG5hbWVzcGFjZUhhbmRsZXIuZ2V0TmFtZXNwYWNlZEhhbmRsZXIgfHwgZGVmYXVsdEdldE5hbWVzcGFjZWRIYW5kbGVyLFxuICAgICAgICAgICAgaGFuZGxlciA9IGhhbmRsZXJGbi5jYWxsKG5hbWVzcGFjZUhhbmRsZXIsIGJpbmRpbmdOYW1lLCBuYW1lc3BhY2UsIGJpbmRpbmdLZXkpO1xuICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbYmluZGluZ0tleV0gPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm4gaGFuZGxlcjtcbiAgICB9XG59KTtcblxuLy8gS25vY2tvdXQncyBidWlsdC1pbiBiaW5kaW5ncyBcImF0dHJcIiwgXCJldmVudFwiLCBcImNzc1wiIGFuZCBcInN0eWxlXCIgaW5jbHVkZSB0aGUgaWRlYSBvZlxuLy8gbmFtZXNwYWNlcywgcmVwcmVzZW50aW5nIGl0IHVzaW5nIGEgc2luZ2xlIGJpbmRpbmcgdGhhdCB0YWtlcyBhbiBvYmplY3QgbWFwIG9mIG5hbWVzXG4vLyB0byB2YWx1ZXMuIFRoaXMgZGVmYXVsdCBoYW5kbGVyIHRyYW5zbGF0ZXMgYSBiaW5kaW5nIG9mIFwibmFtZXNwYWNlZE5hbWU6IHZhbHVlXCJcbi8vIHRvIFwibmFtZXNwYWNlOiB7bmFtZTogdmFsdWV9XCIgdG8gYXV0b21hdGljYWxseSBzdXBwb3J0IHRob3NlIGJ1aWx0LWluIGJpbmRpbmdzLlxuZnVuY3Rpb24gZGVmYXVsdEdldE5hbWVzcGFjZWRIYW5kbGVyKG5hbWUsIG5hbWVzcGFjZSwgbmFtZXNwYWNlZE5hbWUpIHtcbiAgICB2YXIgaGFuZGxlciA9IGtvLnV0aWxzLmV4dGVuZCh7fSwgdGhpcyk7XG4gICAgZnVuY3Rpb24gc2V0SGFuZGxlckZ1bmN0aW9uKGZ1bmNOYW1lKSB7XG4gICAgICAgIGlmIChoYW5kbGVyW2Z1bmNOYW1lXSkge1xuICAgICAgICAgICAgaGFuZGxlcltmdW5jTmFtZV0gPSBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc3ViVmFsdWVBY2Nlc3NvcigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgICAgICAgICAgICBhcmdzWzFdID0gc3ViVmFsdWVBY2Nlc3NvcjtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzW25hbWVzcGFjZV1bZnVuY05hbWVdLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBTZXQgbmV3IGluaXQgYW5kIHVwZGF0ZSBmdW5jdGlvbnMgdGhhdCB3cmFwIHRoZSBvcmlnaW5hbHNcbiAgICBzZXRIYW5kbGVyRnVuY3Rpb24oJ2luaXQnKTtcbiAgICBzZXRIYW5kbGVyRnVuY3Rpb24oJ3VwZGF0ZScpO1xuICAgIC8vIENsZWFyIGFueSBwcmVwcm9jZXNzIGZ1bmN0aW9uIHNpbmNlIHByZXByb2Nlc3Npbmcgb2YgdGhlIG5ldyBiaW5kaW5nIHdvdWxkIG5lZWQgdG8gYmUgZGlmZmVyZW50XG4gICAgaWYgKGhhbmRsZXIucHJlcHJvY2VzcylcbiAgICAgICAgaGFuZGxlci5wcmVwcm9jZXNzID0gbnVsbDtcbiAgICBpZiAoa28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tuYW1lc3BhY2VdKVxuICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzW25hbWVzcGFjZWROYW1lXSA9IHRydWU7XG4gICAgcmV0dXJuIGhhbmRsZXI7XG59XG5cbi8vIEFkZHMgYSBwcmVwcm9jZXNzIGZ1bmN0aW9uIGZvciBldmVyeSBnZW5lcmF0ZWQgbmFtZXNwYWNlLnggYmluZGluZy4gVGhpcyBjYW5cbi8vIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBmb3IgdGhlIHNhbWUgYmluZGluZywgYW5kIHRoZSBwcmVwcm9jZXNzIGZ1bmN0aW9ucyB3aWxsXG4vLyBiZSBjaGFpbmVkLiBJZiB0aGUgYmluZGluZyBoYXMgYSBjdXN0b20gZ2V0TmFtZXNwYWNlZEhhbmRsZXIgbWV0aG9kLCBtYWtlIHN1cmUgdGhhdFxuLy8gaXQncyBzZXQgYmVmb3JlIHRoaXMgZnVuY3Rpb24gaXMgdXNlZC5cbmZ1bmN0aW9uIGFkZERlZmF1bHROYW1lc3BhY2VkQmluZGluZ1ByZXByb2Nlc3NvcihuYW1lc3BhY2UsIHByZXByb2Nlc3NGbikge1xuICAgIHZhciBoYW5kbGVyID0ga28uZ2V0QmluZGluZ0hhbmRsZXIobmFtZXNwYWNlKTtcbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICB2YXIgcHJldmlvdXNIYW5kbGVyRm4gPSBoYW5kbGVyLmdldE5hbWVzcGFjZWRIYW5kbGVyIHx8IGRlZmF1bHRHZXROYW1lc3BhY2VkSGFuZGxlcjtcbiAgICAgICAgaGFuZGxlci5nZXROYW1lc3BhY2VkSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IocHJldmlvdXNIYW5kbGVyRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcHJlcHJvY2Vzc0ZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGF1dG9OYW1lc3BhY2VkUHJlcHJvY2Vzc29yKHZhbHVlLCBiaW5kaW5nLCBhZGRCaW5kaW5nKSB7XG4gICAgaWYgKHZhbHVlLmNoYXJBdCgwKSAhPT0gXCJ7XCIpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIC8vIEhhbmRsZSB0d28tbGV2ZWwgYmluZGluZyBzcGVjaWZpZWQgYXMgXCJiaW5kaW5nOiB7a2V5OiB2YWx1ZX1cIiBieSBwYXJzaW5nIGlubmVyXG4gICAgLy8gb2JqZWN0IGFuZCBjb252ZXJ0aW5nIHRvIFwiYmluZGluZy5rZXk6IHZhbHVlXCJcbiAgICB2YXIgc3ViQmluZGluZ3MgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCh2YWx1ZSk7XG4gICAga28udXRpbHMuYXJyYXlGb3JFYWNoKHN1YkJpbmRpbmdzLCBmdW5jdGlvbihrZXlWYWx1ZSkge1xuICAgICAgICBhZGRCaW5kaW5nKGJpbmRpbmcgKyBuYW1lc3BhY2VEaXZpZGVyICsga2V5VmFsdWUua2V5LCBrZXlWYWx1ZS52YWx1ZSk7XG4gICAgfSk7XG59XG5cbi8vIFNldCB0aGUgbmFtZXNwYWNlZCBwcmVwcm9jZXNzb3IgZm9yIGEgc3BlY2lmaWMgYmluZGluZ1xuZnVuY3Rpb24gZW5hYmxlQXV0b05hbWVzcGFjZWRTeW50YXgoYmluZGluZ0tleU9ySGFuZGxlcikge1xuICAgIGFkZEJpbmRpbmdQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgYXV0b05hbWVzcGFjZWRQcmVwcm9jZXNzb3IpO1xufVxuXG4vLyBFeHBvcnQgdGhlIHByZXByb2Nlc3NvciBmdW5jdGlvbnNcbmtvX3B1bmNoZXMubmFtZXNwYWNlZEJpbmRpbmcgPSB7XG4gICAgZGVmYXVsdEdldEhhbmRsZXI6IGRlZmF1bHRHZXROYW1lc3BhY2VkSGFuZGxlcixcbiAgICBzZXREZWZhdWx0QmluZGluZ1ByZXByb2Nlc3NvcjogYWRkRGVmYXVsdE5hbWVzcGFjZWRCaW5kaW5nUHJlcHJvY2Vzc29yLCAgICAvLyBmb3IgYmFja3dhcmRzIGNvbXBhdC5cbiAgICBhZGREZWZhdWx0QmluZGluZ1ByZXByb2Nlc3NvcjogYWRkRGVmYXVsdE5hbWVzcGFjZWRCaW5kaW5nUHJlcHJvY2Vzc29yLFxuICAgIHByZXByb2Nlc3NvcjogYXV0b05hbWVzcGFjZWRQcmVwcm9jZXNzb3IsXG4gICAgZW5hYmxlRm9yQmluZGluZzogZW5hYmxlQXV0b05hbWVzcGFjZWRTeW50YXhcbn07XG4vLyBXcmFwIGEgY2FsbGJhY2sgZnVuY3Rpb24gaW4gYW4gYW5vbnltb3VzIGZ1bmN0aW9uIHNvIHRoYXQgaXQgaXMgY2FsbGVkIHdpdGggdGhlIGFwcHJvcHJpYXRlXG4vLyBcInRoaXNcIiB2YWx1ZS5cbmZ1bmN0aW9uIHdyYXBwZWRDYWxsYmFja1ByZXByb2Nlc3Nvcih2YWwpIHtcbiAgICAvLyBNYXRjaGVzIGVpdGhlciBhbiBpc29sYXRlZCBpZGVudGlmaWVyIG9yIHNvbWV0aGluZyBlbmRpbmcgd2l0aCBhIHByb3BlcnR5IGFjY2Vzc29yXG4gICAgaWYgKC9eKFskX2Etel1bJFxcd10qfC4rKFxcLlxccypbJF9hLXpdWyRcXHddKnxcXFsuK1xcXSkpJC9pLnRlc3QodmFsKSkge1xuICAgICAgICByZXR1cm4gJ2Z1bmN0aW9uKF94LF95LF96KXtyZXR1cm4oJyArIHZhbCArICcpKF94LF95LF96KTt9JztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbn1cblxuLy8gU2V0IHRoZSB3cmFwcGVkQ2FsbGJhY2sgcHJlcHJvY2Vzc29yIGZvciBhIHNwZWNpZmljIGJpbmRpbmdcbmZ1bmN0aW9uIGVuYWJsZVdyYXBwZWRDYWxsYmFjayhiaW5kaW5nS2V5T3JIYW5kbGVyKSB7XG4gICAgYWRkQmluZGluZ1ByZXByb2Nlc3NvcihiaW5kaW5nS2V5T3JIYW5kbGVyLCB3cmFwcGVkQ2FsbGJhY2tQcmVwcm9jZXNzb3IpO1xufVxuXG4vLyBFeHBvcnQgdGhlIHByZXByb2Nlc3NvciBmdW5jdGlvbnNcbmtvX3B1bmNoZXMud3JhcHBlZENhbGxiYWNrID0ge1xuICAgIHByZXByb2Nlc3Nvcjogd3JhcHBlZENhbGxiYWNrUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZUZvckJpbmRpbmc6IGVuYWJsZVdyYXBwZWRDYWxsYmFja1xufTtcbi8vIEF0dGFjaCBhIHByZXByb2Nlc3MgZnVuY3Rpb24gdG8gYSBzcGVjaWZpYyBwcm9wZXJ0eSBvZiBhIGJpbmRpbmcuIFRoaXMgYWxsb3dzIHlvdSB0b1xuLy8gcHJlcHJvY2VzcyBiaW5kaW5nIFwib3B0aW9uc1wiIHVzaW5nIHRoZSBzYW1lIHByZXByb2Nlc3MgZnVuY3Rpb25zIHRoYXQgd29yayBmb3IgYmluZGluZ3MuXG5mdW5jdGlvbiBhZGRCaW5kaW5nUHJvcGVydHlQcmVwcm9jZXNzb3IoYmluZGluZ0tleU9ySGFuZGxlciwgcHJvcGVydHksIHByZXByb2Nlc3NGbikge1xuICAgIHZhciBoYW5kbGVyID0gZ2V0T3JDcmVhdGVIYW5kbGVyKGJpbmRpbmdLZXlPckhhbmRsZXIpO1xuICAgIGlmICghaGFuZGxlci5fcHJvcGVydHlQcmVwcm9jZXNzb3JzKSB7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIGJpbmRpbmcgcHJlcHJvY2Vzc29yXG4gICAgICAgIGNoYWluUHJlcHJvY2Vzc29yKGhhbmRsZXIsICdwcmVwcm9jZXNzJywgcHJvcGVydHlQcmVwcm9jZXNzb3IpO1xuICAgICAgICBoYW5kbGVyLl9wcm9wZXJ0eVByZXByb2Nlc3NvcnMgPSB7fTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBwcm9wZXJ0eSBwcmVwcm9jZXNzIGZ1bmN0aW9uXG4gICAgY2hhaW5QcmVwcm9jZXNzb3IoaGFuZGxlci5fcHJvcGVydHlQcmVwcm9jZXNzb3JzLCBwcm9wZXJ0eSwgcHJlcHJvY2Vzc0ZuKTtcbn1cblxuLy8gSW4gb3JkZXIgdG8gcHJlcHJvY2VzcyBhIGJpbmRpbmcgcHJvcGVydHksIHdlIGhhdmUgdG8gcHJlcHJvY2VzcyB0aGUgYmluZGluZyBpdHNlbGYuXG4vLyBUaGlzIHByZXByb2Nlc3MgZnVuY3Rpb24gc3BsaXRzIHVwIHRoZSBiaW5kaW5nIHZhbHVlIGFuZCBydW5zIGVhY2ggcHJvcGVydHkncyBwcmVwcm9jZXNzXG4vLyBmdW5jdGlvbiBpZiBpdCdzIHNldC5cbmZ1bmN0aW9uIHByb3BlcnR5UHJlcHJvY2Vzc29yKHZhbHVlLCBiaW5kaW5nLCBhZGRCaW5kaW5nKSB7XG4gICAgaWYgKHZhbHVlLmNoYXJBdCgwKSAhPT0gXCJ7XCIpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIHZhciBzdWJCaW5kaW5ncyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKHZhbHVlKSxcbiAgICAgICAgcmVzdWx0U3RyaW5ncyA9IFtdLFxuICAgICAgICBwcm9wZXJ0eVByZXByb2Nlc3NvcnMgPSB0aGlzLl9wcm9wZXJ0eVByZXByb2Nlc3NvcnMgfHwge307XG4gICAga28udXRpbHMuYXJyYXlGb3JFYWNoKHN1YkJpbmRpbmdzLCBmdW5jdGlvbihrZXlWYWx1ZSkge1xuICAgICAgICB2YXIgcHJvcCA9IGtleVZhbHVlLmtleSwgcHJvcFZhbCA9IGtleVZhbHVlLnZhbHVlO1xuICAgICAgICBpZiAocHJvcGVydHlQcmVwcm9jZXNzb3JzW3Byb3BdKSB7XG4gICAgICAgICAgICBwcm9wVmFsID0gcHJvcGVydHlQcmVwcm9jZXNzb3JzW3Byb3BdKHByb3BWYWwsIHByb3AsIGFkZEJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wVmFsKSB7XG4gICAgICAgICAgICByZXN1bHRTdHJpbmdzLnB1c2goXCInXCIgKyBwcm9wICsgXCInOlwiICsgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gXCJ7XCIgKyByZXN1bHRTdHJpbmdzLmpvaW4oXCIsXCIpICsgXCJ9XCI7XG59XG5cbi8vIEV4cG9ydCB0aGUgcHJlcHJvY2Vzc29yIGZ1bmN0aW9uc1xua29fcHVuY2hlcy5wcmVwcm9jZXNzQmluZGluZ1Byb3BlcnR5ID0ge1xuICAgIHNldFByZXByb2Nlc3NvcjogYWRkQmluZGluZ1Byb3BlcnR5UHJlcHJvY2Vzc29yLCAgICAgLy8gZm9yIGJhY2t3YXJkcyBjb21wYXQuXG4gICAgYWRkUHJlcHJvY2Vzc29yOiBhZGRCaW5kaW5nUHJvcGVydHlQcmVwcm9jZXNzb3Jcbn07XG4vLyBXcmFwIGFuIGV4cHJlc3Npb24gaW4gYW4gYW5vbnltb3VzIGZ1bmN0aW9uIHNvIHRoYXQgaXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGhhcHBlbnNcbmZ1bmN0aW9uIG1ha2VFeHByZXNzaW9uQ2FsbGJhY2tQcmVwcm9jZXNzb3IoYXJncykge1xuICAgIHJldHVybiBmdW5jdGlvbiBleHByZXNzaW9uQ2FsbGJhY2tQcmVwcm9jZXNzb3IodmFsKSB7XG4gICAgICAgIHJldHVybiAnZnVuY3Rpb24oJythcmdzKycpe3JldHVybignICsgdmFsICsgJyk7fSc7XG4gICAgfTtcbn1cblxudmFyIGV2ZW50RXhwcmVzc2lvblByZXByb2Nlc3NvciA9IG1ha2VFeHByZXNzaW9uQ2FsbGJhY2tQcmVwcm9jZXNzb3IoXCIkZGF0YSwkZXZlbnRcIik7XG5cbi8vIFNldCB0aGUgZXhwcmVzc2lvbkNhbGxiYWNrIHByZXByb2Nlc3NvciBmb3IgYSBzcGVjaWZpYyBiaW5kaW5nXG5mdW5jdGlvbiBlbmFibGVFeHByZXNzaW9uQ2FsbGJhY2soYmluZGluZ0tleU9ySGFuZGxlciwgYXJncykge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5qb2luKCk7XG4gICAgYWRkQmluZGluZ1ByZXByb2Nlc3NvcihiaW5kaW5nS2V5T3JIYW5kbGVyLCBtYWtlRXhwcmVzc2lvbkNhbGxiYWNrUHJlcHJvY2Vzc29yKGFyZ3MpKTtcbn1cblxuLy8gRXhwb3J0IHRoZSBwcmVwcm9jZXNzb3IgZnVuY3Rpb25zXG5rb19wdW5jaGVzLmV4cHJlc3Npb25DYWxsYmFjayA9IHtcbiAgICBtYWtlUHJlcHJvY2Vzc29yOiBtYWtlRXhwcmVzc2lvbkNhbGxiYWNrUHJlcHJvY2Vzc29yLFxuICAgIGV2ZW50UHJlcHJvY2Vzc29yOiBldmVudEV4cHJlc3Npb25QcmVwcm9jZXNzb3IsXG4gICAgZW5hYmxlRm9yQmluZGluZzogZW5hYmxlRXhwcmVzc2lvbkNhbGxiYWNrXG59O1xuXG4vLyBDcmVhdGUgYW4gXCJvblwiIG5hbWVzcGFjZSBmb3IgZXZlbnRzIHRvIHVzZSB0aGUgZXhwcmVzc2lvbiBtZXRob2RcbmtvLmJpbmRpbmdIYW5kbGVycy5vbiA9IHtcbiAgICBnZXROYW1lc3BhY2VkSGFuZGxlcjogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0ga28uZ2V0QmluZGluZ0hhbmRsZXIoJ2V2ZW50JyArIG5hbWVzcGFjZURpdmlkZXIgKyBldmVudE5hbWUpO1xuICAgICAgICByZXR1cm4gYWRkQmluZGluZ1ByZXByb2Nlc3NvcihoYW5kbGVyLCBldmVudEV4cHJlc3Npb25QcmVwcm9jZXNzb3IpO1xuICAgIH1cbn07XG4vLyBQZXJmb3JtYW5jZSBjb21wYXJpc29uIGF0IGh0dHA6Ly9qc3BlcmYuY29tL21hcmt1cC1pbnRlcnBvbGF0aW9uLWNvbXBhcmlzb25cbmZ1bmN0aW9uIHBhcnNlSW50ZXJwb2xhdGlvbk1hcmt1cCh0ZXh0VG9QYXJzZSwgb3V0ZXJUZXh0Q2FsbGJhY2ssIGV4cHJlc3Npb25DYWxsYmFjaykge1xuICAgIGZ1bmN0aW9uIGlubmVyUGFyc2UodGV4dCkge1xuICAgICAgICB2YXIgaW5uZXJNYXRjaCA9IHRleHQubWF0Y2goL14oW1xcc1xcU10qKX19KFtcXHNcXFNdKj8pXFx7XFx7KFtcXHNcXFNdKikkLyk7XG4gICAgICAgIGlmIChpbm5lck1hdGNoKSB7XG4gICAgICAgICAgICBpbm5lclBhcnNlKGlubmVyTWF0Y2hbMV0pO1xuICAgICAgICAgICAgb3V0ZXJUZXh0Q2FsbGJhY2soaW5uZXJNYXRjaFsyXSk7XG4gICAgICAgICAgICBleHByZXNzaW9uQ2FsbGJhY2soaW5uZXJNYXRjaFszXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHByZXNzaW9uQ2FsbGJhY2sodGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIG91dGVyTWF0Y2ggPSB0ZXh0VG9QYXJzZS5tYXRjaCgvXihbXFxzXFxTXSo/KVxce1xceyhbXFxzXFxTXSopfX0oW1xcc1xcU10qKSQvKTtcbiAgICBpZiAob3V0ZXJNYXRjaCkge1xuICAgICAgICBvdXRlclRleHRDYWxsYmFjayhvdXRlck1hdGNoWzFdKTtcbiAgICAgICAgaW5uZXJQYXJzZShvdXRlck1hdGNoWzJdKTtcbiAgICAgICAgb3V0ZXJUZXh0Q2FsbGJhY2sob3V0ZXJNYXRjaFszXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcgPT0gbnVsbCA/ICcnIDpcbiAgICAgICAgc3RyaW5nLnRyaW0gP1xuICAgICAgICAgICAgc3RyaW5nLnRyaW0oKSA6XG4gICAgICAgICAgICBzdHJpbmcudG9TdHJpbmcoKS5yZXBsYWNlKC9eW1xcc1xceGEwXSt8W1xcc1xceGEwXSskL2csICcnKTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb2xhdGlvbk1hcmt1cFByZXByb2Nlc3Nvcihub2RlKSB7XG4gICAgLy8gb25seSBuZWVkcyB0byB3b3JrIHdpdGggdGV4dCBub2Rlc1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzICYmIG5vZGUubm9kZVZhbHVlICYmIG5vZGUubm9kZVZhbHVlLmluZGV4T2YoJ3t7JykgIT09IC0xICYmIChub2RlLnBhcmVudE5vZGUgfHwge30pLm5vZGVOYW1lICE9IFwiVEVYVEFSRUFcIikge1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gYWRkVGV4dE5vZGUodGV4dCkge1xuICAgICAgICAgICAgaWYgKHRleHQpXG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gd3JhcEV4cHIoZXhwcmVzc2lvblRleHQpIHtcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uVGV4dClcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBrb19wdW5jaGVzX2ludGVycG9sYXRpb25NYXJrdXAud3JhcEV4cHJlc3Npb24oZXhwcmVzc2lvblRleHQsIG5vZGUpKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZUludGVycG9sYXRpb25NYXJrdXAobm9kZS5ub2RlVmFsdWUsIGFkZFRleHROb2RlLCB3cmFwRXhwcilcblxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVzW2ldLCBub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MuaHRtbCkge1xuICAgIC8vIFZpcnR1YWwgaHRtbCBiaW5kaW5nXG4gICAgLy8gU08gUXVlc3Rpb246IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE1MzQ4MTM5XG4gICAgdmFyIG92ZXJyaWRkZW4gPSBrby5iaW5kaW5nSGFuZGxlcnMuaHRtbC51cGRhdGU7XG4gICAga28uYmluZGluZ0hhbmRsZXJzLmh0bWwudXBkYXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgICAgICAgIHZhciBodG1sID0ga29fdW53cmFwKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgICAgICBpZiAoaHRtbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE5vZGVzID0ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQoJycgKyBodG1sKTtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIHBhcnNlZE5vZGVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG92ZXJyaWRkZW4oZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MuaHRtbCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHdyYXBFeHByZXNzaW9uKGV4cHJlc3Npb25UZXh0LCBub2RlKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlID8gbm9kZS5vd25lckRvY3VtZW50IDogZG9jdW1lbnQsXG4gICAgICAgIGNsb3NlQ29tbWVudCA9IHRydWUsXG4gICAgICAgIGJpbmRpbmcsXG4gICAgICAgIGV4cHJlc3Npb25UZXh0ID0gdHJpbShleHByZXNzaW9uVGV4dCksXG4gICAgICAgIGZpcnN0Q2hhciA9IGV4cHJlc3Npb25UZXh0WzBdLFxuICAgICAgICBsYXN0Q2hhciA9IGV4cHJlc3Npb25UZXh0W2V4cHJlc3Npb25UZXh0Lmxlbmd0aCAtIDFdLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgbWF0Y2hlcztcblxuICAgIGlmIChmaXJzdENoYXIgPT09ICcjJykge1xuICAgICAgICBpZiAobGFzdENoYXIgPT09ICcvJykge1xuICAgICAgICAgICAgYmluZGluZyA9IGV4cHJlc3Npb25UZXh0LnNsaWNlKDEsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJpbmRpbmcgPSBleHByZXNzaW9uVGV4dC5zbGljZSgxKTtcbiAgICAgICAgICAgIGNsb3NlQ29tbWVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaGVzID0gYmluZGluZy5tYXRjaCgvXihbXixcIid7fSgpXFwvOltcXF1cXHNdKylcXHMrKFteXFxzOl0uKikvKSkge1xuICAgICAgICAgICAgYmluZGluZyA9IG1hdGNoZXNbMV0gKyAnOicgKyBtYXRjaGVzWzJdO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmaXJzdENoYXIgPT09ICcvJykge1xuICAgICAgICAvLyByZXBsYWNlIG9ubHkgd2l0aCBhIGNsb3NpbmcgY29tbWVudFxuICAgIH0gZWxzZSBpZiAoZmlyc3RDaGFyID09PSAneycgJiYgbGFzdENoYXIgPT09ICd9Jykge1xuICAgICAgICBiaW5kaW5nID0gXCJodG1sOlwiICsgdHJpbShleHByZXNzaW9uVGV4dC5zbGljZSgxLCAtMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbmRpbmcgPSBcInRleHQ6XCIgKyB0cmltKGV4cHJlc3Npb25UZXh0KTtcbiAgICB9XG5cbiAgICBpZiAoYmluZGluZylcbiAgICAgICAgcmVzdWx0LnB1c2gob3duZXJEb2N1bWVudC5jcmVhdGVDb21tZW50KFwia28gXCIgKyBiaW5kaW5nKSk7XG4gICAgaWYgKGNsb3NlQ29tbWVudClcbiAgICAgICAgcmVzdWx0LnB1c2gob3duZXJEb2N1bWVudC5jcmVhdGVDb21tZW50KFwiL2tvXCIpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZnVuY3Rpb24gZW5hYmxlSW50ZXJwb2xhdGlvbk1hcmt1cCgpIHtcbiAgICBhZGROb2RlUHJlcHJvY2Vzc29yKGludGVycG9sYXRpb25NYXJrdXBQcmVwcm9jZXNzb3IpO1xufVxuXG4vLyBFeHBvcnQgdGhlIHByZXByb2Nlc3NvciBmdW5jdGlvbnNcbnZhciBrb19wdW5jaGVzX2ludGVycG9sYXRpb25NYXJrdXAgPSBrb19wdW5jaGVzLmludGVycG9sYXRpb25NYXJrdXAgPSB7XG4gICAgcHJlcHJvY2Vzc29yOiBpbnRlcnBvbGF0aW9uTWFya3VwUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZTogZW5hYmxlSW50ZXJwb2xhdGlvbk1hcmt1cCxcbiAgICB3cmFwRXhwcmVzc2lvbjogd3JhcEV4cHJlc3Npb25cbn07XG5cblxudmFyIGRhdGFCaW5kID0gJ2RhdGEtYmluZCc7XG5mdW5jdGlvbiBhdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya2VyUHJlcHJvY2Vzc29yKG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkYXRhQmluZEF0dHJpYnV0ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKGRhdGFCaW5kKTtcbiAgICAgICAgZm9yICh2YXIgYXR0cnMgPSBrby51dGlscy5hcnJheVB1c2hBbGwoW10sIG5vZGUuYXR0cmlidXRlcyksIG4gPSBhdHRycy5sZW5ndGgsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xuICAgICAgICAgICAgaWYgKGF0dHIuc3BlY2lmaWVkICYmIGF0dHIubmFtZSAhPSBkYXRhQmluZCAmJiBhdHRyLnZhbHVlLmluZGV4T2YoJ3t7JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnRzID0gW10sIGF0dHJWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFRleHQodGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goJ1wiJyArIHRleHQucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZEV4cHIoZXhwcmVzc2lvblRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cHJlc3Npb25UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgPSBleHByZXNzaW9uVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goJ2tvLnVud3JhcCgnICsgZXhwcmVzc2lvblRleHQgKyAnKScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcnNlSW50ZXJwb2xhdGlvbk1hcmt1cChhdHRyLnZhbHVlLCBhZGRUZXh0LCBhZGRFeHByKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSA9ICdcIlwiKycgKyBwYXJ0cy5qb2luKCcrJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJCaW5kaW5nID0ga29fcHVuY2hlc19hdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya3VwLmF0dHJpYnV0ZUJpbmRpbmcoYXR0ck5hbWUsIGF0dHJWYWx1ZSwgbm9kZSkgfHwgYXR0cmlidXRlQmluZGluZyhhdHRyTmFtZSwgYXR0clZhbHVlLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhQmluZEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmRBdHRyaWJ1dGUgPSBhdHRyQmluZGluZ1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUJpbmRBdHRyaWJ1dGUgKz0gJywnICsgYXR0ckJpbmRpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoZGF0YUJpbmQsIGRhdGFCaW5kQXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNpbmcgcmVtb3ZlQXR0cmlidXRlIGluc3RlYWQgb2YgcmVtb3ZlQXR0cmlidXRlTm9kZSBiZWNhdXNlIElFIGNsZWFycyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xhc3MgaWYgeW91IHVzZSByZW1vdmVBdHRyaWJ1dGVOb2RlIHRvIHJlbW92ZSB0aGUgaWQuXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhdHRyaWJ1dGVCaW5kaW5nKG5hbWUsIHZhbHVlLCBub2RlKSB7XG4gICAgaWYgKGtvLmdldEJpbmRpbmdIYW5kbGVyKG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBuYW1lICsgJzonICsgdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdhdHRyLicgKyBuYW1lICsgJzonICsgdmFsdWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBlbmFibGVBdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya3VwKCkge1xuICAgIGFkZE5vZGVQcmVwcm9jZXNzb3IoYXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmtlclByZXByb2Nlc3Nvcik7XG59XG5cbnZhciBrb19wdW5jaGVzX2F0dHJpYnV0ZUludGVycG9sYXRpb25NYXJrdXAgPSBrb19wdW5jaGVzLmF0dHJpYnV0ZUludGVycG9sYXRpb25NYXJrdXAgPSB7XG4gICAgcHJlcHJvY2Vzc29yOiBhdHRyaWJ1dGVJbnRlcnBvbGF0aW9uTWFya2VyUHJlcHJvY2Vzc29yLFxuICAgIGVuYWJsZTogZW5hYmxlQXR0cmlidXRlSW50ZXJwb2xhdGlvbk1hcmt1cCxcbiAgICBhdHRyaWJ1dGVCaW5kaW5nOiBhdHRyaWJ1dGVCaW5kaW5nXG59O1xuXG4gICAgcmV0dXJuIGtvX3B1bmNoZXM7XG59KSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=