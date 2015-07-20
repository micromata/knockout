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
      if (templateId) {
        var node = document.getElementById(templateId);
        this.title(node.getAttribute('data-title') || '');
      }
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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SearchResult = function SearchResult(template) {
  _classCallCheck(this, SearchResult);

  this.template = template;
  this.link = '/a/' + template.id + '.html';
  this.title = template.getAttribute('data-title') || '“' + template.id + '”';
};

var Search = (function () {
  function Search() {
    _classCallCheck(this, Search);

    var searchRate = {
      timeout: 500,
      method: 'notifyWhenChangesStop'
    };
    this.query = ko.observable().extend({ rateLimit: searchRate });
    this.results = ko.computed(this.computeResults, this);
    this.query.subscribe(this.onQueryChange, this);
    this.progress = ko.observable();
  }

  _createClass(Search, [{
    key: 'computeResults',
    value: function computeResults() {
      var q = (this.query() || '').trim().toLowerCase();
      if (!q) {
        return [];
      }
      return $('template').filter(function () {
        return $(this.content).text().toLowerCase().indexOf(q) !== -1;
      }).map(function (i, template) {
        return new SearchResult(template);
      });
    }
  }, {
    key: 'saveTemplate',
    value: function saveTemplate() {
      if ($root.body() !== 'search') {
        this.savedTemplate = $root.body();
        this.savedTitle = document.title;
      }
    }
  }, {
    key: 'restoreTemplate',
    value: function restoreTemplate() {
      if (this.savedTitle) {
        $root.body(this.savedTemplate);
        document.title = this.savedTitle;
      }
    }
  }, {
    key: 'onQueryChange',
    value: function onQueryChange() {
      if (!(this.query() || '').trim()) {
        this.restoreTemplate();
        return;
      }
      this.saveTemplate();
      $root.body('search');
      document.title = 'Knockout.js – Search “' + this.query() + '”';
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
    // Reload the page if we are still initializing and an update is ready.
    location.reload();
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
    $root.search.query('');
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

window.links = [{ href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: "https://gitter.im/knockout/knockout",
  title: "Gitter",
  icon: "fa-comments-o" }, { href: "legacy/",
  title: "Legacy website",
  icon: "fa fa-history" }];

window.githubLinks = [{ href: "https://github.com/knockout/knockout",
  title: "Repository",
  icon: "fa-github" }, { href: "https://github.com/knockout/knockout/issues/",
  title: "Issues",
  icon: "fa-exclamation-circle" }, { href: "https://github.com/knockout/knockout/releases",
  title: "Releases",
  icon: "fa-certificate" }];

window.cdn = [{ name: "Microsoft CDN",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare CDN",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js"
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

if (location.hostname !== 'localhost') {
  window._trackJs = window._trackJs || {
    enabled: true,
    token: 'bc952e7044e34a2e8423f777b8c824be',
    version: document.body.getAttribute('data-version')
  };
} else {
  window._trackJs = window._trackJs || {
    enabled: false
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWVkaXQuanMiLCJiaW5kaW5ncy1oaWdobGlnaHQuanMiLCJiaW5kaW5ncy1yZXN1bHQuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIiwidHJhY2tlci1zZXR1cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBVU0sR0FBRztBQUNJLFdBRFAsR0FBRyxDQUNLLElBQUksRUFBRTswQkFEZCxHQUFHOztBQUVMLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDNUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pEOztlQVRHLEdBQUc7O1dBV0Msa0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNyQixrQkFBVSxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sVUFBSyxJQUFJLENBQUU7S0FDMUM7OztTQWJHLEdBQUc7OztBQWdCVCxHQUFHLENBQUMsT0FBTyxHQUFHLG1EQUFtRCxDQUFBOztBQUdqRSxHQUFH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LEVBQUUsZUFBZSxFQUFDLENBQ3pCLENBQUE7O0FBRUQsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUNuQixFQUFFLElBQUksRUFBRSxzQ0FBc0M7QUFDNUMsT0FBSyxFQUFFLFlBQVk7QUFDbkIsTUFBSSxFQUFFLFdBQVcsRUFBQyxFQUNwQixFQUFFLElBQUksRUFBRSw4Q0FBOEM7QUFDcEQsT0FBSyxFQUFFLFFBQVE7QUFDZixNQUFJLEVBQUUsdUJBQXVCLEVBQUMsRUFDaEMsRUFBRSxJQUFJLEVBQUUsK0NBQStDO0FBQ3JELE9BQUssRUFBRSxVQUFVO0FBQ2pCLE1BQUksRUFBRSxnQkFBZ0IsRUFBQyxDQUMxQixDQUFBOztBQUVELE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FDWCxFQUFFLElBQUksRUFBRSxlQUFlO0FBQ3JCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSwyREFBMkQ7QUFDaEUsT0FBSyxFQUFFLGlFQUFpRTtDQUN6RSxFQUNELEVBQUUsSUFBSSxFQUFFLGdCQUFnQjtBQUN0QixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsdUVBQXVFO0FBQzVFLE9BQUssRUFBRSx5RUFBeUU7Q0FDakYsQ0FDRixDQUFBOzs7Ozs7Ozs7Ozs7O0FDN0JELElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDckMsUUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJO0FBQ25DLFdBQU8sRUFBRSxJQUFJO0FBQ2IsU0FBSyxFQUFFLGtDQUFrQztBQUN6QyxXQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO0dBQ3BELENBQUM7Q0FDSCxNQUFNO0FBQ0wsUUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJO0FBQ25DLFdBQU8sRUFBRSxLQUFLO0dBQ2YsQ0FBQztDQUNIIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEFQSSBjb252ZXJ0cyB0aGUgYG9waW5lYC1mbGF2b3VyZWQgZG9jdW1lbnRhdGlvbiBoZXJlLlxuXG4gSGVyZSBpcyBhIHNhbXBsZTpcbiovXG4vLyAvKi0tLVxuLy8gIHB1cnBvc2U6IGtub2Nrb3V0LXdpZGUgc2V0dGluZ3Ncbi8vICAqL1xuLy8gdmFyIHNldHRpbmdzID0geyAvKi4uLiovIH1cblxuY2xhc3MgQVBJIHtcbiAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZVxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZVxuICAgIHRoaXMuc291cmNlID0gc3BlYy5zb3VyY2VcbiAgICB0aGlzLmxpbmUgPSBzcGVjLmxpbmVcbiAgICB0aGlzLnB1cnBvc2UgPSBzcGVjLnZhcnMucHVycG9zZVxuICAgIHRoaXMuc3BlYyA9IHNwZWMudmFycy5wYXJhbXNcbiAgICB0aGlzLnVybCA9IHRoaXMuYnVpbGRVcmwoc3BlYy5zb3VyY2UsIHNwZWMubGluZSlcbiAgfVxuXG4gIGJ1aWxkVXJsKHNvdXJjZSwgbGluZSkge1xuICAgIHJldHVybiBgJHtBUEkudXJsUm9vdH0ke3NvdXJjZX0jTCR7bGluZX1gXG4gIH1cbn1cblxuQVBJLnVybFJvb3QgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9ibG9iL21hc3Rlci9cIlxuXG5cbkFQSS5pdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG5cbkFQSS5hZGQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY29uc29sZS5sb2coXCJUXCIsIHRva2VuKVxuICBBUEkuaXRlbXMucHVzaChuZXcgQVBJKHRva2VuKSlcbn1cbiIsIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgYW5kIENvbXBvbmVudHNcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiLFxuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5leGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHBhcmFtcy5pZCkpXG4gICAgfVxuICAgIGlmIChwYXJhbXMuYmFzZTY0KSB7XG4gICAgICB2YXIgb3B0cyA9XG4gICAgICB0aGlzLmV4YW1wbGUgPSBuZXcgRXhhbXBsZShKU09OLnBhcnNlKGF0b2IocGFyYW1zLmJhc2U2NCkpKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhhbXBsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhhbXBsZSBtdXN0IGJlIHByb3ZpZGVkIGJ5IGlkIG9yIGJhc2U2NCBwYXJhbWV0ZXJcIilcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4ID0gdGhpcy5leGFtcGxlXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgb24gdGhlIEtub2Nrb3V0IHdlYnNpdGVcbiAqIG9uICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfVxuICoqL1xuXG4gLyogRm9yIGNvbnZlbmllbmNlIGFuZCBjb25zaXN0ZW5jeSB3ZSd2ZSBlbmFibGVkIHRoZSBrb1xuICAqIHB1bmNoZXMgbGlicmFyeSBmb3IgdGhpcyBleGFtcGxlLlxuICAqL1xuIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcblxuIC8qKiBFeGFtcGxlIGlzIGFzIGZvbGxvd3MgKiovXG5gXG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWw6IGV4Lmh0bWwoKSxcbiAgICAgIGpzOiBqc1ByZWZpeCArIGV4LmZpbmFsSmF2YXNjcmlwdCgpLFxuICAgICAgdGl0bGU6IGBGcm9tIEtub2Nrb3V0IGV4YW1wbGVgLFxuICAgICAgZGVzY3JpcHRpb246IGBDcmVhdGVkIG9uICR7ZGF0ZWR9YFxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWRkbGUoc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vZG9jLmpzZmlkZGxlLm5ldC9hcGkvcG9zdC5odG1sXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGR0ZDogXCJIVE1MIDVcIixcbiAgICAgIHdyYXA6ICdsJyxcbiAgICAgIHJlc291cmNlczogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIixcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBmb3JtID0gJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2pzZmlkZGxlLm5ldC9hcGkvcG9zdC9saWJyYXJ5L3B1cmUvXCJcbiAgICAgIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDwvZm9ybT5gKVxuICAgICQuZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGZvcm0uYXBwZW5kKFxuICAgICAgICAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPScke2t9Jz5gKS52YWwodilcbiAgICAgIClcbiAgICB9KVxuXG4gICAgZm9ybS5zdWJtaXQoKVxuICB9XG5cbiAgb3BlblBlbihzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLmNvZGVwZW4uaW8vZG9jdW1lbnRhdGlvbi9hcGkvcHJlZmlsbC9cbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBvcHRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGpzX2V4dGVybmFsOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiO1wiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKVxuXG4gICAgJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2NvZGVwZW4uaW8vcGVuL2RlZmluZVwiIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J2RhdGEnIHZhbHVlPScke2RhdGFTdHJ9Jy8+XG4gICAgPC9mb3JtPmApLnN1Ym1pdCgpXG4gIH1cbn1cblxua28uY29tcG9uZW50cy5yZWdpc3RlcignbGl2ZS1leGFtcGxlJywge1xuICAgIHZpZXdNb2RlbDogTGl2ZUV4YW1wbGVDb21wb25lbnQsXG4gICAgdGVtcGxhdGU6IHtlbGVtZW50OiBcImxpdmUtZXhhbXBsZVwifVxufSlcbiIsIi8qZ2xvYmFsIFBhZ2UsIERvY3VtZW50YXRpb24sIG1hcmtlZCwgU2VhcmNoLCBQbHVnaW5NYW5hZ2VyICovXG4vKmVzbGludCBuby11bnVzZWQtdmFyczogMCovXG5cblxuY2xhc3MgUGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIC0tLSBNYWluIGJvZHkgdGVtcGxhdGUgaWQgLS0tXG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuYm9keS5zdWJzY3JpYmUodGhpcy5vbkJvZHlDaGFuZ2UsIHRoaXMpXG5cbiAgICAvLyAtLS0gZm9vdGVyIGxpbmtzL2NkbiAtLS1cbiAgICB0aGlzLmxpbmtzID0gd2luZG93LmxpbmtzXG4gICAgdGhpcy5jZG4gPSB3aW5kb3cuY2RuXG5cbiAgICAvLyAtLS0gcGx1Z2lucyAtLS1cbiAgICB0aGlzLnBsdWdpbnMgPSBuZXcgUGx1Z2luTWFuYWdlcigpXG5cbiAgICAvLyAtLS0gZG9jdW1lbnRhdGlvbiAtLS1cbiAgICB0aGlzLmRvY0NhdE1hcCA9IG5ldyBNYXAoKVxuICAgIERvY3VtZW50YXRpb24uYWxsLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgdmFyIGNhdCA9IERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFtkb2MuY2F0ZWdvcnldXG4gICAgICB2YXIgZG9jTGlzdCA9IHRoaXMuZG9jQ2F0TWFwLmdldChjYXQpXG4gICAgICBpZiAoIWRvY0xpc3QpIHtcbiAgICAgICAgZG9jTGlzdCA9IFtdXG4gICAgICAgIHRoaXMuZG9jQ2F0TWFwLnNldChjYXQsIGRvY0xpc3QpXG4gICAgICB9XG4gICAgICBkb2NMaXN0LnB1c2goZG9jKVxuICAgIH0sIHRoaXMpXG5cbiAgICAvLyBTb3J0IHRoZSBkb2N1bWVudGF0aW9uIGl0ZW1zXG4gICAgZnVuY3Rpb24gc29ydGVyKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnRpdGxlLmxvY2FsZUNvbXBhcmUoYi50aXRsZSlcbiAgICB9XG4gICAgZm9yICh2YXIgbGlzdCBvZiB0aGlzLmRvY0NhdE1hcC52YWx1ZXMoKSkgeyBsaXN0LnNvcnQoc29ydGVyKSB9XG5cbiAgICAvLyBkb2NDYXRzOiBBIHNvcnRlZCBsaXN0IG9mIHRoZSBkb2N1bWVudGF0aW9uIHNlY3Rpb25zXG4gICAgdGhpcy5kb2NDYXRzID0gT2JqZWN0LmtleXMoRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwKVxuICAgICAgLnNvcnQoKVxuICAgICAgLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW3ZdIH0pXG5cbiAgICAvLyAtLS0gc2VhcmNoaW5nIC0tLVxuICAgIHRoaXMuc2VhcmNoID0gbmV3IFNlYXJjaCgpXG5cbiAgICAvLyAtLS0gcGFnZSBsb2FkaW5nIHN0YXR1cyAtLS1cbiAgICAvLyBhcHBsaWNhdGlvbkNhY2hlIHByb2dyZXNzXG4gICAgdGhpcy5yZWxvYWRQcm9ncmVzcyA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuY2FjaGVJc1VwZGF0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKVxuXG4gICAgLy8gcGFnZSBsb2FkaW5nIGVycm9yXG4gICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIFByZWZlcmVuY2UgZm9yIG5vbi1TaW5nbGUgUGFnZSBBcHBcbiAgICB2YXIgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5ub1NQQSA9IGtvLm9ic2VydmFibGUoQm9vbGVhbihscyAmJiBscy5nZXRJdGVtKCdub1NQQScpKSlcbiAgICB0aGlzLm5vU1BBLnN1YnNjcmliZSgodikgPT4gbHMgJiYgbHMuc2V0SXRlbSgnbm9TUEEnLCB2IHx8IFwiXCIpKVxuICB9XG5cbiAgcGF0aFRvVGVtcGxhdGUocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykucG9wKCkucmVwbGFjZSgnLmh0bWwnLCAnJylcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICB0aGlzLmJvZHkodGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKVxuICAgIGRvY3VtZW50LnRpdGxlID0gYEtub2Nrb3V0LmpzIOKAkyAkeyQodGhpcykudGV4dCgpfWBcbiAgfVxuXG4gIG9uQm9keUNoYW5nZSh0ZW1wbGF0ZUlkKSB7XG4gICAgaWYgKHRlbXBsYXRlSWQpIHtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICAgIHRoaXMudGl0bGUobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJylcbiAgICB9XG4gIH1cblxuICByZWdpc3RlclBsdWdpbnMocGx1Z2lucykge1xuICAgIHRoaXMucGx1Z2lucy5yZWdpc3RlcihwbHVnaW5zKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsyLCB7XCJ2YXJzXCI6IFwibG9jYWxcIn1dKi9cblxuY2xhc3MgUGx1Z2luTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLmZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnNvcnRCeS5iaW5kKHRoaXMpKVxuICAgICAgLm1hcCh0aGlzLm5hbWVUb0luc3RhbmNlLmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMubmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuICB9XG5cbiAgcmVnaXN0ZXIocGx1Z2lucykge1xuICAgIE9iamVjdC5rZXlzKHBsdWdpbnMpLmZvckVhY2goZnVuY3Rpb24gKHJlcG8pIHtcbiAgICAgIHZhciBhYm91dCA9IHBsdWdpbnNbcmVwb11cbiAgICAgIHRoaXMucGx1Z2luUmVwb3MucHVzaChyZXBvKVxuICAgICAgdGhpcy5wbHVnaW5NYXAuc2V0KHJlcG8sIGFib3V0KVxuICAgIH0sIHRoaXMpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKHRydWUpXG4gIH1cblxuICBmaWx0ZXIocmVwbykge1xuICAgIGlmICghdGhpcy5wbHVnaW5zTG9hZGVkKCkpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMubmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cblxuICBuYW1lVG9JbnN0YW5jZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFwLmdldChuYW1lKVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYC9hLyR7dGVtcGxhdGUuaWR9Lmh0bWxgXG4gICAgdGhpcy50aXRsZSA9IHRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGDigJwke3RlbXBsYXRlLmlkfeKAnWBcbiAgfVxufVxuXG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHZhciBzZWFyY2hSYXRlID0ge1xuICAgICAgdGltZW91dDogNTAwLFxuICAgICAgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiXG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IHNlYXJjaFJhdGV9KVxuICAgIHRoaXMucmVzdWx0cyA9IGtvLmNvbXB1dGVkKHRoaXMuY29tcHV0ZVJlc3VsdHMsIHRoaXMpXG4gICAgdGhpcy5xdWVyeS5zdWJzY3JpYmUodGhpcy5vblF1ZXJ5Q2hhbmdlLCB0aGlzKVxuICAgIHRoaXMucHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIXEpIHsgcmV0dXJuIFtdIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxKSAhPT0gLTFcbiAgICAgIH0pXG4gICAgICAubWFwKChpLCB0ZW1wbGF0ZSkgPT4gbmV3IFNlYXJjaFJlc3VsdCh0ZW1wbGF0ZSkpXG4gIH1cblxuICBzYXZlVGVtcGxhdGUoKSB7XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gJ3NlYXJjaCcpIHtcbiAgICAgIHRoaXMuc2F2ZWRUZW1wbGF0ZSA9ICRyb290LmJvZHkoKVxuICAgICAgdGhpcy5zYXZlZFRpdGxlID0gZG9jdW1lbnQudGl0bGVcbiAgICB9XG4gIH1cblxuICByZXN0b3JlVGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuc2F2ZWRUaXRsZSkge1xuICAgICAgJHJvb3QuYm9keSh0aGlzLnNhdmVkVGVtcGxhdGUpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuc2F2ZWRUaXRsZVxuICAgIH1cbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UoKSB7XG4gICAgaWYgKCEodGhpcy5xdWVyeSgpIHx8ICcnKS50cmltKCkpIHtcbiAgICAgIHRoaXMucmVzdG9yZVRlbXBsYXRlKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnNhdmVUZW1wbGF0ZSgpXG4gICAgJHJvb3QuYm9keShcInNlYXJjaFwiKVxuICAgIGRvY3VtZW50LnRpdGxlID0gYEtub2Nrb3V0LmpzIOKAkyBTZWFyY2gg4oCcJHt0aGlzLnF1ZXJ5KCl94oCdYFxuICB9XG59XG4iLCJcbnZhciBsYW5ndWFnZVRoZW1lTWFwID0ge1xuICBodG1sOiAnc29sYXJpemVkX2RhcmsnLFxuICBqYXZhc2NyaXB0OiAnbW9ub2thaSdcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0ga28udW53cmFwKGV4YW1wbGVOYW1lKVxuICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7bGFuZ3VhZ2VUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IHRydWUsXG4gICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgdGFiU2l6ZTogMixcbiAgICBtaW5MaW5lczogMyxcbiAgICBtYXhMaW5lczogMzAsXG4gICAgd3JhcDogdHJ1ZVxuICB9KVxuICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgZWRpdG9yLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IGV4YW1wbGVbbGFuZ3VhZ2VdKGVkaXRvci5nZXRWYWx1ZSgpKSB9KVxuICBleGFtcGxlW2xhbmd1YWdlXS5zdWJzY3JpYmUoZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAoZWRpdG9yLmdldFZhbHVlKCkgIT09IHYpIHtcbiAgICAgIGVkaXRvci5zZXRWYWx1ZSh2KVxuICAgIH1cbiAgfSlcbiAgZWRpdG9yLnNldFZhbHVlKGV4YW1wbGVbbGFuZ3VhZ2VdKCkpXG4gIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgcmV0dXJuIGVkaXRvclxufVxuXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzXG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1qcyddID0ge1xuICAvKiBoaWdobGlnaHQ6IFwibGFuZ2F1Z2VcIiAqL1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXR1cEVkaXRvcihlbGVtZW50LCAnamF2YXNjcmlwdCcsIHZhKCkpXG4gIH1cbn1cblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWh0bWwnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2h0bWwnLCB2YSgpKVxuICAgIC8vIGRlYnVnZ2VyXG4gICAgLy8gZWRpdG9yLnNlc3Npb24uc2V0T3B0aW9ucyh7XG4gICAgLy8gLy8gJHdvcmtlci5jYWxsKCdjaGFuZ2VPcHRpb25zJywgW3tcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnMnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWcnOiBmYWxzZVxuICAgIC8vIH0pXG4gIH1cbn1cbiIsIlxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxua28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBsYW5ndWFnZSA9IHZhKClcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdodG1sJyAmJiBsYW5ndWFnZSAhPT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQSBsYW5ndWFnZSBzaG91bGQgYmUgc3BlY2lmaWVkLlwiLCBlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gdW5lc2NhcGUoJGUudGV4dCgpKVxuICAgICRlLmVtcHR5KClcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3JlYWRvbmx5VGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gICAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogZmFsc2UsXG4gICAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDIsXG4gICAgICBtaW5MaW5lczogMSxcbiAgICAgIHdyYXA6IHRydWUsXG4gICAgICBtYXhMaW5lczogMzUsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG4gICAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbnRlbnQpXG4gICAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby1uZXctZnVuYzogMCAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5vcmlnaW5hbEFwcGx5QmluZGluZ3MgPSBrby5hcHBseUJpbmRpbmdzXG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0ga28udW53cmFwKHZhKCkpXG5cbiAgICBmdW5jdGlvbiByZXNldEVsZW1lbnQoKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICBrby5jbGVhbk5vZGUoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cbiAgICAgICRlLmVtcHR5KCkuYXBwZW5kKGA8ZGl2IGNsYXNzPSdleGFtcGxlICR7ZXhhbXBsZS5jc3N9Jz5gKVxuICAgIH1cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG5mdW5jdGlvbiBsb2FkSHRtbCh1cmkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgodXJpKSlcbiAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBnZXQgJHt1cml9OmAsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKGA8ZGl2IGlkPSd0ZW1wbGF0ZXMtLSR7dXJpfSc+YClcbiAgICAgICAgICAuYXBwZW5kKGh0bWwpXG4gICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpXG4gICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKCdidWlsZC90ZW1wbGF0ZXMuaHRtbCcpXG59XG5cbmZ1bmN0aW9uIGxvYWRNYXJrZG93bigpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKFwiYnVpbGQvbWFya2Rvd24uaHRtbFwiKVxufVxuXG5cbmZ1bmN0aW9uIHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlKCkge1xuICB2YXIgYWMgPSBhcHBsaWNhdGlvbkNhY2hlXG4gIGlmIChhYy5zdGF0dXMgPT09IGFjLklETEUpIHsgYWMudXBkYXRlKCkgfVxuICBzZXRUaW1lb3V0KHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlLCBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy5odG1sJykgPT09IC0xKSB7XG4gICAgd2luZG93LiRyb290Lm9wZW4oXCJpbnRyb1wiKVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIFByb21pc2UuYWxsKFtsb2FkVGVtcGxhdGVzKCksIGxvYWRNYXJrZG93bigpXSlcbiAgICAudGhlbihEb2N1bWVudGF0aW9uLmluaXRpYWxpemUpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB3aW5kb3cuJHJvb3QuYm9keShcImVycm9yXCIpXG4gICAgICB3aW5kb3cuJHJvb3QuZXJyb3JNZXNzYWdlKGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH0pXG59XG5cbiQoc3RhcnQpXG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5wYXRobmFtZSA9IGAke2FuY2hvclJvb3R9JHthbmNob3IucGF0aG5hbWV9YC5yZXBsYWNlKCcvLycsICcvJylcbiAgcmV0dXJuIHRydWVcbn1cblxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIHZhciBhbmNob3IgPSB0aGlzXG4gIHJld3JpdGVBbmNob3JSb290KGV2dClcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiB0aGluZ3Mgb3V0c2lkZSB0aGlzIHBhZ2VcbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIGFuIGVsZW1lbnQgaW4gYW4gZXhhbXBsZS5cbiAgaWYgKCQoYW5jaG9yKS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gJHJvb3QucGF0aFRvVGVtcGxhdGUoYW5jaG9yLnBhdGhuYW1lKVxuICAgIC8vIElmIHRoZSB0ZW1wbGF0ZSBpc24ndCBmb3VuZCwgcHJlc3VtZSBhIGhhcmQgbGlua1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkpIHsgcmV0dXJuIHRydWUgfVxuICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5ocmVmKVxuICAgICRyb290Lm9wZW4odGVtcGxhdGVJZClcbiAgICAkcm9vdC5zZWFyY2gucXVlcnkoJycpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKGBFcnJvci8ke2FuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5cbmZ1bmN0aW9uIG9uUG9wU3RhdGUoLyogZXZ0ICovKSB7XG4gIC8vIE5vdGUgaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gfVxuICAkcm9vdC5vcGVuKGxvY2F0aW9uLnBhdGhuYW1lKVxufVxuXG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRzKCkge1xuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcbiAgICAkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbiAgfSBlbHNlIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIHJld3JpdGVBbmNob3JSb290KVxuICB9XG59XG4iLCJcbndpbmRvdy5saW5rcyA9IFtcbiAgeyBocmVmOiBcImh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFmb3J1bS9rbm9ja291dGpzXCIsXG4gICAgdGl0bGU6IFwiR29vZ2xlIEdyb3Vwc1wiLFxuICAgIGljb246IFwiZmEtZ29vZ2xlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3RhZ3Mva25vY2tvdXQuanMvaW5mb1wiLFxuICAgIHRpdGxlOiBcIlN0YWNrT3ZlcmZsb3dcIixcbiAgICBpY29uOiBcImZhLXN0YWNrLW92ZXJmbG93XCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdHRlci5pbS9rbm9ja291dC9rbm9ja291dCcsXG4gICAgdGl0bGU6IFwiR2l0dGVyXCIsXG4gICAgaWNvbjogXCJmYS1jb21tZW50cy1vXCJ9LFxuICB7IGhyZWY6ICdsZWdhY3kvJyxcbiAgICB0aXRsZTogXCJMZWdhY3kgd2Vic2l0ZVwiLFxuICAgIGljb246IFwiZmEgZmEtaGlzdG9yeVwifVxuXVxuXG53aW5kb3cuZ2l0aHViTGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIklzc3Vlc1wiLFxuICAgIGljb246IFwiZmEtZXhjbGFtYXRpb24tY2lyY2xlXCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvcmVsZWFzZXMnLFxuICAgIHRpdGxlOiBcIlJlbGVhc2VzXCIsXG4gICAgaWNvbjogXCJmYS1jZXJ0aWZpY2F0ZVwifVxuXVxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0IENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmUgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1kZWJ1Zy5qc1wiXG4gIH1cbl1cbiIsIi8qIGVzbGludCBuby11bmRlcnNjb3JlLWRhbmdsZTogMCwgc2VtaTogMCAqL1xuLy9cbi8vIFRyYWNrOmpzIHNldHVwXG4vL1xuLy8gVGhpcyBmaWxlIGlzIGluIHRoZSBzcmMvIGRpcmVjdG9yeSwgbWVhbmluZyBpdCBpcyBpbmNsdWRlZCBpbiBhcHAuanMuXG4vLyBIb3dldmVyIGl0IGlzIGFsc28gZXhwbGljaXRseSBpbmNsdWRlZCBpbiBsaWJzLmpzIHNvIHRoYXQgZXJyb3Jcbi8vIHRyYWNraW5nIGdldHMgc3RhcnRlZCBBU0FQLlxuLy9cbi8vIFRoZSBzbWFsbCBkdXBsaWNhdGlvbiBpcyBhIHRyYWRlLW9mZiBmb3IgdGhlIGhlYWRhY2hlIG9mIHB1dHRpbmcgYSAuanNcbi8vIGZpbGUgb3V0c2lkZSB0aGUgc3JjLyBkaXJlY3RvcnkuXG5pZiAobG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XG4gIHdpbmRvdy5fdHJhY2tKcyA9IHdpbmRvdy5fdHJhY2tKcyB8fCB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICB0b2tlbjogJ2JjOTUyZTcwNDRlMzRhMmU4NDIzZjc3N2I4YzgyNGJlJyxcbiAgICB2ZXJzaW9uOiBkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12ZXJzaW9uJylcbiAgfTtcbn0gZWxzZSB7XG4gIHdpbmRvdy5fdHJhY2tKcyA9IHdpbmRvdy5fdHJhY2tKcyB8fCB7XG4gICAgZW5hYmxlZDogZmFsc2VcbiAgfTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==