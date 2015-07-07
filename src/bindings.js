/* global ace, Example */
/* eslint no-new-func: 0*/

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
}

function setupEditor(element, language, exampleName) {
  var example = Example.get(ko.unwrap(exampleName))
  var editor = ace.edit(element)
  var session = editor.getSession()
  editor.setTheme(`ace/theme/${languageThemeMap[language]}`)
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 15
  })
  session.setMode(`ace/mode/${language}`)
  editor.on('change', () => example[language](editor.getValue()))
  example[language].subscribe(function (v) {
    if (editor.getValue() !== v) {
      editor.setValue(v)
    }
  })
  editor.setValue(example[language]())
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
        ko.cleanNode(element.children[0])
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

      if (!html) {
        onError("There's no HTML to bind to.")
        return
      }

      try {
        resetElement()
        $(element.children[0])
          .html(example.html())
        new Function('node', script)(element.children[0])
      } catch(e) {
        onError(e)
      }
    })

    ko.utils.domNodeDisposal.addDisposeCallback(element, () => subs.dispose())
    return {controlsDescendantBindings: true}
  }
}
