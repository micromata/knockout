var Metalsmith  			= require('metalsmith')
var collections 			= require('metalsmith-collections')
var layouts     			= require('metalsmith-layouts')
var markdown    			= require('metalsmith-markdown')
var permalinks  			= require('metalsmith-permalinks')
var codeHighlighting	= require('metalsmith-code-highlight')

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
  .use(markdown())            // transpile all md into html
  .use(permalinks({           // change URLs to permalink URLs
    relative: false           // put css only in /css
  }))
	.use(codeHighlighting())
  .use(layouts({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
  }))
  .build(function(err) {      // build process
    if (err) throw err       // error handling is required
  })
