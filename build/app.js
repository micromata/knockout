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

    // applicationCache progress
    this.reloadProgress = ko.observable();
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

ko.bindingHandlers.result = {
  init: function init(element, va) {
    var $e = $(element);
    var example = ko.unwrap(va());

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
/* global setupEvents, Example, Documentation, API */

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
  if (!ac) {
    return Promise.resolve();
  }
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
  ac.onprogress = function (evt) {
    if (evt.lengthComputable) {
      window.$root.reloadProgress(evt.loaded / evt.total);
    } else {
      window.$root.reloadProgress(false);
    }
  };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiU2VhcmNoLmpzIiwiYmluZGluZ3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVTSxHQUFHO0FBQ0ksV0FEUCxHQUFHLENBQ0ssSUFBSSxFQUFFOzBCQURkLEdBQUc7O0FBRUwsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7QUFDaEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDakQ7O2VBVEcsR0FBRzs7V0FXQyxrQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLGtCQUFVLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxVQUFLLElBQUksQ0FBRTtLQUMxQzs7O1NBYkcsR0FBRzs7O0FBZ0JULEdBQUcsQ0FBQyxPQUFPLEdBQUcsbURBQW1ELENBQUE7O0FBR2pFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFBOztBQUVoQyxHQUFHLENBQUMsR0FBRyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ3pC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QUFFLGVBQWU7QUFDdEIsTUFBSSxFQUFFLG1CQUFtQixFQUFDLEVBQzVCLEVBQUUsSUFBSSxFQUFFLHFDQUFxQztBQUMzQyxPQUFLLEVBQUUsUUFBUTtBQUNmLE1BQUksRUFBRSxlQUFlLEVBQUMsRUFDeEIsRUFBRSxJQUFJLEVBQUUsU0FBUztBQUNmLE9BQUssRUFBRSxnQkFBZ0I7QUFDdkIsTUFBSSxFQUFFLGVBQWUsRUFBQyxDQUN6QixDQUFBOztBQUdELE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FDWCxFQUFFLElBQUksRUFBRSxlQUFlO0FBQ3JCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSwyREFBMkQ7QUFDaEUsT0FBSyxFQUFFLGlFQUFpRTtDQUN6RSxFQUNELEVBQUUsSUFBSSxFQUFFLGdCQUFnQjtBQUN0QixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUseUVBQXlFO0FBQzlFLE9BQUssRUFBRSx1RUFBdUU7Q0FDL0UsQ0FDRixDQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEFQSSBjb252ZXJ0cyB0aGUgYG9waW5lYC1mbGF2b3VyZWQgZG9jdW1lbnRhdGlvbiBoZXJlLlxuXG4gSGVyZSBpcyBhIHNhbXBsZTpcbiovXG4vLyAvKi0tLVxuLy8gIHB1cnBvc2U6IGtub2Nrb3V0LXdpZGUgc2V0dGluZ3Ncbi8vICAqL1xuLy8gdmFyIHNldHRpbmdzID0geyAvKi4uLiovIH1cblxuY2xhc3MgQVBJIHtcbiAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZVxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZVxuICAgIHRoaXMuc291cmNlID0gc3BlYy5zb3VyY2VcbiAgICB0aGlzLmxpbmUgPSBzcGVjLmxpbmVcbiAgICB0aGlzLnB1cnBvc2UgPSBzcGVjLnZhcnMucHVycG9zZVxuICAgIHRoaXMuc3BlYyA9IHNwZWMudmFycy5wYXJhbXNcbiAgICB0aGlzLnVybCA9IHRoaXMuYnVpbGRVcmwoc3BlYy5zb3VyY2UsIHNwZWMubGluZSlcbiAgfVxuXG4gIGJ1aWxkVXJsKHNvdXJjZSwgbGluZSkge1xuICAgIHJldHVybiBgJHtBUEkudXJsUm9vdH0ke3NvdXJjZX0jTCR7bGluZX1gXG4gIH1cbn1cblxuQVBJLnVybFJvb3QgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9ibG9iL21hc3Rlci9cIlxuXG5cbkFQSS5pdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG5cbkFQSS5hZGQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY29uc29sZS5sb2coXCJUXCIsIHRva2VuKVxuICBBUEkuaXRlbXMucHVzaChuZXcgQVBJKHRva2VuKSlcbn1cbiIsIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgYW5kIENvbXBvbmVudHNcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiLFxuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5leGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHBhcmFtcy5pZCkpXG4gICAgfVxuICAgIGlmIChwYXJhbXMuYmFzZTY0KSB7XG4gICAgICB2YXIgb3B0cyA9XG4gICAgICB0aGlzLmV4YW1wbGUgPSBuZXcgRXhhbXBsZShKU09OLnBhcnNlKGF0b2IocGFyYW1zLmJhc2U2NCkpKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhhbXBsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhhbXBsZSBtdXN0IGJlIHByb3ZpZGVkIGJ5IGlkIG9yIGJhc2U2NCBwYXJhbWV0ZXJcIilcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4SWQgPSBrby51bndyYXAodGhpcy5leGFtcGxlKVxuICAgIHZhciBleCA9IEV4YW1wbGUuZ2V0KGV4SWQpXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgKCR7ZXhJZH0pIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlICgke2V4SWR9KWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkLCBTZWFyY2gqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBwbHVnaW5zIC0tLVxuICAgIHRoaXMucGx1Z2luUmVwb3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuICAgIHRoaXMuc29ydGVkUGx1Z2luUmVwb3MgPSB0aGlzLnBsdWdpblJlcG9zXG4gICAgICAuZmlsdGVyKHRoaXMucGx1Z2luRmlsdGVyLmJpbmQodGhpcykpXG4gICAgICAuc29ydEJ5KHRoaXMucGx1Z2luU29ydEJ5LmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMucGx1Z2luTmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuXG4gICAgLy8gYXBwbGljYXRpb25DYWNoZSBwcm9ncmVzc1xuICAgIHRoaXMucmVsb2FkUHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICB2YXIgcHAgPSBwaW5wb2ludC5yZXBsYWNlKFwiI1wiLCBcIlwiKVxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHApXG4gICAgdmFyIG1kTm9kZSwgbWROb2RlSWRcbiAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgdGhpcy5ib2R5KHBwKVxuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgfVxuXG4gIHJlZ2lzdGVyUGx1Z2lucyhwbHVnaW5zKSB7XG4gICAgT2JqZWN0LmtleXMocGx1Z2lucykuZm9yRWFjaChmdW5jdGlvbiAocmVwbykge1xuICAgICAgdmFyIGFib3V0ID0gcGx1Z2luc1tyZXBvXVxuICAgICAgdGhpcy5wbHVnaW5SZXBvcy5wdXNoKHJlcG8pXG4gICAgICB0aGlzLnBsdWdpbk1hcC5zZXQocmVwbywgYWJvdXQpXG4gICAgfSwgdGhpcylcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQodHJ1ZSlcbiAgfVxuXG4gIHBsdWdpbkZpbHRlcihyZXBvKSB7XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLnBsdWdpbk5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBwbHVnaW5Tb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYCMke3RlbXBsYXRlLmlkfWBcbiAgICB0aGlzLnRpdGxlID0gdGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgYOKAnCR7dGVtcGxhdGUuaWR94oCdYFxuICB9XG59XG5cblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIHNlYXJjaFJhdGUgPSB7XG4gICAgICB0aW1lb3V0OiA1MDAsXG4gICAgICBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCJcbiAgICB9XG4gICAgdGhpcy5xdWVyeSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogc2VhcmNoUmF0ZX0pXG4gICAgdGhpcy5yZXN1bHRzID0ga28uY29tcHV0ZWQodGhpcy5jb21wdXRlUmVzdWx0cywgdGhpcylcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gdGhpcy5xdWVyeSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBudWxsIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG59XG4iLCIvKiBnbG9iYWwgYWNlLCBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tbmV3LWZ1bmM6IDAsIG5vLXVuZGVyc2NvcmUtZGFuZ2xlOjAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5fYXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcblxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbmZ1bmN0aW9uIHNldHVwRWRpdG9yKGVsZW1lbnQsIGxhbmd1YWdlLCBleGFtcGxlTmFtZSkge1xuICB2YXIgZXhhbXBsZSA9IGtvLnVud3JhcChleGFtcGxlTmFtZSlcbiAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke2xhbmd1YWdlVGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiB0cnVlLFxuICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZXM6IDMsXG4gICAgbWF4TGluZXM6IDMwLFxuICAgIHdyYXA6IHRydWVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBleGFtcGxlW2xhbmd1YWdlXShlZGl0b3IuZ2V0VmFsdWUoKSkgfSlcbiAgZXhhbXBsZVtsYW5ndWFnZV0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGVkaXRvci5nZXRWYWx1ZSgpICE9PSB2KSB7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodilcbiAgICB9XG4gIH0pXG4gIGVkaXRvci5zZXRWYWx1ZShleGFtcGxlW2xhbmd1YWdlXSgpKVxuICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIHJldHVybiBlZGl0b3Jcbn1cblxuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFyc1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtanMnXSA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSlcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0ga28udW53cmFwKHZhKCkpXG5cbiAgICBmdW5jdGlvbiByZXNldEVsZW1lbnQoKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICBrby5jbGVhbk5vZGUoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cbiAgICAgICRlLmVtcHR5KCkuYXBwZW5kKGA8ZGl2IGNsYXNzPSdleGFtcGxlICR7ZXhhbXBsZS5jc3N9Jz5gKVxuICAgIH1cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgICAgdmFyIHNjcmlwdCA9IGV4YW1wbGUuZmluYWxKYXZhc2NyaXB0KClcbiAgICAgIHZhciBodG1sID0gZXhhbXBsZS5odG1sKClcblxuICAgICAgaWYgKHNjcmlwdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyb3Ioc2NyaXB0KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgIG9uRXJyb3IoXCJUaGVyZSdzIG5vIEhUTUwgdG8gYmluZCB0by5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBTdHViIGtvLmFwcGx5QmluZGluZ3NcbiAgICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBXZSBpZ25vcmUgdGhlIGBub2RlYCBhcmd1bWVudCBpbiBmYXZvdXIgb2YgdGhlIGV4YW1wbGVzJyBub2RlLlxuICAgICAgICBrby5fYXBwbHlCaW5kaW5ncyhlLCBlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICByZXNldEVsZW1lbnQoKVxuICAgICAgICAkKGVsZW1lbnQuY2hpbGRyZW5bMF0pLmh0bWwoaHRtbClcbiAgICAgICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKCdub2RlJywgc2NyaXB0KVxuICAgICAgICBrby5pZ25vcmVEZXBlbmRlbmNpZXMoZm4sIG51bGwsIFtlbGVtZW50LmNoaWxkcmVuWzBdXSlcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBvbkVycm9yKGUpXG4gICAgICB9XG4gICAgICBrby5hcHBseUJpbmRpbmdzID0ga28uX2FwcGx5QmluZGluZ3NcbiAgICB9XG5cbiAgICBrby5jb21wdXRlZCh7XG4gICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQsXG4gICAgICByZWFkOiByZWZyZXNoXG4gICAgfSlcblxuICAgIHJldHVybiB7Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWV9XG4gIH1cbn1cblxudmFyIGVtYXAgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCdcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAvJmFtcDt8Jmx0Oy9nLFxuICAgIGZ1bmN0aW9uIChlbnQpIHsgcmV0dXJuIGVtYXBbZW50XX1cbiAgKVxufVxuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDEsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDM1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG4iLCIvKiBnbG9iYWwgc2V0dXBFdmVudHMsIEV4YW1wbGUsIERvY3VtZW50YXRpb24sIEFQSSAqL1xuXG5mdW5jdGlvbiBsb2FkSHRtbCh1cmkpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgodXJpKSlcbiAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgaWYgKHR5cGVvZiBodG1sICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBnZXQgJHt1cml9OmAsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKGA8ZGl2IGlkPSd0ZW1wbGF0ZXMtLSR7dXJpfSc+YClcbiAgICAgICAgICAuYXBwZW5kKGh0bWwpXG4gICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpXG4gICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKCdidWlsZC90ZW1wbGF0ZXMuaHRtbCcpXG59XG5cbmZ1bmN0aW9uIGxvYWRNYXJrZG93bigpIHtcbiAgcmV0dXJuIGxvYWRIdG1sKFwiYnVpbGQvbWFya2Rvd24uaHRtbFwiKVxufVxuZnVuY3Rpb24gb25BcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgbG9jYXRpb24ucmVsb2FkKClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gYXBwbGljYXRpb25DYWNoZVxuICBpZiAoIWFjKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKSB9XG4gIHN3aXRjaCAoYWMuc3RhdHVzKSB7XG4gICAgY2FzZSBhYy5VUERBVEVSRUFEWTpcbiAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlIGFjLkNIRUNLSU5HOlxuICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgY2FzZSBhYy5ET1dOTE9BRElORzpcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgLy8gdXBkYXRlIGlzIGNvbXBsZXRlLlxuICAgICAgICB3aW5kb3cuJHJvb3QuYm9keShcInVwZGF0aW5nLWFwcGNhY2hlXCIpXG4gICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgIH0pXG4gIH1cbiAgYWMub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gZ2V0RXhhbXBsZXMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9leGFtcGxlcy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIE9iamVjdC5rZXlzKHJlc3VsdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBzZXR0aW5nID0gcmVzdWx0c1tuYW1lXVxuICAgICAgRXhhbXBsZS5zZXQoc2V0dGluZy5pZCB8fCBuYW1lLCBzZXR0aW5nKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBsb2FkQVBJKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvYXBpLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgcmVzdWx0cy5hcGkuZm9yRWFjaChmdW5jdGlvbiAoYXBpRmlsZUxpc3QpIHtcbiAgICAgIC8vIFdlIGVzc2VudGlhbGx5IGhhdmUgdG8gZmxhdHRlbiB0aGUgYXBpIChGSVhNRSlcbiAgICAgIGFwaUZpbGVMaXN0LmZvckVhY2goQVBJLmFkZClcbiAgICB9KVxuICApXG59XG5cblxuZnVuY3Rpb24gZ2V0UGx1Z2lucygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL3BsdWdpbnMuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT4gJHJvb3QucmVnaXN0ZXJQbHVnaW5zKHJlc3VsdHMpKVxufVxuXG5cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3MoKSB7XG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAgd2luZG93LiRyb290ID0gbmV3IFBhZ2UoKVxuICBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5cbmZ1bmN0aW9uIHBhZ2VMb2FkZWQoKSB7XG4gIHdpbmRvdy4kcm9vdC5vcGVuKGxvY2F0aW9uLmhhc2ggfHwgXCIjaW50cm9cIilcbn1cblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgUHJvbWlzZS5hbGwoW2xvYWRUZW1wbGF0ZXMoKSwgbG9hZE1hcmtkb3duKCldKVxuICAgIC50aGVuKCgpID0+IERvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSgpKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oZ2V0RXhhbXBsZXMpXG4gICAgLnRoZW4obG9hZEFQSSlcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJMb2FkaW5nOlwiLCBlcnIpKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG5cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICAvLyBJZ25vcmUgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwodGhpcykpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIElnbm9yZSBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChldnQudGFyZ2V0KS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgLy8gSWdub3JlIGNsaWNrcyBvbiBsaW5rcyB0aGF0IG1heSBoYXZlIGUuZy4gZGF0YS1iaW5kPWNsaWNrOiAuLi5cbiAgLy8gKGUuZy4gb3BlbiBqc0ZpZGRsZSlcbiAgaWYgKCFldnQudGFyZ2V0Lmhhc2gpIHsgcmV0dXJuIHRydWUgfVxuICB0cnkge1xuICAgICRyb290Lm9wZW4oZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7ZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHRoaXMuaHJlZilcbiAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBDb25zaWRlciBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICRyb290Lm9wZW4obG9jYXRpb24uaGFzaClcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgJChkb2N1bWVudC5ib2R5KVxuICAgIC5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcblxuICAkKHdpbmRvdylcbiAgICAub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIkdpdGh1YiDigJQgSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=