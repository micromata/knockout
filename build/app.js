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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJpc0luVmlldy5qcyIsInNldHRpbmdzLmpzIiwidGhyb3R0bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQVVNLEdBQUc7QUFDSSxXQURQLEdBQUcsQ0FDSyxJQUFJLEVBQUU7MEJBRGQsR0FBRzs7QUFFTCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUN6QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtBQUNoQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNqRDs7ZUFURyxHQUFHOztXQVdDLGtCQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDckIsa0JBQVUsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLFVBQUssSUFBSSxDQUFFO0tBQzFDOzs7U0FiRyxHQUFHOzs7QUFnQlQsR0FB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RSx5RUFBeUU7Q0FDakYsQ0FDRixDQUFBOzs7Ozs7O0FDbkNELFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7QUFDOUIsTUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFBOztBQUVyQixNQUFJLElBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUM5QixRQUFJLFNBQVMsRUFBRTtBQUFFLGFBQU07S0FBRTtBQUN6QixhQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGNBQVUsQ0FBQyxZQUFZO0FBQ3JCLGVBQVMsR0FBRyxLQUFLLENBQUE7QUFDakIsUUFBRSxFQUFFLENBQUE7S0FDTCxFQUFFLFFBQVEsQ0FBQyxDQUFBO0dBQ2IsQ0FBQTs7QUFFRCxTQUFPLElBQUksQ0FBQTtDQUNaIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEFQSSBjb252ZXJ0cyB0aGUgYG9waW5lYC1mbGF2b3VyZWQgZG9jdW1lbnRhdGlvbiBoZXJlLlxuXG4gSGVyZSBpcyBhIHNhbXBsZTpcbiovXG4vLyAvKi0tLVxuLy8gIHB1cnBvc2U6IGtub2Nrb3V0LXdpZGUgc2V0dGluZ3Ncbi8vICAqL1xuLy8gdmFyIHNldHRpbmdzID0geyAvKi4uLiovIH1cblxuY2xhc3MgQVBJIHtcbiAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZVxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZVxuICAgIHRoaXMuc291cmNlID0gc3BlYy5zb3VyY2VcbiAgICB0aGlzLmxpbmUgPSBzcGVjLmxpbmVcbiAgICB0aGlzLnB1cnBvc2UgPSBzcGVjLnZhcnMucHVycG9zZVxuICAgIHRoaXMuc3BlYyA9IHNwZWMudmFycy5wYXJhbXNcbiAgICB0aGlzLnVybCA9IHRoaXMuYnVpbGRVcmwoc3BlYy5zb3VyY2UsIHNwZWMubGluZSlcbiAgfVxuXG4gIGJ1aWxkVXJsKHNvdXJjZSwgbGluZSkge1xuICAgIHJldHVybiBgJHtBUEkudXJsUm9vdH0ke3NvdXJjZX0jTCR7bGluZX1gXG4gIH1cbn1cblxuQVBJLnVybFJvb3QgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9ibG9iL21hc3Rlci9cIlxuXG5cbkFQSS5pdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG5cbkFQSS5hZGQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY29uc29sZS5sb2coXCJUXCIsIHRva2VuKVxuICBBUEkuaXRlbXMucHVzaChuZXcgQVBJKHRva2VuKSlcbn1cbiIsIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgYW5kIENvbXBvbmVudHNcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiLFxuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5leGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHBhcmFtcy5pZCkpXG4gICAgfVxuICAgIGlmIChwYXJhbXMuYmFzZTY0KSB7XG4gICAgICB2YXIgb3B0cyA9XG4gICAgICB0aGlzLmV4YW1wbGUgPSBuZXcgRXhhbXBsZShKU09OLnBhcnNlKGF0b2IocGFyYW1zLmJhc2U2NCkpKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhhbXBsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhhbXBsZSBtdXN0IGJlIHByb3ZpZGVkIGJ5IGlkIG9yIGJhc2U2NCBwYXJhbWV0ZXJcIilcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4ID0gdGhpcy5leGFtcGxlXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgb24gdGhlIEtub2Nrb3V0IHdlYnNpdGVcbiAqIG9uICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfVxuICoqL1xuXG4gLyogRm9yIGNvbnZlbmllbmNlIGFuZCBjb25zaXN0ZW5jeSB3ZSd2ZSBlbmFibGVkIHRoZSBrb1xuICAqIHB1bmNoZXMgbGlicmFyeSBmb3IgdGhpcyBleGFtcGxlLlxuICAqL1xuIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcblxuIC8qKiBFeGFtcGxlIGlzIGFzIGZvbGxvd3MgKiovXG5gXG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWw6IGV4Lmh0bWwoKSxcbiAgICAgIGpzOiBqc1ByZWZpeCArIGV4LmZpbmFsSmF2YXNjcmlwdCgpLFxuICAgICAgdGl0bGU6IGBGcm9tIEtub2Nrb3V0IGV4YW1wbGVgLFxuICAgICAgZGVzY3JpcHRpb246IGBDcmVhdGVkIG9uICR7ZGF0ZWR9YFxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWRkbGUoc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vZG9jLmpzZmlkZGxlLm5ldC9hcGkvcG9zdC5odG1sXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGR0ZDogXCJIVE1MIDVcIixcbiAgICAgIHdyYXA6ICdsJyxcbiAgICAgIHJlc291cmNlczogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIixcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBmb3JtID0gJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2pzZmlkZGxlLm5ldC9hcGkvcG9zdC9saWJyYXJ5L3B1cmUvXCJcbiAgICAgIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDwvZm9ybT5gKVxuICAgICQuZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGZvcm0uYXBwZW5kKFxuICAgICAgICAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPScke2t9Jz5gKS52YWwodilcbiAgICAgIClcbiAgICB9KVxuXG4gICAgZm9ybS5zdWJtaXQoKVxuICB9XG5cbiAgb3BlblBlbihzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLmNvZGVwZW4uaW8vZG9jdW1lbnRhdGlvbi9hcGkvcHJlZmlsbC9cbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBvcHRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGpzX2V4dGVybmFsOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiO1wiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKVxuXG4gICAgJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2NvZGVwZW4uaW8vcGVuL2RlZmluZVwiIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J2RhdGEnIHZhbHVlPScke2RhdGFTdHJ9Jy8+XG4gICAgPC9mb3JtPmApLnN1Ym1pdCgpXG4gIH1cbn1cblxua28uY29tcG9uZW50cy5yZWdpc3RlcignbGl2ZS1leGFtcGxlJywge1xuICAgIHZpZXdNb2RlbDogTGl2ZUV4YW1wbGVDb21wb25lbnQsXG4gICAgdGVtcGxhdGU6IHtlbGVtZW50OiBcImxpdmUtZXhhbXBsZVwifVxufSlcbiIsIi8qZ2xvYmFsIFBhZ2UsIERvY3VtZW50YXRpb24sIG1hcmtlZCwgU2VhcmNoLCBQbHVnaW5NYW5hZ2VyICovXG4vKmVzbGludCBuby11bnVzZWQtdmFyczogMCovXG5cblxuY2xhc3MgUGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIC0tLSBNYWluIGJvZHkgdGVtcGxhdGUgaWQgLS0tXG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuYm9keS5zdWJzY3JpYmUodGhpcy5vbkJvZHlDaGFuZ2UsIHRoaXMpXG5cbiAgICAvLyAtLS0gZm9vdGVyIGxpbmtzL2NkbiAtLS1cbiAgICB0aGlzLmxpbmtzID0gd2luZG93LmxpbmtzXG4gICAgdGhpcy5jZG4gPSB3aW5kb3cuY2RuXG5cbiAgICAvLyAtLS0gcGx1Z2lucyAtLS1cbiAgICB0aGlzLnBsdWdpbnMgPSBuZXcgUGx1Z2luTWFuYWdlcigpXG5cbiAgICAvLyAtLS0gZG9jdW1lbnRhdGlvbiAtLS1cbiAgICB0aGlzLmRvY0NhdE1hcCA9IG5ldyBNYXAoKVxuICAgIERvY3VtZW50YXRpb24uYWxsLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgdmFyIGNhdCA9IERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFtkb2MuY2F0ZWdvcnldXG4gICAgICB2YXIgZG9jTGlzdCA9IHRoaXMuZG9jQ2F0TWFwLmdldChjYXQpXG4gICAgICBpZiAoIWRvY0xpc3QpIHtcbiAgICAgICAgZG9jTGlzdCA9IFtdXG4gICAgICAgIHRoaXMuZG9jQ2F0TWFwLnNldChjYXQsIGRvY0xpc3QpXG4gICAgICB9XG4gICAgICBkb2NMaXN0LnB1c2goZG9jKVxuICAgIH0sIHRoaXMpXG5cbiAgICAvLyBTb3J0IHRoZSBkb2N1bWVudGF0aW9uIGl0ZW1zXG4gICAgZnVuY3Rpb24gc29ydGVyKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnRpdGxlLmxvY2FsZUNvbXBhcmUoYi50aXRsZSlcbiAgICB9XG4gICAgZm9yICh2YXIgbGlzdCBvZiB0aGlzLmRvY0NhdE1hcC52YWx1ZXMoKSkgeyBsaXN0LnNvcnQoc29ydGVyKSB9XG5cbiAgICAvLyBkb2NDYXRzOiBBIHNvcnRlZCBsaXN0IG9mIHRoZSBkb2N1bWVudGF0aW9uIHNlY3Rpb25zXG4gICAgdGhpcy5kb2NDYXRzID0gT2JqZWN0LmtleXMoRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwKVxuICAgICAgLnNvcnQoKVxuICAgICAgLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW3ZdIH0pXG5cbiAgICAvLyAtLS0gc2VhcmNoaW5nIC0tLVxuICAgIHRoaXMuc2VhcmNoID0gbmV3IFNlYXJjaCgpXG5cbiAgICAvLyAtLS0gcGFnZSBsb2FkaW5nIHN0YXR1cyAtLS1cbiAgICAvLyBhcHBsaWNhdGlvbkNhY2hlIHByb2dyZXNzXG4gICAgdGhpcy5yZWxvYWRQcm9ncmVzcyA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuY2FjaGVJc1VwZGF0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKVxuXG4gICAgLy8gcGFnZSBsb2FkaW5nIGVycm9yXG4gICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIFByZWZlcmVuY2UgZm9yIG5vbi1TaW5nbGUgUGFnZSBBcHBcbiAgICB2YXIgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5ub1NQQSA9IGtvLm9ic2VydmFibGUoQm9vbGVhbihscyAmJiBscy5nZXRJdGVtKCdub1NQQScpKSlcbiAgICB0aGlzLm5vU1BBLnN1YnNjcmliZSgodikgPT4gbHMgJiYgbHMuc2V0SXRlbSgnbm9TUEEnLCB2IHx8IFwiXCIpKVxuICB9XG5cbiAgcGF0aFRvVGVtcGxhdGUocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykucG9wKCkucmVwbGFjZSgnLmh0bWwnLCAnJylcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIiDwn5OwICBcIiArIHRoaXMucGF0aFRvVGVtcGxhdGUocGlucG9pbnQpKVxuICAgIHRoaXMuYm9keSh0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgfVxuXG4gIG9uQm9keUNoYW5nZSh0ZW1wbGF0ZUlkKSB7XG4gICAgaWYgKHRlbXBsYXRlSWQpIHtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICAgIHRoaXMudGl0bGUobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJylcbiAgICB9XG4gIH1cblxuICByZWdpc3RlclBsdWdpbnMocGx1Z2lucykge1xuICAgIHRoaXMucGx1Z2lucy5yZWdpc3RlcihwbHVnaW5zKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsyLCB7XCJ2YXJzXCI6IFwibG9jYWxcIn1dKi9cblxuY2xhc3MgUGx1Z2luTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLmZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnNvcnRCeS5iaW5kKHRoaXMpKVxuICAgICAgLm1hcCh0aGlzLm5hbWVUb0luc3RhbmNlLmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMubmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuICB9XG5cbiAgcmVnaXN0ZXIocGx1Z2lucykge1xuICAgIE9iamVjdC5rZXlzKHBsdWdpbnMpLmZvckVhY2goZnVuY3Rpb24gKHJlcG8pIHtcbiAgICAgIHZhciBhYm91dCA9IHBsdWdpbnNbcmVwb11cbiAgICAgIHRoaXMucGx1Z2luUmVwb3MucHVzaChyZXBvKVxuICAgICAgdGhpcy5wbHVnaW5NYXAuc2V0KHJlcG8sIGFib3V0KVxuICAgIH0sIHRoaXMpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKHRydWUpXG4gIH1cblxuICBmaWx0ZXIocmVwbykge1xuICAgIGlmICghdGhpcy5wbHVnaW5zTG9hZGVkKCkpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMubmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cblxuICBuYW1lVG9JbnN0YW5jZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFwLmdldChuYW1lKVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYC9hLyR7dGVtcGxhdGUuaWR9Lmh0bWxgXG4gICAgdGhpcy50aXRsZSA9IHRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGDigJwke3RlbXBsYXRlLmlkfeKAnWBcbiAgfVxufVxuXG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHZhciBzZWFyY2hSYXRlID0ge1xuICAgICAgdGltZW91dDogNTAwLFxuICAgICAgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiXG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IHNlYXJjaFJhdGV9KVxuICAgIHRoaXMucmVzdWx0cyA9IGtvLmNvbXB1dGVkKHRoaXMuY29tcHV0ZVJlc3VsdHMsIHRoaXMpXG4gICAgdGhpcy5xdWVyeS5zdWJzY3JpYmUodGhpcy5vblF1ZXJ5Q2hhbmdlLCB0aGlzKVxuICAgIHRoaXMucHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIXEpIHsgcmV0dXJuIFtdIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxKSAhPT0gLTFcbiAgICAgIH0pXG4gICAgICAubWFwKChpLCB0ZW1wbGF0ZSkgPT4gbmV3IFNlYXJjaFJlc3VsdCh0ZW1wbGF0ZSkpXG4gIH1cblxuICBzYXZlVGVtcGxhdGUoKSB7XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gJ3NlYXJjaCcpIHtcbiAgICAgIHRoaXMuc2F2ZWRUZW1wbGF0ZSA9ICRyb290LmJvZHkoKVxuICAgICAgdGhpcy5zYXZlZFRpdGxlID0gZG9jdW1lbnQudGl0bGVcbiAgICB9XG4gIH1cblxuICByZXN0b3JlVGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuc2F2ZWRUaXRsZSkge1xuICAgICAgJHJvb3QuYm9keSh0aGlzLnNhdmVkVGVtcGxhdGUpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuc2F2ZWRUaXRsZVxuICAgIH1cbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UoKSB7XG4gICAgaWYgKCEodGhpcy5xdWVyeSgpIHx8ICcnKS50cmltKCkpIHtcbiAgICAgIHRoaXMucmVzdG9yZVRlbXBsYXRlKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnNhdmVUZW1wbGF0ZSgpXG4gICAgJHJvb3QuYm9keShcInNlYXJjaFwiKVxuICAgIGRvY3VtZW50LnRpdGxlID0gYEtub2Nrb3V0LmpzIOKAkyBTZWFyY2gg4oCcJHt0aGlzLnF1ZXJ5KCl94oCdYFxuICB9XG59XG4iLCIvL1xuLy8gYW5pbWF0ZWQgdGVtcGxhdGUgYmluZGluZ1xuLy8gLS0tXG4vLyBXYWl0cyBmb3IgQ1NTMyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBvbiBjaGFuZ2UgYmVmb3JlIG1vdmluZyB0byB0aGUgbmV4dC5cbi8vXG5cbnZhciBhbmltYXRpb25FdmVudCA9ICdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kIG9BbmltYXRpb25FbmQgTVNBbmltYXRpb25FbmQnXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5hbmltYXRlZFRlbXBsYXRlID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgaWduMSwgaWduMiwgYmluZGluZ0NvbnRleHQpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdmFyIG9icyA9IHZhbHVlQWNjZXNzb3IoKVxuXG4gICAgdmFyIG9uVGVtcGxhdGVDaGFuZ2UgPSBmdW5jdGlvbiAodGVtcGxhdGVJZF8pIHtcbiAgICAgIHZhciB0ZW1wbGF0ZUlkID0gKHRlbXBsYXRlSWRfIHx8ICcnKS5yZXBsYWNlKCcjJywgJycpXG4gICAgICB2YXIgdGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICAgIGlmICghdGVtcGxhdGVJZCkge1xuICAgICAgICAkZWxlbWVudC5lbXB0eSgpXG4gICAgICB9IGVsc2UgaWYgKCF0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCB0ZW1wbGF0ZSBieSBpZDogJHt0ZW1wbGF0ZUlkfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaHRtbCA9ICQodGVtcGxhdGVOb2RlKS5odG1sKClcbiAgICAgICAgJGVsZW1lbnQuaHRtbChgPGRpdiBjbGFzcz0nbWFpbi1hbmltYXRlZCc+JHtodG1sfTwvZGl2PmApXG5cbiAgICAgICAgLy8gU2VlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkyNTUyNzlcbiAgICAgICAgJGVsZW1lbnQub25lKGFuaW1hdGlvbkV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gRmFrZSBhIHNjcm9sbCBldmVudCBzbyBvdXIgYGlzQWxtb3N0SW5WaWV3YFxuICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKFwic2Nyb2xsXCIpXG4gICAgICAgIH0pXG5cbiAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMoYmluZGluZ0NvbnRleHQsIGVsZW1lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN1YnMgPSBvYnMuc3Vic2NyaWJlKG9uVGVtcGxhdGVDaGFuZ2UpXG4gICAgb25UZW1wbGF0ZUNoYW5nZShrby51bndyYXAob2JzKSlcblxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgc3Vicy5kaXNwb3NlKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHsgY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWUgfVxuICB9XG59XG4iLCJcbnZhciBsYW5ndWFnZVRoZW1lTWFwID0ge1xuICBodG1sOiAnc29sYXJpemVkX2RhcmsnLFxuICBqYXZhc2NyaXB0OiAnbW9ub2thaSdcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0ga28udW53cmFwKGV4YW1wbGVOYW1lKVxuICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7bGFuZ3VhZ2VUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IHRydWUsXG4gICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgdGFiU2l6ZTogMixcbiAgICBtaW5MaW5lczogMyxcbiAgICBtYXhMaW5lczogMzAsXG4gICAgd3JhcDogdHJ1ZVxuICB9KVxuICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgZWRpdG9yLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IGV4YW1wbGVbbGFuZ3VhZ2VdKGVkaXRvci5nZXRWYWx1ZSgpKSB9KVxuICBleGFtcGxlW2xhbmd1YWdlXS5zdWJzY3JpYmUoZnVuY3Rpb24gKHYpIHtcbiAgICBpZiAoZWRpdG9yLmdldFZhbHVlKCkgIT09IHYpIHtcbiAgICAgIGVkaXRvci5zZXRWYWx1ZSh2KVxuICAgIH1cbiAgfSlcbiAgZWRpdG9yLnNldFZhbHVlKGV4YW1wbGVbbGFuZ3VhZ2VdKCkpXG4gIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgcmV0dXJuIGVkaXRvclxufVxuXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzXG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1qcyddID0ge1xuICAvKiBoaWdobGlnaHQ6IFwibGFuZ2F1Z2VcIiAqL1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsICgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdqYXZhc2NyaXB0JywgdmEoKSkpXG4gIH1cbn1cblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWh0bWwnXSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgLy8gRGVmZXIgc28gdGhlIHBhZ2UgcmVuZGVyaW5nIGlzIGZhc3RlclxuICAgIC8vIFRPRE86IFdhaXQgdW50aWwgaW4gdmlldyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzLzE5MjEyXG4gICAgd2hlbkFsbW9zdEluVmlldyhlbGVtZW50LCAoKSA9PiBzZXR1cEVkaXRvcihlbGVtZW50LCAnaHRtbCcsIHZhKCkpKVxuICAgIC8vIGRlYnVnZ2VyXG4gICAgLy8gZWRpdG9yLnNlc3Npb24uc2V0T3B0aW9ucyh7XG4gICAgLy8gLy8gJHdvcmtlci5jYWxsKCdjaGFuZ2VPcHRpb25zJywgW3tcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnMnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1zdGFydC10YWcnOiBmYWxzZVxuICAgIC8vIH0pXG4gIH1cbn1cbiIsIlxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxua28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodCA9IHtcbiAgc2V0dXA6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDEsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDM1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgKCkgPT4ga28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodC5zZXR1cChlbGVtZW50LCB2YSkpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby1uZXctZnVuYzogMCAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5vcmlnaW5hbEFwcGx5QmluZGluZ3MgPSBrby5hcHBseUJpbmRpbmdzXG5rby5jb21wb25lbnRzLm9yaWdpbmFsUmVnaXN0ZXIgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyXG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmEpIHtcbiAgICB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsICgpID0+IGtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQuc2V0dXAoZWxlbWVudCwgdmEpKVxuICB9LFxuICBzZXR1cDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0ga28udW53cmFwKHZhKCkpXG4gICAgdmFyIHJlZ2lzdGVyZWRDb21wb25lbnRzID0gbmV3IFNldCgpXG5cbiAgICBmdW5jdGlvbiByZXNldEVsZW1lbnQoKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICBrby5jbGVhbk5vZGUoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cbiAgICAgICRlLmVtcHR5KCkuYXBwZW5kKGA8ZGl2IGNsYXNzPSdleGFtcGxlICR7ZXhhbXBsZS5jc3N9Jz5gKVxuICAgIH1cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmYWtlUmVnaXN0ZXIobmFtZSwgc2V0dGluZ3MpIHtcbiAgICAgIGtvLmNvbXBvbmVudHMub3JpZ2luYWxSZWdpc3RlcihuYW1lLCBzZXR0aW5ncylcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmFkZChuYW1lKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyQ29tcG9uZW50UmVnaXN0ZXIoKSB7XG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50cy5mb3JFYWNoKCh2KSA9PiBrby5jb21wb25lbnRzLnVucmVnaXN0ZXIodikpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmZpbmFsSmF2YXNjcmlwdCgpXG4gICAgICB2YXIgaHRtbCA9IGV4YW1wbGUuaHRtbCgpXG5cbiAgICAgIGlmIChzY3JpcHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvbkVycm9yKHNjcmlwdClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3R1YiBrby5hcHBseUJpbmRpbmdzXG4gICAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIHRoZSBgbm9kZWAgYXJndW1lbnQgaW4gZmF2b3VyIG9mIHRoZSBleGFtcGxlcycgbm9kZS5cbiAgICAgICAga28ub3JpZ2luYWxBcHBseUJpbmRpbmdzKGUsIGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG5cbiAgICAgIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIgPSBmYWtlUmVnaXN0ZXJcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgY2xlYXJDb21wb25lbnRSZWdpc3RlcigpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSkuaHRtbChodG1sKVxuICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ25vZGUnLCBzY3JpcHQpXG4gICAgICAgIGtvLmlnbm9yZURlcGVuZGVuY2llcyhmbiwgbnVsbCwgW2VsZW1lbnQuY2hpbGRyZW5bMF1dKVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBrby5jb21wdXRlZCh7XG4gICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQsXG4gICAgICByZWFkOiByZWZyZXNoXG4gICAgfSlcblxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgY2xlYXJDb21wb25lbnRSZWdpc3RlcigpXG4gICAgfSlcblxuICAgIHJldHVybiB7Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWV9XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBzZXR1cEV2ZW50cywgRXhhbXBsZSwgRG9jdW1lbnRhdGlvbiwgQVBJICovXG52YXIgYXBwQ2FjaGVVcGRhdGVDaGVja0ludGVydmFsID0gbG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnID8gMjUwMCA6ICgxMDAwICogNjAgKiAxNSlcblxudmFyIG5hdGl2ZVRlbXBsYXRpbmcgPSAnY29udGVudCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxuXG5cbmZ1bmN0aW9uIGxvYWRIdG1sKHVyaSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh1cmkpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIGdldCAke3VyaX06YCwgaHRtbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmF0aXZlVGVtcGxhdGluZykge1xuICAgICAgICAgIC8vIFBvbHlmaWxsIHRoZSA8dGVtcGxhdGU+IHRhZyBmcm9tIHRoZSB0ZW1wbGF0ZXMgd2UgbG9hZC5cbiAgICAgICAgICAvLyBGb3IgYSBtb3JlIGludm9sdmVkIHBvbHlmaWxsLCBzZWUgZS5nLlxuICAgICAgICAgIC8vICAgaHR0cDovL2pzZmlkZGxlLm5ldC9icmlhbmJsYWtlbHkvaDNFbVkvXG4gICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvPFxcLz90ZW1wbGF0ZS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgICBpZiAobWF0Y2ggPT09IFwiPHRlbXBsYXRlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI8c2NyaXB0IHR5cGU9J3RleHQveC10ZW1wbGF0ZSdcIlxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjwvc2NyaXB0XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICQoYDxkaXYgaWQ9J3RlbXBsYXRlcy0tJHt1cml9Jz5gKVxuICAgICAgICAgIC5hcHBlbmQoaHRtbClcbiAgICAgICAgICAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSlcbiAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBsb2FkVGVtcGxhdGVzKCkge1xuICByZXR1cm4gbG9hZEh0bWwoJ2J1aWxkL3RlbXBsYXRlcy5odG1sJylcbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtkb3duKCkge1xuICByZXR1cm4gbG9hZEh0bWwoXCJidWlsZC9tYXJrZG93bi5odG1sXCIpXG59XG5cblxuZnVuY3Rpb24gcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKSB7XG4gIHZhciBhYyA9IHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlXG4gIGlmIChhYy5zdGF0dXMgPT09IGFjLklETEUpIHsgYWMudXBkYXRlKCkgfVxuICBzZXRUaW1lb3V0KHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlLCBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlXG4gIGlmICghYWMpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpIH1cbiAgYWMuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhldnQubG9hZGVkIC8gZXZ0LnRvdGFsKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuJHJvb3QucmVsb2FkUHJvZ3Jlc3MoZmFsc2UpXG4gICAgfVxuICB9LCBmYWxzZSlcbiAgYWMuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlcmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LiRyb290LmNhY2hlSXNVcGRhdGVkKHRydWUpXG4gIH0pXG4gIGlmIChhYy5zdGF0dXMgPT09IGFjLlVQREFURVJFQURZKSB7XG4gICAgLy8gUmVsb2FkIHRoZSBwYWdlIGlmIHdlIGFyZSBzdGlsbCBpbml0aWFsaXppbmcgYW5kIGFuIHVwZGF0ZSBpcyByZWFkeS5cbiAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICB9XG4gIHJlQ2hlY2tBcHBsaWNhdGlvbkNhY2hlKClcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gZ2V0RXhhbXBsZXMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9leGFtcGxlcy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIE9iamVjdC5rZXlzKHJlc3VsdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBzZXR0aW5nID0gcmVzdWx0c1tuYW1lXVxuICAgICAgRXhhbXBsZS5zZXQoc2V0dGluZy5pZCB8fCBuYW1lLCBzZXR0aW5nKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBsb2FkQVBJKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvYXBpLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgcmVzdWx0cy5hcGkuZm9yRWFjaChmdW5jdGlvbiAoYXBpRmlsZUxpc3QpIHtcbiAgICAgIC8vIFdlIGVzc2VudGlhbGx5IGhhdmUgdG8gZmxhdHRlbiB0aGUgYXBpIChGSVhNRSlcbiAgICAgIGFwaUZpbGVMaXN0LmZvckVhY2goQVBJLmFkZClcbiAgICB9KVxuICApXG59XG5cblxuZnVuY3Rpb24gZ2V0UGx1Z2lucygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL3BsdWdpbnMuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT4gJHJvb3QucmVnaXN0ZXJQbHVnaW5zKHJlc3VsdHMpKVxufVxuXG5cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3MoKSB7XG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAgd2luZG93LiRyb290ID0gbmV3IFBhZ2UoKVxuICBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkZWQoKSB7XG4gIGlmIChsb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcuaHRtbCcpID09PSAtMSkge1xuICAgIHdpbmRvdy4kcm9vdC5vcGVuKFwiaW50cm9cIilcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oZ2V0RXhhbXBsZXMpXG4gICAgLnRoZW4obG9hZEFQSSlcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgd2luZG93LiRyb290LmJvZHkoXCJlcnJvclwiKVxuICAgICAgd2luZG93LiRyb290LmVycm9yTWVzc2FnZShlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICB9KVxufVxuXG4kKHN0YXJ0KVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbnZhciBTQ1JPTExfREVCT1VOQ0UgPSAyMDBcblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cbi8vIE1ha2Ugc3VyZSBpbiBub24tc2luZ2xlLXBhZ2UtYXBwIG1vZGUgdGhhdCB3ZSBsaW5rIHRvIHRoZSByaWdodCByZWxhdGl2ZVxuLy8gbGluay5cbnZhciBhbmNob3JSb290ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvYVxcLy4qXFwuaHRtbC8sICcnKVxuZnVuY3Rpb24gcmV3cml0ZUFuY2hvclJvb3QoZXZ0KSB7XG4gIHZhciBhbmNob3IgPSBldnQuY3VycmVudFRhcmdldFxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAvLyBTa2lwIG5vbi1sb2NhbCB1cmxzLlxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIEFscmVhZHkgcmUtcm9vdGVkXG4gIGlmIChhbmNob3IucGF0aG5hbWUuaW5kZXhPZihhbmNob3JSb290KSA9PT0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gIGFuY2hvci5ocmVmID0gYCR7YW5jaG9yUm9vdH0ke2FuY2hvci5wYXRobmFtZX1gLnJlcGxhY2UoJy8vJywgJy8nKVxuICByZXR1cm4gdHJ1ZVxufVxuXG5cbmZ1bmN0aW9uIHNjcm9sbFRvSGFzaChhbmNob3IpIHtcbiAgaWYgKCFhbmNob3IuaGFzaCkge1xuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgLy8gV2Ugbm9ybWFsaXplIHRoZSBsaW5rcyDigJMgdGhlIGRvY3MgdXNlIF8gYW5kIC0gaW5jb25zaXN0ZW50bHkgYW5kXG4gICAgLy8gc2VlbWluZ2x5IGludGVyY2hhbmdlYWJseTsgd2UgY291bGQgZ28gdGhyb3VnaCBhbmQgc3BvdCBldmVyeSBkaWZmZXJlbmNlXG4gICAgLy8gYnV0IHRoaXMgaXMganVzdCBlYXNpZXIgZm9yIG5vdy5cbiAgICBhbmNob3IuaGFzaC5zdWJzdHJpbmcoMSkucmVwbGFjZSgvXy9nLCAnLScpXG4gIClcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEJhZCBhbmNob3I6ICR7YW5jaG9yLmhhc2h9IGZyb20gJHthbmNob3IuaHJlZn1gKVxuICB9XG4gIC8vIFdlIGRlZmVyIHVudGlsIHRoZSBsYXlvdXQgaXMgY29tcGxldGVkLlxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcFxuICAgIH0sIDE1MClcbiAgfSwgMTUpXG59XG5cbi8vXG4vLyBGb3IgSlMgaGlzdG9yeSBzZWU6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4vL1xuZnVuY3Rpb24gb25BbmNob3JDbGljayhldnQpIHtcbiAgdmFyIGFuY2hvciA9IHRoaXNcbiAgcmV3cml0ZUFuY2hvclJvb3QoZXZ0KVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gdHJ1ZSB9XG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwoYW5jaG9yKSkgeyByZXR1cm4gdHJ1ZSB9XG5cbiAgLy8gRG8gbm90IGludGVyY2VwdCBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChhbmNob3IpLnBhcmVudHMoXCJsaXZlLWV4YW1wbGVcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHRlbXBsYXRlSWQgPSAkcm9vdC5wYXRoVG9UZW1wbGF0ZShhbmNob3IucGF0aG5hbWUpXG4gICAgLy8gSWYgdGhlIHRlbXBsYXRlIGlzbid0IGZvdW5kLCBwcmVzdW1lIGEgaGFyZCBsaW5rXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gdGVtcGxhdGVJZCkge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLmhyZWYpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgJHskKHRoaXMpLnRleHQoKX1gXG4gICAgICAkcm9vdC5vcGVuKHRlbXBsYXRlSWQpXG4gICAgICAkcm9vdC5zZWFyY2gucXVlcnkoJycpXG4gICAgfVxuICAgIHNjcm9sbFRvSGFzaChhbmNob3IpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKGBFcnJvci8ke2FuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5cbmZ1bmN0aW9uIG9uUG9wU3RhdGUoLyogZXZ0ICovKSB7XG4gIC8vIE5vdGUgaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gfVxuICAkcm9vdC5vcGVuKGxvY2F0aW9uLnBhdGhuYW1lKVxufVxuXG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRzKCkge1xuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcbiAgICAkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbiAgfSBlbHNlIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIHJld3JpdGVBbmNob3JSb290KVxuICB9XG4gICQod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGUoY2hlY2tJdGVtc0luVmlldywgU0NST0xMX0RFQk9VTkNFKSlcbn1cbiIsIlxuXG52YXIgaW5WaWV3V2F0Y2ggPSBuZXcgTWFwKClcblxuXG4vLyBTRWUgYWxzbyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzLzE5MjEyXG5mdW5jdGlvbiBpc0FsbW9zdEluVmlldyhlbCkge1xuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHZhciB3aW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gIC8vIEl0ZW1zIGFyZSBhbG1vc3QgaW4gdmlldyB3aGVuIHdlJ3ZlIHNjcm9sbGVkIGRvd24gdG8gMjAwcHggYWJvdmUgdGhlaXJcbiAgLy8gcHJlc2VuY2Ugb24gdGhlIHBhZ2UgaS5lLiBqdXN0IGJlZm9yZSB0aGUgdXNlciBnZXRzIHRvIHRoZW0uXG4gIHJldHVybiByZWN0LnRvcCA8IHdpbkhlaWdodCArIDIwMFxufVxuXG5cbmZ1bmN0aW9uIGNoZWNrSXRlbXNJblZpZXcoKSB7XG4gIGZvciAodmFyIGVsZW1lbnQgb2YgaW5WaWV3V2F0Y2gua2V5cygpKSB7XG4gICAgaWYgKGlzQWxtb3N0SW5WaWV3KGVsZW1lbnQpKSB7XG4gICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrLlxuICAgICAgaW5WaWV3V2F0Y2guZ2V0KGVsZW1lbnQpKClcbiAgICAgIGluVmlld1dhdGNoLmRlbGV0ZShlbGVtZW50KVxuICAgIH1cbiAgfVxufVxuXG5cbi8vIFNjaGVkdWxlIHRoZSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgZWxlbWVudCBjb21lcyBpbnRvIHZpZXcuXG4vLyBUaGlzIGlzIGluIHNvbWUgd2F5cyBhIHBvb3IgbWFuJ3MgcmVxdWVzdElkbGVDYWxsYmFja1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3VwZGF0ZXMvMjAxNS8wOC8yNy91c2luZy1yZXF1ZXN0aWRsZWNhbGxiYWNrXG5mdW5jdGlvbiB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gIGlmIChpc0FsbW9zdEluVmlldyhlbGVtZW50KSkge1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDEpXG4gIH0gZWxzZSB7XG4gICAgaW5WaWV3V2F0Y2guc2V0KGVsZW1lbnQsIGNhbGxiYWNrKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgaW5WaWV3V2F0Y2guZGVsZXRlKGVsZW1lbnQpXG4gICAgfSlcbiAgfVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQva25vY2tvdXQnLFxuICAgIHRpdGxlOiBcIkdpdHRlclwiLFxuICAgIGljb246IFwiZmEtY29tbWVudHMtb1wifSxcbiAgeyBocmVmOiAnbGVnYWN5LycsXG4gICAgdGl0bGU6IFwiTGVnYWN5IHdlYnNpdGVcIixcbiAgICBpY29uOiBcImZhIGZhLWhpc3RvcnlcIn1cbl1cblxud2luZG93LmdpdGh1YkxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiUmVwb3NpdG9yeVwiLFxuICAgIGljb246IFwiZmEtZ2l0aHViXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy9cIixcbiAgICB0aXRsZTogXCJJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3JlbGVhc2VzJyxcbiAgICB0aXRsZTogXCJSZWxlYXNlc1wiLFxuICAgIGljb246IFwiZmEtY2VydGlmaWNhdGVcIn1cbl1cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIlxuICB9XG5dXG4iLCIvL1xuLy8gU2ltcGxlIHRocm90dGxlLlxuLy9cblxuZnVuY3Rpb24gdGhyb3R0bGUoZm4sIGludGVydmFsKSB7XG4gIHZhciBpc1dhaXRpbmcgPSBmYWxzZVxuXG4gIHZhciB3cmFwID0gZnVuY3Rpb24gdGhyb3R0bGVkKCkge1xuICAgIGlmIChpc1dhaXRpbmcpIHsgcmV0dXJuIH1cbiAgICBpc1dhaXRpbmcgPSB0cnVlXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpc1dhaXRpbmcgPSBmYWxzZVxuICAgICAgZm4oKVxuICAgIH0sIGludGVydmFsKVxuICB9XG5cbiAgcmV0dXJuIHdyYXBcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==