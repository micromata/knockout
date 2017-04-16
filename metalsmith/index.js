const Metalsmith        = require('metalsmith')
const collections       = require('metalsmith-collections')
const layouts           = require('metalsmith-layouts')
const lunr              = require('metalsmith-lunr')
const markdown          = require('metalsmith-markdown')
const permalinks        = require('metalsmith-permalinks')
const codeHighlighting  = require('metalsmith-code-highlight')

Metalsmith(__dirname)
  .metadata({
    title: 'Knockout Reloaded (TKO)',
    sitename: "My Static Site & Blog",
    siteurl: "http://example.com/",
    description: "It's about saying »Hello« to the world.",
    generator: "Metalsmith",
    generatorurl: "http://metalsmith.io"
  })
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  .use(collections({          // group all blog posts by internally
    posts: 'posts/*.md'       // adding key 'collections':'posts'
  }))                         // use `collections.posts` in layouts
  .use(lunr({
    ref: 'title',
    indexPath: 'searchIndex.json',
    fields: {
      contents: 1,
      tags: 10,
    },
  }))
  .use(markdown())            // transpile all md into html
  .use(permalinks({           // change URLs to permalink URLs
    relative: false           // put css only in /css
  }))
  .use(codeHighlighting())
  .use(layouts({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
    rename: true,
    default: 'default.hbs',
    pattern: '**/*.md',
    partialExtension: '.hbs',
  }))
  .build((error) => {        // build process
    if (error) console.error(error) // error handling is required
  })
