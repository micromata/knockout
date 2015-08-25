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
//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//
'use strict';

var animatedHideProps = {
  marginLeft: '100%',
  width: '100%',
  overflow: 'hidden'
};

var animatedShowProps = {
  marginLeft: 0
};

ko.bindingHandlers.animatedTemplate = {
  init: function init(element, valueAccessor, ign1, ign2, bindingContext) {
    var $element = $(element);
    var obs = valueAccessor();

    var onTemplateChange = function onTemplateChange(templateId_) {
      var templateId = (templateId_ || '').replace('#', '');
      var templateNode = document.getElementById(templateId);
      if (!templateId) {
        $element.empty();
      } else if (!templateNode) {
        throw new Error('Cannot find template by id: ' + templateId);
      } else {
        $element.stop().animate(animatedHideProps, {
          duration: 180,
          complete: function complete() {
            $element.css('margin-left', '-100%');
            $element.html($(templateNode).html());
            ko.applyBindingsToDescendants(bindingContext, element);
          }
        }).animate(animatedShowProps, { duration: 180 });
      }
    };

    var subs = obs.subscribe(onTemplateChange);
    onTemplateChange(ko.unwrap(obs));

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      subs.dispose();
    });

    return { controlsDescendantBindings: true };
  }
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJzZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBVU0sR0FBRztBQUNJLFdBRFAsR0FBRyxDQUNLLElBQUksRUFBRTswQkFEZCxHQUFHOztBQUVMLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDNUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pEOztlQVRHLEdBQUc7O1dBV0Msa0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNyQixrQkFBVSxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sVUFBSyxJQUFJLENBQUU7S0FDMUM7OztTQWJHLEdBQUc7OztBQWdCVCxHQUFHLENBQUMsT0FBTyxHQUFHLG1EQUFtRCxDQUFB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QUFDdEIsTUFBSSxFQUFFLG1CQUFtQixFQUFDLEVBQzVCLEVBQUUsSUFBSSxFQUFFLHFDQUFxQztBQUMzQyxPQUFLLEVBQUUsUUFBUTtBQUNmLE1BQUksRUFBRSxlQUFlLEVBQUMsRUFDeEIsRUFBRSxJQUFJLEVBQUUsU0FBUztBQUNmLE9BQUssRUFBRSxnQkFBZ0I7QUFDdkIsTUFBSSxFQUFFLGVBQWUsRUFBQyxDQUN6QixDQUFBOztBQUVELE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FDbkIsRUFBRSxJQUFJLEVBQUUsc0NBQXNDO0FBQzVDLE9BQUssRUFBRSxZQUFZO0FBQ25CLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsOENBQThDO0FBQ3BELE9BQUssRUFBRSxRQUFRO0FBQ2YsTUFBSSxFQUFFLHVCQUF1QixFQUFDLEVBQ2hDLEVBQUUsSUFBSSxFQUFFLCtDQUErQztBQUNyRCxPQUFLLEVBQUUsVUFBVTtBQUNqQixNQUFJLEVBQUUsZ0JBQWdCLEVBQUMsQ0FDMUIsQ0FBQTs7QUFFRCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQ1gsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsMkRBQTJEO0FBQ2hFLE9BQUssRUFBRSxpRUFBaUU7Q0FDekUsRUFDRCxFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHVFQUF1RTtBQUM1RSxPQUFLLEVBQUUseUVBQXlFO0NBQ2pGLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBBUEkgY29udmVydHMgdGhlIGBvcGluZWAtZmxhdm91cmVkIGRvY3VtZW50YXRpb24gaGVyZS5cblxuIEhlcmUgaXMgYSBzYW1wbGU6XG4qL1xuLy8gLyotLS1cbi8vICBwdXJwb3NlOiBrbm9ja291dC13aWRlIHNldHRpbmdzXG4vLyAgKi9cbi8vIHZhciBzZXR0aW5ncyA9IHsgLyouLi4qLyB9XG5cbmNsYXNzIEFQSSB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGVcbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWVcbiAgICB0aGlzLnNvdXJjZSA9IHNwZWMuc291cmNlXG4gICAgdGhpcy5saW5lID0gc3BlYy5saW5lXG4gICAgdGhpcy5wdXJwb3NlID0gc3BlYy52YXJzLnB1cnBvc2VcbiAgICB0aGlzLnNwZWMgPSBzcGVjLnZhcnMucGFyYW1zXG4gICAgdGhpcy51cmwgPSB0aGlzLmJ1aWxkVXJsKHNwZWMuc291cmNlLCBzcGVjLmxpbmUpXG4gIH1cblxuICBidWlsZFVybChzb3VyY2UsIGxpbmUpIHtcbiAgICByZXR1cm4gYCR7QVBJLnVybFJvb3R9JHtzb3VyY2V9I0wke2xpbmV9YFxuICB9XG59XG5cbkFQSS51cmxSb290ID0gXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvYmxvYi9tYXN0ZXIvXCJcblxuXG5BUEkuaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuXG5BUEkuYWRkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGNvbnNvbGUubG9nKFwiVFwiLCB0b2tlbilcbiAgQVBJLml0ZW1zLnB1c2gobmV3IEFQSSh0b2tlbikpXG59XG4iLCJcbmNsYXNzIERvY3VtZW50YXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdGl0bGUsIGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMuc3ViY2F0ZWdvcnkgPSBzdWJjYXRlZ29yeVxuICB9XG59XG5cbkRvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcCA9IHtcbiAgMTogXCJHZXR0aW5nIHN0YXJ0ZWRcIixcbiAgMjogXCJPYnNlcnZhYmxlc1wiLFxuICAzOiBcIkJpbmRpbmdzIGFuZCBDb21wb25lbnRzXCIsXG4gIDQ6IFwiQmluZGluZ3MgaW5jbHVkZWRcIixcbiAgNTogXCJGdXJ0aGVyIGluZm9ybWF0aW9uXCJcbn1cblxuRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSA9IGZ1bmN0aW9uIChpLCBub2RlKSB7XG4gIHJldHVybiBuZXcgRG9jdW1lbnRhdGlvbihcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN1YmNhdCcpXG4gIClcbn1cblxuRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICBEb2N1bWVudGF0aW9uLmFsbCA9ICQubWFrZUFycmF5KFxuICAgICQoXCJbZGF0YS1raW5kPWRvY3VtZW50YXRpb25dXCIpLm1hcChEb2N1bWVudGF0aW9uLmZyb21Ob2RlKVxuICApXG59XG4iLCJcblxuY2xhc3MgRXhhbXBsZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlID0ge30pIHtcbiAgICB2YXIgZGVib3VuY2UgPSB7IHRpbWVvdXQ6IDUwMCwgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiIH1cbiAgICB0aGlzLmphdmFzY3JpcHQgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmphdmFzY3JpcHQpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmh0bWwgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmh0bWwpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmNzcyA9IHN0YXRlLmNzcyB8fCAnJ1xuXG4gICAgdGhpcy5maW5hbEphdmFzY3JpcHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5jb21wdXRlRmluYWxKcywgdGhpcylcbiAgfVxuXG4gIC8vIEFkZCBrby5hcHBseUJpbmRpbmdzIGFzIG5lZWRlZDsgcmV0dXJuIEVycm9yIHdoZXJlIGFwcHJvcHJpYXRlLlxuICBjb21wdXRlRmluYWxKcygpIHtcbiAgICB2YXIganMgPSB0aGlzLmphdmFzY3JpcHQoKVxuICAgIGlmICghanMpIHsgcmV0dXJuIG5ldyBFcnJvcihcIlRoZSBzY3JpcHQgaXMgZW1wdHkuXCIpIH1cbiAgICBpZiAoanMuaW5kZXhPZigna28uYXBwbHlCaW5kaW5ncygnKSA9PT0gLTEpIHtcbiAgICAgIGlmIChqcy5pbmRleE9mKCcgdmlld01vZGVsID0nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2UgZ3Vlc3MgdGhlIHZpZXdNb2RlbCBuYW1lIC4uLlxuICAgICAgICByZXR1cm4gYCR7anN9XFxuXFxuLyogQXV0b21hdGljYWxseSBBZGRlZCAqL1xuICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsKTtgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5ncyh2aWV3KSBpcyBub3QgY2FsbGVkXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc1xuICB9XG59XG5cbkV4YW1wbGUuc3RhdGVNYXAgPSBuZXcgTWFwKClcblxuRXhhbXBsZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgc3RhdGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoIXN0YXRlKSB7XG4gICAgc3RhdGUgPSBuZXcgRXhhbXBsZShuYW1lKVxuICAgIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIHN0YXRlKVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuXG5cbkV4YW1wbGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKGV4YW1wbGUpIHtcbiAgICBleGFtcGxlLmphdmFzY3JpcHQoc3RhdGUuamF2YXNjcmlwdClcbiAgICBleGFtcGxlLmh0bWwoc3RhdGUuaHRtbClcbiAgICByZXR1cm5cbiAgfVxuICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBuZXcgRXhhbXBsZShzdGF0ZSkpXG59XG4iLCIvKmdsb2JhbHMgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwLCBjYW1lbGNhc2U6MCovXG5cbnZhciBFWFRFUk5BTF9JTkNMVURFUyA9IFtcbiAgXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIixcbiAgXCJodHRwczovL2Nkbi5yYXdnaXQuY29tL21iZXN0L2tub2Nrb3V0LnB1bmNoZXMvdjAuNS4xL2tub2Nrb3V0LnB1bmNoZXMuanNcIlxuXVxuXG5jbGFzcyBMaXZlRXhhbXBsZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMuaWQpIHtcbiAgICAgIHRoaXMuZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcChwYXJhbXMuaWQpKVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmJhc2U2NCkge1xuICAgICAgdmFyIG9wdHMgPVxuICAgICAgdGhpcy5leGFtcGxlID0gbmV3IEV4YW1wbGUoSlNPTi5wYXJzZShhdG9iKHBhcmFtcy5iYXNlNjQpKSlcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4YW1wbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4YW1wbGUgbXVzdCBiZSBwcm92aWRlZCBieSBpZCBvciBiYXNlNjQgcGFyYW1ldGVyXCIpXG4gICAgfVxuICB9XG5cbiAgb3BlbkNvbW1vblNldHRpbmdzKCkge1xuICAgIHZhciBleCA9IHRoaXMuZXhhbXBsZVxuICAgIHZhciBkYXRlZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgIHZhciBqc1ByZWZpeCA9IGAvKipcbiAqIENyZWF0ZWQgZnJvbSBhbiBleGFtcGxlIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlYCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlZCBvbiAke2RhdGVkfWBcbiAgICB9XG4gIH1cblxuICBvcGVuRmlkZGxlKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2RvYy5qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QuaHRtbFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBkdGQ6IFwiSFRNTCA1XCIsXG4gICAgICB3cmFwOiAnbCcsXG4gICAgICByZXNvdXJjZXM6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCIsXCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZm9ybSA9ICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QvbGlicmFyeS9wdXJlL1wiXG4gICAgICBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8L2Zvcm0+YClcbiAgICAkLmVhY2goZmllbGRzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBmb3JtLmFwcGVuZChcbiAgICAgICAgJChgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nJHtrfSc+YCkudmFsKHYpXG4gICAgICApXG4gICAgfSlcblxuICAgIGZvcm0uc3VibWl0KClcbiAgfVxuXG4gIG9wZW5QZW4oc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vYmxvZy5jb2RlcGVuLmlvL2RvY3VtZW50YXRpb24vYXBpL3ByZWZpbGwvXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgb3B0cyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBqc19leHRlcm5hbDogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIjtcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkob3B0cylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIilcblxuICAgICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9jb2RlcGVuLmlvL3Blbi9kZWZpbmVcIiBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdkYXRhJyB2YWx1ZT0nJHtkYXRhU3RyfScvPlxuICAgIDwvZm9ybT5gKS5zdWJtaXQoKVxuICB9XG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xpdmUtZXhhbXBsZScsIHtcbiAgICB2aWV3TW9kZWw6IExpdmVFeGFtcGxlQ29tcG9uZW50LFxuICAgIHRlbXBsYXRlOiB7ZWxlbWVudDogXCJsaXZlLWV4YW1wbGVcIn1cbn0pXG4iLCIvKmdsb2JhbCBQYWdlLCBEb2N1bWVudGF0aW9uLCBtYXJrZWQsIFNlYXJjaCwgUGx1Z2luTWFuYWdlciAqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmJvZHkuc3Vic2NyaWJlKHRoaXMub25Cb2R5Q2hhbmdlLCB0aGlzKVxuXG4gICAgLy8gLS0tIGZvb3RlciBsaW5rcy9jZG4gLS0tXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuXG4gICAgLy8gLS0tIHBsdWdpbnMgLS0tXG4gICAgdGhpcy5wbHVnaW5zID0gbmV3IFBsdWdpbk1hbmFnZXIoKVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuXG4gICAgLy8gLS0tIHBhZ2UgbG9hZGluZyBzdGF0dXMgLS0tXG4gICAgLy8gYXBwbGljYXRpb25DYWNoZSBwcm9ncmVzc1xuICAgIHRoaXMucmVsb2FkUHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmNhY2hlSXNVcGRhdGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSlcblxuICAgIC8vIHBhZ2UgbG9hZGluZyBlcnJvclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICAvLyBQcmVmZXJlbmNlIGZvciBub24tU2luZ2xlIFBhZ2UgQXBwXG4gICAgdmFyIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMubm9TUEEgPSBrby5vYnNlcnZhYmxlKEJvb2xlYW4obHMgJiYgbHMuZ2V0SXRlbSgnbm9TUEEnKSkpXG4gICAgdGhpcy5ub1NQQS5zdWJzY3JpYmUoKHYpID0+IGxzICYmIGxzLnNldEl0ZW0oJ25vU1BBJywgdiB8fCBcIlwiKSlcbiAgfVxuXG4gIHBhdGhUb1RlbXBsYXRlKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpLnBvcCgpLnJlcGxhY2UoJy5odG1sJywgJycpXG4gIH1cblxuICBvcGVuKHBpbnBvaW50KSB7XG4gICAgY29uc29sZS5sb2coXCIg8J+TsCAgXCIgKyB0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgICB0aGlzLmJvZHkodGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gIH1cblxuICBvbkJvZHlDaGFuZ2UodGVtcGxhdGVJZCkge1xuICAgIGlmICh0ZW1wbGF0ZUlkKSB7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICB0aGlzLnBsdWdpbnMucmVnaXN0ZXIocGx1Z2lucylcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBbMiwge1widmFyc1wiOiBcImxvY2FsXCJ9XSovXG5cbmNsYXNzIFBsdWdpbk1hbmFnZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wbHVnaW5SZXBvcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG4gICAgdGhpcy5zb3J0ZWRQbHVnaW5SZXBvcyA9IHRoaXMucGx1Z2luUmVwb3NcbiAgICAgIC5maWx0ZXIodGhpcy5maWx0ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5zb3J0QnkodGhpcy5zb3J0QnkuYmluZCh0aGlzKSlcbiAgICAgIC5tYXAodGhpcy5uYW1lVG9JbnN0YW5jZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLm5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcbiAgfVxuXG4gIHJlZ2lzdGVyKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgZmlsdGVyKHJlcG8pIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luc0xvYWRlZCgpKSB7IHJldHVybiBmYWxzZSB9XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLm5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBzb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG5cbiAgbmFtZVRvSW5zdGFuY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hcC5nZXQobmFtZSlcbiAgfVxufVxuIiwiXG5jbGFzcyBTZWFyY2hSZXN1bHQge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMubGluayA9IGAvYS8ke3RlbXBsYXRlLmlkfS5odG1sYFxuICAgIHRoaXMudGl0bGUgPSB0ZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCBg4oCcJHt0ZW1wbGF0ZS5pZH3igJ1gXG4gIH1cbn1cblxuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgc2VhcmNoUmF0ZSA9IHtcbiAgICAgIHRpbWVvdXQ6IDUwMCxcbiAgICAgIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIlxuICAgIH1cbiAgICB0aGlzLnF1ZXJ5ID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBzZWFyY2hSYXRlfSlcbiAgICB0aGlzLnJlc3VsdHMgPSBrby5jb21wdXRlZCh0aGlzLmNvbXB1dGVSZXN1bHRzLCB0aGlzKVxuICAgIHRoaXMucXVlcnkuc3Vic2NyaWJlKHRoaXMub25RdWVyeUNoYW5nZSwgdGhpcylcbiAgICB0aGlzLnByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gIH1cblxuICBjb21wdXRlUmVzdWx0cygpIHtcbiAgICB2YXIgcSA9ICh0aGlzLnF1ZXJ5KCkgfHwgJycpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBbXSB9XG4gICAgcmV0dXJuICQoYHRlbXBsYXRlYClcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzLmNvbnRlbnQpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG5cbiAgc2F2ZVRlbXBsYXRlKCkge1xuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09ICdzZWFyY2gnKSB7XG4gICAgICB0aGlzLnNhdmVkVGVtcGxhdGUgPSAkcm9vdC5ib2R5KClcbiAgICAgIHRoaXMuc2F2ZWRUaXRsZSA9IGRvY3VtZW50LnRpdGxlXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVRlbXBsYXRlKCkge1xuICAgIGlmICh0aGlzLnNhdmVkVGl0bGUpIHtcbiAgICAgICRyb290LmJvZHkodGhpcy5zYXZlZFRlbXBsYXRlKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLnNhdmVkVGl0bGVcbiAgICB9XG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKCkge1xuICAgIGlmICghKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpKSB7XG4gICAgICB0aGlzLnJlc3RvcmVUZW1wbGF0ZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zYXZlVGVtcGxhdGUoKVxuICAgICRyb290LmJvZHkoXCJzZWFyY2hcIilcbiAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgU2VhcmNoIOKAnCR7dGhpcy5xdWVyeSgpfeKAnWBcbiAgfVxufVxuIiwiLy9cbi8vIGFuaW1hdGVkIHRlbXBsYXRlIGJpbmRpbmdcbi8vIC0tLVxuLy8gV2FpdHMgZm9yIENTUzMgdHJhbnNpdGlvbnMgdG8gY29tcGxldGUgb24gY2hhbmdlIGJlZm9yZSBtb3ZpbmcgdG8gdGhlIG5leHQuXG4vL1xudmFyIGFuaW1hdGVkSGlkZVByb3BzID0ge1xuICBtYXJnaW5MZWZ0OiAnMTAwJScsXG4gIHdpZHRoOiAnMTAwJScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJ1xufVxuXG52YXIgYW5pbWF0ZWRTaG93UHJvcHMgPSB7XG4gIG1hcmdpbkxlZnQ6IDBcbn1cblxuXG5rby5iaW5kaW5nSGFuZGxlcnMuYW5pbWF0ZWRUZW1wbGF0ZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGlnbjEsIGlnbjIsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHZhciBvYnMgPSB2YWx1ZUFjY2Vzc29yKClcblxuICAgIHZhciBvblRlbXBsYXRlQ2hhbmdlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWRfKSB7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9ICh0ZW1wbGF0ZUlkXyB8fCAnJykucmVwbGFjZSgnIycsICcnKVxuICAgICAgdmFyIHRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICBpZiAoIXRlbXBsYXRlSWQpIHtcbiAgICAgICAgJGVsZW1lbnQuZW1wdHkoKVxuICAgICAgfSBlbHNlIGlmICghdGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgdGVtcGxhdGUgYnkgaWQ6ICR7dGVtcGxhdGVJZH1gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGVsZW1lbnQuc3RvcCgpXG4gICAgICAgICAgLmFuaW1hdGUoYW5pbWF0ZWRIaWRlUHJvcHMsIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxODAsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAkZWxlbWVudC5jc3MoJ21hcmdpbi1sZWZ0JywgJy0xMDAlJylcbiAgICAgICAgICAgICAgJGVsZW1lbnQuaHRtbCgkKHRlbXBsYXRlTm9kZSkuaHRtbCgpKVxuICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhiaW5kaW5nQ29udGV4dCwgZWxlbWVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hbmltYXRlKGFuaW1hdGVkU2hvd1Byb3BzLCB7IGR1cmF0aW9uOiAxODAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3VicyA9IG9icy5zdWJzY3JpYmUob25UZW1wbGF0ZUNoYW5nZSlcbiAgICBvblRlbXBsYXRlQ2hhbmdlKGtvLnVud3JhcChvYnMpKVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBzdWJzLmRpc3Bvc2UoKVxuICAgIH0pXG5cbiAgICByZXR1cm4geyBjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZSB9XG4gIH1cbn1cbiIsIlxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG5mdW5jdGlvbiBzZXR1cEVkaXRvcihlbGVtZW50LCBsYW5ndWFnZSwgZXhhbXBsZU5hbWUpIHtcbiAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAoZXhhbXBsZU5hbWUpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdqYXZhc2NyaXB0JywgdmEoKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXR1cEVkaXRvcihlbGVtZW50LCAnaHRtbCcsIHZhKCkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuIiwiXG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInRvbW9ycm93XCJcbn1cblxudmFyIGVtYXAgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCdcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAvJmFtcDt8Jmx0Oy9nLFxuICAgIGZ1bmN0aW9uIChlbnQpIHsgcmV0dXJuIGVtYXBbZW50XX1cbiAgKVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0ID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGxhbmd1YWdlID0gdmEoKVxuICAgIGlmIChsYW5ndWFnZSAhPT0gJ2h0bWwnICYmIGxhbmd1YWdlICE9PSAnamF2YXNjcmlwdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJBIGxhbmd1YWdlIHNob3VsZCBiZSBzcGVjaWZpZWQuXCIsIGVsZW1lbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGNvbnRlbnQgPSB1bmVzY2FwZSgkZS50ZXh0KCkpXG4gICAgJGUuZW1wdHkoKVxuICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICAgIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICAgIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7cmVhZG9ubHlUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiBmYWxzZSxcbiAgICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogMixcbiAgICAgIG1pbkxpbmVzOiAxLFxuICAgICAgd3JhcDogdHJ1ZSxcbiAgICAgIG1heExpbmVzOiAzNSxcbiAgICAgIHJlYWRPbmx5OiB0cnVlXG4gICAgfSlcbiAgICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgICBlZGl0b3Iuc2V0VmFsdWUoY29udGVudClcbiAgICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLW5ldy1mdW5jOiAwICovXG5cbi8vIFNhdmUgYSBjb3B5IGZvciByZXN0b3JhdGlvbi91c2VcbmtvLm9yaWdpbmFsQXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcbmtvLmNvbXBvbmVudHMub3JpZ2luYWxSZWdpc3RlciA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXJcblxuXG5rby5iaW5kaW5nSGFuZGxlcnMucmVzdWx0ID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAodmEoKSlcbiAgICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHMgPSBuZXcgU2V0KClcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZha2VSZWdpc3RlcihuYW1lLCBzZXR0aW5ncykge1xuICAgICAga28uY29tcG9uZW50cy5vcmlnaW5hbFJlZ2lzdGVyKG5hbWUsIHNldHRpbmdzKVxuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuYWRkKG5hbWUpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJDb21wb25lbnRSZWdpc3RlcigpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmZvckVhY2goKHYpID0+IGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcih2KSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZha2VSZWdpc3RlclxuXG4gICAgICB0cnkge1xuICAgICAgICByZXNldEVsZW1lbnQoKVxuICAgICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG52YXIgbmF0aXZlVGVtcGxhdGluZyA9ICdjb250ZW50JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG5cblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYXRpdmVUZW1wbGF0aW5nKSB7XG4gICAgICAgICAgLy8gUG9seWZpbGwgdGhlIDx0ZW1wbGF0ZT4gdGFnIGZyb20gdGhlIHRlbXBsYXRlcyB3ZSBsb2FkLlxuICAgICAgICAgIC8vIEZvciBhIG1vcmUgaW52b2x2ZWQgcG9seWZpbGwsIHNlZSBlLmcuXG4gICAgICAgICAgLy8gICBodHRwOi8vanNmaWRkbGUubmV0L2JyaWFuYmxha2VseS9oM0VtWS9cbiAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvP3RlbXBsYXRlL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gXCI8dGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjxzY3JpcHQgdHlwZT0ndGV4dC94LXRlbXBsYXRlJ1wiXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPC9zY3JpcHRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuSURMRSkgeyBhYy51cGRhdGUoKSB9XG4gIHNldFRpbWVvdXQocmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUsIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy5odG1sJykgPT09IC0xKSB7XG4gICAgd2luZG93LiRyb290Lm9wZW4oXCJpbnRyb1wiKVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIFByb21pc2UuYWxsKFtsb2FkVGVtcGxhdGVzKCksIGxvYWRNYXJrZG93bigpXSlcbiAgICAudGhlbihEb2N1bWVudGF0aW9uLmluaXRpYWxpemUpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB3aW5kb3cuJHJvb3QuYm9keShcImVycm9yXCIpXG4gICAgICB3aW5kb3cuJHJvb3QuZXJyb3JNZXNzYWdlKGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH0pXG59XG5cbiQoc3RhcnQpXG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5wYXRobmFtZSA9IGAke2FuY2hvclJvb3R9JHthbmNob3IucGF0aG5hbWV9YC5yZXBsYWNlKCcvLycsICcvJylcbiAgcmV0dXJuIHRydWVcbn1cblxuXG5mdW5jdGlvbiBzY3JvbGxUb0hhc2goYW5jaG9yKSB7XG4gIGlmICghYW5jaG9yLmhhc2gpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIC8vIFdlIG5vcm1hbGl6ZSB0aGUgbGlua3Mg4oCTIHRoZSBkb2NzIHVzZSBfIGFuZCAtIGluY29uc2lzdGVudGx5IGFuZFxuICAgIC8vIHNlZW1pbmdseSBpbnRlcmNoYW5nZWFibHk7IHdlIGNvdWxkIGdvIHRocm91Z2ggYW5kIHNwb3QgZXZlcnkgZGlmZmVyZW5jZVxuICAgIC8vIGJ1dCB0aGlzIGlzIGp1c3QgZWFzaWVyIGZvciBub3cuXG4gICAgYW5jaG9yLmhhc2guc3Vic3RyaW5nKDEpLnJlcGxhY2UoL18vZywgJy0nKVxuICApXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgYW5jaG9yOiAke2FuY2hvci5oYXNofSBmcm9tICR7YW5jaG9yLmhyZWZ9YClcbiAgfVxuICAvLyBXZSBkZWZlciB1bnRpbCB0aGUgbGF5b3V0IGlzIGNvbXBsZXRlZC5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQodGFyZ2V0KS5vZmZzZXQoKS50b3BcbiAgICB9LCAxNTApXG4gIH0sIDE1KVxufVxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIHZhciBhbmNob3IgPSB0aGlzXG4gIHJld3JpdGVBbmNob3JSb290KGV2dClcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiB0aGluZ3Mgb3V0c2lkZSB0aGlzIHBhZ2VcbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIGFuIGVsZW1lbnQgaW4gYW4gZXhhbXBsZS5cbiAgaWYgKCQoYW5jaG9yKS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gJHJvb3QucGF0aFRvVGVtcGxhdGUoYW5jaG9yLnBhdGhuYW1lKVxuICAgIC8vIElmIHRoZSB0ZW1wbGF0ZSBpc24ndCBmb3VuZCwgcHJlc3VtZSBhIGhhcmQgbGlua1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09IHRlbXBsYXRlSWQpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5ocmVmKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICAgICAgJHJvb3Qub3Blbih0ZW1wbGF0ZUlkKVxuICAgICAgJHJvb3Quc2VhcmNoLnF1ZXJ5KCcnKVxuICAgIH1cbiAgICBzY3JvbGxUb0hhc2goYW5jaG9yKVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgRXJyb3IvJHthbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCwgZSlcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBOb3RlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIH1cbiAgJHJvb3Qub3Blbihsb2NhdGlvbi5wYXRobmFtZSlcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgXCJhXCIsIG9uQW5jaG9yQ2xpY2spXG4gICAgJCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIG9uUG9wU3RhdGUpXG4gIH0gZWxzZSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCByZXdyaXRlQW5jaG9yUm9vdClcbiAgfVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQva25vY2tvdXQnLFxuICAgIHRpdGxlOiBcIkdpdHRlclwiLFxuICAgIGljb246IFwiZmEtY29tbWVudHMtb1wifSxcbiAgeyBocmVmOiAnbGVnYWN5LycsXG4gICAgdGl0bGU6IFwiTGVnYWN5IHdlYnNpdGVcIixcbiAgICBpY29uOiBcImZhIGZhLWhpc3RvcnlcIn1cbl1cblxud2luZG93LmdpdGh1YkxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiUmVwb3NpdG9yeVwiLFxuICAgIGljb246IFwiZmEtZ2l0aHViXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy9cIixcbiAgICB0aXRsZTogXCJJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3JlbGVhc2VzJyxcbiAgICB0aXRsZTogXCJSZWxlYXNlc1wiLFxuICAgIGljb246IFwiZmEtY2VydGlmaWNhdGVcIn1cbl1cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=