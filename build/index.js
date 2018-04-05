(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SolrFacetedSearch = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(_dereq_,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],3:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,_dereq_('_process'))
},{"_process":10}],4:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = _dereq_('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,_dereq_('_process'))
},{"./emptyFunction":2,"_process":10}],5:[function(_dereq_,module,exports){
var isFunction = _dereq_('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":7}],6:[function(_dereq_,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(_dereq_,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],8:[function(_dereq_,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],9:[function(_dereq_,module,exports){
var trim = _dereq_('trim')
  , forEach = _dereq_('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":5,"trim":16}],10:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],11:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = _dereq_('fbjs/lib/invariant');
  var warning = _dereq_('fbjs/lib/warning');
  var ReactPropTypesSecret = _dereq_('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,_dereq_('_process'))
},{"./lib/ReactPropTypesSecret":15,"_process":10,"fbjs/lib/invariant":3,"fbjs/lib/warning":4}],12:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = _dereq_('fbjs/lib/emptyFunction');
var invariant = _dereq_('fbjs/lib/invariant');
var ReactPropTypesSecret = _dereq_('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":15,"fbjs/lib/emptyFunction":2,"fbjs/lib/invariant":3}],13:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = _dereq_('fbjs/lib/emptyFunction');
var invariant = _dereq_('fbjs/lib/invariant');
var warning = _dereq_('fbjs/lib/warning');
var assign = _dereq_('object-assign');

var ReactPropTypesSecret = _dereq_('./lib/ReactPropTypesSecret');
var checkPropTypes = _dereq_('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,_dereq_('_process'))
},{"./checkPropTypes":11,"./lib/ReactPropTypesSecret":15,"_process":10,"fbjs/lib/emptyFunction":2,"fbjs/lib/invariant":3,"fbjs/lib/warning":4,"object-assign":8}],14:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = _dereq_('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = _dereq_('./factoryWithThrowingShims')();
}

}).call(this,_dereq_('_process'))
},{"./factoryWithThrowingShims":12,"./factoryWithTypeCheckers":13,"_process":10}],15:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],16:[function(_dereq_,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],17:[function(_dereq_,module,exports){
"use strict";
var window = _dereq_("global/window")
var isFunction = _dereq_("is-function")
var parseHeaders = _dereq_("parse-headers")
var xtend = _dereq_("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
    try {
        if (xhr.responseType === "document") {
            return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
            return xhr.responseXML
        }
    } catch (e) {}

    return null
}

function noop() {}

},{"global/window":6,"is-function":7,"parse-headers":9,"xtend":18}],18:[function(_dereq_,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],19:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _xhr = _dereq_("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

var _solrQuery = _dereq_("./solr-query");

var _solrQuery2 = _interopRequireDefault(_solrQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_INT = 2147483647;

var server = {};

server.performXhr = function (options, accept) {
	var reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
		console.warn("Undefined reject callback! ");(console.trace || function () {})();
	};

	(0, _xhr2.default)(options, accept, reject);
};

server.submitQuery = function (query, callback) {
	callback({ type: "SET_RESULTS_PENDING" });

	server.performXhr({
		url: query.url,
		data: (0, _solrQuery2.default)(query),
		method: "POST",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}, function (err, resp) {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			callback({ type: "SET_RESULTS", data: JSON.parse(resp.body) });
		} else {
			console.log("Server error: ", resp.statusCode);
		}
	});
};

server.fetchCsv = function (query, callback) {
	server.performXhr({
		url: query.url,
		data: (0, _solrQuery2.default)(_extends({}, query, { rows: MAX_INT }), {
			wt: "csv",
			"csv.mv.separator": "|",
			"csv.separator": ";"
		}),
		method: "POST",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}, function (err, resp) {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			callback(resp.body);
		} else {
			console.log("Server error: ", resp.statusCode);
		}
	});
};

exports.default = server;

},{"./solr-query":21,"xhr":17}],20:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SolrClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import { submitQuery, fetchCsv } from "./server";


var _query = _dereq_("../reducers/query");

var _query2 = _interopRequireDefault(_query);

var _results = _dereq_("../reducers/results");

var _results2 = _interopRequireDefault(_results);

var _server = _dereq_("./server");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SolrClient = function () {
	function SolrClient(settings) {
		_classCallCheck(this, SolrClient);

		var onChange = settings.onChange;


		this.onChange = onChange;
		delete settings.onChange;

		this.state = {
			query: settings,
			results: {
				facets: [],
				docs: [],
				numFound: 0
			}
		};
		this.settings = _extends({}, settings);

		if (!this.state.query.pageStrategy) {
			this.state.query.pageStrategy = "paginate";
		}
		if (!this.state.query.rows) {
			this.state.query.rows = 20;
		}

		if (this.state.query.pageStrategy === "cursor" && !this.state.query.idField) {
			throw new Error("Pagination strategy 'cursor' requires a unique 'idField' to be passed.");
		}
	}

	_createClass(SolrClient, [{
		key: "setInitialQuery",
		value: function setInitialQuery(queryToMerge) {

			var searchFieldsToMerge = queryToMerge.searchFields || [];
			var sortFieldsToMerge = queryToMerge.sortFields || [];

			this.state.query.searchFields = this.state.query.searchFields.map(function (sf) {
				return searchFieldsToMerge.map(function (sfm) {
					return sfm.field;
				}).indexOf(sf.field) > -1 ? _extends({}, sf, { value: searchFieldsToMerge.find(function (sfm) {
						return sfm.field === sf.field;
					}).value }) : sf;
			});

			this.state.query.sortFields = this.state.query.sortFields.map(function (sf) {
				return sortFieldsToMerge.map(function (sfm) {
					return sfm.field;
				}).indexOf(sf.field) > -1 ? _extends({}, sf, { value: sortFieldsToMerge.find(function (sfm) {
						return sfm.field === sf.field;
					}).value }) : sf;
			});
		}
	}, {
		key: "initialize",
		value: function initialize() {
			var query = this.state.query;
			var pageStrategy = query.pageStrategy;

			var payload = _extends({ type: "SET_QUERY_FIELDS"
			}, query, { start: pageStrategy === "paginate" ? 0 : null
			});

			this.sendQuery((0, _query2.default)(this.state.query, payload));

			return this;
		}
	}, {
		key: "resetSearchFields",
		value: function resetSearchFields() {
			var query = this.state.query;
			var pageStrategy = query.pageStrategy;

			var payload = _extends({ type: "SET_QUERY_FIELDS"
			}, this.settings, { start: pageStrategy === "paginate" ? 0 : null
			});
			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "sendQuery",
		value: function sendQuery() {
			var _this = this;

			var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.query;

			delete query.cursorMark;
			this.state.query = query;
			_server2.default.submitQuery(query, function (action) {
				_this.state.results = (0, _results2.default)(_this.state.results, action);
				_this.state.query = (0, _query2.default)(_this.state.query, action);
				_this.onChange(_this.state, _this.getHandlers());
			});
		}
	}, {
		key: "sendNextCursorQuery",
		value: function sendNextCursorQuery() {
			var _this2 = this;

			_server2.default.submitQuery(this.state.query, function (action) {
				_this2.state.results = (0, _results2.default)(_this2.state.results, _extends({}, action, {
					type: action.type === "SET_RESULTS" ? "SET_NEXT_RESULTS" : action.type
				}));
				_this2.state.query = (0, _query2.default)(_this2.state.query, action);
				_this2.onChange(_this2.state, _this2.getHandlers());
			});
		}
	}, {
		key: "fetchCsv",
		value: function fetchCsv() {
			_server2.default.fetchCsv(this.state.query, function (data) {
				var element = document.createElement("a");
				element.setAttribute("href", "data:application/csv;charset=utf-8," + encodeURIComponent(data));
				element.setAttribute("download", "export.csv");

				element.style.display = "none";
				document.body.appendChild(element);

				element.click();

				document.body.removeChild(element);
			});
		}
	}, {
		key: "setCurrentPage",
		value: function setCurrentPage(page) {
			var query = this.state.query;
			var rows = query.rows;

			var payload = { type: "SET_START", newStart: page * rows };
			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setGroup",
		value: function setGroup(group) {
			var payload = { type: "SET_GROUP", group: group };
			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setSearchFieldValue",
		value: function setSearchFieldValue(field, value) {
			var query = this.state.query;
			var searchFields = query.searchFields;

			var newFields = searchFields.map(function (searchField) {
				return searchField.field === field ? _extends({}, searchField, { value: value }) : searchField;
			});

			var payload = { type: "SET_SEARCH_FIELDS", newFields: newFields };

			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setFacetSort",
		value: function setFacetSort(field, value) {
			var query = this.state.query;
			var searchFields = query.searchFields;

			var newFields = searchFields.map(function (searchField) {
				return searchField.field === field ? _extends({}, searchField, { facetSort: value }) : searchField;
			});

			var payload = { type: "SET_SEARCH_FIELDS", newFields: newFields };

			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setSortFieldValue",
		value: function setSortFieldValue(field, value) {
			var query = this.state.query;
			var sortFields = query.sortFields;

			var newSortFields = sortFields.map(function (sortField) {
				return sortField.field === field ? _extends({}, sortField, { value: value }) : _extends({}, sortField, { value: null });
			});

			var payload = { type: "SET_SORT_FIELDS", newSortFields: newSortFields };
			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setFilters",
		value: function setFilters(filters) {
			var payload = { type: "SET_FILTERS", newFilters: filters };
			this.sendQuery((0, _query2.default)(this.state.query, payload));
		}
	}, {
		key: "setCollapse",
		value: function setCollapse(field, value) {
			var query = this.state.query;
			var searchFields = query.searchFields;

			var newFields = searchFields.map(function (searchField) {
				return searchField.field === field ? _extends({}, searchField, { collapse: value }) : searchField;
			});
			var payload = { type: "SET_SEARCH_FIELDS", newFields: newFields };
			this.state.query = (0, _query2.default)(this.state.query, payload);
			this.onChange(this.state, this.getHandlers());
		}
	}, {
		key: "getHandlers",
		value: function getHandlers() {
			return {
				onSortFieldChange: this.setSortFieldValue.bind(this),
				onSearchFieldChange: this.setSearchFieldValue.bind(this),
				onFacetSortChange: this.setFacetSort.bind(this),
				onPageChange: this.setCurrentPage.bind(this),
				onNextCursorQuery: this.sendNextCursorQuery.bind(this),
				onSetCollapse: this.setCollapse.bind(this),
				onNewSearch: this.resetSearchFields.bind(this),
				onCsvExport: this.fetchCsv.bind(this),
				onGroupChange: this.setGroup.bind(this)
			};
		}
	}]);

	return SolrClient;
}();

exports.SolrClient = SolrClient;

},{"../reducers/query":44,"../reducers/results":45,"./server":19}],21:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var rangeFacetToQueryFilter = function rangeFacetToQueryFilter(field) {
	var filters = field.value || [];
	if (filters.length < 2) {
		return null;
	}

	return encodeURIComponent(field.field + ":[" + filters[0] + " TO " + filters[1] + "]");
};

var periodRangeFacetToQueryFilter = function periodRangeFacetToQueryFilter(field) {
	var filters = field.value || [];
	if (filters.length < 2) {
		return null;
	}

	return encodeURIComponent(field.lowerBound + ":[" + filters[0] + " TO " + filters[1] + "] OR " + (field.upperBound + ":[" + filters[0] + " TO " + filters[1] + "] OR ") + ("(" + field.lowerBound + ":[* TO " + filters[0] + "] AND " + field.upperBound + ":[" + filters[1] + " TO *])"));
};

var listFacetFieldToQueryFilter = function listFacetFieldToQueryFilter(field) {
	var filters = field.value || [];
	if (filters.length === 0) {
		return null;
	}

	var filterQ = filters.map(function (f) {
		return "\"" + f + "\"";
	}).join(" OR ");
	return encodeURIComponent(field.field + ":(" + filterQ + ")");
};

var textFieldToQueryFilter = function textFieldToQueryFilter(field) {
	if (!field.value || field.value.length === 0) {
		return null;
	}

	return encodeURIComponent(field.field === "*" ? field.value : field.field + ":" + field.value);
};

var fieldToQueryFilter = function fieldToQueryFilter(field) {
	if (field.type === "text") {
		return textFieldToQueryFilter(field);
	} else if (field.type === "list-facet") {
		return listFacetFieldToQueryFilter(field);
	} else if (field.type === "range-facet" || field.type === "range") {
		return rangeFacetToQueryFilter(field);
	} else if (field.type === "period-range-facet" || field.type === "period-range") {
		return periodRangeFacetToQueryFilter(field);
	}
	return null;
};

var buildQuery = function buildQuery(fields) {
	return fields.map(fieldToQueryFilter).filter(function (queryFilter) {
		return queryFilter !== null;
	}).map(function (queryFilter) {
		return "fq=" + queryFilter;
	}).join("&");
};

var facetFields = function facetFields(fields) {
	return fields.filter(function (field) {
		return field.type === "list-facet" || field.type === "range-facet";
	}).map(function (field) {
		return "facet.field=" + encodeURIComponent(field.field);
	}).concat(fields.filter(function (field) {
		return field.type === "period-range-facet";
	}).map(function (field) {
		return "facet.field=" + encodeURIComponent(field.lowerBound) + "&facet.field=" + encodeURIComponent(field.upperBound);
	})).join("&");
};

var facetSorts = function facetSorts(fields) {
	return fields.filter(function (field) {
		return field.facetSort;
	}).map(function (field) {
		return "f." + encodeURIComponent(field.field) + ".facet.sort=" + field.facetSort;
	}).join("&");
};

var buildSort = function buildSort(sortFields) {
	return sortFields.filter(function (sortField) {
		return sortField.value;
	}).map(function (sortField) {
		return encodeURIComponent(sortField.field + " " + sortField.value);
	}).join(",");
};

var buildFormat = function buildFormat(format) {
	return Object.keys(format).map(function (key) {
		return key + "=" + encodeURIComponent(format[key]);
	}).join("&");
};

var solrQuery = function solrQuery(query) {
	var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wt: "json" };
	var searchFields = query.searchFields,
	    sortFields = query.sortFields,
	    rows = query.rows,
	    start = query.start,
	    facetLimit = query.facetLimit,
	    facetSort = query.facetSort,
	    pageStrategy = query.pageStrategy,
	    cursorMark = query.cursorMark,
	    idField = query.idField,
	    group = query.group;


	var filters = (query.filters || []).map(function (filter) {
		return _extends({}, filter, { type: filter.type || "text" });
	});
	var queryParams = buildQuery(searchFields.concat(filters));

	var facetFieldParam = facetFields(searchFields);
	var facetSortParams = facetSorts(searchFields);
	var facetLimitParam = "facet.limit=" + (facetLimit || -1);
	var facetSortParam = "facet.sort=" + (facetSort || "index");

	var cursorMarkParam = pageStrategy === "cursor" ? "cursorMark=" + encodeURIComponent(cursorMark || "*") : "";
	var idSort = pageStrategy === "cursor" ? [{ field: idField, value: "asc" }] : [];

	var sortParam = buildSort(sortFields.concat(idSort));
	var groupParam = group && group.field ? "group=on&group.field=" + encodeURIComponent(group.field) : "";

	return "q=*:*&" + (queryParams.length > 0 ? queryParams : "") + ("" + (sortParam.length > 0 ? "&sort=" + sortParam : "")) + ("" + (facetFieldParam.length > 0 ? "&" + facetFieldParam : "")) + ("" + (facetSortParams.length > 0 ? "&" + facetSortParams : "")) + ("" + (groupParam.length > 0 ? "&" + groupParam : "")) + ("&rows=" + rows) + ("&" + facetLimitParam) + ("&" + facetSortParam) + ("&" + cursorMarkParam) + (start === null ? "" : "&start=" + start) + "&facet=on" + ("&" + buildFormat(format));
};

exports.default = solrQuery;
exports.rangeFacetToQueryFilter = rangeFacetToQueryFilter;
exports.periodRangeFacetToQueryFilter = periodRangeFacetToQueryFilter;
exports.listFacetFieldToQueryFilter = listFacetFieldToQueryFilter;
exports.textFieldToQueryFilter = textFieldToQueryFilter;
exports.fieldToQueryFilter = fieldToQueryFilter;
exports.buildQuery = buildQuery;
exports.facetFields = facetFields;
exports.facetSorts = facetSorts;
exports.buildSort = buildSort;
exports.solrQuery = solrQuery;

},{}],22:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _result = _dereq_("./results/result");

var _result2 = _interopRequireDefault(_result);

var _textSearch = _dereq_("./text-search");

var _textSearch2 = _interopRequireDefault(_textSearch);

var _listFacet = _dereq_("./list-facet");

var _listFacet2 = _interopRequireDefault(_listFacet);

var _header = _dereq_("./results/header");

var _header2 = _interopRequireDefault(_header);

var _list = _dereq_("./results/list");

var _list2 = _interopRequireDefault(_list);

var _pending = _dereq_("./results/pending");

var _pending2 = _interopRequireDefault(_pending);

var _container = _dereq_("./results/container");

var _container2 = _interopRequireDefault(_container);

var _pagination = _dereq_("./results/pagination");

var _pagination2 = _interopRequireDefault(_pagination);

var _preloadIndicator = _dereq_("./results/preload-indicator");

var _preloadIndicator2 = _interopRequireDefault(_preloadIndicator);

var _csvExport = _dereq_("./results/csv-export");

var _csvExport2 = _interopRequireDefault(_csvExport);

var _searchFieldContainer = _dereq_("./search-field-container");

var _searchFieldContainer2 = _interopRequireDefault(_searchFieldContainer);

var _rangeFacet = _dereq_("./range-facet");

var _rangeFacet2 = _interopRequireDefault(_rangeFacet);

var _countLabel = _dereq_("./results/count-label");

var _countLabel2 = _interopRequireDefault(_countLabel);

var _sortMenu = _dereq_("./sort-menu");

var _sortMenu2 = _interopRequireDefault(_sortMenu);

var _currentQuery = _dereq_("./current-query");

var _currentQuery2 = _interopRequireDefault(_currentQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	searchFields: {
		text: _textSearch2.default,
		"list-facet": _listFacet2.default,
		"range-facet": _rangeFacet2.default,
		"period-range-facet": _rangeFacet2.default,
		container: _searchFieldContainer2.default,
		currentQuery: _currentQuery2.default
	},
	results: {
		result: _result2.default,
		resultCount: _countLabel2.default,
		header: _header2.default,
		list: _list2.default,
		container: _container2.default,
		pending: _pending2.default,
		preloadIndicator: _preloadIndicator2.default,
		csvExport: _csvExport2.default,
		paginate: _pagination2.default
	},
	sortFields: {
		menu: _sortMenu2.default
	}
};

},{"./current-query":23,"./list-facet":27,"./range-facet":28,"./results/container":30,"./results/count-label":31,"./results/csv-export":32,"./results/header":33,"./results/list":34,"./results/pagination":35,"./results/pending":36,"./results/preload-indicator":37,"./results/result":38,"./search-field-container":39,"./sort-menu":41,"./text-search":42}],23:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrentQuery = function (_React$Component) {
	_inherits(CurrentQuery, _React$Component);

	function CurrentQuery() {
		_classCallCheck(this, CurrentQuery);

		return _possibleConstructorReturn(this, (CurrentQuery.__proto__ || Object.getPrototypeOf(CurrentQuery)).apply(this, arguments));
	}

	_createClass(CurrentQuery, [{
		key: "removeListFacetValue",
		value: function removeListFacetValue(field, values, value) {
			var foundIdx = values.indexOf(value);
			if (foundIdx > -1) {
				this.props.onChange(field, values.filter(function (v, i) {
					return i !== foundIdx;
				}));
			}
		}
	}, {
		key: "removeRangeFacetValue",
		value: function removeRangeFacetValue(field) {
			this.props.onChange(field, []);
		}
	}, {
		key: "removeTextValue",
		value: function removeTextValue(field) {
			this.props.onChange(field, "");
		}
	}, {
		key: "renderFieldValues",
		value: function renderFieldValues(searchField) {
			var _this2 = this;

			var bootstrapCss = this.props.bootstrapCss;


			switch (searchField.type) {
				case "list-facet":
					return searchField.value.map(function (val, i) {
						return _react2.default.createElement(
							"span",
							{ className: (0, _classnames2.default)({ "label": bootstrapCss, "label-default": bootstrapCss }), key: i,
								onClick: function onClick() {
									return _this2.removeListFacetValue(searchField.field, searchField.value, val);
								} },
							val,
							_react2.default.createElement(
								"a",
								null,
								bootstrapCss ? _react2.default.createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
							)
						);
					});

				case "range-facet":
					return _react2.default.createElement(
						"span",
						{ className: (0, _classnames2.default)({ "label": bootstrapCss, "label-default": bootstrapCss }),
							onClick: function onClick() {
								return _this2.removeRangeFacetValue(searchField.field);
							} },
						searchField.value[0],
						" - ",
						searchField.value[1],
						_react2.default.createElement(
							"a",
							null,
							bootstrapCss ? _react2.default.createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
						)
					);

				case "text":
					return _react2.default.createElement(
						"span",
						{ className: (0, _classnames2.default)({ "label": bootstrapCss, "label-default": bootstrapCss }),
							onClick: function onClick() {
								return _this2.removeTextValue(searchField.field);
							} },
						searchField.value,
						_react2.default.createElement(
							"a",
							null,
							bootstrapCss ? _react2.default.createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
						)
					);
			}
			return null;
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _props = this.props,
			    bootstrapCss = _props.bootstrapCss,
			    query = _props.query;


			var splitFields = query.searchFields.filter(function (searchField) {
				return searchField.value && searchField.value.length > 0;
			}).map(function (searchField, i) {
				return i % 2 === 0 ? { type: "odds", searchField: searchField } : { type: "evens", searchField: searchField };
			});

			var odds = splitFields.filter(function (sf) {
				return sf.type === "evens";
			}).map(function (sf) {
				return sf.searchField;
			});
			var evens = splitFields.filter(function (sf) {
				return sf.type === "odds";
			}).map(function (sf) {
				return sf.searchField;
			});

			if (odds.length === 0 && evens.length === 0) {
				return null;
			}

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)("current-query", { "panel-body": bootstrapCss }) },
				_react2.default.createElement(
					"div",
					{ className: (0, _classnames2.default)({ "row": bootstrapCss }) },
					_react2.default.createElement(
						"ul",
						{ className: (0, _classnames2.default)({ "col-md-6": bootstrapCss }) },
						evens.map(function (searchField, i) {
							return _react2.default.createElement(
								"li",
								{ className: (0, _classnames2.default)({ "list-group-item": bootstrapCss }), key: i },
								_react2.default.createElement(
									"label",
									null,
									searchField.label
								),
								_this3.renderFieldValues(searchField)
							);
						})
					),
					_react2.default.createElement(
						"ul",
						{ className: (0, _classnames2.default)({ "col-md-6": bootstrapCss }) },
						odds.map(function (searchField, i) {
							return _react2.default.createElement(
								"li",
								{ className: (0, _classnames2.default)({ "list-group-item": bootstrapCss }), key: i },
								_react2.default.createElement(
									"label",
									null,
									searchField.label
								),
								_this3.renderFieldValues(searchField)
							);
						})
					)
				)
			);
		}
	}]);

	return CurrentQuery;
}(_react2.default.Component);

CurrentQuery.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	onChange: _propTypes2.default.func,
	query: _propTypes2.default.object
};

exports.default = CurrentQuery;

},{"classnames":1,"prop-types":14,"react":"react"}],24:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckedIcon = function (_React$Component) {
	_inherits(CheckedIcon, _React$Component);

	function CheckedIcon() {
		_classCallCheck(this, CheckedIcon);

		return _possibleConstructorReturn(this, (CheckedIcon.__proto__ || Object.getPrototypeOf(CheckedIcon)).apply(this, arguments));
	}

	_createClass(CheckedIcon, [{
		key: "render",
		value: function render() {
			var title = this.props.title != null ? _react2.default.createElement(
				"title",
				null,
				this.props.title
			) : null;

			return _react2.default.createElement(
				"svg",
				{ className: "checkbox-icon checked", viewBox: "0 0 489 402", width: "10" },
				title,
				_react2.default.createElement("path", { d: "M 377.87,24.128 C 361.786,8.044 342.417,0.002 319.769,0.002 H 82.227 C 59.579,0.002 40.211,8.044 24.125,24.128 8.044,40.214 0.002,59.578 0.002,82.23 v 237.543 c 0,22.647 8.042,42.014 24.123,58.101 16.086,16.085 35.454,24.127 58.102,24.127 h 237.542 c 22.648,0 42.011,-8.042 58.102,-24.127 16.085,-16.087 24.126,-35.453 24.126,-58.101 V 82.23 C 401.993,59.582 393.951,40.214 377.87,24.128 z m -12.422,295.645 c 0,12.559 -4.47,23.314 -13.415,32.264 -8.945,8.945 -19.698,13.411 -32.265,13.411 H 82.227 c -12.563,0 -23.317,-4.466 -32.264,-13.411 -8.945,-8.949 -13.418,-19.705 -13.418,-32.264 V 82.23 c 0,-12.562 4.473,-23.316 13.418,-32.264 C 58.91,41.02 69.664,36.548 82.227,36.548 h 237.542 c 12.566,0 23.319,4.473 32.265,13.418 8.945,8.947 13.415,19.701 13.415,32.264 v 237.543 l -0.001,0 z" }),
				_react2.default.createElement("path", { d: "M 480.59183,75.709029 442.06274,38.831006 c -5.28301,-5.060423 -11.70817,-7.591583 -19.26056,-7.591583 -7.55937,0 -13.98453,2.53116 -19.26753,7.591583 L 217.6825,216.98773 134.38968,136.99258 c -5.28896,-5.06231 -11.71015,-7.59062 -19.26256,-7.59062 -7.55736,0 -13.97854,2.52831 -19.267516,7.59062 l -38.529082,36.87898 c -5.28897,5.06136 -7.932461,11.20929 -7.932461,18.44186 0,7.22686 2.643491,13.38049 7.932461,18.4409 l 102.555358,98.15873 38.53207,36.87803 c 5.28598,5.06421 11.70916,7.59253 19.26455,7.59253 7.5524,0 13.97558,-2.53496 19.26454,-7.59253 l 38.53107,-36.87803 205.11372,-196.32314 c 5.284,-5.06232 7.93246,-11.20929 7.93246,-18.441873 0.005,-7.228765 -2.64846,-13.376685 -7.93246,-18.439008 z" })
			);
		}
	}]);

	return CheckedIcon;
}(_react2.default.Component);

CheckedIcon.defaultProps = {};

CheckedIcon.propTypes = {
	title: _propTypes2.default.string
};

exports.default = CheckedIcon;

},{"prop-types":14,"react":"react"}],25:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
	_inherits(Search, _React$Component);

	function Search() {
		_classCallCheck(this, Search);

		return _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));
	}

	_createClass(Search, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				"svg",
				{ className: "search-icon", viewBox: "0 0 250.313 250.313", width: "10" },
				_react2.default.createElement("path", { d: "M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" })
			);
		}
	}]);

	return Search;
}(_react2.default.Component);

exports.default = Search;

},{"react":"react"}],26:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UncheckedIcon = function (_React$Component) {
	_inherits(UncheckedIcon, _React$Component);

	function UncheckedIcon() {
		_classCallCheck(this, UncheckedIcon);

		return _possibleConstructorReturn(this, (UncheckedIcon.__proto__ || Object.getPrototypeOf(UncheckedIcon)).apply(this, arguments));
	}

	_createClass(UncheckedIcon, [{
		key: "render",
		value: function render() {
			var title = this.props.title != null ? _react2.default.createElement(
				"title",
				null,
				this.props.title
			) : null;

			return _react2.default.createElement(
				"svg",
				{ className: "checkbox-icon unchecked", viewBox: "0 0 401.998 401.998", width: "10" },
				_react2.default.createElement("path", { d: "M377.87,24.126C361.786,8.042,342.417,0,319.769,0H82.227C59.579,0,40.211,8.042,24.125,24.126 C8.044,40.212,0.002,59.576,0.002,82.228v237.543c0,22.647,8.042,42.014,24.123,58.101c16.086,16.085,35.454,24.127,58.102,24.127 h237.542c22.648,0,42.011-8.042,58.102-24.127c16.085-16.087,24.126-35.453,24.126-58.101V82.228 C401.993,59.58,393.951,40.212,377.87,24.126z M365.448,319.771c0,12.559-4.47,23.314-13.415,32.264 c-8.945,8.945-19.698,13.411-32.265,13.411H82.227c-12.563,0-23.317-4.466-32.264-13.411c-8.945-8.949-13.418-19.705-13.418-32.264 V82.228c0-12.562,4.473-23.316,13.418-32.264c8.947-8.946,19.701-13.418,32.264-13.418h237.542 c12.566,0,23.319,4.473,32.265,13.418c8.945,8.947,13.415,19.701,13.415,32.264V319.771L365.448,319.771z" })
			);
		}
	}]);

	return UncheckedIcon;
}(_react2.default.Component);

UncheckedIcon.defaultProps = {};

UncheckedIcon.propTypes = {
	title: _propTypes2.default.string
};

exports.default = UncheckedIcon;

},{"prop-types":14,"react":"react"}],27:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _checked = _dereq_("../icons/checked");

var _checked2 = _interopRequireDefault(_checked);

var _unchecked = _dereq_("../icons/unchecked");

var _unchecked2 = _interopRequireDefault(_unchecked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListFacet = function (_React$Component) {
	_inherits(ListFacet, _React$Component);

	function ListFacet(props) {
		_classCallCheck(this, ListFacet);

		var _this = _possibleConstructorReturn(this, (ListFacet.__proto__ || Object.getPrototypeOf(ListFacet)).call(this, props));

		_this.state = {
			filter: "",
			truncateFacetListsAt: props.truncateFacetListsAt
		};
		return _this;
	}

	_createClass(ListFacet, [{
		key: "handleClick",
		value: function handleClick(value) {
			var foundIdx = this.props.value.indexOf(value);
			if (foundIdx < 0) {
				this.props.onChange(this.props.field, this.props.value.concat(value));
			} else {
				this.props.onChange(this.props.field, this.props.value.filter(function (v, i) {
					return i !== foundIdx;
				}));
			}
		}
	}, {
		key: "toggleExpand",
		value: function toggleExpand() {
			this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    query = _props.query,
			    label = _props.label,
			    facets = _props.facets,
			    field = _props.field,
			    value = _props.value,
			    bootstrapCss = _props.bootstrapCss,
			    facetSort = _props.facetSort,
			    collapse = _props.collapse;
			var truncateFacetListsAt = this.state.truncateFacetListsAt;


			var facetCounts = facets.filter(function (facet, i) {
				return i % 2 === 1;
			});
			var facetValues = facets.filter(function (facet, i) {
				return i % 2 === 0;
			});

			var facetSortValue = facetSort ? facetSort : query.facetSort ? query.facetSort : query.facetLimit && query.facetLimit > -1 ? "count" : "index";

			var expanded = !(collapse || false);

			var showMoreLink = truncateFacetListsAt > -1 && truncateFacetListsAt < facetValues.length ? _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)({ "list-group-item": bootstrapCss }), onClick: function onClick() {
						return _this2.setState({ truncateFacetListsAt: -1 });
					} },
				"Show all (",
				facetValues.length,
				")"
			) : null;

			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)("list-facet", { "list-group-item": bootstrapCss }), id: "solr-list-facet-" + field },
				_react2.default.createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2.default.createElement(
						"h5",
						null,
						bootstrapCss ? _react2.default.createElement(
							"span",
							null,
							_react2.default.createElement("span", { className: (0, _classnames2.default)("glyphicon", {
									"glyphicon-collapse-down": expanded,
									"glyphicon-collapse-up": !expanded
								}) }),
							" "
						) : null,
						label
					)
				),
				expanded ? _react2.default.createElement(
					"div",
					null,
					_react2.default.createElement(
						"ul",
						{ className: (0, _classnames2.default)({ "list-group": bootstrapCss }) },
						facetValues.filter(function (facetValue, i) {
							return truncateFacetListsAt < 0 || i < truncateFacetListsAt;
						}).map(function (facetValue, i) {
							return _this2.state.filter.length === 0 || facetValue.toLowerCase().indexOf(_this2.state.filter.toLowerCase()) > -1 ? _react2.default.createElement(
								"li",
								{ className: (0, _classnames2.default)("facet-item-type-" + field, { "list-group-item": bootstrapCss }), key: facetValue + "_" + facetCounts[i], onClick: function onClick() {
										return _this2.handleClick(facetValue);
									} },
								value.indexOf(facetValue) > -1 ? _react2.default.createElement(_checked2.default, null) : _react2.default.createElement(_unchecked2.default, null),
								" ",
								facetValue,
								_react2.default.createElement(
									"span",
									{ className: "facet-item-amount" },
									facetCounts[i]
								)
							) : null;
						}),
						showMoreLink
					),
					facetValues.length > 4 ? _react2.default.createElement(
						"div",
						null,
						_react2.default.createElement("input", { onChange: function onChange(ev) {
								return _this2.setState({ filter: ev.target.value });
							}, placeholder: "Filter... ", type: "text", value: this.state.filter }),
						"\xA0",
						_react2.default.createElement(
							"span",
							{ className: (0, _classnames2.default)({ "btn-group": bootstrapCss }) },
							_react2.default.createElement(
								"button",
								{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "index" }),
									onClick: function onClick() {
										return _this2.props.onFacetSortChange(field, "index");
									} },
								"a-z"
							),
							_react2.default.createElement(
								"button",
								{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "count" }),
									onClick: function onClick() {
										return _this2.props.onFacetSortChange(field, "count");
									} },
								"0-9"
							)
						),
						_react2.default.createElement(
							"span",
							{ className: (0, _classnames2.default)({ "btn-group": bootstrapCss, "pull-right": bootstrapCss }) },
							_react2.default.createElement(
								"button",
								{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss }),
									onClick: function onClick() {
										return _this2.props.onChange(field, []);
									} },
								"clear"
							)
						)
					) : null
				) : null
			);
		}
	}]);

	return ListFacet;
}(_react2.default.Component);

ListFacet.defaultProps = {
	value: []
};

ListFacet.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	children: _propTypes2.default.array,
	collapse: _propTypes2.default.bool,
	facetSort: _propTypes2.default.string,
	facets: _propTypes2.default.array.isRequired,
	field: _propTypes2.default.string.isRequired,
	label: _propTypes2.default.string,
	onChange: _propTypes2.default.func,
	onFacetSortChange: _propTypes2.default.func,
	onSetCollapse: _propTypes2.default.func,
	query: _propTypes2.default.object,
	truncateFacetListsAt: _propTypes2.default.number,
	value: _propTypes2.default.array
};

exports.default = ListFacet;

},{"../icons/checked":24,"../icons/unchecked":26,"classnames":1,"prop-types":14,"react":"react"}],28:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _rangeSlider = _dereq_("./range-slider");

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeFacet = function (_React$Component) {
	_inherits(RangeFacet, _React$Component);

	function RangeFacet(props) {
		_classCallCheck(this, RangeFacet);

		var _this = _possibleConstructorReturn(this, (RangeFacet.__proto__ || Object.getPrototypeOf(RangeFacet)).call(this, props));

		_this.state = {
			value: props.value
		};
		return _this;
	}

	_createClass(RangeFacet, [{
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.setState({ value: nextProps.value });
		}
	}, {
		key: "facetsToRange",
		value: function facetsToRange() {
			var facets = this.props.facets;


			return facets.filter(function (facet, i) {
				return i % 2 === 0;
			}).map(function (v) {
				return parseInt(v);
			}).sort(function (a, b) {
				return a > b ? 1 : -1;
			}).filter(function (a, i, me) {
				return i === 0 || i === me.length - 1;
			});
		}
	}, {
		key: "onRangeChange",
		value: function onRangeChange(range) {
			var bounds = this.facetsToRange();
			var lowerBound = bounds[0];
			var upperBound = bounds[1];
			var realRange = upperBound - lowerBound;

			var newState = {
				value: [Math.floor(range.lowerLimit * realRange) + lowerBound, Math.ceil(range.upperLimit * realRange) + lowerBound]
			};

			if (range.refresh) {
				this.props.onChange(this.props.field, newState.value);
			} else {
				this.setState(newState);
			}
		}
	}, {
		key: "getPercentage",
		value: function getPercentage(range, value) {
			var lowerBound = range[0];
			var upperBound = range[1];
			var realRange = upperBound - lowerBound;

			var atRange = value - lowerBound;
			return atRange / realRange;
		}
	}, {
		key: "toggleExpand",
		value: function toggleExpand(ev) {
			if (ev.target.className.indexOf("clear-button") < 0) {
				this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    label = _props.label,
			    field = _props.field,
			    bootstrapCss = _props.bootstrapCss,
			    collapse = _props.collapse;
			var value = this.state.value;


			var range = this.facetsToRange();

			var filterRange = value.length > 0 ? value : range;

			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)("range-facet", { "list-group-item": bootstrapCss }), id: "solr-range-facet-" + field },
				_react2.default.createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2.default.createElement(
						"button",
						{ style: { display: this.state.expanded ? "block" : "none" },
							className: (0, _classnames2.default)("clear-button", {
								"btn": bootstrapCss,
								"btn-default": bootstrapCss,
								"btn-xs": bootstrapCss,
								"pull-right": bootstrapCss }),
							onClick: function onClick() {
								return _this2.props.onChange(field, []);
							} },
						"clear"
					),
					_react2.default.createElement(
						"h5",
						null,
						bootstrapCss ? _react2.default.createElement(
							"span",
							null,
							_react2.default.createElement("span", { className: (0, _classnames2.default)("glyphicon", {
									"glyphicon-collapse-down": !collapse,
									"glyphicon-collapse-up": collapse
								}) }),
							" "
						) : null,
						label
					)
				),
				_react2.default.createElement(
					"div",
					{ style: { display: collapse ? "none" : "block" } },
					_react2.default.createElement(_rangeSlider2.default, { lowerLimit: this.getPercentage(range, filterRange[0]), onChange: this.onRangeChange.bind(this), upperLimit: this.getPercentage(range, filterRange[1]) }),
					_react2.default.createElement(
						"label",
						null,
						filterRange[0]
					),
					_react2.default.createElement(
						"label",
						{ className: (0, _classnames2.default)({ "pull-right": bootstrapCss }) },
						filterRange[1]
					)
				)
			);
		}
	}]);

	return RangeFacet;
}(_react2.default.Component);

RangeFacet.defaultProps = {
	value: []
};

RangeFacet.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	collapse: _propTypes2.default.bool,
	facets: _propTypes2.default.array.isRequired,
	field: _propTypes2.default.string.isRequired,
	label: _propTypes2.default.string,
	onChange: _propTypes2.default.func,
	onSetCollapse: _propTypes2.default.func,
	value: _propTypes2.default.array
};

exports.default = RangeFacet;

},{"./range-slider":29,"classnames":1,"prop-types":14,"react":"react"}],29:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = _dereq_("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MOUSE_DOWN = 0;
var MOUSE_UP = 1;

var styles = {
	slider: {
		"MozUserSelect": "none",
		"WebkitUserSelect": "none",
		"MsUserSelect": "none",
		"UserSelect": "none",
		"WebkitUserDrag": "none",
		"userDrag": "none",
		"cursor": "pointer",
		width: "100%",
		stroke: "#f1ebe6",
		fill: "#f1ebe6"
	}
};

var RangeSlider = function (_React$Component) {
	_inherits(RangeSlider, _React$Component);

	function RangeSlider(props) {
		_classCallCheck(this, RangeSlider);

		var _this = _possibleConstructorReturn(this, (RangeSlider.__proto__ || Object.getPrototypeOf(RangeSlider)).call(this, props));

		_this.mouseState = MOUSE_UP;
		_this.mouseUpListener = _this.onMouseUp.bind(_this);
		_this.mouseMoveListener = _this.onMouseMove.bind(_this);
		_this.touchMoveListener = _this.onTouchMove.bind(_this);

		_this.state = _extends({}, _this.propsToState(_this.props), { hoverState: null });
		return _this;
	}

	_createClass(RangeSlider, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			window.addEventListener("mouseup", this.mouseUpListener);
			window.addEventListener("mousemove", this.mouseMoveListener);
			window.addEventListener("touchend", this.mouseUpListener);
			window.addEventListener("touchmove", this.touchMoveListener);
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.setState(this.propsToState(nextProps));
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			window.removeEventListener("mouseup", this.mouseUpListener);
			window.removeEventListener("mousemove", this.mouseMoveListener);
			window.removeEventListener("touchend", this.mouseUpListener);
			window.removeEventListener("touchmove", this.touchMoveListener);
		}
	}, {
		key: "propsToState",
		value: function propsToState(props) {
			var lowerLimit = props.lowerLimit || 0;
			var upperLimit = props.upperLimit || 1;
			return {
				lowerLimit: lowerLimit,
				upperLimit: upperLimit
			};
		}
	}, {
		key: "getPositionForLimit",
		value: function getPositionForLimit(pageX) {
			var rect = _reactDom2.default.findDOMNode(this).getBoundingClientRect();
			if (rect.width > 0) {
				var percentage = (pageX - rect.left) / rect.width;
				if (percentage > 1) {
					percentage = 1;
				} else if (percentage < 0) {
					percentage = 0;
				}
				var center = (this.state.upperLimit + this.state.lowerLimit) / 2;

				if (this.state.hoverState === "bar") {
					var lowerLimit = percentage + this.state.lowerLimit - center;
					var upperLimit = percentage - (center - this.state.upperLimit);
					if (upperLimit >= 1) {
						upperLimit = 1;
					}
					if (lowerLimit <= 0) {
						lowerLimit = 0;
					}
					return { lowerLimit: lowerLimit, upperLimit: upperLimit };
				} else if (this.state.hoverState === "lowerLimit") {
					if (percentage >= this.state.upperLimit) {
						percentage = this.state.upperLimit;
					}
					return { lowerLimit: percentage };
				} else if (this.state.hoverState === "upperLimit") {
					if (percentage <= this.state.lowerLimit) {
						percentage = this.state.lowerLimit;
					}
					return { upperLimit: percentage };
				}
			}
			return null;
		}
	}, {
		key: "setRange",
		value: function setRange(pageX) {
			var posForLim = this.getPositionForLimit(pageX);
			if (posForLim !== null) {
				this.setState(posForLim);
				this.props.onChange(_extends({}, this.state, { refresh: false }));
			}
		}
	}, {
		key: "onMouseDown",
		value: function onMouseDown(target, ev) {
			this.mouseState = MOUSE_DOWN;
			this.setState({ hoverState: target });
			return ev.preventDefault();
		}
	}, {
		key: "onMouseMove",
		value: function onMouseMove(ev) {
			if (this.mouseState === MOUSE_DOWN) {
				this.setRange(ev.pageX);
				return ev.preventDefault();
			}
		}
	}, {
		key: "onTouchMove",
		value: function onTouchMove(ev) {
			if (this.mouseState === MOUSE_DOWN) {
				this.setRange(ev.touches[0].pageX);
				return ev.preventDefault();
			}
		}
	}, {
		key: "onMouseUp",
		value: function onMouseUp() {
			if (this.mouseState === MOUSE_DOWN) {
				this.props.onChange(_extends({}, this.state, { refresh: true }));
			}
			this.setState({ hoverState: null });
			this.mouseState = MOUSE_UP;
		}
	}, {
		key: "getRangePath",
		value: function getRangePath() {
			return "M" + (8 + Math.floor(this.state.lowerLimit * 400)) + " 13 L " + (Math.ceil(this.state.upperLimit * 400) - 8) + " 13 Z";
		}
	}, {
		key: "getRangeCircle",
		value: function getRangeCircle(key) {
			var percentage = this.state[key];
			return _react2.default.createElement("circle", {
				className: this.state.hoverState === key ? "hovering" : "",
				cx: percentage * 400, cy: "13",
				onMouseDown: this.onMouseDown.bind(this, key),
				onTouchStart: this.onMouseDown.bind(this, key),
				r: "13" });
		}
	}, {
		key: "render",
		value: function render() {
			var keys = this.state.hoverState === "lowerLimit" ? ["upperLimit", "lowerLimit"] : ["lowerLimit", "upperLimit"];
			return _react2.default.createElement(
				"svg",
				{ className: "facet-range-slider", viewBox: "0 0 400 26" },
				_react2.default.createElement("path", { d: "M0 0 L 0 26 Z", fill: "transparent" }),
				_react2.default.createElement("path", { d: "M400 0 L 400 26 Z", fill: "transparent" }),
				_react2.default.createElement("path", { d: "M0 13 L 400 13 Z", fill: "transparent" }),
				_react2.default.createElement(
					"g",
					{ className: "range-line" },
					_react2.default.createElement("path", {
						className: this.state.hoverState === "bar" ? "hovering" : "",
						d: this.getRangePath(),
						onMouseDown: this.onMouseDown.bind(this, "bar"),
						onTouchStart: this.onMouseDown.bind(this, "bar")
					}),
					this.getRangeCircle(keys[0]),
					this.getRangeCircle(keys[1])
				)
			);
		}
	}]);

	return RangeSlider;
}(_react2.default.Component);

RangeSlider.propTypes = {
	lowerLimit: _propTypes2.default.number,
	onChange: _propTypes2.default.func.isRequired,
	upperLimit: _propTypes2.default.number
};

exports.default = RangeSlider;

},{"prop-types":14,"react":"react","react-dom":"react-dom"}],30:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultContainer = function (_React$Component) {
	_inherits(ResultContainer, _React$Component);

	function ResultContainer() {
		_classCallCheck(this, ResultContainer);

		return _possibleConstructorReturn(this, (ResultContainer.__proto__ || Object.getPrototypeOf(ResultContainer)).apply(this, arguments));
	}

	_createClass(ResultContainer, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)("solr-search-results", { "col-md-9": bootstrapCss }) },
				_react2.default.createElement(
					"div",
					{ className: (0, _classnames2.default)({ "panel": bootstrapCss, "panel-default": bootstrapCss }) },
					this.props.children
				)
			);
		}
	}]);

	return ResultContainer;
}(_react2.default.Component);

ResultContainer.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	children: _propTypes2.default.array
};

exports.default = ResultContainer;

},{"classnames":1,"prop-types":14,"react":"react"}],31:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var resultCountLabels = {
	pl: "Found % results",
	sg: "Found % result",
	none: "No results"
};

var Result = function (_React$Component) {
	_inherits(Result, _React$Component);

	function Result() {
		_classCallCheck(this, Result);

		return _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).apply(this, arguments));
	}

	_createClass(Result, [{
		key: "render",
		value: function render() {
			var numFound = this.props.numFound;

			var resultLabel = numFound > 1 ? resultCountLabels.pl : numFound === 1 ? resultCountLabels.sg : resultCountLabels.none;

			return _react2.default.createElement(
				"label",
				null,
				resultLabel.replace("%", numFound)
			);
		}
	}]);

	return Result;
}(_react2.default.Component);

Result.propTypes = {
	numFound: _propTypes2.default.number.isRequired
};

exports.default = Result;

},{"prop-types":14,"react":"react"}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	var bootstrapCss = props.bootstrapCss,
	    onClick = props.onClick;

	return _react2.default.createElement(
		"button",
		{ onClick: onClick, className: (0, _classnames2.default)({ btn: bootstrapCss, "btn-default": bootstrapCss, "pull-right": bootstrapCss, "btn-xs": bootstrapCss }) },
		"Export excel"
	);
};

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"classnames":1,"react":"react"}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultHeader = function (_React$Component) {
	_inherits(ResultHeader, _React$Component);

	function ResultHeader() {
		_classCallCheck(this, ResultHeader);

		return _possibleConstructorReturn(this, (ResultHeader.__proto__ || Object.getPrototypeOf(ResultHeader)).apply(this, arguments));
	}

	_createClass(ResultHeader, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)({ "panel-heading": bootstrapCss }) },
				this.props.children
			);
		}
	}]);

	return ResultHeader;
}(_react2.default.Component);

ResultHeader.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	children: _propTypes2.default.array
};

exports.default = ResultHeader;

},{"classnames":1,"prop-types":14,"react":"react"}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResultList = function (_React$Component) {
	_inherits(ResultList, _React$Component);

	function ResultList() {
		_classCallCheck(this, ResultList);

		return _possibleConstructorReturn(this, (ResultList.__proto__ || Object.getPrototypeOf(ResultList)).apply(this, arguments));
	}

	_createClass(ResultList, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2.default.createElement(
				"ul",
				{ className: (0, _classnames2.default)({ "list-group": bootstrapCss }) },
				this.props.children
			);
		}
	}]);

	return ResultList;
}(_react2.default.Component);

ResultList.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	children: _propTypes2.default.array
};

exports.default = ResultList;

},{"classnames":1,"prop-types":14,"react":"react"}],35:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pagination = function (_React$Component) {
	_inherits(Pagination, _React$Component);

	function Pagination() {
		_classCallCheck(this, Pagination);

		return _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).apply(this, arguments));
	}

	_createClass(Pagination, [{
		key: "onPageChange",
		value: function onPageChange(page, pageAmt) {
			if (page >= pageAmt || page < 0) {
				return;
			}
			this.props.onChange(page);
		}
	}, {
		key: "renderPage",
		value: function renderPage(page, currentPage, key) {
			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)({ "active": page === currentPage }), key: key },
				_react2.default.createElement(
					"a",
					{ onClick: this.onPageChange.bind(this, page) },
					page + 1
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    bootstrapCss = _props.bootstrapCss,
			    query = _props.query,
			    results = _props.results;
			var start = query.start,
			    rows = query.rows;
			var numFound = results.numFound;

			var pageAmt = Math.ceil(numFound / rows);
			var currentPage = start / rows;

			var rangeStart = currentPage - 2 < 0 ? 0 : currentPage - 2;
			var rangeEnd = rangeStart + 5 > pageAmt ? pageAmt : rangeStart + 5;

			if (rangeEnd - rangeStart < 5 && rangeStart > 0) {
				rangeStart = rangeEnd - 5;
				if (rangeStart < 0) {
					rangeStart = 0;
				}
			}

			var pages = [];
			for (var page = rangeStart; page < rangeEnd; page++) {
				if (pages.indexOf(page) < 0) {
					pages.push(page);
				}
			}

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)({ "panel-body": bootstrapCss, "text-center": bootstrapCss }) },
				_react2.default.createElement(
					"ul",
					{ className: (0, _classnames2.default)("pagination", { "pagination-sm": bootstrapCss }) },
					_react2.default.createElement(
						"li",
						{ className: (0, _classnames2.default)({ "disabled": currentPage === 0 }), key: "start" },
						_react2.default.createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, 0) },
							"<<"
						)
					),
					_react2.default.createElement(
						"li",
						{ className: (0, _classnames2.default)({ "disabled": currentPage - 1 < 0 }), key: "prev" },
						_react2.default.createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, currentPage - 1) },
							"<"
						)
					),
					pages.map(function (page, idx) {
						return _this2.renderPage(page, currentPage, idx);
					}),
					_react2.default.createElement(
						"li",
						{ className: (0, _classnames2.default)({ "disabled": currentPage + 1 >= pageAmt }), key: "next" },
						_react2.default.createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, currentPage + 1, pageAmt) },
							">"
						)
					),
					_react2.default.createElement(
						"li",
						{ className: (0, _classnames2.default)({ "disabled": currentPage === pageAmt - 1 }), key: "end" },
						_react2.default.createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, pageAmt - 1) },
							">>"
						)
					)
				)
			);
		}
	}]);

	return Pagination;
}(_react2.default.Component);

Pagination.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	onChange: _propTypes2.default.func,
	query: _propTypes2.default.object,
	results: _propTypes2.default.object
};

exports.default = Pagination;

},{"classnames":1,"prop-types":14,"react":"react"}],36:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pending = function (_React$Component) {
	_inherits(Pending, _React$Component);

	function Pending() {
		_classCallCheck(this, Pending);

		return _possibleConstructorReturn(this, (Pending.__proto__ || Object.getPrototypeOf(Pending)).apply(this, arguments));
	}

	_createClass(Pending, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				"span",
				null,
				"Waiting for results"
			);
		}
	}]);

	return Pending;
}(_react2.default.Component);

Pending.propTypes = {
	bootstrapCss: _propTypes2.default.bool
};

exports.default = Pending;

},{"prop-types":14,"react":"react"}],37:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = _dereq_("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreloadIndicator = function (_React$Component) {
	_inherits(PreloadIndicator, _React$Component);

	function PreloadIndicator(props) {
		_classCallCheck(this, PreloadIndicator);

		var _this = _possibleConstructorReturn(this, (PreloadIndicator.__proto__ || Object.getPrototypeOf(PreloadIndicator)).call(this, props));

		_this.scrollListener = _this.onWindowScroll.bind(_this);
		return _this;
	}

	_createClass(PreloadIndicator, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			window.addEventListener("scroll", this.scrollListener);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			window.removeEventListener("scroll", this.scrollListener);
		}
	}, {
		key: "onWindowScroll",
		value: function onWindowScroll() {
			var pageStrategy = this.props.query.pageStrategy;
			var pending = this.props.results.pending;


			if (pageStrategy !== "cursor" || pending) {
				return;
			}

			var domNode = _reactDom2.default.findDOMNode(this);
			if (!domNode) {
				return;
			}

			var _domNode$getBoundingC = domNode.getBoundingClientRect(),
			    top = _domNode$getBoundingC.top;

			if (top < window.innerHeight) {
				this.props.onNextCursorQuery();
			}
		}
	}, {
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)("fetch-by-cursor", { "list-group-item": bootstrapCss }) },
				"Loading more..."
			);
		}
	}]);

	return PreloadIndicator;
}(_react2.default.Component);

PreloadIndicator.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	onNextCursorQuery: _propTypes2.default.func,
	query: _propTypes2.default.object,
	results: _propTypes2.default.object
};

exports.default = PreloadIndicator;

},{"classnames":1,"prop-types":14,"react":"react","react-dom":"react-dom"}],38:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Result = function (_React$Component) {
	_inherits(Result, _React$Component);

	function Result() {
		_classCallCheck(this, Result);

		return _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).apply(this, arguments));
	}

	_createClass(Result, [{
		key: "renderValue",
		value: function renderValue(field, doc) {
			var value = [].concat(doc[field] || null).filter(function (v) {
				return v !== null;
			});

			return value.join(", ");
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    bootstrapCss = _props.bootstrapCss,
			    doc = _props.doc,
			    fields = _props.fields;


			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)({ "list-group-item": bootstrapCss }), onClick: function onClick() {
						return _this2.props.onSelect(doc);
					} },
				_react2.default.createElement(
					"ul",
					null,
					fields.filter(function (field) {
						return field.field !== "*";
					}).map(function (field, i) {
						return _react2.default.createElement(
							"li",
							{ key: i },
							_react2.default.createElement(
								"label",
								null,
								field.label || field.field
							),
							_this2.renderValue(field.field, doc)
						);
					})
				)
			);
		}
	}]);

	return Result;
}(_react2.default.Component);

Result.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	doc: _propTypes2.default.object,
	fields: _propTypes2.default.array,
	onSelect: _propTypes2.default.func.isRequired
};

exports.default = Result;

},{"classnames":1,"prop-types":14,"react":"react"}],39:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchFieldContainer = function (_React$Component) {
	_inherits(SearchFieldContainer, _React$Component);

	function SearchFieldContainer() {
		_classCallCheck(this, SearchFieldContainer);

		return _possibleConstructorReturn(this, (SearchFieldContainer.__proto__ || Object.getPrototypeOf(SearchFieldContainer)).apply(this, arguments));
	}

	_createClass(SearchFieldContainer, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    bootstrapCss = _props.bootstrapCss,
			    onNewSearch = _props.onNewSearch;

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)({ "col-md-3": bootstrapCss }) },
				_react2.default.createElement(
					"div",
					{ className: (0, _classnames2.default)({ "panel": bootstrapCss, "panel-default": bootstrapCss }) },
					_react2.default.createElement(
						"header",
						{ className: (0, _classnames2.default)({ "panel-heading": bootstrapCss }) },
						_react2.default.createElement(
							"button",
							{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss }),
								onClick: onNewSearch },
							"New search"
						),
						_react2.default.createElement(
							"label",
							null,
							"Search"
						)
					),
					_react2.default.createElement(
						"ul",
						{ className: (0, _classnames2.default)("solr-search-fields", { "list-group": bootstrapCss }) },
						this.props.children
					)
				)
			);
		}
	}]);

	return SearchFieldContainer;
}(_react2.default.Component);

SearchFieldContainer.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	children: _propTypes2.default.array,
	onNewSearch: _propTypes2.default.func
};

exports.default = SearchFieldContainer;

},{"classnames":1,"prop-types":14,"react":"react"}],40:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _componentPack = _dereq_("./component-pack");

var _componentPack2 = _interopRequireDefault(_componentPack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getFacetValues = function getFacetValues(type, results, field, lowerBound, upperBound) {
	return type === "period-range-facet" ? (results.facets[lowerBound] || []).concat(results.facets[upperBound] || []) : type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;
};

var SolrFacetedSearch = function (_React$Component) {
	_inherits(SolrFacetedSearch, _React$Component);

	function SolrFacetedSearch() {
		_classCallCheck(this, SolrFacetedSearch);

		return _possibleConstructorReturn(this, (SolrFacetedSearch.__proto__ || Object.getPrototypeOf(SolrFacetedSearch)).apply(this, arguments));
	}

	_createClass(SolrFacetedSearch, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    customComponents = _props.customComponents,
			    bootstrapCss = _props.bootstrapCss,
			    query = _props.query,
			    results = _props.results,
			    truncateFacetListsAt = _props.truncateFacetListsAt;
			var _props2 = this.props,
			    onSearchFieldChange = _props2.onSearchFieldChange,
			    onSortFieldChange = _props2.onSortFieldChange,
			    onPageChange = _props2.onPageChange,
			    onCsvExport = _props2.onCsvExport;
			var searchFields = query.searchFields,
			    sortFields = query.sortFields,
			    start = query.start,
			    rows = query.rows;


			var SearchFieldContainerComponent = customComponents.searchFields.container;
			var ResultContainerComponent = customComponents.results.container;

			var ResultComponent = customComponents.results.result;
			var ResultCount = customComponents.results.resultCount;
			var ResultHeaderComponent = customComponents.results.header;
			var ResultListComponent = customComponents.results.list;
			var ResultPendingComponent = customComponents.results.pending;
			var PaginateComponent = customComponents.results.paginate;
			var PreloadComponent = customComponents.results.preloadIndicator;
			var CsvExportComponent = customComponents.results.csvExport;
			var CurrentQueryComponent = customComponents.searchFields.currentQuery;
			var SortComponent = customComponents.sortFields.menu;
			var resultPending = results.pending ? _react2.default.createElement(ResultPendingComponent, { bootstrapCss: bootstrapCss }) : null;

			var pagination = query.pageStrategy === "paginate" ? _react2.default.createElement(PaginateComponent, _extends({}, this.props, { bootstrapCss: bootstrapCss, onChange: onPageChange })) : null;

			var preloadListItem = query.pageStrategy === "cursor" && results.docs.length < results.numFound ? _react2.default.createElement(PreloadComponent, this.props) : null;

			return _react2.default.createElement(
				"div",
				{ className: (0, _classnames2.default)("solr-faceted-search", { "container": bootstrapCss, "col-md-12": bootstrapCss }) },
				_react2.default.createElement(
					SearchFieldContainerComponent,
					{ bootstrapCss: bootstrapCss, onNewSearch: this.props.onNewSearch },
					searchFields.map(function (searchField, i) {
						var type = searchField.type,
						    field = searchField.field,
						    lowerBound = searchField.lowerBound,
						    upperBound = searchField.upperBound;

						var SearchComponent = customComponents.searchFields[type];
						var facets = getFacetValues(type, results, field, lowerBound, upperBound);

						return _react2.default.createElement(SearchComponent, _extends({
							key: i }, _this2.props, searchField, {
							bootstrapCss: bootstrapCss,
							facets: facets,
							truncateFacetListsAt: truncateFacetListsAt,
							onChange: onSearchFieldChange }));
					})
				),
				_react2.default.createElement(
					ResultContainerComponent,
					{ bootstrapCss: bootstrapCss },
					_react2.default.createElement(
						ResultHeaderComponent,
						{ bootstrapCss: bootstrapCss },
						_react2.default.createElement(ResultCount, { bootstrapCss: bootstrapCss, numFound: results.numFound }),
						resultPending,
						_react2.default.createElement(SortComponent, { bootstrapCss: bootstrapCss, onChange: onSortFieldChange, sortFields: sortFields }),
						this.props.showCsvExport ? _react2.default.createElement(CsvExportComponent, { bootstrapCss: bootstrapCss, onClick: onCsvExport }) : null
					),
					_react2.default.createElement(CurrentQueryComponent, _extends({}, this.props, { onChange: onSearchFieldChange })),
					pagination,
					_react2.default.createElement(
						ResultListComponent,
						{ bootstrapCss: bootstrapCss },
						results.docs.map(function (doc, i) {
							return _react2.default.createElement(ResultComponent, { bootstrapCss: bootstrapCss,
								doc: doc,
								fields: searchFields,
								key: doc.id || i,
								onSelect: _this2.props.onSelectDoc,
								resultIndex: i,
								rows: rows,
								start: start
							});
						}),
						preloadListItem
					),
					pagination
				)
			);
		}
	}]);

	return SolrFacetedSearch;
}(_react2.default.Component);

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	customComponents: _componentPack2.default,
	pageStrategy: "paginate",
	rows: 20,
	searchFields: [{ type: "text", field: "*" }],
	sortFields: [],
	truncateFacetListsAt: -1,
	showCsvExport: false
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	customComponents: _propTypes2.default.object,
	onCsvExport: _propTypes2.default.func,
	onNewSearch: _propTypes2.default.func,
	onPageChange: _propTypes2.default.func,
	onSearchFieldChange: _propTypes2.default.func.isRequired,
	onSelectDoc: _propTypes2.default.func,
	onSortFieldChange: _propTypes2.default.func.isRequired,
	query: _propTypes2.default.object,
	results: _propTypes2.default.object,
	showCsvExport: _propTypes2.default.bool,
	truncateFacetListsAt: _propTypes2.default.number
};

exports.default = SolrFacetedSearch;

},{"./component-pack":22,"classnames":1,"prop-types":14,"react":"react"}],41:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = _dereq_("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortMenu = function (_React$Component) {
	_inherits(SortMenu, _React$Component);

	function SortMenu(props) {
		_classCallCheck(this, SortMenu);

		var _this = _possibleConstructorReturn(this, (SortMenu.__proto__ || Object.getPrototypeOf(SortMenu)).call(this, props));

		_this.state = {
			isOpen: false
		};
		_this.documentClickListener = _this.handleDocumentClick.bind(_this);
		return _this;
	}

	_createClass(SortMenu, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			document.addEventListener("click", this.documentClickListener, false);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			document.removeEventListener("click", this.documentClickListener, false);
		}
	}, {
		key: "toggleSelect",
		value: function toggleSelect() {
			if (this.state.isOpen) {
				this.setState({ isOpen: false });
			} else {
				this.setState({ isOpen: true });
			}
		}
	}, {
		key: "onSelect",
		value: function onSelect(sortField) {
			var foundIdx = this.props.sortFields.indexOf(sortField);
			if (foundIdx < 0) {
				this.props.onChange(sortField, "asc");
			} else {
				this.props.onChange(sortField, null);
			}
		}
	}, {
		key: "handleDocumentClick",
		value: function handleDocumentClick(ev) {
			var isOpen = this.state.isOpen;

			if (isOpen && !_reactDom2.default.findDOMNode(this).contains(ev.target)) {
				this.setState({
					isOpen: false
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    bootstrapCss = _props.bootstrapCss,
			    sortFields = _props.sortFields;

			if (sortFields.length === 0) {
				return null;
			}

			var value = sortFields.find(function (sf) {
				return sf.value;
			});

			return _react2.default.createElement(
				"span",
				{ className: (0, _classnames2.default)({ "pull-right": bootstrapCss }) },
				_react2.default.createElement(
					"span",
					{ className: (0, _classnames2.default)({ "dropdown": bootstrapCss, "open": this.state.isOpen }) },
					_react2.default.createElement(
						"button",
						{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "dropdown-toggle": bootstrapCss }),
							onClick: this.toggleSelect.bind(this) },
						value ? value.label : "- select sort -",
						" ",
						_react2.default.createElement("span", { className: "caret" })
					),
					_react2.default.createElement(
						"ul",
						{ className: "dropdown-menu" },
						sortFields.map(function (sortField, i) {
							return _react2.default.createElement(
								"li",
								{ key: i },
								_react2.default.createElement(
									"a",
									{ onClick: function onClick() {
											_this2.onSelect(sortField.field);_this2.toggleSelect();
										} },
									sortField.label
								)
							);
						}),
						value ? _react2.default.createElement(
							"li",
							null,
							_react2.default.createElement(
								"a",
								{ onClick: function onClick() {
										_this2.props.onChange(value.field, null);_this2.toggleSelect();
									} },
								"- clear -"
							)
						) : null
					)
				),
				value ? _react2.default.createElement(
					"span",
					{ className: (0, _classnames2.default)({ "btn-group": bootstrapCss }) },
					_react2.default.createElement(
						"button",
						{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: value.value === "asc" }),
							onClick: function onClick() {
								return _this2.props.onChange(value.field, "asc");
							} },
						"asc"
					),
					_react2.default.createElement(
						"button",
						{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: value.value === "desc" }),
							onClick: function onClick() {
								return _this2.props.onChange(value.field, "desc");
							} },
						"desc"
					)
				) : null
			);
		}
	}]);

	return SortMenu;
}(_react2.default.Component);

SortMenu.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	onChange: _propTypes2.default.func,
	sortFields: _propTypes2.default.array
};

exports.default = SortMenu;

},{"classnames":1,"prop-types":14,"react":"react","react-dom":"react-dom"}],42:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = _dereq_("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _search = _dereq_("../icons/search");

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextSearch = function (_React$Component) {
	_inherits(TextSearch, _React$Component);

	function TextSearch(props) {
		_classCallCheck(this, TextSearch);

		var _this = _possibleConstructorReturn(this, (TextSearch.__proto__ || Object.getPrototypeOf(TextSearch)).call(this, props));

		_this.state = {
			value: ""
		};
		return _this;
	}

	_createClass(TextSearch, [{
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.setState({
				value: nextProps.value
			});
		}
	}, {
		key: "handleInputChange",
		value: function handleInputChange(ev) {
			this.setState({
				value: ev.target.value
			});
		}
	}, {
		key: "handleInputKeyDown",
		value: function handleInputKeyDown(ev) {
			if (ev.keyCode === 13) {
				this.handleSubmit();
			}
		}
	}, {
		key: "handleSubmit",
		value: function handleSubmit() {
			this.props.onChange(this.props.field, this.state.value);
		}
	}, {
		key: "toggleExpand",
		value: function toggleExpand() {
			this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    label = _props.label,
			    bootstrapCss = _props.bootstrapCss,
			    collapse = _props.collapse;


			return _react2.default.createElement(
				"li",
				{ className: (0, _classnames2.default)({ "list-group-item": bootstrapCss }) },
				_react2.default.createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2.default.createElement(
						"h5",
						null,
						bootstrapCss ? _react2.default.createElement(
							"span",
							null,
							_react2.default.createElement("span", { className: (0, _classnames2.default)("glyphicon", {
									"glyphicon-collapse-down": !collapse,
									"glyphicon-collapse-up": collapse
								}) }),
							" "
						) : null,
						label
					)
				),
				_react2.default.createElement(
					"div",
					{ style: { display: collapse ? "none" : "block" } },
					_react2.default.createElement("input", {
						onChange: this.handleInputChange.bind(this),
						onKeyDown: this.handleInputKeyDown.bind(this),
						value: this.state.value || "" }),
					"\xA0",
					_react2.default.createElement(
						"button",
						{ className: (0, _classnames2.default)({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-sm": bootstrapCss }), onClick: this.handleSubmit.bind(this) },
						_react2.default.createElement(_search2.default, null)
					)
				)
			);
		}
	}]);

	return TextSearch;
}(_react2.default.Component);

TextSearch.defaultProps = {
	field: null
};

TextSearch.propTypes = {
	bootstrapCss: _propTypes2.default.bool,
	collapse: _propTypes2.default.bool,
	field: _propTypes2.default.string.isRequired,
	label: _propTypes2.default.string,
	onChange: _propTypes2.default.func,
	onSetCollapse: _propTypes2.default.func
};

exports.default = TextSearch;

},{"../icons/search":25,"classnames":1,"prop-types":14,"react":"react"}],43:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SolrClient = exports.defaultComponentPack = exports.SolrFacetedSearch = undefined;

var _solrFacetedSearch = _dereq_("./components/solr-faceted-search");

var _solrFacetedSearch2 = _interopRequireDefault(_solrFacetedSearch);

var _componentPack = _dereq_("./components/component-pack");

var _componentPack2 = _interopRequireDefault(_componentPack);

var _solrClient = _dereq_("./api/solr-client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _solrFacetedSearch2.default;
exports.SolrFacetedSearch = _solrFacetedSearch2.default;
exports.defaultComponentPack = _componentPack2.default;
exports.SolrClient = _solrClient.SolrClient;

},{"./api/solr-client":20,"./components/component-pack":22,"./components/solr-faceted-search":40}],44:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return setQueryFields(state, action);
		case "SET_SEARCH_FIELDS":
			return _extends({}, state, { searchFields: action.newFields, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_SORT_FIELDS":
			return _extends({}, state, { sortFields: action.newSortFields, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_FILTERS":
			return _extends({}, state, { filters: action.newFilters, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_START":
			return _extends({}, state, { start: action.newStart });
		case "SET_RESULTS":
			return action.data.nextCursorMark ? _extends({}, state, { cursorMark: action.data.nextCursorMark }) : state;
		case "SET_GROUP":
			return _extends({}, state, { group: action.group });
	}

	return state;
};

var initialState = {
	searchFields: [],
	sortFields: [],
	rows: 0,
	url: null,
	pageStrategy: null,
	start: null,
	group: null
};

var setQueryFields = function setQueryFields(state, action) {
	return _extends({}, state, {
		searchFields: action.searchFields,
		sortFields: action.sortFields,
		url: action.url,
		rows: action.rows,
		pageStrategy: action.pageStrategy,
		start: action.start,
		group: action.group
	});
};

},{}],45:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case "SET_RESULTS":
			return _extends({}, state, {
				docs: action.data.response ? action.data.response.docs : [],
				grouped: action.data.grouped || {},
				numFound: action.data.response ? action.data.response.numFound : tryGroupedResultCount(action.data),
				facets: action.data.facet_counts.facet_fields,
				pending: false
			});

		case "SET_NEXT_RESULTS":
			return _extends({}, state, {
				docs: state.docs.concat(action.data.response.docs),
				pending: false
			});

		case "SET_RESULTS_PENDING":
			return _extends({}, state, { pending: true
			});
	}

	return state;
};

var initialState = {
	facets: {},
	docs: [],
	numFound: 0,
	pending: false
};

var tryGroupedResultCount = function tryGroupedResultCount(data) {
	if (data.grouped) {
		for (var key in data.grouped) {
			if (data.grouped[key].matches) {
				return data.grouped[key].matches;
			}
		}
	}
	return 0;
};

},{}]},{},[43])(43)
});