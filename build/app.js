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

    // --- static info ---
    this.plugins = new PluginManager();
    this.books = ko.observableArray([]);

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
  }, {
    key: 'registerBooks',
    value: function registerBooks(books) {
      this.books(Object.keys(books).map(function (key) {
        return books[key];
      }));
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
      if (this.savedTitle && this.query() !== null) {
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

var animationEvent = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

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
        var html = $(templateNode).html();
        $element.html('<div class=\'main-animated\'>' + html + '</div>');

        // See: http://stackoverflow.com/questions/9255279
        $element.one(animationEvent, function () {
          // Fake a scroll event so our `isAlmostInView`
          $(window).trigger("scroll");
        });

        ko.applyBindingsToDescendants(bindingContext, element);
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
    whenAlmostInView(element, function () {
      return setupEditor(element, 'javascript', va());
    });
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    // Defer so the page rendering is faster
    // TODO: Wait until in view http://stackoverflow.com/a/7557433/19212
    whenAlmostInView(element, function () {
      return setupEditor(element, 'html', va());
    });
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
    whenAlmostInView(element, function () {
      return ko.bindingHandlers.highlight.setup(element, va);
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
    whenAlmostInView(element, function () {
      return ko.bindingHandlers.result.setup(element, va);
    });
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

function getBooks() {
  return Promise.resolve($.ajax({
    url: 'build/books.json',
    dataType: 'json'
  })).then(function (results) {
    return $root.registerBooks(results);
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
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  if (location.pathname.indexOf('.html') === -1) {
    window.$root.open("intro");
  }
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(Documentation.initialize).then(applyBindings).then(getExamples).then(loadAPI).then(getPlugins).then(getBooks).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)['catch'](function (err) {
    window.$root.body("error");
    window.$root.errorMessage(err.message || err);
    console.error(err);
  });
}

$(start);
/*global setupEvents*/
/* eslint no-unused-vars: 0 */

'use strict';

var SCROLL_DEBOUNCE = 200;

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
  anchor.href = ('' + anchorRoot + anchor.pathname).replace('//', '/');
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
      $root.search.query(null);
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
  $(window).on('scroll', throttle(checkItemsInView, SCROLL_DEBOUNCE));
}
"use strict";

var inViewWatch = new Map();

// SEe also http://stackoverflow.com/a/7557433/19212
function isAlmostInView(el) {
  var rect = el.getBoundingClientRect();
  var winHeight = window.innerHeight || document.documentElement.clientHeight;

  // Items are almost in view when we've scrolled down to 200px above their
  // presence on the page i.e. just before the user gets to them.
  return rect.top < winHeight + 200;
}

function checkItemsInView() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = inViewWatch.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      if (isAlmostInView(element)) {
        // Invoke the callback.
        inViewWatch.get(element)();
        inViewWatch["delete"](element);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

// Schedule the callback for when the element comes into view.
// This is in some ways a poor man's requestIdleCallback
// https://developers.google.com/web/updates/2015/08/27/using-requestidlecallback
function whenAlmostInView(element, callback) {
  if (isAlmostInView(element)) {
    setTimeout(callback, 1);
  } else {
    inViewWatch.set(element, callback);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      inViewWatch["delete"](element);
    });
  }
}
"use strict";

ko.filters.dateFormat = function (dateString) {
  var format = arguments.length <= 1 || arguments[1] === undefined ? "MMM Do YYYY" : arguments[1];

  return moment(dateString).format(format);
};
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
//
// Simple throttle.
//

"use strict";

function throttle(fn, interval) {
  var isWaiting = false;

  var wrap = function throttled() {
    if (isWaiting) {
      return;
    }
    isWaiting = true;
    setTimeout(function () {
      isWaiting = false;
      fn();
    }, interval);
  };

  return wrap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJpc0luVmlldy5qcyIsImtvZmlsdGVycy5qcyIsInNldHRpbmdzLmpzIiwidGhyb3R0bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQVVNLEdBQUc7QUFDSSxXQURQLEdBQUcsQ0FDSyxJQUFJLEVBQUU7MEJBRGQsR0FBRzs7QUFFTCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUN6QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtBQUNoQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNqRDs7ZUFURyxHQUFHOztXQVdDLGtCQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDckIsa0JBQVUsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLFVBQUssSUFBSSxDQUFFO0tBQzFDOzs7U0FiRyxH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LENBQUE7R0FDYixDQUFBOztBQUVELFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gQVBJIGNvbnZlcnRzIHRoZSBgb3BpbmVgLWZsYXZvdXJlZCBkb2N1bWVudGF0aW9uIGhlcmUuXG5cbiBIZXJlIGlzIGEgc2FtcGxlOlxuKi9cbi8vIC8qLS0tXG4vLyAgcHVycG9zZToga25vY2tvdXQtd2lkZSBzZXR0aW5nc1xuLy8gICovXG4vLyB2YXIgc2V0dGluZ3MgPSB7IC8qLi4uKi8gfVxuXG5jbGFzcyBBUEkge1xuICBjb25zdHJ1Y3RvcihzcGVjKSB7XG4gICAgdGhpcy50eXBlID0gc3BlYy50eXBlXG4gICAgdGhpcy5uYW1lID0gc3BlYy5uYW1lXG4gICAgdGhpcy5zb3VyY2UgPSBzcGVjLnNvdXJjZVxuICAgIHRoaXMubGluZSA9IHNwZWMubGluZVxuICAgIHRoaXMucHVycG9zZSA9IHNwZWMudmFycy5wdXJwb3NlXG4gICAgdGhpcy5zcGVjID0gc3BlYy52YXJzLnBhcmFtc1xuICAgIHRoaXMudXJsID0gdGhpcy5idWlsZFVybChzcGVjLnNvdXJjZSwgc3BlYy5saW5lKVxuICB9XG5cbiAgYnVpbGRVcmwoc291cmNlLCBsaW5lKSB7XG4gICAgcmV0dXJuIGAke0FQSS51cmxSb290fSR7c291cmNlfSNMJHtsaW5lfWBcbiAgfVxufVxuXG5BUEkudXJsUm9vdCA9IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2Jsb2IvbWFzdGVyL1wiXG5cblxuQVBJLml0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcblxuQVBJLmFkZCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBjb25zb2xlLmxvZyhcIlRcIiwgdG9rZW4pXG4gIEFQSS5pdGVtcy5wdXNoKG5ldyBBUEkodG9rZW4pKVxufVxuIiwiXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIHRpdGxlLCBjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICB0aGlzLnN1YmNhdGVnb3J5ID0gc3ViY2F0ZWdvcnlcbiAgfVxufVxuXG5Eb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXAgPSB7XG4gIDE6IFwiR2V0dGluZyBzdGFydGVkXCIsXG4gIDI6IFwiT2JzZXJ2YWJsZXNcIixcbiAgMzogXCJCaW5kaW5ncyBhbmQgQ29tcG9uZW50c1wiLFxuICA0OiBcIkJpbmRpbmdzIGluY2x1ZGVkXCIsXG4gIDU6IFwiRnVydGhlciBpbmZvcm1hdGlvblwiXG59XG5cbkRvY3VtZW50YXRpb24uZnJvbU5vZGUgPSBmdW5jdGlvbiAoaSwgbm9kZSkge1xuICByZXR1cm4gbmV3IERvY3VtZW50YXRpb24oXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJjYXQnKVxuICApXG59XG5cbkRvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgRG9jdW1lbnRhdGlvbi5hbGwgPSAkLm1ha2VBcnJheShcbiAgICAkKFwiW2RhdGEta2luZD1kb2N1bWVudGF0aW9uXVwiKS5tYXAoRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSlcbiAgKVxufVxuIiwiXG5cbmNsYXNzIEV4YW1wbGUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSA9IHt9KSB7XG4gICAgdmFyIGRlYm91bmNlID0geyB0aW1lb3V0OiA1MDAsIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIiB9XG4gICAgdGhpcy5qYXZhc2NyaXB0ID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5qYXZhc2NyaXB0KVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5odG1sID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5odG1sKVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5jc3MgPSBzdGF0ZS5jc3MgfHwgJydcblxuICAgIHRoaXMuZmluYWxKYXZhc2NyaXB0ID0ga28ucHVyZUNvbXB1dGVkKHRoaXMuY29tcHV0ZUZpbmFsSnMsIHRoaXMpXG4gIH1cblxuICAvLyBBZGQga28uYXBwbHlCaW5kaW5ncyBhcyBuZWVkZWQ7IHJldHVybiBFcnJvciB3aGVyZSBhcHByb3ByaWF0ZS5cbiAgY29tcHV0ZUZpbmFsSnMoKSB7XG4gICAgdmFyIGpzID0gdGhpcy5qYXZhc2NyaXB0KClcbiAgICBpZiAoIWpzKSB7IHJldHVybiBuZXcgRXJyb3IoXCJUaGUgc2NyaXB0IGlzIGVtcHR5LlwiKSB9XG4gICAgaWYgKGpzLmluZGV4T2YoJ2tvLmFwcGx5QmluZGluZ3MoJykgPT09IC0xKSB7XG4gICAgICBpZiAoanMuaW5kZXhPZignIHZpZXdNb2RlbCA9JykgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGd1ZXNzIHRoZSB2aWV3TW9kZWwgbmFtZSAuLi5cbiAgICAgICAgcmV0dXJuIGAke2pzfVxcblxcbi8qIEF1dG9tYXRpY2FsbHkgQWRkZWQgKi9cbiAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHZpZXdNb2RlbCk7YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3ModmlldykgaXMgbm90IGNhbGxlZFwiKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNcbiAgfVxufVxuXG5FeGFtcGxlLnN0YXRlTWFwID0gbmV3IE1hcCgpXG5cbkV4YW1wbGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHN0YXRlID0gbmV3IEV4YW1wbGUobmFtZSlcbiAgICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBzdGF0ZSlcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuXG5FeGFtcGxlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCBzdGF0ZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmIChleGFtcGxlKSB7XG4gICAgZXhhbXBsZS5qYXZhc2NyaXB0KHN0YXRlLmphdmFzY3JpcHQpXG4gICAgZXhhbXBsZS5odG1sKHN0YXRlLmh0bWwpXG4gICAgcmV0dXJuXG4gIH1cbiAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgbmV3IEV4YW1wbGUoc3RhdGUpKVxufVxuIiwiLypnbG9iYWxzIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCwgY2FtZWxjYXNlOjAqL1xuXG52YXIgRVhURVJOQUxfSU5DTFVERVMgPSBbXG4gIFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCIsXG4gIFwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9tYmVzdC9rbm9ja291dC5wdW5jaGVzL3YwLjUuMS9rbm9ja291dC5wdW5jaGVzLmpzXCJcbl1cblxuY2xhc3MgTGl2ZUV4YW1wbGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLmlkKSB7XG4gICAgICB0aGlzLmV4YW1wbGUgPSBFeGFtcGxlLmdldChrby51bndyYXAocGFyYW1zLmlkKSlcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5iYXNlNjQpIHtcbiAgICAgIHZhciBvcHRzID1cbiAgICAgIHRoaXMuZXhhbXBsZSA9IG5ldyBFeGFtcGxlKEpTT04ucGFyc2UoYXRvYihwYXJhbXMuYmFzZTY0KSkpXG4gICAgfVxuICAgIGlmICghdGhpcy5leGFtcGxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeGFtcGxlIG11c3QgYmUgcHJvdmlkZWQgYnkgaWQgb3IgYmFzZTY0IHBhcmFtZXRlclwiKVxuICAgIH1cbiAgfVxuXG4gIG9wZW5Db21tb25TZXR0aW5ncygpIHtcbiAgICB2YXIgZXggPSB0aGlzLmV4YW1wbGVcbiAgICB2YXIgZGF0ZWQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICB2YXIganNQcmVmaXggPSBgLyoqXG4gKiBDcmVhdGVkIGZyb20gYW4gZXhhbXBsZSBvbiB0aGUgS25vY2tvdXQgd2Vic2l0ZVxuICogb24gJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9XG4gKiovXG5cbiAvKiBGb3IgY29udmVuaWVuY2UgYW5kIGNvbnNpc3RlbmN5IHdlJ3ZlIGVuYWJsZWQgdGhlIGtvXG4gICogcHVuY2hlcyBsaWJyYXJ5IGZvciB0aGlzIGV4YW1wbGUuXG4gICovXG4ga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuXG4gLyoqIEV4YW1wbGUgaXMgYXMgZm9sbG93cyAqKi9cbmBcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogZXguaHRtbCgpLFxuICAgICAganM6IGpzUHJlZml4ICsgZXguZmluYWxKYXZhc2NyaXB0KCksXG4gICAgICB0aXRsZTogYEZyb20gS25vY2tvdXQgZXhhbXBsZWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkLCBTZWFyY2gsIFBsdWdpbk1hbmFnZXIgKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gLS0tIE1haW4gYm9keSB0ZW1wbGF0ZSBpZCAtLS1cbiAgICB0aGlzLmJvZHkgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5ib2R5LnN1YnNjcmliZSh0aGlzLm9uQm9keUNoYW5nZSwgdGhpcylcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBzdGF0aWMgaW5mbyAtLS1cbiAgICB0aGlzLnBsdWdpbnMgPSBuZXcgUGx1Z2luTWFuYWdlcigpXG4gICAgdGhpcy5ib29rcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSlcblxuICAgIC8vIC0tLSBkb2N1bWVudGF0aW9uIC0tLVxuICAgIHRoaXMuZG9jQ2F0TWFwID0gbmV3IE1hcCgpXG4gICAgRG9jdW1lbnRhdGlvbi5hbGwuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG4gICAgICB2YXIgY2F0ID0gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW2RvYy5jYXRlZ29yeV1cbiAgICAgIHZhciBkb2NMaXN0ID0gdGhpcy5kb2NDYXRNYXAuZ2V0KGNhdClcbiAgICAgIGlmICghZG9jTGlzdCkge1xuICAgICAgICBkb2NMaXN0ID0gW11cbiAgICAgICAgdGhpcy5kb2NDYXRNYXAuc2V0KGNhdCwgZG9jTGlzdClcbiAgICAgIH1cbiAgICAgIGRvY0xpc3QucHVzaChkb2MpXG4gICAgfSwgdGhpcylcblxuICAgIC8vIFNvcnQgdGhlIGRvY3VtZW50YXRpb24gaXRlbXNcbiAgICBmdW5jdGlvbiBzb3J0ZXIoYSwgYikge1xuICAgICAgcmV0dXJuIGEudGl0bGUubG9jYWxlQ29tcGFyZShiLnRpdGxlKVxuICAgIH1cbiAgICBmb3IgKHZhciBsaXN0IG9mIHRoaXMuZG9jQ2F0TWFwLnZhbHVlcygpKSB7IGxpc3Quc29ydChzb3J0ZXIpIH1cblxuICAgIC8vIGRvY0NhdHM6IEEgc29ydGVkIGxpc3Qgb2YgdGhlIGRvY3VtZW50YXRpb24gc2VjdGlvbnNcbiAgICB0aGlzLmRvY0NhdHMgPSBPYmplY3Qua2V5cyhEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXApXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbdl0gfSlcblxuICAgIC8vIC0tLSBzZWFyY2hpbmcgLS0tXG4gICAgdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoKClcblxuICAgIC8vIC0tLSBwYWdlIGxvYWRpbmcgc3RhdHVzIC0tLVxuICAgIC8vIGFwcGxpY2F0aW9uQ2FjaGUgcHJvZ3Jlc3NcbiAgICB0aGlzLnJlbG9hZFByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5jYWNoZUlzVXBkYXRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpXG5cbiAgICAvLyBwYWdlIGxvYWRpbmcgZXJyb3JcbiAgICB0aGlzLmVycm9yTWVzc2FnZSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgLy8gUHJlZmVyZW5jZSBmb3Igbm9uLVNpbmdsZSBQYWdlIEFwcFxuICAgIHZhciBscyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB0aGlzLm5vU1BBID0ga28ub2JzZXJ2YWJsZShCb29sZWFuKGxzICYmIGxzLmdldEl0ZW0oJ25vU1BBJykpKVxuICAgIHRoaXMubm9TUEEuc3Vic2NyaWJlKCh2KSA9PiBscyAmJiBscy5zZXRJdGVtKCdub1NQQScsIHYgfHwgXCJcIikpXG4gIH1cblxuICBwYXRoVG9UZW1wbGF0ZShwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5wb3AoKS5yZXBsYWNlKCcuaHRtbCcsICcnKVxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIGNvbnNvbGUubG9nKFwiIPCfk7AgIFwiICsgdGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gICAgdGhpcy5ib2R5KHRoaXMucGF0aFRvVGVtcGxhdGUocGlucG9pbnQpKVxuICB9XG5cbiAgb25Cb2R5Q2hhbmdlKHRlbXBsYXRlSWQpIHtcbiAgICBpZiAodGVtcGxhdGVJZCkge1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKVxuICAgICAgdGhpcy50aXRsZShub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8ICcnKVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyUGx1Z2lucyhwbHVnaW5zKSB7XG4gICAgdGhpcy5wbHVnaW5zLnJlZ2lzdGVyKHBsdWdpbnMpXG4gIH1cblxuICByZWdpc3RlckJvb2tzKGJvb2tzKSB7XG4gICAgdGhpcy5ib29rcyhPYmplY3Qua2V5cyhib29rcykubWFwKGtleSA9PiBib29rc1trZXldKSlcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBbMiwge1widmFyc1wiOiBcImxvY2FsXCJ9XSovXG5cbmNsYXNzIFBsdWdpbk1hbmFnZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wbHVnaW5SZXBvcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG4gICAgdGhpcy5zb3J0ZWRQbHVnaW5SZXBvcyA9IHRoaXMucGx1Z2luUmVwb3NcbiAgICAgIC5maWx0ZXIodGhpcy5maWx0ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5zb3J0QnkodGhpcy5zb3J0QnkuYmluZCh0aGlzKSlcbiAgICAgIC5tYXAodGhpcy5uYW1lVG9JbnN0YW5jZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLm5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcbiAgfVxuXG4gIHJlZ2lzdGVyKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgZmlsdGVyKHJlcG8pIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luc0xvYWRlZCgpKSB7IHJldHVybiBmYWxzZSB9XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLm5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBzb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG5cbiAgbmFtZVRvSW5zdGFuY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hcC5nZXQobmFtZSlcbiAgfVxufVxuIiwiXG5jbGFzcyBTZWFyY2hSZXN1bHQge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMubGluayA9IGAvYS8ke3RlbXBsYXRlLmlkfS5odG1sYFxuICAgIHRoaXMudGl0bGUgPSB0ZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCBg4oCcJHt0ZW1wbGF0ZS5pZH3igJ1gXG4gIH1cbn1cblxuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgc2VhcmNoUmF0ZSA9IHtcbiAgICAgIHRpbWVvdXQ6IDUwMCxcbiAgICAgIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIlxuICAgIH1cbiAgICB0aGlzLnF1ZXJ5ID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBzZWFyY2hSYXRlfSlcbiAgICB0aGlzLnJlc3VsdHMgPSBrby5jb21wdXRlZCh0aGlzLmNvbXB1dGVSZXN1bHRzLCB0aGlzKVxuICAgIHRoaXMucXVlcnkuc3Vic2NyaWJlKHRoaXMub25RdWVyeUNoYW5nZSwgdGhpcylcbiAgICB0aGlzLnByb2dyZXNzID0ga28ub2JzZXJ2YWJsZSgpXG4gIH1cblxuICBjb21wdXRlUmVzdWx0cygpIHtcbiAgICB2YXIgcSA9ICh0aGlzLnF1ZXJ5KCkgfHwgJycpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBbXSB9XG4gICAgcmV0dXJuICQoYHRlbXBsYXRlYClcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzLmNvbnRlbnQpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG5cbiAgc2F2ZVRlbXBsYXRlKCkge1xuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09ICdzZWFyY2gnKSB7XG4gICAgICB0aGlzLnNhdmVkVGVtcGxhdGUgPSAkcm9vdC5ib2R5KClcbiAgICAgIHRoaXMuc2F2ZWRUaXRsZSA9IGRvY3VtZW50LnRpdGxlXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVRlbXBsYXRlKCkge1xuICAgIGlmICh0aGlzLnNhdmVkVGl0bGUgJiYgdGhpcy5xdWVyeSgpICE9PSBudWxsKSB7XG4gICAgICAkcm9vdC5ib2R5KHRoaXMuc2F2ZWRUZW1wbGF0ZSlcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5zYXZlZFRpdGxlXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSgpIHtcbiAgICBpZiAoISh0aGlzLnF1ZXJ5KCkgfHwgJycpLnRyaW0oKSkge1xuICAgICAgdGhpcy5yZXN0b3JlVGVtcGxhdGUoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuc2F2ZVRlbXBsYXRlKClcbiAgICAkcm9vdC5ib2R5KFwic2VhcmNoXCIpXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTIFNlYXJjaCDigJwke3RoaXMucXVlcnkoKX3igJ1gXG4gIH1cbn1cbiIsIi8vXG4vLyBhbmltYXRlZCB0ZW1wbGF0ZSBiaW5kaW5nXG4vLyAtLS1cbi8vIFdhaXRzIGZvciBDU1MzIHRyYW5zaXRpb25zIHRvIGNvbXBsZXRlIG9uIGNoYW5nZSBiZWZvcmUgbW92aW5nIHRvIHRoZSBuZXh0LlxuLy9cblxudmFyIGFuaW1hdGlvbkV2ZW50ID0gJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQgb0FuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCdcblxua28uYmluZGluZ0hhbmRsZXJzLmFuaW1hdGVkVGVtcGxhdGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBpZ24xLCBpZ24yLCBiaW5kaW5nQ29udGV4dCkge1xuICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICB2YXIgb2JzID0gdmFsdWVBY2Nlc3NvcigpXG5cbiAgICB2YXIgb25UZW1wbGF0ZUNoYW5nZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZUlkXykge1xuICAgICAgdmFyIHRlbXBsYXRlSWQgPSAodGVtcGxhdGVJZF8gfHwgJycpLnJlcGxhY2UoJyMnLCAnJylcbiAgICAgIHZhciB0ZW1wbGF0ZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKVxuICAgICAgaWYgKCF0ZW1wbGF0ZUlkKSB7XG4gICAgICAgICRlbGVtZW50LmVtcHR5KClcbiAgICAgIH0gZWxzZSBpZiAoIXRlbXBsYXRlTm9kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIHRlbXBsYXRlIGJ5IGlkOiAke3RlbXBsYXRlSWR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBodG1sID0gJCh0ZW1wbGF0ZU5vZGUpLmh0bWwoKVxuICAgICAgICAkZWxlbWVudC5odG1sKGA8ZGl2IGNsYXNzPSdtYWluLWFuaW1hdGVkJz4ke2h0bWx9PC9kaXY+YClcblxuICAgICAgICAvLyBTZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTI1NTI3OVxuICAgICAgICAkZWxlbWVudC5vbmUoYW5pbWF0aW9uRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBGYWtlIGEgc2Nyb2xsIGV2ZW50IHNvIG91ciBgaXNBbG1vc3RJblZpZXdgXG4gICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoXCJzY3JvbGxcIilcbiAgICAgICAgfSlcblxuICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhiaW5kaW5nQ29udGV4dCwgZWxlbWVudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3VicyA9IG9icy5zdWJzY3JpYmUob25UZW1wbGF0ZUNoYW5nZSlcbiAgICBvblRlbXBsYXRlQ2hhbmdlKGtvLnVud3JhcChvYnMpKVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBzdWJzLmRpc3Bvc2UoKVxuICAgIH0pXG5cbiAgICByZXR1cm4geyBjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZSB9XG4gIH1cbn1cbiIsIlxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG5mdW5jdGlvbiBzZXR1cEVkaXRvcihlbGVtZW50LCBsYW5ndWFnZSwgZXhhbXBsZU5hbWUpIHtcbiAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAoZXhhbXBsZU5hbWUpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgKCkgPT4gc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICAvLyBEZWZlciBzbyB0aGUgcGFnZSByZW5kZXJpbmcgaXMgZmFzdGVyXG4gICAgLy8gVE9ETzogV2FpdCB1bnRpbCBpbiB2aWV3IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzMvMTkyMTJcbiAgICB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsICgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuIiwiXG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInRvbW9ycm93XCJcbn1cblxudmFyIGVtYXAgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCdcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAvJmFtcDt8Jmx0Oy9nLFxuICAgIGZ1bmN0aW9uIChlbnQpIHsgcmV0dXJuIGVtYXBbZW50XX1cbiAgKVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0ID0ge1xuICBzZXR1cDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBsYW5ndWFnZSA9IHZhKClcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdodG1sJyAmJiBsYW5ndWFnZSAhPT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQSBsYW5ndWFnZSBzaG91bGQgYmUgc3BlY2lmaWVkLlwiLCBlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gdW5lc2NhcGUoJGUudGV4dCgpKVxuICAgICRlLmVtcHR5KClcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3JlYWRvbmx5VGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gICAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogZmFsc2UsXG4gICAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDIsXG4gICAgICBtaW5MaW5lczogMSxcbiAgICAgIHdyYXA6IHRydWUsXG4gICAgICBtYXhMaW5lczogMzUsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG4gICAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbnRlbnQpXG4gICAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgd2hlbkFsbW9zdEluVmlldyhlbGVtZW50LCAoKSA9PiBrby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0LnNldHVwKGVsZW1lbnQsIHZhKSlcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLW5ldy1mdW5jOiAwICovXG5cbi8vIFNhdmUgYSBjb3B5IGZvciByZXN0b3JhdGlvbi91c2VcbmtvLm9yaWdpbmFsQXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcbmtvLmNvbXBvbmVudHMub3JpZ2luYWxSZWdpc3RlciA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXJcblxuXG5rby5iaW5kaW5nSGFuZGxlcnMucmVzdWx0ID0ge1xuICBpbml0OiBmdW5jdGlvbihlbGVtZW50LCB2YSkge1xuICAgIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgKCkgPT4ga28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdC5zZXR1cChlbGVtZW50LCB2YSkpXG4gIH0sXG4gIHNldHVwOiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAodmEoKSlcbiAgICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHMgPSBuZXcgU2V0KClcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZha2VSZWdpc3RlcihuYW1lLCBzZXR0aW5ncykge1xuICAgICAga28uY29tcG9uZW50cy5vcmlnaW5hbFJlZ2lzdGVyKG5hbWUsIHNldHRpbmdzKVxuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuYWRkKG5hbWUpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJDb21wb25lbnRSZWdpc3RlcigpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmZvckVhY2goKHYpID0+IGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcih2KSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZha2VSZWdpc3RlclxuXG4gICAgICB0cnkge1xuICAgICAgICByZXNldEVsZW1lbnQoKVxuICAgICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG52YXIgbmF0aXZlVGVtcGxhdGluZyA9ICdjb250ZW50JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG5cblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYXRpdmVUZW1wbGF0aW5nKSB7XG4gICAgICAgICAgLy8gUG9seWZpbGwgdGhlIDx0ZW1wbGF0ZT4gdGFnIGZyb20gdGhlIHRlbXBsYXRlcyB3ZSBsb2FkLlxuICAgICAgICAgIC8vIEZvciBhIG1vcmUgaW52b2x2ZWQgcG9seWZpbGwsIHNlZSBlLmcuXG4gICAgICAgICAgLy8gICBodHRwOi8vanNmaWRkbGUubmV0L2JyaWFuYmxha2VseS9oM0VtWS9cbiAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvP3RlbXBsYXRlL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gXCI8dGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjxzY3JpcHQgdHlwZT0ndGV4dC94LXRlbXBsYXRlJ1wiXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPC9zY3JpcHRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuSURMRSkgeyBhYy51cGRhdGUoKSB9XG4gIHNldFRpbWVvdXQocmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUsIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5mdW5jdGlvbiBnZXRCb29rcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2Jvb2tzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpXG4gIC50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlckJvb2tzKHJlc3VsdHMpKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkZWQoKSB7XG4gIGlmIChsb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcuaHRtbCcpID09PSAtMSkge1xuICAgIHdpbmRvdy4kcm9vdC5vcGVuKFwiaW50cm9cIilcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oZ2V0RXhhbXBsZXMpXG4gICAgLnRoZW4obG9hZEFQSSlcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKGdldEJvb2tzKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgd2luZG93LiRyb290LmJvZHkoXCJlcnJvclwiKVxuICAgICAgd2luZG93LiRyb290LmVycm9yTWVzc2FnZShlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICB9KVxufVxuXG4kKHN0YXJ0KVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbnZhciBTQ1JPTExfREVCT1VOQ0UgPSAyMDBcblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5ocmVmID0gYCR7YW5jaG9yUm9vdH0ke2FuY2hvci5wYXRobmFtZX1gLnJlcGxhY2UoJy8vJywgJy8nKVxuICByZXR1cm4gdHJ1ZVxufVxuXG5cbmZ1bmN0aW9uIHNjcm9sbFRvSGFzaChhbmNob3IpIHtcbiAgaWYgKCFhbmNob3IuaGFzaCkge1xuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgLy8gV2Ugbm9ybWFsaXplIHRoZSBsaW5rcyDigJMgdGhlIGRvY3MgdXNlIF8gYW5kIC0gaW5jb25zaXN0ZW50bHkgYW5kXG4gICAgLy8gc2VlbWluZ2x5IGludGVyY2hhbmdlYWJseTsgd2UgY291bGQgZ28gdGhyb3VnaCBhbmQgc3BvdCBldmVyeSBkaWZmZXJlbmNlXG4gICAgLy8gYnV0IHRoaXMgaXMganVzdCBlYXNpZXIgZm9yIG5vdy5cbiAgICBhbmNob3IuaGFzaC5zdWJzdHJpbmcoMSkucmVwbGFjZSgvXy9nLCAnLScpXG4gIClcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEJhZCBhbmNob3I6ICR7YW5jaG9yLmhhc2h9IGZyb20gJHthbmNob3IuaHJlZn1gKVxuICB9XG4gIC8vIFdlIGRlZmVyIHVudGlsIHRoZSBsYXlvdXQgaXMgY29tcGxldGVkLlxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcFxuICAgIH0sIDE1MClcbiAgfSwgMTUpXG59XG5cbi8vXG4vLyBGb3IgSlMgaGlzdG9yeSBzZWU6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4vL1xuZnVuY3Rpb24gb25BbmNob3JDbGljayhldnQpIHtcbiAgdmFyIGFuY2hvciA9IHRoaXNcbiAgcmV3cml0ZUFuY2hvclJvb3QoZXZ0KVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG5cbiAgLy8gRG8gbm90IGludGVyY2VwdCBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChhbmNob3IpLnBhcmVudHMoXCJsaXZlLWV4YW1wbGVcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHRlbXBsYXRlSWQgPSAkcm9vdC5wYXRoVG9UZW1wbGF0ZShhbmNob3IucGF0aG5hbWUpXG4gICAgLy8gSWYgdGhlIHRlbXBsYXRlIGlzbid0IGZvdW5kLCBwcmVzdW1lIGEgaGFyZCBsaW5rXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gdGVtcGxhdGVJZCkge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLmhyZWYpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgJHskKHRoaXMpLnRleHQoKX1gXG4gICAgICAkcm9vdC5vcGVuKHRlbXBsYXRlSWQpXG4gICAgICAkcm9vdC5zZWFyY2gucXVlcnkobnVsbClcbiAgICB9XG4gICAgc2Nyb2xsVG9IYXNoKGFuY2hvcilcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7YW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpfWAsIGUpXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblxuZnVuY3Rpb24gb25Qb3BTdGF0ZSgvKiBldnQgKi8pIHtcbiAgLy8gTm90ZSBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gIGlmICgkcm9vdC5ub1NQQSgpKSB7IHJldHVybiB9XG4gICRyb290Lm9wZW4obG9jYXRpb24ucGF0aG5hbWUpXG59XG5cblxuZnVuY3Rpb24gc2V0dXBFdmVudHMoKSB7XG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIFwiYVwiLCBvbkFuY2hvckNsaWNrKVxuICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCBvblBvcFN0YXRlKVxuICB9IGVsc2Uge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgcmV3cml0ZUFuY2hvclJvb3QpXG4gIH1cbiAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aHJvdHRsZShjaGVja0l0ZW1zSW5WaWV3LCBTQ1JPTExfREVCT1VOQ0UpKVxufVxuIiwiXG5cbnZhciBpblZpZXdXYXRjaCA9IG5ldyBNYXAoKVxuXG5cbi8vIFNFZSBhbHNvIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzMvMTkyMTJcbmZ1bmN0aW9uIGlzQWxtb3N0SW5WaWV3KGVsKSB7XG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgdmFyIHdpbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgLy8gSXRlbXMgYXJlIGFsbW9zdCBpbiB2aWV3IHdoZW4gd2UndmUgc2Nyb2xsZWQgZG93biB0byAyMDBweCBhYm92ZSB0aGVpclxuICAvLyBwcmVzZW5jZSBvbiB0aGUgcGFnZSBpLmUuIGp1c3QgYmVmb3JlIHRoZSB1c2VyIGdldHMgdG8gdGhlbS5cbiAgcmV0dXJuIHJlY3QudG9wIDwgd2luSGVpZ2h0ICsgMjAwXG59XG5cblxuZnVuY3Rpb24gY2hlY2tJdGVtc0luVmlldygpIHtcbiAgZm9yICh2YXIgZWxlbWVudCBvZiBpblZpZXdXYXRjaC5rZXlzKCkpIHtcbiAgICBpZiAoaXNBbG1vc3RJblZpZXcoZWxlbWVudCkpIHtcbiAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2suXG4gICAgICBpblZpZXdXYXRjaC5nZXQoZWxlbWVudCkoKVxuICAgICAgaW5WaWV3V2F0Y2guZGVsZXRlKGVsZW1lbnQpXG4gICAgfVxuICB9XG59XG5cblxuLy8gU2NoZWR1bGUgdGhlIGNhbGxiYWNrIGZvciB3aGVuIHRoZSBlbGVtZW50IGNvbWVzIGludG8gdmlldy5cbi8vIFRoaXMgaXMgaW4gc29tZSB3YXlzIGEgcG9vciBtYW4ncyByZXF1ZXN0SWRsZUNhbGxiYWNrXG4vLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdXBkYXRlcy8yMDE1LzA4LzI3L3VzaW5nLXJlcXVlc3RpZGxlY2FsbGJhY2tcbmZ1bmN0aW9uIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgaWYgKGlzQWxtb3N0SW5WaWV3KGVsZW1lbnQpKSB7XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMSlcbiAgfSBlbHNlIHtcbiAgICBpblZpZXdXYXRjaC5zZXQoZWxlbWVudCwgY2FsbGJhY2spXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBpblZpZXdXYXRjaC5kZWxldGUoZWxlbWVudClcbiAgICB9KVxuICB9XG59XG4iLCJcblxua28uZmlsdGVycy5kYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGVTdHJpbmcsIGZvcm1hdCA9IFwiTU1NIERvIFlZWVlcIikge1xuICByZXR1cm4gbW9tZW50KGRhdGVTdHJpbmcpLmZvcm1hdChmb3JtYXQpXG59XG4iLCJcbndpbmRvdy5saW5rcyA9IFtcbiAgeyBocmVmOiBcImh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFmb3J1bS9rbm9ja291dGpzXCIsXG4gICAgdGl0bGU6IFwiR29vZ2xlIEdyb3Vwc1wiLFxuICAgIGljb246IFwiZmEtZ29vZ2xlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3RhZ3Mva25vY2tvdXQuanMvaW5mb1wiLFxuICAgIHRpdGxlOiBcIlN0YWNrT3ZlcmZsb3dcIixcbiAgICBpY29uOiBcImZhLXN0YWNrLW92ZXJmbG93XCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdHRlci5pbS9rbm9ja291dC9rbm9ja291dCcsXG4gICAgdGl0bGU6IFwiR2l0dGVyXCIsXG4gICAgaWNvbjogXCJmYS1jb21tZW50cy1vXCJ9LFxuICB7IGhyZWY6ICdsZWdhY3kvJyxcbiAgICB0aXRsZTogXCJMZWdhY3kgd2Vic2l0ZVwiLFxuICAgIGljb246IFwiZmEgZmEtaGlzdG9yeVwifVxuXVxuXG53aW5kb3cuZ2l0aHViTGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIklzc3Vlc1wiLFxuICAgIGljb246IFwiZmEtZXhjbGFtYXRpb24tY2lyY2xlXCJ9LFxuICB7IGhyZWY6ICdodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvcmVsZWFzZXMnLFxuICAgIHRpdGxlOiBcIlJlbGVhc2VzXCIsXG4gICAgaWNvbjogXCJmYS1jZXJ0aWZpY2F0ZVwifVxuXVxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0IENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmUgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1kZWJ1Zy5qc1wiXG4gIH1cbl1cbiIsIi8vXG4vLyBTaW1wbGUgdGhyb3R0bGUuXG4vL1xuXG5mdW5jdGlvbiB0aHJvdHRsZShmbiwgaW50ZXJ2YWwpIHtcbiAgdmFyIGlzV2FpdGluZyA9IGZhbHNlXG5cbiAgdmFyIHdyYXAgPSBmdW5jdGlvbiB0aHJvdHRsZWQoKSB7XG4gICAgaWYgKGlzV2FpdGluZykgeyByZXR1cm4gfVxuICAgIGlzV2FpdGluZyA9IHRydWVcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzV2FpdGluZyA9IGZhbHNlXG4gICAgICBmbigpXG4gICAgfSwgaW50ZXJ2YWwpXG4gIH1cblxuICByZXR1cm4gd3JhcFxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9