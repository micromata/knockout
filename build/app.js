/**
 API converts the `opine`-flavoured documentation here.

 Here is a sample:
*/
// /*---
//  purpose: knockout-wide settings
//  */
// var settings = { /*...*/ }

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = (function () {
  function API(spec) {
    _classCallCheck(this, API);

    this.type = spec.type;
    this.name = spec.name;
    this.source = spec.source;
    this.line = spec.line;
    this.purpose = spec.vars.purpose;
    this.spec = spec.vars.params;
    this.url = this.buildUrl(spec.source, spec.line);
  }

  _createClass(API, [{
    key: "buildUrl",
    value: function buildUrl(source, line) {
      return "" + API.urlRoot + source + "#L" + line;
    }
  }]);

  return API;
})();

API.urlRoot = "https://github.com/knockout/knockout/blob/master/";

API.items = ko.observableArray();

API.add = function (token) {
  console.log("T", token);
  API.items.push(new API(token));
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Documentation = function Documentation(template, title, category, subcategory) {
  _classCallCheck(this, Documentation);

  this.template = template;
  this.title = title;
  this.category = category;
  this.subcategory = subcategory;
};

Documentation.categoriesMap = {
  1: "Getting started",
  2: "Observables",
  3: "Bindings and Components",
  4: "Bindings included",
  5: "Further information"
};

Documentation.fromNode = function (i, node) {
  return new Documentation(node.getAttribute("id"), node.getAttribute("data-title"), node.getAttribute("data-cat"), node.getAttribute("data-subcat"));
};

Documentation.initialize = function () {
  Documentation.all = $.makeArray($("[data-kind=documentation]").map(Documentation.fromNode));
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Example = (function () {
  function Example() {
    var state = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Example);

    var debounce = { timeout: 500, method: "notifyWhenChangesStop" };
    this.javascript = ko.observable(state.javascript).extend({ rateLimit: debounce });
    this.html = ko.observable(state.html).extend({ rateLimit: debounce });
    this.css = state.css || "";

    this.finalJavascript = ko.pureComputed(this.computeFinalJs, this);
  }

  _createClass(Example, [{
    key: "computeFinalJs",

    // Add ko.applyBindings as needed; return Error where appropriate.
    value: function computeFinalJs() {
      var js = this.javascript();
      if (!js) {
        return new Error("The script is empty.");
      }
      if (js.indexOf("ko.applyBindings(") === -1) {
        if (js.indexOf(" viewModel =") !== -1) {
          // We guess the viewModel name ...
          return js + "\n\n/* Automatically Added */\n          ko.applyBindings(viewModel);";
        } else {
          return new Error("ko.applyBindings(view) is not called");
        }
      }
      return js;
    }
  }]);

  return Example;
})();

Example.stateMap = new Map();

Example.get = function (name) {
  var state = Example.stateMap.get(name);
  if (!state) {
    state = new Example(name);
    Example.stateMap.set(name, state);
  }
  return state;
};

Example.set = function (name, state) {
  var example = Example.stateMap.get(name);
  if (example) {
    example.javascript(state.javascript);
    example.html(state.html);
    return;
  }
  Example.stateMap.set(name, new Example(state));
};
/*globals Example */
/* eslint no-unused-vars: 0, camelcase:0*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXTERNAL_INCLUDES = ["http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js", "https://cdn.rawgit.com/mbest/knockout.punches/v0.5.1/knockout.punches.js"];

var LiveExampleComponent = (function () {
  function LiveExampleComponent(params) {
    _classCallCheck(this, LiveExampleComponent);

    if (params.id) {
      this.example = Example.get(ko.unwrap(params.id));
    }
    if (params.base64) {
      var opts = this.example = new Example(JSON.parse(atob(params.base64)));
    }
    if (!this.example) {
      throw new Error("Example must be provided by id or base64 parameter");
    }
  }

  _createClass(LiveExampleComponent, [{
    key: "openCommonSettings",
    value: function openCommonSettings() {
      var ex = this.example;
      var dated = new Date().toLocaleString();
      var jsPrefix = "/**\n * Created from an example on the Knockout website\n * on " + new Date().toLocaleString() + "\n **/\n\n /* For convenience and consistency we've enabled the ko\n  * punches library for this example.\n  */\n ko.punches.enableAll()\n\n /** Example is as follows **/\n";
      return {
        html: ex.html(),
        js: jsPrefix + ex.finalJavascript(),
        title: "From Knockout example",
        description: "Created on " + dated
      };
    }
  }, {
    key: "openFiddle",
    value: function openFiddle(self, evt) {
      // See: http://doc.jsfiddle.net/api/post.html
      evt.preventDefault();
      evt.stopPropagation();
      var fields = ko.utils.extend({
        dtd: "HTML 5",
        wrap: "l",
        resources: EXTERNAL_INCLUDES.join(",")
      }, this.openCommonSettings());
      var form = $("<form action=\"http://jsfiddle.net/api/post/library/pure/\"\n      method=\"POST\" target=\"_blank\">\n      </form>");
      $.each(fields, function (k, v) {
        form.append($("<input type='hidden' name='" + k + "'>").val(v));
      });

      form.submit();
    }
  }, {
    key: "openPen",
    value: function openPen(self, evt) {
      // See: http://blog.codepen.io/documentation/api/prefill/
      evt.preventDefault();
      evt.stopPropagation();
      var opts = ko.utils.extend({
        js_external: EXTERNAL_INCLUDES.join(";")
      }, this.openCommonSettings());
      var dataStr = JSON.stringify(opts).replace(/"/g, "&quot;").replace(/'/g, "&apos;");

      $("<form action=\"http://codepen.io/pen/define\" method=\"POST\" target=\"_blank\">\n      <input type='hidden' name='data' value='" + dataStr + "'/>\n    </form>").submit();
    }
  }]);

  return LiveExampleComponent;
})();

ko.components.register("live-example", {
  viewModel: LiveExampleComponent,
  template: { element: "live-example" }
});
/*global Page, Documentation, marked, Search, PluginManager */
/*eslint no-unused-vars: 0*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Page = (function () {
  function Page() {
    _classCallCheck(this, Page);

    // --- Main body template id ---
    this.body = ko.observable();
    this.title = ko.observable();
    this.body.subscribe(this.onBodyChange, this);

    // --- footer links/cdn ---
    this.links = window.links;
    this.cdn = window.cdn;

    // --- plugins ---
    this.plugins = new PluginManager();

    // --- documentation ---
    this.docCatMap = new Map();
    Documentation.all.forEach(function (doc) {
      var cat = Documentation.categoriesMap[doc.category];
      var docList = this.docCatMap.get(cat);
      if (!docList) {
        docList = [];
        this.docCatMap.set(cat, docList);
      }
      docList.push(doc);
    }, this);

    // Sort the documentation items
    function sorter(a, b) {
      return a.title.localeCompare(b.title);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.docCatMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var list = _step.value;
        list.sort(sorter);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    // docCats: A sorted list of the documentation sections
    this.docCats = Object.keys(Documentation.categoriesMap).sort().map(function (v) {
      return Documentation.categoriesMap[v];
    });

    // --- searching ---
    this.search = new Search();

    // --- page loading status ---
    // applicationCache progress
    this.reloadProgress = ko.observable();
    this.cacheIsUpdated = ko.observable(false);

    // page loading error
    this.errorMessage = ko.observable();

    // Preference for non-Single Page App
    var ls = window.localStorage;
    this.noSPA = ko.observable(Boolean(ls && ls.getItem('noSPA')));
    this.noSPA.subscribe(function (v) {
      return ls && ls.setItem('noSPA', v || '');
    });
  }

  _createClass(Page, [{
    key: 'pathToTemplate',
    value: function pathToTemplate(path) {
      return path.split('/').pop().replace('.html', '');
    }
  }, {
    key: 'open',
    value: function open(pinpoint) {
      this.body(this.pathToTemplate(pinpoint));
      $(window).scrollTop(0);
      document.title = 'Knockout.js – ' + $(this).text();
    }
  }, {
    key: 'onBodyChange',
    value: function onBodyChange(templateId) {
      var node = document.getElementById(templateId);
      this.title(node.getAttribute('data-title') || '');
    }
  }, {
    key: 'registerPlugins',
    value: function registerPlugins(plugins) {
      this.plugins.register(plugins);
    }
  }]);

  return Page;
})();
/* eslint no-unused-vars: [2, {"vars": "local"}]*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PluginManager = (function () {
  function PluginManager() {
    _classCallCheck(this, PluginManager);

    this.pluginRepos = ko.observableArray();
    this.sortedPluginRepos = this.pluginRepos.filter(this.filter.bind(this)).sortBy(this.sortBy.bind(this)).map(this.nameToInstance.bind(this));
    this.pluginMap = new Map();
    this.pluginSort = ko.observable();
    this.pluginsLoaded = ko.observable(false).extend({ rateLimit: 15 });
    this.needle = ko.observable().extend({ rateLimit: 200 });
  }

  _createClass(PluginManager, [{
    key: 'register',
    value: function register(plugins) {
      Object.keys(plugins).forEach(function (repo) {
        var about = plugins[repo];
        this.pluginRepos.push(repo);
        this.pluginMap.set(repo, about);
      }, this);
      this.pluginsLoaded(true);
    }
  }, {
    key: 'filter',
    value: function filter(repo) {
      if (!this.pluginsLoaded()) {
        return false;
      }
      var about = this.pluginMap.get(repo);
      var needle = (this.needle() || '').toLowerCase();
      if (!needle) {
        return true;
      }
      if (repo.toLowerCase().indexOf(needle) >= 0) {
        return true;
      }
      if (!about) {
        return false;
      }
      return (about.description || '').toLowerCase().indexOf(needle) >= 0;
    }
  }, {
    key: 'sortBy',
    value: function sortBy(repo, descending) {
      this.pluginsLoaded(); // Create dependency.
      var about = this.pluginMap.get(repo);
      if (about) {
        return descending(about.stargazers_count);
      } else {
        return descending(-1);
      }
    }
  }, {
    key: 'nameToInstance',
    value: function nameToInstance(name) {
      return this.pluginMap.get(name);
    }
  }]);

  return PluginManager;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchResult = function SearchResult(template) {
  _classCallCheck(this, SearchResult);

  this.template = template;
  this.link = "#" + template.id;
  this.title = template.getAttribute("data-title") || "“" + template.id + "”";
};

var Search = (function () {
  function Search() {
    _classCallCheck(this, Search);

    var searchRate = {
      timeout: 500,
      method: "notifyWhenChangesStop"
    };
    this.query = ko.observable().extend({ rateLimit: searchRate });
    this.results = ko.computed(this.computeResults, this);
  }

  _createClass(Search, [{
    key: "computeResults",
    value: function computeResults() {
      var q = this.query();
      if (!q) {
        return null;
      }
      return $("template").filter(function () {
        return $(this.content).text().indexOf(q) !== -1;
      }).map(function (i, template) {
        return new SearchResult(template);
      });
    }
  }]);

  return Search;
})();
'use strict';

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
};

function setupEditor(element, language, exampleName) {
  var example = ko.unwrap(exampleName);
  var editor = ace.edit(element);
  var session = editor.getSession();
  editor.setTheme('ace/theme/' + languageThemeMap[language]);
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 30,
    wrap: true
  });
  session.setMode('ace/mode/' + language);
  editor.on('change', function () {
    example[language](editor.getValue());
  });
  example[language].subscribe(function (v) {
    if (editor.getValue() !== v) {
      editor.setValue(v);
    }
  });
  editor.setValue(example[language]());
  editor.clearSelection();
  ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
    return editor.destroy();
  });
  return editor;
}

//expected-doctype-but-got-end-tag
//expected-doctype-but-got-start-tag
//expected-doctype-but-got-chars

ko.bindingHandlers['edit-js'] = {
  /* highlight: "langauge" */
  init: function init(element, va) {
    setupEditor(element, 'javascript', va());
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    setupEditor(element, 'html', va());
  }
};
// debugger
// editor.session.setOptions({
// // $worker.call('changeOptions', [{
//   'expected-doctype-but-got-chars': false,
//   'expected-doctype-but-got-end-tag': false,
//   'expected-doctype-but-got-start-tag': false
// })
"use strict";

var readonlyThemeMap = {
  html: "solarized_light",
  javascript: "tomorrow"
};

var emap = {
  "&amp;": "&",
  "&lt;": "<"
};

function unescape(str) {
  return str.replace(/&amp;|&lt;/g, function (ent) {
    return emap[ent];
  });
}

ko.bindingHandlers.highlight = {
  init: function init(element, va) {
    var $e = $(element);
    var language = va();
    if (language !== "html" && language !== "javascript") {
      console.error("A language should be specified.", element);
      return;
    }
    var content = unescape($e.text());
    $e.empty();
    var editor = ace.edit(element);
    var session = editor.getSession();
    editor.setTheme("ace/theme/" + readonlyThemeMap[language]);
    editor.setOptions({
      highlightActiveLine: false,
      useSoftTabs: true,
      tabSize: 2,
      minLines: 1,
      wrap: true,
      maxLines: 35,
      readOnly: true
    });
    session.setMode("ace/mode/" + language);
    editor.setValue(content);
    editor.clearSelection();
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  }
};
/* eslint no-new-func: 0 */

// Save a copy for restoration/use
"use strict";

ko.originalApplyBindings = ko.applyBindings;

ko.bindingHandlers.result = {
  init: function init(element, va) {
    var $e = $(element);
    var example = ko.unwrap(va());

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element.children[0]);
      }
      $e.empty().append("<div class='example " + example.css + "'>");
    }
    resetElement();

    function onError(msg) {
      $(element).html("<div class='error'>Error: " + msg + "</div>");
    }

    function refresh() {
      var script = example.finalJavascript();
      var html = example.html();

      if (script instanceof Error) {
        onError(script);
        return;
      }

      if (!html) {
        onError("There's no HTML to bind to.");
        return;
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e) {
        // We ignore the `node` argument in favour of the examples' node.
        ko.originalApplyBindings(e, element.children[0]);
      };

      try {
        resetElement();
        $(element.children[0]).html(html);
        var fn = new Function("node", script);
        ko.ignoreDependencies(fn, null, [element.children[0]]);
      } catch (e) {
        onError(e);
      }
    }

    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: refresh
    });

    return { controlsDescendantBindings: true };
  }
};
/* global setupEvents, Example, Documentation, API */
'use strict';

var appCacheUpdateCheckInterval = location.hostname === 'localhost' ? 2500 : 1000 * 60 * 15;

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== 'string') {
      console.error('Unable to get ' + uri + ':', html);
    } else {
      // ES5-<template> shim/polyfill:
      // unless 'content' of document.createElement('template')
      //   # see pv_shim_template_tag re. broken-template tags
      //   html = html.replace(/<\/template>/g, '</script>')
      //     .replace(/<template/g, '<script type="text/x-template"')
      $('<div id=\'templates--' + uri + '\'>').append(html).appendTo(document.body);
    }
  });
}

function loadTemplates() {
  return loadHtml('build/templates.html');
}

function loadMarkdown() {
  return loadHtml('build/markdown.html');
}

function reCheckApplicationCache() {
  var ac = applicationCache;
  if (ac.status === ac.IDLE) {
    ac.update();
  }
  setTimeout(reCheckApplicationCache, appCacheUpdateCheckInterval);
}

function checkForApplicationUpdate() {
  var ac = applicationCache;
  if (!ac) {
    return Promise.resolve();
  }
  ac.addEventListener('progress', function (evt) {
    if (evt.lengthComputable) {
      window.$root.reloadProgress(evt.loaded / evt.total);
    } else {
      window.$root.reloadProgress(false);
    }
  }, false);
  ac.addEventListener('updateready', function () {
    window.$root.cacheIsUpdated(true);
  });
  if (ac.status === ac.UPDATEREADY) {
    window.$root.cacheIsUpdated(true);
  }
  reCheckApplicationCache();
  return Promise.resolve();
}

function getExamples() {
  return Promise.resolve($.ajax({
    url: 'build/examples.json',
    dataType: 'json'
  })).then(function (results) {
    return Object.keys(results).forEach(function (name) {
      var setting = results[name];
      Example.set(setting.id || name, setting);
    });
  });
}

function loadAPI() {
  return Promise.resolve($.ajax({
    url: 'build/api.json',
    dataType: 'json'
  })).then(function (results) {
    return results.api.forEach(function (apiFileList) {
      // We essentially have to flatten the api (FIXME)
      apiFileList.forEach(API.add);
    });
  });
}

function getPlugins() {
  return Promise.resolve($.ajax({
    url: 'build/plugins.json',
    dataType: 'json'
  })).then(function (results) {
    return $root.registerPlugins(results);
  });
}

function applyBindings() {
  ko.punches.enableAll();
  window.$root = new Page();
  ko.punches.enableAll();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  if (location.pathname.indexOf('.html') === -1) {
    window.$root.open('intro');
  }
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(Documentation.initialize).then(applyBindings).then(getExamples).then(loadAPI).then(getPlugins).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)['catch'](function (err) {
    window.$root.body('error');
    window.$root.errorMessage(err.message || err);
    console.error(err);
  });
}

$(start);
/*global setupEvents*/
/* eslint no-unused-vars: 0 */

'use strict';

function isLocal(anchor) {
  return location.protocol === anchor.protocol && location.host === anchor.host;
}

// Make sure in non-single-page-app mode that we link to the right relative
// link.
var anchorRoot = location.pathname.replace(/\/a\/.*\.html/, '');
function rewriteAnchorRoot(evt) {
  var anchor = evt.currentTarget;
  var href = anchor.getAttribute('href');
  // Skip non-local urls.
  if (!isLocal(anchor)) {
    return true;
  }
  // Already re-rooted
  if (anchor.pathname.indexOf(anchorRoot) === 0) {
    return true;
  }
  anchor.pathname = ('' + anchorRoot + anchor.pathname).replace('//', '/');
  return true;
}

//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  var anchor = this;
  rewriteAnchorRoot(evt);
  if ($root.noSPA()) {
    return true;
  }
  // Do not intercept clicks on things outside this page
  if (!isLocal(anchor)) {
    return true;
  }

  // Do not intercept clicks on an element in an example.
  if ($(anchor).parents('live-example').length !== 0) {
    return true;
  }

  try {
    var templateId = $root.pathToTemplate(anchor.pathname);
    // If the template isn't found, presume a hard link
    if (!document.getElementById(templateId)) {
      return true;
    }
    history.pushState(null, null, anchor.href);
    $root.open(templateId);
  } catch (e) {
    console.log('Error/' + anchor.getAttribute('href'), e);
  }
  return false;
}

function onPopState() {
  // Note https://github.com/devote/HTML5-History-API
  if ($root.noSPA()) {
    return;
  }
  $root.open(location.pathname);
}

function setupEvents() {
  if (window.history.pushState) {
    $(document.body).on('click', 'a', onAnchorClick);
    $(window).on('popstate', onPopState);
  } else {
    $(document.body).on('click', rewriteAnchorRoot);
  }
}
/* evt */
"use strict";

window.links = [{ href: "https://github.com/knockout/knockout",
  title: "Github — Repository",
  icon: "fa-github" }, { href: "https://github.com/knockout/knockout/issues/",
  title: "Github — Issues",
  icon: "fa-exclamation-circle" }, { href: "https://github.com/knockout/knockout/releases",
  title: "Releases",
  icon: "fa-certificate" }, { href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: "https://gitter.im/knockout/knockout",
  title: "Gitter",
  icon: "fa-comments-o" }, { href: "legacy/",
  title: "Legacy website",
  icon: "fa fa-history" }];

window.cdn = [{ name: "Microsoft CDN",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare CDN",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"
}];
/* eslint no-underscore-dangle: 0, semi: 0 */
//
// Track:js setup
//
// This file is in the src/ directory, meaning it is included in app.js.
// However it is also explicitly included in libs.js so that error
// tracking gets started ASAP.
//
// The small duplication is a trade-off for the headache of putting a .js
// file outside the src/ directory.
'use strict';

window._trackJs = window._trackJs || {
  enabled: true,
  bindStack: true, //  watch for perf. penalty.
  token: 'bc952e7044e34a2e8423f777b8c824be'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWVkaXQuanMiLCJiaW5kaW5ncy1oaWdobGlnaHQuanMiLCJiaW5kaW5ncy1yZXN1bHQuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIiwidHJhY2tlci1zZXR1cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBVU0sR0FBRztBQUNJLFdBRFAsR0FBRyxDQUNLLElBQUksRUFBRTswQkFEZCxHQUFHOztBQUVMLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDNUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pEOztlQVRHLEdBQUc7O1dBV0Msa0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNyQixrQkFBVSxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sVUFBSyxJQUFJLENBQUU7S0FDMUM7OztTQWJHLEdBQUc7OztBQWdCVCxHQUFHLENBQUMsT0FBTyxHQUFHLG1EQUFtRCxDQUFBOztBQUdqRSxHQUFH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QUFFLGdCQUFnQixFQUFDLEVBQ3pCLEVBQUUsSUFBSSxFQUFFLG9EQUFvRDtBQUMxRCxPQUFLLEVBQUUsZUFBZTtBQUN0QixNQUFJLEVBQUUsV0FBVyxFQUFDLEVBQ3BCLEVBQUUsSUFBSSxFQUFFLGdEQUFnRDtBQUN0RCxPQUFLLEVBQUUsZUFBZTtBQUN0QixNQUFJLEVBQUUsbUJBQW1CLEVBQUMsRUFDNUIsRUFBRSxJQUFJLEVBQUUscUNBQXFDO0FBQzNDLE9BQUssRUFBRSxRQUFRO0FBQ2YsTUFBSSxFQUFFLGVBQWUsRUFBQyxFQUN4QixFQUFFLElBQUksRUFBRSxTQUFTO0FBQ2YsT0FBSyxFQUFFLGdCQUFnQjtBQUN2QixNQUFJLEVBQUUsZUFBZSxFQUFDLENBQ3pCLENBQUE7O0FBR0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUNYLEVBQUUsSUFBSSxFQUFFLGVBQWU7QUFDckIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLDJEQUEyRDtBQUNoRSxPQUFLLEVBQUUsaUVBQWlFO0NBQ3pFLEVBQ0QsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSx5RUFBeUU7QUFDOUUsT0FBSyxFQUFFLHVFQUF1RTtDQUMvRSxDQUNGLENBQUE7Ozs7Ozs7Ozs7Ozs7QUMzQkQsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJO0FBQ25DLFNBQU8sRUFBRSxJQUFJO0FBQ2IsV0FBUyxFQUFFLElBQUk7QUFDZixPQUFLLEVBQUUsa0NBQWtDO0NBQzFDLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gQVBJIGNvbnZlcnRzIHRoZSBgb3BpbmVgLWZsYXZvdXJlZCBkb2N1bWVudGF0aW9uIGhlcmUuXG5cbiBIZXJlIGlzIGEgc2FtcGxlOlxuKi9cbi8vIC8qLS0tXG4vLyAgcHVycG9zZToga25vY2tvdXQtd2lkZSBzZXR0aW5nc1xuLy8gICovXG4vLyB2YXIgc2V0dGluZ3MgPSB7IC8qLi4uKi8gfVxuXG5jbGFzcyBBUEkge1xuICBjb25zdHJ1Y3RvcihzcGVjKSB7XG4gICAgdGhpcy50eXBlID0gc3BlYy50eXBlXG4gICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lXG4gICAgdGhpcy5zb3VyY2UgPSBzcGVjLnNvdXJjZVxuICAgIHRoaXMubGluZSA9IHNwZWMubGluZVxuICAgIHRoaXMucHVycG9zZSA9IHNwZWMudmFycy5wdXJwb3NlXG4gICAgdGhpcy5zcGVjID0gc3BlYy52YXJzLnBhcmFtc1xuICAgIHRoaXMudXJsID0gdGhpcy5idWlsZFVybChzcGVjLnNvdXJjZSwgc3BlYy5saW5lKVxuICB9XG5cbiAgYnVpbGRVcmwoc291cmNlLCBsaW5lKSB7XG4gICAgcmV0dXJuIGAke0FQSS51cmxSb290fSR7c291cmNlfSNMJHtsaW5lfWBcbiAgfVxufVxuXG5BUEkudXJsUm9vdCA9IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2Jsb2IvbWFzdGVyL1wiXG5cblxuQVBJLml0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcblxuQVBJLmFkZCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBjb25zb2xlLmxvZyhcIlRcIiwgdG9rZW4pXG4gIEFQSS5pdGVtcy5wdXNoKG5ldyBBUEkodG9rZW4pKVxufVxuIiwiXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIHRpdGxlLCBjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICB0aGlzLnN1YmNhdGVnb3J5ID0gc3ViY2F0ZWdvcnlcbiAgfVxufVxuXG5Eb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXAgPSB7XG4gIDE6IFwiR2V0dGluZyBzdGFydGVkXCIsXG4gIDI6IFwiT2JzZXJ2YWJsZXNcIixcbiAgMzogXCJCaW5kaW5ncyBhbmQgQ29tcG9uZW50c1wiLFxuICA0OiBcIkJpbmRpbmdzIGluY2x1ZGVkXCIsXG4gIDU6IFwiRnVydGhlciBpbmZvcm1hdGlvblwiXG59XG5cbkRvY3VtZW50YXRpb24uZnJvbU5vZGUgPSBmdW5jdGlvbiAoaSwgbm9kZSkge1xuICByZXR1cm4gbmV3IERvY3VtZW50YXRpb24oXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJjYXQnKVxuICApXG59XG5cbkRvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgRG9jdW1lbnRhdGlvbi5hbGwgPSAkLm1ha2VBcnJheShcbiAgICAkKFwiW2RhdGEta2luZD1kb2N1bWVudGF0aW9uXVwiKS5tYXAoRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSlcbiAgKVxufVxuIiwiXG5cbmNsYXNzIEV4YW1wbGUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSA9IHt9KSB7XG4gICAgdmFyIGRlYm91bmNlID0geyB0aW1lb3V0OiA1MDAsIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIiB9XG4gICAgdGhpcy5qYXZhc2NyaXB0ID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5qYXZhc2NyaXB0KVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5odG1sID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5odG1sKVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5jc3MgPSBzdGF0ZS5jc3MgfHwgJydcblxuICAgIHRoaXMuZmluYWxKYXZhc2NyaXB0ID0ga28ucHVyZUNvbXB1dGVkKHRoaXMuY29tcHV0ZUZpbmFsSnMsIHRoaXMpXG4gIH1cblxuICAvLyBBZGQga28uYXBwbHlCaW5kaW5ncyBhcyBuZWVkZWQ7IHJldHVybiBFcnJvciB3aGVyZSBhcHByb3ByaWF0ZS5cbiAgY29tcHV0ZUZpbmFsSnMoKSB7XG4gICAgdmFyIGpzID0gdGhpcy5qYXZhc2NyaXB0KClcbiAgICBpZiAoIWpzKSB7IHJldHVybiBuZXcgRXJyb3IoXCJUaGUgc2NyaXB0IGlzIGVtcHR5LlwiKSB9XG4gICAgaWYgKGpzLmluZGV4T2YoJ2tvLmFwcGx5QmluZGluZ3MoJykgPT09IC0xKSB7XG4gICAgICBpZiAoanMuaW5kZXhPZignIHZpZXdNb2RlbCA9JykgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGd1ZXNzIHRoZSB2aWV3TW9kZWwgbmFtZSAuLi5cbiAgICAgICAgcmV0dXJuIGAke2pzfVxcblxcbi8qIEF1dG9tYXRpY2FsbHkgQWRkZWQgKi9cbiAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHZpZXdNb2RlbCk7YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3ModmlldykgaXMgbm90IGNhbGxlZFwiKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNcbiAgfVxufVxuXG5FeGFtcGxlLnN0YXRlTWFwID0gbmV3IE1hcCgpXG5cbkV4YW1wbGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHN0YXRlID0gbmV3IEV4YW1wbGUobmFtZSlcbiAgICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBzdGF0ZSlcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuXG5FeGFtcGxlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCBzdGF0ZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmIChleGFtcGxlKSB7XG4gICAgZXhhbXBsZS5qYXZhc2NyaXB0KHN0YXRlLmphdmFzY3JpcHQpXG4gICAgZXhhbXBsZS5odG1sKHN0YXRlLmh0bWwpXG4gICAgcmV0dXJuXG4gIH1cbiAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgbmV3IEV4YW1wbGUoc3RhdGUpKVxufVxuIiwiLypnbG9iYWxzIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCwgY2FtZWxjYXNlOjAqL1xuXG52YXIgRVhURVJOQUxfSU5DTFVERVMgPSBbXG4gIFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCIsXG4gIFwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9tYmVzdC9rbm9ja291dC5wdW5jaGVzL3YwLjUuMS9rbm9ja291dC5wdW5jaGVzLmpzXCJcbl1cblxuY2xhc3MgTGl2ZUV4YW1wbGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLmlkKSB7XG4gICAgICB0aGlzLmV4YW1wbGUgPSBFeGFtcGxlLmdldChrby51bndyYXAocGFyYW1zLmlkKSlcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5iYXNlNjQpIHtcbiAgICAgIHZhciBvcHRzID1cbiAgICAgIHRoaXMuZXhhbXBsZSA9IG5ldyBFeGFtcGxlKEpTT04ucGFyc2UoYXRvYihwYXJhbXMuYmFzZTY0KSkpXG4gICAgfVxuICAgIGlmICghdGhpcy5leGFtcGxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeGFtcGxlIG11c3QgYmUgcHJvdmlkZWQgYnkgaWQgb3IgYmFzZTY0IHBhcmFtZXRlclwiKVxuICAgIH1cbiAgfVxuXG4gIG9wZW5Db21tb25TZXR0aW5ncygpIHtcbiAgICB2YXIgZXggPSB0aGlzLmV4YW1wbGVcbiAgICB2YXIgZGF0ZWQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICB2YXIganNQcmVmaXggPSBgLyoqXG4gKiBDcmVhdGVkIGZyb20gYW4gZXhhbXBsZSBvbiB0aGUgS25vY2tvdXQgd2Vic2l0ZVxuICogb24gJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9XG4gKiovXG5cbiAvKiBGb3IgY29udmVuaWVuY2UgYW5kIGNvbnNpc3RlbmN5IHdlJ3ZlIGVuYWJsZWQgdGhlIGtvXG4gICogcHVuY2hlcyBsaWJyYXJ5IGZvciB0aGlzIGV4YW1wbGUuXG4gICovXG4ga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuXG4gLyoqIEV4YW1wbGUgaXMgYXMgZm9sbG93cyAqKi9cbmBcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogZXguaHRtbCgpLFxuICAgICAganM6IGpzUHJlZml4ICsgZXguZmluYWxKYXZhc2NyaXB0KCksXG4gICAgICB0aXRsZTogYEZyb20gS25vY2tvdXQgZXhhbXBsZWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkLCBTZWFyY2gsIFBsdWdpbk1hbmFnZXIgKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gLS0tIE1haW4gYm9keSB0ZW1wbGF0ZSBpZCAtLS1cbiAgICB0aGlzLmJvZHkgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5ib2R5LnN1YnNjcmliZSh0aGlzLm9uQm9keUNoYW5nZSwgdGhpcylcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBwbHVnaW5zIC0tLVxuICAgIHRoaXMucGx1Z2lucyA9IG5ldyBQbHVnaW5NYW5hZ2VyKClcblxuICAgIC8vIC0tLSBkb2N1bWVudGF0aW9uIC0tLVxuICAgIHRoaXMuZG9jQ2F0TWFwID0gbmV3IE1hcCgpXG4gICAgRG9jdW1lbnRhdGlvbi5hbGwuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG4gICAgICB2YXIgY2F0ID0gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW2RvYy5jYXRlZ29yeV1cbiAgICAgIHZhciBkb2NMaXN0ID0gdGhpcy5kb2NDYXRNYXAuZ2V0KGNhdClcbiAgICAgIGlmICghZG9jTGlzdCkge1xuICAgICAgICBkb2NMaXN0ID0gW11cbiAgICAgICAgdGhpcy5kb2NDYXRNYXAuc2V0KGNhdCwgZG9jTGlzdClcbiAgICAgIH1cbiAgICAgIGRvY0xpc3QucHVzaChkb2MpXG4gICAgfSwgdGhpcylcblxuICAgIC8vIFNvcnQgdGhlIGRvY3VtZW50YXRpb24gaXRlbXNcbiAgICBmdW5jdGlvbiBzb3J0ZXIoYSwgYikge1xuICAgICAgcmV0dXJuIGEudGl0bGUubG9jYWxlQ29tcGFyZShiLnRpdGxlKVxuICAgIH1cbiAgICBmb3IgKHZhciBsaXN0IG9mIHRoaXMuZG9jQ2F0TWFwLnZhbHVlcygpKSB7IGxpc3Quc29ydChzb3J0ZXIpIH1cblxuICAgIC8vIGRvY0NhdHM6IEEgc29ydGVkIGxpc3Qgb2YgdGhlIGRvY3VtZW50YXRpb24gc2VjdGlvbnNcbiAgICB0aGlzLmRvY0NhdHMgPSBPYmplY3Qua2V5cyhEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXApXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbdl0gfSlcblxuICAgIC8vIC0tLSBzZWFyY2hpbmcgLS0tXG4gICAgdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoKClcblxuICAgIC8vIC0tLSBwYWdlIGxvYWRpbmcgc3RhdHVzIC0tLVxuICAgIC8vIGFwcGxpY2F0aW9uQ2FjaGUgcHJvZ3Jlc3NcbiAgICB0aGlzLnJlbG9hZFByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5jYWNoZUlzVXBkYXRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpXG5cbiAgICAvLyBwYWdlIGxvYWRpbmcgZXJyb3JcbiAgICB0aGlzLmVycm9yTWVzc2FnZSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgLy8gUHJlZmVyZW5jZSBmb3Igbm9uLVNpbmdsZSBQYWdlIEFwcFxuICAgIHZhciBscyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB0aGlzLm5vU1BBID0ga28ub2JzZXJ2YWJsZShCb29sZWFuKGxzICYmIGxzLmdldEl0ZW0oJ25vU1BBJykpKVxuICAgIHRoaXMubm9TUEEuc3Vic2NyaWJlKCh2KSA9PiBscyAmJiBscy5zZXRJdGVtKCdub1NQQScsIHYgfHwgXCJcIikpXG4gIH1cblxuICBwYXRoVG9UZW1wbGF0ZShwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5wb3AoKS5yZXBsYWNlKCcuaHRtbCcsICcnKVxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIHRoaXMuYm9keSh0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICB9XG5cbiAgb25Cb2R5Q2hhbmdlKHRlbXBsYXRlSWQpIHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgdGhpcy50aXRsZShub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8ICcnKVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICB0aGlzLnBsdWdpbnMucmVnaXN0ZXIocGx1Z2lucylcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBbMiwge1widmFyc1wiOiBcImxvY2FsXCJ9XSovXG5cbmNsYXNzIFBsdWdpbk1hbmFnZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wbHVnaW5SZXBvcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG4gICAgdGhpcy5zb3J0ZWRQbHVnaW5SZXBvcyA9IHRoaXMucGx1Z2luUmVwb3NcbiAgICAgIC5maWx0ZXIodGhpcy5maWx0ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5zb3J0QnkodGhpcy5zb3J0QnkuYmluZCh0aGlzKSlcbiAgICAgIC5tYXAodGhpcy5uYW1lVG9JbnN0YW5jZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLm5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcbiAgfVxuXG4gIHJlZ2lzdGVyKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgZmlsdGVyKHJlcG8pIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luc0xvYWRlZCgpKSB7IHJldHVybiBmYWxzZSB9XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLm5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBzb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG5cbiAgbmFtZVRvSW5zdGFuY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hcC5nZXQobmFtZSlcbiAgfVxufVxuIiwiXG5jbGFzcyBTZWFyY2hSZXN1bHQge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMubGluayA9IGAjJHt0ZW1wbGF0ZS5pZH1gXG4gICAgdGhpcy50aXRsZSA9IHRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGDigJwke3RlbXBsYXRlLmlkfeKAnWBcbiAgfVxufVxuXG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHZhciBzZWFyY2hSYXRlID0ge1xuICAgICAgdGltZW91dDogNTAwLFxuICAgICAgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiXG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IHNlYXJjaFJhdGV9KVxuICAgIHRoaXMucmVzdWx0cyA9IGtvLmNvbXB1dGVkKHRoaXMuY29tcHV0ZVJlc3VsdHMsIHRoaXMpXG4gIH1cblxuICBjb21wdXRlUmVzdWx0cygpIHtcbiAgICB2YXIgcSA9IHRoaXMucXVlcnkoKVxuICAgIGlmICghcSkgeyByZXR1cm4gbnVsbCB9XG4gICAgcmV0dXJuICQoYHRlbXBsYXRlYClcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzLmNvbnRlbnQpLnRleHQoKS5pbmRleE9mKHEpICE9PSAtMVxuICAgICAgfSlcbiAgICAgIC5tYXAoKGksIHRlbXBsYXRlKSA9PiBuZXcgU2VhcmNoUmVzdWx0KHRlbXBsYXRlKSlcbiAgfVxufVxuIiwiXG52YXIgbGFuZ3VhZ2VUaGVtZU1hcCA9IHtcbiAgaHRtbDogJ3NvbGFyaXplZF9kYXJrJyxcbiAgamF2YXNjcmlwdDogJ21vbm9rYWknXG59XG5cbmZ1bmN0aW9uIHNldHVwRWRpdG9yKGVsZW1lbnQsIGxhbmd1YWdlLCBleGFtcGxlTmFtZSkge1xuICB2YXIgZXhhbXBsZSA9IGtvLnVud3JhcChleGFtcGxlTmFtZSlcbiAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke2xhbmd1YWdlVGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiB0cnVlLFxuICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZXM6IDMsXG4gICAgbWF4TGluZXM6IDMwLFxuICAgIHdyYXA6IHRydWVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBleGFtcGxlW2xhbmd1YWdlXShlZGl0b3IuZ2V0VmFsdWUoKSkgfSlcbiAgZXhhbXBsZVtsYW5ndWFnZV0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGVkaXRvci5nZXRWYWx1ZSgpICE9PSB2KSB7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodilcbiAgICB9XG4gIH0pXG4gIGVkaXRvci5zZXRWYWx1ZShleGFtcGxlW2xhbmd1YWdlXSgpKVxuICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIHJldHVybiBlZGl0b3Jcbn1cblxuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFyc1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtanMnXSA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSlcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG4iLCJcblxudmFyIHJlYWRvbmx5VGhlbWVNYXAgPSB7XG4gIGh0bWw6IFwic29sYXJpemVkX2xpZ2h0XCIsXG4gIGphdmFzY3JpcHQ6IFwidG9tb3Jyb3dcIlxufVxuXG52YXIgZW1hcCA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8J1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFxuICAgIC8mYW1wO3wmbHQ7L2csXG4gICAgZnVuY3Rpb24gKGVudCkgeyByZXR1cm4gZW1hcFtlbnRdfVxuICApXG59XG5cbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDEsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDM1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tbmV3LWZ1bmM6IDAgKi9cblxuLy8gU2F2ZSBhIGNvcHkgZm9yIHJlc3RvcmF0aW9uL3VzZVxua28ub3JpZ2luYWxBcHBseUJpbmRpbmdzID0ga28uYXBwbHlCaW5kaW5nc1xuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgZXhhbXBsZSA9IGtvLnVud3JhcCh2YSgpKVxuXG4gICAgZnVuY3Rpb24gcmVzZXRFbGVtZW50KCkge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5bMF0pIHtcbiAgICAgICAga28uY2xlYW5Ob2RlKGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG4gICAgICAkZS5lbXB0eSgpLmFwcGVuZChgPGRpdiBjbGFzcz0nZXhhbXBsZSAke2V4YW1wbGUuY3NzfSc+YClcbiAgICB9XG4gICAgcmVzZXRFbGVtZW50KClcblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IobXNnKSB7XG4gICAgICAkKGVsZW1lbnQpXG4gICAgICAgIC5odG1sKGA8ZGl2IGNsYXNzPSdlcnJvcic+RXJyb3I6ICR7bXNnfTwvZGl2PmApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmZpbmFsSmF2YXNjcmlwdCgpXG4gICAgICB2YXIgaHRtbCA9IGV4YW1wbGUuaHRtbCgpXG5cbiAgICAgIGlmIChzY3JpcHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvbkVycm9yKHNjcmlwdClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3R1YiBrby5hcHBseUJpbmRpbmdzXG4gICAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIHRoZSBgbm9kZWAgYXJndW1lbnQgaW4gZmF2b3VyIG9mIHRoZSBleGFtcGxlcycgbm9kZS5cbiAgICAgICAga28ub3JpZ2luYWxBcHBseUJpbmRpbmdzKGUsIGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc2V0RWxlbWVudCgpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSkuaHRtbChodG1sKVxuICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ25vZGUnLCBzY3JpcHQpXG4gICAgICAgIGtvLmlnbm9yZURlcGVuZGVuY2llcyhmbiwgbnVsbCwgW2VsZW1lbnQuY2hpbGRyZW5bMF1dKVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBrby5jb21wdXRlZCh7XG4gICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQsXG4gICAgICByZWFkOiByZWZyZXNoXG4gICAgfSlcblxuICAgIHJldHVybiB7Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWV9XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBzZXR1cEV2ZW50cywgRXhhbXBsZSwgRG9jdW1lbnRhdGlvbiwgQVBJICovXG52YXIgYXBwQ2FjaGVVcGRhdGVDaGVja0ludGVydmFsID0gbG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnID8gMjUwMCA6ICgxMDAwICogNjAgKiAxNSlcblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRVM1LTx0ZW1wbGF0ZT4gc2hpbS9wb2x5ZmlsbDpcbiAgICAgICAgLy8gdW5sZXNzICdjb250ZW50JyBvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG4gICAgICAgIC8vICAgIyBzZWUgcHZfc2hpbV90ZW1wbGF0ZV90YWcgcmUuIGJyb2tlbi10ZW1wbGF0ZSB0YWdzXG4gICAgICAgIC8vICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvPFxcL3RlbXBsYXRlPi9nLCAnPC9zY3JpcHQ+JylcbiAgICAgICAgLy8gICAgIC5yZXBsYWNlKC88dGVtcGxhdGUvZywgJzxzY3JpcHQgdHlwZT1cInRleHQveC10ZW1wbGF0ZVwiJylcbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gYXBwbGljYXRpb25DYWNoZVxuICBpZiAoYWMuc3RhdHVzID09PSBhYy5JRExFKSB7IGFjLnVwZGF0ZSgpIH1cbiAgc2V0VGltZW91dChyZUNoZWNrQXBwbGljYXRpb25DYWNoZSwgYXBwQ2FjaGVVcGRhdGVDaGVja0ludGVydmFsKVxufVxuXG5mdW5jdGlvbiBjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKCkge1xuICB2YXIgYWMgPSBhcHBsaWNhdGlvbkNhY2hlXG4gIGlmICghYWMpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpIH1cbiAgYWMuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhldnQubG9hZGVkIC8gZXZ0LnRvdGFsKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuJHJvb3QucmVsb2FkUHJvZ3Jlc3MoZmFsc2UpXG4gICAgfVxuICB9LCBmYWxzZSlcbiAgYWMuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlcmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LiRyb290LmNhY2hlSXNVcGRhdGVkKHRydWUpXG4gIH0pXG4gIGlmIChhYy5zdGF0dXMgPT09IGFjLlVQREFURVJFQURZKSB7XG4gICAgd2luZG93LiRyb290LmNhY2hlSXNVcGRhdGVkKHRydWUpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy5odG1sJykgPT09IC0xKSB7XG4gICAgd2luZG93LiRyb290Lm9wZW4oXCJpbnRyb1wiKVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIFByb21pc2UuYWxsKFtsb2FkVGVtcGxhdGVzKCksIGxvYWRNYXJrZG93bigpXSlcbiAgICAudGhlbihEb2N1bWVudGF0aW9uLmluaXRpYWxpemUpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB3aW5kb3cuJHJvb3QuYm9keShcImVycm9yXCIpXG4gICAgICB3aW5kb3cuJHJvb3QuZXJyb3JNZXNzYWdlKGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH0pXG59XG5cbiQoc3RhcnQpXG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5wYXRobmFtZSA9IGAke2FuY2hvclJvb3R9JHthbmNob3IucGF0aG5hbWV9YC5yZXBsYWNlKCcvLycsICcvJylcbiAgcmV0dXJuIHRydWVcbn1cblxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIHZhciBhbmNob3IgPSB0aGlzXG4gIHJld3JpdGVBbmNob3JSb290KGV2dClcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiB0aGluZ3Mgb3V0c2lkZSB0aGlzIHBhZ2VcbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIGFuIGVsZW1lbnQgaW4gYW4gZXhhbXBsZS5cbiAgaWYgKCQoYW5jaG9yKS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gJHJvb3QucGF0aFRvVGVtcGxhdGUoYW5jaG9yLnBhdGhuYW1lKVxuICAgIC8vIElmIHRoZSB0ZW1wbGF0ZSBpc24ndCBmb3VuZCwgcHJlc3VtZSBhIGhhcmQgbGlua1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkpIHsgcmV0dXJuIHRydWUgfVxuICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5ocmVmKVxuICAgICRyb290Lm9wZW4odGVtcGxhdGVJZClcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7YW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpfWAsIGUpXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblxuZnVuY3Rpb24gb25Qb3BTdGF0ZSgvKiBldnQgKi8pIHtcbiAgLy8gTm90ZSBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gIGlmICgkcm9vdC5ub1NQQSgpKSB7IHJldHVybiB9XG4gICRyb290Lm9wZW4obG9jYXRpb24ucGF0aG5hbWUpXG59XG5cblxuZnVuY3Rpb24gc2V0dXBFdmVudHMoKSB7XG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIFwiYVwiLCBvbkFuY2hvckNsaWNrKVxuICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCBvblBvcFN0YXRlKVxuICB9IGVsc2Uge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgcmV3cml0ZUFuY2hvclJvb3QpXG4gIH1cbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIkdpdGh1YiDigJQgSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iLCIvKiBlc2xpbnQgbm8tdW5kZXJzY29yZS1kYW5nbGU6IDAsIHNlbWk6IDAgKi9cbi8vXG4vLyBUcmFjazpqcyBzZXR1cFxuLy9cbi8vIFRoaXMgZmlsZSBpcyBpbiB0aGUgc3JjLyBkaXJlY3RvcnksIG1lYW5pbmcgaXQgaXMgaW5jbHVkZWQgaW4gYXBwLmpzLlxuLy8gSG93ZXZlciBpdCBpcyBhbHNvIGV4cGxpY2l0bHkgaW5jbHVkZWQgaW4gbGlicy5qcyBzbyB0aGF0IGVycm9yXG4vLyB0cmFja2luZyBnZXRzIHN0YXJ0ZWQgQVNBUC5cbi8vXG4vLyBUaGUgc21hbGwgZHVwbGljYXRpb24gaXMgYSB0cmFkZS1vZmYgZm9yIHRoZSBoZWFkYWNoZSBvZiBwdXR0aW5nIGEgLmpzXG4vLyBmaWxlIG91dHNpZGUgdGhlIHNyYy8gZGlyZWN0b3J5Llxud2luZG93Ll90cmFja0pzID0gd2luZG93Ll90cmFja0pzIHx8IHtcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgYmluZFN0YWNrOiB0cnVlLCAvLyAgd2F0Y2ggZm9yIHBlcmYuIHBlbmFsdHkuXG4gIHRva2VuOiAnYmM5NTJlNzA0NGUzNGEyZTg0MjNmNzc3YjhjODI0YmUnXG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9