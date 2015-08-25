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
  return new Documentation(node.getAttribute('id'), node.getAttribute('data-title'), node.getAttribute('data-cat'), node.getAttribute('data-subcat'));
};

Documentation.initialize = function () {
  Documentation.all = $.makeArray($("[data-kind=documentation]").map(Documentation.fromNode));
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Example = (function () {
  function Example() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Example);

    var debounce = { timeout: 500, method: "notifyWhenChangesStop" };
    this.javascript = ko.observable(state.javascript).extend({ rateLimit: debounce });
    this.html = ko.observable(state.html).extend({ rateLimit: debounce });
    this.css = state.css || '';

    this.finalJavascript = ko.pureComputed(this.computeFinalJs, this);
  }

  // Add ko.applyBindings as needed; return Error where appropriate.

  _createClass(Example, [{
    key: "computeFinalJs",
    value: function computeFinalJs() {
      var js = this.javascript();
      if (!js) {
        return new Error("The script is empty.");
      }
      if (js.indexOf('ko.applyBindings(') === -1) {
        if (js.indexOf(' viewModel =') !== -1) {
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
        wrap: 'l',
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

ko.components.register('live-example', {
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

      // docCats: A sorted list of the documentation sections
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
      return ls && ls.setItem('noSPA', v || "");
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
      console.log(" 📰  " + this.pathToTemplate(pinpoint));
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
      method: "notifyWhenChangesStop"
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
      $root.body("search");
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
  x: '100%',
  width: '100%',
  overflow: 'hidden',
  duration: 180,
  easing: 'snap'
};

var animatedShowProps = {
  x: 0,
  duration: 180,
  easing: 'snap'
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
        $element.stop().transition(animatedHideProps, function () {
          $element.css('x', '-100%');
          $element.html($(templateNode).html());
          ko.applyBindingsToDescendants(bindingContext, element);
        }).transition(animatedShowProps);
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
    setTimeout(function () {
      return setupEditor(element, 'javascript', va(), 124);
    });
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    // Defer so the page rendering is faster
    // TODO: Wait until in view http://stackoverflow.com/a/7557433/19212
    setTimeout(function () {
      return setupEditor(element, 'html', va());
    }, 124);
    // debugger
    // editor.session.setOptions({
    // // $worker.call('changeOptions', [{
    //   'expected-doctype-but-got-chars': false,
    //   'expected-doctype-but-got-end-tag': false,
    //   'expected-doctype-but-got-start-tag': false
    // })
  }
};
"use strict";

var readonlyThemeMap = {
  html: "solarized_light",
  javascript: "tomorrow"
};

var emap = {
  '&amp;': '&',
  '&lt;': '<'
};

function unescape(str) {
  return str.replace(/&amp;|&lt;/g, function (ent) {
    return emap[ent];
  });
}

ko.bindingHandlers.highlight = {
  setup: function setup(element, va) {
    var $e = $(element);
    var language = va();
    if (language !== 'html' && language !== 'javascript') {
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
  },

  init: function init(element, va) {
    setTimeout(function () {
      return ko.bindingHandlers.highlight.setup(element, va);
    }, 124);
  }
};
/* eslint no-new-func: 0 */

// Save a copy for restoration/use
"use strict";

ko.originalApplyBindings = ko.applyBindings;
ko.components.originalRegister = ko.components.register;

ko.bindingHandlers.result = {
  init: function init(element, va) {
    setTimeout(function () {
      return ko.bindingHandlers.result.setup(element, va);
    }, 124);
  },
  setup: function setup(element, va) {
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
        var fn = new Function('node', script);
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
    if (typeof html !== "string") {
      console.error('Unable to get ' + uri + ':', html);
    } else {
      if (!nativeTemplating) {
        // Polyfill the <template> tag from the templates we load.
        // For a more involved polyfill, see e.g.
        //   http://jsfiddle.net/brianblakely/h3EmY/
        html = html.replace(/<\/?template/g, function (match) {
          if (match === "<template") {
            return "<script type='text/x-template'";
          } else {
            return "</script";
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
  return loadHtml("build/markdown.html");
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
    window.$root.open("intro");
  }
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(Documentation.initialize).then(applyBindings).then(getExamples).then(loadAPI).then(getPlugins).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)['catch'](function (err) {
    window.$root.body("error");
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
    $("html, body").animate({
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
  if ($(anchor).parents("live-example").length !== 0) {
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

function onPopState() /* evt */{
  // Note https://github.com/devote/HTML5-History-API
  if ($root.noSPA()) {
    return;
  }
  $root.open(location.pathname);
}

function setupEvents() {
  if (window.history.pushState) {
    $(document.body).on('click', "a", onAnchorClick);
    $(window).on('popstate', onPopState);
  } else {
    $(document.body).on('click', rewriteAnchorRoot);
  }
}
"use strict";

window.links = [{ href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: 'https://gitter.im/knockout/knockout',
  title: "Gitter",
  icon: "fa-comments-o" }, { href: 'legacy/',
  title: "Legacy website",
  icon: "fa fa-history" }];

window.githubLinks = [{ href: "https://github.com/knockout/knockout",
  title: "Repository",
  icon: "fa-github" }, { href: "https://github.com/knockout/knockout/issues/",
  title: "Issues",
  icon: "fa-exclamation-circle" }, { href: 'https://github.com/knockout/knockout/releases',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJzZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBVU0sR0FBRztBQUNJLFdBRFAsR0FBRyxDQUNLLElBQUksRUFBRTswQkFEZCxHQUFHOztBQUVMLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDNUIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pEOztlQVRHLEdBQUc7O1dBV0Msa0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNyQixrQkFBVSxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sVUFBSyxJQUFJLENBQUU7S0FDMUM7OztTQWJHLEdBQUc7OztBQWdCVCxHQUFHLENBQUMsT0FBTyxHQUFHLG1EQUFtRCxDQUFB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LE9BQU87QUFDaEIsS0FBRyxFQUFFLDJEQUEyRDtBQUNoRSxPQUFLLEVBQUUsaUVBQWlFO0NBQ3pFLEVBQ0QsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSx1RUFBdUU7QUFDNUUsT0FBSyxFQUFFLHlFQUF5RTtDQUNqRixDQUNGLENBQUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gQVBJIGNvbnZlcnRzIHRoZSBgb3BpbmVgLWZsYXZvdXJlZCBkb2N1bWVudGF0aW9uIGhlcmUuXG5cbiBIZXJlIGlzIGEgc2FtcGxlOlxuKi9cbi8vIC8qLS0tXG4vLyAgcHVycG9zZToga25vY2tvdXQtd2lkZSBzZXR0aW5nc1xuLy8gICovXG4vLyB2YXIgc2V0dGluZ3MgPSB7IC8qLi4uKi8gfVxuXG5jbGFzcyBBUEkge1xuICBjb25zdHJ1Y3RvcihzcGVjKSB7XG4gICAgdGhpcy50eXBlID0gc3BlYy50eXBlXG4gICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lXG4gICAgdGhpcy5zb3VyY2UgPSBzcGVjLnNvdXJjZVxuICAgIHRoaXMubGluZSA9IHNwZWMubGluZVxuICAgIHRoaXMucHVycG9zZSA9IHNwZWMudmFycy5wdXJwb3NlXG4gICAgdGhpcy5zcGVjID0gc3BlYy52YXJzLnBhcmFtc1xuICAgIHRoaXMudXJsID0gdGhpcy5idWlsZFVybChzcGVjLnNvdXJjZSwgc3BlYy5saW5lKVxuICB9XG5cbiAgYnVpbGRVcmwoc291cmNlLCBsaW5lKSB7XG4gICAgcmV0dXJuIGAke0FQSS51cmxSb290fSR7c291cmNlfSNMJHtsaW5lfWBcbiAgfVxufVxuXG5BUEkudXJsUm9vdCA9IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2Jsb2IvbWFzdGVyL1wiXG5cblxuQVBJLml0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcblxuQVBJLmFkZCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBjb25zb2xlLmxvZyhcIlRcIiwgdG9rZW4pXG4gIEFQSS5pdGVtcy5wdXNoKG5ldyBBUEkodG9rZW4pKVxufVxuIiwiXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIHRpdGxlLCBjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICB0aGlzLnN1YmNhdGVnb3J5ID0gc3ViY2F0ZWdvcnlcbiAgfVxufVxuXG5Eb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXAgPSB7XG4gIDE6IFwiR2V0dGluZyBzdGFydGVkXCIsXG4gIDI6IFwiT2JzZXJ2YWJsZXNcIixcbiAgMzogXCJCaW5kaW5ncyBhbmQgQ29tcG9uZW50c1wiLFxuICA0OiBcIkJpbmRpbmdzIGluY2x1ZGVkXCIsXG4gIDU6IFwiRnVydGhlciBpbmZvcm1hdGlvblwiXG59XG5cbkRvY3VtZW50YXRpb24uZnJvbU5vZGUgPSBmdW5jdGlvbiAoaSwgbm9kZSkge1xuICByZXR1cm4gbmV3IERvY3VtZW50YXRpb24oXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJjYXQnKVxuICApXG59XG5cbkRvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgRG9jdW1lbnRhdGlvbi5hbGwgPSAkLm1ha2VBcnJheShcbiAgICAkKFwiW2RhdGEta2luZD1kb2N1bWVudGF0aW9uXVwiKS5tYXAoRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSlcbiAgKVxufVxuIiwiXG5cbmNsYXNzIEV4YW1wbGUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSA9IHt9KSB7XG4gICAgdmFyIGRlYm91bmNlID0geyB0aW1lb3V0OiA1MDAsIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIiB9XG4gICAgdGhpcy5qYXZhc2NyaXB0ID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5qYXZhc2NyaXB0KVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5odG1sID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5odG1sKVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5jc3MgPSBzdGF0ZS5jc3MgfHwgJydcblxuICAgIHRoaXMuZmluYWxKYXZhc2NyaXB0ID0ga28ucHVyZUNvbXB1dGVkKHRoaXMuY29tcHV0ZUZpbmFsSnMsIHRoaXMpXG4gIH1cblxuICAvLyBBZGQga28uYXBwbHlCaW5kaW5ncyBhcyBuZWVkZWQ7IHJldHVybiBFcnJvciB3aGVyZSBhcHByb3ByaWF0ZS5cbiAgY29tcHV0ZUZpbmFsSnMoKSB7XG4gICAgdmFyIGpzID0gdGhpcy5qYXZhc2NyaXB0KClcbiAgICBpZiAoIWpzKSB7IHJldHVybiBuZXcgRXJyb3IoXCJUaGUgc2NyaXB0IGlzIGVtcHR5LlwiKSB9XG4gICAgaWYgKGpzLmluZGV4T2YoJ2tvLmFwcGx5QmluZGluZ3MoJykgPT09IC0xKSB7XG4gICAgICBpZiAoanMuaW5kZXhPZignIHZpZXdNb2RlbCA9JykgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGd1ZXNzIHRoZSB2aWV3TW9kZWwgbmFtZSAuLi5cbiAgICAgICAgcmV0dXJuIGAke2pzfVxcblxcbi8qIEF1dG9tYXRpY2FsbHkgQWRkZWQgKi9cbiAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHZpZXdNb2RlbCk7YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3ModmlldykgaXMgbm90IGNhbGxlZFwiKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNcbiAgfVxufVxuXG5FeGFtcGxlLnN0YXRlTWFwID0gbmV3IE1hcCgpXG5cbkV4YW1wbGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHN0YXRlID0gbmV3IEV4YW1wbGUobmFtZSlcbiAgICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBzdGF0ZSlcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuXG5FeGFtcGxlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCBzdGF0ZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmIChleGFtcGxlKSB7XG4gICAgZXhhbXBsZS5qYXZhc2NyaXB0KHN0YXRlLmphdmFzY3JpcHQpXG4gICAgZXhhbXBsZS5odG1sKHN0YXRlLmh0bWwpXG4gICAgcmV0dXJuXG4gIH1cbiAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgbmV3IEV4YW1wbGUoc3RhdGUpKVxufVxuIiwiLypnbG9iYWxzIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCwgY2FtZWxjYXNlOjAqL1xuXG52YXIgRVhURVJOQUxfSU5DTFVERVMgPSBbXG4gIFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCIsXG4gIFwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9tYmVzdC9rbm9ja291dC5wdW5jaGVzL3YwLjUuMS9rbm9ja291dC5wdW5jaGVzLmpzXCJcbl1cblxuY2xhc3MgTGl2ZUV4YW1wbGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLmlkKSB7XG4gICAgICB0aGlzLmV4YW1wbGUgPSBFeGFtcGxlLmdldChrby51bndyYXAocGFyYW1zLmlkKSlcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5iYXNlNjQpIHtcbiAgICAgIHZhciBvcHRzID1cbiAgICAgIHRoaXMuZXhhbXBsZSA9IG5ldyBFeGFtcGxlKEpTT04ucGFyc2UoYXRvYihwYXJhbXMuYmFzZTY0KSkpXG4gICAgfVxuICAgIGlmICghdGhpcy5leGFtcGxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeGFtcGxlIG11c3QgYmUgcHJvdmlkZWQgYnkgaWQgb3IgYmFzZTY0IHBhcmFtZXRlclwiKVxuICAgIH1cbiAgfVxuXG4gIG9wZW5Db21tb25TZXR0aW5ncygpIHtcbiAgICB2YXIgZXggPSB0aGlzLmV4YW1wbGVcbiAgICB2YXIgZGF0ZWQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICB2YXIganNQcmVmaXggPSBgLyoqXG4gKiBDcmVhdGVkIGZyb20gYW4gZXhhbXBsZSBvbiB0aGUgS25vY2tvdXQgd2Vic2l0ZVxuICogb24gJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9XG4gKiovXG5cbiAvKiBGb3IgY29udmVuaWVuY2UgYW5kIGNvbnNpc3RlbmN5IHdlJ3ZlIGVuYWJsZWQgdGhlIGtvXG4gICogcHVuY2hlcyBsaWJyYXJ5IGZvciB0aGlzIGV4YW1wbGUuXG4gICovXG4ga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuXG4gLyoqIEV4YW1wbGUgaXMgYXMgZm9sbG93cyAqKi9cbmBcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogZXguaHRtbCgpLFxuICAgICAganM6IGpzUHJlZml4ICsgZXguZmluYWxKYXZhc2NyaXB0KCksXG4gICAgICB0aXRsZTogYEZyb20gS25vY2tvdXQgZXhhbXBsZWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkLCBTZWFyY2gsIFBsdWdpbk1hbmFnZXIgKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gLS0tIE1haW4gYm9keSB0ZW1wbGF0ZSBpZCAtLS1cbiAgICB0aGlzLmJvZHkgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5ib2R5LnN1YnNjcmliZSh0aGlzLm9uQm9keUNoYW5nZSwgdGhpcylcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBwbHVnaW5zIC0tLVxuICAgIHRoaXMucGx1Z2lucyA9IG5ldyBQbHVnaW5NYW5hZ2VyKClcblxuICAgIC8vIC0tLSBkb2N1bWVudGF0aW9uIC0tLVxuICAgIHRoaXMuZG9jQ2F0TWFwID0gbmV3IE1hcCgpXG4gICAgRG9jdW1lbnRhdGlvbi5hbGwuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG4gICAgICB2YXIgY2F0ID0gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW2RvYy5jYXRlZ29yeV1cbiAgICAgIHZhciBkb2NMaXN0ID0gdGhpcy5kb2NDYXRNYXAuZ2V0KGNhdClcbiAgICAgIGlmICghZG9jTGlzdCkge1xuICAgICAgICBkb2NMaXN0ID0gW11cbiAgICAgICAgdGhpcy5kb2NDYXRNYXAuc2V0KGNhdCwgZG9jTGlzdClcbiAgICAgIH1cbiAgICAgIGRvY0xpc3QucHVzaChkb2MpXG4gICAgfSwgdGhpcylcblxuICAgIC8vIFNvcnQgdGhlIGRvY3VtZW50YXRpb24gaXRlbXNcbiAgICBmdW5jdGlvbiBzb3J0ZXIoYSwgYikge1xuICAgICAgcmV0dXJuIGEudGl0bGUubG9jYWxlQ29tcGFyZShiLnRpdGxlKVxuICAgIH1cbiAgICBmb3IgKHZhciBsaXN0IG9mIHRoaXMuZG9jQ2F0TWFwLnZhbHVlcygpKSB7IGxpc3Quc29ydChzb3J0ZXIpIH1cblxuICAgIC8vIGRvY0NhdHM6IEEgc29ydGVkIGxpc3Qgb2YgdGhlIGRvY3VtZW50YXRpb24gc2VjdGlvbnNcbiAgICB0aGlzLmRvY0NhdHMgPSBPYmplY3Qua2V5cyhEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXApXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbdl0gfSlcblxuICAgIC8vIC0tLSBzZWFyY2hpbmcgLS0tXG4gICAgdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoKClcblxuICAgIC8vIC0tLSBwYWdlIGxvYWRpbmcgc3RhdHVzIC0tLVxuICAgIC8vIGFwcGxpY2F0aW9uQ2FjaGUgcHJvZ3Jlc3NcbiAgICB0aGlzLnJlbG9hZFByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5jYWNoZUlzVXBkYXRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpXG5cbiAgICAvLyBwYWdlIGxvYWRpbmcgZXJyb3JcbiAgICB0aGlzLmVycm9yTWVzc2FnZSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgLy8gUHJlZmVyZW5jZSBmb3Igbm9uLVNpbmdsZSBQYWdlIEFwcFxuICAgIHZhciBscyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB0aGlzLm5vU1BBID0ga28ub2JzZXJ2YWJsZShCb29sZWFuKGxzICYmIGxzLmdldEl0ZW0oJ25vU1BBJykpKVxuICAgIHRoaXMubm9TUEEuc3Vic2NyaWJlKCh2KSA9PiBscyAmJiBscy5zZXRJdGVtKCdub1NQQScsIHYgfHwgXCJcIikpXG4gIH1cblxuICBwYXRoVG9UZW1wbGF0ZShwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5wb3AoKS5yZXBsYWNlKCcuaHRtbCcsICcnKVxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIGNvbnNvbGUubG9nKFwiIPCfk7AgIFwiICsgdGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gICAgdGhpcy5ib2R5KHRoaXMucGF0aFRvVGVtcGxhdGUocGlucG9pbnQpKVxuICB9XG5cbiAgb25Cb2R5Q2hhbmdlKHRlbXBsYXRlSWQpIHtcbiAgICBpZiAodGVtcGxhdGVJZCkge1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKVxuICAgICAgdGhpcy50aXRsZShub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8ICcnKVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyUGx1Z2lucyhwbHVnaW5zKSB7XG4gICAgdGhpcy5wbHVnaW5zLnJlZ2lzdGVyKHBsdWdpbnMpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby11bnVzZWQtdmFyczogWzIsIHtcInZhcnNcIjogXCJsb2NhbFwifV0qL1xuXG5jbGFzcyBQbHVnaW5NYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucGx1Z2luUmVwb3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuICAgIHRoaXMuc29ydGVkUGx1Z2luUmVwb3MgPSB0aGlzLnBsdWdpblJlcG9zXG4gICAgICAuZmlsdGVyKHRoaXMuZmlsdGVyLmJpbmQodGhpcykpXG4gICAgICAuc29ydEJ5KHRoaXMuc29ydEJ5LmJpbmQodGhpcykpXG4gICAgICAubWFwKHRoaXMubmFtZVRvSW5zdGFuY2UuYmluZCh0aGlzKSlcbiAgICB0aGlzLnBsdWdpbk1hcCA9IG5ldyBNYXAoKVxuICAgIHRoaXMucGx1Z2luU29ydCA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpLmV4dGVuZCh7cmF0ZUxpbWl0OiAxNX0pXG4gICAgdGhpcy5uZWVkbGUgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IDIwMH0pXG4gIH1cblxuICByZWdpc3RlcihwbHVnaW5zKSB7XG4gICAgT2JqZWN0LmtleXMocGx1Z2lucykuZm9yRWFjaChmdW5jdGlvbiAocmVwbykge1xuICAgICAgdmFyIGFib3V0ID0gcGx1Z2luc1tyZXBvXVxuICAgICAgdGhpcy5wbHVnaW5SZXBvcy5wdXNoKHJlcG8pXG4gICAgICB0aGlzLnBsdWdpbk1hcC5zZXQocmVwbywgYWJvdXQpXG4gICAgfSwgdGhpcylcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQodHJ1ZSlcbiAgfVxuXG4gIGZpbHRlcihyZXBvKSB7XG4gICAgaWYgKCF0aGlzLnBsdWdpbnNMb2FkZWQoKSkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIHZhciBuZWVkbGUgPSAodGhpcy5uZWVkbGUoKSB8fCAnJykudG9Mb3dlckNhc2UoKVxuICAgIGlmICghbmVlZGxlKSB7IHJldHVybiB0cnVlIH1cbiAgICBpZiAocmVwby50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwKSB7IHJldHVybiB0cnVlIH1cbiAgICBpZiAoIWFib3V0KSB7IHJldHVybiBmYWxzZSB9XG4gICAgcmV0dXJuIChhYm91dC5kZXNjcmlwdGlvbiB8fCAnJykudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMFxuICB9XG5cbiAgc29ydEJ5KHJlcG8sIGRlc2NlbmRpbmcpIHtcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQoKSAvLyBDcmVhdGUgZGVwZW5kZW5jeS5cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICBpZiAoYWJvdXQpIHtcbiAgICAgIHJldHVybiBkZXNjZW5kaW5nKGFib3V0LnN0YXJnYXplcnNfY291bnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZXNjZW5kaW5nKC0xKVxuICAgIH1cbiAgfVxuXG4gIG5hbWVUb0luc3RhbmNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5NYXAuZ2V0KG5hbWUpXG4gIH1cbn1cbiIsIlxuY2xhc3MgU2VhcmNoUmVzdWx0IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLmxpbmsgPSBgL2EvJHt0ZW1wbGF0ZS5pZH0uaHRtbGBcbiAgICB0aGlzLnRpdGxlID0gdGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgYOKAnCR7dGVtcGxhdGUuaWR94oCdYFxuICB9XG59XG5cblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIHNlYXJjaFJhdGUgPSB7XG4gICAgICB0aW1lb3V0OiA1MDAsXG4gICAgICBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCJcbiAgICB9XG4gICAgdGhpcy5xdWVyeSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogc2VhcmNoUmF0ZX0pXG4gICAgdGhpcy5yZXN1bHRzID0ga28uY29tcHV0ZWQodGhpcy5jb21wdXRlUmVzdWx0cywgdGhpcylcbiAgICB0aGlzLnF1ZXJ5LnN1YnNjcmliZSh0aGlzLm9uUXVlcnlDaGFuZ2UsIHRoaXMpXG4gICAgdGhpcy5wcm9ncmVzcyA9IGtvLm9ic2VydmFibGUoKVxuICB9XG5cbiAgY29tcHV0ZVJlc3VsdHMoKSB7XG4gICAgdmFyIHEgPSAodGhpcy5xdWVyeSgpIHx8ICcnKS50cmltKCkudG9Mb3dlckNhc2UoKVxuICAgIGlmICghcSkgeyByZXR1cm4gW10gfVxuICAgIHJldHVybiAkKGB0ZW1wbGF0ZWApXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQodGhpcy5jb250ZW50KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHEpICE9PSAtMVxuICAgICAgfSlcbiAgICAgIC5tYXAoKGksIHRlbXBsYXRlKSA9PiBuZXcgU2VhcmNoUmVzdWx0KHRlbXBsYXRlKSlcbiAgfVxuXG4gIHNhdmVUZW1wbGF0ZSgpIHtcbiAgICBpZiAoJHJvb3QuYm9keSgpICE9PSAnc2VhcmNoJykge1xuICAgICAgdGhpcy5zYXZlZFRlbXBsYXRlID0gJHJvb3QuYm9keSgpXG4gICAgICB0aGlzLnNhdmVkVGl0bGUgPSBkb2N1bWVudC50aXRsZVxuICAgIH1cbiAgfVxuXG4gIHJlc3RvcmVUZW1wbGF0ZSgpIHtcbiAgICBpZiAodGhpcy5zYXZlZFRpdGxlKSB7XG4gICAgICAkcm9vdC5ib2R5KHRoaXMuc2F2ZWRUZW1wbGF0ZSlcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5zYXZlZFRpdGxlXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSgpIHtcbiAgICBpZiAoISh0aGlzLnF1ZXJ5KCkgfHwgJycpLnRyaW0oKSkge1xuICAgICAgdGhpcy5yZXN0b3JlVGVtcGxhdGUoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuc2F2ZVRlbXBsYXRlKClcbiAgICAkcm9vdC5ib2R5KFwic2VhcmNoXCIpXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTIFNlYXJjaCDigJwke3RoaXMucXVlcnkoKX3igJ1gXG4gIH1cbn1cbiIsIi8vXG4vLyBhbmltYXRlZCB0ZW1wbGF0ZSBiaW5kaW5nXG4vLyAtLS1cbi8vIFdhaXRzIGZvciBDU1MzIHRyYW5zaXRpb25zIHRvIGNvbXBsZXRlIG9uIGNoYW5nZSBiZWZvcmUgbW92aW5nIHRvIHRoZSBuZXh0LlxuLy9cbnZhciBhbmltYXRlZEhpZGVQcm9wcyA9IHtcbiAgeDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIGR1cmF0aW9uOiAxODAsXG4gIGVhc2luZzogJ3NuYXAnXG59XG5cbnZhciBhbmltYXRlZFNob3dQcm9wcyA9IHtcbiAgeDogMCxcbiAgZHVyYXRpb246IDE4MCxcbiAgZWFzaW5nOiAnc25hcCdcbn1cblxuXG5rby5iaW5kaW5nSGFuZGxlcnMuYW5pbWF0ZWRUZW1wbGF0ZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGlnbjEsIGlnbjIsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHZhciBvYnMgPSB2YWx1ZUFjY2Vzc29yKClcblxuICAgIHZhciBvblRlbXBsYXRlQ2hhbmdlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWRfKSB7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9ICh0ZW1wbGF0ZUlkXyB8fCAnJykucmVwbGFjZSgnIycsICcnKVxuICAgICAgdmFyIHRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICBpZiAoIXRlbXBsYXRlSWQpIHtcbiAgICAgICAgJGVsZW1lbnQuZW1wdHkoKVxuICAgICAgfSBlbHNlIGlmICghdGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgdGVtcGxhdGUgYnkgaWQ6ICR7dGVtcGxhdGVJZH1gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGVsZW1lbnQuc3RvcCgpXG4gICAgICAgICAgLnRyYW5zaXRpb24oYW5pbWF0ZWRIaWRlUHJvcHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJGVsZW1lbnQuY3NzKCd4JywgJy0xMDAlJylcbiAgICAgICAgICAgICAgJGVsZW1lbnQuaHRtbCgkKHRlbXBsYXRlTm9kZSkuaHRtbCgpKVxuICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhiaW5kaW5nQ29udGV4dCwgZWxlbWVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICAgICAgLnRyYW5zaXRpb24oYW5pbWF0ZWRTaG93UHJvcHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN1YnMgPSBvYnMuc3Vic2NyaWJlKG9uVGVtcGxhdGVDaGFuZ2UpXG4gICAgb25UZW1wbGF0ZUNoYW5nZShrby51bndyYXAob2JzKSlcblxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgc3Vicy5kaXNwb3NlKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHsgY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWUgfVxuICB9XG59XG4iLCJcbnZhciBsYW5ndWFnZVRoZW1lTWFwID0ge1xuICBodG1sOiAnc29sYXJpemVkX2RhcmsnLFxuICBqYXZhc2NyaXB0OiAnbW9ub2thaSdcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0ga28udW53cmFwKGV4YW1wbGVOYW1lKVxuICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7bGFuZ3VhZ2VUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IHRydWUsXG4gICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgdGFiU2l6ZTogMixcbiAgICBtaW5MaW5lczogMyxcbiAgICBtYXhMaW5lczogMzAsXG4gICAgd3JhcDogdHJ1ZVxuICB9KVxuICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgZWRpdG9yLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IGV4YW1wbGVbbGFuZ3VhZ2VdKGVkaXRvci5nZXRWYWx1ZSgpKSB9KVxuICBleGFtcGxlW2xhbmd1YWdlXS5zdWJzY3JpYmUoZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAoZWRpdG9yLmdldFZhbHVlKCkgIT09IHYpIHtcbiAgICAgIGVkaXRvci5zZXRWYWx1ZSh2KVxuICAgIH1cbiAgfSlcbiAgZWRpdG9yLnNldFZhbHVlKGV4YW1wbGVbbGFuZ3VhZ2VdKCkpXG4gIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgcmV0dXJuIGVkaXRvclxufVxuXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzXG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1qcyddID0ge1xuICAvKiBoaWdobGlnaHQ6IFwibGFuZ2F1Z2VcIiAqL1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdqYXZhc2NyaXB0JywgdmEoKSwgMTI0KSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICAvLyBEZWZlciBzbyB0aGUgcGFnZSByZW5kZXJpbmcgaXMgZmFzdGVyXG4gICAgLy8gVE9ETzogV2FpdCB1bnRpbCBpbiB2aWV3IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzMvMTkyMTJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSksIDEyNClcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG4iLCJcblxudmFyIHJlYWRvbmx5VGhlbWVNYXAgPSB7XG4gIGh0bWw6IFwic29sYXJpemVkX2xpZ2h0XCIsXG4gIGphdmFzY3JpcHQ6IFwidG9tb3Jyb3dcIlxufVxuXG52YXIgZW1hcCA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8J1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFxuICAgIC8mYW1wO3wmbHQ7L2csXG4gICAgZnVuY3Rpb24gKGVudCkgeyByZXR1cm4gZW1hcFtlbnRdfVxuICApXG59XG5cbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIHNldHVwOiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGxhbmd1YWdlID0gdmEoKVxuICAgIGlmIChsYW5ndWFnZSAhPT0gJ2h0bWwnICYmIGxhbmd1YWdlICE9PSAnamF2YXNjcmlwdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJBIGxhbmd1YWdlIHNob3VsZCBiZSBzcGVjaWZpZWQuXCIsIGVsZW1lbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGNvbnRlbnQgPSB1bmVzY2FwZSgkZS50ZXh0KCkpXG4gICAgJGUuZW1wdHkoKVxuICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICAgIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICAgIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7cmVhZG9ubHlUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiBmYWxzZSxcbiAgICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogMixcbiAgICAgIG1pbkxpbmVzOiAxLFxuICAgICAgd3JhcDogdHJ1ZSxcbiAgICAgIG1heExpbmVzOiAzNSxcbiAgICAgIHJlYWRPbmx5OiB0cnVlXG4gICAgfSlcbiAgICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgICBlZGl0b3Iuc2V0VmFsdWUoY29udGVudClcbiAgICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQuc2V0dXAoZWxlbWVudCwgdmEpLCAxMjQpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby1uZXctZnVuYzogMCAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5vcmlnaW5hbEFwcGx5QmluZGluZ3MgPSBrby5hcHBseUJpbmRpbmdzXG5rby5jb21wb25lbnRzLm9yaWdpbmFsUmVnaXN0ZXIgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyXG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmEpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IGtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQuc2V0dXAoZWxlbWVudCwgdmEpLCAxMjQpXG4gIH0sXG4gIHNldHVwOiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAodmEoKSlcbiAgICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHMgPSBuZXcgU2V0KClcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZha2VSZWdpc3RlcihuYW1lLCBzZXR0aW5ncykge1xuICAgICAga28uY29tcG9uZW50cy5vcmlnaW5hbFJlZ2lzdGVyKG5hbWUsIHNldHRpbmdzKVxuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuYWRkKG5hbWUpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJDb21wb25lbnRSZWdpc3RlcigpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmZvckVhY2goKHYpID0+IGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcih2KSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZha2VSZWdpc3RlclxuXG4gICAgICB0cnkge1xuICAgICAgICByZXNldEVsZW1lbnQoKVxuICAgICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG52YXIgbmF0aXZlVGVtcGxhdGluZyA9ICdjb250ZW50JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG5cblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYXRpdmVUZW1wbGF0aW5nKSB7XG4gICAgICAgICAgLy8gUG9seWZpbGwgdGhlIDx0ZW1wbGF0ZT4gdGFnIGZyb20gdGhlIHRlbXBsYXRlcyB3ZSBsb2FkLlxuICAgICAgICAgIC8vIEZvciBhIG1vcmUgaW52b2x2ZWQgcG9seWZpbGwsIHNlZSBlLmcuXG4gICAgICAgICAgLy8gICBodHRwOi8vanNmaWRkbGUubmV0L2JyaWFuYmxha2VseS9oM0VtWS9cbiAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvP3RlbXBsYXRlL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gXCI8dGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjxzY3JpcHQgdHlwZT0ndGV4dC94LXRlbXBsYXRlJ1wiXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPC9zY3JpcHRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuSURMRSkgeyBhYy51cGRhdGUoKSB9XG4gIHNldFRpbWVvdXQocmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUsIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy5odG1sJykgPT09IC0xKSB7XG4gICAgd2luZG93LiRyb290Lm9wZW4oXCJpbnRyb1wiKVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIFByb21pc2UuYWxsKFtsb2FkVGVtcGxhdGVzKCksIGxvYWRNYXJrZG93bigpXSlcbiAgICAudGhlbihEb2N1bWVudGF0aW9uLmluaXRpYWxpemUpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB3aW5kb3cuJHJvb3QuYm9keShcImVycm9yXCIpXG4gICAgICB3aW5kb3cuJHJvb3QuZXJyb3JNZXNzYWdlKGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH0pXG59XG5cbiQoc3RhcnQpXG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5wYXRobmFtZSA9IGAke2FuY2hvclJvb3R9JHthbmNob3IucGF0aG5hbWV9YC5yZXBsYWNlKCcvLycsICcvJylcbiAgcmV0dXJuIHRydWVcbn1cblxuXG5mdW5jdGlvbiBzY3JvbGxUb0hhc2goYW5jaG9yKSB7XG4gIGlmICghYW5jaG9yLmhhc2gpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIC8vIFdlIG5vcm1hbGl6ZSB0aGUgbGlua3Mg4oCTIHRoZSBkb2NzIHVzZSBfIGFuZCAtIGluY29uc2lzdGVudGx5IGFuZFxuICAgIC8vIHNlZW1pbmdseSBpbnRlcmNoYW5nZWFibHk7IHdlIGNvdWxkIGdvIHRocm91Z2ggYW5kIHNwb3QgZXZlcnkgZGlmZmVyZW5jZVxuICAgIC8vIGJ1dCB0aGlzIGlzIGp1c3QgZWFzaWVyIGZvciBub3cuXG4gICAgYW5jaG9yLmhhc2guc3Vic3RyaW5nKDEpLnJlcGxhY2UoL18vZywgJy0nKVxuICApXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgYW5jaG9yOiAke2FuY2hvci5oYXNofSBmcm9tICR7YW5jaG9yLmhyZWZ9YClcbiAgfVxuICAvLyBXZSBkZWZlciB1bnRpbCB0aGUgbGF5b3V0IGlzIGNvbXBsZXRlZC5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQodGFyZ2V0KS5vZmZzZXQoKS50b3BcbiAgICB9LCAxNTApXG4gIH0sIDE1KVxufVxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIHZhciBhbmNob3IgPSB0aGlzXG4gIHJld3JpdGVBbmNob3JSb290KGV2dClcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiB0aGluZ3Mgb3V0c2lkZSB0aGlzIHBhZ2VcbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIGFuIGVsZW1lbnQgaW4gYW4gZXhhbXBsZS5cbiAgaWYgKCQoYW5jaG9yKS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gJHJvb3QucGF0aFRvVGVtcGxhdGUoYW5jaG9yLnBhdGhuYW1lKVxuICAgIC8vIElmIHRoZSB0ZW1wbGF0ZSBpc24ndCBmb3VuZCwgcHJlc3VtZSBhIGhhcmQgbGlua1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09IHRlbXBsYXRlSWQpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5ocmVmKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICAgICAgJHJvb3Qub3Blbih0ZW1wbGF0ZUlkKVxuICAgICAgJHJvb3Quc2VhcmNoLnF1ZXJ5KCcnKVxuICAgIH1cbiAgICBzY3JvbGxUb0hhc2goYW5jaG9yKVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgRXJyb3IvJHthbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCwgZSlcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBOb3RlIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIH1cbiAgJHJvb3Qub3Blbihsb2NhdGlvbi5wYXRobmFtZSlcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgXCJhXCIsIG9uQW5jaG9yQ2xpY2spXG4gICAgJCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIG9uUG9wU3RhdGUpXG4gIH0gZWxzZSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCByZXdyaXRlQW5jaG9yUm9vdClcbiAgfVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQva25vY2tvdXQnLFxuICAgIHRpdGxlOiBcIkdpdHRlclwiLFxuICAgIGljb246IFwiZmEtY29tbWVudHMtb1wifSxcbiAgeyBocmVmOiAnbGVnYWN5LycsXG4gICAgdGl0bGU6IFwiTGVnYWN5IHdlYnNpdGVcIixcbiAgICBpY29uOiBcImZhIGZhLWhpc3RvcnlcIn1cbl1cblxud2luZG93LmdpdGh1YkxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiUmVwb3NpdG9yeVwiLFxuICAgIGljb246IFwiZmEtZ2l0aHViXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy9cIixcbiAgICB0aXRsZTogXCJJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3JlbGVhc2VzJyxcbiAgICB0aXRsZTogXCJSZWxlYXNlc1wiLFxuICAgIGljb246IFwiZmEtY2VydGlmaWNhdGVcIn1cbl1cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=