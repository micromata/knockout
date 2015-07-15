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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWVkaXQuanMiLCJiaW5kaW5ncy1oaWdobGlnaHQuanMiLCJiaW5kaW5ncy1yZXN1bHQuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVTSxHQUFHO0FBQ0ksV0FEUCxHQUFHLENBQ0ssSUFBSSxFQUFFOzBCQURkLEdBQUc7O0FBRUwsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7QUFDaEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakQ7O2VBVEcsR0FBRzs7V0FXQyxrQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLGtCQUFVLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxVQUFLLElBQUksQ0FBRTtLQUMxQzs7O1NBYkcsR0FBRzs7O0FBZ0JULEdBQUcsQ0FBQyxPQUFPLEdBQUcsbURBQW1ELENBQUE7O0FBR2pFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFB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ekIsRUFBRSxJQUFJLEVBQUUsb0RBQW9EO0FBQzFELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsZ0RBQWdEO0FBQ3RELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxtQkFBbUIsRUFBQyxFQUM1QixFQUFFLElBQUksRUFBRSxxQ0FBcUM7QUFDM0MsT0FBSyxFQUFFLFFBQVE7QUFDZixNQUFJLEVBQUUsZUFBZSxFQUFDLEVBQ3hCLEVBQUUsSUFBSSxFQUFFLFNBQVM7QUFDZixPQUFLLEVBQUUsZ0JBQWdCO0FBQ3ZCLE1BQUksRUFBRSxlQUFlLEVBQUMsQ0FDekIsQ0FBQTs7QUFHRCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQ1gsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsMkRBQTJEO0FBQ2hFLE9BQUssRUFBRSxpRUFBaUU7Q0FDekUsRUFDRCxFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHlFQUF5RTtBQUM5RSxPQUFLLEVBQUUsdUVBQXVFO0NBQy9FLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBBUEkgY29udmVydHMgdGhlIGBvcGluZWAtZmxhdm91cmVkIGRvY3VtZW50YXRpb24gaGVyZS5cblxuIEhlcmUgaXMgYSBzYW1wbGU6XG4qL1xuLy8gLyotLS1cbi8vICBwdXJwb3NlOiBrbm9ja291dC13aWRlIHNldHRpbmdzXG4vLyAgKi9cbi8vIHZhciBzZXR0aW5ncyA9IHsgLyouLi4qLyB9XG5cbmNsYXNzIEFQSSB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGVcbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWVcbiAgICB0aGlzLnNvdXJjZSA9IHNwZWMuc291cmNlXG4gICAgdGhpcy5saW5lID0gc3BlYy5saW5lXG4gICAgdGhpcy5wdXJwb3NlID0gc3BlYy52YXJzLnB1cnBvc2VcbiAgICB0aGlzLnNwZWMgPSBzcGVjLnZhcnMucGFyYW1zXG4gICAgdGhpcy51cmwgPSB0aGlzLmJ1aWxkVXJsKHNwZWMuc291cmNlLCBzcGVjLmxpbmUpXG4gIH1cblxuICBidWlsZFVybChzb3VyY2UsIGxpbmUpIHtcbiAgICByZXR1cm4gYCR7QVBJLnVybFJvb3R9JHtzb3VyY2V9I0wke2xpbmV9YFxuICB9XG59XG5cbkFQSS51cmxSb290ID0gXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvYmxvYi9tYXN0ZXIvXCJcblxuXG5BUEkuaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuXG5BUEkuYWRkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGNvbnNvbGUubG9nKFwiVFwiLCB0b2tlbilcbiAgQVBJLml0ZW1zLnB1c2gobmV3IEFQSSh0b2tlbikpXG59XG4iLCJcbmNsYXNzIERvY3VtZW50YXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdGl0bGUsIGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMuc3ViY2F0ZWdvcnkgPSBzdWJjYXRlZ29yeVxuICB9XG59XG5cbkRvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcCA9IHtcbiAgMTogXCJHZXR0aW5nIHN0YXJ0ZWRcIixcbiAgMjogXCJPYnNlcnZhYmxlc1wiLFxuICAzOiBcIkJpbmRpbmdzIGFuZCBDb21wb25lbnRzXCIsXG4gIDQ6IFwiQmluZGluZ3MgaW5jbHVkZWRcIixcbiAgNTogXCJGdXJ0aGVyIGluZm9ybWF0aW9uXCJcbn1cblxuRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSA9IGZ1bmN0aW9uIChpLCBub2RlKSB7XG4gIHJldHVybiBuZXcgRG9jdW1lbnRhdGlvbihcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN1YmNhdCcpXG4gIClcbn1cblxuRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICBEb2N1bWVudGF0aW9uLmFsbCA9ICQubWFrZUFycmF5KFxuICAgICQoXCJbZGF0YS1raW5kPWRvY3VtZW50YXRpb25dXCIpLm1hcChEb2N1bWVudGF0aW9uLmZyb21Ob2RlKVxuICApXG59XG4iLCJcblxuY2xhc3MgRXhhbXBsZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlID0ge30pIHtcbiAgICB2YXIgZGVib3VuY2UgPSB7IHRpbWVvdXQ6IDUwMCwgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiIH1cbiAgICB0aGlzLmphdmFzY3JpcHQgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmphdmFzY3JpcHQpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmh0bWwgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmh0bWwpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmNzcyA9IHN0YXRlLmNzcyB8fCAnJ1xuXG4gICAgdGhpcy5maW5hbEphdmFzY3JpcHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5jb21wdXRlRmluYWxKcywgdGhpcylcbiAgfVxuXG4gIC8vIEFkZCBrby5hcHBseUJpbmRpbmdzIGFzIG5lZWRlZDsgcmV0dXJuIEVycm9yIHdoZXJlIGFwcHJvcHJpYXRlLlxuICBjb21wdXRlRmluYWxKcygpIHtcbiAgICB2YXIganMgPSB0aGlzLmphdmFzY3JpcHQoKVxuICAgIGlmICghanMpIHsgcmV0dXJuIG5ldyBFcnJvcihcIlRoZSBzY3JpcHQgaXMgZW1wdHkuXCIpIH1cbiAgICBpZiAoanMuaW5kZXhPZigna28uYXBwbHlCaW5kaW5ncygnKSA9PT0gLTEpIHtcbiAgICAgIGlmIChqcy5pbmRleE9mKCcgdmlld01vZGVsID0nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2UgZ3Vlc3MgdGhlIHZpZXdNb2RlbCBuYW1lIC4uLlxuICAgICAgICByZXR1cm4gYCR7anN9XFxuXFxuLyogQXV0b21hdGljYWxseSBBZGRlZCAqL1xuICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsKTtgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5ncyh2aWV3KSBpcyBub3QgY2FsbGVkXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc1xuICB9XG59XG5cbkV4YW1wbGUuc3RhdGVNYXAgPSBuZXcgTWFwKClcblxuRXhhbXBsZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgc3RhdGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoIXN0YXRlKSB7XG4gICAgc3RhdGUgPSBuZXcgRXhhbXBsZShuYW1lKVxuICAgIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIHN0YXRlKVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuXG5cbkV4YW1wbGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKGV4YW1wbGUpIHtcbiAgICBleGFtcGxlLmphdmFzY3JpcHQoc3RhdGUuamF2YXNjcmlwdClcbiAgICBleGFtcGxlLmh0bWwoc3RhdGUuaHRtbClcbiAgICByZXR1cm5cbiAgfVxuICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBuZXcgRXhhbXBsZShzdGF0ZSkpXG59XG4iLCIvKmdsb2JhbHMgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwLCBjYW1lbGNhc2U6MCovXG5cbnZhciBFWFRFUk5BTF9JTkNMVURFUyA9IFtcbiAgXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIixcbiAgXCJodHRwczovL2Nkbi5yYXdnaXQuY29tL21iZXN0L2tub2Nrb3V0LnB1bmNoZXMvdjAuNS4xL2tub2Nrb3V0LnB1bmNoZXMuanNcIlxuXVxuXG5jbGFzcyBMaXZlRXhhbXBsZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMuaWQpIHtcbiAgICAgIHRoaXMuZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcChwYXJhbXMuaWQpKVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmJhc2U2NCkge1xuICAgICAgdmFyIG9wdHMgPVxuICAgICAgdGhpcy5leGFtcGxlID0gbmV3IEV4YW1wbGUoSlNPTi5wYXJzZShhdG9iKHBhcmFtcy5iYXNlNjQpKSlcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4YW1wbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4YW1wbGUgbXVzdCBiZSBwcm92aWRlZCBieSBpZCBvciBiYXNlNjQgcGFyYW1ldGVyXCIpXG4gICAgfVxuICB9XG5cbiAgb3BlbkNvbW1vblNldHRpbmdzKCkge1xuICAgIHZhciBleCA9IHRoaXMuZXhhbXBsZVxuICAgIHZhciBkYXRlZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgIHZhciBqc1ByZWZpeCA9IGAvKipcbiAqIENyZWF0ZWQgZnJvbSBhbiBleGFtcGxlIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlYCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlZCBvbiAke2RhdGVkfWBcbiAgICB9XG4gIH1cblxuICBvcGVuRmlkZGxlKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2RvYy5qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QuaHRtbFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBkdGQ6IFwiSFRNTCA1XCIsXG4gICAgICB3cmFwOiAnbCcsXG4gICAgICByZXNvdXJjZXM6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCIsXCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZm9ybSA9ICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QvbGlicmFyeS9wdXJlL1wiXG4gICAgICBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8L2Zvcm0+YClcbiAgICAkLmVhY2goZmllbGRzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBmb3JtLmFwcGVuZChcbiAgICAgICAgJChgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nJHtrfSc+YCkudmFsKHYpXG4gICAgICApXG4gICAgfSlcblxuICAgIGZvcm0uc3VibWl0KClcbiAgfVxuXG4gIG9wZW5QZW4oc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vYmxvZy5jb2RlcGVuLmlvL2RvY3VtZW50YXRpb24vYXBpL3ByZWZpbGwvXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgb3B0cyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBqc19leHRlcm5hbDogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIjtcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkob3B0cylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIilcblxuICAgICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9jb2RlcGVuLmlvL3Blbi9kZWZpbmVcIiBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdkYXRhJyB2YWx1ZT0nJHtkYXRhU3RyfScvPlxuICAgIDwvZm9ybT5gKS5zdWJtaXQoKVxuICB9XG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xpdmUtZXhhbXBsZScsIHtcbiAgICB2aWV3TW9kZWw6IExpdmVFeGFtcGxlQ29tcG9uZW50LFxuICAgIHRlbXBsYXRlOiB7ZWxlbWVudDogXCJsaXZlLWV4YW1wbGVcIn1cbn0pXG4iLCIvKmdsb2JhbCBQYWdlLCBEb2N1bWVudGF0aW9uLCBtYXJrZWQsIFNlYXJjaCwgUGx1Z2luTWFuYWdlciAqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmJvZHkuc3Vic2NyaWJlKHRoaXMub25Cb2R5Q2hhbmdlLCB0aGlzKVxuXG4gICAgLy8gLS0tIGZvb3RlciBsaW5rcy9jZG4gLS0tXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuXG4gICAgLy8gLS0tIHBsdWdpbnMgLS0tXG4gICAgdGhpcy5wbHVnaW5zID0gbmV3IFBsdWdpbk1hbmFnZXIoKVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuXG4gICAgLy8gLS0tIHBhZ2UgbG9hZGluZyBzdGF0dXMgLS0tXG4gICAgLy8gYXBwbGljYXRpb25DYWNoZSBwcm9ncmVzc1xuICAgIHRoaXMucmVsb2FkUHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmNhY2hlSXNVcGRhdGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSlcblxuICAgIC8vIHBhZ2UgbG9hZGluZyBlcnJvclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICAvLyBQcmVmZXJlbmNlIGZvciBub24tU2luZ2xlIFBhZ2UgQXBwXG4gICAgdmFyIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMubm9TUEEgPSBrby5vYnNlcnZhYmxlKEJvb2xlYW4obHMgJiYgbHMuZ2V0SXRlbSgnbm9TUEEnKSkpXG4gICAgdGhpcy5ub1NQQS5zdWJzY3JpYmUoKHYpID0+IGxzICYmIGxzLnNldEl0ZW0oJ25vU1BBJywgdiB8fCBcIlwiKSlcbiAgfVxuXG4gIHBhdGhUb1RlbXBsYXRlKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpLnBvcCgpLnJlcGxhY2UoJy5odG1sJywgJycpXG4gIH1cblxuICBvcGVuKHBpbnBvaW50KSB7XG4gICAgdGhpcy5ib2R5KHRoaXMucGF0aFRvVGVtcGxhdGUocGlucG9pbnQpKVxuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgJHskKHRoaXMpLnRleHQoKX1gXG4gIH1cblxuICBvbkJvZHlDaGFuZ2UodGVtcGxhdGVJZCkge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gIH1cblxuICByZWdpc3RlclBsdWdpbnMocGx1Z2lucykge1xuICAgIHRoaXMucGx1Z2lucy5yZWdpc3RlcihwbHVnaW5zKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsyLCB7XCJ2YXJzXCI6IFwibG9jYWxcIn1dKi9cblxuY2xhc3MgUGx1Z2luTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLmZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnNvcnRCeS5iaW5kKHRoaXMpKVxuICAgICAgLm1hcCh0aGlzLm5hbWVUb0luc3RhbmNlLmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMubmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuICB9XG5cbiAgcmVnaXN0ZXIocGx1Z2lucykge1xuICAgIE9iamVjdC5rZXlzKHBsdWdpbnMpLmZvckVhY2goZnVuY3Rpb24gKHJlcG8pIHtcbiAgICAgIHZhciBhYm91dCA9IHBsdWdpbnNbcmVwb11cbiAgICAgIHRoaXMucGx1Z2luUmVwb3MucHVzaChyZXBvKVxuICAgICAgdGhpcy5wbHVnaW5NYXAuc2V0KHJlcG8sIGFib3V0KVxuICAgIH0sIHRoaXMpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKHRydWUpXG4gIH1cblxuICBmaWx0ZXIocmVwbykge1xuICAgIGlmICghdGhpcy5wbHVnaW5zTG9hZGVkKCkpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMubmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cblxuICBuYW1lVG9JbnN0YW5jZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFwLmdldChuYW1lKVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYCMke3RlbXBsYXRlLmlkfWBcbiAgICB0aGlzLnRpdGxlID0gdGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgYOKAnCR7dGVtcGxhdGUuaWR94oCdYFxuICB9XG59XG5cblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIHNlYXJjaFJhdGUgPSB7XG4gICAgICB0aW1lb3V0OiA1MDAsXG4gICAgICBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCJcbiAgICB9XG4gICAgdGhpcy5xdWVyeSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogc2VhcmNoUmF0ZX0pXG4gICAgdGhpcy5yZXN1bHRzID0ga28uY29tcHV0ZWQodGhpcy5jb21wdXRlUmVzdWx0cywgdGhpcylcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gdGhpcy5xdWVyeSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBudWxsIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG59XG4iLCJcbnZhciBsYW5ndWFnZVRoZW1lTWFwID0ge1xuICBodG1sOiAnc29sYXJpemVkX2RhcmsnLFxuICBqYXZhc2NyaXB0OiAnbW9ub2thaSdcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0ga28udW53cmFwKGV4YW1wbGVOYW1lKVxuICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7bGFuZ3VhZ2VUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IHRydWUsXG4gICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgdGFiU2l6ZTogMixcbiAgICBtaW5MaW5lczogMyxcbiAgICBtYXhMaW5lczogMzAsXG4gICAgd3JhcDogdHJ1ZVxuICB9KVxuICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgZWRpdG9yLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IGV4YW1wbGVbbGFuZ3VhZ2VdKGVkaXRvci5nZXRWYWx1ZSgpKSB9KVxuICBleGFtcGxlW2xhbmd1YWdlXS5zdWJzY3JpYmUoZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAoZWRpdG9yLmdldFZhbHVlKCkgIT09IHYpIHtcbiAgICAgIGVkaXRvci5zZXRWYWx1ZSh2KVxuICAgIH1cbiAgfSlcbiAgZWRpdG9yLnNldFZhbHVlKGV4YW1wbGVbbGFuZ3VhZ2VdKCkpXG4gIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgcmV0dXJuIGVkaXRvclxufVxuXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzXG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1qcyddID0ge1xuICAvKiBoaWdobGlnaHQ6IFwibGFuZ2F1Z2VcIiAqL1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXR1cEVkaXRvcihlbGVtZW50LCAnamF2YXNjcmlwdCcsIHZhKCkpXG4gIH1cbn1cblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWh0bWwnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2h0bWwnLCB2YSgpKVxuICAgIC8vIGRlYnVnZ2VyXG4gICAgLy8gZWRpdG9yLnNlc3Npb24uc2V0T3B0aW9ucyh7XG4gICAgLy8gLy8gJHdvcmtlci5jYWxsKCdjaGFuZ2VPcHRpb25zJywgW3tcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnMnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWcnOiBmYWxzZVxuICAgIC8vIH0pXG4gIH1cbn1cbiIsIlxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxua28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBsYW5ndWFnZSA9IHZhKClcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdodG1sJyAmJiBsYW5ndWFnZSAhPT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQSBsYW5ndWFnZSBzaG91bGQgYmUgc3BlY2lmaWVkLlwiLCBlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gdW5lc2NhcGUoJGUudGV4dCgpKVxuICAgICRlLmVtcHR5KClcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3JlYWRvbmx5VGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gICAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogZmFsc2UsXG4gICAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDIsXG4gICAgICBtaW5MaW5lczogMSxcbiAgICAgIHdyYXA6IHRydWUsXG4gICAgICBtYXhMaW5lczogMzUsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG4gICAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbnRlbnQpXG4gICAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby1uZXctZnVuYzogMCAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5vcmlnaW5hbEFwcGx5QmluZGluZ3MgPSBrby5hcHBseUJpbmRpbmdzXG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0ga28udW53cmFwKHZhKCkpXG5cbiAgICBmdW5jdGlvbiByZXNldEVsZW1lbnQoKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICBrby5jbGVhbk5vZGUoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cbiAgICAgICRlLmVtcHR5KCkuYXBwZW5kKGA8ZGl2IGNsYXNzPSdleGFtcGxlICR7ZXhhbXBsZS5jc3N9Jz5gKVxuICAgIH1cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG5mdW5jdGlvbiBsb2FkSHRtbCh1cmkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgodXJpKSlcbiAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBnZXQgJHt1cml9OmAsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKGA8ZGl2IGlkPSd0ZW1wbGF0ZXMtLSR7dXJpfSc+YClcbiAgICAgICAgICAuYXBwZW5kKGh0bWwpXG4gICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpXG4gICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKCdidWlsZC90ZW1wbGF0ZXMuaHRtbCcpXG59XG5cbmZ1bmN0aW9uIGxvYWRNYXJrZG93bigpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKFwiYnVpbGQvbWFya2Rvd24uaHRtbFwiKVxufVxuXG5cbmZ1bmN0aW9uIHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlKCkge1xuICB2YXIgYWMgPSBhcHBsaWNhdGlvbkNhY2hlXG4gIGlmIChhYy5zdGF0dXMgPT09IGFjLklETEUpIHsgYWMudXBkYXRlKCkgfVxuICBzZXRUaW1lb3V0KHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlLCBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfVxuICByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxufVxuXG5cbmZ1bmN0aW9uIGdldEV4YW1wbGVzKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvZXhhbXBsZXMuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICBPYmplY3Qua2V5cyhyZXN1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgc2V0dGluZyA9IHJlc3VsdHNbbmFtZV1cbiAgICAgIEV4YW1wbGUuc2V0KHNldHRpbmcuaWQgfHwgbmFtZSwgc2V0dGluZylcbiAgICB9KVxuICApXG59XG5cblxuZnVuY3Rpb24gbG9hZEFQSSgpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2FwaS5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIHJlc3VsdHMuYXBpLmZvckVhY2goZnVuY3Rpb24gKGFwaUZpbGVMaXN0KSB7XG4gICAgICAvLyBXZSBlc3NlbnRpYWxseSBoYXZlIHRvIGZsYXR0ZW4gdGhlIGFwaSAoRklYTUUpXG4gICAgICBhcGlGaWxlTGlzdC5mb3JFYWNoKEFQSS5hZGQpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGdldFBsdWdpbnMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9wbHVnaW5zLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+ICRyb290LnJlZ2lzdGVyUGx1Z2lucyhyZXN1bHRzKSlcbn1cblxuXG5mdW5jdGlvbiBhcHBseUJpbmRpbmdzKCkge1xuICBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG4gIHdpbmRvdy4kcm9vdCA9IG5ldyBQYWdlKClcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICBrby5hcHBseUJpbmRpbmdzKHdpbmRvdy4kcm9vdClcbn1cblxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICBpZiAobG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignLmh0bWwnKSA9PT0gLTEpIHtcbiAgICB3aW5kb3cuJHJvb3Qub3BlbihcImludHJvXCIpXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgUHJvbWlzZS5hbGwoW2xvYWRUZW1wbGF0ZXMoKSwgbG9hZE1hcmtkb3duKCldKVxuICAgIC50aGVuKERvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSlcbiAgICAudGhlbihhcHBseUJpbmRpbmdzKVxuICAgIC50aGVuKGdldEV4YW1wbGVzKVxuICAgIC50aGVuKGxvYWRBUEkpXG4gICAgLnRoZW4oZ2V0UGx1Z2lucylcbiAgICAudGhlbihzZXR1cEV2ZW50cylcbiAgICAudGhlbihjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKVxuICAgIC50aGVuKHBhZ2VMb2FkZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5ib2R5KFwiZXJyb3JcIilcbiAgICAgIHdpbmRvdy4kcm9vdC5lcnJvck1lc3NhZ2UoZXJyLm1lc3NhZ2UgfHwgZXJyKVxuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgfSlcbn1cblxuJChzdGFydClcbiIsIi8qZ2xvYmFsIHNldHVwRXZlbnRzKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCAqL1xuXG5mdW5jdGlvbiBpc0xvY2FsKGFuY2hvcikge1xuICByZXR1cm4gKGxvY2F0aW9uLnByb3RvY29sID09PSBhbmNob3IucHJvdG9jb2wgJiZcbiAgICAgICAgICBsb2NhdGlvbi5ob3N0ID09PSBhbmNob3IuaG9zdClcbn1cblxuLy8gTWFrZSBzdXJlIGluIG5vbi1zaW5nbGUtcGFnZS1hcHAgbW9kZSB0aGF0IHdlIGxpbmsgdG8gdGhlIHJpZ2h0IHJlbGF0aXZlXG4vLyBsaW5rLlxudmFyIGFuY2hvclJvb3QgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9hXFwvLipcXC5odG1sLywgJycpXG5mdW5jdGlvbiByZXdyaXRlQW5jaG9yUm9vdChldnQpIHtcbiAgdmFyIGFuY2hvciA9IGV2dC5jdXJyZW50VGFyZ2V0XG4gIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gIC8vIFNraXAgbm9uLWxvY2FsIHVybHMuXG4gIGlmICghaXNMb2NhbChhbmNob3IpKSB7IHJldHVybiB0cnVlIH1cbiAgLy8gQWxyZWFkeSByZS1yb290ZWRcbiAgaWYgKGFuY2hvci5wYXRobmFtZS5pbmRleE9mKGFuY2hvclJvb3QpID09PSAwKSB7IHJldHVybiB0cnVlIH1cbiAgYW5jaG9yLnBhdGhuYW1lID0gYCR7YW5jaG9yUm9vdH0ke2FuY2hvci5wYXRobmFtZX1gLnJlcGxhY2UoJy8vJywgJy8nKVxuICByZXR1cm4gdHJ1ZVxufVxuXG5cbi8vXG4vLyBGb3IgSlMgaGlzdG9yeSBzZWU6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4vL1xuZnVuY3Rpb24gb25BbmNob3JDbGljayhldnQpIHtcbiAgdmFyIGFuY2hvciA9IHRoaXNcbiAgcmV3cml0ZUFuY2hvclJvb3QoZXZ0KVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG5cbiAgLy8gRG8gbm90IGludGVyY2VwdCBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChhbmNob3IpLnBhcmVudHMoXCJsaXZlLWV4YW1wbGVcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHRlbXBsYXRlSWQgPSAkcm9vdC5wYXRoVG9UZW1wbGF0ZShhbmNob3IucGF0aG5hbWUpXG4gICAgLy8gSWYgdGhlIHRlbXBsYXRlIGlzbid0IGZvdW5kLCBwcmVzdW1lIGEgaGFyZCBsaW5rXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLmhyZWYpXG4gICAgJHJvb3Qub3Blbih0ZW1wbGF0ZUlkKVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgRXJyb3IvJHthbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCwgZSlcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBOb3RlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIH1cbiAgJHJvb3Qub3Blbihsb2NhdGlvbi5wYXRobmFtZSlcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgXCJhXCIsIG9uQW5jaG9yQ2xpY2spXG4gICAgJCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIG9uUG9wU3RhdGUpXG4gIH0gZWxzZSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCByZXdyaXRlQW5jaG9yUm9vdClcbiAgfVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJHaXRodWIg4oCUIFJlcG9zaXRvcnlcIixcbiAgICBpY29uOiBcImZhLWdpdGh1YlwifSxcbiAgeyBocmVmOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9pc3N1ZXMvXCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3JlbGVhc2VzJyxcbiAgICB0aXRsZTogXCJSZWxlYXNlc1wiLFxuICAgIGljb246IFwiZmEtY2VydGlmaWNhdGVcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQva25vY2tvdXQnLFxuICAgIHRpdGxlOiBcIkdpdHRlclwiLFxuICAgIGljb246IFwiZmEtY29tbWVudHMtb1wifSxcbiAgeyBocmVmOiAnbGVnYWN5LycsXG4gICAgdGl0bGU6IFwiTGVnYWN5IHdlYnNpdGVcIixcbiAgICBpY29uOiBcImZhIGZhLWhpc3RvcnlcIn1cbl1cblxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0IENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmUgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1kZWJ1Zy5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LW1pbi5qc1wiXG4gIH1cbl1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==