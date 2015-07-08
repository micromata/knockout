/* global ace, Example */
/* eslint no-new-func: 0, no-underscore-dangle:0*/

// Save a copy for restoration/use
ko._applyBindings = ko.applyBindings

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
}

var readonlyThemeMap = {
  html: "solarized_light",
  javascript: "tomorrow"
}

function setupEditor(element, language, exampleName) {
  var example = Example.get(ko.unwrap(exampleName))
  var editor = ace.edit(element)
  editor.$blockScrolling = Infinity // hides error message
  var session = editor.getSession()
  editor.setTheme(`ace/theme/${languageThemeMap[language]}`)
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 30,
    wrap: true
  })
  session.setMode(`ace/mode/${language}`)
  editor.on('change', () => example[language](editor.getValue()))
  example[language].subscribe(function (v) {
    if (editor.getValue() !== v) {
      editor.setValue(v)
    }
  })
  editor.setValue(example[language]())
  editor.clearSelection()
  ko.utils.domNodeDisposal.addDisposeCallback(element, () => editor.destroy())
  return editor
}

//expected-doctype-but-got-end-tag
//expected-doctype-but-got-start-tag
//expected-doctype-but-got-chars

ko.bindingHandlers['edit-js'] = {
  /* highlight: "langauge" */
  init: function (element, va) {
    setupEditor(element, 'javascript', va())
  }
}

ko.bindingHandlers['edit-html'] = {
  init: function (element, va) {
    setupEditor(element, 'html', va())
    // debugger
    // editor.session.setOptions({
    // // $worker.call('changeOptions', [{
    //   'expected-doctype-but-got-chars': false,
    //   'expected-doctype-but-got-end-tag': false,
    //   'expected-doctype-but-got-start-tag': false
    // })
  }
}


ko.bindingHandlers.result = {
  init: function (element, va) {
    var $e = $(element)
    var example = Example.get(ko.unwrap(va()))

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element)
      }
      $e.empty().append(`<div class='example ${example.css}'>`)
    }
    resetElement()

    function onError(msg) {
      $(element)
        .html(`<div class='error'>Error: ${msg}</div>`)
    }

    var subs = ko.computed(function () {
      var script = example.javascript()
      var html = example.html()

      if (!script) {
        onError("The script is empty.")
        return
      }

      if (script.indexOf('ko.applyBindings(') === -1) {
        if (script.indexOf(' viewModel =') !== -1) {
          // Insert the ko.applyBindings, for convenience.
          example.javascript(
            script + "\nko.applyBindings(viewModel, node)"
          )
        } else {
          onError("ko.applyBindings(view, node) is not called")
          return
        }
      }

      if (!html) {
        onError("There's no HTML to bind to.")
        return
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e, n) {
        ko._applyBindings(e, n || element.children[0])
      }

      try {
        resetElement()
        $(element.children[0]).html(example.html())
        new Function('node', script)(element.children[0])
      } catch(e) {
        onError(e)
      }

      ko.applyBindings = ko._applyBindings
    })

    ko.utils.domNodeDisposal.addDisposeCallback(
      element, () => subs.dispose()
    )
    return {controlsDescendantBindings: true}
  }
}



ko.bindingHandlers.highlight = {
  init: function (element, va) {
    var $e = $(element)
    var language = va()
    if (language !== 'html' && language !== 'javascript') {
      console.error("A language should be specified.", element)
      return
    }
    var content = (language === 'html' ? $e.html() : $e.text())
    $e.empty()
    var editor = ace.edit(element)
    var session = editor.getSession()
    editor.setTheme(`ace/theme/${readonlyThemeMap[language]}`)
    editor.setOptions({
      highlightActiveLine: false,
      useSoftTabs: true,
      tabSize: 2,
      minLines: 3,
      wrap: true,
      maxLines: 25,
      readOnly: true
    })
    session.setMode(`ace/mode/${language}`)
    editor.setValue(content)
    editor.clearSelection()
    ko.utils.domNodeDisposal.addDisposeCallback(element, () => editor.destroy())
  }
}
