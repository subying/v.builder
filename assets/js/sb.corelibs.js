var STATIC_PATH='http://static.local/_src',VARS=window['VARS']={},_VM_=window['_VM_']={};
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
var jquery, smcore, cookie;
(function (window, undefined) {
  var
    // A central reference to the root jQuery(document)
    rootjQuery,
    // The deferred used on DOM ready
    readyList,
    // Use the correct document accordingly with window argument (sandbox)
    document = window.document, location = window.location, navigator = window.navigator,
    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,
    // Map over the $ in case of overwrite
    _$ = window.$,
    // Save a reference to some core methods
    core_push = Array.prototype.push, core_slice = Array.prototype.slice, core_indexOf = Array.prototype.indexOf, core_toString = Object.prototype.toString, core_hasOwn = Object.prototype.hasOwnProperty, core_trim = String.prototype.trim,
    // Define a local copy of jQuery
    jQuery = function (selector, context) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init(selector, context, rootjQuery);
    },
    // Used for matching numbers
    core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
    // Used for detecting and trimming whitespace
    core_rnotwhite = /\S/, core_rspace = /\s+/,
    // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
    // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
    // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi,
    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function (all, letter) {
      return (letter + '').toUpperCase();
    },
    // The ready event handler and self cleanup method
    DOMContentLoaded = function () {
      if (document.addEventListener) {
        document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
        jQuery.ready();
      } else if (document.readyState === 'complete') {
        // we're here because readyState === "complete" in oldIE
        // which is good enough for us to call the dom ready!
        document.detachEvent('onreadystatechange', DOMContentLoaded);
        jQuery.ready();
      }
    },
    // [[Class]] -> type pairs
    class2type = {};
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function (selector, context, rootjQuery) {
      var match, elem, ret, doc;
      // Handle $(""), $(null), $(undefined), $(false)
      if (!selector) {
        return this;
      }
      // Handle $(DOMElement)
      if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      }
      // Handle HTML strings
      if (typeof selector === 'string') {
        if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
          // Assume that strings that start and end with <> are HTML and skip the regex check
          match = [
            null,
            selector,
            null
          ];
        } else {
          match = rquickExpr.exec(selector);
        }
        // Match html or make sure no context is specified for #id
        if (match && (match[1] || !context)) {
          // HANDLE: $(html) -> $(array)
          if (match[1]) {
            context = context instanceof jQuery ? context[0] : context;
            doc = context && context.nodeType ? context.ownerDocument || context : document;
            // scripts is true for back-compat
            selector = jQuery.parseHTML(match[1], doc, true);
            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
              this.attr.call(selector, context, true);
            }
            return jQuery.merge(this, selector);  // HANDLE: $(#id)
          } else {
            elem = document.getElementById(match[2]);
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            if (elem && elem.parentNode) {
              // Handle the case where IE and Opera return items
              // by name instead of ID
              if (elem.id !== match[2]) {
                return rootjQuery.find(selector);
              }
              // Otherwise, we inject the element directly into the jQuery object
              this.length = 1;
              this[0] = elem;
            }
            this.context = document;
            this.selector = selector;
            return this;
          }  // HANDLE: $(expr, $(...))
        } else if (!context || context.jquery) {
          return (context || rootjQuery).find(selector);  // HANDLE: $(expr, context)
                                                          // (which is just equivalent to: $(context).find(expr)
        } else {
          return this.constructor(context).find(selector);
        }  // HANDLE: $(function)
           // Shortcut for document ready
      } else if (jQuery.isFunction(selector)) {
        return rootjQuery.ready(selector);
      }
      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
      return jQuery.makeArray(selector, this);
    },
    // Start with an empty selector
    selector: '',
    // The current version of jQuery being used
    jquery: '1.8.3',
    // The default length of a jQuery object is 0
    length: 0,
    // The number of elements contained in the matched element set
    size: function () {
      return this.length;
    },
    toArray: function () {
      return core_slice.call(this);
    },
    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
      return num == null ? // Return a 'clean' array
      this.toArray() : num < 0 ? this[this.length + num] : this[num];
    },
    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (elems, name, selector) {
      // Build a new jQuery matched element set
      var ret = jQuery.merge(this.constructor(), elems);
      // Add the old object onto the stack (as a reference)
      ret.prevObject = this;
      ret.context = this.context;
      if (name === 'find') {
        ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
      } else if (name) {
        ret.selector = this.selector + '.' + name + '(' + selector + ')';
      }
      // Return the newly-formed element set
      return ret;
    },
    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function (callback, args) {
      return jQuery.each(this, callback, args);
    },
    ready: function (fn) {
      // Add the callback
      jQuery.ready.promise().done(fn);
      return this;
    },
    eq: function (i) {
      i = +i;
      return i === -1 ? this.slice(i) : this.slice(i, i + 1);
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    slice: function () {
      return this.pushStack(core_slice.apply(this, arguments), 'slice', core_slice.call(arguments).join(','));
    },
    map: function (callback) {
      return this.pushStack(jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    end: function () {
      return this.prevObject || this.constructor(null);
    },
    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: core_push,
    sort: [].sort,
    splice: [].splice
  };
  // Give the init function the jQuery prototype for later instantiation
  jQuery.fn.init.prototype = jQuery.fn;
  jQuery.extend = jQuery.fn.extend = function () {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !jQuery.isFunction(target)) {
      target = {};
    }
    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }
    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];
          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }
          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            // Never move original objects, clone them
            target[name] = jQuery.extend(deep, clone, copy);  // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    // Return the modified object
    return target;
  };
  jQuery.extend({
    noConflict: function (deep) {
      if (window.$ === jQuery) {
        window.$ = _$;
      }
      if (deep && window.jQuery === jQuery) {
        window.jQuery = _jQuery;
      }
      return jQuery;
    },
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,
    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,
    // Hold (or release) the ready event
    holdReady: function (hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    // Handle when the DOM is ready
    ready: function (wait) {
      // Abort if there are pending holds or we're already ready
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }
      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if (!document.body) {
        return setTimeout(jQuery.ready, 1);
      }
      // Remember that the DOM is ready
      jQuery.isReady = true;
      // If a normal DOM Ready event fired, decrement, and wait if need be
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }
      // If there are functions bound, to execute
      readyList.resolveWith(document, [jQuery]);
      // Trigger any bound ready events
      if (jQuery.fn.trigger) {
        jQuery(document).trigger('ready').off('ready');
      }
    },
    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function (obj) {
      return jQuery.type(obj) === 'function';
    },
    isArray: Array.isArray || function (obj) {
      return jQuery.type(obj) === 'array';
    },
    isWindow: function (obj) {
      return obj != null && obj == obj.window;
    },
    isNumeric: function (obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },
    type: function (obj) {
      return obj == null ? String(obj) : class2type[core_toString.call(obj)] || 'object';
    },
    isPlainObject: function (obj) {
      // Must be an Object.
      // Because of IE, we also have to check the presence of the constructor property.
      // Make sure that DOM nodes and window objects don't pass through, as well
      if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
        return false;
      }
      try {
        // Not own constructor property must be Object
        if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }
      } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
      }
      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.
      var key;
      for (key in obj) {
      }
      return key === undefined || core_hasOwn.call(obj, key);
    },
    isEmptyObject: function (obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    error: function (msg) {
      throw new Error(msg);
    },
    // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // scripts (optional): If true, will include scripts passed in the html string
    parseHTML: function (data, context, scripts) {
      var parsed;
      if (!data || typeof data !== 'string') {
        return null;
      }
      if (typeof context === 'boolean') {
        scripts = context;
        context = 0;
      }
      context = context || document;
      // Single tag
      if (parsed = rsingleTag.exec(data)) {
        return [context.createElement(parsed[1])];
      }
      parsed = jQuery.buildFragment([data], context, scripts ? null : []);
      return jQuery.merge([], (parsed.cacheable ? jQuery.clone(parsed.fragment) : parsed.fragment).childNodes);
    },
    parseJSON: function (data) {
      if (!data || typeof data !== 'string') {
        return null;
      }
      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = jQuery.trim(data);
      // Attempt to parse using the native JSON parser first
      if (window.JSON && window.JSON.parse) {
        return window.JSON.parse(data);
      }
      // Make sure the incoming data is actual JSON
      // Logic borrowed from http://json.org/json2.js
      if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
        return new Function('return ' + data)();
      }
      jQuery.error('Invalid JSON: ' + data);
    },
    // Cross-browser xml parsing
    parseXML: function (data) {
      var xml, tmp;
      if (!data || typeof data !== 'string') {
        return null;
      }
      try {
        if (window.DOMParser) {
          // Standard
          tmp = new DOMParser();
          xml = tmp.parseFromString(data, 'text/xml');
        } else {
          // IE
          xml = new ActiveXObject('Microsoft.XMLDOM');
          xml.async = 'false';
          xml.loadXML(data);
        }
      } catch (e) {
        xml = undefined;
      }
      if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
        jQuery.error('Invalid XML: ' + data);
      }
      return xml;
    },
    noop: function () {
    },
    // Evaluates a script in a global context
    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function (data) {
      if (data && core_rnotwhite.test(data)) {
        // We use execScript on Internet Explorer
        // We use an anonymous function so that context is window
        // rather than jQuery in Firefox
        (window.execScript || function (data) {
          window['eval'].call(window, data);
        })(data);
      }
    },
    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function (string) {
      return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
    },
    nodeName: function (elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    // args is for internal usage only
    each: function (obj, callback, args) {
      var name, i = 0, length = obj.length, isObj = length === undefined || jQuery.isFunction(obj);
      if (args) {
        if (isObj) {
          for (name in obj) {
            if (callback.apply(obj[name], args) === false) {
              break;
            }
          }
        } else {
          for (; i < length;) {
            if (callback.apply(obj[i++], args) === false) {
              break;
            }
          }
        }  // A special, fast, case for the most common use of each
      } else {
        if (isObj) {
          for (name in obj) {
            if (callback.call(obj[name], name, obj[name]) === false) {
              break;
            }
          }
        } else {
          for (; i < length;) {
            if (callback.call(obj[i], i, obj[i++]) === false) {
              break;
            }
          }
        }
      }
      return obj;
    },
    // Use native String.trim function wherever possible
    trim: core_trim && !core_trim.call('\uFEFF\xA0') ? function (text) {
      return text == null ? '' : core_trim.call(text);
    } : // Otherwise use our own trimming functionality
    function (text) {
      return text == null ? '' : (text + '').replace(rtrim, '');
    },
    // results is for internal usage only
    makeArray: function (arr, results) {
      var type, ret = results || [];
      if (arr != null) {
        // The window, strings (and functions) also have 'length'
        // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
        type = jQuery.type(arr);
        if (arr.length == null || type === 'string' || type === 'function' || type === 'regexp' || jQuery.isWindow(arr)) {
          core_push.call(ret, arr);
        } else {
          jQuery.merge(ret, arr);
        }
      }
      return ret;
    },
    inArray: function (elem, arr, i) {
      var len;
      if (arr) {
        if (core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }
        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
        for (; i < len; i++) {
          // Skip accessing in sparse arrays
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return -1;
    },
    merge: function (first, second) {
      var l = second.length, i = first.length, j = 0;
      if (typeof l === 'number') {
        for (; j < l; j++) {
          first[i++] = second[j];
        }
      } else {
        while (second[j] !== undefined) {
          first[i++] = second[j++];
        }
      }
      first.length = i;
      return first;
    },
    grep: function (elems, callback, inv) {
      var retVal, ret = [], i = 0, length = elems.length;
      inv = !!inv;
      // Go through the array, only saving the items
      // that pass the validator function
      for (; i < length; i++) {
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    // arg is for internal usage only
    map: function (elems, callback, arg) {
      var value, key, ret = [], i = 0, length = elems.length,
        // jquery objects are treated as arrays
        isArray = elems instanceof jQuery || length !== undefined && typeof length === 'number' && (length > 0 && elems[0] && elems[length - 1] || length === 0 || jQuery.isArray(elems));
      // Go through the array, translating each of the items to their
      if (isArray) {
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret[ret.length] = value;
          }
        }  // Go through every key on the object,
      } else {
        for (key in elems) {
          value = callback(elems[key], key, arg);
          if (value != null) {
            ret[ret.length] = value;
          }
        }
      }
      // Flatten any nested arrays
      return ret.concat.apply([], ret);
    },
    // A global GUID counter for objects
    guid: 1,
    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function (fn, context) {
      var tmp, args, proxy;
      if (typeof context === 'string') {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }
      // Quick check to determine if target is callable, in the spec
      // this throws a TypeError, but we will just return undefined.
      if (!jQuery.isFunction(fn)) {
        return undefined;
      }
      // Simulated bind
      args = core_slice.call(arguments, 2);
      proxy = function () {
        return fn.apply(context, args.concat(core_slice.call(arguments)));
      };
      // Set the guid of unique handler to the same of original handler, so it can be removed
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      return proxy;
    },
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    access: function (elems, fn, key, value, chainable, emptyGet, pass) {
      var exec, bulk = key == null, i = 0, length = elems.length;
      // Sets many values
      if (key && typeof key === 'object') {
        for (i in key) {
          jQuery.access(elems, fn, i, key[i], 1, emptyGet, value);
        }
        chainable = 1;  // Sets one value
      } else if (value !== undefined) {
        // Optionally, function values get executed if exec is true
        exec = pass === undefined && jQuery.isFunction(value);
        if (bulk) {
          // Bulk operations only iterate when executing function values
          if (exec) {
            exec = fn;
            fn = function (elem, key, value) {
              return exec.call(jQuery(elem), value);
            };  // Otherwise they run against the entire set
          } else {
            fn.call(elems, value);
            fn = null;
          }
        }
        if (fn) {
          for (; i < length; i++) {
            fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
          }
        }
        chainable = 1;
      }
      return chainable ? elems : // Gets
      bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    },
    now: function () {
      return new Date().getTime();
    }
  });
  jQuery.ready.promise = function (obj) {
    if (!readyList) {
      readyList = jQuery.Deferred();
      // Catch cases where $(document).ready() is called after the browser event has already occurred.
      // we once tried to use readyState "interactive" here, but it caused issues like the one
      // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
      if (document.readyState === 'complete') {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(jQuery.ready, 1);  // Standards-based browsers support DOMContentLoaded
      } else if (document.addEventListener) {
        // Use the handy event callback
        document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
        // A fallback to window.onload, that will always work
        window.addEventListener('load', jQuery.ready, false);  // If IE event model is used
      } else {
        // Ensure firing before onload, maybe late but safe also for iframes
        document.attachEvent('onreadystatechange', DOMContentLoaded);
        // A fallback to window.onload, that will always work
        window.attachEvent('onload', jQuery.ready);
        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;
        try {
          top = window.frameElement == null && document.documentElement;
        } catch (e) {
        }
        if (top && top.doScroll) {
          (function doScrollCheck() {
            if (!jQuery.isReady) {
              try {
                // Use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                top.doScroll('left');
              } catch (e) {
                return setTimeout(doScrollCheck, 50);
              }
              // and execute any waiting functions
              jQuery.ready();
            }
          }());
        }
      }
    }
    return readyList.promise(obj);
  };
  // Populate the class2type map
  jQuery.each('Boolean Number String Function Array Date RegExp Object'.split(' '), function (i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });
  // All jQuery objects should point back to these
  rootjQuery = jQuery(document);
  // String to Object options format cache
  var optionsCache = {};
  // Convert String-formatted options into Object-formatted ones and store in cache
  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.split(core_rspace), function (_, flag) {
      object[flag] = true;
    });
    return object;
  }
  /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */
  jQuery.Callbacks = function (options) {
    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === 'string' ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var
      // Last fire value (for non-forgettable lists)
      memory,
      // Flag to know if list was already fired
      fired,
      // Flag to know if list is currently firing
      firing,
      // First callback to fire (used internally by add and fireWith)
      firingStart,
      // End of the loop when firing
      firingLength,
      // Index of currently firing callback (modified by remove if needed)
      firingIndex,
      // Actual callback list
      list = [],
      // Stack of fire calls for repeatable lists
      stack = !options.once && [],
      // Fire callbacks
      fire = function (data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        for (; list && firingIndex < firingLength; firingIndex++) {
          if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
            memory = false;
            // To prevent further calls using add
            break;
          }
        }
        firing = false;
        if (list) {
          if (stack) {
            if (stack.length) {
              fire(stack.shift());
            }
          } else if (memory) {
            list = [];
          } else {
            self.disable();
          }
        }
      },
      // Actual Callbacks object
      self = {
        // Add a callback or a collection of callbacks to the list
        add: function () {
          if (list) {
            // First, we save the current length
            var start = list.length;
            (function add(args) {
              jQuery.each(args, function (_, arg) {
                var type = jQuery.type(arg);
                if (type === 'function') {
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && type !== 'string') {
                  // Inspect recursively
                  add(arg);
                }
              });
            }(arguments));
            // Do we need to add the callbacks to the
            // current firing batch?
            if (firing) {
              firingLength = list.length;  // With memory, if we're not firing then
                                           // we should call right away
            } else if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
          return this;
        },
        // Remove a callback from the list
        remove: function () {
          if (list) {
            jQuery.each(arguments, function (_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                // Handle firing indexes
                if (firing) {
                  if (index <= firingLength) {
                    firingLength--;
                  }
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              }
            });
          }
          return this;
        },
        // Control if a given callback is in the list
        has: function (fn) {
          return jQuery.inArray(fn, list) > -1;
        },
        // Remove all callbacks from the list
        empty: function () {
          list = [];
          return this;
        },
        // Have the list do nothing anymore
        disable: function () {
          list = stack = memory = undefined;
          return this;
        },
        // Is it disabled?
        disabled: function () {
          return !list;
        },
        // Lock the list in its current state
        lock: function () {
          stack = undefined;
          if (!memory) {
            self.disable();
          }
          return this;
        },
        // Is it locked?
        locked: function () {
          return !stack;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function (context, args) {
          args = args || [];
          args = [
            context,
            args.slice ? args.slice() : args
          ];
          if (list && (!fired || stack)) {
            if (firing) {
              stack.push(args);
            } else {
              fire(args);
            }
          }
          return this;
        },
        // Call all the callbacks with the given arguments
        fire: function () {
          self.fireWith(this, arguments);
          return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function () {
          return !!fired;
        }
      };
    return self;
  };
  jQuery.extend({
    Deferred: function (func) {
      var tuples = [
          // action, add listener, listener list, final state
          [
            'resolve',
            'done',
            jQuery.Callbacks('once memory'),
            'resolved'
          ],
          [
            'reject',
            'fail',
            jQuery.Callbacks('once memory'),
            'rejected'
          ],
          [
            'notify',
            'progress',
            jQuery.Callbacks('memory')
          ]
        ], state = 'pending', promise = {
          state: function () {
            return state;
          },
          always: function () {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          then: function () {
            var fns = arguments;
            return jQuery.Deferred(function (newDefer) {
              jQuery.each(tuples, function (i, tuple) {
                var action = tuple[0], fn = fns[i];
                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                deferred[tuple[1]](jQuery.isFunction(fn) ? function () {
                  var returned = fn.apply(this, arguments);
                  if (returned && jQuery.isFunction(returned.promise)) {
                    returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                  } else {
                    newDefer[action + 'With'](this === deferred ? newDefer : this, [returned]);
                  }
                } : newDefer[action]);
              });
              fns = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function (obj) {
            return obj != null ? jQuery.extend(obj, promise) : promise;
          }
        }, deferred = {};
      // Keep pipe for back-compat
      promise.pipe = promise.then;
      // Add list-specific methods
      jQuery.each(tuples, function (i, tuple) {
        var list = tuple[2], stateString = tuple[3];
        // promise[ done | fail | progress ] = list.add
        promise[tuple[1]] = list.add;
        // Handle state
        if (stateString) {
          list.add(function () {
            // state = [ resolved | rejected ]
            state = stateString;  // [ reject_list | resolve_list ].disable; progress_list.lock
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }
        // deferred[ resolve | reject | notify ] = list.fire
        deferred[tuple[0]] = list.fire;
        deferred[tuple[0] + 'With'] = list.fireWith;
      });
      // Make the deferred a promise
      promise.promise(deferred);
      // Call given func if any
      if (func) {
        func.call(deferred, deferred);
      }
      // All done!
      return deferred;
    },
    // Deferred helper
    when: function (subordinate) {
      var i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length,
        // the count of uncompleted subordinates
        remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,
        // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
        // Update function for both resolve and progress values
        updateFunc = function (i, contexts, values) {
          return function (value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
            if (values === progressValues) {
              deferred.notifyWith(contexts, values);
            } else if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          };
        }, progressValues, progressContexts, resolveContexts;
      // add listeners to Deferred subordinates; treat others as resolved
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for (; i < length; i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      // if we're not waiting on anything, resolve the master
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }
      return deferred.promise();
    }
  });
  jQuery.support = function () {
    var support, all, a, select, opt, input, fragment, eventName, i, isSupported, clickFn, div = document.createElement('div');
    // Setup
    div.setAttribute('className', 't');
    div.innerHTML = '  <link/><table></table><a href=\'/a\'>a</a><input type=\'checkbox\'/>';
    // Support tests won't run in some limited or non-browser environments
    all = div.getElementsByTagName('*');
    a = div.getElementsByTagName('a')[0];
    if (!all || !a || !all.length) {
      return {};
    }
    // First batch of tests
    select = document.createElement('select');
    opt = select.appendChild(document.createElement('option'));
    input = div.getElementsByTagName('input')[0];
    a.style.cssText = 'top:1px;float:left;opacity:.5';
    support = {
      // IE strips leading whitespace when .innerHTML is used
      leadingWhitespace: div.firstChild.nodeType === 3,
      // Make sure that tbody elements aren't automatically inserted
      // IE will insert them into empty tables
      tbody: !div.getElementsByTagName('tbody').length,
      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      htmlSerialize: !!div.getElementsByTagName('link').length,
      // Get the style information from getAttribute
      // (IE uses .cssText instead)
      style: /top/.test(a.getAttribute('style')),
      // Make sure that URLs aren't manipulated
      // (IE normalizes it by default)
      hrefNormalized: a.getAttribute('href') === '/a',
      // Make sure that element opacity exists
      // (IE uses filter instead)
      // Use a regex to work around a WebKit issue. See #5145
      opacity: /^0.5/.test(a.style.opacity),
      // Verify style float existence
      // (IE uses styleFloat instead of cssFloat)
      cssFloat: !!a.style.cssFloat,
      // Make sure that if no value is specified for a checkbox
      // that it defaults to "on".
      // (WebKit defaults to "" instead)
      checkOn: input.value === 'on',
      // Make sure that a selected-by-default option has a working selected property.
      // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
      optSelected: opt.selected,
      // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
      getSetAttribute: div.className !== 't',
      // Tests for enctype support on a form (#6743)
      enctype: !!document.createElement('form').enctype,
      // Makes sure cloning an html5 element does not cause problems
      // Where outerHTML is undefined, this still works
      html5Clone: document.createElement('nav').cloneNode(true).outerHTML !== '<:nav></:nav>',
      // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
      boxModel: document.compatMode === 'CSS1Compat',
      // Will be defined later
      submitBubbles: true,
      changeBubbles: true,
      focusinBubbles: false,
      deleteExpando: true,
      noCloneEvent: true,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableMarginRight: true,
      boxSizingReliable: true,
      pixelPosition: false
    };
    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode(true).checked;
    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
      delete div.test;
    } catch (e) {
      support.deleteExpando = false;
    }
    if (!div.addEventListener && div.attachEvent && div.fireEvent) {
      div.attachEvent('onclick', clickFn = function () {
        // Cloning a node shouldn't copy over any
        // bound event handlers (IE does this)
        support.noCloneEvent = false;
      });
      div.cloneNode(true).fireEvent('onclick');
      div.detachEvent('onclick', clickFn);
    }
    // Check if a radio maintains its value
    // after being appended to the DOM
    input = document.createElement('input');
    input.value = 't';
    input.setAttribute('type', 'radio');
    support.radioValue = input.value === 't';
    input.setAttribute('checked', 'checked');
    // #11217 - WebKit loses check when the name is after the checked attribute
    input.setAttribute('name', 't');
    div.appendChild(input);
    fragment = document.createDocumentFragment();
    fragment.appendChild(div.lastChild);
    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;
    fragment.removeChild(input);
    fragment.appendChild(div);
    // Technique from Juriy Zaytsev
    // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
    // We only care about the case where non-standard event systems
    // are used, namely in IE. Short-circuiting here helps us to
    // avoid an eval call (in setAttribute) which can cause CSP
    // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
    if (div.attachEvent) {
      for (i in {
          submit: true,
          change: true,
          focusin: true
        }) {
        eventName = 'on' + i;
        isSupported = eventName in div;
        if (!isSupported) {
          div.setAttribute(eventName, 'return;');
          isSupported = typeof div[eventName] === 'function';
        }
        support[i + 'Bubbles'] = isSupported;
      }
    }
    // Run tests that need a body at doc ready
    jQuery(function () {
      var container, div, tds, marginDiv, divReset = 'padding:0;margin:0;border:0;display:block;overflow:hidden;', body = document.getElementsByTagName('body')[0];
      if (!body) {
        // Return for frameset docs that don't have a body
        return;
      }
      container = document.createElement('div');
      container.style.cssText = 'visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px';
      body.insertBefore(container, body.firstChild);
      // Construct the test element
      div = document.createElement('div');
      container.appendChild(div);
      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      // (only IE 8 fails this test)
      div.innerHTML = '<table><tr><td></td><td>t</td></tr></table>';
      tds = div.getElementsByTagName('td');
      tds[0].style.cssText = 'padding:0;margin:0;border:0;display:none';
      isSupported = tds[0].offsetHeight === 0;
      tds[0].style.display = '';
      tds[1].style.display = 'none';
      // Check if empty table cells still have offsetWidth/Height
      // (IE <= 8 fail this test)
      support.reliableHiddenOffsets = isSupported && tds[0].offsetHeight === 0;
      // Check box-sizing and margin behavior
      div.innerHTML = '';
      div.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;';
      support.boxSizing = div.offsetWidth === 4;
      support.doesNotIncludeMarginInBodyOffset = body.offsetTop !== 1;
      // NOTE: To any future maintainer, we've window.getComputedStyle
      // because jsdom on node.js will break without it.
      if (window.getComputedStyle) {
        support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== '1%';
        support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: '4px' }).width === '4px';
        // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. For more
        // info see bug #3333
        // Fails in WebKit before Feb 2011 nightlies
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        marginDiv = document.createElement('div');
        marginDiv.style.cssText = div.style.cssText = divReset;
        marginDiv.style.marginRight = marginDiv.style.width = '0';
        div.style.width = '1px';
        div.appendChild(marginDiv);
        support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
      }
      if (typeof div.style.zoom !== 'undefined') {
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        // (IE < 8 does this)
        div.innerHTML = '';
        div.style.cssText = divReset + 'width:1px;padding:1px;display:inline;zoom:1';
        support.inlineBlockNeedsLayout = div.offsetWidth === 3;
        // Check if elements with layout shrink-wrap their children
        // (IE 6 does this)
        div.style.display = 'block';
        div.style.overflow = 'visible';
        div.innerHTML = '<div></div>';
        div.firstChild.style.width = '5px';
        support.shrinkWrapBlocks = div.offsetWidth !== 3;
        container.style.zoom = 1;
      }
      // Null elements to avoid leaks in IE
      body.removeChild(container);
      container = div = tds = marginDiv = null;
    });
    // Null elements to avoid leaks in IE
    fragment.removeChild(div);
    all = a = select = opt = input = fragment = div = null;
    return support;
  }();
  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
  jQuery.extend({
    cache: {},
    deletedIds: [],
    // Remove at next major release (1.9/2.0)
    uuid: 0,
    // Unique for each copy of jQuery on the page
    // Non-digits removed to match rinlinejQuery
    expando: 'jQuery' + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ''),
    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
      'embed': true,
      // Ban all objects except for Flash (which handle expandos)
      'object': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
      'applet': true
    },
    hasData: function (elem) {
      elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
      return !!elem && !isEmptyDataObject(elem);
    },
    data: function (elem, name, data, pvt) {
      if (!jQuery.acceptData(elem)) {
        return;
      }
      var thisCache, ret, internalKey = jQuery.expando, getByName = typeof name === 'string',
        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
        isNode = elem.nodeType,
        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
        cache = isNode ? jQuery.cache : elem,
        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
        id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
      // Avoid doing any more work than we need to when trying to get data on an
      // object that has no data at all
      if ((!id || !cache[id] || !pvt && !cache[id].data) && getByName && data === undefined) {
        return;
      }
      if (!id) {
        // Only DOM nodes need a new unique ID for each element since their data
        // ends up in the global cache
        if (isNode) {
          elem[internalKey] = id = jQuery.deletedIds.pop() || jQuery.guid++;
        } else {
          id = internalKey;
        }
      }
      if (!cache[id]) {
        cache[id] = {};
        // Avoids exposing jQuery metadata on plain JS objects when the object
        // is serialized using JSON.stringify
        if (!isNode) {
          cache[id].toJSON = jQuery.noop;
        }
      }
      // An object can be passed to jQuery.data instead of a key/value pair; this gets
      // shallow copied over onto the existing cache
      if (typeof name === 'object' || typeof name === 'function') {
        if (pvt) {
          cache[id] = jQuery.extend(cache[id], name);
        } else {
          cache[id].data = jQuery.extend(cache[id].data, name);
        }
      }
      thisCache = cache[id];
      // jQuery data() is stored in a separate object inside the object's internal data
      // cache in order to avoid key collisions between internal data and user-defined
      // data.
      if (!pvt) {
        if (!thisCache.data) {
          thisCache.data = {};
        }
        thisCache = thisCache.data;
      }
      if (data !== undefined) {
        thisCache[jQuery.camelCase(name)] = data;
      }
      // Check for both converted-to-camel and non-converted data property names
      // If a data property was specified
      if (getByName) {
        // First Try to find as-is property data
        ret = thisCache[name];
        // Test for null|undefined property data
        if (ret == null) {
          // Try to find the camelCased property
          ret = thisCache[jQuery.camelCase(name)];
        }
      } else {
        ret = thisCache;
      }
      return ret;
    },
    removeData: function (elem, name, pvt) {
      if (!jQuery.acceptData(elem)) {
        return;
      }
      var thisCache, i, l, isNode = elem.nodeType,
        // See jQuery.data for more information
        cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
      // If there is already no cache entry for this object, there is no
      // purpose in continuing
      if (!cache[id]) {
        return;
      }
      if (name) {
        thisCache = pvt ? cache[id] : cache[id].data;
        if (thisCache) {
          // Support array or space separated string names for data keys
          if (!jQuery.isArray(name)) {
            // try the string as a key before any manipulation
            if (name in thisCache) {
              name = [name];
            } else {
              // split the camel cased version by spaces unless a key with the spaces exists
              name = jQuery.camelCase(name);
              if (name in thisCache) {
                name = [name];
              } else {
                name = name.split(' ');
              }
            }
          }
          for (i = 0, l = name.length; i < l; i++) {
            delete thisCache[name[i]];
          }
          // If there is no data left in the cache, we want to continue
          // and let the cache object itself get destroyed
          if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
            return;
          }
        }
      }
      // See jQuery.data for more information
      if (!pvt) {
        delete cache[id].data;
        // Don't destroy the parent cache unless the internal data object
        // had been the only thing left in it
        if (!isEmptyDataObject(cache[id])) {
          return;
        }
      }
      // Destroy the cache
      if (isNode) {
        jQuery.cleanData([elem], true);  // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
      } else if (jQuery.support.deleteExpando || cache != cache.window) {
        delete cache[id];  // When all else fails, null
      } else {
        cache[id] = null;
      }
    },
    // For internal use only.
    _data: function (elem, name, data) {
      return jQuery.data(elem, name, data, true);
    },
    // A method for determining if a DOM node can handle the data expando
    acceptData: function (elem) {
      var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
      // nodes accept data unless otherwise specified; rejection can be conditional
      return !noData || noData !== true && elem.getAttribute('classid') === noData;
    }
  });
  jQuery.fn.extend({
    data: function (key, value) {
      var parts, part, attr, name, l, elem = this[0], i = 0, data = null;
      // Gets all values
      if (key === undefined) {
        if (this.length) {
          data = jQuery.data(elem);
          if (elem.nodeType === 1 && !jQuery._data(elem, 'parsedAttrs')) {
            attr = elem.attributes;
            for (l = attr.length; i < l; i++) {
              name = attr[i].name;
              if (!name.indexOf('data-')) {
                name = jQuery.camelCase(name.substring(5));
                dataAttr(elem, name, data[name]);
              }
            }
            jQuery._data(elem, 'parsedAttrs', true);
          }
        }
        return data;
      }
      // Sets multiple values
      if (typeof key === 'object') {
        return this.each(function () {
          jQuery.data(this, key);
        });
      }
      parts = key.split('.', 2);
      parts[1] = parts[1] ? '.' + parts[1] : '';
      part = parts[1] + '!';
      return jQuery.access(this, function (value) {
        if (value === undefined) {
          data = this.triggerHandler('getData' + part, [parts[0]]);
          // Try to fetch any internally stored data first
          if (data === undefined && elem) {
            data = jQuery.data(elem, key);
            data = dataAttr(elem, key, data);
          }
          return data === undefined && parts[1] ? this.data(parts[0]) : data;
        }
        parts[1] = value;
        this.each(function () {
          var self = jQuery(this);
          self.triggerHandler('setData' + part, parts);
          jQuery.data(this, key, value);
          self.triggerHandler('changeData' + part, parts);
        });
      }, null, value, arguments.length > 1, null, false);
    },
    removeData: function (key) {
      return this.each(function () {
        jQuery.removeData(this, key);
      });
    }
  });
  function dataAttr(elem, key, data) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if (data === undefined && elem.nodeType === 1) {
      var name = 'data-' + key.replace(rmultiDash, '-$1').toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === 'string') {
        try {
          data = data === 'true' ? true : data === 'false' ? false : data === 'null' ? null : // Only convert to a number if it doesn't change the string
          +data + '' === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {
        }
        // Make sure we set the data so it isn't changed later
        jQuery.data(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  // checks a cache object for emptiness
  function isEmptyDataObject(obj) {
    var name;
    for (name in obj) {
      // if the public data object is empty, the private is still empty
      if (name === 'data' && jQuery.isEmptyObject(obj[name])) {
        continue;
      }
      if (name !== 'toJSON') {
        return false;
      }
    }
    return true;
  }
  jQuery.extend({
    queue: function (elem, type, data) {
      var queue;
      if (elem) {
        type = (type || 'fx') + 'queue';
        queue = jQuery._data(elem, type);
        // Speed up dequeue by getting out quickly if this is just a lookup
        if (data) {
          if (!queue || jQuery.isArray(data)) {
            queue = jQuery._data(elem, type, jQuery.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function (elem, type) {
      type = type || 'fx';
      var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function () {
          jQuery.dequeue(elem, type);
        };
      // If the fx queue is dequeued, always remove the progress sentinel
      if (fn === 'inprogress') {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if (type === 'fx') {
          queue.unshift('inprogress');
        }
        // clear up the last queue stop function
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    // not intended for public consumption - generates a queueHooks object, or returns the current one
    _queueHooks: function (elem, type) {
      var key = type + 'queueHooks';
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty: jQuery.Callbacks('once memory').add(function () {
          jQuery.removeData(elem, type + 'queue', true);
          jQuery.removeData(elem, key, true);
        })
      });
    }
  });
  jQuery.fn.extend({
    queue: function (type, data) {
      var setter = 2;
      if (typeof type !== 'string') {
        data = type;
        type = 'fx';
        setter--;
      }
      if (arguments.length < setter) {
        return jQuery.queue(this[0], type);
      }
      return data === undefined ? this : this.each(function () {
        var queue = jQuery.queue(this, type, data);
        // ensure a hooks for this queue
        jQuery._queueHooks(this, type);
        if (type === 'fx' && queue[0] !== 'inprogress') {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function (type) {
      return this.each(function () {
        jQuery.dequeue(this, type);
      });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay: function (time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
      type = type || 'fx';
      return this.queue(type, function (next, hooks) {
        var timeout = setTimeout(next, time);
        hooks.stop = function () {
          clearTimeout(timeout);
        };
      });
    },
    clearQueue: function (type) {
      return this.queue(type || 'fx', []);
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function (type, obj) {
      var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function () {
          if (!--count) {
            defer.resolveWith(elements, [elements]);
          }
        };
      if (typeof type !== 'string') {
        obj = type;
        type = undefined;
      }
      type = type || 'fx';
      while (i--) {
        tmp = jQuery._data(elements[i], type + 'queueHooks');
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var nodeHook, boolHook, fixSpecified, rclass = /[\t\r\n]/g, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea|)$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute;
  jQuery.fn.extend({
    attr: function (name, value) {
      return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function (name) {
      return this.each(function () {
        jQuery.removeAttr(this, name);
      });
    },
    prop: function (name, value) {
      return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function (name) {
      name = jQuery.propFix[name] || name;
      return this.each(function () {
        // try/catch handles cases where IE balks (such as removing a property on window)
        try {
          this[name] = undefined;
          delete this[name];
        } catch (e) {
        }
      });
    },
    addClass: function (value) {
      var classNames, i, l, elem, setClass, c, cl;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (value && typeof value === 'string') {
        classNames = value.split(core_rspace);
        for (i = 0, l = this.length; i < l; i++) {
          elem = this[i];
          if (elem.nodeType === 1) {
            if (!elem.className && classNames.length === 1) {
              elem.className = value;
            } else {
              setClass = ' ' + elem.className + ' ';
              for (c = 0, cl = classNames.length; c < cl; c++) {
                if (setClass.indexOf(' ' + classNames[c] + ' ') < 0) {
                  setClass += classNames[c] + ' ';
                }
              }
              elem.className = jQuery.trim(setClass);
            }
          }
        }
      }
      return this;
    },
    removeClass: function (value) {
      var removes, className, elem, c, cl, i, l;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (value && typeof value === 'string' || value === undefined) {
        removes = (value || '').split(core_rspace);
        for (i = 0, l = this.length; i < l; i++) {
          elem = this[i];
          if (elem.nodeType === 1 && elem.className) {
            className = (' ' + elem.className + ' ').replace(rclass, ' ');
            // loop over each item in the removal list
            for (c = 0, cl = removes.length; c < cl; c++) {
              // Remove until there is nothing to remove,
              while (className.indexOf(' ' + removes[c] + ' ') >= 0) {
                className = className.replace(' ' + removes[c] + ' ', ' ');
              }
            }
            elem.className = value ? jQuery.trim(className) : '';
          }
        }
      }
      return this;
    },
    toggleClass: function (value, stateVal) {
      var type = typeof value, isBool = typeof stateVal === 'boolean';
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
        });
      }
      return this.each(function () {
        if (type === 'string') {
          // toggle individual class names
          var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(core_rspace);
          while (className = classNames[i++]) {
            // check each className given, space separated list
            state = isBool ? state : !self.hasClass(className);
            self[state ? 'addClass' : 'removeClass'](className);
          }
        } else if (type === 'undefined' || type === 'boolean') {
          if (this.className) {
            // store className if set
            jQuery._data(this, '__className__', this.className);
          }
          // toggle whole className
          this.className = this.className || value === false ? '' : jQuery._data(this, '__className__') || '';
        }
      });
    },
    hasClass: function (selector) {
      var className = ' ' + selector + ' ', i = 0, l = this.length;
      for (; i < l; i++) {
        if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(rclass, ' ').indexOf(className) >= 0) {
          return true;
        }
      }
      return false;
    },
    val: function (value) {
      var hooks, ret, isFunction, elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
          if (hooks && 'get' in hooks && (ret = hooks.get(elem, 'value')) !== undefined) {
            return ret;
          }
          ret = elem.value;
          return typeof ret === 'string' ? // handle most common string cases
          ret.replace(rreturn, '') : // handle cases where value is null/undef or number
          ret == null ? '' : ret;
        }
        return;
      }
      isFunction = jQuery.isFunction(value);
      return this.each(function (i) {
        var val, self = jQuery(this);
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, self.val());
        } else {
          val = value;
        }
        // Treat null/undefined as ""; convert numbers to string
        if (val == null) {
          val = '';
        } else if (typeof val === 'number') {
          val += '';
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function (value) {
            return value == null ? '' : value + '';
          });
        }
        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
        // If set returns undefined, fall back to normal setting
        if (!hooks || !('set' in hooks) || hooks.set(this, val, 'value') === undefined) {
          this.value = val;
        }
      });
    }
  });
  jQuery.extend({
    valHooks: {
      option: {
        get: function (elem) {
          // attributes.value is undefined in Blackberry 4.7 but
          // uses .value. See #6932
          var val = elem.attributes.value;
          return !val || val.specified ? elem.value : elem.text;
        }
      },
      select: {
        get: function (elem) {
          var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === 'select-one' || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
          // Loop through all the selected options
          for (; i < max; i++) {
            option = options[i];
            // oldIE doesn't update selected after form reset (#2551)
            if ((option.selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute('disabled') === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, 'optgroup'))) {
              // Get the specific value for the option
              value = jQuery(option).val();
              // We don't need an array for one selects
              if (one) {
                return value;
              }
              // Multi-Selects return an array
              values.push(value);
            }
          }
          return values;
        },
        set: function (elem, value) {
          var values = jQuery.makeArray(value);
          jQuery(elem).find('option').each(function () {
            this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
          });
          if (!values.length) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    },
    // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
    attrFn: {},
    attr: function (elem, name, value, pass) {
      var ret, hooks, notxml, nType = elem.nodeType;
      // don't get/set attributes on text, comment and attribute nodes
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (pass && jQuery.isFunction(jQuery.fn[name])) {
        return jQuery(elem)[name](value);
      }
      // Fallback to prop when attributes are not supported
      if (typeof elem.getAttribute === 'undefined') {
        return jQuery.prop(elem, name, value);
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      // All attributes are lowercase
      // Grab necessary hook if one is defined
      if (notxml) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
      }
      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
          return;
        } else if (hooks && 'set' in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        } else {
          elem.setAttribute(name, value + '');
          return value;
        }
      } else if (hooks && 'get' in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      } else {
        ret = elem.getAttribute(name);
        // Non-existent attributes return null, we normalize to undefined
        return ret === null ? undefined : ret;
      }
    },
    removeAttr: function (elem, value) {
      var propName, attrNames, name, isBool, i = 0;
      if (value && elem.nodeType === 1) {
        attrNames = value.split(core_rspace);
        for (; i < attrNames.length; i++) {
          name = attrNames[i];
          if (name) {
            propName = jQuery.propFix[name] || name;
            isBool = rboolean.test(name);
            // See #9699 for explanation of this approach (setting first, then removal)
            // Do not do this for boolean attributes (see #10870)
            if (!isBool) {
              jQuery.attr(elem, name, '');
            }
            elem.removeAttribute(getSetAttribute ? name : propName);
            // Set corresponding property to false for boolean attributes
            if (isBool && propName in elem) {
              elem[propName] = false;
            }
          }
        }
      }
    },
    attrHooks: {
      type: {
        set: function (elem, value) {
          // We can't allow the type property to be changed (since it causes problems in IE)
          if (rtype.test(elem.nodeName) && elem.parentNode) {
            jQuery.error('type property can\'t be changed');
          } else if (!jQuery.support.radioValue && value === 'radio' && jQuery.nodeName(elem, 'input')) {
            // Setting the type on a radio button after the value resets the value in IE6-9
            // Reset value to it's default in case type is set after value
            // This is for element creation
            var val = elem.value;
            elem.setAttribute('type', value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }
      },
      // Use the value property for back compat
      // Use the nodeHook for button elements in IE6/7 (#1954)
      value: {
        get: function (elem, name) {
          if (nodeHook && jQuery.nodeName(elem, 'button')) {
            return nodeHook.get(elem, name);
          }
          return name in elem ? elem.value : null;
        },
        set: function (elem, value, name) {
          if (nodeHook && jQuery.nodeName(elem, 'button')) {
            return nodeHook.set(elem, value, name);
          }
          // Does not return so that setAttribute is also used
          elem.value = value;
        }
      }
    },
    propFix: {
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      maxlength: 'maxLength',
      cellspacing: 'cellSpacing',
      cellpadding: 'cellPadding',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable'
    },
    prop: function (elem, name, value) {
      var ret, hooks, notxml, nType = elem.nodeType;
      // don't get/set properties on text, comment and attribute nodes
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      if (notxml) {
        // Fix name and attach hooks
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }
      if (value !== undefined) {
        if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        } else {
          return elem[name] = value;
        }
      } else {
        if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
          return ret;
        } else {
          return elem[name];
        }
      }
    },
    propHooks: {
      tabIndex: {
        get: function (elem) {
          // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
          // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
          var attributeNode = elem.getAttributeNode('tabindex');
          return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
        }
      }
    }
  });
  // Hook for boolean attributes
  boolHook = {
    get: function (elem, name) {
      // Align boolean attributes with corresponding properties
      // Fall back to attribute presence where some booleans are not supported
      var attrNode, property = jQuery.prop(elem, name);
      return property === true || typeof property !== 'boolean' && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
    },
    set: function (elem, value, name) {
      var propName;
      if (value === false) {
        // Remove boolean attributes when set to false
        jQuery.removeAttr(elem, name);
      } else {
        // value is true since we know at this point it's type boolean and not false
        // Set boolean attributes to the same name and set the DOM property
        propName = jQuery.propFix[name] || name;
        if (propName in elem) {
          // Only set the IDL specifically if it already exists on the element
          elem[propName] = true;
        }
        elem.setAttribute(name, name.toLowerCase());
      }
      return name;
    }
  };
  // IE6/7 do not support getting/setting some attributes with get/setAttribute
  if (!getSetAttribute) {
    fixSpecified = {
      name: true,
      id: true,
      coords: true
    };
    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
      get: function (elem, name) {
        var ret;
        ret = elem.getAttributeNode(name);
        return ret && (fixSpecified[name] ? ret.value !== '' : ret.specified) ? ret.value : undefined;
      },
      set: function (elem, value, name) {
        // Set the existing or create a new attribute node
        var ret = elem.getAttributeNode(name);
        if (!ret) {
          ret = document.createAttribute(name);
          elem.setAttributeNode(ret);
        }
        return ret.value = value + '';
      }
    };
    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([
      'width',
      'height'
    ], function (i, name) {
      jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
        set: function (elem, value) {
          if (value === '') {
            elem.setAttribute(name, 'auto');
            return value;
          }
        }
      });
    });
    // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
      get: nodeHook.get,
      set: function (elem, value, name) {
        if (value === '') {
          value = 'false';
        }
        nodeHook.set(elem, value, name);
      }
    };
  }
  // Some attributes require a special call on IE
  if (!jQuery.support.hrefNormalized) {
    jQuery.each([
      'href',
      'src',
      'width',
      'height'
    ], function (i, name) {
      jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
        get: function (elem) {
          var ret = elem.getAttribute(name, 2);
          return ret === null ? undefined : ret;
        }
      });
    });
  }
  if (!jQuery.support.style) {
    jQuery.attrHooks.style = {
      get: function (elem) {
        // Return undefined in the case of empty string
        // Normalize to lowercase since IE uppercases css property names
        return elem.style.cssText.toLowerCase() || undefined;
      },
      set: function (elem, value) {
        return elem.style.cssText = value + '';
      }
    };
  }
  // Safari mis-reports the default selected property of an option
  // Accessing the parent's selectedIndex property fixes it
  if (!jQuery.support.optSelected) {
    jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
      get: function (elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          // Make sure that it also works with optgroups, see #5701
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
        return null;
      }
    });
  }
  // IE6/7 call enctype encoding
  if (!jQuery.support.enctype) {
    jQuery.propFix.enctype = 'encoding';
  }
  // Radios and checkboxes getter/setter
  if (!jQuery.support.checkOn) {
    jQuery.each([
      'radio',
      'checkbox'
    ], function () {
      jQuery.valHooks[this] = {
        get: function (elem) {
          // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
          return elem.getAttribute('value') === null ? 'on' : elem.value;
        }
      };
    });
  }
  jQuery.each([
    'radio',
    'checkbox'
  ], function () {
    jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
      set: function (elem, value) {
        if (jQuery.isArray(value)) {
          return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
        }
      }
    });
  });
  var rformElems = /^(?:textarea|input|select)$/i, rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/, rhoverHack = /(?:^|\s)hover(\.\S+|)\b/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, hoverHack = function (events) {
      return jQuery.event.special.hover ? events : events.replace(rhoverHack, 'mouseenter$1 mouseleave$1');
    };
  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */
  jQuery.event = {
    add: function (elem, types, handler, data, selector) {
      var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, handlers, special;
      // Don't attach events to noData or text/comment nodes (allow plain objects tho)
      if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
        return;
      }
      // Caller can pass in an object of custom data in lieu of the handler
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      // Make sure that the handler has a unique ID, used to find/remove it later
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }
      // Init the element's event structure and main handler, if this is the first
      events = elemData.events;
      if (!events) {
        elemData.events = events = {};
      }
      eventHandle = elemData.handle;
      if (!eventHandle) {
        elemData.handle = eventHandle = function (e) {
          // Discard the second event of a jQuery.event.trigger() and
          // when an event is called after a page has unloaded
          return typeof jQuery !== 'undefined' && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
        };
        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
        eventHandle.elem = elem;
      }
      // Handle multiple events separated by a space
      // jQuery(...).bind("mouseover mouseout", fn);
      types = jQuery.trim(hoverHack(types)).split(' ');
      for (t = 0; t < types.length; t++) {
        tns = rtypenamespace.exec(types[t]) || [];
        type = tns[1];
        namespaces = (tns[2] || '').split('.').sort();
        // If event changes its type, use the special event handlers for the changed type
        special = jQuery.event.special[type] || {};
        // If selector defined, determine special event api type, otherwise given type
        type = (selector ? special.delegateType : special.bindType) || type;
        // Update special based on newly reset type
        special = jQuery.event.special[type] || {};
        // handleObj is passed to all event handlers
        handleObj = jQuery.extend({
          type: type,
          origType: tns[1],
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join('.')
        }, handleObjIn);
        // Init the event handler queue if we're the first
        handlers = events[type];
        if (!handlers) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          // Only use addEventListener/attachEvent if the special events handler returns false
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            // Bind the global event handler to the element
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
              elem.attachEvent('on' + type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        // Add to the element's handler list, delegates in front
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        // Keep track of which events have ever been used, for event optimization
        jQuery.event.global[type] = true;
      }
      // Nullify elem to prevent memory leaks in IE
      elem = null;
    },
    global: {},
    // Detach an event or set of events from an element
    remove: function (elem, types, handler, selector, mappedTypes) {
      var t, tns, type, origType, namespaces, origCount, j, events, special, eventType, handleObj, elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      // Once for each type.namespace in types; type may be omitted
      types = jQuery.trim(hoverHack(types || '')).split(' ');
      for (t = 0; t < types.length; t++) {
        tns = rtypenamespace.exec(types[t]) || [];
        type = origType = tns[1];
        namespaces = tns[2];
        // Unbind all events (on this namespace, if provided) for the element
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        eventType = events[type] || [];
        origCount = eventType.length;
        namespaces = namespaces ? new RegExp('(^|\\.)' + namespaces.split('.').sort().join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
        // Remove matching events
        for (j = 0; j < eventType.length; j++) {
          handleObj = eventType[j];
          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!namespaces || namespaces.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
            eventType.splice(j--, 1);
            if (handleObj.selector) {
              eventType.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        // Remove generic event handler if we removed something and no more handlers exist
        // (avoids potential for endless recursion during removal of special event handlers)
        if (eventType.length === 0 && origCount !== eventType.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      // Remove the expando if it's no longer used
      if (jQuery.isEmptyObject(events)) {
        delete elemData.handle;
        // removeData also checks for emptiness and clears the expando if empty
        // so use it instead of delete
        jQuery.removeData(elem, 'events', true);
      }
    },
    // Events that are safe to short-circuit if no handlers are attached.
    // Native DOM events should not be added, they may have inline handlers.
    customEvent: {
      'getData': true,
      'setData': true,
      'changeData': true
    },
    trigger: function (event, data, elem, onlyHandlers) {
      // Don't do events on text and comment nodes
      if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
        return;
      }
      // Event object or event type
      var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType, type = event.type || event, namespaces = [];
      // focus/blur morphs to focusin/out; ensure we're not firing them right now
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }
      if (type.indexOf('!') >= 0) {
        // Exclusive events trigger only for the exact event (no namespaces)
        type = type.slice(0, -1);
        exclusive = true;
      }
      if (type.indexOf('.') >= 0) {
        // Namespaced trigger; create a regexp to match event type in handle()
        namespaces = type.split('.');
        type = namespaces.shift();
        namespaces.sort();
      }
      if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
        // No jQuery handlers for this event type, and it can't have inline handlers
        return;
      }
      // Caller can pass in an Event, Object, or just an event type string
      event = typeof event === 'object' ? // jQuery.Event object
      event[jQuery.expando] ? event : // Object literal
      new jQuery.Event(type, event) : // Just the event type (string)
      new jQuery.Event(type);
      event.type = type;
      event.isTrigger = true;
      event.exclusive = exclusive;
      event.namespace = namespaces.join('.');
      event.namespace_re = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
      ontype = type.indexOf(':') < 0 ? 'on' + type : '';
      // Handle a global trigger
      if (!elem) {
        // TODO: Stop taunting the data cache; remove global events and always attach to document
        cache = jQuery.cache;
        for (i in cache) {
          if (cache[i].events && cache[i].events[type]) {
            jQuery.event.trigger(event, data, cache[i].handle.elem, true);
          }
        }
        return;
      }
      // Clean up the event in case it is being reused
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      // Clone any incoming data and prepend the event, creating the handler arg list
      data = data != null ? jQuery.makeArray(data) : [];
      data.unshift(event);
      // Allow special events to draw outside the lines
      special = jQuery.event.special[type] || {};
      if (special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      eventPath = [[
          elem,
          special.bindType || type
        ]];
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
        for (old = elem; cur; cur = cur.parentNode) {
          eventPath.push([
            cur,
            bubbleType
          ]);
          old = cur;
        }
        // Only add window if we got to document (e.g., not plain obj or detached DOM)
        if (old === (elem.ownerDocument || document)) {
          eventPath.push([
            old.defaultView || old.parentWindow || window,
            bubbleType
          ]);
        }
      }
      // Fire handlers on the event path
      for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {
        cur = eventPath[i][0];
        event.type = eventPath[i][1];
        handle = (jQuery._data(cur, 'events') || {})[event.type] && jQuery._data(cur, 'handle');
        if (handle) {
          handle.apply(cur, data);
        }
        // Note that this is a bare JS function and not a jQuery handler
        handle = ontype && cur[ontype];
        if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
          event.preventDefault();
        }
      }
      event.type = type;
      // If nobody prevented the default action, do it now
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === 'click' && jQuery.nodeName(elem, 'a')) && jQuery.acceptData(elem)) {
          // Call a native DOM method on the target with the same name name as the event.
          // Can't use an .isFunction() check here because IE6/7 fails that test.
          // Don't do default actions on window, that's where global variables be (#6170)
          // IE<9 dies on focus/blur to hidden element (#1486)
          if (ontype && elem[type] && (type !== 'focus' && type !== 'blur' || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {
            // Don't re-trigger an onFOO event when we call its FOO() method
            old = elem[ontype];
            if (old) {
              elem[ontype] = null;
            }
            // Prevent re-triggering of the same event, since we already bubbled it above
            jQuery.event.triggered = type;
            elem[type]();
            jQuery.event.triggered = undefined;
            if (old) {
              elem[ontype] = old;
            }
          }
        }
      }
      return event.result;
    },
    dispatch: function (event) {
      // Make a writable jQuery.Event from the native event object
      event = jQuery.event.fix(event || window.event);
      var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related, handlers = (jQuery._data(this, 'events') || {})[event.type] || [], delegateCount = handlers.delegateCount, args = core_slice.call(arguments), run_all = !event.exclusive && !event.namespace, special = jQuery.event.special[event.type] || {}, handlerQueue = [];
      // Use the fix-ed jQuery.Event rather than the (read-only) native event
      args[0] = event;
      event.delegateTarget = this;
      // Call the preDispatch hook for the mapped type, and let it bail if desired
      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      }
      // Determine handlers that should run if there are delegated events
      // Avoid non-left-click bubbling in Firefox (#3861)
      if (delegateCount && !(event.button && event.type === 'click')) {
        for (cur = event.target; cur != this; cur = cur.parentNode || this) {
          // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
          if (cur.disabled !== true || event.type !== 'click') {
            selMatch = {};
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector;
              if (selMatch[sel] === undefined) {
                selMatch[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (selMatch[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem: cur,
                matches: matches
              });
            }
          }
        }
      }
      // Add the remaining (directly-bound) handlers
      if (handlers.length > delegateCount) {
        handlerQueue.push({
          elem: this,
          matches: handlers.slice(delegateCount)
        });
      }
      // Run delegates first; they may want to stop propagation beneath us
      for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
        matched = handlerQueue[i];
        event.currentTarget = matched.elem;
        for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
          handleObj = matched.matches[j];
          // Triggered event must either 1) be non-exclusive and have no namespace, or
          // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
          if (run_all || !event.namespace && !handleObj.namespace || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {
            event.data = handleObj.data;
            event.handleObj = handleObj;
            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
            if (ret !== undefined) {
              event.result = ret;
              if (ret === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      // Call the postDispatch hook for the mapped type
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    // Includes some event props shared by KeyEvent and MouseEvent
    // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
    props: 'attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function (event, original) {
        // Add which for key events
        if (event.which == null) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      }
    },
    mouseHooks: {
      props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
      filter: function (event, original) {
        var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;
        // Calculate pageX/Y if missing and clientX/Y available
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }
        // Add relatedTarget, if necessary
        if (!event.relatedTarget && fromElement) {
          event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
        }
        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if (!event.which && button !== undefined) {
          event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
        }
        return event;
      }
    },
    fix: function (event) {
      if (event[jQuery.expando]) {
        return event;
      }
      // Create a writable copy of the event object and normalize some properties
      var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = jQuery.Event(originalEvent);
      for (i = copy.length; i;) {
        prop = copy[--i];
        event[prop] = originalEvent[prop];
      }
      // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
      if (!event.target) {
        event.target = originalEvent.srcElement || document;
      }
      // Target should not be a text node (#504, Safari)
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
      event.metaKey = !!event.metaKey;
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    special: {
      load: {
        // Prevent triggered image.load events from bubbling to window.load
        noBubble: true
      },
      focus: { delegateType: 'focusin' },
      blur: { delegateType: 'focusout' },
      beforeunload: {
        setup: function (data, namespaces, eventHandle) {
          // We only want to do this special case on windows
          if (jQuery.isWindow(this)) {
            this.onbeforeunload = eventHandle;
          }
        },
        teardown: function (namespaces, eventHandle) {
          if (this.onbeforeunload === eventHandle) {
            this.onbeforeunload = null;
          }
        }
      }
    },
    simulate: function (type, elem, event, bubble) {
      // Piggyback on a donor event to simulate a different one.
      // Fake originalEvent to avoid donor's stopPropagation, but if the
      // simulated event prevents default then we do the same on the donor.
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: true,
        originalEvent: {}
      });
      if (bubble) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  // Some plugins are using, but it's undocumented/deprecated and will be removed.
  // The 1.7 special event interface should provide all the hooks needed now.
  jQuery.event.handle = jQuery.event.dispatch;
  jQuery.removeEvent = document.removeEventListener ? function (elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  } : function (elem, type, handle) {
    var name = 'on' + type;
    if (elem.detachEvent) {
      // #8545, #7054, preventing memory leaks for custom events in IE6-8
      // detachEvent needed property on element, by name of that event, to properly expose it to GC
      if (typeof elem[name] === 'undefined') {
        elem[name] = null;
      }
      elem.detachEvent(name, handle);
    }
  };
  jQuery.Event = function (src, props) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    // Event object
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse;  // Event type
    } else {
      this.type = src;
    }
    // Put explicitly provided properties onto the event object
    if (props) {
      jQuery.extend(this, props);
    }
    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();
    // Mark it as fixed
    this[jQuery.expando] = true;
  };
  function returnFalse() {
    return false;
  }
  function returnTrue() {
    return true;
  }
  // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
  // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
  jQuery.Event.prototype = {
    preventDefault: function () {
      this.isDefaultPrevented = returnTrue;
      var e = this.originalEvent;
      if (!e) {
        return;
      }
      // if preventDefault exists run it on the original event
      if (e.preventDefault) {
        e.preventDefault();  // otherwise set the returnValue property of the original event to false (IE)
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation: function () {
      this.isPropagationStopped = returnTrue;
      var e = this.originalEvent;
      if (!e) {
        return;
      }
      // if stopPropagation exists run it on the original event
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      // otherwise set the cancelBubble property of the original event to true (IE)
      e.cancelBubble = true;
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
  };
  // Create mouseenter/leave events using mouseover/out and event-time checks
  jQuery.each({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function (orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function (event) {
        var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj, selector = handleObj.selector;
        // For mousenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window
        if (!related || related !== target && !jQuery.contains(target, related)) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  // IE submit delegation
  if (!jQuery.support.submitBubbles) {
    jQuery.event.special.submit = {
      setup: function () {
        // Only need this for delegated form submit events
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        // Lazy-add a submit handler when a descendant form may potentially be submitted
        jQuery.event.add(this, 'click._submit keypress._submit', function (e) {
          // Node name check avoids a VML-related crash in IE (#9807)
          var elem = e.target, form = jQuery.nodeName(elem, 'input') || jQuery.nodeName(elem, 'button') ? elem.form : undefined;
          if (form && !jQuery._data(form, '_submit_attached')) {
            jQuery.event.add(form, 'submit._submit', function (event) {
              event._submit_bubble = true;
            });
            jQuery._data(form, '_submit_attached', true);
          }
        });  // return undefined since we don't need an event listener
      },
      postDispatch: function (event) {
        // If form was submitted by the user, bubble the event up the tree
        if (event._submit_bubble) {
          delete event._submit_bubble;
          if (this.parentNode && !event.isTrigger) {
            jQuery.event.simulate('submit', this.parentNode, event, true);
          }
        }
      },
      teardown: function () {
        // Only need this for delegated form submit events
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
        jQuery.event.remove(this, '._submit');
      }
    };
  }
  // IE change delegation and checkbox/radio fix
  if (!jQuery.support.changeBubbles) {
    jQuery.event.special.change = {
      setup: function () {
        if (rformElems.test(this.nodeName)) {
          // IE doesn't fire change on a check/radio until blur; trigger it on click
          // after a propertychange. Eat the blur-change in special.change.handle.
          // This still fires onchange a second time for check/radio after blur.
          if (this.type === 'checkbox' || this.type === 'radio') {
            jQuery.event.add(this, 'propertychange._change', function (event) {
              if (event.originalEvent.propertyName === 'checked') {
                this._just_changed = true;
              }
            });
            jQuery.event.add(this, 'click._change', function (event) {
              if (this._just_changed && !event.isTrigger) {
                this._just_changed = false;
              }
              // Allow triggered, simulated change events (#11500)
              jQuery.event.simulate('change', this, event, true);
            });
          }
          return false;
        }
        // Delegated event; lazy-add a change handler on descendant inputs
        jQuery.event.add(this, 'beforeactivate._change', function (e) {
          var elem = e.target;
          if (rformElems.test(elem.nodeName) && !jQuery._data(elem, '_change_attached')) {
            jQuery.event.add(elem, 'change._change', function (event) {
              if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                jQuery.event.simulate('change', this.parentNode, event, true);
              }
            });
            jQuery._data(elem, '_change_attached', true);
          }
        });
      },
      handle: function (event) {
        var elem = event.target;
        // Swallow native change events from checkbox/radio, we already triggered them above
        if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== 'radio' && elem.type !== 'checkbox') {
          return event.handleObj.handler.apply(this, arguments);
        }
      },
      teardown: function () {
        jQuery.event.remove(this, '._change');
        return !rformElems.test(this.nodeName);
      }
    };
  }
  // Create "bubbling" focus and blur events
  if (!jQuery.support.focusinBubbles) {
    jQuery.each({
      focus: 'focusin',
      blur: 'focusout'
    }, function (orig, fix) {
      // Attach a single capturing handler while someone wants focusin/focusout
      var attaches = 0, handler = function (event) {
          jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
        };
      jQuery.event.special[fix] = {
        setup: function () {
          if (attaches++ === 0) {
            document.addEventListener(orig, handler, true);
          }
        },
        teardown: function () {
          if (--attaches === 0) {
            document.removeEventListener(orig, handler, true);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    on: function (types, selector, data, fn, one) {
      var origFn, type;
      // Types can be a map of types/handlers
      if (typeof types === 'object') {
        // ( types-Object, selector, data )
        if (typeof selector !== 'string') {
          // && selector != null
          // ( types-Object, data )
          data = data || selector;
          selector = undefined;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (data == null && fn == null) {
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === 'string') {
          // ( types, selector, fn )
          fn = data;
          data = undefined;
        } else {
          // ( types, data, fn )
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }
      if (one === 1) {
        origFn = fn;
        fn = function (event) {
          // Can use an empty set, since event contains the info
          jQuery().off(event);
          return origFn.apply(this, arguments);
        };
        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function () {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function (types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        // ( event )  dispatched jQuery.Event
        handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + '.' + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
        return this;
      }
      if (typeof types === 'object') {
        // ( types-object [, selector] )
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === 'function') {
        // ( types [, fn] )
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function () {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    bind: function (types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
      return this.off(types, null, fn);
    },
    live: function (types, data, fn) {
      jQuery(this.context).on(types, this.selector, data, fn);
      return this;
    },
    die: function (types, fn) {
      jQuery(this.context).off(types, this.selector || '**', fn);
      return this;
    },
    delegate: function (selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length === 1 ? this.off(selector, '**') : this.off(types, selector || '**', fn);
    },
    trigger: function (type, data) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function (type, data) {
      if (this[0]) {
        return jQuery.event.trigger(type, data, this[0], true);
      }
    },
    toggle: function (fn) {
      // Save reference to arguments for access in closure
      var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function (event) {
          // Figure out which function to execute
          var lastToggle = (jQuery._data(this, 'lastToggle' + fn.guid) || 0) % i;
          jQuery._data(this, 'lastToggle' + fn.guid, lastToggle + 1);
          // Make sure that clicks stop
          event.preventDefault();
          // and execute the function
          return args[lastToggle].apply(this, arguments) || false;
        };
      // link all the functions, so any of them can unbind this click handler
      toggler.guid = guid;
      while (i < args.length) {
        args[i++].guid = guid;
      }
      return this.click(toggler);
    },
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    }
  });
  jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' '), function (i, name) {
    // Handle event binding
    jQuery.fn[name] = function (data, fn) {
      if (fn == null) {
        fn = data;
        data = null;
      }
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
    if (rkeyEvent.test(name)) {
      jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
    }
    if (rmouseEvent.test(name)) {
      jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
    }
  });
  /*!
   * Sizzle CSS Selector Engine
   * Copyright 2012 jQuery Foundation and other contributors
   * Released under the MIT license
   * http://sizzlejs.com/
   */
  (function (window, undefined) {
    var cachedruns, assertGetIdNotName, Expr, getText, isXML, contains, compile, sortOrder, hasDuplicate, outermostContext, baseHasDuplicate = true, strundefined = 'undefined', expando = ('sizcache' + Math.random()).replace('.', ''), Token = String, document = window.document, docElem = document.documentElement, dirruns = 0, done = 0, pop = [].pop, push = [].push, slice = [].slice,
      // Use a stripped-down indexOf if a native one is unavailable
      indexOf = [].indexOf || function (elem) {
        var i = 0, len = this.length;
        for (; i < len; i++) {
          if (this[i] === elem) {
            return i;
          }
        }
        return -1;
      },
      // Augment a function for special use by Sizzle
      markFunction = function (fn, value) {
        fn[expando] = value == null || value;
        return fn;
      }, createCache = function () {
        var cache = {}, keys = [];
        return markFunction(function (key, value) {
          // Only keep the most recent entries
          if (keys.push(key) > Expr.cacheLength) {
            delete cache[keys.shift()];
          }
          // Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
          return cache[key + ' '] = value;
        }, cache);
      }, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(),
      // Regex
      // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
      whitespace = '[\\x20\\t\\r\\n\\f]',
      // http://www.w3.org/TR/css3-syntax/#characters
      characterEncoding = '(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+',
      // Loosely modeled on CSS identifier characters
      // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
      // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
      identifier = characterEncoding.replace('w', 'w#'),
      // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
      operators = '([*^$|!~]?=)', attributes = '\\[' + whitespace + '*(' + characterEncoding + ')' + whitespace + '*(?:' + operators + whitespace + '*(?:([\'"])((?:\\\\.|[^\\\\])*?)\\3|(' + identifier + ')|)|)' + whitespace + '*\\]',
      // Prefer arguments not in parens/brackets,
      //   then attribute selectors and non-pseudos (denoted by :),
      //   then anything else
      // These preferences are here to reduce the number of selectors
      //   needing tokenize in the PSEUDO preFilter
      pseudos = ':(' + characterEncoding + ')(?:\\((?:([\'"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:' + attributes + ')|[^:]|\\\\.)*|.*))\\)|)',
      // For matchExpr.POS and matchExpr.needsContext
      pos = ':(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)',
      // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
      rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([\\x20\\t\\r\\n\\f>+~])' + whitespace + '*'), rpseudo = new RegExp(pseudos),
      // Easily-parseable/retrievable ID or TAG or CLASS selectors
      rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, rnot = /^:not/, rsibling = /[\x20\t\r\n\f]*[+~]/, rendsWithNot = /:not\($/, rheader = /h\d/i, rinputs = /input|select|textarea|button/i, rbackslash = /\\(?!\\)/g, matchExpr = {
        'ID': new RegExp('^#(' + characterEncoding + ')'),
        'CLASS': new RegExp('^\\.(' + characterEncoding + ')'),
        'NAME': new RegExp('^\\[name=[\'"]?(' + characterEncoding + ')[\'"]?\\]'),
        'TAG': new RegExp('^(' + characterEncoding.replace('w', 'w*') + ')'),
        'ATTR': new RegExp('^' + attributes),
        'PSEUDO': new RegExp('^' + pseudos),
        'POS': new RegExp(pos, 'i'),
        'CHILD': new RegExp('^:(only|nth|first|last)-child(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
        // For use in libraries implementing .is()
        'needsContext': new RegExp('^' + whitespace + '*[>+~]|' + pos, 'i')
      },
      // Support
      // Used for testing something on an element
      assert = function (fn) {
        var div = document.createElement('div');
        try {
          return fn(div);
        } catch (e) {
          return false;
        } finally {
          // release memory in IE
          div = null;
        }
      },
      // Check if getElementsByTagName("*") returns only elements
      assertTagNameNoComments = assert(function (div) {
        div.appendChild(document.createComment(''));
        return !div.getElementsByTagName('*').length;
      }),
      // Check if getAttribute returns normalized href attributes
      assertHrefNotNormalized = assert(function (div) {
        div.innerHTML = '<a href=\'#\'></a>';
        return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute('href') === '#';
      }),
      // Check if attributes should be retrieved by attribute nodes
      assertAttributes = assert(function (div) {
        div.innerHTML = '<select></select>';
        var type = typeof div.lastChild.getAttribute('multiple');
        // IE8 returns a string for some attributes even when not present
        return type !== 'boolean' && type !== 'string';
      }),
      // Check if getElementsByClassName can be trusted
      assertUsableClassName = assert(function (div) {
        // Opera can't find a second classname (in 9.6)
        div.innerHTML = '<div class=\'hidden e\'></div><div class=\'hidden\'></div>';
        if (!div.getElementsByClassName || !div.getElementsByClassName('e').length) {
          return false;
        }
        // Safari 3.2 caches class attributes and doesn't catch changes
        div.lastChild.className = 'e';
        return div.getElementsByClassName('e').length === 2;
      }),
      // Check if getElementById returns elements by name
      // Check if getElementsByName privileges form controls or returns elements by ID
      assertUsableName = assert(function (div) {
        // Inject content
        div.id = expando + 0;
        div.innerHTML = '<a name=\'' + expando + '\'></a><div name=\'' + expando + '\'></div>';
        docElem.insertBefore(div, docElem.firstChild);
        // Test
        var pass = document.getElementsByName && // buggy browsers will return fewer than the correct 2
        document.getElementsByName(expando).length === 2 + // buggy browsers will return more than the correct 0
        document.getElementsByName(expando + 0).length;
        assertGetIdNotName = !document.getElementById(expando);
        // Cleanup
        docElem.removeChild(div);
        return pass;
      });
    // If slice is not available, provide a backup
    try {
      slice.call(docElem.childNodes, 0)[0].nodeType;
    } catch (e) {
      slice = function (i) {
        var elem, results = [];
        for (; elem = this[i]; i++) {
          results.push(elem);
        }
        return results;
      };
    }
    function Sizzle(selector, context, results, seed) {
      results = results || [];
      context = context || document;
      var match, elem, xml, m, nodeType = context.nodeType;
      if (!selector || typeof selector !== 'string') {
        return results;
      }
      if (nodeType !== 1 && nodeType !== 9) {
        return [];
      }
      xml = isXML(context);
      if (!xml && !seed) {
        if (match = rquickExpr.exec(selector)) {
          // Speed-up: Sizzle("#ID")
          if (m = match[1]) {
            if (nodeType === 9) {
              elem = context.getElementById(m);
              // Check parentNode to catch when Blackberry 4.6 returns
              // nodes that are no longer in the document #6963
              if (elem && elem.parentNode) {
                // Handle the case where IE, Opera, and Webkit return items
                // by name instead of ID
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              }
            } else {
              // Context is not a document
              if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            }  // Speed-up: Sizzle("TAG")
          } else if (match[2]) {
            push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
            return results;  // Speed-up: Sizzle(".CLASS")
          } else if ((m = match[3]) && assertUsableClassName && context.getElementsByClassName) {
            push.apply(results, slice.call(context.getElementsByClassName(m), 0));
            return results;
          }
        }
      }
      // All others
      return select(selector.replace(rtrim, '$1'), context, results, seed, xml);
    }
    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function (elem, expr) {
      return Sizzle(expr, null, null, [elem]).length > 0;
    };
    // Returns a function to use in pseudos for input types
    function createInputPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return name === 'input' && elem.type === type;
      };
    }
    // Returns a function to use in pseudos for buttons
    function createButtonPseudo(type) {
      return function (elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === 'input' || name === 'button') && elem.type === type;
      };
    }
    // Returns a function to use in pseudos for positionals
    function createPositionalPseudo(fn) {
      return markFunction(function (argument) {
        argument = +argument;
        return markFunction(function (seed, matches) {
          var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
          // Match elements found at the specified indexes
          while (i--) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function (elem) {
      var node, ret = '', i = 0, nodeType = elem.nodeType;
      if (nodeType) {
        if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
          // Use textContent for elements
          // innerText usage removed for consistency of new lines (see #11153)
          if (typeof elem.textContent === 'string') {
            return elem.textContent;
          } else {
            // Traverse its children
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText(elem);
            }
          }
        } else if (nodeType === 3 || nodeType === 4) {
          return elem.nodeValue;
        }  // Do not include comment or processing instruction nodes
      } else {
        // If no nodeType, this is expected to be an array
        for (; node = elem[i]; i++) {
          // Do not traverse comment nodes
          ret += getText(node);
        }
      }
      return ret;
    };
    isXML = Sizzle.isXML = function (elem) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== 'HTML' : false;
    };
    // Element contains another
    contains = Sizzle.contains = docElem.contains ? function (a, b) {
      var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
      return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
    } : docElem.compareDocumentPosition ? function (a, b) {
      return b && !!(a.compareDocumentPosition(b) & 16);
    } : function (a, b) {
      while (b = b.parentNode) {
        if (b === a) {
          return true;
        }
      }
      return false;
    };
    Sizzle.attr = function (elem, name) {
      var val, xml = isXML(elem);
      if (!xml) {
        name = name.toLowerCase();
      }
      if (val = Expr.attrHandle[name]) {
        return val(elem);
      }
      if (xml || assertAttributes) {
        return elem.getAttribute(name);
      }
      val = elem.getAttributeNode(name);
      return val ? typeof elem[name] === 'boolean' ? elem[name] ? name : null : val.specified ? val.value : null : null;
    };
    Expr = Sizzle.selectors = {
      // Can be adjusted by the user
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      // IE6/7 return a modified href
      attrHandle: assertHrefNotNormalized ? {} : {
        'href': function (elem) {
          return elem.getAttribute('href', 2);
        },
        'type': function (elem) {
          return elem.getAttribute('type');
        }
      },
      find: {
        'ID': assertGetIdNotName ? function (id, context, xml) {
          if (typeof context.getElementById !== strundefined && !xml) {
            var m = context.getElementById(id);
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            return m && m.parentNode ? [m] : [];
          }
        } : function (id, context, xml) {
          if (typeof context.getElementById !== strundefined && !xml) {
            var m = context.getElementById(id);
            return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode('id').value === id ? [m] : undefined : [];
          }
        },
        'TAG': assertTagNameNoComments ? function (tag, context) {
          if (typeof context.getElementsByTagName !== strundefined) {
            return context.getElementsByTagName(tag);
          }
        } : function (tag, context) {
          var results = context.getElementsByTagName(tag);
          // Filter out possible comments
          if (tag === '*') {
            var elem, tmp = [], i = 0;
            for (; elem = results[i]; i++) {
              if (elem.nodeType === 1) {
                tmp.push(elem);
              }
            }
            return tmp;
          }
          return results;
        },
        'NAME': assertUsableName && function (tag, context) {
          if (typeof context.getElementsByName !== strundefined) {
            return context.getElementsByName(name);
          }
        },
        'CLASS': assertUsableClassName && function (className, context, xml) {
          if (typeof context.getElementsByClassName !== strundefined && !xml) {
            return context.getElementsByClassName(className);
          }
        }
      },
      relative: {
        '>': {
          dir: 'parentNode',
          first: true
        },
        ' ': { dir: 'parentNode' },
        '+': {
          dir: 'previousSibling',
          first: true
        },
        '~': { dir: 'previousSibling' }
      },
      preFilter: {
        'ATTR': function (match) {
          match[1] = match[1].replace(rbackslash, '');
          // Move the given value to match[3] whether quoted or unquoted
          match[3] = (match[4] || match[5] || '').replace(rbackslash, '');
          if (match[2] === '~=') {
            match[3] = ' ' + match[3] + ' ';
          }
          return match.slice(0, 4);
        },
        'CHILD': function (match) {
          /* matches from matchExpr["CHILD"]
          		1 type (only|nth|...)
          		2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
          		3 xn-component of xn+y argument ([+-]?\d*n|)
          		4 sign of xn-component
          		5 x of xn-component
          		6 sign of y-component
          		7 y of y-component
          	*/
          match[1] = match[1].toLowerCase();
          if (match[1] === 'nth') {
            // nth-child requires argument
            if (!match[2]) {
              Sizzle.error(match[0]);
            }
            // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1
            match[3] = +(match[3] ? match[4] + (match[5] || 1) : 2 * (match[2] === 'even' || match[2] === 'odd'));
            match[4] = +(match[6] + match[7] || match[2] === 'odd');  // other types prohibit arguments
          } else if (match[2]) {
            Sizzle.error(match[0]);
          }
          return match;
        },
        'PSEUDO': function (match) {
          var unquoted, excess;
          if (matchExpr['CHILD'].test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[3];
          } else if (unquoted = match[4]) {
            // Only check arguments that contain a pseudo
            if (rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
              // excess is a negative index
              unquoted = unquoted.slice(0, excess);
              match[0] = match[0].slice(0, excess);
            }
            match[2] = unquoted;
          }
          // Return only captures needed by the pseudo filter method (type and argument)
          return match.slice(0, 3);
        }
      },
      filter: {
        'ID': assertGetIdNotName ? function (id) {
          id = id.replace(rbackslash, '');
          return function (elem) {
            return elem.getAttribute('id') === id;
          };
        } : function (id) {
          id = id.replace(rbackslash, '');
          return function (elem) {
            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode('id');
            return node && node.value === id;
          };
        },
        'TAG': function (nodeName) {
          if (nodeName === '*') {
            return function () {
              return true;
            };
          }
          nodeName = nodeName.replace(rbackslash, '').toLowerCase();
          return function (elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        'CLASS': function (className) {
          var pattern = classCache[expando][className + ' '];
          return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
            return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || '');
          });
        },
        'ATTR': function (name, operator, check) {
          return function (elem, context) {
            var result = Sizzle.attr(elem, name);
            if (result == null) {
              return operator === '!=';
            }
            if (!operator) {
              return true;
            }
            result += '';
            return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.substr(result.length - check.length) === check : operator === '~=' ? (' ' + result + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.substr(0, check.length + 1) === check + '-' : false;
          };
        },
        'CHILD': function (type, argument, first, last) {
          if (type === 'nth') {
            return function (elem) {
              var node, diff, parent = elem.parentNode;
              if (first === 1 && last === 0) {
                return true;
              }
              if (parent) {
                diff = 0;
                for (node = parent.firstChild; node; node = node.nextSibling) {
                  if (node.nodeType === 1) {
                    diff++;
                    if (elem === node) {
                      break;
                    }
                  }
                }
              }
              // Incorporate the offset (or cast to NaN), then check against cycle size
              diff -= last;
              return diff === first || diff % first === 0 && diff / first >= 0;
            };
          }
          return function (elem) {
            var node = elem;
            switch (type) {
            case 'only':
            case 'first':
              while (node = node.previousSibling) {
                if (node.nodeType === 1) {
                  return false;
                }
              }
              if (type === 'first') {
                return true;
              }
              node = elem;
            /* falls through */
            case 'last':
              while (node = node.nextSibling) {
                if (node.nodeType === 1) {
                  return false;
                }
              }
              return true;
            }
          };
        },
        'PSEUDO': function (pseudo, argument) {
          // pseudo-class names are case-insensitive
          // http://www.w3.org/TR/selectors/#pseudo-classes
          // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
          // Remember that setFilters inherits from pseudos
          var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error('unsupported pseudo: ' + pseudo);
          // The user may use createPseudo to indicate that
          // arguments are needed to create the filter function
          // just as Sizzle does
          if (fn[expando]) {
            return fn(argument);
          }
          // But maintain support for old signatures
          if (fn.length > 1) {
            args = [
              pseudo,
              pseudo,
              '',
              argument
            ];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
              var idx, matched = fn(seed, argument), i = matched.length;
              while (i--) {
                idx = indexOf.call(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function (elem) {
              return fn(elem, 0, args);
            };
          }
          return fn;
        }
      },
      pseudos: {
        'not': markFunction(function (selector) {
          // Trim the selector passed to compile
          // to avoid treating leading and trailing
          // spaces as combinators
          var input = [], results = [], matcher = compile(selector.replace(rtrim, '$1'));
          return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
            var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
            // Match elements unmatched by `matcher`
            while (i--) {
              if (elem = unmatched[i]) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function (elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results);
            return !results.pop();
          };
        }),
        'has': markFunction(function (selector) {
          return function (elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        'contains': markFunction(function (text) {
          return function (elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        'enabled': function (elem) {
          return elem.disabled === false;
        },
        'disabled': function (elem) {
          return elem.disabled === true;
        },
        'checked': function (elem) {
          // In CSS3, :checked should return both checked and selected elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          var nodeName = elem.nodeName.toLowerCase();
          return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
        },
        'selected': function (elem) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        'parent': function (elem) {
          return !Expr.pseudos['empty'](elem);
        },
        'empty': function (elem) {
          // http://www.w3.org/TR/selectors/#empty-pseudo
          // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
          //   not comment, processing instructions, or others
          // Thanks to Diego Perini for the nodeName shortcut
          //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
          var nodeType;
          elem = elem.firstChild;
          while (elem) {
            if (elem.nodeName > '@' || (nodeType = elem.nodeType) === 3 || nodeType === 4) {
              return false;
            }
            elem = elem.nextSibling;
          }
          return true;
        },
        'header': function (elem) {
          return rheader.test(elem.nodeName);
        },
        'text': function (elem) {
          var type, attr;
          // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
          // use getAttribute instead to test this case
          return elem.nodeName.toLowerCase() === 'input' && (type = elem.type) === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === type);
        },
        // Input types
        'radio': createInputPseudo('radio'),
        'checkbox': createInputPseudo('checkbox'),
        'file': createInputPseudo('file'),
        'password': createInputPseudo('password'),
        'image': createInputPseudo('image'),
        'submit': createButtonPseudo('submit'),
        'reset': createButtonPseudo('reset'),
        'button': function (elem) {
          var name = elem.nodeName.toLowerCase();
          return name === 'input' && elem.type === 'button' || name === 'button';
        },
        'input': function (elem) {
          return rinputs.test(elem.nodeName);
        },
        'focus': function (elem) {
          var doc = elem.ownerDocument;
          return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        'active': function (elem) {
          return elem === elem.ownerDocument.activeElement;
        },
        // Positional types
        'first': createPositionalPseudo(function () {
          return [0];
        }),
        'last': createPositionalPseudo(function (matchIndexes, length) {
          return [length - 1];
        }),
        'eq': createPositionalPseudo(function (matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        'even': createPositionalPseudo(function (matchIndexes, length) {
          for (var i = 0; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        'odd': createPositionalPseudo(function (matchIndexes, length) {
          for (var i = 1; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        'lt': createPositionalPseudo(function (matchIndexes, length, argument) {
          for (var i = argument < 0 ? argument + length : argument; --i >= 0;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        'gt': createPositionalPseudo(function (matchIndexes, length, argument) {
          for (var i = argument < 0 ? argument + length : argument; ++i < length;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        })
      }
    };
    function siblingCheck(a, b, ret) {
      if (a === b) {
        return ret;
      }
      var cur = a.nextSibling;
      while (cur) {
        if (cur === b) {
          return -1;
        }
        cur = cur.nextSibling;
      }
      return 1;
    }
    sortOrder = docElem.compareDocumentPosition ? function (a, b) {
      if (a === b) {
        hasDuplicate = true;
        return 0;
      }
      return (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1;
    } : function (a, b) {
      // The nodes are identical, we can exit early
      if (a === b) {
        hasDuplicate = true;
        return 0;  // Fallback to using sourceIndex (in IE) if it's available on both nodes
      } else if (a.sourceIndex && b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex;
      }
      var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;
      // If the nodes are siblings (or identical) we can do a quick check
      if (aup === bup) {
        return siblingCheck(a, b);  // If no parents were found then the nodes are disconnected
      } else if (!aup) {
        return -1;
      } else if (!bup) {
        return 1;
      }
      // Otherwise they're somewhere else in the tree so we need
      // to build up a full list of the parentNodes for comparison
      while (cur) {
        ap.unshift(cur);
        cur = cur.parentNode;
      }
      cur = bup;
      while (cur) {
        bp.unshift(cur);
        cur = cur.parentNode;
      }
      al = ap.length;
      bl = bp.length;
      // Start walking down the tree looking for a discrepancy
      for (var i = 0; i < al && i < bl; i++) {
        if (ap[i] !== bp[i]) {
          return siblingCheck(ap[i], bp[i]);
        }
      }
      // We ended someplace up the tree so do a sibling check
      return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
    };
    // Always assume the presence of duplicates if sort doesn't
    // pass them to our comparison function (as in Google Chrome).
    [
      0,
      0
    ].sort(sortOrder);
    baseHasDuplicate = !hasDuplicate;
    // Document sorting and removing duplicates
    Sizzle.uniqueSort = function (results) {
      var elem, duplicates = [], i = 1, j = 0;
      hasDuplicate = baseHasDuplicate;
      results.sort(sortOrder);
      if (hasDuplicate) {
        for (; elem = results[i]; i++) {
          if (elem === results[i - 1]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      return results;
    };
    Sizzle.error = function (msg) {
      throw new Error('Syntax error, unrecognized expression: ' + msg);
    };
    function tokenize(selector, parseOnly) {
      var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[expando][selector + ' '];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;
      while (soFar) {
        // Comma and first run
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            // Don't consume trailing commas as valid
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        matched = false;
        // Combinators
        if (match = rcombinators.exec(soFar)) {
          tokens.push(matched = new Token(match.shift()));
          soFar = soFar.slice(matched.length);
          // Cast descendant combinators to space
          matched.type = match[0].replace(rtrim, ' ');
        }
        // Filters
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            tokens.push(matched = new Token(match.shift()));
            soFar = soFar.slice(matched.length);
            matched.type = type;
            matched.matches = match;
          }
        }
        if (!matched) {
          break;
        }
      }
      // Return the length of the invalid excess
      // if we're just parsing
      // Otherwise, throw an error or return tokens
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
      tokenCache(selector, groups).slice(0);
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir, checkNonElements = base && combinator.dir === 'parentNode', doneName = done++;
      return combinator.first ? // Check against closest ancestor/preceding element
      function (elem, context, xml) {
        while (elem = elem[dir]) {
          if (checkNonElements || elem.nodeType === 1) {
            return matcher(elem, context, xml);
          }
        }
      } : // Check against all ancestor/preceding elements
      function (elem, context, xml) {
        // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
        if (!xml) {
          var cache, dirkey = dirruns + ' ' + doneName + ' ', cachedkey = dirkey + cachedruns;
          while (elem = elem[dir]) {
            if (checkNonElements || elem.nodeType === 1) {
              if ((cache = elem[expando]) === cachedkey) {
                return elem.sizset;
              } else if (typeof cache === 'string' && cache.indexOf(dirkey) === 0) {
                if (elem.sizset) {
                  return elem;
                }
              } else {
                elem[expando] = cachedkey;
                if (matcher(elem, context, xml)) {
                  elem.sizset = true;
                  return elem;
                }
                elem.sizset = false;
              }
            }
          }
        } else {
          while (elem = elem[dir]) {
            if (checkNonElements || elem.nodeType === 1) {
              if (matcher(elem, context, xml)) {
                return elem;
              }
            }
          }
        }
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function (elem, context, xml) {
        var i = matchers.length;
        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
      for (; i < len; i++) {
        if (elem = unmatched[i]) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function (seed, results, context, xml) {
        var temp, i, elem, preMap = [], postMap = [], preexisting = results.length,
          // Get initial elements from seed or context
          elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []),
          // Prefilter to get matcher input, preserving a map for seed-results synchronization
          matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
          postFinder || (seed ? preFilter : preexisting || postFilter) ? // ...intermediate processing is necessary
          [] : // ...otherwise use results directly
          results : matcherIn;
        // Find primary matches
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }
        // Apply postFilter
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          // Un-match failing elements by moving them back to matcherIn
          i = temp.length;
          while (i--) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              // Get the final matcherOut by condensing this intermediate into postFinder contexts
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if (elem = matcherOut[i]) {
                  // Restore matcherIn since elem is not yet a final match
                  temp.push(matcherIn[i] = elem);
                }
              }
              postFinder(null, matcherOut = [], temp, xml);
            }
            // Move matched elements from seed to results to keep them synchronized
            i = matcherOut.length;
            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          }  // Add elements to results, through postFinder if defined
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0,
        // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator(function (elem) {
          return elem === checkContext;
        }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
          return indexOf.call(checkContext, elem) > -1;
        }, implicitRelative, true), matchers = [function (elem, context, xml) {
            return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
          }];
      for (; i < len; i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          // Return special upon seeing a positional matcher
          if (matcher[expando]) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && tokens.slice(0, i - 1).join('').replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && tokens.join(''));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, expandContext) {
          var elem, j, matcher, setMatched = [], matchedCount = 0, i = '0', unmatched = seed && [], outermost = expandContext != null, contextBackup = outermostContext,
            // We must always have either seed elements or context
            elems = seed || byElement && Expr.find['TAG']('*', expandContext && context.parentNode || context),
            // Nested matchers should use non-integer dirruns
            dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.E;
          if (outermost) {
            outermostContext = context !== document && context;
            cachedruns = superMatcher.el;
          }
          // Add elements passing elementMatchers directly to results
          for (; (elem = elems[i]) != null; i++) {
            if (byElement && elem) {
              for (j = 0; matcher = elementMatchers[j]; j++) {
                if (matcher(elem, context, xml)) {
                  results.push(elem);
                  break;
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                cachedruns = ++superMatcher.el;
              }
            }
            // Track unmatched elements for set filters
            if (bySet) {
              // They will have gone through all possible matchers
              if (elem = !matcher && elem) {
                matchedCount--;
              }
              // Lengthen the array for every element, matched or not
              if (seed) {
                unmatched.push(elem);
              }
            }
          }
          // Apply set filters to unmatched elements
          matchedCount += i;
          if (bySet && i !== matchedCount) {
            for (j = 0; matcher = setMatchers[j]; j++) {
              matcher(unmatched, setMatched, context, xml);
            }
            if (seed) {
              // Reintegrate element matches to eliminate the need for sorting
              if (matchedCount > 0) {
                while (i--) {
                  if (!(unmatched[i] || setMatched[i])) {
                    setMatched[i] = pop.call(results);
                  }
                }
              }
              // Discard index placeholder values to get only actual matches
              setMatched = condense(setMatched);
            }
            // Add matches to results
            push.apply(results, setMatched);
            // Seedless set matches succeeding multiple successful matchers stipulate sorting
            if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
              Sizzle.uniqueSort(results);
            }
          }
          // Override manipulation of globals by nested matchers
          if (outermost) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }
          return unmatched;
        };
      superMatcher.el = 0;
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    compile = Sizzle.compile = function (selector, group) {
      var i, setMatchers = [], elementMatchers = [], cached = compilerCache[expando][selector + ' '];
      if (!cached) {
        // Generate a function of recursive functions that can be used to check each element
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        while (i--) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        // Cache the compiled function
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
      }
      return cached;
    };
    function multipleContexts(selector, contexts, results) {
      var i = 0, len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function select(selector, context, results, seed, xml) {
      var i, tokens, token, type, find, match = tokenize(selector), j = match.length;
      if (!seed) {
        // Try to minimize operations if there is only one group
        if (match.length === 1) {
          // Take a shortcut and set the context if the root selector is an ID
          tokens = match[0] = match[0].slice(0);
          if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && context.nodeType === 9 && !xml && Expr.relative[tokens[1].type]) {
            context = Expr.find['ID'](token.matches[0].replace(rbackslash, ''), context, xml)[0];
            if (!context) {
              return results;
            }
            selector = selector.slice(tokens.shift().length);
          }
          // Fetch a seed set for right-to-left matching
          for (i = matchExpr['POS'].test(selector) ? -1 : tokens.length - 1; i >= 0; i--) {
            token = tokens[i];
            // Abort if we hit a combinator
            if (Expr.relative[type = token.type]) {
              break;
            }
            if (find = Expr.find[type]) {
              // Search, expanding context for leading sibling combinators
              if (seed = find(token.matches[0].replace(rbackslash, ''), rsibling.test(tokens[0].type) && context.parentNode || context, xml)) {
                // If seed is empty or no tokens remain, we can return early
                tokens.splice(i, 1);
                selector = seed.length && tokens.join('');
                if (!selector) {
                  push.apply(results, slice.call(seed, 0));
                  return results;
                }
                break;
              }
            }
          }
        }
      }
      // Compile and execute a filtering function
      // Provide `match` to avoid retokenization if we modified the selector above
      compile(selector, match)(seed, context, xml, results, rsibling.test(selector));
      return results;
    }
    if (document.querySelectorAll) {
      (function () {
        var disconnectedMatch, oldSelect = select, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
          // qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
          // A support test would require too much code (would include document ready)
          rbuggyQSA = [':focus'],
          // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
          // A support test would require too much code (would include document ready)
          // just skip matchesSelector for :active
          rbuggyMatches = [':active'], matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function (div) {
          // Select is set to empty string on purpose
          // This is to test IE's treatment of not explictly
          // setting a boolean content attribute,
          // since its presence should be enough
          // http://bugs.jquery.com/ticket/12359
          div.innerHTML = '<select><option selected=\'\'></option></select>';
          // IE8 - Some boolean attributes are not treated correctly
          if (!div.querySelectorAll('[selected]').length) {
            rbuggyQSA.push('\\[' + whitespace + '*(?:checked|disabled|ismap|multiple|readonly|selected|value)');
          }
          // Webkit/Opera - :checked should return selected option elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          // IE8 throws error here (do not put tests after this one)
          if (!div.querySelectorAll(':checked').length) {
            rbuggyQSA.push(':checked');
          }
        });
        assert(function (div) {
          // Opera 10-12/IE9 - ^= $= *= and empty values
          // Should not select anything
          div.innerHTML = '<p test=\'\'></p>';
          if (div.querySelectorAll('[test^=\'\']').length) {
            rbuggyQSA.push('[*^$]=' + whitespace + '*(?:""|\'\')');
          }
          // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
          // IE8 throws error here (do not put tests after this one)
          div.innerHTML = '<input type=\'hidden\'/>';
          if (!div.querySelectorAll(':enabled').length) {
            rbuggyQSA.push(':enabled', ':disabled');
          }
        });
        // rbuggyQSA always contains :focus, so no need for a length check
        rbuggyQSA = /* rbuggyQSA.length && */
        new RegExp(rbuggyQSA.join('|'));
        select = function (selector, context, results, seed, xml) {
          // Only use querySelectorAll when not filtering,
          // when this is not xml,
          // and when no QSA bugs apply
          if (!seed && !xml && !rbuggyQSA.test(selector)) {
            var groups, i, old = true, nid = expando, newContext = context, newSelector = context.nodeType === 9 && selector;
            // qSA works strangely on Element-rooted queries
            // We can work around this by specifying an extra ID on the root
            // and working up from there (Thanks to Andrew Dupont for the technique)
            // IE 8 doesn't work on object elements
            if (context.nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
              groups = tokenize(selector);
              if (old = context.getAttribute('id')) {
                nid = old.replace(rescape, '\\$&');
              } else {
                context.setAttribute('id', nid);
              }
              nid = '[id=\'' + nid + '\'] ';
              i = groups.length;
              while (i--) {
                groups[i] = nid + groups[i].join('');
              }
              newContext = rsibling.test(selector) && context.parentNode || context;
              newSelector = groups.join(',');
            }
            if (newSelector) {
              try {
                push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0));
                return results;
              } catch (qsaError) {
              } finally {
                if (!old) {
                  context.removeAttribute('id');
                }
              }
            }
          }
          return oldSelect(selector, context, results, seed, xml);
        };
        if (matches) {
          assert(function (div) {
            // Check to see if it's possible to do matchesSelector
            // on a disconnected node (IE 9)
            disconnectedMatch = matches.call(div, 'div');
            // This should fail with an exception
            // Gecko does not error, returns false instead
            try {
              matches.call(div, '[test!=\'\']:sizzle');
              rbuggyMatches.push('!=', pseudos);
            } catch (e) {
            }
          });
          // rbuggyMatches always contains :active and :focus, so no need for a length check
          rbuggyMatches = /* rbuggyMatches.length && */
          new RegExp(rbuggyMatches.join('|'));
          Sizzle.matchesSelector = function (elem, expr) {
            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, '=\'$1\']');
            // rbuggyMatches always contains :active, so no need for an existence check
            if (!isXML(elem) && !rbuggyMatches.test(expr) && !rbuggyQSA.test(expr)) {
              try {
                var ret = matches.call(elem, expr);
                // IE 9's matchesSelector returns false on disconnected nodes
                if (ret || disconnectedMatch || // As well, disconnected nodes are said to be in a document
                  // fragment in IE 9
                  elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
              }
            }
            return Sizzle(expr, null, null, [elem]).length > 0;
          };
        }
      }());
    }
    // Deprecated
    Expr.pseudos['nth'] = Expr.pseudos['eq'];
    // Back-compat
    function setFilters() {
    }
    Expr.filters = setFilters.prototype = Expr.pseudos;
    Expr.setFilters = new setFilters();
    // Override sizzle attribute retrieval
    Sizzle.attr = jQuery.attr;
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[':'] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
  }(window));
  var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext,
    // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
  jQuery.fn.extend({
    find: function (selector) {
      var i, l, length, n, r, ret, self = this;
      if (typeof selector !== 'string') {
        return jQuery(selector).filter(function () {
          for (i = 0, l = self.length; i < l; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        });
      }
      ret = this.pushStack('', 'find', selector);
      for (i = 0, l = this.length; i < l; i++) {
        length = ret.length;
        jQuery.find(selector, this[i], ret);
        if (i > 0) {
          // Make sure that the results are unique
          for (n = length; n < ret.length; n++) {
            for (r = 0; r < length; r++) {
              if (ret[r] === ret[n]) {
                ret.splice(n--, 1);
                break;
              }
            }
          }
        }
      }
      return ret;
    },
    has: function (target) {
      var i, targets = jQuery(target, this), len = targets.length;
      return this.filter(function () {
        for (i = 0; i < len; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    not: function (selector) {
      return this.pushStack(winnow(this, selector, false), 'not', selector);
    },
    filter: function (selector) {
      return this.pushStack(winnow(this, selector, true), 'filter', selector);
    },
    is: function (selector) {
      return !!selector && (typeof selector === 'string' ? // If this is a positional/relative selector, check membership in the returned set
      // so $("p:first").is("p:last") won't return true for a doc with two "p".
      rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
    },
    closest: function (selectors, context) {
      var cur, i = 0, l = this.length, ret = [], pos = rneedsContext.test(selectors) || typeof selectors !== 'string' ? jQuery(selectors, context || this.context) : 0;
      for (; i < l; i++) {
        cur = this[i];
        while (cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11) {
          if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
            ret.push(cur);
            break;
          }
          cur = cur.parentNode;
        }
      }
      ret = ret.length > 1 ? jQuery.unique(ret) : ret;
      return this.pushStack(ret, 'closest', selectors);
    },
    // Determine the position of an element within
    // the matched set of elements
    index: function (elem) {
      // No argument, return index in parent
      if (!elem) {
        return this[0] && this[0].parentNode ? this.prevAll().length : -1;
      }
      // index in selector
      if (typeof elem === 'string') {
        return jQuery.inArray(this[0], jQuery(elem));
      }
      // Locate the position of the desired element
      return jQuery.inArray(// If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this);
    },
    add: function (selector, context) {
      var set = typeof selector === 'string' ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), all = jQuery.merge(this.get(), set);
      return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
    },
    addBack: function (selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }
  });
  jQuery.fn.andSelf = jQuery.fn.addBack;
  // A painfully simple check to see if an element is disconnected
  // from a document (should be improved, where feasible).
  function isDisconnected(node) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
  }
  function sibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && cur.nodeType !== 1);
    return cur;
  }
  jQuery.each({
    parent: function (elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function (elem) {
      return jQuery.dir(elem, 'parentNode');
    },
    parentsUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'parentNode', until);
    },
    next: function (elem) {
      return sibling(elem, 'nextSibling');
    },
    prev: function (elem) {
      return sibling(elem, 'previousSibling');
    },
    nextAll: function (elem) {
      return jQuery.dir(elem, 'nextSibling');
    },
    prevAll: function (elem) {
      return jQuery.dir(elem, 'previousSibling');
    },
    nextUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'nextSibling', until);
    },
    prevUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'previousSibling', until);
    },
    siblings: function (elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    children: function (elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents: function (elem) {
      return jQuery.nodeName(elem, 'iframe') ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function (name, fn) {
    jQuery.fn[name] = function (until, selector) {
      var ret = jQuery.map(this, fn, until);
      if (!runtil.test(name)) {
        selector = until;
      }
      if (selector && typeof selector === 'string') {
        ret = jQuery.filter(selector, ret);
      }
      ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
      if (this.length > 1 && rparentsprev.test(name)) {
        ret = ret.reverse();
      }
      return this.pushStack(ret, name, core_slice.call(arguments).join(','));
    };
  });
  jQuery.extend({
    filter: function (expr, elems, not) {
      if (not) {
        expr = ':not(' + expr + ')';
      }
      return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems);
    },
    dir: function (elem, dir, until) {
      var matched = [], cur = elem[dir];
      while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
        if (cur.nodeType === 1) {
          matched.push(cur);
        }
        cur = cur[dir];
      }
      return matched;
    },
    sibling: function (n, elem) {
      var r = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }
      return r;
    }
  });
  // Implement the identical functionality for filter and not
  function winnow(elements, qualifier, keep) {
    // Can't pass null or undefined to indexOf in Firefox 4
    // Set to 0 to skip string check
    qualifier = qualifier || 0;
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function (elem, i) {
        var retVal = !!qualifier.call(elem, i, elem);
        return retVal === keep;
      });
    } else if (qualifier.nodeType) {
      return jQuery.grep(elements, function (elem, i) {
        return elem === qualifier === keep;
      });
    } else if (typeof qualifier === 'string') {
      var filtered = jQuery.grep(elements, function (elem) {
        return elem.nodeType === 1;
      });
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, filtered, !keep);
      } else {
        qualifier = jQuery.filter(qualifier, filtered);
      }
    }
    return jQuery.grep(elements, function (elem, i) {
      return jQuery.inArray(elem, qualifier) >= 0 === keep;
    });
  }
  function createSafeFragment(document) {
    var list = nodeNames.split('|'), safeFrag = document.createDocumentFragment();
    if (safeFrag.createElement) {
      while (list.length) {
        safeFrag.createElement(list.pop());
      }
    }
    return safeFrag;
  }
  var nodeNames = 'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|' + 'header|hgroup|mark|meter|nav|output|progress|section|summary|time|video', rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = new RegExp('<(?:' + nodeNames + ')[\\s/>]', 'i'), rcheckableType = /^(?:checkbox|radio)$/,
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, wrapMap = {
      option: [
        1,
        '<select multiple=\'multiple\'>',
        '</select>'
      ],
      legend: [
        1,
        '<fieldset>',
        '</fieldset>'
      ],
      thead: [
        1,
        '<table>',
        '</table>'
      ],
      tr: [
        2,
        '<table><tbody>',
        '</tbody></table>'
      ],
      td: [
        3,
        '<table><tbody><tr>',
        '</tr></tbody></table>'
      ],
      col: [
        2,
        '<table><tbody></tbody><colgroup>',
        '</colgroup></table>'
      ],
      area: [
        1,
        '<map>',
        '</map>'
      ],
      _default: [
        0,
        '',
        ''
      ]
    }, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement('div'));
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
  // unless wrapped in a div with non-breaking characters in front of it.
  if (!jQuery.support.htmlSerialize) {
    wrapMap._default = [
      1,
      'X<div>',
      '</div>'
    ];
  }
  jQuery.fn.extend({
    text: function (value) {
      return jQuery.access(this, function (value) {
        return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
      }, null, value, arguments.length);
    },
    wrapAll: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        // The elements to wrap the target around
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function () {
          var elem = this;
          while (elem.firstChild && elem.firstChild.nodeType === 1) {
            elem = elem.firstChild;
          }
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function () {
        var self = jQuery(this), contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function (html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function (i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function () {
      return this.parent().each(function () {
        if (!jQuery.nodeName(this, 'body')) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    },
    append: function () {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11) {
          this.appendChild(elem);
        }
      });
    },
    prepend: function () {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11) {
          this.insertBefore(elem, this.firstChild);
        }
      });
    },
    before: function () {
      if (!isDisconnected(this[0])) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this);
        });
      }
      if (arguments.length) {
        var set = jQuery.clean(arguments);
        return this.pushStack(jQuery.merge(set, this), 'before', this.selector);
      }
    },
    after: function () {
      if (!isDisconnected(this[0])) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        });
      }
      if (arguments.length) {
        var set = jQuery.clean(arguments);
        return this.pushStack(jQuery.merge(this, set), 'after', this.selector);
      }
    },
    // keepData is for internal use only--do not document
    remove: function (selector, keepData) {
      var elem, i = 0;
      for (; (elem = this[i]) != null; i++) {
        if (!selector || jQuery.filter(selector, [elem]).length) {
          if (!keepData && elem.nodeType === 1) {
            jQuery.cleanData(elem.getElementsByTagName('*'));
            jQuery.cleanData([elem]);
          }
          if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
          }
        }
      }
      return this;
    },
    empty: function () {
      var elem, i = 0;
      for (; (elem = this[i]) != null; i++) {
        // Remove element nodes and prevent memory leaks
        if (elem.nodeType === 1) {
          jQuery.cleanData(elem.getElementsByTagName('*'));
        }
        // Remove any remaining nodes
        while (elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
      }
      return this;
    },
    clone: function (dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function () {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function (value) {
      return jQuery.access(this, function (value) {
        var elem = this[0] || {}, i = 0, l = this.length;
        if (value === undefined) {
          return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, '') : undefined;
        }
        // See if we can take a shortcut and just use innerHTML
        if (typeof value === 'string' && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [
            '',
            ''
          ])[1].toLowerCase()]) {
          value = value.replace(rxhtmlTag, '<$1></$2>');
          try {
            for (; i < l; i++) {
              // Remove element nodes and prevent memory leaks
              elem = this[i] || {};
              if (elem.nodeType === 1) {
                jQuery.cleanData(elem.getElementsByTagName('*'));
                elem.innerHTML = value;
              }
            }
            elem = 0;  // If using innerHTML throws an exception, use the fallback method
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function (value) {
      if (!isDisconnected(this[0])) {
        // Make sure that the elements are removed from the DOM before they are inserted
        // this can help fix replacing a parent with child elements
        if (jQuery.isFunction(value)) {
          return this.each(function (i) {
            var self = jQuery(this), old = self.html();
            self.replaceWith(value.call(this, i, old));
          });
        }
        if (typeof value !== 'string') {
          value = jQuery(value).detach();
        }
        return this.each(function () {
          var next = this.nextSibling, parent = this.parentNode;
          jQuery(this).remove();
          if (next) {
            jQuery(next).before(value);
          } else {
            jQuery(parent).append(value);
          }
        });
      }
      return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), 'replaceWith', value) : this;
    },
    detach: function (selector) {
      return this.remove(selector, true);
    },
    domManip: function (args, table, callback) {
      // Flatten any nested arrays
      args = [].concat.apply([], args);
      var results, first, fragment, iNoClone, i = 0, value = args[0], scripts = [], l = this.length;
      // We can't cloneNode fragments that contain checked, in WebKit
      if (!jQuery.support.checkClone && l > 1 && typeof value === 'string' && rchecked.test(value)) {
        return this.each(function () {
          jQuery(this).domManip(args, table, callback);
        });
      }
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          var self = jQuery(this);
          args[0] = value.call(this, i, table ? self.html() : undefined);
          self.domManip(args, table, callback);
        });
      }
      if (this[0]) {
        results = jQuery.buildFragment(args, this, scripts);
        fragment = results.fragment;
        first = fragment.firstChild;
        if (fragment.childNodes.length === 1) {
          fragment = first;
        }
        if (first) {
          table = table && jQuery.nodeName(first, 'tr');
          // Use the original fragment for the last item instead of the first because it can end up
          // being emptied incorrectly in certain situations (#8070).
          // Fragments from the fragment cache must always be cloned and never used in place.
          for (iNoClone = results.cacheable || l - 1; i < l; i++) {
            callback.call(table && jQuery.nodeName(this[i], 'table') ? findOrAppend(this[i], 'tbody') : this[i], i === iNoClone ? fragment : jQuery.clone(fragment, true, true));
          }
        }
        // Fix #11809: Avoid leaking memory
        fragment = first = null;
        if (scripts.length) {
          jQuery.each(scripts, function (i, elem) {
            if (elem.src) {
              if (jQuery.ajax) {
                jQuery.ajax({
                  url: elem.src,
                  type: 'GET',
                  dataType: 'script',
                  async: false,
                  global: false,
                  'throws': true
                });
              } else {
                jQuery.error('no ajax');
              }
            } else {
              jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || '').replace(rcleanScript, ''));
            }
            if (elem.parentNode) {
              elem.parentNode.removeChild(elem);
            }
          });
        }
      }
      return this;
    }
  });
  function findOrAppend(elem, tag) {
    return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
  }
  function cloneCopyEvent(src, dest) {
    if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
      return;
    }
    var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
    if (events) {
      delete curData.handle;
      curData.events = {};
      for (type in events) {
        for (i = 0, l = events[type].length; i < l; i++) {
          jQuery.event.add(dest, type, events[type][i]);
        }
      }
    }
    // make the cloned public data object a copy from the original
    if (curData.data) {
      curData.data = jQuery.extend({}, curData.data);
    }
  }
  function cloneFixAttributes(src, dest) {
    var nodeName;
    // We do not need to do anything for non-Elements
    if (dest.nodeType !== 1) {
      return;
    }
    // clearAttributes removes the attributes, which we don't want,
    // but also removes the attachEvent events, which we *do* want
    if (dest.clearAttributes) {
      dest.clearAttributes();
    }
    // mergeAttributes, in contrast, only merges back on the
    // original attributes, not the events
    if (dest.mergeAttributes) {
      dest.mergeAttributes(src);
    }
    nodeName = dest.nodeName.toLowerCase();
    if (nodeName === 'object') {
      // IE6-10 improperly clones children of object elements using classid.
      // IE10 throws NoModificationAllowedError if parent is null, #12132.
      if (dest.parentNode) {
        dest.outerHTML = src.outerHTML;
      }
      // This path appears unavoidable for IE9. When cloning an object
      // element in IE9, the outerHTML strategy above is not sufficient.
      // If the src has innerHTML and the destination does not,
      // copy the src.innerHTML into the dest.innerHTML. #10324
      if (jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
        dest.innerHTML = src.innerHTML;
      }
    } else if (nodeName === 'input' && rcheckableType.test(src.type)) {
      // IE6-8 fails to persist the checked state of a cloned checkbox
      // or radio button. Worse, IE6-7 fail to give the cloned element
      // a checked appearance if the defaultChecked value isn't also set
      dest.defaultChecked = dest.checked = src.checked;
      // IE6-7 get confused and end up setting the value of a cloned
      // checkbox/radio button to an empty string instead of "on"
      if (dest.value !== src.value) {
        dest.value = src.value;
      }  // IE6-8 fails to return the selected option to the default selected
         // state when cloning options
    } else if (nodeName === 'option') {
      dest.selected = src.defaultSelected;  // IE6-8 fails to set the defaultValue to the correct value when
                                            // cloning other types of input fields
    } else if (nodeName === 'input' || nodeName === 'textarea') {
      dest.defaultValue = src.defaultValue;  // IE blanks contents when cloning scripts
    } else if (nodeName === 'script' && dest.text !== src.text) {
      dest.text = src.text;
    }
    // Event data gets referenced instead of copied if the expando
    // gets copied too
    dest.removeAttribute(jQuery.expando);
  }
  jQuery.buildFragment = function (args, context, scripts) {
    var fragment, cacheable, cachehit, first = args[0];
    // Set context from what may come in as undefined or a jQuery collection or a node
    // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
    // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
    context = context || document;
    context = !context.nodeType && context[0] || context;
    context = context.ownerDocument || context;
    // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
    if (args.length === 1 && typeof first === 'string' && first.length < 512 && context === document && first.charAt(0) === '<' && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first))) {
      // Mark cacheable and look for a hit
      cacheable = true;
      fragment = jQuery.fragments[first];
      cachehit = fragment !== undefined;
    }
    if (!fragment) {
      fragment = context.createDocumentFragment();
      jQuery.clean(args, context, fragment, scripts);
      // Update the cache, but only store false
      // unless this is a second parsing of the same content
      if (cacheable) {
        jQuery.fragments[first] = cachehit && fragment;
      }
    }
    return {
      fragment: fragment,
      cacheable: cacheable
    };
  };
  jQuery.fragments = {};
  jQuery.each({
    appendTo: 'append',
    prependTo: 'prepend',
    insertBefore: 'before',
    insertAfter: 'after',
    replaceAll: 'replaceWith'
  }, function (name, original) {
    jQuery.fn[name] = function (selector) {
      var elems, i = 0, ret = [], insert = jQuery(selector), l = insert.length, parent = this.length === 1 && this[0].parentNode;
      if ((parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1) {
        insert[original](this[0]);
        return this;
      } else {
        for (; i < l; i++) {
          elems = (i > 0 ? this.clone(true) : this).get();
          jQuery(insert[i])[original](elems);
          ret = ret.concat(elems);
        }
        return this.pushStack(ret, name, insert.selector);
      }
    };
  });
  function getAll(elem) {
    if (typeof elem.getElementsByTagName !== 'undefined') {
      return elem.getElementsByTagName('*');
    } else if (typeof elem.querySelectorAll !== 'undefined') {
      return elem.querySelectorAll('*');
    } else {
      return [];
    }
  }
  // Used in clean, fixes the defaultChecked property
  function fixDefaultChecked(elem) {
    if (rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  jQuery.extend({
    clone: function (elem, dataAndEvents, deepDataAndEvents) {
      var srcElements, destElements, i, clone;
      if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test('<' + elem.nodeName + '>')) {
        clone = elem.cloneNode(true);  // IE<=8 does not properly clone detached, unknown element nodes
      } else {
        fragmentDiv.innerHTML = elem.outerHTML;
        fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
      }
      if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
        // IE copies events bound via attachEvent when using cloneNode.
        // Calling detachEvent on the clone will also remove the events
        // from the original. In order to get around this, we use some
        // proprietary methods to clear the events. Thanks to MooTools
        // guys for this hotness.
        cloneFixAttributes(elem, clone);
        // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
        srcElements = getAll(elem);
        destElements = getAll(clone);
        // Weird iteration because IE will replace the length property
        // with an element if you are cloning the body and one of the
        // elements on the page has a name or id of "length"
        for (i = 0; srcElements[i]; ++i) {
          // Ensure that the destination node is not null; Fixes #9587
          if (destElements[i]) {
            cloneFixAttributes(srcElements[i], destElements[i]);
          }
        }
      }
      // Copy the events from the original to the clone
      if (dataAndEvents) {
        cloneCopyEvent(elem, clone);
        if (deepDataAndEvents) {
          srcElements = getAll(elem);
          destElements = getAll(clone);
          for (i = 0; srcElements[i]; ++i) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        }
      }
      srcElements = destElements = null;
      // Return the cloned set
      return clone;
    },
    clean: function (elems, context, fragment, scripts) {
      var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags, safe = context === document && safeFragment, ret = [];
      // Ensure that context is a document
      if (!context || typeof context.createDocumentFragment === 'undefined') {
        context = document;
      }
      // Use the already-created safe fragment if context permits
      for (i = 0; (elem = elems[i]) != null; i++) {
        if (typeof elem === 'number') {
          elem += '';
        }
        if (!elem) {
          continue;
        }
        // Convert html string into DOM nodes
        if (typeof elem === 'string') {
          if (!rhtml.test(elem)) {
            elem = context.createTextNode(elem);
          } else {
            // Ensure a safe container in which to render the html
            safe = safe || createSafeFragment(context);
            div = context.createElement('div');
            safe.appendChild(div);
            // Fix "XHTML"-style tags in all browsers
            elem = elem.replace(rxhtmlTag, '<$1></$2>');
            // Go to html and back, then peel off extra wrappers
            tag = (rtagName.exec(elem) || [
              '',
              ''
            ])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            depth = wrap[0];
            div.innerHTML = wrap[1] + elem + wrap[2];
            // Move to the right depth
            while (depth--) {
              div = div.lastChild;
            }
            // Remove IE's autoinserted <tbody> from table fragments
            if (!jQuery.support.tbody) {
              // String was a <table>, *may* have spurious <tbody>
              hasBody = rtbody.test(elem);
              tbody = tag === 'table' && !hasBody ? div.firstChild && div.firstChild.childNodes : // String was a bare <thead> or <tfoot>
              wrap[1] === '<table>' && !hasBody ? div.childNodes : [];
              for (j = tbody.length - 1; j >= 0; --j) {
                if (jQuery.nodeName(tbody[j], 'tbody') && !tbody[j].childNodes.length) {
                  tbody[j].parentNode.removeChild(tbody[j]);
                }
              }
            }
            // IE completely kills leading whitespace when innerHTML is used
            if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
              div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
            }
            elem = div.childNodes;
            // Take out of fragment container (we need a fresh div each time)
            div.parentNode.removeChild(div);
          }
        }
        if (elem.nodeType) {
          ret.push(elem);
        } else {
          jQuery.merge(ret, elem);
        }
      }
      // Fix #11356: Clear elements from safeFragment
      if (div) {
        elem = div = safe = null;
      }
      // Reset defaultChecked for any radios and checkboxes
      // about to be appended to the DOM in IE 6/7 (#8060)
      if (!jQuery.support.appendChecked) {
        for (i = 0; (elem = ret[i]) != null; i++) {
          if (jQuery.nodeName(elem, 'input')) {
            fixDefaultChecked(elem);
          } else if (typeof elem.getElementsByTagName !== 'undefined') {
            jQuery.grep(elem.getElementsByTagName('input'), fixDefaultChecked);
          }
        }
      }
      // Append elements to a provided document fragment
      if (fragment) {
        // Special handling of each script element
        handleScript = function (elem) {
          // Check if we consider it executable
          if (!elem.type || rscriptType.test(elem.type)) {
            // Detach the script and store it in the scripts array (if provided) or the fragment
            // Return truthy to indicate that it has been handled
            return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem);
          }
        };
        for (i = 0; (elem = ret[i]) != null; i++) {
          // Check if we're done after handling an executable script
          if (!(jQuery.nodeName(elem, 'script') && handleScript(elem))) {
            // Append to fragment and handle embedded scripts
            fragment.appendChild(elem);
            if (typeof elem.getElementsByTagName !== 'undefined') {
              // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
              jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName('script')), handleScript);
              // Splice the scripts into ret after their former ancestor and advance our index beyond them
              ret.splice.apply(ret, [
                i + 1,
                0
              ].concat(jsTags));
              i += jsTags.length;
            }
          }
        }
      }
      return ret;
    },
    cleanData: function (elems, acceptData) {
      var data, id, elem, type, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special;
      for (; (elem = elems[i]) != null; i++) {
        if (acceptData || jQuery.acceptData(elem)) {
          id = elem[internalKey];
          data = id && cache[id];
          if (data) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);  // This is a shortcut to avoid jQuery.event.remove's overhead
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            // Remove cache only if it was not already removed by jQuery.event.remove
            if (cache[id]) {
              delete cache[id];
              // IE does not allow us to delete expando properties from nodes,
              // nor does it have a removeAttribute function on Document nodes;
              // we must handle all of these cases
              if (deleteExpando) {
                delete elem[internalKey];
              } else if (elem.removeAttribute) {
                elem.removeAttribute(internalKey);
              } else {
                elem[internalKey] = null;
              }
              jQuery.deletedIds.push(id);
            }
          }
        }
      }
    }
  });
  // Limit scope pollution from any deprecated API
  (function () {
    var matched, browser;
    // Use of jQuery.browser is frowned upon.
    // More details: http://api.jquery.com/jQuery.browser
    // jQuery.uaMatch maintained for back-compat
    jQuery.uaMatch = function (ua) {
      ua = ua.toLowerCase();
      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || '',
        version: match[2] || '0'
      };
    };
    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};
    if (matched.browser) {
      browser[matched.browser] = true;
      browser.version = matched.version;
    }
    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
      browser.webkit = true;
    } else if (browser.webkit) {
      browser.safari = true;
    }
    jQuery.browser = browser;
    jQuery.sub = function () {
      function jQuerySub(selector, context) {
        return new jQuerySub.fn.init(selector, context);
      }
      jQuery.extend(true, jQuerySub, this);
      jQuerySub.superclass = this;
      jQuerySub.fn = jQuerySub.prototype = this();
      jQuerySub.fn.constructor = jQuerySub;
      jQuerySub.sub = this.sub;
      jQuerySub.fn.init = function init(selector, context) {
        if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
          context = jQuerySub(context);
        }
        return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
      };
      jQuerySub.fn.init.prototype = jQuerySub.fn;
      var rootjQuerySub = jQuerySub(document);
      return jQuerySub;
    };
  }());
  var curCSS, iframe, iframeDoc, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rposition = /^(top|right|bottom|left)$/,
    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = new RegExp('^(' + core_pnum + ')(.*)$', 'i'), rnumnonpx = new RegExp('^(' + core_pnum + ')(?!px)[a-z%]+$', 'i'), rrelNum = new RegExp('^([-+])=(' + core_pnum + ')', 'i'), elemdisplay = { BODY: 'block' }, cssShow = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    }, cssNormalTransform = {
      letterSpacing: 0,
      fontWeight: 400
    }, cssExpand = [
      'Top',
      'Right',
      'Bottom',
      'Left'
    ], cssPrefixes = [
      'Webkit',
      'O',
      'Moz',
      'ms'
    ], eventsToggle = jQuery.fn.toggle;
  // return a css property mapped to a potentially vendor prefixed property
  function vendorPropName(style, name) {
    // shortcut for names that are not vendor prefixed
    if (name in style) {
      return name;
    }
    // check for vendor prefixed names
    var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in style) {
        return name;
      }
    }
    return origName;
  }
  function isHidden(elem, el) {
    elem = el || elem;
    return jQuery.css(elem, 'display') === 'none' || !jQuery.contains(elem.ownerDocument, elem);
  }
  function showHide(elements, show) {
    var elem, display, values = [], index = 0, length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      values[index] = jQuery._data(elem, 'olddisplay');
      if (show) {
        // Reset the inline display of this element to learn if it is
        // being hidden by cascaded rules or not
        if (!values[index] && elem.style.display === 'none') {
          elem.style.display = '';
        }
        // Set elements which have been overridden with display: none
        // in a stylesheet to whatever the default browser style is
        // for such an element
        if (elem.style.display === '' && isHidden(elem)) {
          values[index] = jQuery._data(elem, 'olddisplay', css_defaultDisplay(elem.nodeName));
        }
      } else {
        display = curCSS(elem, 'display');
        if (!values[index] && display !== 'none') {
          jQuery._data(elem, 'olddisplay', display);
        }
      }
    }
    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    for (index = 0; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      if (!show || elem.style.display === 'none' || elem.style.display === '') {
        elem.style.display = show ? values[index] || '' : 'none';
      }
    }
    return elements;
  }
  jQuery.fn.extend({
    css: function (name, value) {
      return jQuery.access(this, function (elem, name, value) {
        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    },
    show: function () {
      return showHide(this, true);
    },
    hide: function () {
      return showHide(this);
    },
    toggle: function (state, fn2) {
      var bool = typeof state === 'boolean';
      if (jQuery.isFunction(state) && jQuery.isFunction(fn2)) {
        return eventsToggle.apply(this, arguments);
      }
      return this.each(function () {
        if (bool ? state : isHidden(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
      opacity: {
        get: function (elem, computed) {
          if (computed) {
            // We should always get a number back from opacity
            var ret = curCSS(elem, 'opacity');
            return ret === '' ? '1' : ret;
          }
        }
      }
    },
    // Exclude the following css properties to add px
    cssNumber: {
      'fillOpacity': true,
      'fontWeight': true,
      'lineHeight': true,
      'opacity': true,
      'orphans': true,
      'widows': true,
      'zIndex': true,
      'zoom': true
    },
    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
      // normalize float css property
      'float': jQuery.support.cssFloat ? 'cssFloat' : 'styleFloat'
    },
    // Get and set the style property on a DOM Node
    style: function (elem, name, value, extra) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      // Make sure that we're working with the right name
      var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      // Check if we're setting a value
      if (value !== undefined) {
        type = typeof value;
        // convert relative number strings (+= or -=) to relative numbers. #7345
        if (type === 'string' && (ret = rrelNum.exec(value))) {
          value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
          // Fixes bug #9237
          type = 'number';
        }
        // Make sure that NaN and null values aren't set. See: #7116
        if (value == null || type === 'number' && isNaN(value)) {
          return;
        }
        // If a number was passed in, add 'px' to the (except for certain CSS properties)
        if (type === 'number' && !jQuery.cssNumber[origName]) {
          value += 'px';
        }
        // If a hook was provided, use that value, otherwise just set the specified value
        if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
          // Fixes bug #5509
          try {
            style[name] = value;
          } catch (e) {
          }
        }
      } else {
        // If a hook was provided get the non-computed value from there
        if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        }
        // Otherwise just get the value from the style object
        return style[name];
      }
    },
    css: function (elem, name, numeric, extra) {
      var val, num, hooks, origName = jQuery.camelCase(name);
      // Make sure that we're working with the right name
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      // If a hook was provided get the computed value from there
      if (hooks && 'get' in hooks) {
        val = hooks.get(elem, true, extra);
      }
      // Otherwise, if a way to get the computed value exists, use that
      if (val === undefined) {
        val = curCSS(elem, name);
      }
      //convert "normal" to computed value
      if (val === 'normal' && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      // Return, converting to number if forced or a qualifier was provided and val looks numeric
      if (numeric || extra !== undefined) {
        num = parseFloat(val);
        return numeric || jQuery.isNumeric(num) ? num || 0 : val;
      }
      return val;
    },
    // A method for quickly swapping in/out CSS properties to get correct calculations
    swap: function (elem, options, callback) {
      var ret, name, old = {};
      // Remember the old values, and insert the new ones
      for (name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }
      ret = callback.call(elem);
      // Revert the old values
      for (name in options) {
        elem.style[name] = old[name];
      }
      return ret;
    }
  });
  // NOTE: To any future maintainer, we've window.getComputedStyle
  // because jsdom on node.js will break without it.
  if (window.getComputedStyle) {
    curCSS = function (elem, name) {
      var ret, width, minWidth, maxWidth, computed = window.getComputedStyle(elem, null), style = elem.style;
      if (computed) {
        // getPropertyValue is only needed for .css('filter') in IE9, see #12537
        ret = computed.getPropertyValue(name) || computed[name];
        if (ret === '' && !jQuery.contains(elem.ownerDocument, elem)) {
          ret = jQuery.style(elem, name);
        }
        // A tribute to the "awesome hack by Dean Edwards"
        // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
        // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
        // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
        if (rnumnonpx.test(ret) && rmargin.test(name)) {
          width = style.width;
          minWidth = style.minWidth;
          maxWidth = style.maxWidth;
          style.minWidth = style.maxWidth = style.width = ret;
          ret = computed.width;
          style.width = width;
          style.minWidth = minWidth;
          style.maxWidth = maxWidth;
        }
      }
      return ret;
    };
  } else if (document.documentElement.currentStyle) {
    curCSS = function (elem, name) {
      var left, rsLeft, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;
      // Avoid setting ret to empty string here
      // so we don't default to auto
      if (ret == null && style && style[name]) {
        ret = style[name];
      }
      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      // but not position css attributes, as those are proportional to the parent element instead
      // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
      if (rnumnonpx.test(ret) && !rposition.test(name)) {
        // Remember the original values
        left = style.left;
        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;
        // Put in the new values to get a computed value out
        if (rsLeft) {
          elem.runtimeStyle.left = elem.currentStyle.left;
        }
        style.left = name === 'fontSize' ? '1em' : ret;
        ret = style.pixelLeft + 'px';
        // Revert the changed values
        style.left = left;
        if (rsLeft) {
          elem.runtimeStyle.left = rsLeft;
        }
      }
      return ret === '' ? 'auto' : ret;
    };
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rnumsplit.exec(value);
    return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || 'px') : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox) {
    var i = extra === (isBorderBox ? 'border' : 'content') ? // If we already have the right measurement, avoid augmentation
      4 : // Otherwise initialize for horizontal or vertical properties
      name === 'width' ? 1 : 0, val = 0;
    for (; i < 4; i += 2) {
      // both box models exclude margin, so add it if we want it
      if (extra === 'margin') {
        // we use jQuery.css instead of curCSS here
        // because of the reliableMarginRight CSS hook!
        val += jQuery.css(elem, extra + cssExpand[i], true);
      }
      // From this point on we use curCSS for maximum performance (relevant in animations)
      if (isBorderBox) {
        // border-box includes padding, so remove it if we want content
        if (extra === 'content') {
          val -= parseFloat(curCSS(elem, 'padding' + cssExpand[i])) || 0;
        }
        // at this point, extra isn't border nor margin, so remove border
        if (extra !== 'margin') {
          val -= parseFloat(curCSS(elem, 'border' + cssExpand[i] + 'Width')) || 0;
        }
      } else {
        // at this point, extra isn't content, so add padding
        val += parseFloat(curCSS(elem, 'padding' + cssExpand[i])) || 0;
        // at this point, extra isn't content nor padding, so add border
        if (extra !== 'padding') {
          val += parseFloat(curCSS(elem, 'border' + cssExpand[i] + 'Width')) || 0;
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    // Start with offset property, which is equivalent to the border-box value
    var val = name === 'width' ? elem.offsetWidth : elem.offsetHeight, valueIsBorderBox = true, isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, 'boxSizing') === 'border-box';
    // some non-html elements return undefined for offsetWidth, so check for null/undefined
    // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    if (val <= 0 || val == null) {
      // Fall back to computed then uncomputed css if necessary
      val = curCSS(elem, name);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }
      // Computed unit is not pixels. Stop here and return.
      if (rnumnonpx.test(val)) {
        return val;
      }
      // we need the check for style in case a browser which returns unreliable values
      // for getComputedStyle silently falls back to the reliable elem.style
      valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
      // Normalize "", auto, and prepare for extra
      val = parseFloat(val) || 0;
    }
    // use the active box-sizing model to add/subtract irrelevant styles
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox) + 'px';
  }
  // Try to determine the default display value of an element
  function css_defaultDisplay(nodeName) {
    if (elemdisplay[nodeName]) {
      return elemdisplay[nodeName];
    }
    var elem = jQuery('<' + nodeName + '>').appendTo(document.body), display = elem.css('display');
    elem.remove();
    // If the simple way fails,
    // get element's real default display by attaching it to a temp iframe
    if (display === 'none' || display === '') {
      // Use the already-created iframe if possible
      iframe = document.body.appendChild(iframe || jQuery.extend(document.createElement('iframe'), {
        frameBorder: 0,
        width: 0,
        height: 0
      }));
      // Create a cacheable copy of the iframe document on first call.
      // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
      // document to it; WebKit & Firefox won't allow reusing the iframe document.
      if (!iframeDoc || !iframe.createElement) {
        iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
        iframeDoc.write('<!doctype html><html><body>');
        iframeDoc.close();
      }
      elem = iframeDoc.body.appendChild(iframeDoc.createElement(nodeName));
      display = curCSS(elem, 'display');
      document.body.removeChild(iframe);
    }
    // Store the correct default display
    elemdisplay[nodeName] = display;
    return display;
  }
  jQuery.each([
    'height',
    'width'
  ], function (i, name) {
    jQuery.cssHooks[name] = {
      get: function (elem, computed, extra) {
        if (computed) {
          // certain elements can have dimension info if we invisibly show them
          // however, it must have a current display style that would benefit from this
          if (elem.offsetWidth === 0 && rdisplayswap.test(curCSS(elem, 'display'))) {
            return jQuery.swap(elem, cssShow, function () {
              return getWidthOrHeight(elem, name, extra);
            });
          } else {
            return getWidthOrHeight(elem, name, extra);
          }
        }
      },
      set: function (elem, value, extra) {
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, 'boxSizing') === 'border-box') : 0);
      }
    };
  });
  if (!jQuery.support.opacity) {
    jQuery.cssHooks.opacity = {
      get: function (elem, computed) {
        // IE uses filters for opacity
        return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '') ? 0.01 * parseFloat(RegExp.$1) + '' : computed ? '1' : '';
      },
      set: function (elem, value) {
        var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? 'alpha(opacity=' + value * 100 + ')' : '', filter = currentStyle && currentStyle.filter || style.filter || '';
        // IE has trouble with opacity if it does not have layout
        // Force it by setting the zoom level
        style.zoom = 1;
        // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
        if (value >= 1 && jQuery.trim(filter.replace(ralpha, '')) === '' && style.removeAttribute) {
          // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
          // if "filter:" is present at all, clearType is disabled, we want to avoid this
          // style.removeAttribute is IE Only, but so apparently is this code path...
          style.removeAttribute('filter');
          // if there there is no filter style applied in a css rule, we are done
          if (currentStyle && !currentStyle.filter) {
            return;
          }
        }
        // otherwise, set new filter values
        style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity;
      }
    };
  }
  // These hooks cannot be added until DOM ready because the support test
  // for it is not run until after DOM ready
  jQuery(function () {
    if (!jQuery.support.reliableMarginRight) {
      jQuery.cssHooks.marginRight = {
        get: function (elem, computed) {
          // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
          // Work around by temporarily setting element display to inline-block
          return jQuery.swap(elem, { 'display': 'inline-block' }, function () {
            if (computed) {
              return curCSS(elem, 'marginRight');
            }
          });
        }
      };
    }
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // getComputedStyle returns percent when specified for top/left/bottom/right
    // rather than make the css module depend on the offset module, we just check for it here
    if (!jQuery.support.pixelPosition && jQuery.fn.position) {
      jQuery.each([
        'top',
        'left'
      ], function (i, prop) {
        jQuery.cssHooks[prop] = {
          get: function (elem, computed) {
            if (computed) {
              var ret = curCSS(elem, prop);
              // if curCSS returns percentage, fallback to offset
              return rnumnonpx.test(ret) ? jQuery(elem).position()[prop] + 'px' : ret;
            }
          }
        };
      });
    }
  });
  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.hidden = function (elem) {
      return elem.offsetWidth === 0 && elem.offsetHeight === 0 || !jQuery.support.reliableHiddenOffsets && (elem.style && elem.style.display || curCSS(elem, 'display')) === 'none';
    };
    jQuery.expr.filters.visible = function (elem) {
      return !jQuery.expr.filters.hidden(elem);
    };
  }
  // These hooks are used by animate to expand properties
  jQuery.each({
    margin: '',
    padding: '',
    border: 'Width'
  }, function (prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand: function (value) {
        var i,
          // assumes a single number if not a string
          parts = typeof value === 'string' ? value.split(' ') : [value], expanded = {};
        for (i = 0; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        }
        return expanded;
      }
    };
    if (!rmargin.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rselectTextarea = /^(?:select|textarea)/i;
  jQuery.fn.extend({
    serialize: function () {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        return this.elements ? jQuery.makeArray(this.elements) : this;
      }).filter(function () {
        return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
      }).map(function (i, elem) {
        var val = jQuery(this).val();
        return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val, i) {
          return {
            name: elem.name,
            value: val.replace(rCRLF, '\r\n')
          };
        }) : {
          name: elem.name,
          value: val.replace(rCRLF, '\r\n')
        };
      }).get();
    }
  });
  //Serialize an array of form elements or a set of
  //key/values into a query string
  jQuery.param = function (a, traditional) {
    var prefix, s = [], add = function (key, value) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction(value) ? value() : value == null ? '' : value;
        s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
      };
    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if (traditional === undefined) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }
    // If an array was passed in, assume that it is an array of form elements.
    if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      // Serialize the form elements
      jQuery.each(a, function () {
        add(this.name, this.value);
      });
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    // Return the resulting serialization
    return s.join('&').replace(r20, '+');
  };
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) {
      // Serialize array item.
      jQuery.each(obj, function (i, v) {
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);
        } else {
          // If array item is non-scalar (array or object), encode its
          // numeric index to resolve deserialization ambiguity issues.
          // Note that rack (as of 1.0.0) can't currently deserialize
          // nested arrays properly, and attempting to do so may cause
          // a server error. Possible fixes are to modify rack's
          // deserialization algorithm or to provide an option or flag
          // to force array serialization to be shallow.
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
        }
      });
    } else if (!traditional && jQuery.type(obj) === 'object') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
      }
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }
  var
    // Document location
    ajaxLocParts, ajaxLocation, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    // IE leaves an \r character at EOL
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    // Keep a copy of the old load method
    _load = jQuery.fn.load,
    /* Prefilters
    * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    * 2) These are called:
    *    - BEFORE asking for a transport
    *    - AFTER param serialization (s.data is a string if s.processData is true)
    * 3) key is the dataType
    * 4) the catchall symbol "*" can be used
    * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    */
    prefilters = {},
    /* Transports bindings
    * 1) key is the dataType
    * 2) the catchall symbol "*" can be used
    * 3) selection will start with transport dataType and THEN go to "*" if needed
    */
    transports = {},
    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = ['*/'] + ['*'];
  // #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  try {
    ajaxLocation = location.href;
  } catch (e) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement('a');
    ajaxLocation.href = '';
    ajaxLocation = ajaxLocation.href;
  }
  // Segment location into parts
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
  // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
  function addToPrefiltersOrTransports(structure) {
    // dataTypeExpression is optional and defaults to "*"
    return function (dataTypeExpression, func) {
      if (typeof dataTypeExpression !== 'string') {
        func = dataTypeExpression;
        dataTypeExpression = '*';
      }
      var dataType, list, placeBefore, dataTypes = dataTypeExpression.toLowerCase().split(core_rspace), i = 0, length = dataTypes.length;
      if (jQuery.isFunction(func)) {
        // For each dataType in the dataTypeExpression
        for (; i < length; i++) {
          dataType = dataTypes[i];
          // We control if we're asked to add before
          // any existing element
          placeBefore = /^\+/.test(dataType);
          if (placeBefore) {
            dataType = dataType.substr(1) || '*';
          }
          list = structure[dataType] = structure[dataType] || [];
          // then we add to the structure accordingly
          list[placeBefore ? 'unshift' : 'push'](func);
        }
      }
    };
  }
  // Base inspection function for prefilters and transports
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
    dataType = dataType || options.dataTypes[0];
    inspected = inspected || {};
    inspected[dataType] = true;
    var selection, list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = structure === prefilters;
    for (; i < length && (executeOnly || !selection); i++) {
      selection = list[i](options, originalOptions, jqXHR);
      // If we got redirected to another dataType
      // we try there if executing only and not done already
      if (typeof selection === 'string') {
        if (!executeOnly || inspected[selection]) {
          selection = undefined;
        } else {
          options.dataTypes.unshift(selection);
          selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
        }
      }
    }
    // If we're only executing or nothing was selected
    // we try the catchall dataType if not done already
    if ((executeOnly || !selection) && !inspected['*']) {
      selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, '*', inspected);
    }
    // unnecessary when only executing (prefilters)
    // but it'll be ignored by the caller in that case
    return selection;
  }
  // A special extend for ajax options
  // that takes "flat" options (not to be deep extended)
  // Fixes #9887
  function ajaxExtend(target, src) {
    var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
  }
  jQuery.fn.load = function (url, params, callback) {
    if (typeof url !== 'string' && _load) {
      return _load.apply(this, arguments);
    }
    // Don't do a request if no elements are being requested
    if (!this.length) {
      return this;
    }
    var selector, type, response, self = this, off = url.indexOf(' ');
    if (off >= 0) {
      selector = url.slice(off, url.length);
      url = url.slice(0, off);
    }
    // If it's a function
    if (jQuery.isFunction(params)) {
      // We assume that it's the callback
      callback = params;
      params = undefined;  // Otherwise, build a param string
    } else if (params && typeof params === 'object') {
      type = 'POST';
    }
    // Request the remote document
    jQuery.ajax({
      url: url,
      // if "type" variable is undefined, then "GET" method will be used
      type: type,
      dataType: 'html',
      data: params,
      complete: function (jqXHR, status) {
        if (callback) {
          self.each(callback, response || [
            jqXHR.responseText,
            status,
            jqXHR
          ]);
        }
      }
    }).done(function (responseText) {
      // Save response for use in complete callback
      response = arguments;
      // See if a selector was specified
      self.html(selector ? // Create a dummy div to hold the results
      jQuery('<div>')  // inject the contents of the document in, removing the scripts
                       // to avoid any 'Permission Denied' errors in IE
.append(responseText.replace(rscript, ''))  // Locate the specified elements
.find(selector) : // If not, just inject the full result
      responseText);
    });
    return this;
  };
  // Attach a bunch of functions for handling common AJAX events
  jQuery.each('ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '), function (i, o) {
    jQuery.fn[o] = function (f) {
      return this.on(o, f);
    };
  });
  jQuery.each([
    'get',
    'post'
  ], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      // shift arguments if data argument was omitted
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
      });
    };
  });
  jQuery.extend({
    getScript: function (url, callback) {
      return jQuery.get(url, undefined, callback, 'script');
    },
    getJSON: function (url, data, callback) {
      return jQuery.get(url, data, callback, 'json');
    },
    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function (target, settings) {
      if (settings) {
        // Building a settings object
        ajaxExtend(target, jQuery.ajaxSettings);
      } else {
        // Extending ajaxSettings
        settings = target;
        target = jQuery.ajaxSettings;
      }
      ajaxExtend(target, settings);
      return target;
    },
    ajaxSettings: {
      url: ajaxLocation,
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: true,
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      processData: true,
      async: true,
      /*
      timeout: 0,
      data: null,
      dataType: null,
      username: null,
      password: null,
      cache: null,
      throws: false,
      traditional: false,
      headers: {},
      */
      accepts: {
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain',
        json: 'application/json, text/javascript',
        '*': allTypes
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: 'responseXML',
        text: 'responseText'
      },
      // List of data converters
      // 1) key format is "source_type destination_type" (a single space in-between)
      // 2) the catchall symbol "*" can be used for source_type
      converters: {
        // Convert anything to text
        '* text': window.String,
        // Text to html (true = no transformation)
        'text html': true,
        // Evaluate text as a json expression
        'text json': jQuery.parseJSON,
        // Parse text as xml
        'text xml': jQuery.parseXML
      },
      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        context: true,
        url: true
      }
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    // Main method
    ajax: function (url, options) {
      // If url is an object, simulate pre-1.5 signature
      if (typeof url === 'object') {
        options = url;
        url = undefined;
      }
      // Force options to be an object
      options = options || {};
      var
        // ifModified key
        ifModifiedKey,
        // Response headers
        responseHeadersString, responseHeaders,
        // transport
        transport,
        // timeout handle
        timeoutTimer,
        // Cross-domain detection vars
        parts,
        // To know if global events are to be dispatched
        fireGlobals,
        // Loop variable
        i,
        // Create the final options object
        s = jQuery.ajaxSetup({}, options),
        // Callbacks context
        callbackContext = s.context || s,
        // Context for global events
        // It's the callbackContext if one was provided in the options
        // and if it's a DOM node or a jQuery collection
        globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event,
        // Deferreds
        deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks('once memory'),
        // Status-dependent callbacks
        statusCode = s.statusCode || {},
        // Headers (they are sent all at once)
        requestHeaders = {}, requestHeadersNames = {},
        // The jqXHR state
        state = 0,
        // Default abort message
        strAbort = 'canceled',
        // Fake xhr
        jqXHR = {
          readyState: 0,
          // Caches the header
          setRequestHeader: function (name, value) {
            if (!state) {
              var lname = name.toLowerCase();
              name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          // Raw string
          getAllResponseHeaders: function () {
            return state === 2 ? responseHeadersString : null;
          },
          // Builds headers hashtable if needed
          getResponseHeader: function (key) {
            var match;
            if (state === 2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while (match = rheaders.exec(responseHeadersString)) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match === undefined ? null : match;
          },
          // Overrides response content-type header
          overrideMimeType: function (type) {
            if (!state) {
              s.mimeType = type;
            }
            return this;
          },
          // Cancel the request
          abort: function (statusText) {
            statusText = statusText || strAbort;
            if (transport) {
              transport.abort(statusText);
            }
            done(0, statusText);
            return this;
          }
        };
      // Callback for when everything is done
      // It is defined here because jslint complains if it is declared
      // at the end of the function (which would be more logical and readable)
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
        // Called once
        if (state === 2) {
          return;
        }
        // State is "done" now
        state = 2;
        // Clear timeout if it exists
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
        // Dereference transport for early garbage collection
        // (no matter how long the jqXHR object will be used)
        transport = undefined;
        // Cache response headers
        responseHeadersString = headers || '';
        // Set readyState
        jqXHR.readyState = status > 0 ? 4 : 0;
        // Get response data
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        // If successful, handle type chaining
        if (status >= 200 && status < 300 || status === 304) {
          // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader('Last-Modified');
            if (modified) {
              jQuery.lastModified[ifModifiedKey] = modified;
            }
            modified = jqXHR.getResponseHeader('Etag');
            if (modified) {
              jQuery.etag[ifModifiedKey] = modified;
            }
          }
          // If not modified
          if (status === 304) {
            statusText = 'notmodified';
            isSuccess = true;  // If we have data
          } else {
            isSuccess = ajaxConvert(s, response);
            statusText = isSuccess.state;
            success = isSuccess.data;
            error = isSuccess.error;
            isSuccess = !error;
          }
        } else {
          // We extract error from statusText
          // then normalize statusText and status for non-aborts
          error = statusText;
          if (!statusText || status) {
            statusText = 'error';
            if (status < 0) {
              status = 0;
            }
          }
        }
        // Set data for the fake xhr object
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + '';
        // Success/Error
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [
            success,
            statusText,
            jqXHR
          ]);
        } else {
          deferred.rejectWith(callbackContext, [
            jqXHR,
            statusText,
            error
          ]);
        }
        // Status-dependent callbacks
        jqXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger('ajax' + (isSuccess ? 'Success' : 'Error'), [
            jqXHR,
            s,
            isSuccess ? success : error
          ]);
        }
        // Complete
        completeDeferred.fireWith(callbackContext, [
          jqXHR,
          statusText
        ]);
        if (fireGlobals) {
          globalEventContext.trigger('ajaxComplete', [
            jqXHR,
            s
          ]);
          // Handle the global AJAX counter
          if (!--jQuery.active) {
            jQuery.event.trigger('ajaxStop');
          }
        }
      }
      // Attach deferreds
      deferred.promise(jqXHR);
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      jqXHR.complete = completeDeferred.add;
      // Status-dependent callbacks
      jqXHR.statusCode = function (map) {
        if (map) {
          var tmp;
          if (state < 2) {
            for (tmp in map) {
              statusCode[tmp] = [
                statusCode[tmp],
                map[tmp]
              ];
            }
          } else {
            tmp = map[jqXHR.status];
            jqXHR.always(tmp);
          }
        }
        return this;
      };
      // Remove hash character (#7531: and string promotion)
      // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
      // We also use the url parameter if available
      s.url = ((url || s.url) + '').replace(rhash, '').replace(rprotocol, ajaxLocParts[1] + '//');
      // Extract dataTypes list
      s.dataTypes = jQuery.trim(s.dataType || '*').toLowerCase().split(core_rspace);
      // A cross-domain request is in order when we have a protocol:host:port mismatch
      if (s.crossDomain == null) {
        parts = rurl.exec(s.url.toLowerCase());
        s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === 'http:' ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === 'http:' ? 80 : 443))));
      }
      // Convert data if not already a string
      if (s.data && s.processData && typeof s.data !== 'string') {
        s.data = jQuery.param(s.data, s.traditional);
      }
      // Apply prefilters
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      // If request was aborted inside a prefilter, stop there
      if (state === 2) {
        return jqXHR;
      }
      // We can fire global events as of now if asked to
      fireGlobals = s.global;
      // Uppercase the type
      s.type = s.type.toUpperCase();
      // Determine if request has content
      s.hasContent = !rnoContent.test(s.type);
      // Watch for a new set of requests
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger('ajaxStart');
      }
      // More options handling for requests with no content
      if (!s.hasContent) {
        // If data is available, append data to url
        if (s.data) {
          s.url += (rquery.test(s.url) ? '&' : '?') + s.data;
          // #9682: remove data so that it's not used in an eventual retry
          delete s.data;
        }
        // Get ifModifiedKey before adding the anti-cache parameter
        ifModifiedKey = s.url;
        // Add anti-cache in url if needed
        if (s.cache === false) {
          var ts = jQuery.now(),
            // try replacing _= if it is there
            ret = s.url.replace(rts, '$1_=' + ts);
          // if nothing was replaced, add timestamp to the end
          s.url = ret + (ret === s.url ? (rquery.test(s.url) ? '&' : '?') + '_=' + ts : '');
        }
      }
      // Set the correct header, if data is being sent
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader('Content-Type', s.contentType);
      }
      // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      if (s.ifModified) {
        ifModifiedKey = ifModifiedKey || s.url;
        if (jQuery.lastModified[ifModifiedKey]) {
          jqXHR.setRequestHeader('If-Modified-Since', jQuery.lastModified[ifModifiedKey]);
        }
        if (jQuery.etag[ifModifiedKey]) {
          jqXHR.setRequestHeader('If-None-Match', jQuery.etag[ifModifiedKey]);
        }
      }
      // Set the Accepts header for the server, depending on the dataType
      jqXHR.setRequestHeader('Accept', s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '') : s.accepts['*']);
      // Check for headers option
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      // Allow custom headers/mimetypes and early abort
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
        // Abort if not done already and return
        return jqXHR.abort();
      }
      // aborting is no longer a cancellation
      strAbort = 'abort';
      // Install callbacks on deferreds
      for (i in {
          success: 1,
          error: 1,
          complete: 1
        }) {
        jqXHR[i](s[i]);
      }
      // Get transport
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      // If no transport, we auto-abort
      if (!transport) {
        done(-1, 'No Transport');
      } else {
        jqXHR.readyState = 1;
        // Send global event
        if (fireGlobals) {
          globalEventContext.trigger('ajaxSend', [
            jqXHR,
            s
          ]);
        }
        // Timeout
        if (s.async && s.timeout > 0) {
          timeoutTimer = setTimeout(function () {
            jqXHR.abort('timeout');
          }, s.timeout);
        }
        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          // Propagate exception as error if not done
          if (state < 2) {
            done(-1, e);  // Simply rethrow otherwise
          } else {
            throw e;
          }
        }
      }
      return jqXHR;
    },
    // Counter for holding the number of active queries
    active: 0,
    // Last-Modified header cache for next request
    lastModified: {},
    etag: {}
  });
  /* Handles responses to an ajax request:
   * - sets all responseXXX fields accordingly
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
    // Fill responseXXX fields
    for (type in responseFields) {
      if (type in responses) {
        jqXHR[responseFields[type]] = responses[type];
      }
    }
    // Remove auto dataType and get content-type in the process
    while (dataTypes[0] === '*') {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader('content-type');
      }
    }
    // Check if we're dealing with a known content-type
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    // Check to see if we have a response for the expected dataType
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      // Try convertible dataTypes
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + ' ' + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      // Or just use first one
      finalDataType = finalDataType || firstDataType;
    }
    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  // Chain conversions given the request and the original response
  function ajaxConvert(s, response) {
    var conv, conv2, current, tmp,
      // Work with a copy of dataTypes in case we need to modify it for conversion
      dataTypes = s.dataTypes.slice(), prev = dataTypes[0], converters = {}, i = 0;
    // Apply the dataFilter if provided
    if (s.dataFilter) {
      response = s.dataFilter(response, s.dataType);
    }
    // Create converters map with lowercased keys
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    // Convert to each sequential dataType, tolerating list modification
    for (; current = dataTypes[++i];) {
      // There's only work to do if current dataType is non-auto
      if (current !== '*') {
        // Convert response if prev dataType is non-auto and differs from current
        if (prev !== '*' && prev !== current) {
          // Seek a direct converter
          conv = converters[prev + ' ' + current] || converters['* ' + current];
          // If none found, seek a pair
          if (!conv) {
            for (conv2 in converters) {
              // If conv2 outputs current
              tmp = conv2.split(' ');
              if (tmp[1] === current) {
                // If prev can be converted to accepted input
                conv = converters[prev + ' ' + tmp[0]] || converters['* ' + tmp[0]];
                if (conv) {
                  // Condense equivalence converters
                  if (conv === true) {
                    conv = converters[conv2];  // Otherwise, insert the intermediate dataType
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.splice(i--, 0, current);
                  }
                  break;
                }
              }
            }
          }
          // Apply converter (if not an equivalence)
          if (conv !== true) {
            // Unless errors are allowed to bubble, catch and return them
            if (conv && s['throws']) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: 'parsererror',
                  error: conv ? e : 'No conversion from ' + prev + ' to ' + current
                };
              }
            }
          }
        }
        // Update prev for next iteration
        prev = current;
      }
    }
    return {
      state: 'success',
      data: response
    };
  }
  var oldCallbacks = [], rquestion = /\?/, rjsonp = /(=)\?(?=&|$)|\?\?/, nonce = jQuery.now();
  // Default jsonp settings
  jQuery.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function () {
      var callback = oldCallbacks.pop() || jQuery.expando + '_' + nonce++;
      this[callback] = true;
      return callback;
    }
  });
  // Detect, normalize options and install callbacks for jsonp requests
  jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
    var callbackName, overwritten, responseContainer, data = s.data, url = s.url, hasCallback = s.jsonp !== false, replaceInUrl = hasCallback && rjsonp.test(url), replaceInData = hasCallback && !replaceInUrl && typeof data === 'string' && !(s.contentType || '').indexOf('application/x-www-form-urlencoded') && rjsonp.test(data);
    // Handle iff the expected data type is "jsonp" or we have a parameter to set
    if (s.dataTypes[0] === 'jsonp' || replaceInUrl || replaceInData) {
      // Get callback name, remembering preexisting value associated with it
      callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
      overwritten = window[callbackName];
      // Insert callback into url or form data
      if (replaceInUrl) {
        s.url = url.replace(rjsonp, '$1' + callbackName);
      } else if (replaceInData) {
        s.data = data.replace(rjsonp, '$1' + callbackName);
      } else if (hasCallback) {
        s.url += (rquestion.test(url) ? '&' : '?') + s.jsonp + '=' + callbackName;
      }
      // Use data converter to retrieve json after script execution
      s.converters['script json'] = function () {
        if (!responseContainer) {
          jQuery.error(callbackName + ' was not called');
        }
        return responseContainer[0];
      };
      // force json dataType
      s.dataTypes[0] = 'json';
      // Install callback
      window[callbackName] = function () {
        responseContainer = arguments;
      };
      // Clean-up function (fires after converters)
      jqXHR.always(function () {
        // Restore preexisting value
        window[callbackName] = overwritten;
        // Save back as free
        if (s[callbackName]) {
          // make sure that re-using the options doesn't screw things around
          s.jsonpCallback = originalSettings.jsonpCallback;
          // save the callback name for future use
          oldCallbacks.push(callbackName);
        }
        // Call if it was a function and we have a response
        if (responseContainer && jQuery.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      // Delegate to script
      return 'script';
    }
  });
  // Install script dataType
  jQuery.ajaxSetup({
    accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
    contents: { script: /javascript|ecmascript/ },
    converters: {
      'text script': function (text) {
        jQuery.globalEval(text);
        return text;
      }
    }
  });
  // Handle cache's special case and global
  jQuery.ajaxPrefilter('script', function (s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = 'GET';
      s.global = false;
    }
  });
  // Bind script tag hack transport
  jQuery.ajaxTransport('script', function (s) {
    // This transport only deals with cross domain requests
    if (s.crossDomain) {
      var script, head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      return {
        send: function (_, callback) {
          script = document.createElement('script');
          script.async = 'async';
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          // Attach handlers for all browsers
          script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
              // Handle memory leak in IE
              script.onload = script.onreadystatechange = null;
              // Remove the script
              if (head && script.parentNode) {
                head.removeChild(script);
              }
              // Dereference the script
              script = undefined;
              // Callback if not abort
              if (!isAbort) {
                callback(200, 'success');
              }
            }
          };
          // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
          // This arises when a base node is used (#2709 and #4378).
          head.insertBefore(script, head.firstChild);
        },
        abort: function () {
          if (script) {
            script.onload(0, 1);
          }
        }
      };
    }
  });
  var xhrCallbacks,
    // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject ? function () {
      // Abort all pending requests
      for (var key in xhrCallbacks) {
        xhrCallbacks[key](0, 1);
      }
    } : false, xhrId = 0;
  // Functions to create xhrs
  function createStandardXHR() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {
    }
  }
  function createActiveXHR() {
    try {
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
    }
  }
  // Create the request object
  // (This is still attached to ajaxSettings for backward compatibility)
  jQuery.ajaxSettings.xhr = window.ActiveXObject ? /* Microsoft failed to properly
  * implement the XMLHttpRequest in IE7 (can't request local files),
  * so we use the ActiveXObject when it is available
  * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
  * we need a fallback.
  */
  function () {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } : // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;
  // Determine support properties
  (function (xhr) {
    jQuery.extend(jQuery.support, {
      ajax: !!xhr,
      cors: !!xhr && 'withCredentials' in xhr
    });
  }(jQuery.ajaxSettings.xhr()));
  // Create transport if the browser can provide an xhr
  if (jQuery.support.ajax) {
    jQuery.ajaxTransport(function (s) {
      // Cross domain only allowed if supported through XMLHttpRequest
      if (!s.crossDomain || jQuery.support.cors) {
        var callback;
        return {
          send: function (headers, complete) {
            // Get a new xhr
            var handle, i, xhr = s.xhr();
            // Open the socket
            // Passing null username, generates a login popup on Opera (#2865)
            if (s.username) {
              xhr.open(s.type, s.url, s.async, s.username, s.password);
            } else {
              xhr.open(s.type, s.url, s.async);
            }
            // Apply custom fields if provided
            if (s.xhrFields) {
              for (i in s.xhrFields) {
                xhr[i] = s.xhrFields[i];
              }
            }
            // Override mime type if needed
            if (s.mimeType && xhr.overrideMimeType) {
              xhr.overrideMimeType(s.mimeType);
            }
            // X-Requested-With header
            // For cross-domain requests, seeing as conditions for a preflight are
            // akin to a jigsaw puzzle, we simply never set it to be sure.
            // (it can always be set on a per-request basis or even using ajaxSetup)
            // For same-domain requests, won't change header if already provided.
            if (!s.crossDomain && !headers['X-Requested-With']) {
              headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            // Need an extra try/catch for cross domain requests in Firefox 3
            try {
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
            } catch (_) {
            }
            // Do send the request
            // This may raise an exception which is actually
            // handled in jQuery.ajax (so no try/catch here)
            xhr.send(s.hasContent && s.data || null);
            // Listener
            callback = function (_, isAbort) {
              var status, statusText, responseHeaders, responses, xml;
              // Firefox throws exceptions when accessing properties
              // of an xhr when a network error occurred
              // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
              try {
                // Was never called and is aborted or complete
                if (callback && (isAbort || xhr.readyState === 4)) {
                  // Only called once
                  callback = undefined;
                  // Do not keep as active anymore
                  if (handle) {
                    xhr.onreadystatechange = jQuery.noop;
                    if (xhrOnUnloadAbort) {
                      delete xhrCallbacks[handle];
                    }
                  }
                  // If it's an abort
                  if (isAbort) {
                    // Abort it manually if needed
                    if (xhr.readyState !== 4) {
                      xhr.abort();
                    }
                  } else {
                    status = xhr.status;
                    responseHeaders = xhr.getAllResponseHeaders();
                    responses = {};
                    xml = xhr.responseXML;
                    // Construct response list
                    if (xml && xml.documentElement) {
                      responses.xml = xml;
                    }
                    // When requesting binary data, IE6-9 will throw an exception
                    // on any attempt to access responseText (#11426)
                    try {
                      responses.text = xhr.responseText;
                    } catch (e) {
                    }
                    // Firefox throws an exception when accessing
                    // statusText for faulty cross-domain requests
                    try {
                      statusText = xhr.statusText;
                    } catch (e) {
                      // We normalize with Webkit giving an empty statusText
                      statusText = '';
                    }
                    // Filter status for non standard behaviors
                    // If the request is local and we have data: assume a success
                    // (success with no data won't get notified, that's the best we
                    // can do given current implementations)
                    if (!status && s.isLocal && !s.crossDomain) {
                      status = responses.text ? 200 : 404;  // IE - #1450: sometimes returns 1223 when it should be 204
                    } else if (status === 1223) {
                      status = 204;
                    }
                  }
                }
              } catch (firefoxAccessException) {
                if (!isAbort) {
                  complete(-1, firefoxAccessException);
                }
              }
              // Call complete if needed
              if (responses) {
                complete(status, statusText, responses, responseHeaders);
              }
            };
            if (!s.async) {
              // if we're in sync mode we fire the callback
              callback();
            } else if (xhr.readyState === 4) {
              // (IE6 & IE7) if it's in cache and has been
              // retrieved directly we need to fire the callback
              setTimeout(callback, 0);
            } else {
              handle = ++xhrId;
              if (xhrOnUnloadAbort) {
                // Create the active xhrs callbacks list if needed
                // and attach the unload handler
                if (!xhrCallbacks) {
                  xhrCallbacks = {};
                  jQuery(window).unload(xhrOnUnloadAbort);
                }
                // Add to list of active xhrs callbacks
                xhrCallbacks[handle] = callback;
              }
              xhr.onreadystatechange = callback;
            }
          },
          abort: function () {
            if (callback) {
              callback(0, 1);
            }
          }
        };
      }
    });
  }
  var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp('^(?:([-+])=|)(' + core_pnum + ')([a-z%]*)$', 'i'), rrun = /queueHooks$/, animationPrefilters = [defaultPrefilter], tweeners = {
      '*': [function (prop, value) {
          var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;
          if (parts) {
            end = +parts[2];
            unit = parts[3] || (jQuery.cssNumber[prop] ? '' : 'px');
            // We need to compute starting value
            if (unit !== 'px' && start) {
              // Iteratively approximate from a nonzero starting point
              // Prefer the current property, because this process will be trivial if it uses the same units
              // Fallback to end or a simple constant
              start = jQuery.css(tween.elem, prop, true) || end || 1;
              do {
                // If previous iteration zeroed out, double until we get *something*
                // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                scale = scale || '.5';
                // Adjust and apply
                start = start / scale;
                jQuery.style(tween.elem, prop, start + unit);  // Update scale, tolerating zero or NaN from tween.cur()
                                                               // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
              } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
            }
            tween.unit = unit;
            tween.start = start;
            // If a +=/-= token was provided, we're doing a relative animation
            tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
          }
          return tween;
        }]
    };
  // Animations created synchronously will run synchronously
  function createFxNow() {
    setTimeout(function () {
      fxNow = undefined;
    }, 0);
    return fxNow = jQuery.now();
  }
  function createTweens(animation, props) {
    jQuery.each(props, function (prop, value) {
      var collection = (tweeners[prop] || []).concat(tweeners['*']), index = 0, length = collection.length;
      for (; index < length; index++) {
        if (collection[index].call(animation, prop, value)) {
          // we're done with this property
          return;
        }
      }
    });
  }
  function Animation(elem, properties, options) {
    var result, index = 0, tweenerIndex = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function () {
        // don't match elem in the :animated selector
        delete tick.elem;
      }), tick = function () {
        var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
          // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
          temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;
        for (; index < length; index++) {
          animation.tweens[index].run(percent);
        }
        deferred.notifyWith(elem, [
          animation,
          percent,
          remaining
        ]);
        if (percent < 1 && length) {
          return remaining;
        } else {
          deferred.resolveWith(elem, [animation]);
          return false;
        }
      }, animation = deferred.promise({
        elem: elem,
        props: jQuery.extend({}, properties),
        opts: jQuery.extend(true, { specialEasing: {} }, options),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function (prop, end, easing) {
          var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
          animation.tweens.push(tween);
          return tween;
        },
        stop: function (gotoEnd) {
          var index = 0,
            // if we are going to the end, we want to run all the tweens
            // otherwise we skip this part
            length = gotoEnd ? animation.tweens.length : 0;
          for (; index < length; index++) {
            animation.tweens[index].run(1);
          }
          // resolve when we played the last frame
          // otherwise, reject
          if (gotoEnd) {
            deferred.resolveWith(elem, [
              animation,
              gotoEnd
            ]);
          } else {
            deferred.rejectWith(elem, [
              animation,
              gotoEnd
            ]);
          }
          return this;
        }
      }), props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = animationPrefilters[index].call(animation, elem, props, animation.opts);
      if (result) {
        return result;
      }
    }
    createTweens(animation, props);
    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    jQuery.fx.timer(jQuery.extend(tick, {
      anim: animation,
      queue: animation.opts.queue,
      elem: elem
    }));
    // attach callbacks from options
    return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;
    // camelCase, specialEasing and expand cssHook pass
    for (index in props) {
      name = jQuery.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (jQuery.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = jQuery.cssHooks[name];
      if (hooks && 'expand' in hooks) {
        value = hooks.expand(value);
        delete props[name];
        // not quite $.extend, this wont overwrite keys already present.
        // also - reusing 'index' from above because we have the correct "name"
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  jQuery.Animation = jQuery.extend(Animation, {
    tweener: function (props, callback) {
      if (jQuery.isFunction(props)) {
        callback = props;
        props = ['*'];
      } else {
        props = props.split(' ');
      }
      var prop, index = 0, length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        tweeners[prop] = tweeners[prop] || [];
        tweeners[prop].unshift(callback);
      }
    },
    prefilter: function (callback, prepend) {
      if (prepend) {
        animationPrefilters.unshift(callback);
      } else {
        animationPrefilters.push(callback);
      }
    }
  });
  function defaultPrefilter(elem, props, opts) {
    var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);
    // handle queue: false promises
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, 'fx');
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function () {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function () {
        // doing this makes sure that the complete handler will be called
        // before this completes
        anim.always(function () {
          hooks.unqueued--;
          if (!jQuery.queue(elem, 'fx').length) {
            hooks.empty.fire();
          }
        });
      });
    }
    // height/width overflow pass
    if (elem.nodeType === 1 && ('height' in props || 'width' in props)) {
      // Make sure that nothing sneaks out
      // Record all 3 overflow attributes because IE does not
      // change the overflow attribute when overflowX and
      // overflowY are set to the same value
      opts.overflow = [
        style.overflow,
        style.overflowX,
        style.overflowY
      ];
      // Set display property to inline-block for height/width
      // animations on inline elements that are having width/height animated
      if (jQuery.css(elem, 'display') === 'inline' && jQuery.css(elem, 'float') === 'none') {
        // inline-level elements accept inline-block;
        // block-level elements need to be inline with layout
        if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === 'inline') {
          style.display = 'inline-block';
        } else {
          style.zoom = 1;
        }
      }
    }
    if (opts.overflow) {
      style.overflow = 'hidden';
      if (!jQuery.support.shrinkWrapBlocks) {
        anim.done(function () {
          style.overflow = opts.overflow[0];
          style.overflowX = opts.overflow[1];
          style.overflowY = opts.overflow[2];
        });
      }
    }
    // show/hide pass
    for (index in props) {
      value = props[index];
      if (rfxtypes.exec(value)) {
        delete props[index];
        toggle = toggle || value === 'toggle';
        if (value === (hidden ? 'hide' : 'show')) {
          continue;
        }
        handled.push(index);
      }
    }
    length = handled.length;
    if (length) {
      dataShow = jQuery._data(elem, 'fxshow') || jQuery._data(elem, 'fxshow', {});
      if ('hidden' in dataShow) {
        hidden = dataShow.hidden;
      }
      // store state if its toggle - enables .stop().toggle() to "reverse"
      if (toggle) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function () {
          jQuery(elem).hide();
        });
      }
      anim.done(function () {
        var prop;
        jQuery.removeData(elem, 'fxshow', true);
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (index = 0; index < length; index++) {
        prop = handled[index];
        tween = anim.createTween(prop, hidden ? dataShow[prop] : 0);
        orig[prop] = dataShow[prop] || jQuery.style(elem, prop);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = prop === 'width' || prop === 'height' ? 1 : 0;
          }
        }
      }
    }
  }
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function (elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || 'swing';
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
    },
    cur: function () {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function (percent) {
      var eased, hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default: {
      get: function (tween) {
        var result;
        if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
          return tween.elem[tween.prop];
        }
        // passing any value as a 4th parameter to .css will automatically
        // attempt a parseFloat and fallback to a string if the parse fails
        // so, simple values such as "10px" are parsed to Float.
        // complex values such as "rotate(1rad)" are returned as is.
        result = jQuery.css(tween.elem, tween.prop, false, '');
        // Empty strings, null, undefined and "auto" are converted to 0.
        return !result || result === 'auto' ? 0 : result;
      },
      set: function (tween) {
        // use step hook for back compat - use cssHook if its there - use .style if its
        // available and use plain properties where available
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  // Remove in 2.0 - this supports IE8's panic based approach
  // to setting things on disconnected nodes
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function (tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }
  };
  jQuery.each([
    'toggle',
    'show',
    'hide'
  ], function (i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function (speed, easing, callback) {
      return speed == null || typeof speed === 'boolean' || !i && jQuery.isFunction(speed) && jQuery.isFunction(easing) ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  jQuery.fn.extend({
    fadeTo: function (speed, to, easing, callback) {
      // show any hidden elements after setting opacity to 0
      return this.filter(isHidden).css('opacity', 0).show()  // animate to the value specified
.end().animate({ opacity: to }, speed, easing, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function () {
          // Operate on a copy of prop so per-property easing won't be lost
          var anim = Animation(this, jQuery.extend({}, prop), optall);
          // Empty animations resolve immediately
          if (empty) {
            anim.stop(true);
          }
        };
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function (type, clearQueue, gotoEnd) {
      var stopQueue = function (hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== 'string') {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || 'fx', []);
      }
      return this.each(function () {
        var dequeue = true, index = type != null && type + 'queueHooks', timers = jQuery.timers, data = jQuery._data(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--;) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        // start the next in the queue if the last step wasn't forced
        // timers currently will call their complete callbacks, which will dequeue
        // but only if they were gotoEnd
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    }
  });
  // Generate parameters to create a standard animation
  function genFx(type, includeWidth) {
    var which, attrs = { height: type }, i = 0;
    // if we include width, step value is 1 to do all cssExpand values,
    // if we don't include width, step value is 2 to skip over Left and Right
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs['margin' + which] = attrs['padding' + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  // Generate shortcuts for custom animations
  jQuery.each({
    slideDown: genFx('show'),
    slideUp: genFx('hide'),
    slideToggle: genFx('toggle'),
    fadeIn: { opacity: 'show' },
    fadeOut: { opacity: 'hide' },
    fadeToggle: { opacity: 'toggle' }
  }, function (name, props) {
    jQuery.fn[name] = function (speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery.speed = function (speed, easing, fn) {
    var opt = speed && typeof speed === 'object' ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
    };
    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === 'number' ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
    // normalize opt.queue - true/undefined/null -> "fx"
    if (opt.queue == null || opt.queue === true) {
      opt.queue = 'fx';
    }
    // Queueing
    opt.old = opt.complete;
    opt.complete = function () {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery.easing = {
    linear: function (p) {
      return p;
    },
    swing: function (p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  jQuery.timers = [];
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.tick = function () {
    var timer, timers = jQuery.timers, i = 0;
    fxNow = jQuery.now();
    for (; i < timers.length; i++) {
      timer = timers[i];
      // Checks the timer has not already been removed
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };
  jQuery.fx.timer = function (timer) {
    if (timer() && jQuery.timers.push(timer) && !timerId) {
      timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  jQuery.fx.interval = 13;
  jQuery.fx.stop = function () {
    clearInterval(timerId);
    timerId = null;
  };
  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  };
  // Back Compat <1.8 extension point
  jQuery.fx.step = {};
  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.animated = function (elem) {
      return jQuery.grep(jQuery.timers, function (fn) {
        return elem === fn.elem;
      }).length;
    };
  }
  var rroot = /^(?:body|html)$/i;
  jQuery.fn.offset = function (options) {
    if (arguments.length) {
      return options === undefined ? this : this.each(function (i) {
        jQuery.offset.setOffset(this, options, i);
      });
    }
    var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, box = {
        top: 0,
        left: 0
      }, elem = this[0], doc = elem && elem.ownerDocument;
    if (!doc) {
      return;
    }
    if ((body = doc.body) === elem) {
      return jQuery.offset.bodyOffset(elem);
    }
    docElem = doc.documentElement;
    // Make sure it's not a disconnected DOM node
    if (!jQuery.contains(docElem, elem)) {
      return box;
    }
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== 'undefined') {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    clientTop = docElem.clientTop || body.clientTop || 0;
    clientLeft = docElem.clientLeft || body.clientLeft || 0;
    scrollTop = win.pageYOffset || docElem.scrollTop;
    scrollLeft = win.pageXOffset || docElem.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  };
  jQuery.offset = {
    bodyOffset: function (body) {
      var top = body.offsetTop, left = body.offsetLeft;
      if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
        top += parseFloat(jQuery.css(body, 'marginTop')) || 0;
        left += parseFloat(jQuery.css(body, 'marginLeft')) || 0;
      }
      return {
        top: top,
        left: left
      };
    },
    setOffset: function (elem, options, i) {
      var position = jQuery.css(elem, 'position');
      // set position first, in-case top/left are set even on static elem
      if (position === 'static') {
        elem.style.position = 'relative';
      }
      var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, 'top'), curCSSLeft = jQuery.css(elem, 'left'), calculatePosition = (position === 'absolute' || position === 'fixed') && jQuery.inArray('auto', [
          curCSSTop,
          curCSSLeft
        ]) > -1, props = {}, curPosition = {}, curTop, curLeft;
      // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ('using' in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    position: function () {
      if (!this[0]) {
        return;
      }
      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset();
      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top -= parseFloat(jQuery.css(elem, 'marginTop')) || 0;
      offset.left -= parseFloat(jQuery.css(elem, 'marginLeft')) || 0;
      // Add offsetParent borders
      parentOffset.top += parseFloat(jQuery.css(offsetParent[0], 'borderTopWidth')) || 0;
      parentOffset.left += parseFloat(jQuery.css(offsetParent[0], 'borderLeftWidth')) || 0;
      // Subtract the two offsets
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      };
    },
    offsetParent: function () {
      return this.map(function () {
        var offsetParent = this.offsetParent || document.body;
        while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, 'position') === 'static')) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || document.body;
      });
    }
  });
  // Create scrollLeft and scrollTop methods
  jQuery.each({
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
  }, function (method, prop) {
    var top = /Y/.test(prop);
    jQuery.fn[method] = function (val) {
      return jQuery.access(this, function (elem, method, val) {
        var win = getWindow(elem);
        if (val === undefined) {
          return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
        }
        if (win) {
          win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length, null);
    };
  });
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
  }
  // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
  jQuery.each({
    Height: 'height',
    Width: 'width'
  }, function (name, type) {
    jQuery.each({
      padding: 'inner' + name,
      content: type,
      '': 'outer' + name
    }, function (defaultExtra, funcName) {
      // margin is only for outerHeight, outerWidth
      jQuery.fn[funcName] = function (margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean'), extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
        return jQuery.access(this, function (elem, type, value) {
          var doc;
          if (jQuery.isWindow(elem)) {
            // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
            // isn't a whole lot we can do. See pull request at this URL for discussion:
            // https://github.com/jquery/jquery/pull/764
            return elem.document.documentElement['client' + name];
          }
          // Get document width or height
          if (elem.nodeType === 9) {
            doc = elem.documentElement;
            // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
            // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
            return Math.max(elem.body['scroll' + name], doc['scroll' + name], elem.body['offset' + name], doc['offset' + name], doc['client' + name]);
          }
          return value === undefined ? // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css(elem, type, value, extra) : // Set width or height on the element
          jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable, null);
      };
    });
  });
  // Expose jQuery to the global object
  window.jQuery = window.$ = jQuery;
  // Expose jQuery as an AMD module, but only for AMD loaders that
  // understand the issues with loading multiple versions of jQuery
  // in a page that all might call define(). The loader will indicate
  // they have special allowances for multiple jQuery versions by
  // specifying define.amd.jQuery = true. Register as a named module,
  // since jQuery can be concatenated with other files that may use define,
  // but not use a proper concatenation script that understands anonymous
  // AMD modules. A named AMD is safest and most robust way to register.
  // Lowercase jquery is used because AMD module names are derived from
  // file names, and jQuery is normally delivered in a lowercase file name.
  // Do this after creating the global so that if an AMD module wants to call
  // noConflict to hide this version of jQuery, it will work.
  if (true) {
    jquery = function () {
      return jQuery;
    }();
  }
}(window));
/*==================================================
 smcore.js 1.42
 ==================================================*/
(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // For CommonJS and CommonJS-like environments where a proper `window`
    // is present, execute the factory and get smcore.
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    // e.g. var smcore = require("smcore")(window);
    module.exports = global.document ? factory(global, true) : function (w) {
      if (!w.document) {
        throw new Error('smcore requires a window with a document');
      }
      return factory(w);
    };
  } else {
    factory(global);
  }  // Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  /*********************************************************************
   *                    全局变量及方法                                  *
   **********************************************************************/
  var expose = new Date() - 0;
  //http://stackoverflow.com/questions/7290086/javascript-use-strict-and-nicks-find-global-function
  var DOC = window.document;
  var head = DOC.getElementsByTagName('head')[0];
  //HEAD元素
  var ifGroup = head.insertBefore(document.createElement('smcore'), head.firstChild);
  //避免IE6 base标签BUG
  ifGroup.innerHTML = 'X<style id=\'smcoreStyle\'>.smcoreHide{ display: none!important }</style>';
  ifGroup.setAttribute('vm-skip', '1');
  ifGroup.className = 'smcoreHide';
  var rnative = /\[native code\]/;
  //判定是否原生函数
  function log() {
    if (window.console && smcore.config.debug) {
      // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
      Function.apply.call(console.log, console, arguments);
    }
  }
  var subscribers = '$' + expose;
  var otherRequire = window.require;
  var otherDefine = window.define;
  var innerRequire;
  var stopRepeatAssign = false;
  var rword = /[^, ]+/g;
  //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
  var rcomplexType = /^(?:object|array)$/;
  var rsvg = /^\[object SVG\w*Element\]$/;
  var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
  var oproto = Object.prototype;
  var ohasOwn = oproto.hasOwnProperty;
  var serialize = oproto.toString;
  var ap = Array.prototype;
  var aslice = ap.slice;
  var Registry = {};
  //将函数曝光到此对象上，方便访问器收集依赖
  var W3C = window.dispatchEvent;
  var root = DOC.documentElement;
  var hyperspace = DOC.createDocumentFragment();
  var cinerator = DOC.createElement('div');
  var class2type = {};
  'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function (name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });
  function noop() {
  }
  function oneObject(array, val) {
    if (typeof array === 'string') {
      array = array.match(rword) || [];
    }
    var result = {}, value = val !== void 0 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
      result[array[i]] = value;
    }
    return result;
  }
  //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  var generateID = function (prefix) {
    prefix = prefix || 'smcore';
    return (prefix + Math.random() + Math.random()).replace(/0\./g, '');
  };
  function IE() {
    if (window.VBArray) {
      var mode = document.documentMode;
      return mode ? mode : window.XMLHttpRequest ? 7 : 6;
    } else {
      return 0;
    }
  }
  var IEVersion = IE();
  smcore = function (el) {
    //创建jQuery式的无new 实例化结构
    return new smcore.init(el);
  };
  /*视浏览器情况采用最快的异步回调*/
  smcore.nextTick = new function () {
    // jshint ignore:line
    var tickImmediate = window.setImmediate;
    var tickObserver = window.MutationObserver;
    var tickPost = W3C && window.postMessage;
    if (tickImmediate) {
      return tickImmediate.bind(window);
    }
    var queue = [];
    function callback() {
      var n = queue.length;
      for (var i = 0; i < n; i++) {
        queue[i]();
      }
      queue = queue.slice(n);
    }
    if (tickObserver) {
      var node = document.createTextNode('smcore');
      new tickObserver(callback).observe(node, { characterData: true });
      // jshint ignore:line
      return function (fn) {
        queue.push(fn);
        node.data = Math.random();
      };
    }
    if (tickPost) {
      window.addEventListener('message', function (e) {
        var source = e.source;
        if ((source === window || source === null) && e.data === 'process-tick') {
          e.stopPropagation();
          callback();
        }
      });
      return function (fn) {
        queue.push(fn);
        window.postMessage('process-tick', '*');
      };
    }
    return function (fn) {
      setTimeout(fn, 0);
    };
  }();
  // jshint ignore:line
  /*********************************************************************
   *                 smcore的静态方法定义区                              *
   **********************************************************************/
  smcore.init = function (el) {
    this[0] = this.element = el;
  };
  smcore.fn = smcore.prototype = smcore.init.prototype;
  smcore.type = function (obj) {
    //取得目标的类型
    if (obj == null) {
      return String(obj);
    }
    // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[serialize.call(obj)] || 'object' : typeof obj;
  };
  var isFunction = typeof alert === 'object' ? function (fn) {
    try {
      return /^\s*\bfunction\b/.test(fn + '');
    } catch (e) {
      return false;
    }
  } : function (fn) {
    return serialize.call(fn) === '[object Function]';
  };
  smcore.isFunction = isFunction;
  smcore.isWindow = function (obj) {
    if (!obj)
      return false;
    // 利用IE678 window == document为true,document == window竟然为false的神奇特性
    // 标准浏览器及IE9，IE10等使用 正则检测
    return obj == obj.document && obj.document != obj  //jshint ignore:line
;
  };
  function isWindow(obj) {
    return rwindow.test(serialize.call(obj));
  }
  if (isWindow(window)) {
    smcore.isWindow = isWindow;
  }
  var enu;
  for (enu in smcore({})) {
    break;
  }
  var enumerateBUG = enu !== '0';
  //IE6下为true, 其他为false
  /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
  smcore.isPlainObject = function (obj, key) {
    if (!obj || smcore.type(obj) !== 'object' || obj.nodeType || smcore.isWindow(obj)) {
      return false;
    }
    try {
      //IE内置对象没有constructor
      if (obj.constructor && !ohasOwn.call(obj, 'constructor') && !ohasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
      }
    } catch (e) {
      //IE8 9会在这里抛错
      return false;
    }
    if (enumerateBUG) {
      for (key in obj) {
        return ohasOwn.call(obj, key);
      }
    }
    for (key in obj) {
    }
    return key === void 0 || ohasOwn.call(obj, key);
  };
  if (rnative.test(Object.getPrototypeOf)) {
    smcore.isPlainObject = function (obj) {
      // 简单的 typeof obj === "object"检测，会致使用isPlainObject(window)在opera下通不过
      return serialize.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === oproto;
    };
  }
  //与jQuery.extend方法，可用于浅拷贝，深拷贝
  smcore.mix = smcore.fn.mix = function () {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    // 如果第一个参数为布尔,判定是否深拷贝
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      i++;
    }
    //确保接受方为一个复杂的数据类型
    if (typeof target !== 'object' && !isFunction(target)) {
      target = {};
    }
    //如果只有一个参数，那么新成员添加于mix所在的对象上
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      //只处理非空参数
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          try {
            copy = options[name]  //当options为VBS对象时报错
;
          } catch (e) {
            continue;
          }
          // 防止环引用
          if (target === copy) {
            continue;
          }
          if (deep && copy && (smcore.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && smcore.isPlainObject(src) ? src : {};
            }
            target[name] = smcore.mix(deep, clone, copy);
          } else if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  function _number(a, len) {
    //用于模拟slice, splice的效果
    a = Math.floor(a) || 0;
    return a < 0 ? Math.max(len + a, 0) : Math.min(a, len);
  }
  smcore.mix({
    rword: rword,
    subscribers: subscribers,
    version: 1.42,
    ui: {},
    log: log,
    slice: W3C ? function (nodes, start, end) {
      return aslice.call(nodes, start, end);
    } : function (nodes, start, end) {
      var ret = [];
      var len = nodes.length;
      if (end === void 0)
        end = len;
      if (typeof end === 'number' && isFinite(end)) {
        start = _number(start, len);
        end = _number(end, len);
        for (var i = start; i < end; ++i) {
          ret[i - start] = nodes[i];
        }
      }
      return ret;
    },
    noop: noop,
    /*如果不用Error对象封装一下，str在控制台下可能会乱码*/
    error: function (str, e) {
      throw (e || Error)(str);
    },
    /*将一个以空格或逗号隔开的字符串或数组,转换成一个键值都为1的对象*/
    oneObject: oneObject,
    /* smcore.range(10)
     => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     smcore.range(1, 11)
     => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     smcore.range(0, 30, 5)
     => [0, 5, 10, 15, 20, 25]
     smcore.range(0, -10, -1)
     => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     smcore.range(0)
     => []*/
    range: function (start, end, step) {
      // 用于生成整数数组
      step || (step = 1);
      if (end == null) {
        end = start || 0;
        start = 0;
      }
      var index = -1, length = Math.max(0, Math.ceil((end - start) / step)), result = new Array(length);
      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    },
    eventHooks: {},
    /*绑定事件*/
    bind: function (el, type, fn, phase) {
      var hooks = smcore.eventHooks;
      var hook = hooks[type];
      if (typeof hook === 'object') {
        type = hook.type;
        if (hook.deel) {
          fn = hook.deel(el, type, fn, phase);
        }
      }
      var callback = W3C ? fn : function (e) {
        fn.call(el, fixEvent(e));
      };
      if (W3C) {
        el.addEventListener(type, callback, !!phase);
      } else {
        el.attachEvent('on' + type, callback);
      }
      return callback;
    },
    /*卸载事件*/
    unbind: function (el, type, fn, phase) {
      var hooks = smcore.eventHooks;
      var hook = hooks[type];
      var callback = fn || noop;
      if (typeof hook === 'object') {
        type = hook.type;
        if (hook.deel) {
          fn = hook.deel(el, type, fn, false);
        }
      }
      if (W3C) {
        el.removeEventListener(type, callback, !!phase);
      } else {
        el.detachEvent('on' + type, callback);
      }
    },
    /*读写删除元素节点的样式*/
    css: function (node, name, value) {
      if (node instanceof smcore) {
        node = node[0];
      }
      var prop = /[_-]/.test(name) ? camelize(name) : name, fn;
      name = smcore.cssName(prop) || prop;
      if (value === void 0 || typeof value === 'boolean') {
        //获取样式
        fn = cssHooks[prop + ':get'] || cssHooks['@:get'];
        if (name === 'background') {
          name = 'backgroundColor';
        }
        var val = fn(node, name);
        return value === true ? parseFloat(val) || 0 : val;
      } else if (value === '') {
        //请除样式
        node.style[name] = '';
      } else {
        //设置样式
        if (value == null || value !== value) {
          return;
        }
        if (isFinite(value) && !smcore.cssNumber[prop]) {
          value += 'px';
        }
        fn = cssHooks[prop + ':set'] || cssHooks['@:set'];
        fn(node, name, value);
      }
    },
    /*遍历数组与对象,回调的第一个参数为索引或键名,第二个或元素或键值*/
    each: function (obj, fn) {
      if (obj) {
        //排除null, undefined
        var i = 0;
        if (isArrayLike(obj)) {
          for (var n = obj.length; i < n; i++) {
            if (fn(i, obj[i]) === false)
              break;
          }
        } else {
          for (i in obj) {
            if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
              break;
            }
          }
        }
      }
    },
    //收集元素的data-{{prefix}}-*属性，并转换为对象
    getWidgetData: function (elem, prefix) {
      var raw = smcore(elem).data();
      var result = {};
      for (var i in raw) {
        if (i.indexOf(prefix) === 0) {
          result[i.replace(prefix, '').replace(/\w/, function (a) {
            return a.toLowerCase();
          })] = raw[i];
        }
      }
      return result;
    },
    Array: {
      /*只有当前数组不存在此元素时只添加它*/
      ensure: function (target, item) {
        if (target.indexOf(item) === -1) {
          return target.push(item);
        }
      },
      /*移除数组中指定位置的元素，返回布尔表示成功与否*/
      removeAt: function (target, index) {
        return !!target.splice(index, 1).length;
      },
      /*移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否*/
      remove: function (target, item) {
        var index = target.indexOf(item);
        if (~index)
          return smcore.Array.removeAt(target, index);
        return false;
      }
    }
  });
  var bindingHandlers = smcore.bindingHandlers = {};
  var bindingExecutors = smcore.bindingExecutors = {};
  /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
  function isArrayLike(obj) {
    if (!obj)
      return false;
    var n = obj.length;
    if (n === n >>> 0) {
      //检测length属性是否为非负整数
      var type = serialize.call(obj).slice(8, -1);
      if (/(?:regexp|string|function|window|global)$/i.test(type))
        return false;
      if (type === 'Array')
        return true;
      try {
        if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
          //如果是原生对象
          return /^\s?function/.test(obj.item || obj.callee);
        }
        return true;
      } catch (e) {
        //IE的NodeList直接抛错
        return !obj.window;
      }
    }
    return false;
  }
  // https://github.com/rsms/js-lru
  var Cache = new function () {
    // jshint ignore:line
    function LRU(maxLength) {
      this.size = 0;
      this.limit = maxLength;
      this.head = this.tail = void 0;
      this._keymap = {};
    }
    var p = LRU.prototype;
    p.put = function (key, value) {
      var entry = {
        key: key,
        value: value
      };
      this._keymap[key] = entry;
      if (this.tail) {
        this.tail.newer = entry;
        entry.older = this.tail;
      } else {
        this.head = entry;
      }
      this.tail = entry;
      if (this.size === this.limit) {
        this.shift();
      } else {
        this.size++;
      }
      return value;
    };
    p.shift = function () {
      var entry = this.head;
      if (entry) {
        this.head = this.head.newer;
        this.head.older = entry.newer = entry.older = this._keymap[entry.key] = void 0;
      }
    };
    p.get = function (key) {
      var entry = this._keymap[key];
      if (entry === void 0)
        return;
      if (entry === this.tail) {
        return entry.value;
      }
      // HEAD--------------TAIL
      //   <.older   .newer>
      //  <--- add direction --
      //   A  B  C  <D>  E
      if (entry.newer) {
        if (entry === this.head) {
          this.head = entry.newer;
        }
        entry.newer.older = entry.older;
      }
      if (entry.older) {
        entry.older.newer = entry.newer;
      }
      entry.newer = void 0;
      // D --x
      entry.older = this.tail;
      // D. --> E
      if (this.tail) {
        this.tail.newer = entry  // E. <-- D
;
      }
      this.tail = entry;
      return entry.value;
    };
    return LRU;
  }();
  // jshint ignore:line
  /*********************************************************************
   *                         javascript 底层补丁                       *
   **********************************************************************/
  if (!'\u91D1\u6208\u94C1\u9A6C'.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function () {
      return this.replace(rtrim, '');
    };
  }
  var hasDontEnumBug = !{ 'toString': null }.propertyIsEnumerable('toString'), hasProtoEnumBug = function () {
    }.propertyIsEnumerable('prototype'), dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ], dontEnumsLength = dontEnums.length;
  if (!Object.keys) {
    Object.keys = function (object) {
      //ecma262v5 15.2.3.14
      var theKeys = [];
      var skipProto = hasProtoEnumBug && typeof object === 'function';
      if (typeof object === 'string' || object && object.callee) {
        for (var i = 0; i < object.length; ++i) {
          theKeys.push(String(i));
        }
      } else {
        for (var name in object) {
          if (!(skipProto && name === 'prototype') && ohasOwn.call(object, name)) {
            theKeys.push(String(name));
          }
        }
      }
      if (hasDontEnumBug) {
        var ctor = object.constructor, skipConstructor = ctor && ctor.prototype === object;
        for (var j = 0; j < dontEnumsLength; j++) {
          var dontEnum = dontEnums[j];
          if (!(skipConstructor && dontEnum === 'constructor') && ohasOwn.call(object, dontEnum)) {
            theKeys.push(dontEnum);
          }
        }
      }
      return theKeys;
    };
  }
  if (!Array.isArray) {
    Array.isArray = function (a) {
      return serialize.call(a) === '[object Array]';
    };
  }
  if (!noop.bind) {
    Function.prototype.bind = function (scope) {
      if (arguments.length < 2 && scope === void 0)
        return this;
      var fn = this, argv = arguments;
      return function () {
        var args = [], i;
        for (i = 1; i < argv.length; i++)
          args.push(argv[i]);
        for (i = 0; i < arguments.length; i++)
          args.push(arguments[i]);
        return fn.apply(scope, args);
      };
    };
  }
  function iterator(vars, body, ret) {
    var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret;
    /* jshint ignore:start */
    return Function('fn,scope', fun)  /* jshint ignore:end */;
  }
  if (!rnative.test([].map)) {
    smcore.mix(ap, {
      //定位操作，返回数组中第一个等于给定参数的元素的索引值。
      indexOf: function (item, index) {
        var n = this.length, i = ~~index;
        if (i < 0)
          i += n;
        for (; i < n; i++)
          if (this[i] === item)
            return i;
        return -1;
      },
      //定位操作，同上，不过是从后遍历。
      lastIndexOf: function (item, index) {
        var n = this.length, i = index == null ? n - 1 : index;
        if (i < 0)
          i = Math.max(0, n + i);
        for (; i >= 0; i--)
          if (this[i] === item)
            return i;
        return -1;
      },
      //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
      forEach: iterator('', '_', ''),
      //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
      filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
      //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
      map: iterator('r=[],', 'r[i]=_', 'return r'),
      //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
      some: iterator('', 'if(_)return true', 'return false'),
      //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
      every: iterator('', 'if(!_)return false', 'return true')
    });
  }
  /*********************************************************************
   *                           DOM 底层补丁                             *
   **********************************************************************/
  function fixContains(root, el) {
    try {
      //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
      while (el = el.parentNode)
        if (el === root)
          return true;
      return false;
    } catch (e) {
      return false;
    }
  }
  smcore.contains = fixContains;
  //IE6-11的文档对象没有contains
  if (!DOC.contains) {
    DOC.contains = function (b) {
      return fixContains(DOC, b);
    };
  }
  function outerHTML() {
    return new XMLSerializer().serializeToString(this);
  }
  if (window.SVGElement) {
    //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
    if (!DOC.createTextNode('x').contains) {
      Node.prototype.contains = function (arg) {
        //IE6-8没有Node对象
        return !!(this.compareDocumentPosition(arg) & 16);
      };
    }
    var svgns = 'http://www.w3.org/2000/svg';
    var svg = DOC.createElementNS(svgns, 'svg');
    svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="red" />';
    if (!rsvg.test(svg.firstChild)) {
      // #409
      function enumerateNode(node, targetNode) {
        // jshint ignore:line
        if (node && node.childNodes) {
          var nodes = node.childNodes;
          for (var i = 0, el; el = nodes[i++];) {
            if (el.tagName) {
              var svg = DOC.createElementNS(svgns, el.tagName.toLowerCase());
              ap.forEach.call(el.attributes, function (attr) {
                svg.setAttribute(attr.name, attr.value)  //复制属性
;
              });
              // jshint ignore:line
              // 递归处理子节点
              enumerateNode(el, svg);
              targetNode.appendChild(svg);
            }
          }
        }
      }
      Object.defineProperties(SVGElement.prototype, {
        'outerHTML': {
          //IE9-11,firefox不支持SVG元素的innerHTML,outerHTML属性
          enumerable: true,
          configurable: true,
          get: outerHTML,
          set: function (html) {
            var tagName = this.tagName.toLowerCase(), par = this.parentNode, frag = smcore.parseHTML(html);
            // 操作的svg，直接插入
            if (tagName === 'svg') {
              par.insertBefore(frag, this)  // svg节点的子节点类似
;
            } else {
              var newFrag = DOC.createDocumentFragment();
              enumerateNode(frag, newFrag);
              par.insertBefore(newFrag, this);
            }
            par.removeChild(this);
          }
        },
        'innerHTML': {
          enumerable: true,
          configurable: true,
          get: function () {
            var s = this.outerHTML;
            var ropen = new RegExp('<' + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', 'i');
            var rclose = new RegExp('</' + this.nodeName + '>$', 'i');
            return s.replace(ropen, '').replace(rclose, '');
          },
          set: function (html) {
            if (smcore.clearHTML) {
              smcore.clearHTML(this);
              var frag = smcore.parseHTML(html);
              enumerateNode(frag, this);
            }
          }
        }
      });
    }
  }
  if (!root.outerHTML && window.HTMLElement) {
    //firefox 到11时才有outerHTML
    HTMLElement.prototype.__defineGetter__('outerHTML', outerHTML);
  }
  //============================= event binding =======================
  var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/;
  function fixEvent(event) {
    var ret = {};
    for (var i in event) {
      ret[i] = event[i];
    }
    var target = ret.target = event.srcElement;
    if (event.type.indexOf('key') === 0) {
      ret.which = event.charCode != null ? event.charCode : event.keyCode;
    } else if (rmouseEvent.test(event.type)) {
      var doc = target.ownerDocument || DOC;
      var box = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
      ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
      ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
      ret.wheelDeltaY = ret.wheelDelta;
      ret.wheelDeltaX = 0;
    }
    ret.timeStamp = new Date() - 0;
    ret.originalEvent = event;
    ret.preventDefault = function () {
      //阻止默认行为
      event.returnValue = false;
    };
    ret.stopPropagation = function () {
      //阻止事件在DOM树中的传播
      event.cancelBubble = true;
    };
    return ret;
  }
  var eventHooks = smcore.eventHooks;
  //针对firefox, chrome修正mouseenter, mouseleave
  if (!('onmouseenter' in root)) {
    smcore.each({
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }, function (origType, fixType) {
      eventHooks[origType] = {
        type: fixType,
        deel: function (elem, _, fn) {
          return function (e) {
            var t = e.relatedTarget;
            if (!t || t !== elem && !(elem.compareDocumentPosition(t) & 16)) {
              delete e.type;
              e.type = origType;
              return fn.call(elem, e);
            }
          };
        }
      };
    });
  }
  //针对IE9+, w3c修正animationend
  smcore.each({
    AnimationEvent: 'animationend',
    WebKitAnimationEvent: 'webkitAnimationEnd'
  }, function (construct, fixType) {
    if (window[construct] && !eventHooks.animationend) {
      eventHooks.animationend = { type: fixType };
    }
  });
  //针对IE6-8修正input
  if (!('oninput' in DOC.createElement('input'))) {
    eventHooks.input = {
      type: 'propertychange',
      deel: function (elem, _, fn) {
        return function (e) {
          if (e.propertyName === 'value') {
            e.type = 'input';
            return fn.call(elem, e);
          }
        };
      }
    };
  }
  if (DOC.onmousewheel === void 0) {
    /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
     firefox DOMMouseScroll detail 下3 上-3
     firefox wheel detlaY 下3 上-3
     IE9-11 wheel deltaY 下40 上-40
     chrome wheel deltaY 下100 上-100 */
    var fixWheelType = DOC.onwheel !== void 0 ? 'wheel' : 'DOMMouseScroll';
    var fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
    eventHooks.mousewheel = {
      type: fixWheelType,
      deel: function (elem, _, fn) {
        return function (e) {
          e.wheelDeltaY = e.wheelDelta = e[fixWheelDelta] > 0 ? -120 : 120;
          e.wheelDeltaX = 0;
          if (Object.defineProperty) {
            Object.defineProperty(e, 'type', { value: 'mousewheel' });
          }
          fn.call(elem, e);
        };
      }
    };
  }
  /*********************************************************************
   *                           配置系统                                 *
   **********************************************************************/
  function kernel(settings) {
    for (var p in settings) {
      if (!ohasOwn.call(settings, p))
        continue;
      var val = settings[p];
      if (typeof kernel.plugins[p] === 'function') {
        kernel.plugins[p](val);
      } else if (typeof kernel[p] === 'object') {
        smcore.mix(kernel[p], val);
      } else {
        kernel[p] = val;
      }
    }
    return this;
  }
  var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g;
  function escapeRegExp(target) {
    //http://stevenlevithan.com/regex/xregexp/
    //将字符串安全格式化为正则表达式的源码
    return (target + '').replace(rregexp, '\\$&');
  }
  var plugins = {
    loader: function (builtin) {
      var flag = innerRequire && builtin;
      window.require = flag ? innerRequire : otherRequire;
      window.define = flag ? innerRequire.define : otherDefine;
    },
    interpolate: function (array) {
      openTag = array[0];
      closeTag = array[1];
      if (openTag === closeTag) {
        throw new SyntaxError('openTag!==closeTag');
      } else if (array + '' === '<!--,-->') {
        kernel.commentInterpolate = true;
      } else {
        var test = openTag + 'test' + closeTag;
        cinerator.innerHTML = test;
        if (cinerator.innerHTML !== test && cinerator.innerHTML.indexOf('&lt;') > -1) {
          throw new SyntaxError('\u6B64\u5B9A\u754C\u7B26\u4E0D\u5408\u6CD5');
        }
        cinerator.innerHTML = '';
      }
      var o = escapeRegExp(openTag), c = escapeRegExp(closeTag);
      rexpr = new RegExp(o + '(.*?)' + c);
      rexprg = new RegExp(o + '(.*?)' + c, 'g');
      rbind = new RegExp(o + '.*?' + c + '|\\svm-');
    }
  };
  kernel.debug = true;
  kernel.plugins = plugins;
  kernel.plugins['interpolate']([
    '{{',
    '}}'
  ]);
  kernel.paths = {};
  kernel.shim = {};
  kernel.maxRepeatSize = 100;
  smcore.config = kernel;
  var rsmcore = /(\w+)\[(smcorectrl)="(\S+)"\]/;
  var findNodes = DOC.querySelectorAll ? function (str) {
    return DOC.querySelectorAll(str);
  } : function (str) {
    var match = str.match(rsmcore);
    var all = DOC.getElementsByTagName(match[1]);
    var nodes = [];
    for (var i = 0, el; el = all[i++];) {
      if (el.getAttribute(match[2]) === match[3]) {
        nodes.push(el);
      }
    }
    return nodes;
  };
  /*********************************************************************
   *                            事件总线                               *
   **********************************************************************/
  var EventBus = {
    $watch: function (type, callback) {
      if (typeof callback === 'function') {
        var callbacks = this.$events[type];
        if (callbacks) {
          callbacks.push(callback);
        } else {
          this.$events[type] = [callback];
        }
      } else {
        //重新开始监听此VM的第一重简单属性的变动
        this.$events = this.$watch.backup;
      }
      return this;
    },
    $unwatch: function (type, callback) {
      var n = arguments.length;
      if (n === 0) {
        //让此VM的所有$watch回调无效化
        this.$watch.backup = this.$events;
        this.$events = {};
      } else if (n === 1) {
        this.$events[type] = [];
      } else {
        var callbacks = this.$events[type] || [];
        var i = callbacks.length;
        while (~--i < 0) {
          if (callbacks[i] === callback) {
            return callbacks.splice(i, 1);
          }
        }
      }
      return this;
    },
    $fire: function (type) {
      var special, i, v, callback;
      if (/^(\w+)!(\S+)$/.test(type)) {
        special = RegExp.$1;
        type = RegExp.$2;
      }
      var events = this.$events;
      if (!events)
        return;
      var args = aslice.call(arguments, 1);
      var detail = [type].concat(args);
      if (special === 'all') {
        for (i in smcore.vmodels) {
          v = smcore.vmodels[i];
          if (v !== this) {
            v.$fire.apply(v, detail);
          }
        }
      } else if (special === 'up' || special === 'down') {
        var elements = events.expr ? findNodes(events.expr) : [];
        if (elements.length === 0)
          return;
        for (i in smcore.vmodels) {
          v = smcore.vmodels[i];
          if (v !== this) {
            if (v.$events.expr) {
              var eventNodes = findNodes(v.$events.expr);
              if (eventNodes.length === 0) {
                continue;
              }
              //循环两个vmodel中的节点，查找匹配（向上匹配或者向下匹配）的节点并设置标识
              /* jshint ignore:start */
              Array.prototype.forEach.call(eventNodes, function (node) {
                Array.prototype.forEach.call(elements, function (element) {
                  var ok = special === 'down' ? element.contains(node) : //向下捕获
                  node.contains(element);
                  //向上冒泡
                  if (ok) {
                    node._smcore = v  //符合条件的加一个标识
;
                  }
                });
              })  /* jshint ignore:end */;
            }
          }
        }
        var nodes = DOC.getElementsByTagName('*');
        //实现节点排序
        var alls = [];
        Array.prototype.forEach.call(nodes, function (el) {
          if (el._smcore) {
            alls.push(el._smcore);
            el._smcore = '';
            el.removeAttribute('_smcore');
          }
        });
        if (special === 'up') {
          alls.reverse();
        }
        for (i = 0; callback = alls[i++];) {
          if (callback.$fire.apply(callback, detail) === false) {
            break;
          }
        }
      } else {
        var callbacks = events[type] || [];
        var all = events.$all || [];
        for (i = 0; callback = callbacks[i++];) {
          if (isFunction(callback))
            callback.apply(this, args);
        }
        for (i = 0; callback = all[i++];) {
          if (isFunction(callback))
            callback.apply(this, arguments);
        }
      }
    }
  };
  /*********************************************************************
   *                           modelFactory                             *
   **********************************************************************/
  //smcore最核心的方法的两个方法之一（另一个是smcore.scan），返回一个ViewModel(VM)
  var VMODELS = smcore.vmodels = {};
  //所有vmodel都储存在这里
  smcore.define = function (id, factory) {
    var $id = id.$id || id;
    if (!$id) {
      log('warning: vm\u5FC5\u987B\u6307\u5B9A$id');
    }
    if (VMODELS[$id]) {
      log('warning: ' + $id + ' \u5DF2\u7ECF\u5B58\u5728\u4E8Esmcore.vmodels\u4E2D');
    }
    if (typeof id === 'object') {
      var model = modelFactory(id);
    } else {
      var scope = { $watch: noop };
      factory(scope);
      //得到所有定义
      model = modelFactory(scope);
      //偷天换日，将scope换为model
      stopRepeatAssign = true;
      factory(model);
      stopRepeatAssign = false;
    }
    model.$id = $id;
    return VMODELS[$id] = model;
  };
  //一些不需要被监听的属性
  var $$skipArray = String('$id,$watch,$unwatch,$fire,$events,$model,$skipArray').match(rword);
  function isObservable(name, value, $skipArray) {
    if (isFunction(value) || value && value.nodeType) {
      return false;
    }
    if ($skipArray.indexOf(name) !== -1) {
      return false;
    }
    if ($$skipArray.indexOf(name) !== -1) {
      return false;
    }
    var $special = $skipArray.$special;
    if (name && name.charAt(0) === '$' && !$special[name]) {
      return false;
    }
    return true;
  }
  //vm-with,vm-each, vm-repeat绑定生成的代理对象储存池
  var midway = {};
  function getNewValue(accessor, name, value, $vmodel) {
    switch (accessor.type) {
    case 0:
      //计算属性
      var getter = accessor.get;
      var setter = accessor.set;
      if (isFunction(setter)) {
        var $events = $vmodel.$events;
        var lock = $events[name];
        $events[name] = [];
        //清空回调，防止内部冒泡而触发多次$fire
        setter.call($vmodel, value);
        $events[name] = lock;
      }
      return getter.call($vmodel);
    //同步$model
    case 1:
      //监控属性
      return value;
    case 2:
      //对象属性（包括数组与哈希）
      if (value !== $vmodel.$model[name]) {
        var svmodel = accessor.svmodel = objectFactory($vmodel, name, value, accessor.valueType);
        value = svmodel.$model;
        //同步$model
        var fn = midway[svmodel.$id];
        fn && fn()  //同步视图
;
      }
      return value;
    }
  }
  var defineProperty = Object.defineProperty;
  var canHideOwn = true;
  //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
  //标准浏览器使用__defineGetter__, __defineSetter__实现
  try {
    defineProperty({}, '_', { value: 'x' });
    var defineProperties = Object.defineProperties;
  } catch (e) {
    canHideOwn = false;
  }
  function modelFactory(source, $special, $model) {
    if (Array.isArray(source)) {
      var arr = source.concat();
      source.length = 0;
      var collection = Collection(source);
      // jshint ignore:line
      collection.pushArray(arr);
      return collection;
    }
    //0 null undefined || Node || VModel(fix IE6-8 createWithProxy $val: val引发的BUG)
    if (!source || source.nodeType > 0 || source.$id && source.$events) {
      return source;
    }
    if (!Array.isArray(source.$skipArray)) {
      source.$skipArray = [];
    }
    source.$skipArray.$special = $special || {};
    //强制要监听的属性
    var $vmodel = {};
    //要返回的对象, 它在IE6-8下可能被偷龙转凤
    $model = $model || {};
    //vmodels.$model属性
    var $events = {};
    //vmodel.$events属性
    var watchedProperties = {};
    //监控属性
    var initCallbacks = [];
    //初始化才执行的函数
    for (var i in source) {
      (function (name, val) {
        $model[name] = val;
        if (!isObservable(name, val, source.$skipArray)) {
          return;  //过滤所有非监控属性
        }
        //总共产生三种accessor
        $events[name] = [];
        var valueType = smcore.type(val);
        var accessor = function (newValue) {
          var name = accessor._name;
          var $vmodel = this;
          var $model = $vmodel.$model;
          var oldValue = $model[name];
          var $events = $vmodel.$events;
          if (arguments.length) {
            if (stopRepeatAssign) {
              return;
            }
            //计算属性与对象属性需要重新计算newValue
            if (accessor.type !== 1) {
              newValue = getNewValue(accessor, name, newValue, $vmodel);
              if (!accessor.type)
                return;
            }
            if (!isEqual(oldValue, newValue)) {
              $model[name] = newValue;
              notifySubscribers($events[name]);
              //同步视图
              safeFire($vmodel, name, newValue, oldValue)  //触发$watch回调
;
            }
          } else {
            if (accessor.type === 0) {
              //type 0 计算属性 1 监控属性 2 对象属性
              //计算属性不需要收集视图刷新函数,都是由其他监控属性代劳
              newValue = accessor.get.call($vmodel);
              if (oldValue !== newValue) {
                $model[name] = newValue;
                //这里不用同步视图
                safeFire($vmodel, name, newValue, oldValue)  //触发$watch回调
;
              }
              return newValue;
            } else {
              collectSubscribers($events[name]);
              //收集视图函数
              return accessor.svmodel || oldValue;
            }
          }
        };
        //总共产生三种accessor
        if (valueType === 'object' && isFunction(val.get) && Object.keys(val).length <= 2) {
          //第1种为计算属性， 因变量，通过其他监控属性触发其改变
          accessor.set = val.set;
          accessor.get = val.get;
          accessor.type = 0;
          initCallbacks.push(function () {
            var data = {
              evaluator: function () {
                data.type = Math.random(), data.element = null;
                $model[name] = accessor.get.call($vmodel);
              },
              element: head,
              type: Math.random(),
              handler: noop,
              args: []
            };
            Registry[expose] = data;
            accessor.call($vmodel);
            delete Registry[expose];
          });
        } else if (rcomplexType.test(valueType)) {
          //第2种为对象属性，产生子VM与监控数组
          accessor.type = 2;
          accessor.valueType = valueType;
          initCallbacks.push(function () {
            var svmodel = modelFactory(val, 0, $model[name]);
            accessor.svmodel = svmodel;
            svmodel.$events[subscribers] = $events[name];
          });
        } else {
          accessor.type = 1  //第3种为监控属性，对应简单的数据类型，自变量
;
        }
        accessor._name = name;
        watchedProperties[name] = accessor;
      }(i, source[i])  // jshint ignore:line
);
    }
    $$skipArray.forEach(function (name) {
      delete source[name];
      delete $model[name]  //这些特殊属性不应该在$model中出现
;
    });
    $vmodel = defineProperties($vmodel, descriptorFactory(watchedProperties), source);
    //生成一个空的ViewModel
    for (var name in source) {
      if (!watchedProperties[name]) {
        $vmodel[name] = source[name];
      }
    }
    //添加$id, $model, $events, $watch, $unwatch, $fire
    $vmodel.$id = generateID();
    $vmodel.$model = $model;
    $vmodel.$events = $events;
    for (i in EventBus) {
      var fn = EventBus[i];
      if (!W3C) {
        //在IE6-8下，VB对象的方法里的this并不指向自身，需要用bind处理一下
        fn = fn.bind($vmodel);
      }
      $vmodel[i] = fn;
    }
    if (canHideOwn) {
      Object.defineProperty($vmodel, 'hasOwnProperty', {
        value: function (name) {
          return name in this.$model;
        },
        writable: false,
        enumerable: false,
        configurable: true
      });
    } else {
      /* jshint ignore:start */
      $vmodel.hasOwnProperty = function (name) {
        return name in $vmodel.$model;
      }  /* jshint ignore:end */;
    }
    initCallbacks.forEach(function (cb) {
      //收集依赖
      cb();
    });
    return $vmodel;
  }
  //比较两个值是否相等
  var isEqual = Object.is || function (v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    } else if (v1 !== v1) {
      return v2 !== v2;
    } else {
      return v1 === v2;
    }
  };
  function safeFire(a, b, c, d) {
    if (a.$events) {
      EventBus.$fire.call(a, b, c, d);
    }
  }
  var descriptorFactory = W3C ? function (obj) {
    var descriptors = {};
    for (var i in obj) {
      descriptors[i] = {
        get: obj[i],
        set: obj[i],
        enumerable: true,
        configurable: true
      };
    }
    return descriptors;
  } : function (a) {
    return a;
  };
  //应用于第2种accessor
  function objectFactory(parent, name, value, valueType) {
    //a为原来的VM， b为新数组或新对象
    var son = parent[name];
    if (valueType === 'array') {
      if (!Array.isArray(value) || son === value) {
        return son  //fix https://github.com/RubyLouvre/smcore/issues/261
;
      }
      son._.$unwatch();
      son.clear();
      son._.$watch();
      son.pushArray(value.concat());
      return son;
    } else {
      var iterators = parent.$events[name];
      var pool = son.$events.$withProxyPool;
      if (pool) {
        recycleProxies(pool, 'with');
        son.$events.$withProxyPool = null;
      }
      var ret = modelFactory(value);
      ret.$events[subscribers] = iterators;
      midway[ret.$id] = function (data) {
        while (data = iterators.shift()) {
          (function (el) {
            smcore.nextTick(function () {
              var type = el.type;
              if (type && bindingHandlers[type]) {
                //#753
                el.rollback && el.rollback();
                //还原 vm-with vm-on
                bindingHandlers[type](el, el.vmodels);
              }
            });
          }(data)  // jshint ignore:line
);
        }
        delete midway[ret.$id];
      };
      return ret;
    }
  }
  //===================修复浏览器对Object.defineProperties的支持=================
  if (!canHideOwn) {
    if ('__defineGetter__' in smcore) {
      defineProperty = function (obj, prop, desc) {
        if ('value' in desc) {
          obj[prop] = desc.value;
        }
        if ('get' in desc) {
          obj.__defineGetter__(prop, desc.get);
        }
        if ('set' in desc) {
          obj.__defineSetter__(prop, desc.set);
        }
        return obj;
      };
      defineProperties = function (obj, descs) {
        for (var prop in descs) {
          if (descs.hasOwnProperty(prop)) {
            defineProperty(obj, prop, descs[prop]);
          }
        }
        return obj;
      };
    }
    if (IEVersion) {
      window.execScript([
        // jshint ignore:line
        'Function parseVB(code)',
        '\tExecuteGlobal(code)',
        'End Function',
        'Dim VBClassBodies',
        'Set VBClassBodies=CreateObject("Scripting.Dictionary")',
        'Function findOrDefineVBClass(name,body)',
        '\tDim found',
        '\tfound=""',
        '\tFor Each key in VBClassBodies',
        '\t\tIf body=VBClassBodies.Item(key) Then',
        '\t\t\tfound=key',
        '\t\t\tExit For',
        '\t\tEnd If',
        '\tnext',
        '\tIf found="" Then',
        '\t\tparseVB("Class " + name + body)',
        '\t\tVBClassBodies.Add name, body',
        '\t\tfound=name',
        '\tEnd If',
        '\tfindOrDefineVBClass=found',
        'End Function'
      ].join('\n'), 'VBScript');
      function VBMediator(instance, accessors, name, value) {
        // jshint ignore:line
        var accessor = accessors[name];
        if (arguments.length === 4) {
          accessor.call(instance, value);
        } else {
          return accessor.call(instance);
        }
      }
      defineProperties = function (name, accessors, properties) {
        var className = 'VBClass' + setTimeout('1'),
          // jshint ignore:line
          buffer = [];
        buffer.push('\r\n\tPrivate [__data__], [__proxy__]', '\tPublic Default Function [__const__](d, p)', '\t\tSet [__data__] = d: set [__proxy__] = p', '\t\tSet [__const__] = Me', //链式调用
        '\tEnd Function');
        //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
        for (name in properties) {
          if (!accessors.hasOwnProperty(name)) {
            buffer.push('\tPublic [' + name + ']');
          }
        }
        $$skipArray.forEach(function (name) {
          if (!accessors.hasOwnProperty(name)) {
            buffer.push('\tPublic [' + name + ']');
          }
        });
        buffer.push('\tPublic [' + 'hasOwnProperty' + ']');
        //添加访问器属性 
        for (name in accessors) {
          buffer.push(//由于不知对方会传入什么,因此set, let都用上
          '\tPublic Property Let [' + name + '](val' + expose + ')', //setter
          '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + expose + ')', '\tEnd Property', '\tPublic Property Set [' + name + '](val' + expose + ')', //setter
          '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + expose + ')', '\tEnd Property', '\tPublic Property Get [' + name + ']', //getter
          '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
          '\t\tSet[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")', '\tIf Err.Number <> 0 Then', '\t\t[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")', '\tEnd If', '\tOn Error Goto 0', '\tEnd Property');
        }
        buffer.push('End Class');
        var code = buffer.join('\r\n'), realClassName = window['findOrDefineVBClass'](className, code);
        //如果该VB类已定义，返回类名。否则用className创建一个新类。
        if (realClassName === className) {
          window.parseVB([
            'Function ' + className + 'Factory(a, b)',
            //创建实例并传入两个关键的参数
            '\tDim o',
            '\tSet o = (New ' + className + ')(a, b)',
            '\tSet ' + className + 'Factory = o',
            'End Function'
          ].join('\r\n'));
        }
        var ret = window[realClassName + 'Factory'](accessors, VBMediator);
        //得到其产品
        return ret  //得到其产品
;
      };
    }
  }
  /*********************************************************************
   *          监控数组（与vm-each, vm-repeat配合使用）                     *
   **********************************************************************/
  function Collection(model) {
    var array = [];
    array.$id = generateID();
    array.$model = model;
    //数据模型
    array.$events = {};
    array.$events[subscribers] = [];
    array._ = modelFactory({ length: model.length });
    array._.$watch('length', function (a, b) {
      array.$fire('length', a, b);
    });
    for (var i in EventBus) {
      array[i] = EventBus[i];
    }
    smcore.mix(array, CollectionPrototype);
    return array;
  }
  function mutateArray(method, pos, n, index, method2, pos2, n2) {
    var oldLen = this.length, loop = 2;
    while (--loop) {
      switch (method) {
      case 'add':
        /* jshint ignore:start */
        var array = this.$model.slice(pos, pos + n).map(function (el) {
          if (rcomplexType.test(smcore.type(el))) {
            return el.$id ? el : modelFactory(el, 0, el);
          } else {
            return el;
          }
        });
        /* jshint ignore:end */
        _splice.apply(this, [
          pos,
          0
        ].concat(array));
        this._fire('add', pos, n);
        break;
      case 'del':
        var ret = this._splice(pos, n);
        this._fire('del', pos, n);
        break;
      }
      if (method2) {
        method = method2;
        pos = pos2;
        n = n2;
        loop = 2;
        method2 = 0;
      }
    }
    this._fire('index', index);
    if (this.length !== oldLen) {
      this._.length = this.length;
    }
    return ret;
  }
  var _splice = ap.splice;
  var CollectionPrototype = {
    _splice: _splice,
    _fire: function (method, a, b) {
      notifySubscribers(this.$events[subscribers], method, a, b);
    },
    size: function () {
      //取得数组长度，这个函数可以同步视图，length不能
      return this._.length;
    },
    pushArray: function (array) {
      var m = array.length, n = this.length;
      if (m) {
        ap.push.apply(this.$model, array);
        mutateArray.call(this, 'add', n, m, Math.max(0, n - 1));
      }
      return m + n;
    },
    push: function () {
      //http://jsperf.com/closure-with-arguments
      var array = [];
      var i, n = arguments.length;
      for (i = 0; i < n; i++) {
        array[i] = arguments[i];
      }
      return this.pushArray(array);
    },
    unshift: function () {
      var m = arguments.length, n = this.length;
      if (m) {
        ap.unshift.apply(this.$model, arguments);
        mutateArray.call(this, 'add', 0, m, 0);
      }
      return m + n  //IE67的unshift不会返回长度
;
    },
    shift: function () {
      if (this.length) {
        var el = this.$model.shift();
        mutateArray.call(this, 'del', 0, 1, 0);
        return el  //返回被移除的元素
;
      }
    },
    pop: function () {
      var n = this.length;
      if (n) {
        var el = this.$model.pop();
        mutateArray.call(this, 'del', n - 1, 1, Math.max(0, n - 2));
        return el  //返回被移除的元素
;
      }
    },
    splice: function (start) {
      var m = arguments.length, args = [], change;
      var removed = _splice.apply(this.$model, arguments);
      if (removed.length) {
        //如果用户删掉了元素
        args.push('del', start, removed.length, 0);
        change = true;
      }
      if (m > 2) {
        //如果用户添加了元素
        if (change) {
          args.splice(3, 1, 0, 'add', start, m - 2);
        } else {
          args.push('add', start, m - 2, 0);
        }
        change = true;
      }
      if (change) {
        //返回被移除的元素
        return mutateArray.apply(this, args);
      } else {
        return [];
      }
    },
    contains: function (el) {
      //判定是否包含
      return this.indexOf(el) !== -1;
    },
    remove: function (el) {
      //移除第一个等于给定值的元素
      return this.removeAt(this.indexOf(el));
    },
    removeAt: function (index) {
      //移除指定索引上的元素
      if (index >= 0) {
        this.$model.splice(index, 1);
        return mutateArray.call(this, 'del', index, 1, 0);
      }
      return [];
    },
    clear: function () {
      this.$model.length = this.length = this._.length = 0;
      //清空数组
      this._fire('clear', 0);
      return this;
    },
    removeAll: function (all) {
      //移除N个元素
      if (Array.isArray(all)) {
        all.forEach(function (el) {
          this.remove(el);
        }, this);
      } else if (typeof all === 'function') {
        for (var i = this.length - 1; i >= 0; i--) {
          var el = this[i];
          if (all(el, i)) {
            this.removeAt(i);
          }
        }
      } else {
        this.clear();
      }
    },
    ensure: function (el) {
      if (!this.contains(el)) {
        //只有不存在才push
        this.push(el);
      }
      return this;
    },
    set: function (index, val) {
      if (index >= 0) {
        var valueType = smcore.type(val);
        if (val && val.$model) {
          val = val.$model;
        }
        var target = this[index];
        if (valueType === 'object') {
          for (var i in val) {
            if (target.hasOwnProperty(i)) {
              target[i] = val[i];
            }
          }
        } else if (valueType === 'array') {
          target.clear().push.apply(target, val);
        } else if (target !== val) {
          this[index] = val;
          this.$model[index] = val;
          this._fire('set', index, val);
        }
      }
      return this;
    }
  };
  function sortByIndex(array, indexes) {
    var map = {};
    for (var i = 0, n = indexes.length; i < n; i++) {
      map[i] = array[i];
      // preserve
      var j = indexes[i];
      if (j in map) {
        array[i] = map[j];
        delete map[j];
      } else {
        array[i] = array[j];
      }
    }
  }
  'sort,reverse'.replace(rword, function (method) {
    CollectionPrototype[method] = function () {
      var newArray = this.$model;
      //这是要排序的新数组
      var oldArray = newArray.concat();
      //保持原来状态的旧数组
      var mask = Math.random();
      var indexes = [];
      var hasSort;
      ap[method].apply(newArray, arguments);
      //排序
      for (var i = 0, n = oldArray.length; i < n; i++) {
        var neo = newArray[i];
        var old = oldArray[i];
        if (isEqual(neo, old)) {
          indexes.push(i);
        } else {
          var index = oldArray.indexOf(neo);
          indexes.push(index);
          //得到新数组的每个元素在旧数组对应的位置
          oldArray[index] = mask;
          //屏蔽已经找过的元素
          hasSort = true;
        }
      }
      if (hasSort) {
        sortByIndex(this, indexes);
        this._fire('move', indexes);
        this._fire('index', 0);
      }
      return this;
    };
  });
  /*********************************************************************
   *                           依赖调度系统                             *
   **********************************************************************/
  var ronduplex = /^(duplex|on)$/;
  function registerSubscriber(data) {
    Registry[expose] = data;
    //暴光此函数,方便collectSubscribers收集
    smcore.openComputedCollect = true;
    var fn = data.evaluator;
    if (fn) {
      //如果是求值函数
      try {
        var c = ronduplex.test(data.type) ? data : fn.apply(0, data.args);
        data.handler(c, data.element, data);
      } catch (e) {
        //log("warning:exception throwed in [registerSubscriber] " + e)
        delete data.evaluator;
        var node = data.element;
        if (node.nodeType === 3) {
          var parent = node.parentNode;
          if (kernel.commentInterpolate) {
            parent.replaceChild(DOC.createComment(data.value), node);
          } else {
            node.data = openTag + data.value + closeTag;
          }
        }
      }
    }
    smcore.openComputedCollect = false;
    delete Registry[expose];
  }
  function collectSubscribers(list) {
    //收集依赖于这个访问器的订阅者
    var data = Registry[expose];
    if (list && data && smcore.Array.ensure(list, data) && data.element) {
      //只有数组不存在此元素才push进去
      addSubscribers(data, list);
    }
  }
  function addSubscribers(data, list) {
    data.$uuid = data.$uuid || generateID();
    list.$uuid = list.$uuid || generateID();
    var obj = {
      data: data,
      list: list,
      $$uuid: data.$uuid + list.$uuid
    };
    if (!$$subscribers[obj.$$uuid]) {
      $$subscribers[obj.$$uuid] = 1;
      $$subscribers.push(obj);
    }
  }
  function disposeData(data) {
    data.element = null;
    data.rollback && data.rollback();
    for (var key in data) {
      data[key] = null;
    }
  }
  function isRemove(el) {
    try {
      //IE下，如果文本节点脱离DOM树，访问parentNode会报错
      if (!el.parentNode) {
        return true;
      }
    } catch (e) {
      return true;
    }
    return el.msRetain ? 0 : el.nodeType === 1 ? typeof el.sourceIndex === 'number' ? el.sourceIndex === 0 : !root.contains(el) : !smcore.contains(root, el);
  }
  var $$subscribers = smcore.$$subscribers = [];
  var beginTime = new Date();
  var oldInfo = {};
  function removeSubscribers() {
    var i = $$subscribers.length;
    var n = i;
    var k = 0;
    var obj;
    var types = [];
    var newInfo = {};
    var needTest = {};
    while (obj = $$subscribers[--i]) {
      var data = obj.data;
      var type = data.type;
      if (newInfo[type]) {
        newInfo[type]++;
      } else {
        newInfo[type] = 1;
        types.push(type);
      }
    }
    var diff = false;
    types.forEach(function (type) {
      if (oldInfo[type] !== newInfo[type]) {
        needTest[type] = 1;
        diff = true;
      }
    });
    i = n;
    //smcore.log("需要检测的个数 " + i)
    if (diff) {
      //smcore.log("有需要移除的元素")
      while (obj = $$subscribers[--i]) {
        data = obj.data;
        if (data.element === void 0)
          continue;
        if (needTest[data.type] && isRemove(data.element)) {
          //如果它没有在DOM树
          k++;
          $$subscribers.splice(i, 1);
          delete $$subscribers[obj.$$uuid];
          smcore.Array.remove(obj.list, data);
          //log("debug: remove " + data.type)
          disposeData(data);
          obj.data = obj.list = null;
        }
      }
    }
    oldInfo = newInfo;
    // smcore.log("已经移除的个数 " + k)
    beginTime = new Date();
  }
  function notifySubscribers(list) {
    //通知依赖于这个访问器的订阅者更新自身
    if (list && list.length) {
      if (new Date() - beginTime > 444 && typeof list[0] === 'object') {
        removeSubscribers();
      }
      var args = aslice.call(arguments, 1);
      for (var i = list.length, fn; fn = list[--i];) {
        var el = fn.element;
        if (el && el.parentNode) {
          if (fn.$repeat) {
            fn.handler.apply(fn, args)  //处理监控数组的方法
;
          } else if (fn.type !== 'on') {
            //事件绑定只能由用户触发,不能由程序触发
            var fun = fn.evaluator || noop;
            fn.handler(fun.apply(0, fn.args || []), el, fn);
          }
        }
      }
    }
  }
  /************************************************************************
   *            HTML处理(parseHTML, innerHTML, clearHTML)                  *
   ************************************************************************/
  // We have to close these tags to support XHTML 
  var tagHooks = {
    area: [
      1,
      '<map>',
      '</map>'
    ],
    param: [
      1,
      '<object>',
      '</object>'
    ],
    col: [
      2,
      '<table><colgroup>',
      '</colgroup></table>'
    ],
    legend: [
      1,
      '<fieldset>',
      '</fieldset>'
    ],
    option: [
      1,
      '<select multiple=\'multiple\'>',
      '</select>'
    ],
    thead: [
      1,
      '<table>',
      '</table>'
    ],
    tr: [
      2,
      '<table>',
      '</table>'
    ],
    td: [
      3,
      '<table><tr>',
      '</tr></table>'
    ],
    g: [
      1,
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">',
      '</svg>'
    ],
    //IE6-8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
    _default: W3C ? [
      0,
      '',
      ''
    ] : [
      1,
      'X<div>',
      '</div>'
    ]  //div可以不用闭合
  };
  tagHooks.th = tagHooks.td;
  tagHooks.optgroup = tagHooks.option;
  tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead;
  String('circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use').replace(rword, function (tag) {
    tagHooks[tag] = tagHooks.g;
  });
  var rtagName = /<([\w:]+)/;
  //取得其tagName
  var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
  var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/gi;
  var scriptTypes = oneObject([
    '',
    'text/javascript',
    'text/ecmascript',
    'application/ecmascript',
    'application/javascript'
  ]);
  var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/;
  //需要处理套嵌关系的标签
  var script = DOC.createElement('script');
  var rhtml = /<|&#?\w+;/;
  smcore.parseHTML = function (html) {
    var fragment = hyperspace.cloneNode(false);
    if (typeof html !== 'string') {
      return fragment;
    }
    if (!rhtml.test(html)) {
      fragment.appendChild(DOC.createTextNode(html));
      return fragment;
    }
    html = html.replace(rxhtml, '<$1></$2>').trim();
    var tag = (rtagName.exec(html) || [
        '',
        ''
      ])[1].toLowerCase(),
      //取得其标签名
      wrap = tagHooks[tag] || tagHooks._default, wrapper = cinerator, firstChild, neo;
    if (!W3C) {
      //fix IE
      html = html.replace(rcreate, '<br class=msNoScope>$1')  //在link style script等标签之前添加一个补丁
;
    }
    wrapper.innerHTML = wrap[1] + html + wrap[2];
    var els = wrapper.getElementsByTagName('script');
    if (els.length) {
      //使用innerHTML生成的script节点不会发出请求与执行text属性
      for (var i = 0, el; el = els[i++];) {
        if (scriptTypes[el.type]) {
          //以偷龙转凤方式恢复执行脚本功能
          neo = script.cloneNode(false);
          //FF不能省略参数
          ap.forEach.call(el.attributes, function (attr) {
            if (attr && attr.specified) {
              neo[attr.name] = attr.value;
              //复制其属性
              neo.setAttribute(attr.name, attr.value);
            }
          });
          // jshint ignore:line
          neo.text = el.text;
          el.parentNode.replaceChild(neo, el)  //替换节点
;
        }
      }
    }
    if (!W3C) {
      //fix IE
      var target = wrap[1] === 'X<div>' ? wrapper.lastChild.firstChild : wrapper.lastChild;
      if (target && target.tagName === 'TABLE' && tag !== 'tbody') {
        //IE6-7处理 <thead> --> <thead>,<tbody>
        //<tfoot> --> <tfoot>,<tbody>
        //<table> --> <table><tbody></table>
        for (els = target.childNodes, i = 0; el = els[i++];) {
          if (el.tagName === 'TBODY' && !el.innerHTML) {
            target.removeChild(el);
            break;
          }
        }
      }
      els = wrapper.getElementsByTagName('br');
      var n = els.length;
      while (el = els[--n]) {
        if (el.className === 'msNoScope') {
          el.parentNode.removeChild(el);
        }
      }
      for (els = wrapper.all, i = 0; el = els[i++];) {
        //fix VML
        if (isVML(el)) {
          fixVML(el);
        }
      }
    }
    //移除我们为了符合套嵌关系而添加的标签
    for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {
    }
    while (firstChild = wrapper.firstChild) {
      // 将wrapper上的节点转移到文档碎片上！
      fragment.appendChild(firstChild);
    }
    return fragment;
  };
  function isVML(src) {
    var nodeName = src.nodeName;
    return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === '';
  }
  function fixVML(node) {
    if (node.currentStyle.behavior !== 'url(#default#VML)') {
      node.style.behavior = 'url(#default#VML)';
      node.style.display = 'inline-block';
      node.style.zoom = 1  //hasLayout
;
    }
  }
  smcore.innerHTML = function (node, html) {
    if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
      try {
        node.innerHTML = html;
        return;
      } catch (e) {
      }
    }
    var a = this.parseHTML(html);
    this.clearHTML(node).appendChild(a);
  };
  smcore.clearHTML = function (node) {
    node.textContent = '';
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    return node;
  };
  /*********************************************************************
   *                           扫描系统                                 *
   **********************************************************************/
  smcore.scan = function (elem, vmodel, group) {
    elem = elem || root;
    var vmodels = vmodel ? [].concat(vmodel) : [];
    scanTag(elem, vmodels);
  };
  //http://www.w3.org/TR/html5/syntax.html#void-elements
  var stopScan = oneObject('area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea'.toUpperCase());
  function checkScan(elem, callback, innerHTML) {
    var id = setTimeout(function () {
      var currHTML = elem.innerHTML;
      clearTimeout(id);
      if (currHTML === innerHTML) {
        callback();
      } else {
        checkScan(elem, callback, currHTML);
      }
    });
  }
  function createSignalTower(elem, vmodel) {
    var id = elem.getAttribute('smcorectrl') || vmodel.$id;
    elem.setAttribute('smcorectrl', id);
    vmodel.$events.expr = elem.tagName + '[smcorectrl="' + id + '"]';
  }
  var getBindingCallback = function (elem, name, vmodels) {
    var callback = elem.getAttribute(name);
    if (callback) {
      for (var i = 0, vm; vm = vmodels[i++];) {
        if (vm.hasOwnProperty(callback) && typeof vm[callback] === 'function') {
          return vm[callback];
        }
      }
    }
  };
  function executeBindings(bindings, vmodels) {
    for (var i = 0, data; data = bindings[i++];) {
      data.vmodels = vmodels;
      bindingHandlers[data.type](data, vmodels);
      if (data.evaluator && data.element && data.element.nodeType === 1) {
        //移除数据绑定，防止被二次解析
        //chrome使用removeAttributeNode移除不存在的特性节点时会报错 https://github.com/RubyLouvre/smcore/issues/99
        data.element.removeAttribute(data.name);
      }
    }
    bindings.length = 0;
  }
  //https://github.com/RubyLouvre/smcore/issues/636
  var mergeTextNodes = IEVersion && window.MutationObserver ? function (elem) {
    var node = elem.firstChild, text;
    while (node) {
      var aaa = node.nextSibling;
      if (node.nodeType === 3) {
        if (text) {
          text.nodeValue += node.nodeValue;
          elem.removeChild(node);
        } else {
          text = node;
        }
      } else {
        text = null;
      }
      node = aaa;
    }
  } : 0;
  var rmsAttr = /vm-(\w+)-?(.*)/;
  var priorityMap = {
    'if': 10,
    'repeat': 90,
    'data': 100,
    'widget': 110,
    'each': 1400,
    'with': 1500,
    'duplex': 2000,
    'on': 3000
  };
  var events = oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit');
  var obsoleteAttrs = oneObject('value,title,alt,checked,selected,disabled,readonly,enabled');
  function bindingSorter(a, b) {
    return a.priority - b.priority;
  }
  function scanAttr(elem, vmodels) {
    //防止setAttribute, removeAttribute时 attributes自动被同步,导致for循环出错
    var attributes = getAttributes ? getAttributes(elem) : smcore.slice(elem.attributes);
    var bindings = [], msData = {}, match;
    for (var i = 0, attr; attr = attributes[i++];) {
      if (attr.specified) {
        if (match = attr.name.match(rmsAttr)) {
          //如果是以指定前缀命名的
          var type = match[1];
          var param = match[2] || '';
          var value = attr.value;
          var name = attr.name;
          msData[name] = value;
          if (events[type]) {
            param = type;
            type = 'on';
          } else if (obsoleteAttrs[type]) {
            log('warning!\u8BF7\u6539\u7528vm-attr-' + type + '\u4EE3\u66FFvm-' + type + '\uFF01');
            if (type === 'enabled') {
              //吃掉vm-enabled绑定,用vm-disabled代替
              log('warning!vm-enabled\u6216vm-attr-enabled\u5DF2\u7ECF\u88AB\u5E9F\u5F03');
              type = 'disabled';
              value = '!(' + value + ')';
            }
            param = type;
            type = 'attr';
            elem.removeAttribute(name);
            name = 'vm-attr-' + param;
            elem.setAttribute(name, value);
            match = [name];
            msData[name] = value;
          }
          if (typeof bindingHandlers[type] === 'function') {
            var binding = {
              type: type,
              param: param,
              element: elem,
              name: match[0],
              value: value,
              priority: type in priorityMap ? priorityMap[type] : type.charCodeAt(0) * 10 + (Number(param) || 0)
            };
            if (type === 'html' || type === 'text') {
              var token = getToken(value);
              smcore.mix(binding, token);
              binding.filters = binding.filters.replace(rhasHtml, function () {
                binding.type = 'html';
                binding.group = 1;
                return '';
              })  // jshint ignore:line
;
            }
            if (name === 'vm-if-loop') {
              binding.priority += 100;
            }
            if (vmodels.length) {
              bindings.push(binding);
              if (type === 'widget') {
                elem.msData = elem.msData || msData;
              }
            }
          }
        }
      }
    }
    bindings.sort(bindingSorter);
    var control = elem.type;
    if (control && msData['vm-duplex']) {
      if (msData['vm-attr-checked'] && /radio|checkbox/.test(control)) {
        log('warning!' + control + '\u63A7\u4EF6\u4E0D\u80FD\u540C\u65F6\u5B9A\u4E49vm-attr-checked\u4E0Evm-duplex');
      }
      if (msData['vm-attr-value'] && /text|password/.test(control)) {
        log('warning!' + control + '\u63A7\u4EF6\u4E0D\u80FD\u540C\u65F6\u5B9A\u4E49vm-attr-value\u4E0Evm-duplex');
      }
    }
    var scanNode = true;
    for (i = 0; binding = bindings[i]; i++) {
      type = binding.type;
      if (rnoscanAttrBinding.test(type)) {
        return executeBindings(bindings.slice(0, i + 1), vmodels);
      } else if (scanNode) {
        scanNode = !rnoscanNodeBinding.test(type);
      }
    }
    executeBindings(bindings, vmodels);
    if (scanNode && !stopScan[elem.tagName] && rbind.test(elem.innerHTML.replace(rlt, '<').replace(rgt, '>'))) {
      mergeTextNodes && mergeTextNodes(elem);
      scanNodeList(elem, vmodels)  //扫描子孙元素
;
    }
  }
  var rnoscanAttrBinding = /^if|widget|repeat$/;
  var rnoscanNodeBinding = /^each|with|html|include$/;
  //IE67下，在循环绑定中，一个节点如果是通过cloneNode得到，自定义属性的specified为false，无法进入里面的分支，
  //但如果我们去掉scanAttr中的attr.specified检测，一个元素会有80+个特性节点（因为它不区分固有属性与自定义属性），很容易卡死页面
  if (!'1'[0]) {
    var cacheAttrs = new Cache(512);
    var rattrs = /\s+(vm-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g, rquote = /^['"]/, rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i, ramp = /&amp;/g;
    //IE6-8解析HTML5新标签，会将它分解两个元素节点与一个文本节点
    //<body><section>ddd</section></body>
    //        window.onload = function() {
    //            var body = document.body
    //            for (var i = 0, el; el = body.children[i++]; ) {
    //                smcore.log(el.outerHTML)
    //            }
    //        }
    //依次输出<SECTION>, </SECTION>
    var getAttributes = function (elem) {
      var html = elem.outerHTML;
      //处理IE6-8解析HTML5新标签的情况，及<br>等半闭合标签outerHTML为空的情况
      if (html.slice(0, 2) === '</' || !html.trim()) {
        return [];
      }
      var str = html.match(rtag)[0];
      var attributes = [], match, k, v;
      var ret = cacheAttrs.get(str);
      if (ret) {
        return ret;
      }
      while (k = rattrs.exec(str)) {
        v = k[2];
        if (v) {
          v = (rquote.test(v) ? v.slice(1, -1) : v).replace(ramp, '&');
        }
        var name = k[1].toLowerCase();
        match = name.match(rmsAttr);
        var binding = {
          name: name,
          specified: true,
          value: v || ''
        };
        attributes.push(binding);
      }
      return cacheAttrs.put(str, attributes);
    };
  }
  function scanNodeList(parent, vmodels) {
    var node = parent.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      scanNode(node, node.nodeType, vmodels);
      node = nextNode;
    }
  }
  function scanNodeArray(nodes, vmodels) {
    for (var i = 0, node; node = nodes[i++];) {
      scanNode(node, node.nodeType, vmodels);
    }
  }
  function scanNode(node, nodeType, vmodels) {
    if (nodeType === 1) {
      scanTag(node, vmodels)  //扫描元素节点
;
    } else if (nodeType === 3 && rexpr.test(node.data)) {
      scanText(node, vmodels)  //扫描文本节点
;
    } else if (kernel.commentInterpolate && nodeType === 8 && !rexpr.test(node.nodeValue)) {
      scanText(node, vmodels)  //扫描注释节点
;
    }
  }
  function scanTag(elem, vmodels, node) {
    //扫描顺序  vm-skip(0) --> vm-important(1) --> vm-controller(2) --> vm-if(10) --> vm-repeat(100) 
    //--> vm-if-loop(110) --> vm-attr(970) ...--> vm-each(1400)-->vm-with(1500)--〉vm-duplex(2000)垫后
    var a = elem.getAttribute('vm-skip');
    //#360 在旧式IE中 Object标签在引入Flash等资源时,可能出现没有getAttributeNode,innerHTML的情形
    if (!elem.getAttributeNode) {
      return log('warning ' + elem.tagName + ' no getAttributeNode method');
    }
    var b = elem.getAttributeNode('vm-important');
    var c = elem.getAttributeNode('vm-controller');
    if (typeof a === 'string') {
      return;
    } else if (node = b || c) {
      var newVmodel = smcore.vmodels[node.value];
      if (!newVmodel) {
        return;
      }
      //vm-important不包含父VM，vm-controller相反
      vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels);
      var name = node.name;
      elem.removeAttribute(name);
      //removeAttributeNode不会刷新[vm-controller]样式规则
      smcore(elem).removeClass(name);
      createSignalTower(elem, newVmodel);
    }
    scanAttr(elem, vmodels)  //扫描特性节点
;
  }
  var rhasHtml = /\|\s*html\s*/, r11a = /\|\|/g, rlt = /&lt;/g, rgt = /&gt;/g;
  rstringLiteral = /(['"])(\\\1|.)+?\1/g;
  function getToken(value) {
    if (value.indexOf('|') > 0) {
      var scapegoat = value.replace(rstringLiteral, function (_) {
        return Array(_.length + 1).join('1')  // jshint ignore:line
;
      });
      var index = scapegoat.replace(r11a, '\u1122\u3344').indexOf('|');
      //干掉所有短路或
      if (index > -1) {
        return {
          filters: value.slice(index),
          value: value.slice(0, index),
          expr: true
        };
      }
    }
    return {
      value: value,
      filters: '',
      expr: true
    };
  }
  function scanExpr(str) {
    var tokens = [], value, start = 0, stop;
    do {
      stop = str.indexOf(openTag, start);
      if (stop === -1) {
        break;
      }
      value = str.slice(start, stop);
      if (value) {
        // {{ 左边的文本
        tokens.push({
          value: value,
          filters: '',
          expr: false
        });
      }
      start = stop + openTag.length;
      stop = str.indexOf(closeTag, start);
      if (stop === -1) {
        break;
      }
      value = str.slice(start, stop);
      if (value) {
        //处理{{ }}插值表达式
        tokens.push(getToken(value));
      }
      start = stop + closeTag.length;
    } while (1);
    value = str.slice(start);
    if (value) {
      //}} 右边的文本
      tokens.push({
        value: value,
        expr: false,
        filters: ''
      });
    }
    return tokens;
  }
  function scanText(textNode, vmodels) {
    var bindings = [];
    if (textNode.nodeType === 8) {
      var token = getToken(textNode.nodeValue);
      var tokens = [token];
    } else {
      tokens = scanExpr(textNode.data);
    }
    if (tokens.length) {
      for (var i = 0; token = tokens[i++];) {
        var node = DOC.createTextNode(token.value);
        //将文本转换为文本节点，并替换原来的文本节点
        if (token.expr) {
          token.type = 'text';
          token.element = node;
          token.filters = token.filters.replace(rhasHtml, function () {
            token.type = 'html';
            token.group = 1;
            return '';
          });
          // jshint ignore:line
          bindings.push(token)  //收集带有插值表达式的文本
;
        }
        hyperspace.appendChild(node);
      }
      textNode.parentNode.replaceChild(hyperspace, textNode);
      if (bindings.length)
        executeBindings(bindings, vmodels);
    }
  }
  /*********************************************************************
   *                  smcore的原型方法定义区                            *
   **********************************************************************/
  function hyphen(target) {
    //转换为连字符线风格
    return target.replace(/([a-z\d])([A-Z]+)/g, '$1-$2').toLowerCase();
  }
  function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
      return target;
    }
    //转换为驼峰风格
    return target.replace(/[-_][^-_]/g, function (match) {
      return match.charAt(1).toUpperCase();
    });
  }
  var fakeClassListMethods = {
    _toString: function () {
      var node = this.node;
      var cls = node.className;
      var str = typeof cls === 'string' ? cls : cls.baseVal;
      return str.split(/\s+/).join(' ');
    },
    _contains: function (cls) {
      return (' ' + this + ' ').indexOf(' ' + cls + ' ') > -1;
    },
    _add: function (cls) {
      if (!this.contains(cls)) {
        this._set(this + ' ' + cls);
      }
    },
    _remove: function (cls) {
      this._set((' ' + this + ' ').replace(' ' + cls + ' ', ' '));
    },
    __set: function (cls) {
      cls = cls.trim();
      var node = this.node;
      if (rsvg.test(node)) {
        //SVG元素的className是一个对象 SVGAnimatedString { baseVal="", animVal=""}，只能通过set/getAttribute操作
        node.setAttribute('class', cls);
      } else {
        node.className = cls;
      }
    }  //toggle存在版本差异，因此不使用它
  };
  function fakeClassList(node) {
    if (!('classList' in node)) {
      node.classList = { node: node };
      for (var k in fakeClassListMethods) {
        node.classList[k.slice(1)] = fakeClassListMethods[k];
      }
    }
    return node.classList;
  }
  'add,remove'.replace(rword, function (method) {
    smcore.fn[method + 'Class'] = function (cls) {
      var el = this[0];
      //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
      if (cls && typeof cls === 'string' && el && el.nodeType === 1) {
        cls.replace(/\S+/g, function (c) {
          fakeClassList(el)[method](c);
        });
      }
      return this;
    };
  });
  smcore.fn.mix({
    hasClass: function (cls) {
      var el = this[0] || {};
      return el.nodeType === 1 && fakeClassList(el).contains(cls);
    },
    toggleClass: function (value, stateVal) {
      var className, i = 0;
      var classNames = String(value).split(/\s+/);
      var isBool = typeof stateVal === 'boolean';
      while (className = classNames[i++]) {
        var state = isBool ? stateVal : !this.hasClass(className);
        this[state ? 'addClass' : 'removeClass'](className);
      }
      return this;
    },
    attr: function (name, value) {
      if (arguments.length === 2) {
        this[0].setAttribute(name, value);
        return this;
      } else {
        return this[0].getAttribute(name);
      }
    },
    data: function (name, value) {
      name = 'data-' + hyphen(name || '');
      switch (arguments.length) {
      case 2:
        this.attr(name, value);
        return this;
      case 1:
        var val = this.attr(name);
        return parseData(val);
      case 0:
        var ret = {};
        ap.forEach.call(this[0].attributes, function (attr) {
          if (attr) {
            name = attr.name;
            if (!name.indexOf('data-')) {
              name = camelize(name.slice(5));
              ret[name] = parseData(attr.value);
            }
          }
        });
        return ret;
      }
    },
    removeData: function (name) {
      name = 'data-' + hyphen(name);
      this[0].removeAttribute(name);
      return this;
    },
    css: function (name, value) {
      if (smcore.isPlainObject(name)) {
        for (var i in name) {
          smcore.css(this, i, name[i]);
        }
      } else {
        var ret = smcore.css(this, name, value);
      }
      return ret !== void 0 ? ret : this;
    },
    position: function () {
      var offsetParent, offset, elem = this[0], parentOffset = {
          top: 0,
          left: 0
        };
      if (!elem) {
        return;
      }
      if (this.css('position') === 'fixed') {
        offset = elem.getBoundingClientRect();
      } else {
        offsetParent = this.offsetParent();
        //得到真正的offsetParent
        offset = this.offset();
        // 得到正确的offsetParent
        if (offsetParent[0].tagName !== 'HTML') {
          parentOffset = offsetParent.offset();
        }
        parentOffset.top += smcore.css(offsetParent[0], 'borderTopWidth', true);
        parentOffset.left += smcore.css(offsetParent[0], 'borderLeftWidth', true);
        // Subtract offsetParent scroll positions
        parentOffset.top -= offsetParent.scrollTop();
        parentOffset.left -= offsetParent.scrollLeft();
      }
      return {
        top: offset.top - parentOffset.top - smcore.css(elem, 'marginTop', true),
        left: offset.left - parentOffset.left - smcore.css(elem, 'marginLeft', true)
      };
    },
    offsetParent: function () {
      var offsetParent = this[0].offsetParent;
      while (offsetParent && smcore.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }
      return smcore(offsetParent || root);
    },
    bind: function (type, fn, phase) {
      if (this[0]) {
        //此方法不会链
        return smcore.bind(this[0], type, fn, phase);
      }
    },
    unbind: function (type, fn, phase) {
      if (this[0]) {
        smcore.unbind(this[0], type, fn, phase);
      }
      return this;
    },
    val: function (value) {
      var node = this[0];
      if (node && node.nodeType === 1) {
        var get = arguments.length === 0;
        var access = get ? ':get' : ':set';
        var fn = valHooks[getValType(node) + access];
        if (fn) {
          var val = fn(node, value);
        } else if (get) {
          return (node.value || '').replace(/\r/g, '');
        } else {
          node.value = value;
        }
      }
      return get ? val : this;
    }
  });
  function parseData(data) {
    try {
      if (typeof data === 'object')
        return data;
      data = data === 'true' ? true : data === 'false' ? false : data === 'null' ? null : +data + '' === data ? +data : rbrace.test(data) ? smcore.parseJSON(data) : data;
    } catch (e) {
    }
    return data;
  }
  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
  smcore.parseJSON = window.JSON ? JSON.parse : function (data) {
    if (typeof data === 'string') {
      data = data.trim();
      if (data) {
        if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
          return new Function('return ' + data)()  // jshint ignore:line
;
        }
      }
      smcore.error('Invalid JSON: ' + data);
    }
    return data;
  };
  //生成smcore.fn.scrollLeft, smcore.fn.scrollTop方法
  smcore.each({
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
  }, function (method, prop) {
    smcore.fn[method] = function (val) {
      var node = this[0] || {}, win = getWindow(node), top = method === 'scrollTop';
      if (!arguments.length) {
        return win ? prop in win ? win[prop] : root[method] : node[method];
      } else {
        if (win) {
          win.scrollTo(!top ? val : smcore(win).scrollLeft(), top ? val : smcore(win).scrollTop());
        } else {
          node[method] = val;
        }
      }
    };
  });
  function getWindow(node) {
    return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
  }
  //=============================css相关=======================
  var cssHooks = smcore.cssHooks = {};
  var prefixes = [
    '',
    '-webkit-',
    '-o-',
    '-moz-',
    '-vm-'
  ];
  var cssMap = { 'float': W3C ? 'cssFloat' : 'styleFloat' };
  smcore.cssNumber = oneObject('columnCount,order,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');
  smcore.cssName = function (name, host, camelCase) {
    if (cssMap[name]) {
      return cssMap[name];
    }
    host = host || root.style;
    for (var i = 0, n = prefixes.length; i < n; i++) {
      camelCase = camelize(prefixes[i] + name);
      if (camelCase in host) {
        return cssMap[name] = camelCase;
      }
    }
    return null;
  };
  cssHooks['@:set'] = function (node, name, value) {
    try {
      //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 在旧式IE下会抛异常
      node.style[name] = value;
    } catch (e) {
    }
  };
  if (window.getComputedStyle) {
    cssHooks['@:get'] = function (node, name) {
      if (!node || !node.style) {
        throw new Error('getComputedStyle\u8981\u6C42\u4F20\u5165\u4E00\u4E2A\u8282\u70B9 ' + node);
      }
      var ret, styles = getComputedStyle(node, null);
      if (styles) {
        ret = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
        if (ret === '') {
          ret = node.style[name]  //其他浏览器需要我们手动取内联样式
;
        }
      }
      return ret;
    };
    cssHooks['opacity:get'] = function (node) {
      var ret = cssHooks['@:get'](node, 'opacity');
      return ret === '' ? '1' : ret;
    };
  } else {
    var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i;
    var rposition = /^(top|right|bottom|left)$/;
    var ralpha = /alpha\([^)]*\)/i;
    var ie8 = !!window.XDomainRequest;
    var salpha = 'DXImageTransform.Microsoft.Alpha';
    var border = {
      thin: ie8 ? '1px' : '2px',
      medium: ie8 ? '3px' : '4px',
      thick: ie8 ? '5px' : '6px'
    };
    cssHooks['@:get'] = function (node, name) {
      //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
      var currentStyle = node.currentStyle;
      var ret = currentStyle[name];
      if (rnumnonpx.test(ret) && !rposition.test(ret)) {
        //①，保存原有的style.left, runtimeStyle.left,
        var style = node.style, left = style.left, rsLeft = node.runtimeStyle.left;
        //②由于③处的style.left = xxx会影响到currentStyle.left，
        //因此把它currentStyle.left放到runtimeStyle.left，
        //runtimeStyle.left拥有最高优先级，不会style.left影响
        node.runtimeStyle.left = currentStyle.left;
        //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
        //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
        style.left = name === 'fontSize' ? '1em' : ret || 0;
        ret = style.pixelLeft + 'px';
        //④还原 style.left，runtimeStyle.left
        style.left = left;
        node.runtimeStyle.left = rsLeft;
      }
      if (ret === 'medium') {
        name = name.replace('Width', 'Style');
        //border width 默认值为medium，即使其为0"
        if (currentStyle[name] === 'none') {
          ret = '0px';
        }
      }
      return ret === '' ? 'auto' : border[ret] || ret;
    };
    cssHooks['opacity:set'] = function (node, name, value) {
      var style = node.style;
      var opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '';
      var filter = style.filter || '';
      style.zoom = 1;
      //不能使用以下方式设置透明度
      //node.filters.alpha.opacity = value * 100
      style.filter = (ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
      if (!style.filter) {
        style.removeAttribute('filter');
      }
    };
    cssHooks['opacity:get'] = function (node) {
      //这是最快的获取IE透明值的方式，不需要动用正则了！
      var alpha = node.filters.alpha || node.filters[salpha], op = alpha && alpha.enabled ? alpha.opacity : 100;
      return op / 100 + ''  //确保返回的是字符串
;
    };
  }
  'top,left'.replace(rword, function (name) {
    cssHooks[name + ':get'] = function (node) {
      var computed = cssHooks['@:get'](node, name);
      return /px$/.test(computed) ? computed : smcore(node).position()[name] + 'px';
    };
  });
  var cssShow = {
    position: 'absolute',
    visibility: 'hidden',
    display: 'block'
  };
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  function showHidden(node, array) {
    //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
    if (node.offsetWidth <= 0) {
      //opera.offsetWidth可能小于0
      if (rdisplayswap.test(cssHooks['@:get'](node, 'display'))) {
        var obj = { node: node };
        for (var name in cssShow) {
          obj[name] = node.style[name];
          node.style[name] = cssShow[name];
        }
        array.push(obj);
      }
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1) {
        showHidden(parent, array);
      }
    }
  }
  'Width,Height'.replace(rword, function (name) {
    //fix 481
    var method = name.toLowerCase(), clientProp = 'client' + name, scrollProp = 'scroll' + name, offsetProp = 'offset' + name;
    cssHooks[method + ':get'] = function (node, which, override) {
      var boxSizing = -4;
      if (typeof override === 'number') {
        boxSizing = override;
      }
      which = name === 'Width' ? [
        'Left',
        'Right'
      ] : [
        'Top',
        'Bottom'
      ];
      var ret = node[offsetProp];
      // border-box 0
      if (boxSizing === 2) {
        // margin-box 2
        return ret + smcore.css(node, 'margin' + which[0], true) + smcore.css(node, 'margin' + which[1], true);
      }
      if (boxSizing < 0) {
        // padding-box  -2
        ret = ret - smcore.css(node, 'border' + which[0] + 'Width', true) - smcore.css(node, 'border' + which[1] + 'Width', true);
      }
      if (boxSizing === -4) {
        // content-box -4
        ret = ret - smcore.css(node, 'padding' + which[0], true) - smcore.css(node, 'padding' + which[1], true);
      }
      return ret;
    };
    cssHooks[method + '&get'] = function (node) {
      var hidden = [];
      showHidden(node, hidden);
      var val = cssHooks[method + ':get'](node);
      for (var i = 0, obj; obj = hidden[i++];) {
        node = obj.node;
        for (var n in obj) {
          if (typeof obj[n] === 'string') {
            node.style[n] = obj[n];
          }
        }
      }
      return val;
    };
    smcore.fn[method] = function (value) {
      //会忽视其display
      var node = this[0];
      if (arguments.length === 0) {
        if (node.setTimeout) {
          //取得窗口尺寸,IE9后可以用node.innerWidth /innerHeight代替
          return node['inner' + name] || node.document.documentElement[clientProp];
        }
        if (node.nodeType === 9) {
          //取得页面尺寸
          var doc = node.documentElement;
          //FF chrome    html.scrollHeight< body.scrollHeight
          //IE 标准模式 : html.scrollHeight> body.scrollHeight
          //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
          return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp]);
        }
        return cssHooks[method + '&get'](node);
      } else {
        return this.css(method, value);
      }
    };
    smcore.fn['inner' + name] = function () {
      return cssHooks[method + ':get'](this[0], void 0, -2);
    };
    smcore.fn['outer' + name] = function (includeMargin) {
      return cssHooks[method + ':get'](this[0], void 0, includeMargin === true ? 2 : 0);
    };
  });
  smcore.fn.offset = function () {
    //取得距离页面左右角的坐标
    var node = this[0], box = {
        left: 0,
        top: 0
      };
    if (!node || !node.tagName || !node.ownerDocument) {
      return box;
    }
    var doc = node.ownerDocument, body = doc.body, root = doc.documentElement, win = doc.defaultView || doc.parentWindow;
    if (!smcore.contains(root, node)) {
      return box;
    }
    //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
    //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
    //http://msdn.microsoft.com/en-us/library/ms536433.aspx
    if (node.getBoundingClientRect) {
      box = node.getBoundingClientRect()  // BlackBerry 5, iOS 3 (original iPhone)
;
    }
    //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
    var clientTop = root.clientTop || body.clientTop, clientLeft = root.clientLeft || body.clientLeft, scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop), scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
    // 把滚动距离加到left,top中去。
    // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
    // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  };
  //==================================val相关============================
  function getValType(el) {
    var ret = el.tagName.toLowerCase();
    return ret === 'input' && /checkbox|radio/.test(el.type) ? 'checked' : ret;
  }
  var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i;
  var valHooks = {
    'option:get': IEVersion ? function (node) {
      //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
      //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
      return roption.test(node.outerHTML) ? node.value : node.text.trim();
    } : function (node) {
      return node.value;
    },
    'select:get': function (node, value) {
      var option, options = node.options, index = node.selectedIndex, getter = valHooks['option:get'], one = node.type === 'select-one' || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
      for (; i < max; i++) {
        option = options[i];
        //旧式IE在reset后不会改变selected，需要改用i === index判定
        //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
        //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
        if ((option.selected || i === index) && !option.disabled) {
          value = getter(option);
          if (one) {
            return value;
          }
          //收集所有selected值组成数组返回
          values.push(value);
        }
      }
      return values;
    },
    'select:set': function (node, values, optionSet) {
      values = [].concat(values);
      //强制转换为数组
      var getter = valHooks['option:get'];
      for (var i = 0, el; el = node.options[i++];) {
        if (el.selected = values.indexOf(getter(el)) > -1) {
          optionSet = true;
        }
      }
      if (!optionSet) {
        node.selectedIndex = -1;
      }
    }
  };
  /*********************************************************************
   *                          编译系统                                  *
   **********************************************************************/
  var meta = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
  };
  var quote = window.JSON && JSON.stringify || function (str) {
    return '"' + str.replace(/[\\\"\x00-\x1f]/g, function (a) {
      var c = meta[a];
      return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"';
  };
  var keywords = [
    'break,case,catch,continue,debugger,default,delete,do,else,false',
    'finally,for,function,if,in,instanceof,new,null,return,switch,this',
    'throw,true,try,typeof,var,void,while,with',
    /* 关键字*/
    'abstract,boolean,byte,char,class,const,double,enum,export,extends',
    'final,float,goto,implements,import,int,interface,long,native',
    'package,private,protected,public,short,static,super,synchronized',
    'throws,transient,volatile',
    /*保留字*/
    'arguments,let,yield,undefined'  /* ECMA 5 - use strict*/
  ].join(',');
  var rrexpstr = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g;
  var rsplit = /[^\w$]+/g;
  var rkeywords = new RegExp(['\\b' + keywords.replace(/,/g, '\\b|\\b') + '\\b'].join('|'), 'g');
  var rnumber = /\b\d[^,]*/g;
  var rcomma = /^,+|,+$/g;
  var cacheVars = new Cache(512);
  var getVariables = function (code) {
    var key = ',' + code.trim();
    var ret = cacheVars.get(key);
    if (ret) {
      return ret;
    }
    var match = code.replace(rrexpstr, '').replace(rsplit, ',').replace(rkeywords, '').replace(rnumber, '').replace(rcomma, '').split(/^$|,+/);
    return cacheVars.put(key, uniqSet(match));
  };
  /*添加赋值语句*/
  function addAssign(vars, scope, name, data) {
    var ret = [], prefix = ' = ' + name + '.';
    for (var i = vars.length, prop; prop = vars[--i];) {
      if (scope.hasOwnProperty(prop)) {
        ret.push(prop + prefix + prop);
        data.vars.push(prop);
        if (data.type === 'duplex') {
          vars.get = name + '.' + prop;
        }
        vars.splice(i, 1);
      }
    }
    return ret;
  }
  function uniqSet(array) {
    var ret = [], unique = {};
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      var id = el && typeof el.$id === 'string' ? el.$id : el;
      if (!unique[id]) {
        unique[id] = ret.push(el);
      }
    }
    return ret;
  }
  //缓存求值函数，以便多次利用
  var cacheExprs = new Cache(128);
  //取得求值函数及其传参
  var rduplex = /\w\[.*\]|\w\.\w/;
  var rproxy = /(\$proxy\$[a-z]+)\d+$/;
  var rthimRightParentheses = /\)\s*$/;
  var rthimOtherParentheses = /\)\s*\|/g;
  var rquoteFilterName = /\|\s*([$\w]+)/g;
  var rpatchBracket = /"\s*\["/g;
  var rthimLeftParentheses = /"\s*\(/g;
  function parseFilter(val, filters) {
    filters = filters.replace(rthimRightParentheses, '')  //处理最后的小括号
.replace(rthimOtherParentheses, function () {
      //处理其他小括号
      return '],|';
    }).replace(rquoteFilterName, function (a, b) {
      //处理|及它后面的过滤器的名字
      return '[' + quote(b);
    }).replace(rpatchBracket, function () {
      return '"],["';
    }).replace(rthimLeftParentheses, function () {
      return '",';
    }) + ']';
    return 'return smcore.filters.$filter(' + val + ', ' + filters + ')';
  }
  function parseExpr(code, scopes, data) {
    var dataType = data.type;
    var filters = data.filters || '';
    var exprId = scopes.map(function (el) {
      return String(el.$id).replace(rproxy, '$1');
    }) + code + dataType + filters;
    var vars = getVariables(code).concat(), assigns = [], names = [], args = [], prefix = '';
    //args 是一个对象数组， names 是将要生成的求值函数的参数
    scopes = uniqSet(scopes);
    data.vars = [];
    for (var i = 0, sn = scopes.length; i < sn; i++) {
      if (vars.length) {
        var name = 'vm' + expose + '_' + i;
        names.push(name);
        args.push(scopes[i]);
        assigns.push.apply(assigns, addAssign(vars, scopes[i], name, data));
      }
    }
    if (!assigns.length && dataType === 'duplex') {
      return;
    }
    if (dataType !== 'duplex' && (code.indexOf('||') > -1 || code.indexOf('&&') > -1)) {
      //https://github.com/RubyLouvre/smcore/issues/583
      data.vars.forEach(function (v) {
        var reg = new RegExp('\\b' + v + '(?:\\.\\w+|\\[\\w+\\])+', 'ig');
        code = code.replace(reg, function (_) {
          var c = _.charAt(v.length);
          var r = IEVersion ? code.slice(arguments[1] + _.length) : RegExp.rightContext;
          var method = /^\s*\(/.test(r);
          if (c === '.' || c === '[' || method) {
            //比如v为aa,我们只匹配aa.bb,aa[cc],不匹配aaa.xxx
            var name = 'var' + String(Math.random()).replace(/^0\./, '');
            if (method) {
              //array.size()
              var array = _.split('.');
              if (array.length > 2) {
                var last = array.pop();
                assigns.push(name + ' = ' + array.join('.'));
                return name + '.' + last;
              } else {
                return _;
              }
            }
            assigns.push(name + ' = ' + _);
            return name;
          } else {
            return _;
          }
        });
      });
    }
    //---------------args----------------
    data.args = args;
    //---------------cache----------------
    var fn = cacheExprs.get(exprId);
    //直接从缓存，免得重复生成
    if (fn) {
      data.evaluator = fn;
      return;
    }
    prefix = assigns.join(', ');
    if (prefix) {
      prefix = 'var ' + prefix;
    }
    if (/\S/.test(filters)) {
      //文本绑定，双工绑定才有过滤器
      if (!/text|html/.test(data.type)) {
        throw Error('vm-' + data.type + '\u4E0D\u652F\u6301\u8FC7\u6EE4\u5668');
      }
      code = '\nvar ret' + expose + ' = ' + code + ';\r\n';
      code += parseFilter('ret' + expose, filters);
    } else if (dataType === 'duplex') {
      //双工绑定
      var _body = '\nreturn function(vvv){\n\t' + prefix + ';\n\tif(!arguments.length){\n\t\treturn ' + code + '\n\t}\n\t' + (!rduplex.test(code) ? vars.get : code) + '= vvv;\n} ';
      try {
        fn = Function.apply(noop, names.concat(_body));
        data.evaluator = cacheExprs.put(exprId, fn);
      } catch (e) {
        log('debug: parse error,' + e.message);
      }
      return;
    } else if (dataType === 'on') {
      //事件绑定
      if (code.indexOf('(') === -1) {
        code += '.call(this, $event)';
      } else {
        code = code.replace('(', '.call(this,');
      }
      names.push('$event');
      code = '\nreturn ' + code + ';';
      //IE全家 Function("return ")出错，需要Function("return ;")
      var lastIndex = code.lastIndexOf('\nreturn');
      var header = code.slice(0, lastIndex);
      var footer = code.slice(lastIndex);
      code = header + '\n' + footer;
    } else {
      //其他绑定
      code = '\nreturn ' + code + ';'  //IE全家 Function("return ")出错，需要Function("return ;")
;
    }
    try {
      fn = Function.apply(noop, names.concat('\n' + prefix + code));
      data.evaluator = cacheExprs.put(exprId, fn);
    } catch (e) {
      log('debug: parse error,' + e.message);
    } finally {
      vars = assigns = names = null  //释放内存
;
    }
  }
  //parseExpr的智能引用代理
  function parseExprProxy(code, scopes, data, tokens, noregister) {
    if (Array.isArray(tokens)) {
      code = tokens.map(function (el) {
        return el.expr ? '(' + el.value + ')' : quote(el.value);
      }).join(' + ');
    }
    parseExpr(code, scopes, data);
    if (data.evaluator && !noregister) {
      data.handler = bindingExecutors[data.handlerName || data.type];
      //方便调试
      //这里非常重要,我们通过判定视图刷新函数的element是否在DOM树决定
      //将它移出订阅者列表
      registerSubscriber(data);
    }
  }
  smcore.parseExprProxy = parseExprProxy;
  var bools = [
    'autofocus,autoplay,async,allowTransparency,checked,controls',
    'declare,disabled,defer,defaultChecked,defaultSelected',
    'contentEditable,isMap,loop,multiple,noHref,noResize,noShade',
    'open,readOnly,selected'
  ].join(',');
  var boolMap = {};
  bools.replace(rword, function (name) {
    boolMap[name.toLowerCase()] = name;
  });
  var propMap = {
    //属性名映射
    'accept-charset': 'acceptCharset',
    'char': 'ch',
    'charoff': 'chOff',
    'class': 'className',
    'for': 'htmlFor',
    'http-equiv': 'httpEquiv'
  };
  var anomaly = [
    'accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
    'dateTime,defaultValue,frameBorder,longDesc,maxLength,marginWidth,marginHeight',
    'rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'
  ].join(',');
  anomaly.replace(rword, function (name) {
    propMap[name.toLowerCase()] = name;
  });
  var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/gim;
  var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im;
  var getXHR = function () {
    return new (window.XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP')  // jshint ignore:line
;
  };
  var cacheTmpls = smcore.templateCache = {};
  bindingHandlers.attr = function (data, vmodels) {
    var text = data.value.trim(), simple = true;
    if (text.indexOf(openTag) > -1 && text.indexOf(closeTag) > 2) {
      simple = false;
      if (rexpr.test(text) && RegExp.rightContext === '' && RegExp.leftContext === '') {
        simple = true;
        text = RegExp.$1;
      }
    }
    if (data.type === 'include') {
      var elem = data.element;
      data.includeRendered = getBindingCallback(elem, 'data-include-rendered', vmodels);
      data.includeLoaded = getBindingCallback(elem, 'data-include-loaded', vmodels);
      var outer = data.includeReplace = !!smcore(elem).data('includeReplace');
      if (smcore(elem).data('includeCache')) {
        data.templateCache = {};
      }
      data.startInclude = DOC.createComment('vm-include');
      data.endInclude = DOC.createComment('vm-include-end');
      if (outer) {
        data.element = data.startInclude;
        elem.parentNode.insertBefore(data.startInclude, elem);
        elem.parentNode.insertBefore(data.endInclude, elem.nextSibling);
      } else {
        elem.insertBefore(data.startInclude, elem.firstChild);
        elem.appendChild(data.endInclude);
      }
    }
    data.handlerName = 'attr';
    //handleName用于处理多种绑定共用同一种bindingExecutor的情况
    parseExprProxy(text, vmodels, data, simple ? 0 : scanExpr(data.value));
  };
  bindingExecutors.attr = function (val, elem, data) {
    var method = data.type, attrName = data.param;
    if (method === 'css') {
      smcore(elem).css(attrName, val);
    } else if (method === 'attr') {
      // vm-attr-class="xxx" vm.xxx="aaa bbb ccc"将元素的className设置为aaa bbb ccc
      // vm-attr-class="xxx" vm.xxx=false  清空元素的所有类名
      // vm-attr-name="yyy"  vm.yyy="ooo" 为元素设置name属性
      var toRemove = val === false || val === null || val === void 0;
      if (!W3C && propMap[attrName]) {
        //旧式IE下需要进行名字映射
        attrName = propMap[attrName];
      }
      var bool = boolMap[attrName];
      if (typeof elem[bool] === 'boolean') {
        elem[bool] = !!val;
        //布尔属性必须使用el.xxx = true|false方式设值
        if (!val) {
          //如果为false, IE全系列下相当于setAttribute(xxx,''),会影响到样式,需要进一步处理
          toRemove = true;
        }
      }
      if (toRemove) {
        return elem.removeAttribute(attrName);
      }
      //SVG只能使用setAttribute(xxx, yyy), VML只能使用elem.xxx = yyy ,HTML的固有属性必须elem.xxx = yyy
      var isInnate = rsvg.test(elem) ? false : DOC.namespaces && isVML(elem) ? true : attrName in elem.cloneNode(false);
      if (isInnate) {
        elem[attrName] = val;
      } else {
        elem.setAttribute(attrName, val);
      }
    } else if (method === 'include' && val) {
      var vmodels = data.vmodels;
      var rendered = data.includeRendered;
      var loaded = data.includeLoaded;
      var replace = data.includeReplace;
      var target = replace ? elem.parentNode : elem;
      var scanTemplate = function (text) {
        if (loaded) {
          var newText = loaded.apply(target, [text].concat(vmodels));
          if (typeof newText === 'string')
            text = newText;
        }
        if (rendered) {
          checkScan(target, function () {
            rendered.call(target);
          }, NaN);
        }
        var lastID = data.includeLastID;
        if (data.templateCache && lastID && lastID !== val) {
          var lastTemplate = data.templateCache[lastID];
          if (!lastTemplate) {
            lastTemplate = data.templateCache[lastID] = DOC.createElement('div');
            ifGroup.appendChild(lastTemplate);
          }
        }
        data.includeLastID = val;
        while (true) {
          var node = data.startInclude.nextSibling;
          if (node && node !== data.endInclude) {
            target.removeChild(node);
            if (lastTemplate)
              lastTemplate.appendChild(node);
          } else {
            break;
          }
        }
        var dom = getTemplateNodes(data, val, text);
        var nodes = smcore.slice(dom.childNodes);
        target.insertBefore(dom, data.endInclude);
        scanNodeArray(nodes, vmodels);
      };
      if (data.param === 'src') {
        if (typeof cacheTmpls[val] === 'string') {
          smcore.nextTick(function () {
            scanTemplate(cacheTmpls[val]);
          });
        } else if (Array.isArray(cacheTmpls[val])) {
          //#805 防止在循环绑定中发出许多相同的请求
          cacheTmpls[val].push(scanTemplate);
        } else {
          var xhr = getXHR();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              var s = xhr.status;
              if (s >= 200 && s < 300 || s === 304 || s === 1223) {
                var text = xhr.responseText;
                for (var f = 0, fn; fn = cacheTmpls[val][f++];) {
                  fn(text);
                }
                cacheTmpls[val] = text;
              }
            }
          };
          cacheTmpls[val] = [scanTemplate];
          xhr.open('GET', val, true);
          if ('withCredentials' in xhr) {
            xhr.withCredentials = true;
          }
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.send(null);
        }
      } else {
        //IE系列与够新的标准浏览器支持通过ID取得元素（firefox14+）
        //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
        var el = val && val.nodeType === 1 ? val : DOC.getElementById(val);
        if (el) {
          if (el.tagName === 'NOSCRIPT' && !(el.innerHTML || el.fixIE78)) {
            //IE7-8 innerText,innerHTML都无法取得其内容，IE6能取得其innerHTML
            xhr = getXHR();
            //IE9-11与chrome的innerHTML会得到转义的内容，它们的innerText可以
            xhr.open('GET', location, false);
            //谢谢Nodejs 乱炖群 深圳-纯属虚构
            xhr.send(null);
            //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
            var noscripts = DOC.getElementsByTagName('noscript');
            var array = (xhr.responseText || '').match(rnoscripts) || [];
            var n = array.length;
            for (var i = 0; i < n; i++) {
              var tag = noscripts[i];
              if (tag) {
                //IE6-8中noscript标签的innerHTML,innerText是只读的
                tag.style.display = 'none';
                //http://haslayout.net/css/noscript-Ghost-Bug
                tag.fixIE78 = (array[i].match(rnoscriptText) || [
                  '',
                  '&nbsp;'
                ])[1];
              }
            }
          }
          smcore.nextTick(function () {
            scanTemplate(el.fixIE78 || el.value || el.innerText || el.innerHTML);
          });
        }
      }
    } else {
      if (!root.hasAttribute && typeof val === 'string' && (method === 'src' || method === 'href')) {
        val = val.replace(/&amp;/g, '&')  //处理IE67自动转义的问题
;
      }
      elem[method] = val;
      if (window.chrome && elem.tagName === 'EMBED') {
        var parent = elem.parentNode;
        //#525  chrome1-37下embed标签动态设置src不能发生请求
        var comment = document.createComment('vm-src');
        parent.replaceChild(comment, elem);
        parent.replaceChild(elem, comment);
      }
    }
  };
  function getTemplateNodes(data, id, text) {
    var div = data.templateCache && data.templateCache[id];
    if (div) {
      var dom = DOC.createDocumentFragment(), firstChild;
      while (firstChild = div.firstChild) {
        dom.appendChild(firstChild);
      }
      return dom;
    }
    return smcore.parseHTML(text);
  }
  //这几个指令都可以使用插值表达式，如vm-src="aaa/{{b}}/{{c}}.html"
  'title,alt,src,value,css,include,href'.replace(rword, function (name) {
    bindingHandlers[name] = bindingHandlers.attr;
  });
  //根据VM的属性值或表达式的值切换类名，vm-class="xxx yyy zzz:flag" 
  //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
  bindingHandlers['class'] = function (data, vmodels) {
    var oldStyle = data.param, text = data.value, rightExpr;
    data.handlerName = 'class';
    if (!oldStyle || isFinite(oldStyle)) {
      data.param = '';
      //去掉数字
      var noExpr = text.replace(rexprg, function (a) {
        return a.replace(/./g, '0')  //return Math.pow(10, a.length - 1) //将插值表达式插入10的N-1次方来占位
;
      });
      var colonIndex = noExpr.indexOf(':');
      //取得第一个冒号的位置
      if (colonIndex === -1) {
        // 比如 vm-class="aaa bbb ccc" 的情况
        var className = text;
      } else {
        // 比如 vm-class-1="ui-state-active:checked" 的情况 
        className = text.slice(0, colonIndex);
        rightExpr = text.slice(colonIndex + 1);
        parseExpr(rightExpr, vmodels, data);
        //决定是添加还是删除
        if (!data.evaluator) {
          log('debug: vm-class \'' + (rightExpr || '').trim() + '\' \u4E0D\u5B58\u5728\u4E8EVM\u4E2D');
          return false;
        } else {
          data._evaluator = data.evaluator;
          data._args = data.args;
        }
      }
      var hasExpr = rexpr.test(className);
      //比如vm-class="width{{w}}"的情况
      if (!hasExpr) {
        data.immobileClass = className;
      }
      parseExprProxy('', vmodels, data, hasExpr ? scanExpr(className) : 0);
    } else {
      data.immobileClass = data.oldStyle = data.param;
      parseExprProxy(text, vmodels, data);
    }
  };
  bindingExecutors['class'] = function (val, elem, data) {
    var $elem = smcore(elem), method = data.type;
    if (method === 'class' && data.oldStyle) {
      //如果是旧风格
      $elem.toggleClass(data.oldStyle, !!val);
    } else {
      //如果存在冒号就有求值函数
      data.toggleClass = data._evaluator ? !!data._evaluator.apply(elem, data._args) : true;
      data.newClass = data.immobileClass || val;
      if (data.oldClass && data.newClass !== data.oldClass) {
        $elem.removeClass(data.oldClass);
      }
      data.oldClass = data.newClass;
      switch (method) {
      case 'class':
        $elem.toggleClass(data.newClass, data.toggleClass);
        break;
      case 'hover':
      case 'active':
        if (!data.hasBindEvent) {
          //确保只绑定一次
          var activate = 'mouseenter';
          //在移出移入时切换类名
          var abandon = 'mouseleave';
          if (method === 'active') {
            //在聚焦失焦中切换类名
            elem.tabIndex = elem.tabIndex || -1;
            activate = 'mousedown';
            abandon = 'mouseup';
            var fn0 = $elem.bind('mouseleave', function () {
              data.toggleClass && $elem.removeClass(data.newClass);
            });
          }
          var fn1 = $elem.bind(activate, function () {
            data.toggleClass && $elem.addClass(data.newClass);
          });
          var fn2 = $elem.bind(abandon, function () {
            data.toggleClass && $elem.removeClass(data.newClass);
          });
          data.rollback = function () {
            $elem.unbind('mouseleave', fn0);
            $elem.unbind(activate, fn1);
            $elem.unbind(abandon, fn2);
          };
          data.hasBindEvent = true;
        }
        break;
      }
    }
  };
  'hover,active'.replace(rword, function (method) {
    bindingHandlers[method] = bindingHandlers['class'];
  });
  //vm-controller绑定已经在scanTag 方法中实现
  //vm-css绑定已由vm-attr绑定实现
  // bindingHandlers.data 定义在if.js
  bindingExecutors.data = function (val, elem, data) {
    var key = 'data-' + data.param;
    if (val && typeof val === 'object') {
      elem[key] = val;
    } else {
      elem.setAttribute(key, String(val));
    }
  };
  //双工绑定
  var duplexBinding = bindingHandlers.duplex = function (data, vmodels) {
    var elem = data.element, hasCast;
    parseExprProxy(data.value, vmodels, data, 0, 1);
    data.changed = getBindingCallback(elem, 'data-duplex-changed', vmodels) || noop;
    if (data.evaluator && data.args) {
      var params = [];
      var casting = oneObject('string,number,boolean,checked');
      if (elem.type === 'radio' && data.param === '') {
        data.param = 'checked';
      }
      if (elem.msData) {
        elem.msData['vm-duplex'] = data.value;
      }
      data.param.replace(/\w+/g, function (name) {
        if (/^(checkbox|radio)$/.test(elem.type) && /^(radio|checked)$/.test(name)) {
          if (name === 'radio')
            log('vm-duplex-radio\u5DF2\u7ECF\u66F4\u540D\u4E3Avm-duplex-checked');
          name = 'checked';
          data.isChecked = true;
        }
        if (name === 'bool') {
          name = 'boolean';
          log('vm-duplex-bool\u5DF2\u7ECF\u66F4\u540D\u4E3Avm-duplex-boolean');
        } else if (name === 'text') {
          name = 'string';
          log('vm-duplex-text\u5DF2\u7ECF\u66F4\u540D\u4E3Avm-duplex-string');
        }
        if (casting[name]) {
          hasCast = true;
        }
        smcore.Array.ensure(params, name);
      });
      if (!hasCast) {
        params.push('string');
      }
      data.param = params.join('-');
      data.bound = function (type, callback) {
        if (elem.addEventListener) {
          elem.addEventListener(type, callback, false);
        } else {
          elem.attachEvent('on' + type, callback);
        }
        var old = data.rollback;
        data.rollback = function () {
          elem.smcoreSetter = null;
          smcore.unbind(elem, type, callback);
          old && old();
        };
      };
      for (var i in smcore.vmodels) {
        var v = smcore.vmodels[i];
        v.$fire('smcore-vm-duplex-init', data);
      }
      var cpipe = data.pipe || (data.pipe = pipe);
      cpipe(null, data, 'init');
      var tagName = elem.tagName;
      duplexBinding[tagName] && duplexBinding[tagName](elem, data.evaluator.apply(null, data.args), data);
    }
  };
  //不存在 bindingExecutors.duplex
  function fixNull(val) {
    return val == null ? '' : val;
  }
  smcore.duplexHooks = {
    checked: {
      get: function (val, data) {
        return !data.element.oldValue;
      }
    },
    string: {
      get: function (val) {
        //同步到VM
        return val;
      },
      set: fixNull
    },
    'boolean': {
      get: function (val) {
        return val === 'true';
      },
      set: fixNull
    },
    number: {
      get: function (val, data) {
        var number = parseFloat(val);
        if (-val === -number) {
          return number;
        }
        var arr = /strong|medium|weak/.exec(data.element.getAttribute('data-duplex-number')) || ['medium'];
        switch (arr[0]) {
        case 'strong':
          return 0;
        case 'medium':
          return val === '' ? '' : 0;
        case 'weak':
          return val;
        }
      },
      set: fixNull
    }
  };
  function pipe(val, data, action, e) {
    data.param.replace(/\w+/g, function (name) {
      var hook = smcore.duplexHooks[name];
      if (hook && typeof hook[action] === 'function') {
        val = hook[action](val, data);
      }
    });
    return val;
  }
  var TimerID, ribbon = [];
  smcore.tick = function (fn) {
    if (ribbon.push(fn) === 1) {
      TimerID = setInterval(ticker, 60);
    }
  };
  function ticker() {
    for (var n = ribbon.length - 1; n >= 0; n--) {
      var el = ribbon[n];
      if (el() === false) {
        ribbon.splice(n, 1);
      }
    }
    if (!ribbon.length) {
      clearInterval(TimerID);
    }
  }
  var watchValueInTimer = noop;
  var rmsinput = /text|password|hidden/;
  new function () {
    // jshint ignore:line
    try {
      //#272 IE9-IE11, firefox
      var setters = {};
      var aproto = HTMLInputElement.prototype;
      var bproto = HTMLTextAreaElement.prototype;
      function newSetter(value) {
        // jshint ignore:line
        if (smcore.contains(root, this)) {
          setters[this.tagName].call(this, value);
          if (!rmsinput.test(this.type))
            return;
          if (!this.msFocus && this.smcoreSetter) {
            this.smcoreSetter();
          }
        }
      }
      var inputProto = HTMLInputElement.prototype;
      Object.getOwnPropertyNames(inputProto);
      //故意引发IE6-8等浏览器报错
      setters['INPUT'] = Object.getOwnPropertyDescriptor(aproto, 'value').set;
      Object.defineProperty(aproto, 'value', { set: newSetter });
      setters['TEXTAREA'] = Object.getOwnPropertyDescriptor(bproto, 'value').set;
      Object.defineProperty(bproto, 'value', { set: newSetter });
    } catch (e) {
      //在chrome 43中 vm-duplex终于不需要使用定时器实现双向绑定了
      // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
      // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
      watchValueInTimer = smcore.tick;
    }
  }();
  // jshint ignore:line
  if (IEVersion) {
    smcore.bind(DOC, 'selectionchange', function (e) {
      var el = DOC.activeElement;
      if (el && typeof el.smcoreSetter === 'function') {
        el.smcoreSetter();
      }
    });
  }
  //处理radio, checkbox, text, textarea, password
  duplexBinding.INPUT = function (element, evaluator, data) {
    var $type = element.type, bound = data.bound, $elem = smcore(element), composing = false;
    function callback(value) {
      data.changed.call(this, value, data);
    }
    function compositionStart() {
      composing = true;
    }
    function compositionEnd() {
      composing = false;
    }
    //当value变化时改变model的值
    var updateVModel = function () {
      if (composing)
        //处理中文输入法在minlengh下引发的BUG
        return;
      var val = element.oldValue = element.value;
      //防止递归调用形成死循环
      var lastValue = data.pipe(val, data, 'get');
      if ($elem.data('duplexObserve') !== false) {
        evaluator(lastValue);
        callback.call(element, lastValue);
        if ($elem.data('duplex-focus')) {
          smcore.nextTick(function () {
            element.focus();
          });
        }
      }
    };
    //当model变化时,它就会改变value的值
    data.handler = function () {
      var val = data.pipe(evaluator(), data, 'set') + '';
      //fix #673
      if (val !== element.oldValue) {
        element.value = val;
      }
    };
    if (data.isChecked || $type === 'radio') {
      var IE6 = IEVersion === 6;
      updateVModel = function () {
        if ($elem.data('duplexObserve') !== false) {
          var lastValue = data.pipe(element.value, data, 'get');
          evaluator(lastValue);
          callback.call(element, lastValue);
        }
      };
      data.handler = function () {
        var val = evaluator();
        var checked = data.isChecked ? !!val : val + '' === element.value;
        element.oldValue = checked;
        if (IE6) {
          setTimeout(function () {
            //IE8 checkbox, radio是使用defaultChecked控制选中状态，
            //并且要先设置defaultChecked后设置checked
            //并且必须设置延迟
            element.defaultChecked = checked;
            element.checked = checked;
          }, 31);
        } else {
          element.checked = checked;
        }
      };
      bound('click', updateVModel);
    } else if ($type === 'checkbox') {
      updateVModel = function () {
        if ($elem.data('duplexObserve') !== false) {
          var method = element.checked ? 'ensure' : 'remove';
          var array = evaluator();
          if (!Array.isArray(array)) {
            log('vm-duplex\u5E94\u7528\u4E8Echeckbox\u4E0A\u8981\u5BF9\u5E94\u4E00\u4E2A\u6570\u7EC4');
            array = [array];
          }
          smcore.Array[method](array, data.pipe(element.value, data, 'get'));
          callback.call(element, array);
        }
      };
      data.handler = function () {
        var array = [].concat(evaluator());
        //强制转换为数组
        element.checked = array.indexOf(data.pipe(element.value, data, 'get')) > -1;
      };
      bound(W3C ? 'change' : 'click', updateVModel);
    } else {
      var events = element.getAttribute('data-duplex-event') || 'input';
      if (element.attributes['data-event']) {
        log('data-event\u6307\u4EE4\u5DF2\u7ECF\u5E9F\u5F03\uFF0C\u8BF7\u6539\u7528data-duplex-event');
      }
      function delay(e) {
        // jshint ignore:line
        setTimeout(function () {
          updateVModel(e);
        });
      }
      events.replace(rword, function (name) {
        switch (name) {
        case 'input':
          if (!IEVersion) {
            // W3C
            bound('input', updateVModel);
            //非IE浏览器才用这个
            bound('compositionstart', compositionStart);
            bound('compositionend', compositionEnd);
            bound('DOMAutoComplete', updateVModel);
          } else {
            //onpropertychange事件无法区分是程序触发还是用户触发
            // IE下通过selectionchange事件监听IE9+点击input右边的X的清空行为，及粘贴，剪切，删除行为
            if (IEVersion > 8) {
              bound('input', updateVModel)  //IE9使用propertychange无法监听中文输入改动
;
            } else {
              bound('propertychange', function (e) {
                //IE6-8下第一次修改时不会触发,需要使用keydown或selectionchange修正
                if (e.propertyName === 'value') {
                  updateVModel();
                }
              });
            }
            bound('dragend', delay)  //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
                                     //http://www.matts411.com/post/internet-explorer-9-oninput/
;
          }
          break;
        default:
          bound(name, updateVModel);
          break;
        }
      });
      bound('focus', function () {
        element.msFocus = true;
      });
      bound('blur', function () {
        element.msFocus = false;
      });
      if (rmsinput.test($type)) {
        watchValueInTimer(function () {
          if (root.contains(element)) {
            if (!element.msFocus && element.oldValue !== element.value) {
              updateVModel();
            }
          } else if (!element.msRetain) {
            return false;
          }
        });
      }
      element.smcoreSetter = updateVModel  //#765
;
    }
    element.oldValue = element.value;
    registerSubscriber(data);
    callback.call(element, element.value);
  };
  duplexBinding.TEXTAREA = duplexBinding.INPUT;
  duplexBinding.SELECT = function (element, evaluator, data) {
    var $elem = smcore(element);
    function updateVModel() {
      if ($elem.data('duplexObserve') !== false) {
        var val = $elem.val();
        //字符串或字符串数组
        if (Array.isArray(val)) {
          val = val.map(function (v) {
            return data.pipe(v, data, 'get');
          });
        } else {
          val = data.pipe(val, data, 'get');
        }
        if (val + '' !== element.oldValue) {
          evaluator(val);
        }
        data.changed.call(element, val, data);
      }
    }
    data.handler = function () {
      var val = evaluator();
      val = val && val.$model || val;
      if (Array.isArray(val)) {
        if (!element.multiple) {
          log('vm-duplex\u5728<select multiple=true>\u4E0A\u8981\u6C42\u5BF9\u5E94\u4E00\u4E2A\u6570\u7EC4');
        }
      } else {
        if (element.multiple) {
          log('vm-duplex\u5728<select multiple=false>\u4E0D\u80FD\u5BF9\u5E94\u4E00\u4E2A\u6570\u7EC4');
        }
      }
      //必须变成字符串后才能比较
      val = Array.isArray(val) ? val.map(String) : val + '';
      if (val + '' !== element.oldValue) {
        $elem.val(val);
        element.oldValue = val + '';
      }
    };
    data.bound('change', updateVModel);
    checkScan(element, function () {
      registerSubscriber(data);
      data.changed.call(element, evaluator(), data);
    }, NaN);
  };
  // bindingHandlers.html 定义在if.js
  bindingExecutors.html = function (val, elem, data) {
    val = val == null ? '' : val;
    var isHtmlFilter = 'group' in data;
    var parent = isHtmlFilter ? elem.parentNode : elem;
    if (!parent)
      return;
    if (val.nodeType === 11) {
      //将val转换为文档碎片
      var fragment = val;
    } else if (val.nodeType === 1 || val.item) {
      var nodes = val.nodeType === 1 ? val.childNodes : val.item ? val : [];
      fragment = hyperspace.cloneNode(true);
      while (nodes[0]) {
        fragment.appendChild(nodes[0]);
      }
    } else {
      fragment = smcore.parseHTML(val);
    }
    //插入占位符, 如果是过滤器,需要有节制地移除指定的数量,如果是html指令,直接清空
    var comment = DOC.createComment('vm-html');
    if (isHtmlFilter) {
      parent.insertBefore(comment, elem);
      var n = data.group, i = 1;
      while (i < n) {
        var node = elem.nextSibling;
        if (node) {
          parent.removeChild(node);
          i++;
        }
      }
      parent.removeChild(elem);
      data.element = comment  //防止被CG
;
    } else {
      smcore.clearHTML(parent).appendChild(comment);
    }
    if (isHtmlFilter) {
      data.group = fragment.childNodes.length || 1;
    }
    nodes = smcore.slice(fragment.childNodes);
    if (nodes[0]) {
      if (comment.parentNode)
        comment.parentNode.replaceChild(fragment, comment);
      if (isHtmlFilter) {
        data.element = nodes[0];
      }
    }
    scanNodeArray(nodes, data.vmodels);
  };
  bindingHandlers['if'] = bindingHandlers.data = bindingHandlers.text = bindingHandlers.html = function (data, vmodels) {
    parseExprProxy(data.value, vmodels, data);
  };
  bindingExecutors['if'] = function (val, elem, data) {
    if (val) {
      //插回DOM树
      if (elem.nodeType === 8) {
        elem.parentNode.replaceChild(data.template, elem);
        elem = data.element = data.template;
      }
      if (elem.getAttribute(data.name)) {
        elem.removeAttribute(data.name);
        scanAttr(elem, data.vmodels);
      }
      data.rollback = null;
    } else {
      //移出DOM树，并用注释节点占据原位置
      if (elem.nodeType === 1) {
        var node = data.element = DOC.createComment('vm-if');
        elem.parentNode.replaceChild(node, elem);
        data.template = elem;
        //元素节点
        ifGroup.appendChild(elem);
        data.rollback = function () {
          if (elem.parentNode === ifGroup) {
            ifGroup.removeChild(elem);
          }
        };
      }
    }
  };
  //vm-important绑定已经在scanTag 方法中实现
  //vm-include绑定已由vm-attr绑定实现
  //vm-layout-list
  //http://www.cnblogs.com/jqyp/archive/2010/10/23/1859182.html
  //http://nec.netease.com/
  //http://git.oschina.net/xjfhnsd/JXHL/blob/master/src/jxhl.mobile.js
  bindingHandlers.layout = function (data, vmodels) {
  };
  var rdash = /\(([^)]*)\)/;
  bindingHandlers.on = function (data, vmodels) {
    var value = data.value;
    data.type = 'on';
    var eventType = data.param.replace(/-\d+$/, '');
    // vm-on-mousemove-10
    if (typeof bindingHandlers.on[eventType + 'Hook'] === 'function') {
      bindingHandlers.on[eventType + 'Hook'](data);
    }
    if (value.indexOf('(') > 0 && value.indexOf(')') > -1) {
      var matched = (value.match(rdash) || [
        '',
        ''
      ])[1].trim();
      if (matched === '' || matched === '$event') {
        // aaa() aaa($event)当成aaa处理
        value = value.replace(rdash, '');
      }
    }
    parseExprProxy(value, vmodels, data);
  };
  bindingExecutors.on = function (callback, elem, data) {
    callback = function (e) {
      var fn = data.evaluator || noop;
      return fn.apply(this, data.args.concat(e));
    };
    var eventType = data.param.replace(/-\d+$/, '');
    // vm-on-mousemove-10
    if (eventType === 'scan') {
      callback.call(elem, { type: eventType });
    } else if (typeof data.specialBind === 'function') {
      data.specialBind(elem, callback);
    } else {
      var removeFn = smcore.bind(elem, eventType, callback);
    }
    data.rollback = function () {
      if (typeof data.specialUnbind === 'function') {
        data.specialUnbind();
      } else {
        smcore.unbind(elem, eventType, removeFn);
      }
    };
  };
  bindingHandlers.repeat = function (data, vmodels) {
    var type = data.type;
    parseExprProxy(data.value, vmodels, data, 0, 1);
    data.proxies = [];
    var freturn = false;
    try {
      var $repeat = data.$repeat = data.evaluator.apply(0, data.args || []);
      var xtype = smcore.type($repeat);
      if (xtype !== 'object' && xtype !== 'array') {
        freturn = true;
        smcore.log('warning:' + data.value + '\u53EA\u80FD\u662F\u5BF9\u8C61\u6216\u6570\u7EC4');
      }
    } catch (e) {
      freturn = true;
    }
    var arr = data.value.split('.') || [];
    if (arr.length > 1) {
      arr.pop();
      var n = arr[0];
      for (var i = 0, v; v = vmodels[i++];) {
        if (v && v.hasOwnProperty(n)) {
          var events = v[n].$events || {};
          events[subscribers] = events[subscribers] || [];
          events[subscribers].push(data);
          break;
        }
      }
    }
    var elem = data.element;
    elem.removeAttribute(data.name);
    data.sortedCallback = getBindingCallback(elem, 'data-with-sorted', vmodels);
    data.renderedCallback = getBindingCallback(elem, 'data-' + type + '-rendered', vmodels);
    var signature = generateID(type);
    var comment = data.element = DOC.createComment(signature + ':end');
    data.clone = DOC.createComment(signature);
    hyperspace.appendChild(comment);
    if (type === 'each' || type === 'with') {
      data.template = elem.innerHTML.trim();
      smcore.clearHTML(elem).appendChild(comment);
    } else {
      data.template = elem.outerHTML.trim();
      elem.parentNode.replaceChild(comment, elem);
    }
    data.template = smcore.parseHTML(data.template);
    data.rollback = function () {
      var elem = data.element;
      if (!elem)
        return;
      bindingExecutors.repeat.call(data, 'clear');
      var parentNode = elem.parentNode;
      var content = data.template;
      var target = content.firstChild;
      parentNode.replaceChild(content, elem);
      var start = data.$stamp;
      start && start.parentNode && start.parentNode.removeChild(start);
      target = data.element = data.type === 'repeat' ? target : parentNode;
    };
    if (freturn) {
      return;
    }
    data.handler = bindingExecutors.repeat;
    data.$outer = {};
    var check0 = '$key';
    var check1 = '$val';
    if (Array.isArray($repeat)) {
      check0 = '$first';
      check1 = '$last';
    }
    for (i = 0; v = vmodels[i++];) {
      if (v.hasOwnProperty(check0) && v.hasOwnProperty(check1)) {
        data.$outer = v;
        break;
      }
    }
    var $events = $repeat.$events;
    var $list = ($events || {})[subscribers];
    if ($list && smcore.Array.ensure($list, data)) {
      addSubscribers(data, $list);
    }
    if (xtype === 'object') {
      data.$with = true;
      var pool = !$events ? {} : $events.$withProxyPool || ($events.$withProxyPool = {});
      data.handler('append', $repeat, pool);
    } else if ($repeat.length) {
      data.handler('add', 0, $repeat.length);
    }
  };
  bindingExecutors.repeat = function (method, pos, el) {
    if (method) {
      var data = this;
      var end = data.element;
      var parent = end.parentNode;
      var proxies = data.proxies;
      var transation = hyperspace.cloneNode(false);
      switch (method) {
      case 'add':
        //在pos位置后添加el数组（pos为数字，el为数组）
        var n = pos + el;
        var array = data.$repeat;
        var last = array.length - 1;
        var fragments = [], fragment;
        var start = locateNode(data, pos);
        for (var i = pos; i < n; i++) {
          var proxy = eachProxyAgent(i, data);
          proxies.splice(i, 0, proxy);
          shimController(data, transation, proxy, fragments);
        }
        parent.insertBefore(transation, start);
        for (i = 0; fragment = fragments[i++];) {
          scanNodeArray(fragment.nodes, fragment.vmodels);
          fragment.nodes = fragment.vmodels = null;
        }
        break;
      case 'del':
        //将pos后的el个元素删掉(pos, el都是数字)
        start = proxies[pos].$stamp;
        end = locateNode(data, pos + el);
        sweepNodes(start, end);
        var removed = proxies.splice(pos, el);
        recycleProxies(removed, 'each');
        break;
      case 'clear':
        var check = data.$stamp || proxies[0];
        if (check) {
          start = check.$stamp || check;
          sweepNodes(start, end);
        }
        recycleProxies(proxies, 'each');
        break;
      case 'move':
        start = proxies[0].$stamp;
        var signature = start.nodeValue;
        var rooms = [];
        var room = [], node;
        sweepNodes(start, end, function () {
          room.unshift(this);
          if (this.nodeValue === signature) {
            rooms.unshift(room);
            room = [];
          }
        });
        sortByIndex(proxies, pos);
        sortByIndex(rooms, pos);
        while (room = rooms.shift()) {
          while (node = room.shift()) {
            transation.appendChild(node);
          }
        }
        parent.insertBefore(transation, end);
        break;
      case 'index':
        //将proxies中的第pos个起的所有元素重新索引
        last = proxies.length - 1;
        for (; el = proxies[pos]; pos++) {
          el.$index = pos;
          el.$first = pos === 0;
          el.$last = pos === last;
        }
        return;
      case 'set':
        //将proxies中的第pos个元素的VM设置为el（pos为数字，el任意）
        proxy = proxies[pos];
        if (proxy) {
          notifySubscribers(proxy.$events.$index);
        }
        return;
      case 'append':
        //将pos的键值对从el中取出（pos为一个普通对象，el为预先生成好的代理VM对象池）
        var pool = el;
        var keys = [];
        fragments = [];
        for (var key in pos) {
          //得到所有键名
          if (pos.hasOwnProperty(key) && key !== 'hasOwnProperty') {
            keys.push(key);
          }
        }
        if (data.sortedCallback) {
          //如果有回调，则让它们排序
          var keys2 = data.sortedCallback.call(parent, keys);
          if (keys2 && Array.isArray(keys2) && keys2.length) {
            keys = keys2;
          }
        }
        for (i = 0; key = keys[i++];) {
          if (key !== 'hasOwnProperty') {
            if (!pool[key]) {
              pool[key] = withProxyAgent(key, data);
            }
            shimController(data, transation, pool[key], fragments);
          }
        }
        var comment = data.$stamp = data.clone;
        parent.insertBefore(comment, end);
        parent.insertBefore(transation, end);
        for (i = 0; fragment = fragments[i++];) {
          scanNodeArray(fragment.nodes, fragment.vmodels);
          fragment.nodes = fragment.vmodels = null;
        }
        break;
      }
      if (method === 'clear')
        method = 'del';
      var callback = data.renderedCallback || noop, args = arguments;
      checkScan(parent, function () {
        callback.apply(parent, args);
        if (parent.oldValue && parent.tagName === 'SELECT') {
          //fix #503
          smcore(parent).val(parent.oldValue.split(','));
        }
      }, NaN);
    }
  };
  'with,each'.replace(rword, function (name) {
    bindingHandlers[name] = bindingHandlers.repeat;
  });
  function shimController(data, transation, proxy, fragments) {
    var content = data.template.cloneNode(true);
    var nodes = smcore.slice(content.childNodes);
    if (proxy.$stamp) {
      content.insertBefore(proxy.$stamp, content.firstChild);
    }
    transation.appendChild(content);
    var nv = [proxy].concat(data.vmodels);
    var fragment = {
      nodes: nodes,
      vmodels: nv
    };
    fragments.push(fragment);
  }
  function locateNode(data, pos) {
    var proxy = data.proxies[pos];
    return proxy ? proxy.$stamp : data.element;
  }
  function sweepNodes(start, end, callback) {
    while (true) {
      var node = end.previousSibling;
      if (!node)
        break;
      node.parentNode.removeChild(node);
      callback && callback.call(node);
      if (node === start) {
        break;
      }
    }
  }
  // 为vm-each,vm-with, vm-repeat会创建一个代理VM，
  // 通过它们保持一个下上文，让用户能调用$index,$first,$last,$remove,$key,$val,$outer等属性与方法
  // 所有代理VM的产生,消费,收集,存放通过xxxProxyFactory,xxxProxyAgent, recycleProxies,xxxProxyPool实现
  var eachProxyPool = [];
  var withProxyPool = [];
  function eachProxyFactory(name) {
    var source = {
      $host: [],
      $outer: {},
      $stamp: 1,
      $index: 0,
      $first: false,
      $last: false,
      $remove: smcore.noop
    };
    source[name] = {
      get: function () {
        return this.$host[this.$index];
      },
      set: function (val) {
        this.$host.set(this.$index, val);
      }
    };
    var second = {
      $last: 1,
      $first: 1,
      $index: 1
    };
    var proxy = modelFactory(source, second);
    var e = proxy.$events;
    e[name] = e.$first = e.$last = e.$index;
    proxy.$id = generateID('$proxy$each');
    return proxy;
  }
  function eachProxyAgent(index, data) {
    var param = data.param || 'el', proxy;
    for (var i = 0, n = eachProxyPool.length; i < n; i++) {
      var candidate = eachProxyPool[i];
      if (candidate && candidate.hasOwnProperty(param)) {
        proxy = candidate;
        eachProxyPool.splice(i, 1);
      }
    }
    if (!proxy) {
      proxy = eachProxyFactory(param);
    }
    var host = data.$repeat;
    var last = host.length - 1;
    proxy.$index = index;
    proxy.$first = index === 0;
    proxy.$last = index === last;
    proxy.$host = host;
    proxy.$outer = data.$outer;
    proxy.$stamp = data.clone.cloneNode(false);
    proxy.$remove = function () {
      return host.removeAt(proxy.$index);
    };
    return proxy;
  }
  function withProxyFactory() {
    var proxy = modelFactory({
      $key: '',
      $outer: {},
      $host: {},
      $val: {
        get: function () {
          return this.$host[this.$key];
        },
        set: function (val) {
          this.$host[this.$key] = val;
        }
      }
    }, { $val: 1 });
    proxy.$id = generateID('$proxy$with');
    return proxy;
  }
  function withProxyAgent(key, data) {
    var proxy = withProxyPool.pop();
    if (!proxy) {
      proxy = withProxyFactory();
    }
    var host = data.$repeat;
    proxy.$key = key;
    proxy.$host = host;
    proxy.$outer = data.$outer;
    if (host.$events) {
      proxy.$events.$val = host.$events[key];
    } else {
      proxy.$events = {};
    }
    return proxy;
  }
  function recycleProxies(proxies, type) {
    var proxyPool = type === 'each' ? eachProxyPool : withProxyPool;
    smcore.each(proxies, function (key, proxy) {
      if (proxy.$events) {
        for (var i in proxy.$events) {
          if (Array.isArray(proxy.$events[i])) {
            proxy.$events[i].forEach(function (data) {
              if (typeof data === 'object')
                disposeData(data);
            });
            // jshint ignore:line
            proxy.$events[i].length = 0;
          }
        }
        proxy.$host = proxy.$outer = {};
        if (proxyPool.unshift(proxy) > kernel.maxRepeatSize) {
          proxyPool.pop();
        }
      }
    });
    if (type === 'each')
      proxies.length = 0;
  }
  /*********************************************************************
   *                         各种指令                                  *
   **********************************************************************/
  //vm-skip绑定已经在scanTag 方法中实现
  // bindingHandlers.text 定义在if.js
  bindingExecutors.text = function (val, elem) {
    val = val == null ? '' : val;
    //不在页面上显示undefined null
    if (elem.nodeType === 3) {
      //绑定在文本节点上
      try {
        //IE对游离于DOM树外的节点赋值会报错
        elem.data = val;
      } catch (e) {
      }
    } else {
      //绑定在特性节点上
      if ('textContent' in elem) {
        elem.textContent = val;
      } else {
        elem.innerText = val;
      }
    }
  };
  function parseDisplay(nodeName, val) {
    //用于取得此类标签的默认display值
    var key = '_' + nodeName;
    if (!parseDisplay[key]) {
      var node = DOC.createElement(nodeName);
      root.appendChild(node);
      if (W3C) {
        val = getComputedStyle(node, null).display;
      } else {
        val = node.currentStyle.display;
      }
      root.removeChild(node);
      parseDisplay[key] = val;
    }
    return parseDisplay[key];
  }
  smcore.parseDisplay = parseDisplay;
  bindingHandlers.visible = function (data, vmodels) {
    var elem = smcore(data.element);
    var display = elem.css('display');
    if (display === 'none') {
      var style = elem[0].style;
      var has = /visibility/i.test(style.cssText);
      var visible = elem.css('visibility');
      style.display = '';
      style.visibility = 'hidden';
      display = elem.css('display');
      if (display === 'none') {
        display = parseDisplay(elem[0].nodeName);
      }
      style.visibility = has ? visible : '';
    }
    data.display = display;
    parseExprProxy(data.value, vmodels, data);
  };
  bindingExecutors.visible = function (val, elem, data) {
    elem.style.display = val ? data.display : 'none';
  };
  bindingHandlers.widget = function (data, vmodels) {
    var args = data.value.match(rword);
    var elem = data.element;
    var widget = args[0];
    var id = args[1];
    if (!id || id === '$') {
      //没有定义或为$时，取组件名+随机数
      id = generateID(widget);
    }
    var optName = args[2] || widget;
    //没有定义，取组件名
    var constructor = smcore.ui[widget];
    if (typeof constructor === 'function') {
      //vm-widget="tabs,tabsAAA,optname"
      vmodels = elem.vmodels || vmodels;
      for (var i = 0, v; v = vmodels[i++];) {
        if (v.hasOwnProperty(optName) && typeof v[optName] === 'object') {
          var vmOptions = v[optName];
          vmOptions = vmOptions.$model || vmOptions;
          break;
        }
      }
      if (vmOptions) {
        var wid = vmOptions[widget + 'Id'];
        if (typeof wid === 'string') {
          id = wid;
        }
      }
      //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
      var widgetData = smcore.getWidgetData(elem, widget);
      data.value = [
        widget,
        id,
        optName
      ].join(',');
      data[widget + 'Id'] = id;
      data.evaluator = noop;
      elem.msData['vm-widget-id'] = id;
      var options = data[widget + 'Options'] = smcore.mix({}, constructor.defaults, vmOptions || {}, widgetData);
      elem.removeAttribute('vm-widget');
      var vmodel = constructor(elem, data, vmodels) || {};
      //防止组件不返回VM
      if (vmodel.$id) {
        smcore.vmodels[id] = vmodel;
        createSignalTower(elem, vmodel);
        if (vmodel.hasOwnProperty('$init')) {
          vmodel.$init(function () {
            smcore.scan(elem, [vmodel].concat(vmodels));
            if (typeof options.onInit === 'function') {
              options.onInit.call(elem, vmodel, options, vmodels);
            }
          });
        }
        data.rollback = function () {
          try {
            vmodel.widgetElement = null;
            vmodel.$remove();
          } catch (e) {
          }
          elem.msData = {};
          delete smcore.vmodels[vmodel.$id];
        };
        addSubscribers(data, widgetList);
        if (window.chrome) {
          elem.addEventListener('DOMNodeRemovedFromDocument', function () {
            setTimeout(removeSubscribers);
          });
        }
      } else {
        smcore.scan(elem, vmodels);
      }
    } else if (vmodels.length) {
      //如果该组件还没有加载，那么保存当前的vmodels
      elem.vmodels = vmodels;
    }
  };
  var widgetList = [];
  //不存在 bindingExecutors.widget
  /*********************************************************************
   *                             自带过滤器                            *
   **********************************************************************/
  var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim;
  var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g;
  var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/gi;
  var rsanitize = {
    a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/gi,
    img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/gi,
    form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/gi
  };
  var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var rnoalphanumeric = /([^\#-~| |!])/g;
  function numberFormat(number, decimals, point, thousands) {
    //form http://phpjs.org/functions/number_format/
    //number    必需，要格式化的数字
    //decimals  可选，规定多少个小数位。
    //point 可选，规定用作小数点的字符串（默认为 . ）。
    //thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 3 : Math.abs(decimals), sep = thousands || ',', dec = point || '.', s = '', toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k).toFixed(prec);
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  var filters = smcore.filters = {
    uppercase: function (str) {
      return str.toUpperCase();
    },
    lowercase: function (str) {
      return str.toLowerCase();
    },
    truncate: function (str, length, truncation) {
      //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
      length = length || 30;
      truncation = truncation === void 0 ? '...' : truncation;
      return str.length > length ? str.slice(0, length - truncation.length) + truncation : String(str);
    },
    $filter: function (val) {
      for (var i = 1, n = arguments.length; i < n; i++) {
        var array = arguments[i];
        var fn = smcore.filters[array.shift()];
        if (typeof fn === 'function') {
          var arr = [val].concat(array);
          val = fn.apply(null, arr);
        }
      }
      return val;
    },
    camelize: camelize,
    //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
    //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
    //    <a href="jav  ascript:alert('XSS');">IE67chrome</a>
    //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
    //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
    sanitize: function (str) {
      return str.replace(rscripts, '').replace(ropen, function (a, b) {
        var match = a.toLowerCase().match(/<(\w+)\s/);
        if (match) {
          //处理a标签的href属性，img标签的src属性，form标签的action属性
          var reg = rsanitize[match[1]];
          if (reg) {
            a = a.replace(reg, function (s, name, value) {
              var quote = value.charAt(0);
              return name + '=' + quote + 'javascript:void(0)' + quote  // jshint ignore:line
;
            });
          }
        }
        return a.replace(ron, ' ').replace(/\s+/g, ' ')  //移除onXXX事件
;
      });
    },
    escape: function (str) {
      //将字符串经过 str 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
      return String(str).replace(/&/g, '&amp;').replace(rsurrogate, function (value) {
        var hi = value.charCodeAt(0);
        var low = value.charCodeAt(1);
        return '&#' + ((hi - 55296) * 1024 + (low - 56320) + 65536) + ';';
      }).replace(rnoalphanumeric, function (value) {
        return '&#' + value.charCodeAt(0) + ';';
      }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    currency: function (amount, symbol, fractionSize) {
      return (symbol || '\uFFE5') + numberFormat(amount, isFinite(fractionSize) ? fractionSize : 2);
    },
    number: numberFormat
  };
  /*
   'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
   'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
   'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
   'MMMM': Month in year (January-December)
   'MMM': Month in year (Jan-Dec)
   'MM': Month in year, padded (01-12)
   'M': Month in year (1-12)
   'dd': Day in month, padded (01-31)
   'd': Day in month (1-31)
   'EEEE': Day in Week,(Sunday-Saturday)
   'EEE': Day in Week, (Sun-Sat)
   'HH': Hour in day, padded (00-23)
   'H': Hour in day (0-23)
   'hh': Hour in am/pm, padded (01-12)
   'h': Hour in am/pm, (1-12)
   'mm': Minute in hour, padded (00-59)
   'm': Minute in hour (0-59)
   'ss': Second in minute, padded (00-59)
   's': Second in minute (0-59)
   'a': am/pm marker
   'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
   format string can also be one of the following predefined localizable formats:
   
   'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
   'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
   'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
   'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
   'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
   'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
   'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
   'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
   */
  new function () {
    // jshint ignore:line
    function toInt(str) {
      return parseInt(str, 10) || 0;
    }
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg = '-';
        num = -num;
      }
      num = '' + num;
      while (num.length < digits)
        num = '0' + num;
      if (trim)
        num = num.substr(num.length - digits);
      return neg + num;
    }
    function dateGetter(name, size, offset, trim) {
      return function (date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset)
          value += offset;
        if (value === 0 && offset === -12) {
          value = 12;
        }
        return padNumber(value, size, trim);
      };
    }
    function dateStrGetter(name, shortForm) {
      return function (date, formats) {
        var value = date['get' + name]();
        var get = (shortForm ? 'SHORT' + name : name).toUpperCase();
        return formats[get][value];
      };
    }
    function timeZoneGetter(date) {
      var zone = -1 * date.getTimezoneOffset();
      var paddedZone = zone >= 0 ? '+' : '';
      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
      return paddedZone;
    }
    //取得上午下午
    function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter
    };
    var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/;
    var raspnetjson = /^\/Date\((\d+)\)\/$/;
    filters.date = function (date, format) {
      var locate = filters.date.locate, text = '', parts = [], fn, match;
      format = format || 'mediumDate';
      format = locate[format] || format;
      if (typeof date === 'string') {
        if (/^\d+$/.test(date)) {
          date = toInt(date);
        } else if (raspnetjson.test(date)) {
          date = +RegExp.$1;
        } else {
          var trimDate = date.trim();
          var dateArray = [
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
          var oDate = new Date(0);
          //取得年月日
          trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
            var array = c.length === 4 ? [
              c,
              a,
              b
            ] : [
              a,
              b,
              c
            ];
            dateArray[0] = toInt(array[0]);
            //年
            dateArray[1] = toInt(array[1]) - 1;
            //月
            dateArray[2] = toInt(array[2]);
            //日
            return '';
          });
          var dateSetter = oDate.setFullYear;
          var timeSetter = oDate.setHours;
          trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
            dateArray[3] = toInt(a);
            //小时
            dateArray[4] = toInt(b);
            //分钟
            dateArray[5] = toInt(c);
            //秒
            if (d) {
              //毫秒
              dateArray[6] = Math.round(parseFloat('0.' + d) * 1000);
            }
            return '';
          });
          var tzHour = 0;
          var tzMin = 0;
          trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
            dateSetter = oDate.setUTCFullYear;
            timeSetter = oDate.setUTCHours;
            if (symbol) {
              tzHour = toInt(symbol + c);
              tzMin = toInt(symbol + d);
            }
            return '';
          });
          dateArray[3] -= tzHour;
          dateArray[4] -= tzMin;
          dateSetter.apply(oDate, dateArray.slice(0, 3));
          timeSetter.apply(oDate, dateArray.slice(3));
          date = oDate;
        }
      }
      if (typeof date === 'number') {
        date = new Date(date);
      }
      if (smcore.type(date) !== 'date') {
        return;
      }
      while (format) {
        match = rdateFormat.exec(format);
        if (match) {
          parts = parts.concat(match.slice(1));
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }
      parts.forEach(function (value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    };
    var locate = {
      AMPMS: {
        0: '\u4E0A\u5348',
        1: '\u4E0B\u5348'
      },
      DAY: {
        0: '\u661F\u671F\u65E5',
        1: '\u661F\u671F\u4E00',
        2: '\u661F\u671F\u4E8C',
        3: '\u661F\u671F\u4E09',
        4: '\u661F\u671F\u56DB',
        5: '\u661F\u671F\u4E94',
        6: '\u661F\u671F\u516D'
      },
      MONTH: {
        0: '1\u6708',
        1: '2\u6708',
        2: '3\u6708',
        3: '4\u6708',
        4: '5\u6708',
        5: '6\u6708',
        6: '7\u6708',
        7: '8\u6708',
        8: '9\u6708',
        9: '10\u6708',
        10: '11\u6708',
        11: '12\u6708'
      },
      SHORTDAY: {
        '0': '\u5468\u65E5',
        '1': '\u5468\u4E00',
        '2': '\u5468\u4E8C',
        '3': '\u5468\u4E09',
        '4': '\u5468\u56DB',
        '5': '\u5468\u4E94',
        '6': '\u5468\u516D'
      },
      fullDate: 'y\u5E74M\u6708d\u65E5EEEE',
      longDate: 'y\u5E74M\u6708d\u65E5',
      medium: 'yyyy-M-d H:mm:ss',
      mediumDate: 'yyyy-M-d',
      mediumTime: 'H:mm:ss',
      'short': 'yy-M-d ah:mm',
      shortDate: 'yy-M-d',
      shortTime: 'ah:mm'
    };
    locate.SHORTMONTH = locate.MONTH;
    filters.date.locate = locate;
  }();
  // jshint ignore:line
  /*********************************************************************
   *                     END                                  *
   **********************************************************************/
  new function () {
    smcore.config({ loader: false });
    var fns = [], fn, loaded;
    function flush(f) {
      loaded = 1;
      while (f = fns.shift())
        f();
    }
    if (W3C) {
      smcore.bind(DOC, 'DOMContentLoaded', fn = function () {
        smcore.unbind(DOC, 'DOMContentLoaded', fn);
        flush();
      });
    } else {
      var id = setInterval(function () {
        if (document.readyState === 'complete' && document.body) {
          clearInterval(id);
          flush();
        }
      }, 50);
    }
    smcore.ready = function (fn) {
      loaded ? fn(smcore) : fns.push(fn);
    };
    smcore.ready(function () {
      smcore.scan(DOC.body);
    });
  }();
  // Register as a named AMD module, since smcore can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase smcore is used because AMD module names are
  // derived from file names, and smcore is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of smcore, it will work.
  // Note that for maximum portability, libraries that are not smcore should
  // declare themselves as anonymous modules, and avoid setting a global if an
  // AMD loader is present. smcore is a special case. For more information, see
  // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
  if (true) {
    smcore = function () {
      return smcore;
    }();
  }
  // Map over smcore in case of overwrite
  var _smcore = window.smcore;
  smcore.noConflict = function (deep) {
    if (deep && window.smcore === smcore) {
      window.smcore = _smcore;
    }
    return smcore;
  };
  // Expose smcore identifiers, even in AMD
  // and CommonJS for browser emulators
  if (noGlobal === void 0) {
    window.smcore = smcore;
  }
  return smcore;
}));
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
  if (true) {
    cookie = function (jquery) {
      return typeof factory === 'function' ? factory(jquery) : factory;
    }(jquery);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(jquery);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  var pluses = /\+/g;
  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }
  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }
  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }
  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch (e) {
    }
  }
  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }
  var config = $.cookie = function (key, value, options) {
    // Write
    if (arguments.length > 1 && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);
      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setMilliseconds(t.getMilliseconds() + days * 86400000);
      }
      return document.cookie = [
        encode(key),
        '=',
        stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join('');
    }
    // Read
    var result = key ? undefined : {},
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all. Also prevents odd result when
      // calling $.cookie().
      cookies = document.cookie ? document.cookie.split('; ') : [], i = 0, l = cookies.length;
    for (; i < l; i++) {
      var parts = cookies[i].split('='), name = decode(parts.shift()), cookie = parts.join('=');
      if (key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }
      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }
    return result;
  };
  config.defaults = {};
  $.removeCookie = function (key, options) {
    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, { expires: -1 }));
    return !$.cookie(key);
  };
}));