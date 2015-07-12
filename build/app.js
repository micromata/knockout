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

    this.example = params.id;
  }

  _createClass(LiveExampleComponent, [{
    key: "openCommonSettings",
    value: function openCommonSettings() {
      var exId = ko.unwrap(this.example);
      var ex = Example.get(exId);
      var dated = new Date().toLocaleString();
      var jsPrefix = "/**\n * Created from an example (" + exId + ") on the Knockout website\n * on " + new Date().toLocaleString() + "\n **/\n\n /* For convenience and consistency we've enabled the ko\n  * punches library for this example.\n  */\n ko.punches.enableAll()\n\n /** Example is as follows **/\n";
      return {
        html: ex.html(),
        js: jsPrefix + ex.finalJavascript(),
        title: "From Knockout example (" + exId + ")",
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
/*global Page, Documentation, marked, Search*/
/*eslint no-unused-vars: 0*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = (function () {
  function Page() {
    _classCallCheck(this, Page);

    // --- Main body template id ---
    this.body = ko.observable();
    this.title = ko.observable();

    // --- footer links/cdn ---
    this.links = window.links;
    this.cdn = window.cdn;

    // --- plugins ---
    this.pluginRepos = ko.observableArray();
    this.sortedPluginRepos = this.pluginRepos.filter(this.pluginFilter.bind(this)).sortBy(this.pluginSortBy.bind(this));
    this.pluginMap = new Map();
    this.pluginSort = ko.observable();
    this.pluginsLoaded = ko.observable(false).extend({ rateLimit: 15 });
    this.pluginNeedle = ko.observable().extend({ rateLimit: 200 });

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
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
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
  }

  _createClass(Page, [{
    key: "open",
    value: function open(pinpoint) {
      var pp = pinpoint.replace("#", "");
      var node = document.getElementById(pp);
      var mdNode, mdNodeId;
      this.title(node.getAttribute("data-title") || "");
      this.body(pp);
      $(window).scrollTop(0);
    }
  }, {
    key: "registerPlugins",
    value: function registerPlugins(plugins) {
      Object.keys(plugins).forEach(function (repo) {
        var about = plugins[repo];
        this.pluginRepos.push(repo);
        this.pluginMap.set(repo, about);
      }, this);
      this.pluginsLoaded(true);
    }
  }, {
    key: "pluginFilter",
    value: function pluginFilter(repo) {
      var about = this.pluginMap.get(repo);
      var needle = (this.pluginNeedle() || "").toLowerCase();
      if (!needle) {
        return true;
      }
      if (repo.toLowerCase().indexOf(needle) >= 0) {
        return true;
      }
      if (!about) {
        return false;
      }
      return (about.description || "").toLowerCase().indexOf(needle) >= 0;
    }
  }, {
    key: "pluginSortBy",
    value: function pluginSortBy(repo, descending) {
      this.pluginsLoaded(); // Create dependency.
      var about = this.pluginMap.get(repo);
      if (about) {
        return descending(about.stargazers_count);
      } else {
        return descending(-1);
      }
    }
  }]);

  return Page;
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
/* global ace, Example */
/* eslint no-new-func: 0, no-underscore-dangle:0*/

// Save a copy for restoration/use
'use strict';

ko._applyBindings = ko.applyBindings;

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
};

var readonlyThemeMap = {
  html: 'solarized_light',
  javascript: 'tomorrow'
};

function setupEditor(element, language, exampleName) {
  var example = Example.get(ko.unwrap(exampleName));
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

ko.bindingHandlers.result = {
  init: function init(element, va) {
    var $e = $(element);
    var example = Example.get(ko.unwrap(va()));

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element.children[0]);
      }
      $e.empty().append('<div class=\'example ' + example.css + '\'>');
    }
    resetElement();

    function onError(msg) {
      $(element).html('<div class=\'error\'>Error: ' + msg + '</div>');
    }

    function refresh() {
      var script = example.finalJavascript();
      var html = example.html();

      if (script instanceof Error) {
        onError(script);
        return;
      }

      if (!html) {
        onError('There\'s no HTML to bind to.');
        return;
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e) {
        // We ignore the `node` argument in favour of the examples' node.
        ko._applyBindings(e, element.children[0]);
      };

      try {
        resetElement();
        $(element.children[0]).html(html);
        var fn = new Function('node', script);
        ko.ignoreDependencies(fn, null, [element.children[0]]);
      } catch (e) {
        onError(e);
      }
      ko.applyBindings = ko._applyBindings;
    }

    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: refresh
    });

    return { controlsDescendantBindings: true };
  }
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
  init: function init(element, va) {
    var $e = $(element);
    var language = va();
    if (language !== 'html' && language !== 'javascript') {
      console.error('A language should be specified.', element);
      return;
    }
    var content = unescape($e.text());
    $e.empty();
    var editor = ace.edit(element);
    var session = editor.getSession();
    editor.setTheme('ace/theme/' + readonlyThemeMap[language]);
    editor.setOptions({
      highlightActiveLine: false,
      useSoftTabs: true,
      tabSize: 2,
      minLines: 1,
      wrap: true,
      maxLines: 35,
      readOnly: true
    });
    session.setMode('ace/mode/' + language);
    editor.setValue(content);
    editor.clearSelection();
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  }
};
// debugger
// editor.session.setOptions({
// // $worker.call('changeOptions', [{
//   'expected-doctype-but-got-chars': false,
//   'expected-doctype-but-got-end-tag': false,
//   'expected-doctype-but-got-start-tag': false
// })
/* global setupEvents, Example, Documentation, APIs */

"use strict";

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== "string") {
      console.error("Unable to get " + uri + ":", html);
    } else {
      // ES5-<template> shim/polyfill:
      // unless 'content' of document.createElement('template')
      //   # see pv_shim_template_tag re. broken-template tags
      //   html = html.replace(/<\/template>/g, '</script>')
      //     .replace(/<template/g, '<script type="text/x-template"')
      $("<div id='templates--" + uri + "'>").append(html).appendTo(document.body);
    }
  });
}

function loadTemplates() {
  return loadHtml("build/templates.html");
}

function loadMarkdown() {
  return loadHtml("build/markdown.html");
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

function getExamples() {
  return Promise.resolve($.ajax({
    url: "build/examples.json",
    dataType: "json"
  })).then(function (results) {
    return Object.keys(results).forEach(function (name) {
      var setting = results[name];
      Example.set(setting.id || name, setting);
    });
  });
}

function loadAPI() {
  return Promise.resolve($.ajax({
    url: "build/api.json",
    dataType: "json"
  })).then(function (results) {
    return results.api.forEach(function (apiFileList) {
      // We essentially have to flatten the api (FIXME)
      apiFileList.forEach(API.add);
    });
  });
}

function getPlugins() {
  return Promise.resolve($.ajax({
    url: "build/plugins.json",
    dataType: "json"
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
  window.$root.open(location.hash || "#intro");
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(function () {
    return Documentation.initialize();
  }).then(applyBindings).then(getExamples).then(loadAPI).then(getPlugins).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)["catch"](function (err) {
    return console.log("Loading:", err);
  });
}

$(start);

// Enable livereload in development
if (window.location.hostname === "localhost") {
  $.getScript("http://localhost:35729/livereload.js");
}
/*global setupEvents*/
/* eslint no-unused-vars: 0 */

'use strict';

function isLocal(anchor) {
  return location.protocol === anchor.protocol && location.host === anchor.host;
}

//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  // Ignore clicks on things outside this page
  if (!isLocal(this)) {
    return true;
  }

  // Ignore clicks on an element in an example.
  if ($(evt.target).parents('live-example').length !== 0) {
    return true;
  }
  // Ignore clicks on links that may have e.g. data-bind=click: ...
  // (e.g. open jsFiddle)
  if (!evt.target.hash) {
    return true;
  }
  try {
    $root.open(evt.target.getAttribute('href'));
  } catch (e) {
    console.log('Error/' + evt.target.getAttribute('href'), e);
  }
  history.pushState(null, null, this.href);
  document.title = 'Knockout.js – ' + $(this).text();
  return false;
}

function onPopState() {
  // Consider https://github.com/devote/HTML5-History-API
  $root.open(location.hash);
}

function setupEvents() {
  $(document.body).on('click', 'a', onAnchorClick);

  $(window).on('popstate', onPopState);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiU2VhcmNoLmpzIiwiYmluZGluZ3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVTSxHQUFHO0FBQ0ksV0FEUCxHQUFHLENBQ0ssSUFBSSxFQUFFOzBCQURkLEdBQUc7O0FBRUwsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7QUFDaEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakQ7O2VBVEcsR0FBRzs7V0FXQyxrQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLGtCQUFVLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxVQUFLLElBQUksQ0FBRTtLQUMxQzs7O1NBYkcsR0FBRzs7O0FBZ0JULEdBQUcsQ0FBQyxPQUFPLEdBQUcsbURBQW1ELENBQUE7O0FBR2pFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFBOztBQUVoQyxHQUFHLENBQUMsR0FBRyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ3pC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QXFCO0FBQzVCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsOENBQThDO0FBQ3BELE9BQUssRUFBRSxpQkFBaUI7QUFDeEIsTUFBSSxFQUFFLHVCQUF1QixFQUFDLEVBQ2hDLEVBQUUsSUFBSSxFQUFFLCtDQUErQztBQUNyRCxPQUFLLEVBQUUsVUFBVTtBQUNqQixNQUFJLEVBQUUsZ0JBQWdCLEVBQUMsRUFDekIsRUFBRSxJQUFJLEVBQUUsb0RBQW9EO0FBQzFELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsZ0RBQWdEO0FBQ3RELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxtQkFBbUIsRUFBQyxFQUM1QixFQUFFLElBQUksRUFBRSxxQ0FBcUM7QUFDM0MsT0FBSyxFQUFFLFFBQVE7QUFDZixNQUFJLEVBQUUsZUFBZSxFQUFDLEVBQ3hCLEVBQUUsSUFBSSxFQUFFLFNBQVM7QUFDZixPQUFLLEVBQUUsZ0JBQWdCO0FBQ3ZCLE1BQUksRUFBRSxlQUFlLEVBQUMsQ0FDekIsQ0FBQTs7QUFHRCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQ1gsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsMkRBQTJEO0FBQ2hFLE9BQUssRUFBRSxpRUFBaUU7Q0FDekUsRUFDRCxFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHlFQUF5RTtBQUM5RSxPQUFLLEVBQUUsdUVBQXVFO0NBQy9FLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiBBUEkgY29udmVydHMgdGhlIGBvcGluZWAtZmxhdm91cmVkIGRvY3VtZW50YXRpb24gaGVyZS5cblxuIEhlcmUgaXMgYSBzYW1wbGU6XG4qL1xuLy8gLyotLS1cbi8vICBwdXJwb3NlOiBrbm9ja291dC13aWRlIHNldHRpbmdzXG4vLyAgKi9cbi8vIHZhciBzZXR0aW5ncyA9IHsgLyouLi4qLyB9XG5cbmNsYXNzIEFQSSB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICB0aGlzLnR5cGUgPSBzcGVjLnR5cGVcbiAgICB0aGlzLm5hbWUgPSBzcGVjLm5hbWVcbiAgICB0aGlzLnNvdXJjZSA9IHNwZWMuc291cmNlXG4gICAgdGhpcy5saW5lID0gc3BlYy5saW5lXG4gICAgdGhpcy5wdXJwb3NlID0gc3BlYy52YXJzLnB1cnBvc2VcbiAgICB0aGlzLnNwZWMgPSBzcGVjLnZhcnMucGFyYW1zXG4gICAgdGhpcy51cmwgPSB0aGlzLmJ1aWxkVXJsKHNwZWMuc291cmNlLCBzcGVjLmxpbmUpXG4gIH1cblxuICBidWlsZFVybChzb3VyY2UsIGxpbmUpIHtcbiAgICByZXR1cm4gYCR7QVBJLnVybFJvb3R9JHtzb3VyY2V9I0wke2xpbmV9YFxuICB9XG59XG5cbkFQSS51cmxSb290ID0gXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvYmxvYi9tYXN0ZXIvXCJcblxuXG5BUEkuaXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuXG5BUEkuYWRkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIGNvbnNvbGUubG9nKFwiVFwiLCB0b2tlbilcbiAgQVBJLml0ZW1zLnB1c2gobmV3IEFQSSh0b2tlbikpXG59XG4iLCJcbmNsYXNzIERvY3VtZW50YXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdGl0bGUsIGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMuc3ViY2F0ZWdvcnkgPSBzdWJjYXRlZ29yeVxuICB9XG59XG5cbkRvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcCA9IHtcbiAgMTogXCJHZXR0aW5nIHN0YXJ0ZWRcIixcbiAgMjogXCJPYnNlcnZhYmxlc1wiLFxuICAzOiBcIkJpbmRpbmdzIGFuZCBDb21wb25lbnRzXCIsXG4gIDQ6IFwiQmluZGluZ3MgaW5jbHVkZWRcIixcbiAgNTogXCJGdXJ0aGVyIGluZm9ybWF0aW9uXCJcbn1cblxuRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSA9IGZ1bmN0aW9uIChpLCBub2RlKSB7XG4gIHJldHVybiBuZXcgRG9jdW1lbnRhdGlvbihcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXN1YmNhdCcpXG4gIClcbn1cblxuRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICBEb2N1bWVudGF0aW9uLmFsbCA9ICQubWFrZUFycmF5KFxuICAgICQoXCJbZGF0YS1raW5kPWRvY3VtZW50YXRpb25dXCIpLm1hcChEb2N1bWVudGF0aW9uLmZyb21Ob2RlKVxuICApXG59XG4iLCJcblxuY2xhc3MgRXhhbXBsZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlID0ge30pIHtcbiAgICB2YXIgZGVib3VuY2UgPSB7IHRpbWVvdXQ6IDUwMCwgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiIH1cbiAgICB0aGlzLmphdmFzY3JpcHQgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmphdmFzY3JpcHQpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmh0bWwgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmh0bWwpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmNzcyA9IHN0YXRlLmNzcyB8fCAnJ1xuXG4gICAgdGhpcy5maW5hbEphdmFzY3JpcHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5jb21wdXRlRmluYWxKcywgdGhpcylcbiAgfVxuXG4gIC8vIEFkZCBrby5hcHBseUJpbmRpbmdzIGFzIG5lZWRlZDsgcmV0dXJuIEVycm9yIHdoZXJlIGFwcHJvcHJpYXRlLlxuICBjb21wdXRlRmluYWxKcygpIHtcbiAgICB2YXIganMgPSB0aGlzLmphdmFzY3JpcHQoKVxuICAgIGlmICghanMpIHsgcmV0dXJuIG5ldyBFcnJvcihcIlRoZSBzY3JpcHQgaXMgZW1wdHkuXCIpIH1cbiAgICBpZiAoanMuaW5kZXhPZigna28uYXBwbHlCaW5kaW5ncygnKSA9PT0gLTEpIHtcbiAgICAgIGlmIChqcy5pbmRleE9mKCcgdmlld01vZGVsID0nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2UgZ3Vlc3MgdGhlIHZpZXdNb2RlbCBuYW1lIC4uLlxuICAgICAgICByZXR1cm4gYCR7anN9XFxuXFxuLyogQXV0b21hdGljYWxseSBBZGRlZCAqL1xuICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsKTtgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5ncyh2aWV3KSBpcyBub3QgY2FsbGVkXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc1xuICB9XG59XG5cbkV4YW1wbGUuc3RhdGVNYXAgPSBuZXcgTWFwKClcblxuRXhhbXBsZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgc3RhdGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoIXN0YXRlKSB7XG4gICAgc3RhdGUgPSBuZXcgRXhhbXBsZShuYW1lKVxuICAgIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIHN0YXRlKVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuXG5cbkV4YW1wbGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKGV4YW1wbGUpIHtcbiAgICBleGFtcGxlLmphdmFzY3JpcHQoc3RhdGUuamF2YXNjcmlwdClcbiAgICBleGFtcGxlLmh0bWwoc3RhdGUuaHRtbClcbiAgICByZXR1cm5cbiAgfVxuICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBuZXcgRXhhbXBsZShzdGF0ZSkpXG59XG4iLCIvKmdsb2JhbHMgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwLCBjYW1lbGNhc2U6MCovXG5cbnZhciBFWFRFUk5BTF9JTkNMVURFUyA9IFtcbiAgXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIixcbiAgXCJodHRwczovL2Nkbi5yYXdnaXQuY29tL21iZXN0L2tub2Nrb3V0LnB1bmNoZXMvdjAuNS4xL2tub2Nrb3V0LnB1bmNoZXMuanNcIlxuXVxuXG5jbGFzcyBMaXZlRXhhbXBsZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMuZXhhbXBsZSA9IHBhcmFtcy5pZFxuICB9XG5cbiAgb3BlbkNvbW1vblNldHRpbmdzKCkge1xuICAgIHZhciBleElkID0ga28udW53cmFwKHRoaXMuZXhhbXBsZSlcbiAgICB2YXIgZXggPSBFeGFtcGxlLmdldChleElkKVxuICAgIHZhciBkYXRlZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgIHZhciBqc1ByZWZpeCA9IGAvKipcbiAqIENyZWF0ZWQgZnJvbSBhbiBleGFtcGxlICgke2V4SWR9KSBvbiB0aGUgS25vY2tvdXQgd2Vic2l0ZVxuICogb24gJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9XG4gKiovXG5cbiAvKiBGb3IgY29udmVuaWVuY2UgYW5kIGNvbnNpc3RlbmN5IHdlJ3ZlIGVuYWJsZWQgdGhlIGtvXG4gICogcHVuY2hlcyBsaWJyYXJ5IGZvciB0aGlzIGV4YW1wbGUuXG4gICovXG4ga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuXG4gLyoqIEV4YW1wbGUgaXMgYXMgZm9sbG93cyAqKi9cbmBcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogZXguaHRtbCgpLFxuICAgICAganM6IGpzUHJlZml4ICsgZXguZmluYWxKYXZhc2NyaXB0KCksXG4gICAgICB0aXRsZTogYEZyb20gS25vY2tvdXQgZXhhbXBsZSAoJHtleElkfSlgLFxuICAgICAgZGVzY3JpcHRpb246IGBDcmVhdGVkIG9uICR7ZGF0ZWR9YFxuICAgIH1cbiAgfVxuXG4gIG9wZW5GaWRkbGUoc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vZG9jLmpzZmlkZGxlLm5ldC9hcGkvcG9zdC5odG1sXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGR0ZDogXCJIVE1MIDVcIixcbiAgICAgIHdyYXA6ICdsJyxcbiAgICAgIHJlc291cmNlczogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIixcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBmb3JtID0gJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2pzZmlkZGxlLm5ldC9hcGkvcG9zdC9saWJyYXJ5L3B1cmUvXCJcbiAgICAgIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDwvZm9ybT5gKVxuICAgICQuZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGZvcm0uYXBwZW5kKFxuICAgICAgICAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPScke2t9Jz5gKS52YWwodilcbiAgICAgIClcbiAgICB9KVxuXG4gICAgZm9ybS5zdWJtaXQoKVxuICB9XG5cbiAgb3BlblBlbihzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLmNvZGVwZW4uaW8vZG9jdW1lbnRhdGlvbi9hcGkvcHJlZmlsbC9cbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBvcHRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGpzX2V4dGVybmFsOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiO1wiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKVxuXG4gICAgJChgPGZvcm0gYWN0aW9uPVwiaHR0cDovL2NvZGVwZW4uaW8vcGVuL2RlZmluZVwiIG1ldGhvZD1cIlBPU1RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J2RhdGEnIHZhbHVlPScke2RhdGFTdHJ9Jy8+XG4gICAgPC9mb3JtPmApLnN1Ym1pdCgpXG4gIH1cbn1cblxua28uY29tcG9uZW50cy5yZWdpc3RlcignbGl2ZS1leGFtcGxlJywge1xuICAgIHZpZXdNb2RlbDogTGl2ZUV4YW1wbGVDb21wb25lbnQsXG4gICAgdGVtcGxhdGU6IHtlbGVtZW50OiBcImxpdmUtZXhhbXBsZVwifVxufSlcbiIsIi8qZ2xvYmFsIFBhZ2UsIERvY3VtZW50YXRpb24sIG1hcmtlZCwgU2VhcmNoKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gLS0tIE1haW4gYm9keSB0ZW1wbGF0ZSBpZCAtLS1cbiAgICB0aGlzLmJvZHkgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICAvLyAtLS0gZm9vdGVyIGxpbmtzL2NkbiAtLS1cbiAgICB0aGlzLmxpbmtzID0gd2luZG93LmxpbmtzXG4gICAgdGhpcy5jZG4gPSB3aW5kb3cuY2RuXG5cbiAgICAvLyAtLS0gcGx1Z2lucyAtLS1cbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLnBsdWdpbkZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnBsdWdpblNvcnRCeS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLnBsdWdpbk5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcblxuICAgIC8vIC0tLSBkb2N1bWVudGF0aW9uIC0tLVxuICAgIHRoaXMuZG9jQ2F0TWFwID0gbmV3IE1hcCgpXG4gICAgRG9jdW1lbnRhdGlvbi5hbGwuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG4gICAgICB2YXIgY2F0ID0gRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwW2RvYy5jYXRlZ29yeV1cbiAgICAgIHZhciBkb2NMaXN0ID0gdGhpcy5kb2NDYXRNYXAuZ2V0KGNhdClcbiAgICAgIGlmICghZG9jTGlzdCkge1xuICAgICAgICBkb2NMaXN0ID0gW11cbiAgICAgICAgdGhpcy5kb2NDYXRNYXAuc2V0KGNhdCwgZG9jTGlzdClcbiAgICAgIH1cbiAgICAgIGRvY0xpc3QucHVzaChkb2MpXG4gICAgfSwgdGhpcylcblxuICAgIC8vIFNvcnQgdGhlIGRvY3VtZW50YXRpb24gaXRlbXNcbiAgICBmdW5jdGlvbiBzb3J0ZXIoYSwgYikge1xuICAgICAgcmV0dXJuIGEudGl0bGUubG9jYWxlQ29tcGFyZShiLnRpdGxlKVxuICAgIH1cbiAgICBmb3IgKHZhciBsaXN0IG9mIHRoaXMuZG9jQ2F0TWFwLnZhbHVlcygpKSB7IGxpc3Quc29ydChzb3J0ZXIpIH1cblxuICAgIC8vIGRvY0NhdHM6IEEgc29ydGVkIGxpc3Qgb2YgdGhlIGRvY3VtZW50YXRpb24gc2VjdGlvbnNcbiAgICB0aGlzLmRvY0NhdHMgPSBPYmplY3Qua2V5cyhEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXApXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbdl0gfSlcblxuICAgIC8vIC0tLSBzZWFyY2hpbmcgLS0tXG4gICAgdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoKClcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICB2YXIgcHAgPSBwaW5wb2ludC5yZXBsYWNlKFwiI1wiLCBcIlwiKVxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHApXG4gICAgdmFyIG1kTm9kZSwgbWROb2RlSWRcbiAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgdGhpcy5ib2R5KHBwKVxuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgfVxuXG4gIHJlZ2lzdGVyUGx1Z2lucyhwbHVnaW5zKSB7XG4gICAgT2JqZWN0LmtleXMocGx1Z2lucykuZm9yRWFjaChmdW5jdGlvbiAocmVwbykge1xuICAgICAgdmFyIGFib3V0ID0gcGx1Z2luc1tyZXBvXVxuICAgICAgdGhpcy5wbHVnaW5SZXBvcy5wdXNoKHJlcG8pXG4gICAgICB0aGlzLnBsdWdpbk1hcC5zZXQocmVwbywgYWJvdXQpXG4gICAgfSwgdGhpcylcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQodHJ1ZSlcbiAgfVxuXG4gIHBsdWdpbkZpbHRlcihyZXBvKSB7XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLnBsdWdpbk5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBwbHVnaW5Tb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYCMke3RlbXBsYXRlLmlkfWBcbiAgICB0aGlzLnRpdGxlID0gdGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgYOKAnCR7dGVtcGxhdGUuaWR94oCdYFxuICB9XG59XG5cblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIHNlYXJjaFJhdGUgPSB7XG4gICAgICB0aW1lb3V0OiA1MDAsXG4gICAgICBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCJcbiAgICB9XG4gICAgdGhpcy5xdWVyeSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogc2VhcmNoUmF0ZX0pXG4gICAgdGhpcy5yZXN1bHRzID0ga28uY29tcHV0ZWQodGhpcy5jb21wdXRlUmVzdWx0cywgdGhpcylcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gdGhpcy5xdWVyeSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBudWxsIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG59XG4iLCIvKiBnbG9iYWwgYWNlLCBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tbmV3LWZ1bmM6IDAsIG5vLXVuZGVyc2NvcmUtZGFuZ2xlOjAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5fYXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcblxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbmZ1bmN0aW9uIHNldHVwRWRpdG9yKGVsZW1lbnQsIGxhbmd1YWdlLCBleGFtcGxlTmFtZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcChleGFtcGxlTmFtZSkpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdqYXZhc2NyaXB0JywgdmEoKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXR1cEVkaXRvcihlbGVtZW50LCAnaHRtbCcsIHZhKCkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcCh2YSgpKSlcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICB2YXIgc2NyaXB0ID0gZXhhbXBsZS5maW5hbEphdmFzY3JpcHQoKVxuICAgICAgdmFyIGh0bWwgPSBleGFtcGxlLmh0bWwoKVxuXG4gICAgICBpZiAoc2NyaXB0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihzY3JpcHQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWh0bWwpIHtcbiAgICAgICAgb25FcnJvcihcIlRoZXJlJ3Mgbm8gSFRNTCB0byBiaW5kIHRvLlwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFN0dWIga28uYXBwbHlCaW5kaW5nc1xuICAgICAga28uYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIFdlIGlnbm9yZSB0aGUgYG5vZGVgIGFyZ3VtZW50IGluIGZhdm91ciBvZiB0aGUgZXhhbXBsZXMnIG5vZGUuXG4gICAgICAgIGtvLl9hcHBseUJpbmRpbmdzKGUsIGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc2V0RWxlbWVudCgpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSkuaHRtbChodG1sKVxuICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ25vZGUnLCBzY3JpcHQpXG4gICAgICAgIGtvLmlnbm9yZURlcGVuZGVuY2llcyhmbiwgbnVsbCwgW2VsZW1lbnQuY2hpbGRyZW5bMF1dKVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSlcbiAgICAgIH1cbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBrby5fYXBwbHlCaW5kaW5nc1xuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuXG52YXIgZW1hcCA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8J1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFxuICAgIC8mYW1wO3wmbHQ7L2csXG4gICAgZnVuY3Rpb24gKGVudCkgeyByZXR1cm4gZW1hcFtlbnRdfVxuICApXG59XG5cblxua28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBsYW5ndWFnZSA9IHZhKClcbiAgICBpZiAobGFuZ3VhZ2UgIT09ICdodG1sJyAmJiBsYW5ndWFnZSAhPT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQSBsYW5ndWFnZSBzaG91bGQgYmUgc3BlY2lmaWVkLlwiLCBlbGVtZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gdW5lc2NhcGUoJGUudGV4dCgpKVxuICAgICRlLmVtcHR5KClcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3JlYWRvbmx5VGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gICAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogZmFsc2UsXG4gICAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDIsXG4gICAgICBtaW5MaW5lczogMSxcbiAgICAgIHdyYXA6IHRydWUsXG4gICAgICBtYXhMaW5lczogMzUsXG4gICAgICByZWFkT25seTogdHJ1ZVxuICAgIH0pXG4gICAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gICAgZWRpdG9yLnNldFZhbHVlKGNvbnRlbnQpXG4gICAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBzZXR1cEV2ZW50cywgRXhhbXBsZSwgRG9jdW1lbnRhdGlvbiwgQVBJcyAqL1xuXG5mdW5jdGlvbiBsb2FkSHRtbCh1cmkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgodXJpKSlcbiAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBnZXQgJHt1cml9OmAsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKGA8ZGl2IGlkPSd0ZW1wbGF0ZXMtLSR7dXJpfSc+YClcbiAgICAgICAgICAuYXBwZW5kKGh0bWwpXG4gICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpXG4gICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKCdidWlsZC90ZW1wbGF0ZXMuaHRtbCcpXG59XG5cbmZ1bmN0aW9uIGxvYWRNYXJrZG93bigpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKFwiYnVpbGQvbWFya2Rvd24uaHRtbFwiKVxufVxuZnVuY3Rpb24gb25BcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgbG9jYXRpb24ucmVsb2FkKClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gYXBwbGljYXRpb25DYWNoZVxuICBpZiAoYWMpIHtcbiAgICBzd2l0Y2ggKGFjLnN0YXR1cykge1xuICAgICAgY2FzZSBhYy5VUERBVEVSRUFEWTpcbiAgICAgICAgb25BcHBsaWNhdGlvblVwZGF0ZSgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIGFjLkNIRUNLSU5HOlxuICAgICAgY2FzZSBhYy5PQlNPTEVURTpcbiAgICAgIGNhc2UgYWMuRE9XTkxPQURJTkc6XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gVGhpcyBuZXZlciByZXNvbHZlczsgaXQgcmVsb2FkcyB0aGUgcGFnZSB3aGVuIHRoZVxuICAgICAgICAgIC8vIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICAgICAgICB3aW5kb3cuJHJvb3QuYm9keShcInVwZGF0aW5nLWFwcGNhY2hlXCIpXG4gICAgICAgICAgd2luZG93LmFwcGxpY2F0aW9uQ2FjaGUuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlcmVhZHknLCBvbkFwcGxpY2F0aW9uVXBkYXRlKVxuICAgICAgICB9KVxuICAgIH1cbiAgfVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgd2luZG93LiRyb290Lm9wZW4obG9jYXRpb24uaGFzaCB8fCBcIiNpbnRyb1wiKVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oKCkgPT4gRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKCkpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihsb2FkQVBJKVxuICAgIC50aGVuKGdldFBsdWdpbnMpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxuICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkxvYWRpbmc6XCIsIGVycikpXG59XG5cblxuJChzdGFydClcblxuLy8gRW5hYmxlIGxpdmVyZWxvYWQgaW4gZGV2ZWxvcG1lbnRcbmlmICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnKSB7XG4gICQuZ2V0U2NyaXB0KFwiaHR0cDovL2xvY2FsaG9zdDozNTcyOS9saXZlcmVsb2FkLmpzXCIpXG59XG4iLCIvKmdsb2JhbCBzZXR1cEV2ZW50cyovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAgKi9cblxuZnVuY3Rpb24gaXNMb2NhbChhbmNob3IpIHtcbiAgcmV0dXJuIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gYW5jaG9yLnByb3RvY29sICYmXG4gICAgICAgICAgbG9jYXRpb24uaG9zdCA9PT0gYW5jaG9yLmhvc3QpXG59XG5cblxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIC8vIElnbm9yZSBjbGlja3Mgb24gdGhpbmdzIG91dHNpZGUgdGhpcyBwYWdlXG4gIGlmICghaXNMb2NhbCh0aGlzKSkgeyByZXR1cm4gdHJ1ZSB9XG5cbiAgLy8gSWdub3JlIGNsaWNrcyBvbiBhbiBlbGVtZW50IGluIGFuIGV4YW1wbGUuXG4gIGlmICgkKGV2dC50YXJnZXQpLnBhcmVudHMoXCJsaXZlLWV4YW1wbGVcIikubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICAvLyBJZ25vcmUgY2xpY2tzIG9uIGxpbmtzIHRoYXQgbWF5IGhhdmUgZS5nLiBkYXRhLWJpbmQ9Y2xpY2s6IC4uLlxuICAvLyAoZS5nLiBvcGVuIGpzRmlkZGxlKVxuICBpZiAoIWV2dC50YXJnZXQuaGFzaCkgeyByZXR1cm4gdHJ1ZSB9XG4gIHRyeSB7XG4gICAgJHJvb3Qub3BlbihldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhgRXJyb3IvJHtldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpfWAsIGUpXG4gIH1cbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgdGhpcy5ocmVmKVxuICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgJHskKHRoaXMpLnRleHQoKX1gXG4gIHJldHVybiBmYWxzZVxufVxuXG5cbmZ1bmN0aW9uIG9uUG9wU3RhdGUoLyogZXZ0ICovKSB7XG4gIC8vIENvbnNpZGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbiAgJHJvb3Qub3Blbihsb2NhdGlvbi5oYXNoKVxufVxuXG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRzKCkge1xuICAkKGRvY3VtZW50LmJvZHkpXG4gICAgLm9uKCdjbGljaycsIFwiYVwiLCBvbkFuY2hvckNsaWNrKVxuXG4gICQod2luZG93KVxuICAgIC5vbigncG9wc3RhdGUnLCBvblBvcFN0YXRlKVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJHaXRodWIg4oCUIFJlcG9zaXRvcnlcIixcbiAgICBpY29uOiBcImZhLWdpdGh1YlwifSxcbiAgeyBocmVmOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9pc3N1ZXMvXCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3JlbGVhc2VzJyxcbiAgICB0aXRsZTogXCJSZWxlYXNlc1wiLFxuICAgIGljb246IFwiZmEtY2VydGlmaWNhdGVcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQva25vY2tvdXQnLFxuICAgIHRpdGxlOiBcIkdpdHRlclwiLFxuICAgIGljb246IFwiZmEtY29tbWVudHMtb1wifSxcbiAgeyBocmVmOiAnbGVnYWN5LycsXG4gICAgdGl0bGU6IFwiTGVnYWN5IHdlYnNpdGVcIixcbiAgICBpY29uOiBcImZhIGZhLWhpc3RvcnlcIn1cbl1cblxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0IENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmUgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1kZWJ1Zy5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LW1pbi5qc1wiXG4gIH1cbl1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==