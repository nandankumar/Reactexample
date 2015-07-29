var http = require('http'),
    browserify = require('browserify'),
    literalify = require('literalify'),
    React = require('react'),
    DOM = React.DOM, body = DOM.body, div = DOM.div, script = DOM.script,
    // This is our React component, shared by server and browser thanks to browserify
    App = React.createFactory(require('./App'))



http.createServer(function(req, res) {

  // If we hit the homepage, then we want to serve up some HTML - including the
  // server-side rendered React component(s), as well as the script tags
  // pointing to the client-side code
  if (req.url == '/') {

    res.setHeader('Content-Type', 'text/html')


    var props = {
      items: [
      {"image" :  'http://thumbs.dreamstime.com/x/blue-banner-illustration-2665897.jpg'},
      {"description" :  'Sapient is a marketing and consulting company that provides business, marketing, and technology services to clients. The company operates three divisions, SapientNitro, Sapient Global Markets and Sapient Government Services.It was announced on November 3, 2014 that Sapient was to be acquired by French advertising giant Publicis for $3.7bn (£2.3bn) in an all cash offer. Publicis expects to complete the purchase after 11.59 am EST on February 5, 2015. The deal comes seven months after the collapse of Publicis bid to boost its US presence via a merger with Omnicom'},
      {"heading" :  'Welcome Nandan to  SapientNitro Family'},
      ]
    }

    // Here we're using React to render the outer body, so we just use the
    // simpler renderToStaticMarkup function, but you could use any templating
    // language (or just a string) for the outer page template
    var html = React.renderToStaticMarkup(body(null,

      // The actual server-side rendering of our component occurs here, and we
      // pass our data in as `props`. This div is the same one that the client
      // will "render" into on the browser from browser.js
      div({id: 'content', dangerouslySetInnerHTML: {__html:
        React.renderToString(App(props))
      }}),

      // The props should match on the client and server, so we stringify them
      // on the page to be available for access by the code run in browser.js
      // You could use any var name here as long as it's unique
      script({dangerouslySetInnerHTML: {__html:
        'var APP_PROPS = ' + safeStringify(props) + ';'
      }}),

      // We'll load React from a CDN - you don't have to do this,
      // you can bundle it up or serve it locally if you like
      script({src: '//fb.me/react-0.13.3.min.js'}),
      script({src: '//fb.me/JSXTransformer-0.13.1.js'}),
      // Then the browser will fetch and run the browserified bundle consisting
      // of browser.js and all its dependencies.
      // We serve this from the endpoint a few lines down.
      script({src: '/bundle.js'})
    ))

    // Return the page to the browser
    res.end(html)

  // This endpoint is hit when the browser is requesting bundle.js from the page above
  } else if (req.url == '/bundle.js') {

    res.setHeader('Content-Type', 'text/javascript')


    browserify()
      .add('./browser.js')
      .transform(literalify.configure({react: 'window.React'}))
      .bundle()
      .pipe(res)

  // Return 404 for all other requests
  } else {
    res.statusCode = 404
    res.end()
  }

// The http server listens on port 3000
}).listen(3000, function(err) {
  if (err) throw err
  console.log('Listening on 3000...')
})


// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
