;(function() {
/**
 * The base Class implementation.
 * @module _utils/class
 * @date 2014-04-10 15:37:25
 * @version $Id: class.js$
 * @example
 *  var Pig = Class.create({
 *      initialize: function(name) {
 *          this.name = name;
 *      },
 *      talk: function() {
 *          alert('我是' + this.name);
 *      }
 *  });
 *  var RedPig = Pig.extend({
 *      initialize: function(name) {
 *          RedPig.superclass.initialize.call(this, name);
 *      },
 *      color: '红色'
 *  });
 *  
 */
var base_class, tpl_ggmod, mods_ggmod_poptips;
base_class = function () {
  // The base Class implementation.
  var Class = function (o) {
    // Convert existed function to Class.
    if (!(this instanceof Class) && isFunction(o)) {
      return classify(o);
    }
  };
  /**
   * {@link https://github.com/aralejs/class class} 
   */
  var toString = Object.prototype.toString;
  var isArray = Array.isArray || function (val) {
    return toString.call(val) === '[object Array]';
  };
  var isFunction = function (val) {
    return toString.call(val) === '[object Function]';
  };
  var indexOf = Array.prototype.indexOf ? function (arr, item) {
    return arr.indexOf(item);
  } : function (arr, item) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === item) {
        return i;
      }
    }
    return -1;
  };
  Class.create = function (parent, properties) {
    if (!isFunction(parent)) {
      properties = parent;
      parent = null;
    }
    properties || (properties = {});
    parent || (parent = properties.Extends || Class);
    properties.Extends = parent;
    // The created class constructor
    function SubClass() {
      // Call the parent constructor.
      parent.apply(this, arguments);
      // Only call initialize in self constructor.
      if (this.constructor === SubClass && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }
    // Inherit class (static) properties from parent.
    if (parent !== Class) {
      mix(SubClass, parent, parent.StaticsWhiteList);
    }
    // Add instance properties to the subclass.
    implement.call(SubClass, properties);
    // Make subclass extendable.
    return classify(SubClass);
  };
  function implement(properties) {
    var key, value;
    for (key in properties) {
      value = properties[key];
      if (Class.Mutators.hasOwnProperty(key)) {
        Class.Mutators[key].call(this, value);
      } else {
        this.prototype[key] = value;
      }
    }
  }
  // Create a sub Class based on `Class`.
  Class.extend = function (properties) {
    properties || (properties = {});
    properties.Extends = this;
    return Class.create(properties);
  };
  function classify(cls) {
    cls.extend = Class.extend;
    cls.implement = implement;
    return cls;
  }
  // Mutators define special properties.
  Class.Mutators = {
    Extends: function (parent) {
      var existed = this.prototype;
      var proto = createProto(parent.prototype);
      // Keep existed properties.
      mix(proto, existed);
      // Enforce the constructor to be what we expect.
      proto.constructor = this;
      // Set the prototype chain to inherit from `parent`.
      this.prototype = proto;
      // Set a convenience property in case the parent's prototype is
      // needed later.
      this.superclass = parent.prototype;
    },
    Implements: function (items) {
      isArray(items) || (items = [items]);
      var proto = this.prototype, item;
      while (item = items.shift()) {
        mix(proto, item.prototype || item);
      }
    },
    Statics: function (staticProperties) {
      mix(this, staticProperties);
    }
  };
  // Shared empty constructor function to aid in prototype-chain creation.
  function Ctor() {
  }
  // See: http://jsperf.com/object-create-vs-new-ctor
  var createProto = Object.__proto__ ? function (proto) {
    return { __proto__: proto };
  } : function (proto) {
    Ctor.prototype = proto;
    return new Ctor();
  };
  // Helpers
  // ------------
  function mix(r, s, wl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        if (wl && indexOf(wl, p) === -1)
          continue;
        // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
        if (p !== 'prototype') {
          r[p] = s[p];
        }
      }
    }
  }
  return Class;
}();
tpl_ggmod = { '_poptips': '<script id="tpl_ggmod_poptips" type="smcore"><div class="envelopeBubble png" style="right: 200px; display: block;"><div class="ebClose"></div><div class="ebtime"><i><span>23</span><strong>\u65F6</strong></i><i><span>25</span><strong>\u5206</strong></i><i style="margin-right:0"><span>59</span><strong>\u79D2</strong></i></div><div class="ebbmont"><a href="http://www.jumei.com/i/membership/show_promocards"><span>\u67E5\u770B\u60A8\u7684</span><span class="price_l">165</span><span>\u5143\u73B0\u91D1\u5238</span></a></div></div></script>' };
mods_ggmod_poptips = function (Class, Tpl) {
  return Class.create({
    initialize: function () {
      var $body;
      $body = $('body');
      this.tpl_poptips = $(Tpl._poptips);
      return this.tpl_poptips.appendTo($body);
    }
  });
}(base_class, tpl_ggmod);
}());