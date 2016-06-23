(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SolrFacetedSearch = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
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
    var timeout = cachedSetTimeout(cleanUpNextTick);
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
    cachedClearTimeout(timeout);
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
        cachedSetTimeout(drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){
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

},{"is-function":5}],4:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],7:[function(_dereq_,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],8:[function(_dereq_,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],9:[function(_dereq_,module,exports){
var getPrototype = _dereq_('./_getPrototype'),
    isHostObject = _dereq_('./_isHostObject'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":6,"./_isHostObject":7,"./isObjectLike":8}],10:[function(_dereq_,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],11:[function(_dereq_,module,exports){
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
},{"for-each":3,"trim":22}],12:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],13:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = applyMiddleware;

var _compose = _dereq_('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":16}],14:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],15:[function(_dereq_,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports["default"] = combineReducers;

var _createStore = _dereq_('./createStore');

var _isPlainObject = _dereq_('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = _dereq_('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2["default"])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        (0, _warning2["default"])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,_dereq_('_process'))
},{"./createStore":17,"./utils/warning":19,"_process":1,"lodash/isPlainObject":9}],16:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var _ret = function () {
      var last = funcs[funcs.length - 1];
      var rest = funcs.slice(0, -1);
      return {
        v: function v() {
          return rest.reduceRight(function (composed, f) {
            return f(composed);
          }, last.apply(undefined, arguments));
        }
      };
    }();

    if (typeof _ret === "object") return _ret.v;
  }
}
},{}],17:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports["default"] = createStore;

var _isPlainObject = _dereq_('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = _dereq_('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, initialState, enhancer) {
  var _ref2;

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */

      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2["default"]] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
}
},{"lodash/isPlainObject":9,"symbol-observable":20}],18:[function(_dereq_,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = _dereq_('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = _dereq_('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = _dereq_('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = _dereq_('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = _dereq_('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = _dereq_('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2["default"];
exports.combineReducers = _combineReducers2["default"];
exports.bindActionCreators = _bindActionCreators2["default"];
exports.applyMiddleware = _applyMiddleware2["default"];
exports.compose = _compose2["default"];
}).call(this,_dereq_('_process'))
},{"./applyMiddleware":13,"./bindActionCreators":14,"./combineReducers":15,"./compose":16,"./createStore":17,"./utils/warning":19,"_process":1}],19:[function(_dereq_,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],20:[function(_dereq_,module,exports){
(function (global){
/* global window */
'use strict';

module.exports = _dereq_('./ponyfill')(global || window || this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill":21}],21:[function(_dereq_,module,exports){
'use strict';

module.exports = function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

},{}],22:[function(_dereq_,module,exports){

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

},{}],23:[function(_dereq_,module,exports){
"use strict";
var window = _dereq_("global/window")
var once = _dereq_("once")
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
    var callback = options.callback
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
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
        callback(err, response, response.body)

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
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
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
            aborted=true//IE9 may still call readystatechange
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

    xhr.send(body)

    return xhr


}

function noop() {}

},{"global/window":4,"is-function":5,"once":10,"parse-headers":11,"xtend":24}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reducersStore = _dereq_("../reducers/store");

var _reducersStore2 = _interopRequireDefault(_reducersStore);

var _server = _dereq_("./server");

var _server2 = _interopRequireDefault(_server);

var _solrQuery = _dereq_("./solr-query");

var _solrQuery2 = _interopRequireDefault(_solrQuery);

var submitQuery = function submitQuery(query, dispatch) {
	dispatch({ type: "SET_RESULTS_PENDING" });

	_server2["default"].performXhr({
		url: (0, _solrQuery2["default"])(query)
	}, function (err, resp) {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({ type: "SET_RESULTS", data: JSON.parse(resp.body) });
		} else {
			console.log("Server error: ", resp.statusCode);
		}
	});
};

var initializeQuery = function initializeQuery(url, searchFields, sortFields, rows, pageStrategy) {
	return function (dispatch) {
		var query = {
			url: url,
			searchFields: searchFields,
			sortFields: sortFields,
			rows: rows,
			pageStrategy: pageStrategy,
			start: pageStrategy === "paginate" ? 0 : null
		};

		dispatch(_extends({ type: "SET_QUERY_FIELDS" }, query));

		submitQuery(query, dispatch);
	};
};

var updateSearchField = function updateSearchField(field, value) {
	return function (dispatch, getState) {
		var _getState = getState();

		var query = _getState.query;
		var searchFields = query.searchFields;
		var pageStrategy = query.pageStrategy;

		var newFields = searchFields.map(function (searchField) {
			return searchField.field === field ? _extends({}, searchField, { value: value }) : searchField;
		});

		dispatch({ type: "SET_SEARCH_FIELDS", newFields: newFields });

		submitQuery(_extends({}, query, { searchFields: newFields, start: pageStrategy === "paginate" ? 0 : null }), dispatch);
	};
};

var updateSortField = function updateSortField(field, value) {
	return function (dispatch, getState) {
		var _getState2 = getState();

		var query = _getState2.query;
		var sortFields = query.sortFields;
		var pageStrategy = query.pageStrategy;

		var newSortFields = sortFields.map(function (sortField) {
			return sortField.field === field ? _extends({}, sortField, { value: value }) : _extends({}, sortField, { value: null });
		});

		dispatch({ type: "SET_SORT_FIELDS", newSortFields: newSortFields });

		submitQuery(_extends({}, query, { sortFields: newSortFields, start: pageStrategy === "paginate" ? 0 : null }), dispatch);
	};
};

var updateStart = function updateStart(page) {
	return function (dispatch, getState) {
		var _getState3 = getState();

		var query = _getState3.query;
		var rows = query.rows;

		dispatch({ type: "SET_START", newStart: page * rows });

		submitQuery(_extends({}, query, { start: page * rows }), dispatch);
	};
};

exports["default"] = {
	onInit: function onInit(url, fields, sortFields, rows, pageStrategy) {
		return _reducersStore2["default"].dispatch(initializeQuery(url, fields, sortFields, rows, pageStrategy));
	},

	onSearchFieldChange: function onSearchFieldChange(field, value) {
		return _reducersStore2["default"].dispatch(updateSearchField(field, value));
	},

	onSortFieldChange: function onSortFieldChange(field, value) {
		return _reducersStore2["default"].dispatch(updateSortField(field, value));
	},

	onPageChange: function onPageChange(page) {
		return _reducersStore2["default"].dispatch(updateStart(page));
	}
};
module.exports = exports["default"];

},{"../reducers/store":49,"./server":26,"./solr-query":27}],26:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _xhr = _dereq_("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

exports["default"] = {
	performXhr: function performXhr(options, accept) {
		var reject = arguments.length <= 2 || arguments[2] === undefined ? function () {
			console.warn("Undefined reject callback! ");(console.trace || function () {})();
		} : arguments[2];

		(0, _xhr2["default"])(options, accept, reject);
	}
};
module.exports = exports["default"];

},{"xhr":23}],27:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var rangeFacetToQueryFilter = function rangeFacetToQueryFilter(field) {
	var filters = field.value || [];
	if (filters.length < 2) {
		return null;
	}

	return "(" + field.field + ":[" + filters[0] + " TO " + filters[1] + "])";
};

var listFacetFieldToQueryFilter = function listFacetFieldToQueryFilter(field) {
	var filters = field.value || [];
	if (filters.length === 0) {
		return null;
	}

	var filterQ = filters.map(function (f) {
		return "\"" + f + "\"";
	}).join(" OR ");
	return field.field + ":(" + filterQ + ")";
};

var textFieldToQueryFilter = function textFieldToQueryFilter(field) {
	return field.field === "*" ? field.value || "*" : field.field + ":" + (field.value || "*");
};

var fieldToQueryFilter = function fieldToQueryFilter(field) {
	if (field.type === "text") {
		return textFieldToQueryFilter(field);
	} else if (field.type === "list-facet") {
		return listFacetFieldToQueryFilter(field);
	} else if (field.type === "range-facet") {
		return rangeFacetToQueryFilter(field);
	}
	return null;
};

var buildQuery = function buildQuery(fields) {
	return fields.map(fieldToQueryFilter).filter(function (queryFilter) {
		return queryFilter !== null;
	}).join(" AND ");
};

var facetFields = function facetFields(fields) {
	return fields.filter(function (field) {
		return field.type === "list-facet" || field.type === "range-facet";
	}).map(function (field) {
		return "facet.field=" + encodeURIComponent(field.field);
	}).join("&");
};

var buildSort = function buildSort(sortFields) {
	return sortFields.filter(function (sortField) {
		return sortField.value;
	}).map(function (sortField) {
		return sortField.field + " " + sortField.value;
	}).join(",");
};

var solrQuery = function solrQuery(query) {
	var url = query.url;
	var searchFields = query.searchFields;
	var sortFields = query.sortFields;
	var rows = query.rows;
	var start = query.start;

	var queryParam = encodeURIComponent(buildQuery(searchFields));
	var sortParam = encodeURIComponent(buildSort(sortFields));
	var facetFieldParam = facetFields(searchFields);

	return url + "?q=" + (queryParam.length > 0 ? queryParam : "*:*") + ("" + (sortParam.length > 0 ? "&sort=" + sortParam : "")) + ("" + (facetFieldParam.length > 0 ? "&" + facetFieldParam : "")) + ("&rows=" + rows) + (start === null ? "" : "&start=" + start) + "&facet=on&wt=json";
};

exports["default"] = solrQuery;
module.exports = exports["default"];

},{}],28:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _resultsResult = _dereq_("./results/result");

var _resultsResult2 = _interopRequireDefault(_resultsResult);

var _textSearch = _dereq_("./text-search");

var _textSearch2 = _interopRequireDefault(_textSearch);

var _listFacet = _dereq_("./list-facet");

var _listFacet2 = _interopRequireDefault(_listFacet);

var _resultsHeader = _dereq_("./results/header");

var _resultsHeader2 = _interopRequireDefault(_resultsHeader);

var _resultsList = _dereq_("./results/list");

var _resultsList2 = _interopRequireDefault(_resultsList);

var _resultsPending = _dereq_("./results/pending");

var _resultsPending2 = _interopRequireDefault(_resultsPending);

var _resultsContainer = _dereq_("./results/container");

var _resultsContainer2 = _interopRequireDefault(_resultsContainer);

var _resultsPagination = _dereq_("./results/pagination");

var _resultsPagination2 = _interopRequireDefault(_resultsPagination);

var _searchFieldContainer = _dereq_("./search-field-container");

var _searchFieldContainer2 = _interopRequireDefault(_searchFieldContainer);

var _rangeFacet = _dereq_("./range-facet");

var _rangeFacet2 = _interopRequireDefault(_rangeFacet);

var _resultsCountLabel = _dereq_("./results/count-label");

var _resultsCountLabel2 = _interopRequireDefault(_resultsCountLabel);

var _sortMenu = _dereq_("./sort-menu");

var _sortMenu2 = _interopRequireDefault(_sortMenu);

exports["default"] = {
	searchFields: {
		text: _textSearch2["default"],
		"list-facet": _listFacet2["default"],
		"range-facet": _rangeFacet2["default"],
		container: _searchFieldContainer2["default"]
	},
	results: {
		result: _resultsResult2["default"],
		resultCount: _resultsCountLabel2["default"],
		header: _resultsHeader2["default"],
		list: _resultsList2["default"],
		container: _resultsContainer2["default"],
		pending: _resultsPending2["default"],
		paginate: _resultsPagination2["default"]
	},
	sortFields: {
		menu: _sortMenu2["default"]
	}
};
module.exports = exports["default"];

},{"./list-facet":31,"./range-facet":32,"./results/container":34,"./results/count-label":35,"./results/header":36,"./results/list":37,"./results/pagination":38,"./results/pending":39,"./results/result":40,"./search-field-container":41,"./sort-menu":43,"./text-search":44}],29:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var CheckedIcon = (function (_React$Component) {
	_inherits(CheckedIcon, _React$Component);

	function CheckedIcon() {
		_classCallCheck(this, CheckedIcon);

		_get(Object.getPrototypeOf(CheckedIcon.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(CheckedIcon, [{
		key: "render",
		value: function render() {
			var title = this.props.title != null ? _react2["default"].createElement(
				"title",
				null,
				this.props.title
			) : null;

			return _react2["default"].createElement(
				"svg",
				{ className: "checkbox-icon checked", viewBox: "0 0 489 402", width: "10" },
				title,
				_react2["default"].createElement("path", { d: "M 377.87,24.128 C 361.786,8.044 342.417,0.002 319.769,0.002 H 82.227 C 59.579,0.002 40.211,8.044 24.125,24.128 8.044,40.214 0.002,59.578 0.002,82.23 v 237.543 c 0,22.647 8.042,42.014 24.123,58.101 16.086,16.085 35.454,24.127 58.102,24.127 h 237.542 c 22.648,0 42.011,-8.042 58.102,-24.127 16.085,-16.087 24.126,-35.453 24.126,-58.101 V 82.23 C 401.993,59.582 393.951,40.214 377.87,24.128 z m -12.422,295.645 c 0,12.559 -4.47,23.314 -13.415,32.264 -8.945,8.945 -19.698,13.411 -32.265,13.411 H 82.227 c -12.563,0 -23.317,-4.466 -32.264,-13.411 -8.945,-8.949 -13.418,-19.705 -13.418,-32.264 V 82.23 c 0,-12.562 4.473,-23.316 13.418,-32.264 C 58.91,41.02 69.664,36.548 82.227,36.548 h 237.542 c 12.566,0 23.319,4.473 32.265,13.418 8.945,8.947 13.415,19.701 13.415,32.264 v 237.543 l -0.001,0 z" }),
				_react2["default"].createElement("path", { d: "M 480.59183,75.709029 442.06274,38.831006 c -5.28301,-5.060423 -11.70817,-7.591583 -19.26056,-7.591583 -7.55937,0 -13.98453,2.53116 -19.26753,7.591583 L 217.6825,216.98773 134.38968,136.99258 c -5.28896,-5.06231 -11.71015,-7.59062 -19.26256,-7.59062 -7.55736,0 -13.97854,2.52831 -19.267516,7.59062 l -38.529082,36.87898 c -5.28897,5.06136 -7.932461,11.20929 -7.932461,18.44186 0,7.22686 2.643491,13.38049 7.932461,18.4409 l 102.555358,98.15873 38.53207,36.87803 c 5.28598,5.06421 11.70916,7.59253 19.26455,7.59253 7.5524,0 13.97558,-2.53496 19.26454,-7.59253 l 38.53107,-36.87803 205.11372,-196.32314 c 5.284,-5.06232 7.93246,-11.20929 7.93246,-18.441873 0.005,-7.228765 -2.64846,-13.376685 -7.93246,-18.439008 z" })
			);
		}
	}]);

	return CheckedIcon;
})(_react2["default"].Component);

CheckedIcon.defaultProps = {};

CheckedIcon.propTypes = {
	title: _react2["default"].PropTypes.string
};

exports["default"] = CheckedIcon;
module.exports = exports["default"];

},{"react":"react"}],30:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var UncheckedIcon = (function (_React$Component) {
	_inherits(UncheckedIcon, _React$Component);

	function UncheckedIcon() {
		_classCallCheck(this, UncheckedIcon);

		_get(Object.getPrototypeOf(UncheckedIcon.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(UncheckedIcon, [{
		key: "render",
		value: function render() {
			var title = this.props.title != null ? _react2["default"].createElement(
				"title",
				null,
				this.props.title
			) : null;

			return _react2["default"].createElement(
				"svg",
				{ className: "checkbox-icon unchecked", viewBox: "0 0 401.998 401.998", width: "10" },
				_react2["default"].createElement("path", { d: "M377.87,24.126C361.786,8.042,342.417,0,319.769,0H82.227C59.579,0,40.211,8.042,24.125,24.126 C8.044,40.212,0.002,59.576,0.002,82.228v237.543c0,22.647,8.042,42.014,24.123,58.101c16.086,16.085,35.454,24.127,58.102,24.127 h237.542c22.648,0,42.011-8.042,58.102-24.127c16.085-16.087,24.126-35.453,24.126-58.101V82.228 C401.993,59.58,393.951,40.212,377.87,24.126z M365.448,319.771c0,12.559-4.47,23.314-13.415,32.264 c-8.945,8.945-19.698,13.411-32.265,13.411H82.227c-12.563,0-23.317-4.466-32.264-13.411c-8.945-8.949-13.418-19.705-13.418-32.264 V82.228c0-12.562,4.473-23.316,13.418-32.264c8.947-8.946,19.701-13.418,32.264-13.418h237.542 c12.566,0,23.319,4.473,32.265,13.418c8.945,8.947,13.415,19.701,13.415,32.264V319.771L365.448,319.771z" })
			);
		}
	}]);

	return UncheckedIcon;
})(_react2["default"].Component);

UncheckedIcon.defaultProps = {};

UncheckedIcon.propTypes = {
	title: _react2["default"].PropTypes.string
};

exports["default"] = UncheckedIcon;
module.exports = exports["default"];

},{"react":"react"}],31:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _iconsChecked = _dereq_("../icons/checked");

var _iconsChecked2 = _interopRequireDefault(_iconsChecked);

var _iconsUnchecked = _dereq_("../icons/unchecked");

var _iconsUnchecked2 = _interopRequireDefault(_iconsUnchecked);

var ListFacet = (function (_React$Component) {
	_inherits(ListFacet, _React$Component);

	function ListFacet() {
		_classCallCheck(this, ListFacet);

		_get(Object.getPrototypeOf(ListFacet.prototype), "constructor", this).apply(this, arguments);
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
		key: "render",
		value: function render() {
			var _this = this;

			var _props = this.props;
			var label = _props.label;
			var facets = _props.facets;
			var field = _props.field;
			var value = _props.value;
			var bootstrapCss = _props.bootstrapCss;

			var facetCounts = facets.filter(function (facet, i) {
				return i % 2 === 1;
			});
			var facetValues = facets.filter(function (facet, i) {
				return i % 2 === 0;
			});

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])("list-facet", { "list-group-item": bootstrapCss }), id: "solr-list-facet-" + field },
				_react2["default"].createElement(
					"header",
					null,
					_react2["default"].createElement(
						"h3",
						null,
						label,
						_react2["default"].createElement(
							"button",
							{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss }),
								onClick: function () {
									return _this.props.onChange(field, []);
								} },
							"❌"
						)
					)
				),
				_react2["default"].createElement(
					"ul",
					{ className: (0, _classnames2["default"])({ "list-group": bootstrapCss }), style: { overflowY: "auto", maxHeight: "200px" } },
					facetValues.map(function (facetValue, i) {
						return _react2["default"].createElement(
							"li",
							{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }), key: i, onClick: function () {
									return _this.handleClick(facetValue);
								}, style: { cursor: "pointer" } },
							value.indexOf(facetValue) > -1 ? _react2["default"].createElement(_iconsChecked2["default"], null) : _react2["default"].createElement(_iconsUnchecked2["default"], null),
							" ",
							facetValue,
							" (",
							facetCounts[i],
							")"
						);
					})
				)
			);
		}
	}]);

	return ListFacet;
})(_react2["default"].Component);

ListFacet.defaultProps = {
	value: []
};

ListFacet.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	facets: _react2["default"].PropTypes.array.isRequired,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func,
	value: _react2["default"].PropTypes.array
};

exports["default"] = ListFacet;
module.exports = exports["default"];

},{"../icons/checked":29,"../icons/unchecked":30,"classnames":2,"react":"react"}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _rangeSlider = _dereq_("./range-slider");

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var RangeFacet = (function (_React$Component) {
	_inherits(RangeFacet, _React$Component);

	function RangeFacet(props) {
		_classCallCheck(this, RangeFacet);

		_get(Object.getPrototypeOf(RangeFacet.prototype), "constructor", this).call(this, props);

		this.state = {
			value: props.value
		};
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
				return a > b;
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
		key: "render",
		value: function render() {
			var _this = this;

			var _props = this.props;
			var label = _props.label;
			var field = _props.field;
			var bootstrapCss = _props.bootstrapCss;
			var value = this.state.value;

			var range = this.facetsToRange();

			var filterRange = value.length > 0 ? value : range;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])("range-facet", { "list-group-item": bootstrapCss }), id: "solr-range-facet-" + field },
				_react2["default"].createElement(
					"header",
					null,
					_react2["default"].createElement(
						"h3",
						null,
						label,
						_react2["default"].createElement(
							"button",
							{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss }),
								onClick: function () {
									return _this.props.onChange(field, []);
								} },
							"❌"
						)
					)
				),
				_react2["default"].createElement(_rangeSlider2["default"], { lowerLimit: this.getPercentage(range, filterRange[0]), onChange: this.onRangeChange.bind(this), upperLimit: this.getPercentage(range, filterRange[1]) }),
				_react2["default"].createElement(
					"label",
					null,
					filterRange[0]
				),
				_react2["default"].createElement(
					"label",
					{ className: (0, _classnames2["default"])({ "pull-right": bootstrapCss }) },
					filterRange[1]
				)
			);
		}
	}]);

	return RangeFacet;
})(_react2["default"].Component);

RangeFacet.defaultProps = {
	value: []
};

RangeFacet.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	facets: _react2["default"].PropTypes.array.isRequired,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func,
	value: _react2["default"].PropTypes.array
};

exports["default"] = RangeFacet;
module.exports = exports["default"];

},{"./range-slider":33,"classnames":2,"react":"react"}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = _dereq_("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

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

var RangeSlider = (function (_React$Component) {
	_inherits(RangeSlider, _React$Component);

	function RangeSlider(props) {
		_classCallCheck(this, RangeSlider);

		_get(Object.getPrototypeOf(RangeSlider.prototype), "constructor", this).call(this, props);

		this.mouseState = MOUSE_UP;
		this.mouseUpListener = this.onMouseUp.bind(this);
		this.mouseMoveListener = this.onMouseMove.bind(this);
		this.touchMoveListener = this.onTouchMove.bind(this);

		this.state = _extends({}, this.propsToState(this.props), { hoverState: null });
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
			var rect = _reactDom2["default"].findDOMNode(this).getBoundingClientRect();
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
			return _react2["default"].createElement("circle", {
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
			return _react2["default"].createElement(
				"svg",
				{ className: "facet-range-slider", style: styles.slider,
					viewBox: "0 0 400 26" },
				_react2["default"].createElement("path", { d: "M0 0 L 0 26 Z", fill: "transparent" }),
				_react2["default"].createElement("path", { d: "M400 0 L 400 26 Z", fill: "transparent" }),
				_react2["default"].createElement("path", { d: "M0 13 L 400 13 Z", fill: "transparent" }),
				_react2["default"].createElement(
					"g",
					{ className: "range-line" },
					_react2["default"].createElement("path", {
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
})(_react2["default"].Component);

RangeSlider.propTypes = {
	lowerLimit: _react2["default"].PropTypes.number,
	onChange: _react2["default"].PropTypes.func.isRequired,
	upperLimit: _react2["default"].PropTypes.number
};

exports["default"] = RangeSlider;
module.exports = exports["default"];

},{"react":"react","react-dom":"react-dom"}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var ResultContainer = (function (_React$Component) {
	_inherits(ResultContainer, _React$Component);

	function ResultContainer() {
		_classCallCheck(this, ResultContainer);

		_get(Object.getPrototypeOf(ResultContainer.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ResultContainer, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])("solr-search-results", { "col-md-9": bootstrapCss }) },
				_react2["default"].createElement(
					"div",
					{ className: (0, _classnames2["default"])({ "panel": bootstrapCss, "panel-default": bootstrapCss }) },
					this.props.children
				)
			);
		}
	}]);

	return ResultContainer;
})(_react2["default"].Component);

ResultContainer.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	children: _react2["default"].PropTypes.array
};

exports["default"] = ResultContainer;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],35:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var resultCountLabels = {
	pl: "Found % results",
	sg: "Found % result",
	none: "No results"
};

var Result = (function (_React$Component) {
	_inherits(Result, _React$Component);

	function Result() {
		_classCallCheck(this, Result);

		_get(Object.getPrototypeOf(Result.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(Result, [{
		key: "render",
		value: function render() {
			var numFound = this.props.numFound;

			var resultLabel = numFound > 1 ? resultCountLabels.pl : resultCountLabels.numFound === 1 ? resultCountLabels.sg : resultCountLabels.none;

			return _react2["default"].createElement(
				"label",
				null,
				resultLabel.replace("%", numFound)
			);
		}
	}]);

	return Result;
})(_react2["default"].Component);

Result.propTypes = {
	numFound: _react2["default"].PropTypes.number.isRequired
};

exports["default"] = Result;
module.exports = exports["default"];

},{"react":"react"}],36:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var ResultHeader = (function (_React$Component) {
	_inherits(ResultHeader, _React$Component);

	function ResultHeader() {
		_classCallCheck(this, ResultHeader);

		_get(Object.getPrototypeOf(ResultHeader.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ResultHeader, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])({ "panel-heading": bootstrapCss }) },
				this.props.children
			);
		}
	}]);

	return ResultHeader;
})(_react2["default"].Component);

ResultHeader.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	children: _react2["default"].PropTypes.array
};

exports["default"] = ResultHeader;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],37:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var ResultList = (function (_React$Component) {
	_inherits(ResultList, _React$Component);

	function ResultList() {
		_classCallCheck(this, ResultList);

		_get(Object.getPrototypeOf(ResultList.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ResultList, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2["default"].createElement(
				"ul",
				{ className: (0, _classnames2["default"])({ "list-group": bootstrapCss }) },
				this.props.children
			);
		}
	}]);

	return ResultList;
})(_react2["default"].Component);

ResultList.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	children: _react2["default"].PropTypes.array
};

exports["default"] = ResultList;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],38:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var Pagination = (function (_React$Component) {
	_inherits(Pagination, _React$Component);

	function Pagination() {
		_classCallCheck(this, Pagination);

		_get(Object.getPrototypeOf(Pagination.prototype), "constructor", this).apply(this, arguments);
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
			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])({ "active": page === currentPage }), key: key },
				_react2["default"].createElement(
					"a",
					{ onClick: this.onPageChange.bind(this, page) },
					page + 1
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _this = this;

			var _props = this.props;
			var bootstrapCss = _props.bootstrapCss;
			var query = _props.query;
			var results = _props.results;
			var start = query.start;
			var rows = query.rows;
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

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])({ "panel-body": bootstrapCss, "text-center": bootstrapCss }) },
				_react2["default"].createElement(
					"ul",
					{ className: (0, _classnames2["default"])("pagination", { "pagination-sm": bootstrapCss }) },
					_react2["default"].createElement(
						"li",
						{ className: (0, _classnames2["default"])({ "disabled": currentPage === 0 }), key: "start" },
						_react2["default"].createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, 0) },
							"<<"
						)
					),
					_react2["default"].createElement(
						"li",
						{ className: (0, _classnames2["default"])({ "disabled": currentPage - 1 < 0 }), key: "prev" },
						_react2["default"].createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, currentPage - 1) },
							"<"
						)
					),
					pages.map(function (page, idx) {
						return _this.renderPage(page, currentPage, idx);
					}),
					_react2["default"].createElement(
						"li",
						{ className: (0, _classnames2["default"])({ "disabled": currentPage + 1 >= pageAmt }), key: "next" },
						_react2["default"].createElement(
							"a",
							{ onClick: this.onPageChange.bind(this, currentPage + 1, pageAmt) },
							">"
						)
					),
					_react2["default"].createElement(
						"li",
						{ className: (0, _classnames2["default"])({ "disabled": currentPage >= pageAmt }), key: "end" },
						_react2["default"].createElement(
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
})(_react2["default"].Component);

Pagination.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	onChange: _react2["default"].PropTypes.func,
	query: _react2["default"].PropTypes.object,
	results: _react2["default"].PropTypes.object
};

exports["default"] = Pagination;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],39:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var Pending = (function (_React$Component) {
	_inherits(Pending, _React$Component);

	function Pending() {
		_classCallCheck(this, Pending);

		_get(Object.getPrototypeOf(Pending.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(Pending, [{
		key: "render",
		value: function render() {
			return _react2["default"].createElement(
				"span",
				null,
				"Waiting for results"
			);
		}
	}]);

	return Pending;
})(_react2["default"].Component);

Pending.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool
};

exports["default"] = Pending;
module.exports = exports["default"];

},{"react":"react"}],40:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var Result = (function (_React$Component) {
	_inherits(Result, _React$Component);

	function Result() {
		_classCallCheck(this, Result);

		_get(Object.getPrototypeOf(Result.prototype), "constructor", this).apply(this, arguments);
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
			var _this = this;

			var _props = this.props;
			var bootstrapCss = _props.bootstrapCss;
			var doc = _props.doc;
			var fields = _props.fields;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }), onClick: function () {
						return _this.props.onSelect(doc);
					} },
				_react2["default"].createElement(
					"ul",
					null,
					fields.filter(function (field) {
						return field.field !== "*";
					}).map(function (field, i) {
						return _react2["default"].createElement(
							"li",
							{ key: i },
							_react2["default"].createElement(
								"label",
								null,
								field.label || field.field
							),
							_this.renderValue(field.field, doc)
						);
					})
				)
			);
		}
	}]);

	return Result;
})(_react2["default"].Component);

Result.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	doc: _react2["default"].PropTypes.object,
	fields: _react2["default"].PropTypes.array,
	onSelect: _react2["default"].PropTypes.func.isRequired
};

exports["default"] = Result;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],41:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var SearchFieldContainer = (function (_React$Component) {
	_inherits(SearchFieldContainer, _React$Component);

	function SearchFieldContainer() {
		_classCallCheck(this, SearchFieldContainer);

		_get(Object.getPrototypeOf(SearchFieldContainer.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(SearchFieldContainer, [{
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])({ "col-md-3": bootstrapCss }) },
				_react2["default"].createElement(
					"div",
					{ className: (0, _classnames2["default"])({ "panel": bootstrapCss, "panel-default": bootstrapCss }) },
					_react2["default"].createElement(
						"header",
						{ className: (0, _classnames2["default"])({ "panel-heading": bootstrapCss }) },
						_react2["default"].createElement(
							"label",
							null,
							"Search"
						)
					),
					_react2["default"].createElement(
						"ul",
						{ className: (0, _classnames2["default"])("solr-search-fields", { "list-group": bootstrapCss }) },
						this.props.children
					)
				)
			);
		}
	}]);

	return SearchFieldContainer;
})(_react2["default"].Component);

SearchFieldContainer.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	children: _react2["default"].PropTypes.array
};

exports["default"] = SearchFieldContainer;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],42:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _componentPack = _dereq_("./component-pack");

var _componentPack2 = _interopRequireDefault(_componentPack);

var SolrFacetedSearch = (function (_React$Component) {
	_inherits(SolrFacetedSearch, _React$Component);

	function SolrFacetedSearch() {
		_classCallCheck(this, SolrFacetedSearch);

		_get(Object.getPrototypeOf(SolrFacetedSearch.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(SolrFacetedSearch, [{
		key: "render",
		value: function render() {
			var _this = this;

			var _props = this.props;
			var customComponents = _props.customComponents;
			var bootstrapCss = _props.bootstrapCss;
			var query = _props.query;
			var results = _props.results;
			var _props2 = this.props;
			var onSearchFieldChange = _props2.onSearchFieldChange;
			var onSortFieldChange = _props2.onSortFieldChange;
			var onPageChange = _props2.onPageChange;
			var searchFields = query.searchFields;
			var sortFields = query.sortFields;

			var SearchFieldContainerComponent = customComponents.searchFields.container;
			var ResultContainerComponent = customComponents.results.container;

			var ResultComponent = customComponents.results.result;
			var ResultCount = customComponents.results.resultCount;
			var ResultHeaderComponent = customComponents.results.header;
			var ResultListComponent = customComponents.results.list;
			var ResultPendingComponent = customComponents.results.pending;
			var PaginateComponent = customComponents.results.paginate;

			var SortComponent = customComponents.sortFields.menu;
			var resultPending = results.pending ? _react2["default"].createElement(ResultPendingComponent, { bootstrapCss: bootstrapCss }) : null;

			var pagination = query.pageStrategy === "paginate" ? _react2["default"].createElement(PaginateComponent, _extends({}, this.props, { bootstrapCss: bootstrapCss, onChange: onPageChange })) : null;

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])("solr-faceted-search", { "container": bootstrapCss, "col-md-12": bootstrapCss }) },
				_react2["default"].createElement(
					SearchFieldContainerComponent,
					{ bootstrapCss: bootstrapCss },
					searchFields.map(function (searchField, i) {
						var type = searchField.type;
						var field = searchField.field;

						var SearchComponent = customComponents.searchFields[type];
						var facets = type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;
						return _react2["default"].createElement(SearchComponent, _extends({
							key: i }, _this.props, searchField, {
							bootstrapCss: bootstrapCss,
							facets: facets,
							onChange: onSearchFieldChange }));
					})
				),
				_react2["default"].createElement(
					ResultContainerComponent,
					{ bootstrapCss: bootstrapCss },
					_react2["default"].createElement(
						ResultHeaderComponent,
						{ bootstrapCss: bootstrapCss },
						_react2["default"].createElement(ResultCount, { bootstrapCss: bootstrapCss, numFound: results.numFound }),
						resultPending,
						_react2["default"].createElement(SortComponent, { bootstrapCss: bootstrapCss, onChange: onSortFieldChange, sortFields: sortFields })
					),
					pagination,
					_react2["default"].createElement(
						ResultListComponent,
						{ bootstrapCss: bootstrapCss },
						results.docs.map(function (doc, i) {
							return _react2["default"].createElement(ResultComponent, { bootstrapCss: bootstrapCss,
								doc: doc,
								fields: searchFields,
								key: i,
								onSelect: _this.props.onSelectDoc });
						})
					),
					pagination
				)
			);
		}
	}]);

	return SolrFacetedSearch;
})(_react2["default"].Component);

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	customComponents: _componentPack2["default"],
	pageStrategy: "paginate",
	rows: 20,
	searchFields: [{ type: "text", field: "*" }],
	sortFields: []
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	customComponents: _react2["default"].PropTypes.object,
	onPageChange: _react2["default"].PropTypes.func,
	onSearchFieldChange: _react2["default"].PropTypes.func.isRequired,
	onSelectDoc: _react2["default"].PropTypes.func.isRequired,
	onSortFieldChange: _react2["default"].PropTypes.func.isRequired,
	query: _react2["default"].PropTypes.object,
	results: _react2["default"].PropTypes.object
};

exports["default"] = SolrFacetedSearch;
module.exports = exports["default"];

},{"./component-pack":28,"classnames":2,"react":"react"}],43:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = _dereq_("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var SortMenu = (function (_React$Component) {
	_inherits(SortMenu, _React$Component);

	function SortMenu(props) {
		_classCallCheck(this, SortMenu);

		_get(Object.getPrototypeOf(SortMenu.prototype), "constructor", this).call(this, props);

		this.state = {
			isOpen: false
		};
		this.documentClickListener = this.handleDocumentClick.bind(this);
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

			if (isOpen && !_reactDom2["default"].findDOMNode(this).contains(ev.target)) {
				this.setState({
					isOpen: false
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this = this;

			var _props = this.props;
			var bootstrapCss = _props.bootstrapCss;
			var sortFields = _props.sortFields;

			if (sortFields.length === 0) {
				return null;
			}

			var value = sortFields.find(function (sf) {
				return sf.value;
			});

			return _react2["default"].createElement(
				"span",
				{ className: (0, _classnames2["default"])({ "pull-right": bootstrapCss }) },
				_react2["default"].createElement(
					"span",
					{ className: (0, _classnames2["default"])({ "dropdown": bootstrapCss, "open": this.state.isOpen }) },
					_react2["default"].createElement(
						"button",
						{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "dropdown-toggle": bootstrapCss }),
							onClick: this.toggleSelect.bind(this) },
						value ? value.label : "- select sort -",
						" ",
						_react2["default"].createElement("span", { className: "caret" })
					),
					_react2["default"].createElement(
						"ul",
						{ className: "dropdown-menu" },
						sortFields.map(function (sortField, i) {
							return _react2["default"].createElement(
								"li",
								{ key: i },
								_react2["default"].createElement(
									"a",
									{ onClick: function () {
											_this.onSelect(sortField.field);_this.toggleSelect();
										} },
									sortField.label
								)
							);
						}),
						value ? _react2["default"].createElement(
							"li",
							null,
							_react2["default"].createElement(
								"a",
								{ onClick: function () {
										_this.props.onChange(value.field, null);_this.toggleSelect();
									} },
								"- clear -"
							)
						) : null
					)
				),
				value ? _react2["default"].createElement(
					"span",
					{ className: (0, _classnames2["default"])({ "btn-group": bootstrapCss }) },
					_react2["default"].createElement(
						"button",
						{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: value.value === "asc" }),
							onClick: function () {
								return _this.props.onChange(value.field, "asc");
							} },
						"asc"
					),
					_react2["default"].createElement(
						"button",
						{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: value.value === "desc" }),
							onClick: function () {
								return _this.props.onChange(value.field, "desc");
							} },
						"desc"
					)
				) : null
			);
		}
	}]);

	return SortMenu;
})(_react2["default"].Component);

SortMenu.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	onChange: _react2["default"].PropTypes.func,
	sortFields: _react2["default"].PropTypes.array
};

exports["default"] = SortMenu;
module.exports = exports["default"];

},{"classnames":2,"react":"react","react-dom":"react-dom"}],44:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var TextSearch = (function (_React$Component) {
	_inherits(TextSearch, _React$Component);

	function TextSearch(props) {
		_classCallCheck(this, TextSearch);

		_get(Object.getPrototypeOf(TextSearch.prototype), "constructor", this).call(this, props);

		this.state = {
			value: ""
		};
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
		key: "render",
		value: function render() {
			var _props = this.props;
			var label = _props.label;
			var bootstrapCss = _props.bootstrapCss;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }) },
				_react2["default"].createElement(
					"header",
					null,
					_react2["default"].createElement(
						"h3",
						null,
						label
					)
				),
				_react2["default"].createElement("input", {
					onChange: this.handleInputChange.bind(this),
					onKeyDown: this.handleInputKeyDown.bind(this),
					value: this.state.value || "" }),
				_react2["default"].createElement(
					"button",
					{ onClick: this.handleSubmit.bind(this) },
					"Search"
				)
			);
		}
	}]);

	return TextSearch;
})(_react2["default"].Component);

TextSearch.defaultProps = {
	field: null
};

TextSearch.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func
};

exports["default"] = TextSearch;
module.exports = exports["default"];

},{"classnames":2,"react":"react"}],45:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _componentsSolrFacetedSearch = _dereq_("./components/solr-faceted-search");

var _componentsSolrFacetedSearch2 = _interopRequireDefault(_componentsSolrFacetedSearch);

var _componentsComponentPack = _dereq_("./components/component-pack");

var _componentsComponentPack2 = _interopRequireDefault(_componentsComponentPack);

var _reducersStore = _dereq_("./reducers/store");

var _reducersStore2 = _interopRequireDefault(_reducersStore);

var _actions = _dereq_("./actions");

var _actions2 = _interopRequireDefault(_actions);

exports["default"] = _componentsSolrFacetedSearch2["default"];
exports.SolrFacetedSearch = _componentsSolrFacetedSearch2["default"];
exports.defaultComponentPack = _componentsComponentPack2["default"];
exports.solrStore = _reducersStore2["default"];
exports.solrActions = _actions2["default"];

},{"./actions":25,"./components/component-pack":28,"./components/solr-faceted-search":42,"./reducers/store":49}],46:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _query = _dereq_("./query");

var _query2 = _interopRequireDefault(_query);

var _results = _dereq_("./results");

var _results2 = _interopRequireDefault(_results);

exports["default"] = {
	query: _query2["default"],
	results: _results2["default"]
};
module.exports = exports["default"];

},{"./query":47,"./results":48}],47:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var initialState = {
	searchFields: [],
	sortFields: [],
	rows: 0,
	url: null,
	pageStrategy: null,
	start: null
};

var setQueryFields = function setQueryFields(state, action) {
	return _extends({}, state, {
		searchFields: action.searchFields,
		sortFields: action.sortFields,
		url: action.url,
		rows: action.rows,
		pageStrategy: action.pageStrategy,
		start: action.start
	});
};

exports["default"] = function (state, action) {
	if (state === undefined) state = initialState;

	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return setQueryFields(state, action);
		case "SET_SEARCH_FIELDS":
			return _extends({}, state, { searchFields: action.newFields, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_SORT_FIELDS":
			return _extends({}, state, { sortFields: action.newSortFields, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_START":
			return _extends({}, state, { start: action.newStart });
	}

	return state;
};

module.exports = exports["default"];

},{}],48:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var initialState = {
	facets: {},
	docs: [],
	numFound: 0,
	pending: false
};

exports["default"] = function (state, action) {
	if (state === undefined) state = initialState;

	switch (action.type) {
		case "SET_RESULTS":
			return _extends({}, state, {
				docs: action.data.response.docs,
				numFound: action.data.response.numFound,
				facets: action.data.facet_counts.facet_fields,
				pending: false
			});
		case "SET_RESULTS_PENDING":
			return _extends({}, state, { pending: true
			});
	}

	return state;
};

module.exports = exports["default"];

},{}],49:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _redux = _dereq_("redux");

var _reduxThunk = _dereq_("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _index = _dereq_("./index");

var _index2 = _interopRequireDefault(_index);

var logger = function logger() {
	return function (next) {
		return function (action) {
			if (action.hasOwnProperty("type")) {
				console.log("[REDUX]", action.type, action);
			}
			return next(action);
		};
	};
};

var data = (0, _redux.combineReducers)(_index2["default"]);

var store = (0, _redux.createStore)(data, (0, _redux.applyMiddleware)(logger, _reduxThunk2["default"]));

exports["default"] = store;
module.exports = exports["default"];

},{"./index":46,"redux":18,"redux-thunk":12}]},{},[45])(45)
});