# ab-scroller

Simple touch-enabled scroller.

Plain vanilla, no jQuery.
Touch-only (will add mouse control later).
Uses translate3d transforms for maximum performance.
Works for vertical and horizontal axis.

## Install

With [npm](http://npmjs.org) do:

```bash
$ npm install ab-scroller --save-dev
```

## Usage
	
	var ABScroller  = require('ab-scroller');

	var my_scroller = new ABScroller({
		element: my_element // use my_element[0] if you're using a jQuery selector
        drag_distance_limit: 30, // bounce-back distance
        orientation: 'vertical', // axis
	});

## License

MIT
