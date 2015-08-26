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

function getTemplateAnimations(origin) {
  return {
    hide: {
      x: '100%',
      rotateY: '90deg',
      overflow: 'hidden',
      duration: 180,
      easing: 'snap'
    },
    start: {
      x: '-100%',
      rotateY: '-90deg'
    },
    show: {
      x: 0,
      rotateY: '0deg',
      duration: 180,
      easing: 'snap'
    }
  };
}

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
        var anims = getTemplateAnimations($root.pageChangeOrigin);

        $element.stop().transition(anims.hide, function () {
          $element.css(anims.start).html($(templateNode).html());
          ko.applyBindingsToDescendants(bindingContext, element);
        }).transition(anims.show);
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
    whenInView(element, function () {
      return setupEditor(element, 'javascript', va());
    });
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    // Defer so the page rendering is faster
    // TODO: Wait until in view http://stackoverflow.com/a/7557433/19212
    whenInView(element, function () {
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
    whenInView(element, function () {
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
    whenInView(element, function () {
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

// Per http://stackoverflow.com/a/7557433/19212
function isInView(el) {
  var rect = el.getBoundingClientRect();
  var winHeight = window.innerHeight || document.documentElement.clientHeight;
  var winWidth = window.innerWidth || document.documentElement.clientWidth;

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= winHeight && rect.right <= winWidth;
}

function checkItemsInView() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = inViewWatch.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      if (isInView(element)) {
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

function whenInView(element, callback) {
  if (isInView(element)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJpc0luVmlldy5qcyIsInNldHRpbmdzLmpzIiwidGhyb3R0bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQVVNLEdBQUc7QUFDSSxXQURQLEdBQUcsQ0FDSyxJQUFJLEVBQUU7MEJBRGQsR0FBRzs7QUFFTCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUN6QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtBQUNoQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNqRDs7ZUFURyxHQUFHOztXQVdDLGtCQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDckIsa0JBQVUsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLFVBQUssSUFBSSxDQUFFO0tBQzFDOzs7U0FiRyxHQUFHOzs7QUFnQlQsR0FB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YG9waW5lYC1mbGF2b3VyZWQgZG9jdW1lbnRhdGlvbiBoZXJlLlxuXG4gSGVyZSBpcyBhIHNhbXBsZTpcbiovXG4vLyAvKi0tLVxuLy8gIHB1cnBvc2U6IGtub2Nrb3V0LXdpZGUgc2V0dGluZ3Ncbi8vICAqL1xuLy8gdmFyIHNldHRpbmdzID0geyAvKi4uLiovIH1cblxuY2xhc3MgQVBJIHtcbiAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZVxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZVxuICAgIHRoaXMuc291cmNlID0gc3BlYy5zb3VyY2VcbiAgICB0aGlzLmxpbmUgPSBzcGVjLmxpbmVcbiAgICB0aGlzLnB1cnBvc2UgPSBzcGVjLnZhcnMucHVycG9zZVxuICAgIHRoaXMuc3BlYyA9IHNwZWMudmFycy5wYXJhbXNcbiAgICB0aGlzLnVybCA9IHRoaXMuYnVpbGRVcmwoc3BlYy5zb3VyY2UsIHNwZWMubGluZSlcbiAgfVxuXG4gIGJ1aWxkVXJsKHNvdXJjZSwgbGluZSkge1xuICAgIHJldHVybiBgJHtBUEkudXJsUm9vdH0ke3NvdXJjZX0jTCR7bGluZX1gXG4gIH1cbn1cblxuQVBJLnVybFJvb3QgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9ibG9iL21hc3Rlci9cIlxuXG5cbkFQSS5pdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG5cbkFQSS5hZGQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY29uc29sZS5sb2coXCJUXCIsIHRva2VuKVxuICBBUEkuaXRlbXMucHVzaChuZXcgQVBJKHRva2VuKSlcbn1cbiIsIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgYW5kIENvbXBvbmVudHNcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiLFxuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5leGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHBhcmFtcy5pZCkpXG4gICAgfVxuICAgIGlmIChwYXJhbXMuYmFzZTY0KSB7XG4gICAgICB2YXIgb3B0cyA9XG4gICAgICB0aGlzLmV4YW1wbGUgPSBuZXcgRXhhbXBsZShKU09OLnBhcnNlKGF0b2IocGFyYW1zLmJhc2U2NCkpKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhhbXBsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhhbXBsZSBtdXN0IGJlIHByb3ZpZGVkIGJ5IGlkIG9yIGJhc2U2NCBwYXJhbWV0ZXJcIilcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4ID0gdGhpcy5leGFtcGxlXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgb24gdGhlIEtub2Nrb3V0IHdlYnNpdGVcbiAqIG9uICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfVxuICoqL1xuXG4gLyogRm9yIGNvbnZlbmllbmNlIGFuZCBjb25zaXN0ZW5jeSB3ZSd2ZSBlbmFibGVkIHRoZSBrb1xuICAqIHB1bmNoZXMgbGlicmFyeSBmb3IgdGhpcyBleGFtcGxlLlxuICAqL1xuIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcblxuIC8qKiBFeGFtcGxlIGlzIGFzIGZvbGxvd3MgKiovXG5gXG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWw6IGV4Lmh0bWwoKSxcbiAgICAgIGpzOiBqc1ByZWZpeCArIGV4LmZpbmFsSmF2YXNjcmlwdCgpLFxuICAgICAgdGl0bGU6IGBGcm9tIEtub2Nrb3V0IGV4YW1wbGVgLFxuICAgICAgZGVzY3JpcHRpb246IGBDcmVhdGVkIG9uICR7ZGF0ZWR9YFxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWRkbGUoc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vZG9jLmpzZmlkZGxlLm5ldC9hcGkvcG9zdC5odG1sXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGR0ZDogXCJIVE1MIDVcIixcbiAgICAgIHdyYXA6ICdsJyxcbiAgICAgIHJlc291cmNlczogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIixcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBmb3JtID0gJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2pzZmlkZGxlLm5ldC9hcGkvcG9zdC9saWJyYXJ5L3B1cmUvXCJcbiAgICAgIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDwvZm9ybT5gKVxuICAgICQuZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGZvcm0uYXBwZW5kKFxuICAgICAgICAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPScke2t9Jz5gKS52YWwodilcbiAgICAgIClcbiAgICB9KVxuXG4gICAgZm9ybS5zdWJtaXQoKVxuICB9XG5cbiAgb3BlblBlbihzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLmNvZGVwZW4uaW8vZG9jdW1lbnRhdGlvbi9hcGkvcHJlZmlsbC9cbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBvcHRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGpzX2V4dGVybmFsOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiO1wiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKVxuXG4gICAgJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2NvZGVwZW4uaW8vcGVuL2RlZmluZVwiIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J2RhdGEnIHZhbHVlPScke2RhdGFTdHJ9Jy8+XG4gICAgPC9mb3JtPmApLnN1Ym1pdCgpXG4gIH1cbn1cblxua28uY29tcG9uZW50cy5yZWdpc3RlcignbGl2ZS1leGFtcGxlJywge1xuICAgIHZpZXdNb2RlbDogTGl2ZUV4YW1wbGVDb21wb25lbnQsXG4gICAgdGVtcGxhdGU6IHtlbGVtZW50OiBcImxpdmUtZXhhbXBsZVwifVxufSlcbiIsIi8qZ2xvYmFsIFBhZ2UsIERvY3VtZW50YXRpb24sIG1hcmtlZCwgU2VhcmNoLCBQbHVnaW5NYW5hZ2VyICovXG4vKmVzbGludCBuby11bnVzZWQtdmFyczogMCovXG5cblxuY2xhc3MgUGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIC0tLSBNYWluIGJvZHkgdGVtcGxhdGUgaWQgLS0tXG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuYm9keS5zdWJzY3JpYmUodGhpcy5vbkJvZHlDaGFuZ2UsIHRoaXMpXG5cbiAgICAvLyAtLS0gZm9vdGVyIGxpbmtzL2NkbiAtLS1cbiAgICB0aGlzLmxpbmtzID0gd2luZG93LmxpbmtzXG4gICAgdGhpcy5jZG4gPSB3aW5kb3cuY2RuXG5cbiAgICAvLyAtLS0gcGx1Z2lucyAtLS1cbiAgICB0aGlzLnBsdWdpbnMgPSBuZXcgUGx1Z2luTWFuYWdlcigpXG5cbiAgICAvLyAtLS0gZG9jdW1lbnRhdGlvbiAtLS1cbiAgICB0aGlzLmRvY0NhdE1hcCA9IG5ldyBNYXAoKVxuICAgIERvY3VtZW50YXRpb24uYWxsLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgdmFyIGNhdCA9IERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFtkb2MuY2F0ZWdvcnldXG4gICAgICB2YXIgZG9jTGlzdCA9IHRoaXMuZG9jQ2F0TWFwLmdldChjYXQpXG4gICAgICBpZiAoIWRvY0xpc3QpIHtcbiAgICAgICAgZG9jTGlzdCA9IFtdXG4gICAgICAgIHRoaXMuZG9jQ2F0TWFwLnNldChjYXQsIGRvY0xpc3QpXG4gICAgICB9XG4gICAgICBkb2NMaXN0LnB1c2goZG9jKVxuICAgIH0sIHRoaXMpXG5cbiAgICAvLyBTb3J0IHRoZSBkb2N1bWVudGF0aW9uIGl0ZW1zXG4gICAgZnVuY3Rpb24gc29ydGVyKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnRpdGxlLmxvY2FsZUNvbXBhcmUoYi50aXRsZSlcbiAgICB9XG4gICAgZm9yICh2YXIgbGlzdCBvZiB0aGlzLmRvY0NhdE1hcC52YWx1ZXMoKSkgeyBsaXN0LnNvcnQoc29ydGVyKSB9XG5cbiAgICAvLyBkb2NDYXRzOiBBIHNvcnRlZCBsaXN0IG9mIHRoZSBkb2N1bWVudGF0aW9uIHNlY3Rpb25zXG4gICAgdGhpcy5kb2NDYXRzID0gT2JqZWN0LmtleXMoRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwKVxuICAgICAgLnNvcnQoKVxuICAgICAgLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW3ZdIH0pXG5cbiAgICAvLyAtLS0gc2VhcmNoaW5nIC0tLVxuICAgIHRoaXMuc2VhcmNoID0gbmV3IFNlYXJjaCgpXG5cbiAgICAvLyAtLS0gcGFnZSBsb2FkaW5nIHN0YXR1cyAtLS1cbiAgICAvLyBhcHBsaWNhdGlvbkNhY2hlIHByb2dyZXNzXG4gICAgdGhpcy5yZWxvYWRQcm9ncmVzcyA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMuY2FjaGVJc1VwZGF0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKVxuXG4gICAgLy8gcGFnZSBsb2FkaW5nIGVycm9yXG4gICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIFByZWZlcmVuY2UgZm9yIG5vbi1TaW5nbGUgUGFnZSBBcHBcbiAgICB2YXIgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5ub1NQQSA9IGtvLm9ic2VydmFibGUoQm9vbGVhbihscyAmJiBscy5nZXRJdGVtKCdub1NQQScpKSlcbiAgICB0aGlzLm5vU1BBLnN1YnNjcmliZSgodikgPT4gbHMgJiYgbHMuc2V0SXRlbSgnbm9TUEEnLCB2IHx8IFwiXCIpKVxuICB9XG5cbiAgcGF0aFRvVGVtcGxhdGUocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykucG9wKCkucmVwbGFjZSgnLmh0bWwnLCAnJylcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICBjb25zb2xlLmxvZyhcIiDwn5OwICBcIiArIHRoaXMucGF0aFRvVGVtcGxhdGUocGlucG9pbnQpKVxuICAgIHRoaXMuYm9keSh0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgfVxuXG4gIG9uQm9keUNoYW5nZSh0ZW1wbGF0ZUlkKSB7XG4gICAgaWYgKHRlbXBsYXRlSWQpIHtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICAgIHRoaXMudGl0bGUobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJylcbiAgICB9XG4gIH1cblxuICByZWdpc3RlclBsdWdpbnMocGx1Z2lucykge1xuICAgIHRoaXMucGx1Z2lucy5yZWdpc3RlcihwbHVnaW5zKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsyLCB7XCJ2YXJzXCI6IFwibG9jYWxcIn1dKi9cblxuY2xhc3MgUGx1Z2luTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLmZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnNvcnRCeS5iaW5kKHRoaXMpKVxuICAgICAgLm1hcCh0aGlzLm5hbWVUb0luc3RhbmNlLmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMubmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuICB9XG5cbiAgcmVnaXN0ZXIocGx1Z2lucykge1xuICAgIE9iamVjdC5rZXlzKHBsdWdpbnMpLmZvckVhY2goZnVuY3Rpb24gKHJlcG8pIHtcbiAgICAgIHZhciBhYm91dCA9IHBsdWdpbnNbcmVwb11cbiAgICAgIHRoaXMucGx1Z2luUmVwb3MucHVzaChyZXBvKVxuICAgICAgdGhpcy5wbHVnaW5NYXAuc2V0KHJlcG8sIGFib3V0KVxuICAgIH0sIHRoaXMpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKHRydWUpXG4gIH1cblxuICBmaWx0ZXIocmVwbykge1xuICAgIGlmICghdGhpcy5wbHVnaW5zTG9hZGVkKCkpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMubmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cblxuICBuYW1lVG9JbnN0YW5jZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFwLmdldChuYW1lKVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYC9hLyR7dGVtcGxhdGUuaWR9Lmh0bWxgXG4gICAgdGhpcy50aXRsZSA9IHRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGDigJwke3RlbXBsYXRlLmlkfeKAnWBcbiAgfVxufVxuXG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHZhciBzZWFyY2hSYXRlID0ge1xuICAgICAgdGltZW91dDogNTAwLFxuICAgICAgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiXG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IHNlYXJjaFJhdGV9KVxuICAgIHRoaXMucmVzdWx0cyA9IGtvLmNvbXB1dGVkKHRoaXMuY29tcHV0ZVJlc3VsdHMsIHRoaXMpXG4gICAgdGhpcy5xdWVyeS5zdWJzY3JpYmUodGhpcy5vblF1ZXJ5Q2hhbmdlLCB0aGlzKVxuICAgIHRoaXMucHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIXEpIHsgcmV0dXJuIFtdIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxKSAhPT0gLTFcbiAgICAgIH0pXG4gICAgICAubWFwKChpLCB0ZW1wbGF0ZSkgPT4gbmV3IFNlYXJjaFJlc3VsdCh0ZW1wbGF0ZSkpXG4gIH1cblxuICBzYXZlVGVtcGxhdGUoKSB7XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gJ3NlYXJjaCcpIHtcbiAgICAgIHRoaXMuc2F2ZWRUZW1wbGF0ZSA9ICRyb290LmJvZHkoKVxuICAgICAgdGhpcy5zYXZlZFRpdGxlID0gZG9jdW1lbnQudGl0bGVcbiAgICB9XG4gIH1cblxuICByZXN0b3JlVGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuc2F2ZWRUaXRsZSkge1xuICAgICAgJHJvb3QuYm9keSh0aGlzLnNhdmVkVGVtcGxhdGUpXG4gICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuc2F2ZWRUaXRsZVxuICAgIH1cbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UoKSB7XG4gICAgaWYgKCEodGhpcy5xdWVyeSgpIHx8ICcnKS50cmltKCkpIHtcbiAgICAgIHRoaXMucmVzdG9yZVRlbXBsYXRlKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnNhdmVUZW1wbGF0ZSgpXG4gICAgJHJvb3QuYm9keShcInNlYXJjaFwiKVxuICAgIGRvY3VtZW50LnRpdGxlID0gYEtub2Nrb3V0LmpzIOKAkyBTZWFyY2gg4oCcJHt0aGlzLnF1ZXJ5KCl94oCdYFxuICB9XG59XG4iLCIvL1xuLy8gYW5pbWF0ZWQgdGVtcGxhdGUgYmluZGluZ1xuLy8gLS0tXG4vLyBXYWl0cyBmb3IgQ1NTMyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSBvbiBjaGFuZ2UgYmVmb3JlIG1vdmluZyB0byB0aGUgbmV4dC5cbi8vXG5cbmZ1bmN0aW9uIGdldFRlbXBsYXRlQW5pbWF0aW9ucyhvcmlnaW4pIHtcbiAgcmV0dXJuIHtcbiAgICBoaWRlOiB7XG4gICAgICB4OiAnMTAwJScsXG4gICAgICByb3RhdGVZOiAnOTBkZWcnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgZHVyYXRpb246IDE4MCxcbiAgICAgIGVhc2luZzogJ3NuYXAnXG4gICAgfSxcbiAgICBzdGFydDoge1xuICAgICAgeDogJy0xMDAlJyxcbiAgICAgIHJvdGF0ZVk6ICctOTBkZWcnXG4gICAgfSxcbiAgICBzaG93OiB7XG4gICAgICB4OiAwLFxuICAgICAgcm90YXRlWTogJzBkZWcnLFxuICAgICAgZHVyYXRpb246IDE4MCxcbiAgICAgIGVhc2luZzogJ3NuYXAnXG4gICAgfVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVycy5hbmltYXRlZFRlbXBsYXRlID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgaWduMSwgaWduMiwgYmluZGluZ0NvbnRleHQpIHtcbiAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdmFyIG9icyA9IHZhbHVlQWNjZXNzb3IoKVxuXG4gICAgdmFyIG9uVGVtcGxhdGVDaGFuZ2UgPSBmdW5jdGlvbiAodGVtcGxhdGVJZF8pIHtcbiAgICAgIHZhciB0ZW1wbGF0ZUlkID0gKHRlbXBsYXRlSWRfIHx8ICcnKS5yZXBsYWNlKCcjJywgJycpXG4gICAgICB2YXIgdGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZClcbiAgICAgIGlmICghdGVtcGxhdGVJZCkge1xuICAgICAgICAkZWxlbWVudC5lbXB0eSgpXG4gICAgICB9IGVsc2UgaWYgKCF0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCB0ZW1wbGF0ZSBieSBpZDogJHt0ZW1wbGF0ZUlkfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYW5pbXMgPSBnZXRUZW1wbGF0ZUFuaW1hdGlvbnMoJHJvb3QucGFnZUNoYW5nZU9yaWdpbilcblxuICAgICAgICAkZWxlbWVudC5zdG9wKClcbiAgICAgICAgICAudHJhbnNpdGlvbihhbmltcy5oaWRlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICRlbGVtZW50LmNzcyhhbmltcy5zdGFydClcbiAgICAgICAgICAgICAgICAuaHRtbCgkKHRlbXBsYXRlTm9kZSkuaHRtbCgpKVxuICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhiaW5kaW5nQ29udGV4dCwgZWxlbWVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICAgICAgLnRyYW5zaXRpb24oYW5pbXMuc2hvdylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3VicyA9IG9icy5zdWJzY3JpYmUob25UZW1wbGF0ZUNoYW5nZSlcbiAgICBvblRlbXBsYXRlQ2hhbmdlKGtvLnVud3JhcChvYnMpKVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBzdWJzLmRpc3Bvc2UoKVxuICAgIH0pXG5cbiAgICByZXR1cm4geyBjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZSB9XG4gIH1cbn1cbiIsIlxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG5mdW5jdGlvbiBzZXR1cEVkaXRvcihlbGVtZW50LCBsYW5ndWFnZSwgZXhhbXBsZU5hbWUpIHtcbiAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAoZXhhbXBsZU5hbWUpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHdoZW5JblZpZXcoZWxlbWVudCwgKCkgPT4gc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICAvLyBEZWZlciBzbyB0aGUgcGFnZSByZW5kZXJpbmcgaXMgZmFzdGVyXG4gICAgLy8gVE9ETzogV2FpdCB1bnRpbCBpbiB2aWV3IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzMvMTkyMTJcbiAgICB3aGVuSW5WaWV3KGVsZW1lbnQsICgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuIiwiXG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInRvbW9ycm93XCJcbn1cblxudmFyIGVtYXAgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCdcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAvJmFtcDt8Jmx0Oy9nLFxuICAgIGZ1bmN0aW9uIChlbnQpIHsgcmV0dXJuIGVtYXBbZW50XX1cbiAgKVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0ID0ge1xuICBzZXR1cDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBsYW5ndWFnZSA9IHZhKClcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdodG1sJyAmJiBsYW5ndWFnZSAhPT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQSBsYW5ndWFnZSBzaG91bGQgYmUgc3BlY2lmaWVkLlwiLCBlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gdW5lc2NhcGUoJGUudGV4dCgpKVxuICAgICRlLmVtcHR5KClcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3JlYWRvbmx5VGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gICAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogZmFsc2UsXG4gICAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDIsXG4gICAgICBtaW5MaW5lczogMSxcbiAgICAgIHdyYXA6IHRydWUsXG4gICAgICBtYXhMaW5lczogMzUsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG4gICAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbnRlbnQpXG4gICAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgd2hlbkluVmlldyhlbGVtZW50LCAoKSA9PiBrby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0LnNldHVwKGVsZW1lbnQsIHZhKSlcbiAgfVxufVxuIiwiLyogZXNsaW50IG5vLW5ldy1mdW5jOiAwICovXG5cbi8vIFNhdmUgYSBjb3B5IGZvciByZXN0b3JhdGlvbi91c2VcbmtvLm9yaWdpbmFsQXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcbmtvLmNvbXBvbmVudHMub3JpZ2luYWxSZWdpc3RlciA9IGtvLmNvbXBvbmVudHMucmVnaXN0ZXJcblxuXG5rby5iaW5kaW5nSGFuZGxlcnMucmVzdWx0ID0ge1xuICBpbml0OiBmdW5jdGlvbihlbGVtZW50LCB2YSkge1xuICAgIHdoZW5JblZpZXcoZWxlbWVudCwgKCkgPT4ga28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdC5zZXR1cChlbGVtZW50LCB2YSkpXG4gIH0sXG4gIHNldHVwOiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAodmEoKSlcbiAgICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHMgPSBuZXcgU2V0KClcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZha2VSZWdpc3RlcihuYW1lLCBzZXR0aW5ncykge1xuICAgICAga28uY29tcG9uZW50cy5vcmlnaW5hbFJlZ2lzdGVyKG5hbWUsIHNldHRpbmdzKVxuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuYWRkKG5hbWUpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJDb21wb25lbnRSZWdpc3RlcigpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmZvckVhY2goKHYpID0+IGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcih2KSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5vcmlnaW5hbEFwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZha2VSZWdpc3RlclxuXG4gICAgICB0cnkge1xuICAgICAgICByZXNldEVsZW1lbnQoKVxuICAgICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG52YXIgbmF0aXZlVGVtcGxhdGluZyA9ICdjb250ZW50JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG5cblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYXRpdmVUZW1wbGF0aW5nKSB7XG4gICAgICAgICAgLy8gUG9seWZpbGwgdGhlIDx0ZW1wbGF0ZT4gdGFnIGZyb20gdGhlIHRlbXBsYXRlcyB3ZSBsb2FkLlxuICAgICAgICAgIC8vIEZvciBhIG1vcmUgaW52b2x2ZWQgcG9seWZpbGwsIHNlZSBlLmcuXG4gICAgICAgICAgLy8gICBodHRwOi8vanNmaWRkbGUubmV0L2JyaWFuYmxha2VseS9oM0VtWS9cbiAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvP3RlbXBsYXRlL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gXCI8dGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjxzY3JpcHQgdHlwZT0ndGV4dC94LXRlbXBsYXRlJ1wiXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPC9zY3JpcHRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuSURMRSkgeyBhYy51cGRhdGUoKSB9XG4gIHNldFRpbWVvdXQocmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUsIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy5odG1sJykgPT09IC0xKSB7XG4gICAgd2luZG93LiRyb290Lm9wZW4oXCJpbnRyb1wiKVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIFByb21pc2UuYWxsKFtsb2FkVGVtcGxhdGVzKCksIGxvYWRNYXJrZG93bigpXSlcbiAgICAudGhlbihEb2N1bWVudGF0aW9uLmluaXRpYWxpemUpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB3aW5kb3cuJHJvb3QuYm9keShcImVycm9yXCIpXG4gICAgICB3aW5kb3cuJHJvb3QuZXJyb3JNZXNzYWdlKGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH0pXG59XG5cbiQoc3RhcnQpXG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxudmFyIFNDUk9MTF9ERUJPVU5DRSA9IDIwMFxuXG5mdW5jdGlvbiBpc0xvY2FsKGFuY2hvcikge1xuICByZXR1cm4gKGxvY2F0aW9uLnByb3RvY29sID09PSBhbmNob3IucHJvdG9jb2wgJiZcbiAgICAgICAgICBsb2NhdGlvbi5ob3N0ID09PSBhbmNob3IuaG9zdClcbn1cblxuLy8gTWFrZSBzdXJlIGluIG5vbi1zaW5nbGUtcGFnZS1hcHAgbW9kZSB0aGF0IHdlIGxpbmsgdG8gdGhlIHJpZ2h0IHJlbGF0aXZlXG4vLyBsaW5rLlxudmFyIGFuY2hvclJvb3QgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9hXFwvLipcXC5odG1sLywgJycpXG5mdW5jdGlvbiByZXdyaXRlQW5jaG9yUm9vdChldnQpIHtcbiAgdmFyIGFuY2hvciA9IGV2dC5jdXJyZW50VGFyZ2V0XG4gIHZhciBocmVmID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gIC8vIFNraXAgbm9uLWxvY2FsIHVybHMuXG4gIGlmICghaXNMb2NhbChhbmNob3IpKSB7IHJldHVybiB0cnVlIH1cbiAgLy8gQWxyZWFkeSByZS1yb290ZWRcbiAgaWYgKGFuY2hvci5wYXRobmFtZS5pbmRleE9mKGFuY2hvclJvb3QpID09PSAwKSB7IHJldHVybiB0cnVlIH1cbiAgYW5jaG9yLmhyZWYgPSBgJHthbmNob3JSb290fSR7YW5jaG9yLnBhdGhuYW1lfWAucmVwbGFjZSgnLy8nLCAnLycpXG4gIHJldHVybiB0cnVlXG59XG5cblxuZnVuY3Rpb24gc2Nyb2xsVG9IYXNoKGFuY2hvcikge1xuICBpZiAoIWFuY2hvci5oYXNoKSB7XG4gICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKVxuICAgIHJldHVyblxuICB9XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAvLyBXZSBub3JtYWxpemUgdGhlIGxpbmtzIOKAkyB0aGUgZG9jcyB1c2UgXyBhbmQgLSBpbmNvbnNpc3RlbnRseSBhbmRcbiAgICAvLyBzZWVtaW5nbHkgaW50ZXJjaGFuZ2VhYmx5OyB3ZSBjb3VsZCBnbyB0aHJvdWdoIGFuZCBzcG90IGV2ZXJ5IGRpZmZlcmVuY2VcbiAgICAvLyBidXQgdGhpcyBpcyBqdXN0IGVhc2llciBmb3Igbm93LlxuICAgIGFuY2hvci5oYXNoLnN1YnN0cmluZygxKS5yZXBsYWNlKC9fL2csICctJylcbiAgKVxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQmFkIGFuY2hvcjogJHthbmNob3IuaGFzaH0gZnJvbSAke2FuY2hvci5ocmVmfWApXG4gIH1cbiAgLy8gV2UgZGVmZXIgdW50aWwgdGhlIGxheW91dCBpcyBjb21wbGV0ZWQuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKHRhcmdldCkub2Zmc2V0KCkudG9wXG4gICAgfSwgMTUwKVxuICB9LCAxNSlcbn1cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICB2YXIgYW5jaG9yID0gdGhpc1xuICByZXdyaXRlQW5jaG9yUm9vdChldnQpXG4gIGlmICgkcm9vdC5ub1NQQSgpKSB7IHJldHVybiB0cnVlIH1cbiAgLy8gRG8gbm90IGludGVyY2VwdCBjbGlja3Mgb24gdGhpbmdzIG91dHNpZGUgdGhpcyBwYWdlXG4gIGlmICghaXNMb2NhbChhbmNob3IpKSB7IHJldHVybiB0cnVlIH1cblxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiBhbiBlbGVtZW50IGluIGFuIGV4YW1wbGUuXG4gIGlmICgkKGFuY2hvcikucGFyZW50cyhcImxpdmUtZXhhbXBsZVwiKS5sZW5ndGggIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdHJ5IHtcbiAgICB2YXIgdGVtcGxhdGVJZCA9ICRyb290LnBhdGhUb1RlbXBsYXRlKGFuY2hvci5wYXRobmFtZSlcbiAgICAvLyBJZiB0aGUgdGVtcGxhdGUgaXNuJ3QgZm91bmQsIHByZXN1bWUgYSBoYXJkIGxpbmtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpKSB7IHJldHVybiB0cnVlIH1cbiAgICBpZiAoJHJvb3QuYm9keSgpICE9PSB0ZW1wbGF0ZUlkKSB7XG4gICAgICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBhbmNob3IuaHJlZilcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gYEtub2Nrb3V0LmpzIOKAkyAkeyQodGhpcykudGV4dCgpfWBcbiAgICAgICRyb290Lm9wZW4odGVtcGxhdGVJZClcbiAgICAgICRyb290LnNlYXJjaC5xdWVyeSgnJylcbiAgICB9XG4gICAgc2Nyb2xsVG9IYXNoKGFuY2hvcilcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7YW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpfWAsIGUpXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblxuZnVuY3Rpb24gb25Qb3BTdGF0ZSgvKiBldnQgKi8pIHtcbiAgLy8gTm90ZSBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gIGlmICgkcm9vdC5ub1NQQSgpKSB7IHJldHVybiB9XG4gICRyb290Lm9wZW4obG9jYXRpb24ucGF0aG5hbWUpXG59XG5cblxuZnVuY3Rpb24gc2V0dXBFdmVudHMoKSB7XG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIFwiYVwiLCBvbkFuY2hvckNsaWNrKVxuICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCBvblBvcFN0YXRlKVxuICB9IGVsc2Uge1xuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgcmV3cml0ZUFuY2hvclJvb3QpXG4gIH1cbiAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aHJvdHRsZShjaGVja0l0ZW1zSW5WaWV3LCBTQ1JPTExfREVCT1VOQ0UpKVxufVxuIiwiXG5cbnZhciBpblZpZXdXYXRjaCA9IG5ldyBNYXAoKVxuXG5cbi8vIFBlciBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzLzE5MjEyXG5mdW5jdGlvbiBpc0luVmlldyhlbCkge1xuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHZhciB3aW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICB2YXIgd2luV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICByZXR1cm4gKFxuICAgIHJlY3QudG9wID49IDAgJiZcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxuICAgIHJlY3QuYm90dG9tIDw9IHdpbkhlaWdodCAmJlxuICAgIHJlY3QucmlnaHQgPD0gd2luV2lkdGgpXG59XG5cblxuZnVuY3Rpb24gY2hlY2tJdGVtc0luVmlldygpIHtcbiAgZm9yICh2YXIgZWxlbWVudCBvZiBpblZpZXdXYXRjaC5rZXlzKCkpIHtcbiAgICBpZiAoaXNJblZpZXcoZWxlbWVudCkpIHtcbiAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2suXG4gICAgICBpblZpZXdXYXRjaC5nZXQoZWxlbWVudCkoKVxuICAgICAgaW5WaWV3V2F0Y2guZGVsZXRlKGVsZW1lbnQpXG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gd2hlbkluVmlldyhlbGVtZW50LCBjYWxsYmFjaykge1xuICBpZiAoaXNJblZpZXcoZWxlbWVudCkpIHtcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAxKVxuICB9IGVsc2Uge1xuICAgIGluVmlld1dhdGNoLnNldChlbGVtZW50LCBjYWxsYmFjaylcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGluVmlld1dhdGNoLmRlbGV0ZShlbGVtZW50KVxuICAgIH0pXG4gIH1cbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cbndpbmRvdy5naXRodWJMaW5rcyA9IFtcbiAgeyBocmVmOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dFwiLFxuICAgIHRpdGxlOiBcIlJlcG9zaXRvcnlcIixcbiAgICBpY29uOiBcImZhLWdpdGh1YlwifSxcbiAgeyBocmVmOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9pc3N1ZXMvXCIsXG4gICAgdGl0bGU6IFwiSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9XG5dXG5cbndpbmRvdy5jZG4gPSBbXG4gIHsgbmFtZTogXCJNaWNyb3NvZnQgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIlxuICB9LFxuICB7IG5hbWU6IFwiQ2xvdWRGbGFyZSBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LW1pbi5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LWRlYnVnLmpzXCJcbiAgfVxuXVxuIiwiLy9cbi8vIFNpbXBsZSB0aHJvdHRsZS5cbi8vXG5cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBpbnRlcnZhbCkge1xuICB2YXIgaXNXYWl0aW5nID0gZmFsc2VcblxuICB2YXIgd3JhcCA9IGZ1bmN0aW9uIHRocm90dGxlZCgpIHtcbiAgICBpZiAoaXNXYWl0aW5nKSB7IHJldHVybiB9XG4gICAgaXNXYWl0aW5nID0gdHJ1ZVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaXNXYWl0aW5nID0gZmFsc2VcbiAgICAgIGZuKClcbiAgICB9LCBpbnRlcnZhbClcbiAgfVxuXG4gIHJldHVybiB3cmFwXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=