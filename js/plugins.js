/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function() {
  "use strict";
  function t(o) {
      if (!o)
          throw new Error("No options passed to Waypoint constructor");
      if (!o.element)
          throw new Error("No element option passed to Waypoint constructor");
      if (!o.handler)
          throw new Error("No handler option passed to Waypoint constructor");
      this.key = "waypoint-" + e,
      this.options = t.Adapter.extend({}, t.defaults, o),
      this.element = this.options.element,
      this.adapter = new t.Adapter(this.element),
      this.callback = o.handler,
      this.axis = this.options.horizontal ? "horizontal" : "vertical",
      this.enabled = this.options.enabled,
      this.triggerPoint = null,
      this.group = t.Group.findOrCreate({
          name: this.options.group,
          axis: this.axis
      }),
      this.context = t.Context.findOrCreateByElement(this.options.context),
      t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]),
      this.group.add(this),
      this.context.add(this),
      i[this.key] = this,
      e += 1
  }
  var e = 0
    , i = {};
  t.prototype.queueTrigger = function(t) {
      this.group.queueTrigger(this, t)
  }
  ,
  t.prototype.trigger = function(t) {
      this.enabled && this.callback && this.callback.apply(this, t)
  }
  ,
  t.prototype.destroy = function() {
      this.context.remove(this),
      this.group.remove(this),
      delete i[this.key]
  }
  ,
  t.prototype.disable = function() {
      return this.enabled = !1,
      this
  }
  ,
  t.prototype.enable = function() {
      return this.context.refresh(),
      this.enabled = !0,
      this
  }
  ,
  t.prototype.next = function() {
      return this.group.next(this)
  }
  ,
  t.prototype.previous = function() {
      return this.group.previous(this)
  }
  ,
  t.invokeAll = function(t) {
      var e = [];
      for (var o in i)
          e.push(i[o]);
      for (var n = 0, r = e.length; r > n; n++)
          e[n][t]()
  }
  ,
  t.destroyAll = function() {
      t.invokeAll("destroy")
  }
  ,
  t.disableAll = function() {
      t.invokeAll("disable")
  }
  ,
  t.enableAll = function() {
      t.invokeAll("enable")
  }
  ,
  t.refreshAll = function() {
      t.Context.refreshAll()
  }
  ,
  t.viewportHeight = function() {
      return window.innerHeight || document.documentElement.clientHeight
  }
  ,
  t.viewportWidth = function() {
      return document.documentElement.clientWidth
  }
  ,
  t.adapters = [],
  t.defaults = {
      context: window,
      continuous: !0,
      enabled: !0,
      group: "default",
      horizontal: !1,
      offset: 0
  },
  t.offsetAliases = {
      "bottom-in-view": function() {
          return this.context.innerHeight() - this.adapter.outerHeight()
      },
      "right-in-view": function() {
          return this.context.innerWidth() - this.adapter.outerWidth()
      }
  },
  window.Waypoint = t
}(),
function() {
  "use strict";
  function t(t) {
      window.setTimeout(t, 1e3 / 60)
  }
  function e(t) {
      this.element = t,
      this.Adapter = n.Adapter,
      this.adapter = new this.Adapter(t),
      this.key = "waypoint-context-" + i,
      this.didScroll = !1,
      this.didResize = !1,
      this.oldScroll = {
          x: this.adapter.scrollLeft(),
          y: this.adapter.scrollTop()
      },
      this.waypoints = {
          vertical: {},
          horizontal: {}
      },
      t.waypointContextKey = this.key,
      o[t.waypointContextKey] = this,
      i += 1,
      this.createThrottledScrollHandler(),
      this.createThrottledResizeHandler()
  }
  var i = 0
    , o = {}
    , n = window.Waypoint
    , r = window.onload;
  e.prototype.add = function(t) {
      var e = t.options.horizontal ? "horizontal" : "vertical";
      this.waypoints[e][t.key] = t,
      this.refresh()
  }
  ,
  e.prototype.checkEmpty = function() {
      var t = this.Adapter.isEmptyObject(this.waypoints.horizontal)
        , e = this.Adapter.isEmptyObject(this.waypoints.vertical);
      t && e && (this.adapter.off(".waypoints"),
      delete o[this.key])
  }
  ,
  e.prototype.createThrottledResizeHandler = function() {
      function t() {
          e.handleResize(),
          e.didResize = !1
      }
      var e = this;
      this.adapter.on("resize.waypoints", function() {
          e.didResize || (e.didResize = !0,
          n.requestAnimationFrame(t))
      })
  }
  ,
  e.prototype.createThrottledScrollHandler = function() {
      function t() {
          e.handleScroll(),
          e.didScroll = !1
      }
      var e = this;
      this.adapter.on("scroll.waypoints", function() {
          (!e.didScroll || n.isTouch) && (e.didScroll = !0,
          n.requestAnimationFrame(t))
      })
  }
  ,
  e.prototype.handleResize = function() {
      n.Context.refreshAll()
  }
  ,
  e.prototype.handleScroll = function() {
      var t = {}
        , e = {
          horizontal: {
              newScroll: this.adapter.scrollLeft(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left"
          },
          vertical: {
              newScroll: this.adapter.scrollTop(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up"
          }
      };
      for (var i in e) {
          var o = e[i]
            , n = o.newScroll > o.oldScroll
            , r = n ? o.forward : o.backward;
          for (var s in this.waypoints[i]) {
              var a = this.waypoints[i][s]
                , l = o.oldScroll < a.triggerPoint
                , h = o.newScroll >= a.triggerPoint
                , p = l && h
                , u = !l && !h;
              (p || u) && (a.queueTrigger(r),
              t[a.group.id] = a.group)
          }
      }
      for (var c in t)
          t[c].flushTriggers();
      this.oldScroll = {
          x: e.horizontal.newScroll,
          y: e.vertical.newScroll
      }
  }
  ,
  e.prototype.innerHeight = function() {
      return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
  }
  ,
  e.prototype.remove = function(t) {
      delete this.waypoints[t.axis][t.key],
      this.checkEmpty()
  }
  ,
  e.prototype.innerWidth = function() {
      return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
  }
  ,
  e.prototype.destroy = function() {
      var t = [];
      for (var e in this.waypoints)
          for (var i in this.waypoints[e])
              t.push(this.waypoints[e][i]);
      for (var o = 0, n = t.length; n > o; o++)
          t[o].destroy()
  }
  ,
  e.prototype.refresh = function() {
      var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), o = {};
      this.handleScroll(),
      t = {
          horizontal: {
              contextOffset: e ? 0 : i.left,
              contextScroll: e ? 0 : this.oldScroll.x,
              contextDimension: this.innerWidth(),
              oldScroll: this.oldScroll.x,
              forward: "right",
              backward: "left",
              offsetProp: "left"
          },
          vertical: {
              contextOffset: e ? 0 : i.top,
              contextScroll: e ? 0 : this.oldScroll.y,
              contextDimension: this.innerHeight(),
              oldScroll: this.oldScroll.y,
              forward: "down",
              backward: "up",
              offsetProp: "top"
          }
      };
      for (var r in t) {
          var s = t[r];
          for (var a in this.waypoints[r]) {
              var l, h, p, u, c, d = this.waypoints[r][a], f = d.options.offset, w = d.triggerPoint, y = 0, g = null == w;
              d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]),
              "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f),
              d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))),
              l = s.contextScroll - s.contextOffset,
              d.triggerPoint = y + l - f,
              h = w < s.oldScroll,
              p = d.triggerPoint >= s.oldScroll,
              u = h && p,
              c = !h && !p,
              !g && u ? (d.queueTrigger(s.backward),
              o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward),
              o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward),
              o[d.group.id] = d.group)
          }
      }
      return n.requestAnimationFrame(function() {
          for (var t in o)
              o[t].flushTriggers()
      }),
      this
  }
  ,
  e.findOrCreateByElement = function(t) {
      return e.findByElement(t) || new e(t)
  }
  ,
  e.refreshAll = function() {
      for (var t in o)
          o[t].refresh()
  }
  ,
  e.findByElement = function(t) {
      return o[t.waypointContextKey]
  }
  ,
  window.onload = function() {
      r && r(),
      e.refreshAll()
  }
  ,
  n.requestAnimationFrame = function(e) {
      var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
      i.call(window, e)
  }
  ,
  n.Context = e
}(),
function() {
  "use strict";
  function t(t, e) {
      return t.triggerPoint - e.triggerPoint
  }
  function e(t, e) {
      return e.triggerPoint - t.triggerPoint
  }
  function i(t) {
      this.name = t.name,
      this.axis = t.axis,
      this.id = this.name + "-" + this.axis,
      this.waypoints = [],
      this.clearTriggerQueues(),
      o[this.axis][this.name] = this
  }
  var o = {
      vertical: {},
      horizontal: {}
  }
    , n = window.Waypoint;
  i.prototype.add = function(t) {
      this.waypoints.push(t)
  }
  ,
  i.prototype.clearTriggerQueues = function() {
      this.triggerQueues = {
          up: [],
          down: [],
          left: [],
          right: []
      }
  }
  ,
  i.prototype.flushTriggers = function() {
      for (var i in this.triggerQueues) {
          var o = this.triggerQueues[i]
            , n = "up" === i || "left" === i;
          o.sort(n ? e : t);
          for (var r = 0, s = o.length; s > r; r += 1) {
              var a = o[r];
              (a.options.continuous || r === o.length - 1) && a.trigger([i])
          }
      }
      this.clearTriggerQueues()
  }
  ,
  i.prototype.next = function(e) {
      this.waypoints.sort(t);
      var i = n.Adapter.inArray(e, this.waypoints)
        , o = i === this.waypoints.length - 1;
      return o ? null : this.waypoints[i + 1]
  }
  ,
  i.prototype.previous = function(e) {
      this.waypoints.sort(t);
      var i = n.Adapter.inArray(e, this.waypoints);
      return i ? this.waypoints[i - 1] : null
  }
  ,
  i.prototype.queueTrigger = function(t, e) {
      this.triggerQueues[e].push(t)
  }
  ,
  i.prototype.remove = function(t) {
      var e = n.Adapter.inArray(t, this.waypoints);
      e > -1 && this.waypoints.splice(e, 1)
  }
  ,
  i.prototype.first = function() {
      return this.waypoints[0]
  }
  ,
  i.prototype.last = function() {
      return this.waypoints[this.waypoints.length - 1]
  }
  ,
  i.findOrCreate = function(t) {
      return o[t.axis][t.name] || new i(t)
  }
  ,
  n.Group = i
}(),
function() {
  "use strict";
  function t(t) {
      this.$element = e(t)
  }
  var e = window.jQuery
    , i = window.Waypoint;
  e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(e, i) {
      t.prototype[i] = function() {
          var t = Array.prototype.slice.call(arguments);
          return this.$element[i].apply(this.$element, t)
      }
  }),
  e.each(["extend", "inArray", "isEmptyObject"], function(i, o) {
      t[o] = e[o]
  }),
  i.adapters.push({
      name: "jquery",
      Adapter: t
  }),
  i.Adapter = t
}(),
function() {
  "use strict";
  function t(t) {
      return function() {
          var i = []
            , o = arguments[0];
          return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]),
          o.handler = arguments[0]),
          this.each(function() {
              var n = t.extend({}, o, {
                  element: this
              });
              "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]),
              i.push(new e(n))
          }),
          i
      }
  }
  var e = window.Waypoint;
  window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
  window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();

/*!
 * parallax.js v1.5.0 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2016 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
;(function ( $, window, document, undefined ) {
  // Polyfill for requestAnimationFrame
  // via: https://gist.github.com/paulirish/1579671
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());
  // Parallax Constructor
  function Parallax(element, options) {
    var self = this;
    if (typeof options == 'object') {
      delete options.refresh;
      delete options.render;
      $.extend(this, options);
    }
    this.$element = $(element);
    if (!this.imageSrc && this.$element.is('img')) {
      this.imageSrc = this.$element.attr('src');
    }
    var positions = (this.position + '').toLowerCase().match(/\S+/g) || [];
    if (positions.length < 1) {
      positions.push('center');
    }
    if (positions.length == 1) {
      positions.push(positions[0]);
    }
    if (positions[0] == 'top' || positions[0] == 'bottom' || positions[1] == 'left' || positions[1] == 'right') {
      positions = [positions[1], positions[0]];
    }
    if (this.positionX !== undefined) positions[0] = this.positionX.toLowerCase();
    if (this.positionY !== undefined) positions[1] = this.positionY.toLowerCase();
    self.positionX = positions[0];
    self.positionY = positions[1];
    if (this.positionX != 'left' && this.positionX != 'right') {
      if (isNaN(parseInt(this.positionX))) {
        this.positionX = 'center';
      } else {
        this.positionX = parseInt(this.positionX);
      }
    }
    if (this.positionY != 'top' && this.positionY != 'bottom') {
      if (isNaN(parseInt(this.positionY))) {
        this.positionY = 'center';
      } else {
        this.positionY = parseInt(this.positionY);
      }
    }
    this.position =
      this.positionX + (isNaN(this.positionX)? '' : 'px') + ' ' +
      this.positionY + (isNaN(this.positionY)? '' : 'px');
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
      if (this.imageSrc && this.iosFix && !this.$element.is('img')) {
        this.$element.css({
          backgroundImage: 'url(' + this.imageSrc + ')',
          backgroundSize: 'cover',
          backgroundPosition: this.position
        });
      }
      return this;
    }
    if (navigator.userAgent.match(/(Android)/)) {
      if (this.imageSrc && this.androidFix && !this.$element.is('img')) {
        this.$element.css({
          backgroundImage: 'url(' + this.imageSrc + ')',
          backgroundSize: 'cover',
          backgroundPosition: this.position
        });
      }
      return this;
    }
    this.$mirror = $('<div />').prependTo(this.mirrorContainer);
    var slider = this.$element.find('>.parallax-slider');
    var sliderExisted = false;
    if (slider.length == 0)
      this.$slider = $('<img />').prependTo(this.$mirror);
    else {
      this.$slider = slider.prependTo(this.$mirror)
      sliderExisted = true;
    }
    this.$mirror.addClass('parallax-mirror').css({
      visibility: 'hidden',
      zIndex: this.zIndex,
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    });
    this.$slider.addClass('parallax-slider').one('load', function() {
      if (!self.naturalHeight || !self.naturalWidth) {
        self.naturalHeight = this.naturalHeight || this.height || 1;
        self.naturalWidth  = this.naturalWidth  || this.width  || 1;
      }
      self.aspectRatio = self.naturalWidth / self.naturalHeight;
      Parallax.isSetup || Parallax.setup();
      Parallax.sliders.push(self);
      Parallax.isFresh = false;
      Parallax.requestRender();
    });
    if (!sliderExisted)
      this.$slider[0].src = this.imageSrc;
    if (this.naturalHeight && this.naturalWidth || this.$slider[0].complete || slider.length > 0) {
      this.$slider.trigger('load');
    }
  }
  // Parallax Instance Methods
  $.extend(Parallax.prototype, {
    speed:    0.2,
    bleed:    0,
    zIndex:   -100,
    iosFix:   true,
    androidFix: true,
    position: 'center',
    overScrollFix: false,
    mirrorContainer: 'body',
    refresh: function() {
      this.boxWidth        = this.$element.outerWidth();
      this.boxHeight       = this.$element.outerHeight() + this.bleed * 2;
      this.boxOffsetTop    = this.$element.offset().top - this.bleed;
      this.boxOffsetLeft   = this.$element.offset().left;
      this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;
      var winHeight = Parallax.winHeight;
      var docHeight = Parallax.docHeight;
      var maxOffset = Math.min(this.boxOffsetTop, docHeight - winHeight);
      var minOffset = Math.max(this.boxOffsetTop + this.boxHeight - winHeight, 0);
      var imageHeightMin = this.boxHeight + (maxOffset - minOffset) * (1 - this.speed) | 0;
      var imageOffsetMin = (this.boxOffsetTop - maxOffset) * (1 - this.speed) | 0;
      var margin;
      if (imageHeightMin * this.aspectRatio >= this.boxWidth) {
        this.imageWidth    = imageHeightMin * this.aspectRatio | 0;
        this.imageHeight   = imageHeightMin;
        this.offsetBaseTop = imageOffsetMin;
        margin = this.imageWidth - this.boxWidth;
        if (this.positionX == 'left') {
          this.offsetLeft = 0;
        } else if (this.positionX == 'right') {
          this.offsetLeft = - margin;
        } else if (!isNaN(this.positionX)) {
          this.offsetLeft = Math.max(this.positionX, - margin);
        } else {
          this.offsetLeft = - margin / 2 | 0;
        }
      } else {
        this.imageWidth    = this.boxWidth;
        this.imageHeight   = this.boxWidth / this.aspectRatio | 0;
        this.offsetLeft    = 0;
        margin = this.imageHeight - imageHeightMin;
        if (this.positionY == 'top') {
          this.offsetBaseTop = imageOffsetMin;
        } else if (this.positionY == 'bottom') {
          this.offsetBaseTop = imageOffsetMin - margin;
        } else if (!isNaN(this.positionY)) {
          this.offsetBaseTop = imageOffsetMin + Math.max(this.positionY, - margin);
        } else {
          this.offsetBaseTop = imageOffsetMin - margin / 2 | 0;
        }
      }
    },
    render: function() {
      var scrollTop    = Parallax.scrollTop;
      var scrollLeft   = Parallax.scrollLeft;
      var overScroll   = this.overScrollFix ? Parallax.overScroll : 0;
      var scrollBottom = scrollTop + Parallax.winHeight;
      if (this.boxOffsetBottom > scrollTop && this.boxOffsetTop <= scrollBottom) {
        this.visibility = 'visible';
        this.mirrorTop = this.boxOffsetTop  - scrollTop;
        this.mirrorLeft = this.boxOffsetLeft - scrollLeft;
        this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed);
      } else {
        this.visibility = 'hidden';
      }
      this.$mirror.css({
        transform: 'translate3d('+this.mirrorLeft+'px, '+(this.mirrorTop - overScroll)+'px, 0px)',
        visibility: this.visibility,
        height: this.boxHeight,
        width: this.boxWidth
      });
      this.$slider.css({
        transform: 'translate3d('+this.offsetLeft+'px, '+this.offsetTop+'px, 0px)',
        position: 'absolute',
        height: this.imageHeight,
        width: this.imageWidth,
        maxWidth: 'none'
      });
    }
  });
  // Parallax Static Methods
  $.extend(Parallax, {
    scrollTop:    0,
    scrollLeft:   0,
    winHeight:    0,
    winWidth:     0,
    docHeight:    1 << 30,
    docWidth:     1 << 30,
    sliders:      [],
    isReady:      false,
    isFresh:      false,
    isBusy:       false,
    setup: function() {
      if (this.isReady) return;
      var self = this;
      var $doc = $(document), $win = $(window);
      var loadDimensions = function() {
        Parallax.winHeight = $win.height();
        Parallax.winWidth  = $win.width();
        Parallax.docHeight = $doc.height();
        Parallax.docWidth  = $doc.width();
      };
      var loadScrollPosition = function() {
        var winScrollTop  = $win.scrollTop();
        var scrollTopMax  = Parallax.docHeight - Parallax.winHeight;
        var scrollLeftMax = Parallax.docWidth  - Parallax.winWidth;
        Parallax.scrollTop  = Math.max(0, Math.min(scrollTopMax,  winScrollTop));
        Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, $win.scrollLeft()));
        Parallax.overScroll = Math.max(winScrollTop - scrollTopMax, Math.min(winScrollTop, 0));
      };
      $win.on('resize.px.parallax load.px.parallax', function() {
          loadDimensions();
          self.refresh();
          Parallax.isFresh = false;
          Parallax.requestRender();
        })
        .on('scroll.px.parallax load.px.parallax', function() {
          loadScrollPosition();
          Parallax.requestRender();
        });
      loadDimensions();
      loadScrollPosition();
      this.isReady = true;
      var lastPosition = -1;
      function frameLoop() {
        if (lastPosition == window.pageYOffset) {   // Avoid overcalculations
          window.requestAnimationFrame(frameLoop);
          return false;
        } else lastPosition = window.pageYOffset;
        self.render();
        window.requestAnimationFrame(frameLoop);
      }
      frameLoop();
    },
    configure: function(options) {
      if (typeof options == 'object') {
        delete options.refresh;
        delete options.render;
        $.extend(this.prototype, options);
      }
    },
    refresh: function() {
      $.each(this.sliders, function(){ this.refresh(); });
      this.isFresh = true;
    },
    render: function() {
      this.isFresh || this.refresh();
      $.each(this.sliders, function(){ this.render(); });
    },
    requestRender: function() {
      var self = this;
      self.render();
      self.isBusy = false;
    },
    destroy: function(el){
      var i,
          parallaxElement = $(el).data('px.parallax');
      parallaxElement.$mirror.remove();
      for(i=0; i < this.sliders.length; i+=1){
        if(this.sliders[i] == parallaxElement){
          this.sliders.splice(i, 1);
        }
      }
      $(el).data('px.parallax', false);
      if(this.sliders.length === 0){
        $(window).off('scroll.px.parallax resize.px.parallax load.px.parallax');
        this.isReady = false;
        Parallax.isSetup = false;
      }
    }
  });
  // Parallax Plugin Definition
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var options = typeof option == 'object' && option;
      if (this == window || this == document || $this.is('body')) {
        Parallax.configure(options);
      }
      else if (!$this.data('px.parallax')) {
        options = $.extend({}, $this.data(), options);
        $this.data('px.parallax', new Parallax(this, options));
      }
      else if (typeof option == 'object')
      {
        $.extend($this.data('px.parallax'), options);
      }
      if (typeof option == 'string') {
        if(option == 'destroy'){
            Parallax.destroy(this);
        }else{
          Parallax[option]();
        }
      }
    });
  }
  var old = $.fn.parallax;
  $.fn.parallax             = Plugin;
  $.fn.parallax.Constructor = Parallax;
  // Parallax No Conflict
  $.fn.parallax.noConflict = function () {
    $.fn.parallax = old;
    return this;
  };
  // Parallax Data-API
  $( function () { 
    $('[data-parallax="scroll"]').parallax(); 
  });
}(jQuery, window, document));

/*
* AOS.js
* https://michalsnik.github.io/aos/
*/
!function(e, t) {
  "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AOS = t() : e.AOS = t()
}(this, function() {
  return function(e) {
      function t(n) {
          if (o[n])
              return o[n].exports;
          var i = o[n] = {
              exports: {},
              id: n,
              loaded: !1
          };
          return e[n].call(i.exports, i, i.exports, t),
          i.loaded = !0,
          i.exports
      }
      var o = {};
      return t.m = e,
      t.c = o,
      t.p = "dist/",
      t(0)
  }([function(e, t, o) {
      "use strict";
      function n(e) {
          return e && e.__esModule ? e : {
              "default": e
          }
      }
      var i = Object.assign || function(e) {
          for (var t = 1; t < arguments.length; t++) {
              var o = arguments[t];
              for (var n in o)
                  Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n])
          }
          return e
      }
        , a = o(1)
        , r = (n(a),
      o(5))
        , c = n(r)
        , u = o(6)
        , s = n(u)
        , d = o(7)
        , f = n(d)
        , l = o(8)
        , m = n(l)
        , p = o(9)
        , b = n(p)
        , v = o(10)
        , g = n(v)
        , y = o(13)
        , w = n(y)
        , h = []
        , k = !1
        , x = document.all && !window.atob
        , j = {
          offset: 120,
          delay: 0,
          easing: "ease",
          duration: 400,
          disable: !1,
          once: !1,
          startEvent: "DOMContentLoaded"
      }
        , O = function() {
          var e = arguments.length <= 0 || void 0 === arguments[0] ? !1 : arguments[0];
          return e && (k = !0),
          k ? (h = (0,
          g["default"])(h, j),
          (0,
          b["default"])(h, j.once),
          h) : void 0
      }
        , _ = function() {
          h = (0,
          w["default"])(),
          O()
      }
        , z = function() {
          h.forEach(function(e, t) {
              e.node.removeAttribute("data-aos"),
              e.node.removeAttribute("data-aos-easing"),
              e.node.removeAttribute("data-aos-duration"),
              e.node.removeAttribute("data-aos-delay")
          })
      }
        , A = function(e) {
          return e === !0 || "mobile" === e && m["default"].mobile() || "phone" === e && m["default"].phone() || "tablet" === e && m["default"].tablet() || "function" == typeof e && e() === !0
      }
        , E = function(e) {
          return j = i(j, e),
          h = (0,
          w["default"])(),
          A(j.disable) || x ? z() : (document.querySelector("body").setAttribute("data-aos-easing", j.easing),
          document.querySelector("body").setAttribute("data-aos-duration", j.duration),
          document.querySelector("body").setAttribute("data-aos-delay", j.delay),
          "DOMContentLoaded" === j.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? O(!0) : "load" === j.startEvent ? window.addEventListener(j.startEvent, function() {
              O(!0)
          }) : document.addEventListener(j.startEvent, function() {
              O(!0)
          }),
          window.addEventListener("resize", (0,
          s["default"])(O, 50, !0)),
          window.addEventListener("orientationchange", (0,
          s["default"])(O, 50, !0)),
          window.addEventListener("scroll", (0,
          c["default"])(function() {
              (0,
              b["default"])(h, j.once)
          }, 99)),
          document.addEventListener("DOMNodeRemoved", function(e) {
              var t = e.target;
              t && 1 === t.nodeType && t.hasAttribute && t.hasAttribute("data-aos") && (0,
              s["default"])(_, 50, !0)
          }),
          (0,
          f["default"])("[data-aos]", _),
          h)
      };
      e.exports = {
          init: E,
          refresh: O,
          refreshHard: _
      }
  }
  , function(e, t) {}
  , , , , function(e, t, o) {
      "use strict";
      function n(e, t, o) {
          var n = !0
            , a = !0;
          if ("function" != typeof e)
              throw new TypeError(c);
          return i(o) && (n = "leading"in o ? !!o.leading : n,
          a = "trailing"in o ? !!o.trailing : a),
          r(e, t, {
              leading: n,
              maxWait: t,
              trailing: a
          })
      }
      function i(e) {
          var t = "undefined" == typeof e ? "undefined" : a(e);
          return !!e && ("object" == t || "function" == t)
      }
      var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
          return typeof e
      }
      : function(e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
      }
        , r = o(6)
        , c = "Expected a function";
      e.exports = n
  }
  , function(e, t) {
      "use strict";
      function o(e, t, o) {
          function n(t) {
              var o = b
                , n = v;
              return b = v = void 0,
              O = t,
              y = e.apply(n, o)
          }
          function a(e) {
              return O = e,
              w = setTimeout(d, t),
              _ ? n(e) : y
          }
          function r(e) {
              var o = e - h
                , n = e - O
                , i = t - o;
              return z ? x(i, g - n) : i
          }
          function u(e) {
              var o = e - h
                , n = e - O;
              return !h || o >= t || 0 > o || z && n >= g
          }
          function d() {
              var e = j();
              return u(e) ? f(e) : void (w = setTimeout(d, r(e)))
          }
          function f(e) {
              return clearTimeout(w),
              w = void 0,
              A && b ? n(e) : (b = v = void 0,
              y)
          }
          function l() {
              void 0 !== w && clearTimeout(w),
              h = O = 0,
              b = v = w = void 0
          }
          function m() {
              return void 0 === w ? y : f(j())
          }
          function p() {
              var e = j()
                , o = u(e);
              if (b = arguments,
              v = this,
              h = e,
              o) {
                  if (void 0 === w)
                      return a(h);
                  if (z)
                      return clearTimeout(w),
                      w = setTimeout(d, t),
                      n(h)
              }
              return void 0 === w && (w = setTimeout(d, t)),
              y
          }
          var b, v, g, y, w, h = 0, O = 0, _ = !1, z = !1, A = !0;
          if ("function" != typeof e)
              throw new TypeError(s);
          return t = c(t) || 0,
          i(o) && (_ = !!o.leading,
          z = "maxWait"in o,
          g = z ? k(c(o.maxWait) || 0, t) : g,
          A = "trailing"in o ? !!o.trailing : A),
          p.cancel = l,
          p.flush = m,
          p
      }
      function n(e) {
          var t = i(e) ? h.call(e) : "";
          return t == f || t == l
      }
      function i(e) {
          var t = "undefined" == typeof e ? "undefined" : u(e);
          return !!e && ("object" == t || "function" == t)
      }
      function a(e) {
          return !!e && "object" == ("undefined" == typeof e ? "undefined" : u(e))
      }
      function r(e) {
          return "symbol" == ("undefined" == typeof e ? "undefined" : u(e)) || a(e) && h.call(e) == m
      }
      function c(e) {
          if ("number" == typeof e)
              return e;
          if (r(e))
              return d;
          if (i(e)) {
              var t = n(e.valueOf) ? e.valueOf() : e;
              e = i(t) ? t + "" : t
          }
          if ("string" != typeof e)
              return 0 === e ? e : +e;
          e = e.replace(p, "");
          var o = v.test(e);
          return o || g.test(e) ? y(e.slice(2), o ? 2 : 8) : b.test(e) ? d : +e
      }
      var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
          return typeof e
      }
      : function(e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
      }
        , s = "Expected a function"
        , d = NaN
        , f = "[object Function]"
        , l = "[object GeneratorFunction]"
        , m = "[object Symbol]"
        , p = /^\s+|\s+$/g
        , b = /^[-+]0x[0-9a-f]+$/i
        , v = /^0b[01]+$/i
        , g = /^0o[0-7]+$/i
        , y = parseInt
        , w = Object.prototype
        , h = w.toString
        , k = Math.max
        , x = Math.min
        , j = Date.now;
      e.exports = o
  }
  , function(e, t) {
      "use strict";
      function o(e, t) {
          r.push({
              selector: e,
              fn: t
          }),
          !c && a && (c = new a(n),
          c.observe(i.documentElement, {
              childList: !0,
              subtree: !0,
              removedNodes: !0
          })),
          n()
      }
      function n() {
          for (var e, t, o = 0, n = r.length; n > o; o++) {
              e = r[o],
              t = i.querySelectorAll(e.selector);
              for (var a, c = 0, u = t.length; u > c; c++)
                  a = t[c],
                  a.ready || (a.ready = !0,
                  e.fn.call(a, a))
          }
      }
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var i = window.document
        , a = window.MutationObserver || window.WebKitMutationObserver
        , r = []
        , c = void 0;
      t["default"] = o
  }
  , function(e, t) {
      "use strict";
      function o(e, t) {
          if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function")
      }
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var n = function() {
          function e(e, t) {
              for (var o = 0; o < t.length; o++) {
                  var n = t[o];
                  n.enumerable = n.enumerable || !1,
                  n.configurable = !0,
                  "value"in n && (n.writable = !0),
                  Object.defineProperty(e, n.key, n)
              }
          }
          return function(t, o, n) {
              return o && e(t.prototype, o),
              n && e(t, n),
              t
          }
      }()
        , i = function() {
          function e() {
              o(this, e)
          }
          return n(e, [{
              key: "phone",
              value: function() {
                  var e = !1;
                  return function(t) {
                      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
                  }(navigator.userAgent || navigator.vendor || window.opera),
                  e
              }
          }, {
              key: "mobile",
              value: function() {
                  var e = !1;
                  return function(t) {
                      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
                  }(navigator.userAgent || navigator.vendor || window.opera),
                  e
              }
          }, {
              key: "tablet",
              value: function() {
                  return this.mobile() && !this.phone()
              }
          }]),
          e
      }();
      t["default"] = new i
  }
  , function(e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var o = function(e, t, o) {
          var n = e.node.getAttribute("data-aos-once");
          t > e.position ? e.node.classList.add("aos-animate") : "undefined" != typeof n && ("false" === n || !o && "true" !== n) && e.node.classList.remove("aos-animate")
      }
        , n = function(e, t) {
          var n = window.pageYOffset
            , i = window.innerHeight;
          e.forEach(function(e, a) {
              o(e, i + n, t)
          })
      };
      t["default"] = n
  }
  , function(e, t, o) {
      "use strict";
      function n(e) {
          return e && e.__esModule ? e : {
              "default": e
          }
      }
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var i = o(11)
        , a = n(i)
        , r = function(e, t) {
          return e.forEach(function(e, o) {
              e.node.classList.add("aos-init"),
              e.position = (0,
              a["default"])(e.node, t.offset)
          }),
          e
      };
      t["default"] = r
  }
  , function(e, t, o) {
      "use strict";
      function n(e) {
          return e && e.__esModule ? e : {
              "default": e
          }
      }
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var i = o(12)
        , a = n(i)
        , r = function(e, t) {
          var o = 0
            , n = 0
            , i = window.innerHeight
            , r = {
              offset: e.getAttribute("data-aos-offset"),
              anchor: e.getAttribute("data-aos-anchor"),
              anchorPlacement: e.getAttribute("data-aos-anchor-placement")
          };
          switch (r.offset && !isNaN(r.offset) && (n = parseInt(r.offset)),
          r.anchor && document.querySelectorAll(r.anchor) && (e = document.querySelectorAll(r.anchor)[0]),
          o = (0,
          a["default"])(e).top,
          r.anchorPlacement) {
          case "top-bottom":
              break;
          case "center-bottom":
              o += e.offsetHeight / 2;
              break;
          case "bottom-bottom":
              o += e.offsetHeight;
              break;
          case "top-center":
              o += i / 2;
              break;
          case "bottom-center":
              o += i / 2 + e.offsetHeight;
              break;
          case "center-center":
              o += i / 2 + e.offsetHeight / 2;
              break;
          case "top-top":
              o += i;
              break;
          case "bottom-top":
              o += e.offsetHeight + i;
              break;
          case "center-top":
              o += e.offsetHeight / 2 + i
          }
          return r.anchorPlacement || r.offset || isNaN(t) || (n = t),
          o + n
      };
      t["default"] = r
  }
  , function(e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var o = function(e) {
          for (var t = 0, o = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop); )
              t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0),
              o += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0),
              e = e.offsetParent;
          return {
              top: o,
              left: t
          }
      };
      t["default"] = o
  }
  , function(e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", {
          value: !0
      });
      var o = function(e) {
          e = e || document.querySelectorAll("[data-aos]");
          var t = [];
          return [].forEach.call(e, function(e, o) {
              t.push({
                  node: e
              })
          }),
          t
      };
      t["default"] = o
  }
  ])
});
