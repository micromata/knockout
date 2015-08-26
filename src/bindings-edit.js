
var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
}

function setupEditor(element, language, exampleName) {
  var example = ko.unwrap(exampleName)
  var editor = ace.edit(element)
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
  editor.on('change', function () { example[language](editor.getValue()) })
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
    setTimeout(() => setupEditor(element, 'javascript', va(), 25))
  }
}

ko.bindingHandlers['edit-html'] = {
  init: function (element, va) {
    // Defer so the page rendering is faster
    // TODO: Wait until in view http://stackoverflow.com/a/7557433/19212
    setTimeout(() => setupEditor(element, 'html', va()), 25)
    // debugger
    // editor.session.setOptions({
    // // $worker.call('changeOptions', [{
    //   'expected-doctype-but-got-chars': false,
    //   'expected-doctype-but-got-end-tag': false,
    //   'expected-doctype-but-got-start-tag': false
    // })
  }
}
