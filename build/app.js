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
  3: "Bindings (“data-bind”)",
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
/* global setupEvents, Example, Documentation */

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
  }).then(applyBindings).then(getExamples).then(getPlugins).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)["catch"](function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiU2VhcmNoLmpzIiwiYmluZGluZ3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFDTSxhQUFhLEdBQ04sU0FEUCxhQUFhLENBQ0wsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFO3dCQURoRCxhQUFhOztBQUVmLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLE1BQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0NBQy9COztBQUdILGFBQWEsQ0FBQyxhQUFhLEdBQUc7QUFDNUIsR0FBQyxFQUFFLGlCQUFpQjtBQUNwQixHQUFDLEVBQUUsYUFBYTtBQUNoQixHQUFDLEVBQUUsd0JBQXdCO0FBQzNCLEdBQUMsRUFBRSxtQkFBbUI7QUFDdEIsR0FBQyxFQUFFLHFCQUFxQjtDQUN6QixDQUFBOztBQUVELGFBQWEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFO0FBQzFDLFNBQU8sSUFBSSxhQUFhLENBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQ2pDLENBQUE7Q0FDRixDQUFBOztBQUVELGFBQWEsQ0FBQyxVQUFVLEdBQUcsWUFBWTtBQUNyQyxlQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQzdCLENBQUMsQ0FBQywyQkFBMkIsQ0FB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QixFQUFFLElBQUksRUFBRSxnREFBZ0Q7QUFDdEQsT0FBSyxFQUFFLGVBQWU7QUFDdEIsTUFBSSxFQUFFLG1CQUFtQixFQUFDLEVBQzVCLEVBQUUsSUFBSSxFQUFFLHFDQUFxQztBQUMzQyxPQUFLLEVBQUUsUUFBUTtBQUNmLE1BQUksRUFBRSxlQUFlLEVBQUMsRUFDeEIsRUFBRSxJQUFJLEVBQUUsU0FBUztBQUNmLE9BQUssRUFBRSxnQkFBZ0I7QUFDdkIsTUFBSSxFQUFFLGVBQWUsRUFBQyxDQUN6QixDQUFBOztBQUdELE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FDWCxFQUFFLElBQUksRUFBRSxlQUFlO0FBQ3JCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSwyREFBMkQ7QUFDaEUsT0FBSyxFQUFFLGlFQUFpRTtDQUN6RSxFQUNELEVBQUUsSUFBSSxFQUFFLGdCQUFnQjtBQUN0QixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUseUVBQXlFO0FBQzlFLE9BQUssRUFBRSx1RUFBdUU7Q0FDL0UsQ0FDRixDQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgKOKAnGRhdGEtYmluZOKAnSlcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiLFxuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5leGFtcGxlID0gcGFyYW1zLmlkXG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4SWQgPSBrby51bndyYXAodGhpcy5leGFtcGxlKVxuICAgIHZhciBleCA9IEV4YW1wbGUuZ2V0KGV4SWQpXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgKCR7ZXhJZH0pIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlICgke2V4SWR9KWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkLCBTZWFyY2gqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBwbHVnaW5zIC0tLVxuICAgIHRoaXMucGx1Z2luUmVwb3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuICAgIHRoaXMuc29ydGVkUGx1Z2luUmVwb3MgPSB0aGlzLnBsdWdpblJlcG9zXG4gICAgICAuZmlsdGVyKHRoaXMucGx1Z2luRmlsdGVyLmJpbmQodGhpcykpXG4gICAgICAuc29ydEJ5KHRoaXMucGx1Z2luU29ydEJ5LmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMucGx1Z2luTmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIHZhciBwcCA9IHBpbnBvaW50LnJlcGxhY2UoXCIjXCIsIFwiXCIpXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcClcbiAgICB2YXIgbWROb2RlLCBtZE5vZGVJZFxuICAgIHRoaXMudGl0bGUobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJylcbiAgICB0aGlzLmJvZHkocHApXG4gICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgcGx1Z2luRmlsdGVyKHJlcG8pIHtcbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMucGx1Z2luTmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHBsdWdpblNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cbn1cbiIsIlxuY2xhc3MgU2VhcmNoUmVzdWx0IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLmxpbmsgPSBgIyR7dGVtcGxhdGUuaWR9YFxuICAgIHRoaXMudGl0bGUgPSB0ZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCBg4oCcJHt0ZW1wbGF0ZS5pZH3igJ1gXG4gIH1cbn1cblxuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgc2VhcmNoUmF0ZSA9IHtcbiAgICAgIHRpbWVvdXQ6IDUwMCxcbiAgICAgIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIlxuICAgIH1cbiAgICB0aGlzLnF1ZXJ5ID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBzZWFyY2hSYXRlfSlcbiAgICB0aGlzLnJlc3VsdHMgPSBrby5jb21wdXRlZCh0aGlzLmNvbXB1dGVSZXN1bHRzLCB0aGlzKVxuICB9XG5cbiAgY29tcHV0ZVJlc3VsdHMoKSB7XG4gICAgdmFyIHEgPSB0aGlzLnF1ZXJ5KClcbiAgICBpZiAoIXEpIHsgcmV0dXJuIG51bGwgfVxuICAgIHJldHVybiAkKGB0ZW1wbGF0ZWApXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQodGhpcy5jb250ZW50KS50ZXh0KCkuaW5kZXhPZihxKSAhPT0gLTFcbiAgICAgIH0pXG4gICAgICAubWFwKChpLCB0ZW1wbGF0ZSkgPT4gbmV3IFNlYXJjaFJlc3VsdCh0ZW1wbGF0ZSkpXG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBhY2UsIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby1uZXctZnVuYzogMCwgbm8tdW5kZXJzY29yZS1kYW5nbGU6MCovXG5cbi8vIFNhdmUgYSBjb3B5IGZvciByZXN0b3JhdGlvbi91c2VcbmtvLl9hcHBseUJpbmRpbmdzID0ga28uYXBwbHlCaW5kaW5nc1xuXG52YXIgbGFuZ3VhZ2VUaGVtZU1hcCA9IHtcbiAgaHRtbDogJ3NvbGFyaXplZF9kYXJrJyxcbiAgamF2YXNjcmlwdDogJ21vbm9rYWknXG59XG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInRvbW9ycm93XCJcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKGV4YW1wbGVOYW1lKSlcbiAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke2xhbmd1YWdlVGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiB0cnVlLFxuICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZXM6IDMsXG4gICAgbWF4TGluZXM6IDMwLFxuICAgIHdyYXA6IHRydWVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBleGFtcGxlW2xhbmd1YWdlXShlZGl0b3IuZ2V0VmFsdWUoKSkgfSlcbiAgZXhhbXBsZVtsYW5ndWFnZV0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGVkaXRvci5nZXRWYWx1ZSgpICE9PSB2KSB7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodilcbiAgICB9XG4gIH0pXG4gIGVkaXRvci5zZXRWYWx1ZShleGFtcGxlW2xhbmd1YWdlXSgpKVxuICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIHJldHVybiBlZGl0b3Jcbn1cblxuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFyc1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtanMnXSA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSlcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHZhKCkpKVxuXG4gICAgZnVuY3Rpb24gcmVzZXRFbGVtZW50KCkge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5bMF0pIHtcbiAgICAgICAga28uY2xlYW5Ob2RlKGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG4gICAgICAkZS5lbXB0eSgpLmFwcGVuZChgPGRpdiBjbGFzcz0nZXhhbXBsZSAke2V4YW1wbGUuY3NzfSc+YClcbiAgICB9XG4gICAgcmVzZXRFbGVtZW50KClcblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IobXNnKSB7XG4gICAgICAkKGVsZW1lbnQpXG4gICAgICAgIC5odG1sKGA8ZGl2IGNsYXNzPSdlcnJvcic+RXJyb3I6ICR7bXNnfTwvZGl2PmApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmZpbmFsSmF2YXNjcmlwdCgpXG4gICAgICB2YXIgaHRtbCA9IGV4YW1wbGUuaHRtbCgpXG5cbiAgICAgIGlmIChzY3JpcHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvbkVycm9yKHNjcmlwdClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3R1YiBrby5hcHBseUJpbmRpbmdzXG4gICAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIHRoZSBgbm9kZWAgYXJndW1lbnQgaW4gZmF2b3VyIG9mIHRoZSBleGFtcGxlcycgbm9kZS5cbiAgICAgICAga28uX2FwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdClcbiAgICAgICAga28uaWdub3JlRGVwZW5kZW5jaWVzKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgICAga28uYXBwbHlCaW5kaW5ncyA9IGtvLl9hcHBseUJpbmRpbmdzXG4gICAgfVxuXG4gICAga28uY29tcHV0ZWQoe1xuICAgICAgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50LFxuICAgICAgcmVhZDogcmVmcmVzaFxuICAgIH0pXG5cbiAgICByZXR1cm4ge2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlfVxuICB9XG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxuXG5rby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0ID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGxhbmd1YWdlID0gdmEoKVxuICAgIGlmIChsYW5ndWFnZSAhPT0gJ2h0bWwnICYmIGxhbmd1YWdlICE9PSAnamF2YXNjcmlwdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJBIGxhbmd1YWdlIHNob3VsZCBiZSBzcGVjaWZpZWQuXCIsIGVsZW1lbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGNvbnRlbnQgPSB1bmVzY2FwZSgkZS50ZXh0KCkpXG4gICAgJGUuZW1wdHkoKVxuICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICAgIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICAgIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7cmVhZG9ubHlUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiBmYWxzZSxcbiAgICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogMixcbiAgICAgIG1pbkxpbmVzOiAxLFxuICAgICAgd3JhcDogdHJ1ZSxcbiAgICAgIG1heExpbmVzOiAzNSxcbiAgICAgIHJlYWRPbmx5OiB0cnVlXG4gICAgfSlcbiAgICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgICBlZGl0b3Iuc2V0VmFsdWUoY29udGVudClcbiAgICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uICovXG5cbmZ1bmN0aW9uIGxvYWRIdG1sKHVyaSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh1cmkpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIGdldCAke3VyaX06YCwgaHRtbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVTNS08dGVtcGxhdGU+IHNoaW0vcG9seWZpbGw6XG4gICAgICAgIC8vIHVubGVzcyAnY29udGVudCcgb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxuICAgICAgICAvLyAgICMgc2VlIHB2X3NoaW1fdGVtcGxhdGVfdGFnIHJlLiBicm9rZW4tdGVtcGxhdGUgdGFnc1xuICAgICAgICAvLyAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxcXC90ZW1wbGF0ZT4vZywgJzwvc2NyaXB0PicpXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgvPHRlbXBsYXRlL2csICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L3gtdGVtcGxhdGVcIicpXG4gICAgICAgICQoYDxkaXYgaWQ9J3RlbXBsYXRlcy0tJHt1cml9Jz5gKVxuICAgICAgICAgIC5hcHBlbmQoaHRtbClcbiAgICAgICAgICAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSlcbiAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBsb2FkVGVtcGxhdGVzKCkge1xuICByZXR1cm4gbG9hZEh0bWwoJ2J1aWxkL3RlbXBsYXRlcy5odG1sJylcbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtkb3duKCkge1xuICByZXR1cm4gbG9hZEh0bWwoXCJidWlsZC9tYXJrZG93bi5odG1sXCIpXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gZ2V0RXhhbXBsZXMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9leGFtcGxlcy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIE9iamVjdC5rZXlzKHJlc3VsdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBzZXR0aW5nID0gcmVzdWx0c1tuYW1lXVxuICAgICAgRXhhbXBsZS5zZXQoc2V0dGluZy5pZCB8fCBuYW1lLCBzZXR0aW5nKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgd2luZG93LiRyb290Lm9wZW4obG9jYXRpb24uaGFzaCB8fCBcIiNpbnRyb1wiKVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oKCkgPT4gRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKCkpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJMb2FkaW5nOlwiLCBlcnIpKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG5cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICAvLyBJZ25vcmUgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwodGhpcykpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIElnbm9yZSBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChldnQudGFyZ2V0KS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgLy8gSWdub3JlIGNsaWNrcyBvbiBsaW5rcyB0aGF0IG1heSBoYXZlIGUuZy4gZGF0YS1iaW5kPWNsaWNrOiAuLi5cbiAgLy8gKGUuZy4gb3BlbiBqc0ZpZGRsZSlcbiAgaWYgKCFldnQudGFyZ2V0Lmhhc2gpIHsgcmV0dXJuIHRydWUgfVxuICB0cnkge1xuICAgICRyb290Lm9wZW4oZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7ZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHRoaXMuaHJlZilcbiAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBDb25zaWRlciBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICRyb290Lm9wZW4obG9jYXRpb24uaGFzaClcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgJChkb2N1bWVudC5ib2R5KVxuICAgIC5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcblxuICAkKHdpbmRvdylcbiAgICAub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIkdpdGh1YiDigJQgSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=