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
      console.log(' 📰  ' + this.pathToTemplate(pinpoint));
      this.body(this.pathToTemplate(pinpoint));
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
ko.components.originalRegister = ko.components.register;

ko.bindingHandlers.result = {
  init: function init(element, va) {
    var $e = $(element);
    var example = ko.unwrap(va());
    var registeredComponents = new Set();

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

    function fakeRegister(name, settings) {
      ko.components.originalRegister(name, settings);
      registeredComponents.add(name);
    }

    function clearComponentRegister() {
      registeredComponents.forEach(function (v) {
        return ko.components.unregister(v);
      });
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

      ko.components.register = fakeRegister;

      try {
        resetElement();
        clearComponentRegister();
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

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      clearComponentRegister();
    });

    return { controlsDescendantBindings: true };
  }
};
/* global setupEvents, Example, Documentation, API */
'use strict';

var appCacheUpdateCheckInterval = location.hostname === 'localhost' ? 2500 : 1000 * 60 * 15;

var nativeTemplating = ('content' in document.createElement('template'));

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== 'string') {
      console.error('Unable to get ' + uri + ':', html);
    } else {
      if (!nativeTemplating) {
        // Polyfill the <template> tag from the templates we load.
        // For a more involved polyfill, see e.g.
        //   http://jsfiddle.net/brianblakely/h3EmY/
        html = html.replace(/<\/?template/g, function (match) {
          if (match === '<template') {
            return '<script type=\'text/x-template\'';
          } else {
            return '</script';
          }
        });
      }

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
  var ac = window.applicationCache;
  if (ac.status === ac.IDLE) {
    ac.update();
  }
  setTimeout(reCheckApplicationCache, appCacheUpdateCheckInterval);
}

function checkForApplicationUpdate() {
  var ac = window.applicationCache;
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

function scrollToHash(anchor) {
  if (!anchor.hash) {
    $(window).scrollTop(0);
    return;
  }
  var target = document.getElementById(
  // We normalize the links – the docs use _ and - inconsistently and
  // seemingly interchangeably; we could go through and spot every difference
  // but this is just easier for now.
  anchor.hash.substring(1).replace(/_/g, '-'));
  if (!target) {
    throw new Error('Bad anchor: ' + anchor.hash + ' from ' + anchor.href);
  }
  // We defer until the layout is completed.
  setTimeout(function () {
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 150);
  }, 15);
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
    if ($root.body() !== templateId) {
      history.pushState(null, null, anchor.href);
      document.title = 'Knockout.js – ' + $(this).text();
      $root.open(templateId);
      $root.search.query('');
    }
    scrollToHash(anchor);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWVkaXQuanMiLCJiaW5kaW5ncy1oaWdobGlnaHQuanMiLCJiaW5kaW5ncy1yZXN1bHQuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVTSxHQUFHO0FBQ0ksV0FEUCxHQUFHLENBQ0ssSUFBSSxFQUFFOzBCQURkLEdBQUc7O0FBRUwsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7QUFDaEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakQ7O2VBVEcsR0FBRzs7V0FXQyxrQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLGtCQUFVLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxVQUFLLElBQUksQ0FBRTtLQUMxQzs7O1NBYkcsR0FBRzs7O0FBZ0JULEdBQUcsQ0FBQyxPQUFPLEdBQUcsbURBQW1ELENBQUE7O0FBR2pFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFB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R0FBRyxHQUFHLENBQ1gsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsMkRBQTJEO0FBQ2hFLE9BQUssRUFBRSxpRUFBaUU7Q0FDekUsRUFDRCxFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHVFQUF1RTtBQUM1RSxPQUFLLEVBQUUseUVBQXlFO0NBQ2pGLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBBUEkgY29udmVydHMgdGhlIGBvcGluZWAtZmxhdm91cmVkIGRvY3VtZW50YXRpb24gaGVyZS5cblxuIEhlcmUgaXMgYSBzYW1wbGU6XG4qL1xuLy8gLyotLS1cbi8vICBwdXJwb3NlOiBrbm9ja291dC13aWRlIHNldHRpbmdzXG4vLyAgKi9cbi8vIHZhciBzZXR0aW5ncyA9IHsgLyouLi4qLyB9XG5cbmNsYXNzIEFQSSB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGVcbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWVcbiAgICB0aGlzLnNvdXJjZSA9IHNwZWMuc291cmNlXG4gICAgdGhpcy5saW5lID0gc3BlYy5saW5lXG4gICAgdGhpcy5wdXJwb3NlID0gc3BlYy52YXJzLnB1cnBvc2VcbiAgICB0aGlzLnNwZWMgPSBzcGVjLnZhcnMucGFyYW1zXG4gICAgdGhpcy51cmwgPSB0aGlzLmJ1aWxkVXJsKHNwZWMuc291cmNlLCBzcGVjLmxpbmUpXG4gIH1cblxuICBidWlsZFVybChzb3VyY2UsIGxpbmUpIHtcbiAgICByZXR1cm4gYCR7QVBJLnVybFJvb3R9JHtzb3VyY2V9I0wke2xpbmV9YFxuICB9XG59XG5cbkFQSS51cmxSb290ID0gXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvYmxvYi9tYXN0ZXIvXCJcblxuXG5BUEkuaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuXG5BUEkuYWRkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGNvbnNvbGUubG9nKFwiVFwiLCB0b2tlbilcbiAgQVBJLml0ZW1zLnB1c2gobmV3IEFQSSh0b2tlbikpXG59XG4iLCJcbmNsYXNzIERvY3VtZW50YXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdGl0bGUsIGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMuc3ViY2F0ZWdvcnkgPSBzdWJjYXRlZ29yeVxuICB9XG59XG5cbkRvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcCA9IHtcbiAgMTogXCJHZXR0aW5nIHN0YXJ0ZWRcIixcbiAgMjogXCJPYnNlcnZhYmxlc1wiLFxuICAzOiBcIkJpbmRpbmdzIGFuZCBDb21wb25lbnRzXCIsXG4gIDQ6IFwiQmluZGluZ3MgaW5jbHVkZWRcIixcbiAgNTogXCJGdXJ0aGVyIGluZm9ybWF0aW9uXCJcbn1cblxuRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSA9IGZ1bmN0aW9uIChpLCBub2RlKSB7XG4gIHJldHVybiBuZXcgRG9jdW1lbnRhdGlvbihcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN1YmNhdCcpXG4gIClcbn1cblxuRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICBEb2N1bWVudGF0aW9uLmFsbCA9ICQubWFrZUFycmF5KFxuICAgICQoXCJbZGF0YS1raW5kPWRvY3VtZW50YXRpb25dXCIpLm1hcChEb2N1bWVudGF0aW9uLmZyb21Ob2RlKVxuICApXG59XG4iLCJcblxuY2xhc3MgRXhhbXBsZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlID0ge30pIHtcbiAgICB2YXIgZGVib3VuY2UgPSB7IHRpbWVvdXQ6IDUwMCwgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiIH1cbiAgICB0aGlzLmphdmFzY3JpcHQgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmphdmFzY3JpcHQpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmh0bWwgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmh0bWwpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmNzcyA9IHN0YXRlLmNzcyB8fCAnJ1xuXG4gICAgdGhpcy5maW5hbEphdmFzY3JpcHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5jb21wdXRlRmluYWxKcywgdGhpcylcbiAgfVxuXG4gIC8vIEFkZCBrby5hcHBseUJpbmRpbmdzIGFzIG5lZWRlZDsgcmV0dXJuIEVycm9yIHdoZXJlIGFwcHJvcHJpYXRlLlxuICBjb21wdXRlRmluYWxKcygpIHtcbiAgICB2YXIganMgPSB0aGlzLmphdmFzY3JpcHQoKVxuICAgIGlmICghanMpIHsgcmV0dXJuIG5ldyBFcnJvcihcIlRoZSBzY3JpcHQgaXMgZW1wdHkuXCIpIH1cbiAgICBpZiAoanMuaW5kZXhPZigna28uYXBwbHlCaW5kaW5ncygnKSA9PT0gLTEpIHtcbiAgICAgIGlmIChqcy5pbmRleE9mKCcgdmlld01vZGVsID0nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2UgZ3Vlc3MgdGhlIHZpZXdNb2RlbCBuYW1lIC4uLlxuICAgICAgICByZXR1cm4gYCR7anN9XFxuXFxuLyogQXV0b21hdGljYWxseSBBZGRlZCAqL1xuICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsKTtgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5ncyh2aWV3KSBpcyBub3QgY2FsbGVkXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc1xuICB9XG59XG5cbkV4YW1wbGUuc3RhdGVNYXAgPSBuZXcgTWFwKClcblxuRXhhbXBsZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgc3RhdGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoIXN0YXRlKSB7XG4gICAgc3RhdGUgPSBuZXcgRXhhbXBsZShuYW1lKVxuICAgIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIHN0YXRlKVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuXG5cbkV4YW1wbGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKGV4YW1wbGUpIHtcbiAgICBleGFtcGxlLmphdmFzY3JpcHQoc3RhdGUuamF2YXNjcmlwdClcbiAgICBleGFtcGxlLmh0bWwoc3RhdGUuaHRtbClcbiAgICByZXR1cm5cbiAgfVxuICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBuZXcgRXhhbXBsZShzdGF0ZSkpXG59XG4iLCIvKmdsb2JhbHMgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwLCBjYW1lbGNhc2U6MCovXG5cbnZhciBFWFRFUk5BTF9JTkNMVURFUyA9IFtcbiAgXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIixcbiAgXCJodHRwczovL2Nkbi5yYXdnaXQuY29tL21iZXN0L2tub2Nrb3V0LnB1bmNoZXMvdjAuNS4xL2tub2Nrb3V0LnB1bmNoZXMuanNcIlxuXVxuXG5jbGFzcyBMaXZlRXhhbXBsZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMuaWQpIHtcbiAgICAgIHRoaXMuZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcChwYXJhbXMuaWQpKVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmJhc2U2NCkge1xuICAgICAgdmFyIG9wdHMgPVxuICAgICAgdGhpcy5leGFtcGxlID0gbmV3IEV4YW1wbGUoSlNPTi5wYXJzZShhdG9iKHBhcmFtcy5iYXNlNjQpKSlcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4YW1wbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4YW1wbGUgbXVzdCBiZSBwcm92aWRlZCBieSBpZCBvciBiYXNlNjQgcGFyYW1ldGVyXCIpXG4gICAgfVxuICB9XG5cbiAgb3BlbkNvbW1vblNldHRpbmdzKCkge1xuICAgIHZhciBleCA9IHRoaXMuZXhhbXBsZVxuICAgIHZhciBkYXRlZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgIHZhciBqc1ByZWZpeCA9IGAvKipcbiAqIENyZWF0ZWQgZnJvbSBhbiBleGFtcGxlIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlYCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlZCBvbiAke2RhdGVkfWBcbiAgICB9XG4gIH1cblxuICBvcGVuRmlkZGxlKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2RvYy5qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QuaHRtbFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBkdGQ6IFwiSFRNTCA1XCIsXG4gICAgICB3cmFwOiAnbCcsXG4gICAgICByZXNvdXJjZXM6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCIsXCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZm9ybSA9ICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QvbGlicmFyeS9wdXJlL1wiXG4gICAgICBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8L2Zvcm0+YClcbiAgICAkLmVhY2goZmllbGRzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBmb3JtLmFwcGVuZChcbiAgICAgICAgJChgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nJHtrfSc+YCkudmFsKHYpXG4gICAgICApXG4gICAgfSlcblxuICAgIGZvcm0uc3VibWl0KClcbiAgfVxuXG4gIG9wZW5QZW4oc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vYmxvZy5jb2RlcGVuLmlvL2RvY3VtZW50YXRpb24vYXBpL3ByZWZpbGwvXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgb3B0cyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBqc19leHRlcm5hbDogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIjtcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkob3B0cylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIilcblxuICAgICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9jb2RlcGVuLmlvL3Blbi9kZWZpbmVcIiBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdkYXRhJyB2YWx1ZT0nJHtkYXRhU3RyfScvPlxuICAgIDwvZm9ybT5gKS5zdWJtaXQoKVxuICB9XG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xpdmUtZXhhbXBsZScsIHtcbiAgICB2aWV3TW9kZWw6IExpdmVFeGFtcGxlQ29tcG9uZW50LFxuICAgIHRlbXBsYXRlOiB7ZWxlbWVudDogXCJsaXZlLWV4YW1wbGVcIn1cbn0pXG4iLCIvKmdsb2JhbCBQYWdlLCBEb2N1bWVudGF0aW9uLCBtYXJrZWQsIFNlYXJjaCwgUGx1Z2luTWFuYWdlciAqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmJvZHkuc3Vic2NyaWJlKHRoaXMub25Cb2R5Q2hhbmdlLCB0aGlzKVxuXG4gICAgLy8gLS0tIGZvb3RlciBsaW5rcy9jZG4gLS0tXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuXG4gICAgLy8gLS0tIHBsdWdpbnMgLS0tXG4gICAgdGhpcy5wbHVnaW5zID0gbmV3IFBsdWdpbk1hbmFnZXIoKVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuXG4gICAgLy8gLS0tIHBhZ2UgbG9hZGluZyBzdGF0dXMgLS0tXG4gICAgLy8gYXBwbGljYXRpb25DYWNoZSBwcm9ncmVzc1xuICAgIHRoaXMucmVsb2FkUHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmNhY2hlSXNVcGRhdGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSlcblxuICAgIC8vIHBhZ2UgbG9hZGluZyBlcnJvclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICAvLyBQcmVmZXJlbmNlIGZvciBub24tU2luZ2xlIFBhZ2UgQXBwXG4gICAgdmFyIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMubm9TUEEgPSBrby5vYnNlcnZhYmxlKEJvb2xlYW4obHMgJiYgbHMuZ2V0SXRlbSgnbm9TUEEnKSkpXG4gICAgdGhpcy5ub1NQQS5zdWJzY3JpYmUoKHYpID0+IGxzICYmIGxzLnNldEl0ZW0oJ25vU1BBJywgdiB8fCBcIlwiKSlcbiAgfVxuXG4gIHBhdGhUb1RlbXBsYXRlKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpLnBvcCgpLnJlcGxhY2UoJy5odG1sJywgJycpXG4gIH1cblxuICBvcGVuKHBpbnBvaW50KSB7XG4gICAgY29uc29sZS5sb2coXCIg8J+TsCAgXCIgKyB0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgICB0aGlzLmJvZHkodGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gIH1cblxuICBvbkJvZHlDaGFuZ2UodGVtcGxhdGVJZCkge1xuICAgIGlmICh0ZW1wbGF0ZUlkKSB7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICB0aGlzLnBsdWdpbnMucmVnaXN0ZXIocGx1Z2lucylcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBbMiwge1widmFyc1wiOiBcImxvY2FsXCJ9XSovXG5cbmNsYXNzIFBsdWdpbk1hbmFnZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wbHVnaW5SZXBvcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG4gICAgdGhpcy5zb3J0ZWRQbHVnaW5SZXBvcyA9IHRoaXMucGx1Z2luUmVwb3NcbiAgICAgIC5maWx0ZXIodGhpcy5maWx0ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5zb3J0QnkodGhpcy5zb3J0QnkuYmluZCh0aGlzKSlcbiAgICAgIC5tYXAodGhpcy5uYW1lVG9JbnN0YW5jZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLm5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcbiAgfVxuXG4gIHJlZ2lzdGVyKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgZmlsdGVyKHJlcG8pIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luc0xvYWRlZCgpKSB7IHJldHVybiBmYWxzZSB9XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLm5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBzb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG5cbiAgbmFtZVRvSW5zdGFuY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hcC5nZXQobmFtZSlcbiAgfVxufVxuIiwiXG5jbGFzcyBTZWFyY2hSZXN1bHQge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMubGluayA9IGAvYS8ke3RlbXBsYXRlLmlkfS5odG1sYFxuICAgIHRoaXMudGl0bGUgPSB0ZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCBg4oCcJHt0ZW1wbGF0ZS5pZH3igJ1gXG4gIH1cbn1cblxuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgc2VhcmNoUmF0ZSA9IHtcbiAgICAgIHRpbWVvdXQ6IDUwMCxcbiAgICAgIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIlxuICAgIH1cbiAgICB0aGlzLnF1ZXJ5ID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBzZWFyY2hSYXRlfSlcbiAgICB0aGlzLnJlc3VsdHMgPSBrby5jb21wdXRlZCh0aGlzLmNvbXB1dGVSZXN1bHRzLCB0aGlzKVxuICAgIHRoaXMucXVlcnkuc3Vic2NyaWJlKHRoaXMub25RdWVyeUNoYW5nZSwgdGhpcylcbiAgICB0aGlzLnByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gIH1cblxuICBjb21wdXRlUmVzdWx0cygpIHtcbiAgICB2YXIgcSA9ICh0aGlzLnF1ZXJ5KCkgfHwgJycpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBbXSB9XG4gICAgcmV0dXJuICQoYHRlbXBsYXRlYClcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzLmNvbnRlbnQpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG5cbiAgc2F2ZVRlbXBsYXRlKCkge1xuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09ICdzZWFyY2gnKSB7XG4gICAgICB0aGlzLnNhdmVkVGVtcGxhdGUgPSAkcm9vdC5ib2R5KClcbiAgICAgIHRoaXMuc2F2ZWRUaXRsZSA9IGRvY3VtZW50LnRpdGxlXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVRlbXBsYXRlKCkge1xuICAgIGlmICh0aGlzLnNhdmVkVGl0bGUpIHtcbiAgICAgICRyb290LmJvZHkodGhpcy5zYXZlZFRlbXBsYXRlKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLnNhdmVkVGl0bGVcbiAgICB9XG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKCkge1xuICAgIGlmICghKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpKSB7XG4gICAgICB0aGlzLnJlc3RvcmVUZW1wbGF0ZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zYXZlVGVtcGxhdGUoKVxuICAgICRyb290LmJvZHkoXCJzZWFyY2hcIilcbiAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgU2VhcmNoIOKAnCR7dGhpcy5xdWVyeSgpfeKAnWBcbiAgfVxufVxuIiwiXG52YXIgbGFuZ3VhZ2VUaGVtZU1hcCA9IHtcbiAgaHRtbDogJ3NvbGFyaXplZF9kYXJrJyxcbiAgamF2YXNjcmlwdDogJ21vbm9rYWknXG59XG5cbmZ1bmN0aW9uIHNldHVwRWRpdG9yKGVsZW1lbnQsIGxhbmd1YWdlLCBleGFtcGxlTmFtZSkge1xuICB2YXIgZXhhbXBsZSA9IGtvLnVud3JhcChleGFtcGxlTmFtZSlcbiAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke2xhbmd1YWdlVGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiB0cnVlLFxuICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZXM6IDMsXG4gICAgbWF4TGluZXM6IDMwLFxuICAgIHdyYXA6IHRydWVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBleGFtcGxlW2xhbmd1YWdlXShlZGl0b3IuZ2V0VmFsdWUoKSkgfSlcbiAgZXhhbXBsZVtsYW5ndWFnZV0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGVkaXRvci5nZXRWYWx1ZSgpICE9PSB2KSB7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodilcbiAgICB9XG4gIH0pXG4gIGVkaXRvci5zZXRWYWx1ZShleGFtcGxlW2xhbmd1YWdlXSgpKVxuICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIHJldHVybiBlZGl0b3Jcbn1cblxuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFyc1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtanMnXSA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSlcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG4iLCJcblxudmFyIHJlYWRvbmx5VGhlbWVNYXAgPSB7XG4gIGh0bWw6IFwic29sYXJpemVkX2xpZ2h0XCIsXG4gIGphdmFzY3JpcHQ6IFwidG9tb3Jyb3dcIlxufVxuXG52YXIgZW1hcCA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8J1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFxuICAgIC8mYW1wO3wmbHQ7L2csXG4gICAgZnVuY3Rpb24gKGVudCkgeyByZXR1cm4gZW1hcFtlbnRdfVxuICApXG59XG5cbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDEsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDM1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tbmV3LWZ1bmM6IDAgKi9cblxuLy8gU2F2ZSBhIGNvcHkgZm9yIHJlc3RvcmF0aW9uL3VzZVxua28ub3JpZ2luYWxBcHBseUJpbmRpbmdzID0ga28uYXBwbHlCaW5kaW5nc1xua28uY29tcG9uZW50cy5vcmlnaW5hbFJlZ2lzdGVyID0ga28uY29tcG9uZW50cy5yZWdpc3RlclxuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgZXhhbXBsZSA9IGtvLnVud3JhcCh2YSgpKVxuICAgIHZhciByZWdpc3RlcmVkQ29tcG9uZW50cyA9IG5ldyBTZXQoKVxuXG4gICAgZnVuY3Rpb24gcmVzZXRFbGVtZW50KCkge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5bMF0pIHtcbiAgICAgICAga28uY2xlYW5Ob2RlKGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG4gICAgICAkZS5lbXB0eSgpLmFwcGVuZChgPGRpdiBjbGFzcz0nZXhhbXBsZSAke2V4YW1wbGUuY3NzfSc+YClcbiAgICB9XG4gICAgcmVzZXRFbGVtZW50KClcblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IobXNnKSB7XG4gICAgICAkKGVsZW1lbnQpXG4gICAgICAgIC5odG1sKGA8ZGl2IGNsYXNzPSdlcnJvcic+RXJyb3I6ICR7bXNnfTwvZGl2PmApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmFrZVJlZ2lzdGVyKG5hbWUsIHNldHRpbmdzKSB7XG4gICAgICBrby5jb21wb25lbnRzLm9yaWdpbmFsUmVnaXN0ZXIobmFtZSwgc2V0dGluZ3MpXG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50cy5hZGQobmFtZSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKCkge1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuZm9yRWFjaCgodikgPT4ga28uY29tcG9uZW50cy51bnJlZ2lzdGVyKHYpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICB2YXIgc2NyaXB0ID0gZXhhbXBsZS5maW5hbEphdmFzY3JpcHQoKVxuICAgICAgdmFyIGh0bWwgPSBleGFtcGxlLmh0bWwoKVxuXG4gICAgICBpZiAoc2NyaXB0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihzY3JpcHQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWh0bWwpIHtcbiAgICAgICAgb25FcnJvcihcIlRoZXJlJ3Mgbm8gSFRNTCB0byBiaW5kIHRvLlwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFN0dWIga28uYXBwbHlCaW5kaW5nc1xuICAgICAga28uYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIFdlIGlnbm9yZSB0aGUgYG5vZGVgIGFyZ3VtZW50IGluIGZhdm91ciBvZiB0aGUgZXhhbXBsZXMnIG5vZGUuXG4gICAgICAgIGtvLm9yaWdpbmFsQXBwbHlCaW5kaW5ncyhlLCBlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuXG4gICAgICBrby5jb21wb25lbnRzLnJlZ2lzdGVyID0gZmFrZVJlZ2lzdGVyXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc2V0RWxlbWVudCgpXG4gICAgICAgIGNsZWFyQ29tcG9uZW50UmVnaXN0ZXIoKVxuICAgICAgICAkKGVsZW1lbnQuY2hpbGRyZW5bMF0pLmh0bWwoaHRtbClcbiAgICAgICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKCdub2RlJywgc2NyaXB0KVxuICAgICAgICBrby5pZ25vcmVEZXBlbmRlbmNpZXMoZm4sIG51bGwsIFtlbGVtZW50LmNoaWxkcmVuWzBdXSlcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBvbkVycm9yKGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAga28uY29tcHV0ZWQoe1xuICAgICAgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50LFxuICAgICAgcmVhZDogcmVmcmVzaFxuICAgIH0pXG5cbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsZWFyQ29tcG9uZW50UmVnaXN0ZXIoKVxuICAgIH0pXG5cbiAgICByZXR1cm4ge2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlfVxuICB9XG59XG4iLCIvKiBnbG9iYWwgc2V0dXBFdmVudHMsIEV4YW1wbGUsIERvY3VtZW50YXRpb24sIEFQSSAqL1xudmFyIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbCA9IGxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0JyA/IDI1MDAgOiAoMTAwMCAqIDYwICogMTUpXG5cbnZhciBuYXRpdmVUZW1wbGF0aW5nID0gJ2NvbnRlbnQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcblxuXG5mdW5jdGlvbiBsb2FkSHRtbCh1cmkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgodXJpKSlcbiAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBnZXQgJHt1cml9OmAsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW5hdGl2ZVRlbXBsYXRpbmcpIHtcbiAgICAgICAgICAvLyBQb2x5ZmlsbCB0aGUgPHRlbXBsYXRlPiB0YWcgZnJvbSB0aGUgdGVtcGxhdGVzIHdlIGxvYWQuXG4gICAgICAgICAgLy8gRm9yIGEgbW9yZSBpbnZvbHZlZCBwb2x5ZmlsbCwgc2VlIGUuZy5cbiAgICAgICAgICAvLyAgIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvYnJpYW5ibGFrZWx5L2gzRW1ZL1xuICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxcXC8/dGVtcGxhdGUvZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoID09PSBcIjx0ZW1wbGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHNjcmlwdCB0eXBlPSd0ZXh0L3gtdGVtcGxhdGUnXCJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI8L3NjcmlwdFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkKGA8ZGl2IGlkPSd0ZW1wbGF0ZXMtLSR7dXJpfSc+YClcbiAgICAgICAgICAuYXBwZW5kKGh0bWwpXG4gICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpXG4gICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKCdidWlsZC90ZW1wbGF0ZXMuaHRtbCcpXG59XG5cbmZ1bmN0aW9uIGxvYWRNYXJrZG93bigpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKFwiYnVpbGQvbWFya2Rvd24uaHRtbFwiKVxufVxuXG5cbmZ1bmN0aW9uIHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlKCkge1xuICB2YXIgYWMgPSB3aW5kb3cuYXBwbGljYXRpb25DYWNoZVxuICBpZiAoYWMuc3RhdHVzID09PSBhYy5JRExFKSB7IGFjLnVwZGF0ZSgpIH1cbiAgc2V0VGltZW91dChyZUNoZWNrQXBwbGljYXRpb25DYWNoZSwgYXBwQ2FjaGVVcGRhdGVDaGVja0ludGVydmFsKVxufVxuXG5mdW5jdGlvbiBjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKCkge1xuICB2YXIgYWMgPSB3aW5kb3cuYXBwbGljYXRpb25DYWNoZVxuICBpZiAoIWFjKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKSB9XG4gIGFjLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICB3aW5kb3cuJHJvb3QucmVsb2FkUHJvZ3Jlc3MoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGZhbHNlKVxuICAgIH1cbiAgfSwgZmFsc2UpXG4gIGFjLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5JywgZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy4kcm9vdC5jYWNoZUlzVXBkYXRlZCh0cnVlKVxuICB9KVxuICBpZiAoYWMuc3RhdHVzID09PSBhYy5VUERBVEVSRUFEWSkge1xuICAgIC8vIFJlbG9hZCB0aGUgcGFnZSBpZiB3ZSBhcmUgc3RpbGwgaW5pdGlhbGl6aW5nIGFuZCBhbiB1cGRhdGUgaXMgcmVhZHkuXG4gICAgbG9jYXRpb24ucmVsb2FkKClcbiAgfVxuICByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxufVxuXG5cbmZ1bmN0aW9uIGdldEV4YW1wbGVzKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvZXhhbXBsZXMuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICBPYmplY3Qua2V5cyhyZXN1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgc2V0dGluZyA9IHJlc3VsdHNbbmFtZV1cbiAgICAgIEV4YW1wbGUuc2V0KHNldHRpbmcuaWQgfHwgbmFtZSwgc2V0dGluZylcbiAgICB9KVxuICApXG59XG5cblxuZnVuY3Rpb24gbG9hZEFQSSgpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2FwaS5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIHJlc3VsdHMuYXBpLmZvckVhY2goZnVuY3Rpb24gKGFwaUZpbGVMaXN0KSB7XG4gICAgICAvLyBXZSBlc3NlbnRpYWxseSBoYXZlIHRvIGZsYXR0ZW4gdGhlIGFwaSAoRklYTUUpXG4gICAgICBhcGlGaWxlTGlzdC5mb3JFYWNoKEFQSS5hZGQpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGdldFBsdWdpbnMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9wbHVnaW5zLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+ICRyb290LnJlZ2lzdGVyUGx1Z2lucyhyZXN1bHRzKSlcbn1cblxuXG5mdW5jdGlvbiBhcHBseUJpbmRpbmdzKCkge1xuICBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG4gIHdpbmRvdy4kcm9vdCA9IG5ldyBQYWdlKClcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICBrby5hcHBseUJpbmRpbmdzKHdpbmRvdy4kcm9vdClcbn1cblxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICBpZiAobG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignLmh0bWwnKSA9PT0gLTEpIHtcbiAgICB3aW5kb3cuJHJvb3Qub3BlbihcImludHJvXCIpXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgUHJvbWlzZS5hbGwoW2xvYWRUZW1wbGF0ZXMoKSwgbG9hZE1hcmtkb3duKCldKVxuICAgIC50aGVuKERvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSlcbiAgICAudGhlbihhcHBseUJpbmRpbmdzKVxuICAgIC50aGVuKGdldEV4YW1wbGVzKVxuICAgIC50aGVuKGxvYWRBUEkpXG4gICAgLnRoZW4oZ2V0UGx1Z2lucylcbiAgICAudGhlbihzZXR1cEV2ZW50cylcbiAgICAudGhlbihjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKVxuICAgIC50aGVuKHBhZ2VMb2FkZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5ib2R5KFwiZXJyb3JcIilcbiAgICAgIHdpbmRvdy4kcm9vdC5lcnJvck1lc3NhZ2UoZXJyLm1lc3NhZ2UgfHwgZXJyKVxuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgfSlcbn1cblxuJChzdGFydClcbiIsIi8qZ2xvYmFsIHNldHVwRXZlbnRzKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCAqL1xuXG5mdW5jdGlvbiBpc0xvY2FsKGFuY2hvcikge1xuICByZXR1cm4gKGxvY2F0aW9uLnByb3RvY29sID09PSBhbmNob3IucHJvdG9jb2wgJiZcbiAgICAgICAgICBsb2NhdGlvbi5ob3N0ID09PSBhbmNob3IuaG9zdClcbn1cblxuLy8gTWFrZSBzdXJlIGluIG5vbi1zaW5nbGUtcGFnZS1hcHAgbW9kZSB0aGF0IHdlIGxpbmsgdG8gdGhlIHJpZ2h0IHJlbGF0aXZlXG4vLyBsaW5rLlxudmFyIGFuY2hvclJvb3QgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9hXFwvLipcXC5odG1sLywgJycpXG5mdW5jdGlvbiByZXdyaXRlQW5jaG9yUm9vdChldnQpIHtcbiAgdmFyIGFuY2hvciA9IGV2dC5jdXJyZW50VGFyZ2V0XG4gIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gIC8vIFNraXAgbm9uLWxvY2FsIHVybHMuXG4gIGlmICghaXNMb2NhbChhbmNob3IpKSB7IHJldHVybiB0cnVlIH1cbiAgLy8gQWxyZWFkeSByZS1yb290ZWRcbiAgaWYgKGFuY2hvci5wYXRobmFtZS5pbmRleE9mKGFuY2hvclJvb3QpID09PSAwKSB7IHJldHVybiB0cnVlIH1cbiAgYW5jaG9yLnBhdGhuYW1lID0gYCR7YW5jaG9yUm9vdH0ke2FuY2hvci5wYXRobmFtZX1gLnJlcGxhY2UoJy8vJywgJy8nKVxuICByZXR1cm4gdHJ1ZVxufVxuXG5cbmZ1bmN0aW9uIHNjcm9sbFRvSGFzaChhbmNob3IpIHtcbiAgaWYgKCFhbmNob3IuaGFzaCkge1xuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgLy8gV2Ugbm9ybWFsaXplIHRoZSBsaW5rcyDigJMgdGhlIGRvY3MgdXNlIF8gYW5kIC0gaW5jb25zaXN0ZW50bHkgYW5kXG4gICAgLy8gc2VlbWluZ2x5IGludGVyY2hhbmdlYWJseTsgd2UgY291bGQgZ28gdGhyb3VnaCBhbmQgc3BvdCBldmVyeSBkaWZmZXJlbmNlXG4gICAgLy8gYnV0IHRoaXMgaXMganVzdCBlYXNpZXIgZm9yIG5vdy5cbiAgICBhbmNob3IuaGFzaC5zdWJzdHJpbmcoMSkucmVwbGFjZSgvXy9nLCAnLScpXG4gIClcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEJhZCBhbmNob3I6ICR7YW5jaG9yLmhhc2h9IGZyb20gJHthbmNob3IuaHJlZn1gKVxuICB9XG4gIC8vIFdlIGRlZmVyIHVudGlsIHRoZSBsYXlvdXQgaXMgY29tcGxldGVkLlxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcFxuICAgIH0sIDE1MClcbiAgfSwgMTUpXG59XG5cbi8vXG4vLyBGb3IgSlMgaGlzdG9yeSBzZWU6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4vL1xuZnVuY3Rpb24gb25BbmNob3JDbGljayhldnQpIHtcbiAgdmFyIGFuY2hvciA9IHRoaXNcbiAgcmV3cml0ZUFuY2hvclJvb3QoZXZ0KVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG5cbiAgLy8gRG8gbm90IGludGVyY2VwdCBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChhbmNob3IpLnBhcmVudHMoXCJsaXZlLWV4YW1wbGVcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHRlbXBsYXRlSWQgPSAkcm9vdC5wYXRoVG9UZW1wbGF0ZShhbmNob3IucGF0aG5hbWUpXG4gICAgLy8gSWYgdGhlIHRlbXBsYXRlIGlzbid0IGZvdW5kLCBwcmVzdW1lIGEgaGFyZCBsaW5rXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gdGVtcGxhdGVJZCkge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLmhyZWYpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgJHskKHRoaXMpLnRleHQoKX1gXG4gICAgICAkcm9vdC5vcGVuKHRlbXBsYXRlSWQpXG4gICAgICAkcm9vdC5zZWFyY2gucXVlcnkoJycpXG4gICAgfVxuICAgIHNjcm9sbFRvSGFzaChhbmNob3IpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKGBFcnJvci8ke2FuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5cbmZ1bmN0aW9uIG9uUG9wU3RhdGUoLyogZXZ0ICovKSB7XG4gIC8vIE5vdGUgaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gfVxuICAkcm9vdC5vcGVuKGxvY2F0aW9uLnBhdGhuYW1lKVxufVxuXG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRzKCkge1xuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcbiAgICAkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbiAgfSBlbHNlIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIHJld3JpdGVBbmNob3JSb290KVxuICB9XG59XG4iLCJcbndpbmRvdy5saW5rcyA9IFtcbiAgeyBocmVmOiBcImh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFmb3J1bS9rbm9ja291dGpzXCIsXG4gICAgdGl0bGU6IFwiR29vZ2xlIEdyb3Vwc1wiLFxuICAgIGljb246IFwiZmEtZ29vZ2xlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3RhZ3Mva25vY2tvdXQuanMvaW5mb1wiLFxuICAgIHRpdGxlOiBcIlN0YWNrT3ZlcmZsb3dcIixcbiAgICBpY29uOiBcImZhLXN0YWNrLW92ZXJmbG93XCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdHRlci5pbS9rbm9ja291dC9rbm9ja291dCcsXG4gICAgdGl0bGU6IFwiR2l0dGVyXCIsXG4gICAgaWNvbjogXCJmYS1jb21tZW50cy1vXCJ9LFxuICB7IGhyZWY6ICdsZWdhY3kvJyxcbiAgICB0aXRsZTogXCJMZWdhY3kgd2Vic2l0ZVwiLFxuICAgIGljb246IFwiZmEgZmEtaGlzdG9yeVwifVxuXVxuXG53aW5kb3cuZ2l0aHViTGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIklzc3Vlc1wiLFxuICAgIGljb246IFwiZmEtZXhjbGFtYXRpb24tY2lyY2xlXCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvcmVsZWFzZXMnLFxuICAgIHRpdGxlOiBcIlJlbGVhc2VzXCIsXG4gICAgaWNvbjogXCJmYS1jZXJ0aWZpY2F0ZVwifVxuXVxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0IENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmUgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1kZWJ1Zy5qc1wiXG4gIH1cbl1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==