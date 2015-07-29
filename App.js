var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, h1 = DOM.h1

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({


  getInitialState: function() {
    return {items: this.props.items, disabled: true}
  },

  render: function() {

    return div(null,

      ul({children: this.state.items.map(function(item) {
        return h1(null, item)
      })})

    )

  },
})
