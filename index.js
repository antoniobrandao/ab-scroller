'use strict';

var element = require('ab-element');

function ABScroller(options)
{
    if (!(this instanceof ABScroller))
    {
        return new ABScroller(options);
    }
    
    var self = this;

    this.settings =
    {
        element: null,
        drag_distance_limit: 30,
        orientation: 'vertical',
    };

    this.touchListeners     = [];
    this.activated          = false;
	this.invert_direction   = false;

	this.current_position   = 0;
	this.dragTickInterval   = null;

    this.settings = this.extend(this.settings, options);
}

ABScroller.prototype.initVertical = function initVertical()
{
    var self = this;
    
    if (this.activated) { this.disable(); };

    if (this.settings.orientation === 'vertical') {
        var direction_property = 'clientY';
    } else if (this.settings.orientation === 'horizontal') {
        var direction_property = 'clientX';
    }

    this.activated = true;

    var element = this.settings.element;
    var scroll_height_diff = element.clientHeight - element.parentNode.clientHeight;

    var start_position;
    var diff_position;
    var start_value = 0;
    this.current_position = 0;

    element.activateCSSTransitions();

    var processTick = function()
    {
    	if (self.settings.orientation === 'vertical') {
        	element.style.transform = 'translate3d(0px, ' + self.current_position + 'px, 0px)';
	    } else if (self.settings.orientation === 'horizontal') {
	        element.style.transform = 'translate3d(' + self.current_position + 'px, 0px, 0px)';
	    }
    }

    var touchStart = function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        diff_position  = 0;
        start_position = e.targetTouches[0][direction_property];
        self.dragTickInterval = setInterval(processTick, 100);
    }
    var touchMove = function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        self.current_position = e.targetTouches[0][direction_property];
        diff_position = -(start_position - self.current_position);

        if (self.invert_direction) {
            diff_position = diff_position * -1;
        };
        var new_y = start_value + diff_position;

        if (new_y > self.settings.drag_distance_limit) {
        	new_y = self.settings.drag_distance_limit
        };
        if (new_y < -scroll_height_diff-self.settings.drag_distance_limit) {
        	new_y = -scroll_height_diff-self.settings.drag_distance_limit
        };

        self.current_position = new_y;
    }
    var touchEnd = function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        if (diff_position > -5 && diff_position < 5) { /* equivalent to tap */ };

        // limit drag
        if (self.current_position > 0) {
        	self.current_position = 0
        };
        if (self.current_position < -scroll_height_diff) {
        	self.current_position = -scroll_height_diff
        };

        processTick();

        clearInterval(self.dragTickInterval);
        start_value = self.current_position;
    }

    element.parentNode.addEventListener('touchstart', touchStart,    false);
    element.parentNode.addEventListener('touchmove',  touchMove,     false);
    element.parentNode.addEventListener('touchend',   touchEnd,      false);

    this.touchListeners = [touchStart, touchMove, touchEnd];
}

ABScroller.prototype.disable = function disable() 
{
    this.settings.element.parentNode.removeEventListener('touchstart', touchStart,    false);
    this.settings.element.parentNode.removeEventListener('touchmove',  touchMove,     false);
    this.settings.element.parentNode.removeEventListener('touchend',   touchEnd,      false);

    this.touchListeners     = [];
    this.settings.element   = null;
};

ABScroller.prototype.invertDirection = function invertDirection() 
{
	if (this.invert_direction === true) {
        this.invert_direction = false;
    }
    else {
        this.invert_direction = true;
    }
};

ABScroller.prototype.extend = function extend( defaults, options ) 
{
    var extended = {};
    var prop;

    for (prop in defaults) 
    {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }

    for (prop in options) 
    {
        if (Object.prototype.hasOwnProperty.call(options, prop)) 
        {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

module.exports = ABScroller;
