(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SolrFacetedSearch = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{"is-function":4}],3:[function(_dereq_,module,exports){
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
},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
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
},{"for-each":2,"trim":7}],7:[function(_dereq_,module,exports){

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

},{}],8:[function(_dereq_,module,exports){
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

},{"global/window":3,"is-function":4,"once":5,"parse-headers":6,"xtend":9}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _xhr = _dereq_("xhr");

var _xhr2 = _interopRequireDefault(_xhr);

var _solrQuery = _dereq_("./solr-query");

var _solrQuery2 = _interopRequireDefault(_solrQuery);

var MAX_INT = 2147483647;

var server = {};

server.performXhr = function (options, accept) {
	var reject = arguments.length <= 2 || arguments[2] === undefined ? function () {
		console.warn("Undefined reject callback! ");(console.trace || function () {})();
	} : arguments[2];

	(0, _xhr2["default"])(options, accept, reject);
};

server.submitQuery = function (query, callback) {
	callback({ type: "SET_RESULTS_PENDING" });

	server.performXhr({
		url: query.url,
		data: (0, _solrQuery2["default"])(query),
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
		data: (0, _solrQuery2["default"])(_extends({}, query, { rows: MAX_INT }), {
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

exports["default"] = server;
module.exports = exports["default"];

},{"./solr-query":12,"xhr":8}],11:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _reducersQuery = _dereq_("../reducers/query");

var _reducersQuery2 = _interopRequireDefault(_reducersQuery);

var _reducersResults = _dereq_("../reducers/results");

var _reducersResults2 = _interopRequireDefault(_reducersResults);

var _server = _dereq_("./server");

var SolrClient = (function () {
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

			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));

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
			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
		}
	}, {
		key: "sendQuery",
		value: function sendQuery() {
			var _this = this;

			var query = arguments.length <= 0 || arguments[0] === undefined ? this.state.query : arguments[0];

			delete query.cursorMark;
			this.state.query = query;
			(0, _server.submitQuery)(query, function (action) {
				_this.state.results = (0, _reducersResults2["default"])(_this.state.results, action);
				_this.state.query = (0, _reducersQuery2["default"])(_this.state.query, action);
				_this.onChange(_this.state, _this.getHandlers());
			});
		}
	}, {
		key: "sendNextCursorQuery",
		value: function sendNextCursorQuery() {
			var _this2 = this;

			(0, _server.submitQuery)(this.state.query, function (action) {
				_this2.state.results = (0, _reducersResults2["default"])(_this2.state.results, _extends({}, action, {
					type: action.type === "SET_RESULTS" ? "SET_NEXT_RESULTS" : action.type
				}));
				_this2.state.query = (0, _reducersQuery2["default"])(_this2.state.query, action);
				_this2.onChange(_this2.state, _this2.getHandlers());
			});
		}
	}, {
		key: "fetchCsv",
		value: function fetchCsv() {
			(0, _server.fetchCsv)(this.state.query, function (data) {
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

			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
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

			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
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

			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
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
			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
		}
	}, {
		key: "setFilters",
		value: function setFilters(filters) {
			var payload = { type: "SET_FILTERS", newFilters: filters };
			this.sendQuery((0, _reducersQuery2["default"])(this.state.query, payload));
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
			this.state.query = (0, _reducersQuery2["default"])(this.state.query, payload);
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
				onCsvExport: this.fetchCsv.bind(this)
			};
		}
	}]);

	return SolrClient;
})();

exports.SolrClient = SolrClient;

},{"../reducers/query":35,"../reducers/results":36,"./server":10}],12:[function(_dereq_,module,exports){
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
	} else if (field.type.indexOf("range") > -1) {
		return rangeFacetToQueryFilter(field);
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
	}).join("&");
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
	var format = arguments.length <= 1 || arguments[1] === undefined ? { wt: "json" } : arguments[1];
	var searchFields = query.searchFields;
	var sortFields = query.sortFields;
	var rows = query.rows;
	var start = query.start;
	var facetLimit = query.facetLimit;
	var facetSort = query.facetSort;
	var pageStrategy = query.pageStrategy;
	var cursorMark = query.cursorMark;
	var idField = query.idField;

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

	return "q=*:*&" + (queryParams.length > 0 ? queryParams : "") + ("" + (sortParam.length > 0 ? "&sort=" + sortParam : "")) + ("" + (facetFieldParam.length > 0 ? "&" + facetFieldParam : "")) + ("" + (facetSortParams.length > 0 ? "&" + facetSortParams : "")) + ("&rows=" + rows) + ("&" + facetLimitParam) + ("&" + facetSortParam) + ("&" + cursorMarkParam) + (start === null ? "" : "&start=" + start) + "&facet=on" + ("&" + buildFormat(format));
};

exports["default"] = solrQuery;
exports.rangeFacetToQueryFilter = rangeFacetToQueryFilter;
exports.listFacetFieldToQueryFilter = listFacetFieldToQueryFilter;
exports.textFieldToQueryFilter = textFieldToQueryFilter;
exports.fieldToQueryFilter = fieldToQueryFilter;
exports.buildQuery = buildQuery;
exports.facetFields = facetFields;
exports.facetSorts = facetSorts;
exports.buildSort = buildSort;
exports.solrQuery = solrQuery;

},{}],13:[function(_dereq_,module,exports){
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

var _resultsPreloadIndicator = _dereq_("./results/preload-indicator");

var _resultsPreloadIndicator2 = _interopRequireDefault(_resultsPreloadIndicator);

var _resultsCsvExport = _dereq_("./results/csv-export");

var _resultsCsvExport2 = _interopRequireDefault(_resultsCsvExport);

var _searchFieldContainer = _dereq_("./search-field-container");

var _searchFieldContainer2 = _interopRequireDefault(_searchFieldContainer);

var _rangeFacet = _dereq_("./range-facet");

var _rangeFacet2 = _interopRequireDefault(_rangeFacet);

var _resultsCountLabel = _dereq_("./results/count-label");

var _resultsCountLabel2 = _interopRequireDefault(_resultsCountLabel);

var _sortMenu = _dereq_("./sort-menu");

var _sortMenu2 = _interopRequireDefault(_sortMenu);

var _currentQuery = _dereq_("./current-query");

var _currentQuery2 = _interopRequireDefault(_currentQuery);

exports["default"] = {
	searchFields: {
		text: _textSearch2["default"],
		"list-facet": _listFacet2["default"],
		"range-facet": _rangeFacet2["default"],
		container: _searchFieldContainer2["default"],
		currentQuery: _currentQuery2["default"]
	},
	results: {
		result: _resultsResult2["default"],
		resultCount: _resultsCountLabel2["default"],
		header: _resultsHeader2["default"],
		list: _resultsList2["default"],
		container: _resultsContainer2["default"],
		pending: _resultsPending2["default"],
		preloadIndicator: _resultsPreloadIndicator2["default"],
		csvExport: _resultsCsvExport2["default"],
		paginate: _resultsPagination2["default"]
	},
	sortFields: {
		menu: _sortMenu2["default"]
	}
};
module.exports = exports["default"];

},{"./current-query":14,"./list-facet":18,"./range-facet":19,"./results/container":21,"./results/count-label":22,"./results/csv-export":23,"./results/header":24,"./results/list":25,"./results/pagination":26,"./results/pending":27,"./results/preload-indicator":28,"./results/result":29,"./search-field-container":30,"./sort-menu":32,"./text-search":33}],14:[function(_dereq_,module,exports){
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

var CurrentQuery = (function (_React$Component) {
	_inherits(CurrentQuery, _React$Component);

	function CurrentQuery() {
		_classCallCheck(this, CurrentQuery);

		_get(Object.getPrototypeOf(CurrentQuery.prototype), "constructor", this).apply(this, arguments);
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
			var _this = this;

			var bootstrapCss = this.props.bootstrapCss;

			switch (searchField.type) {
				case "list-facet":
					return searchField.value.map(function (val, i) {
						return _react2["default"].createElement(
							"span",
							{ className: (0, _classnames2["default"])({ "label": bootstrapCss, "label-default": bootstrapCss }), key: i,
								onClick: function () {
									return _this.removeListFacetValue(searchField.field, searchField.value, val);
								} },
							val,
							_react2["default"].createElement(
								"a",
								null,
								bootstrapCss ? _react2["default"].createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
							)
						);
					});

				case "range-facet":
					return _react2["default"].createElement(
						"span",
						{ className: (0, _classnames2["default"])({ "label": bootstrapCss, "label-default": bootstrapCss }),
							onClick: function () {
								return _this.removeRangeFacetValue(searchField.field);
							} },
						searchField.value[0],
						" - ",
						searchField.value[1],
						_react2["default"].createElement(
							"a",
							null,
							bootstrapCss ? _react2["default"].createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
						)
					);

				case "text":
					return _react2["default"].createElement(
						"span",
						{ className: (0, _classnames2["default"])({ "label": bootstrapCss, "label-default": bootstrapCss }),
							onClick: function () {
								return _this.removeTextValue(searchField.field);
							} },
						searchField.value,
						_react2["default"].createElement(
							"a",
							null,
							bootstrapCss ? _react2["default"].createElement("span", { className: "glyphicon glyphicon-remove-sign" }) : "❌"
						)
					);
			}
			return null;
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var _props = this.props;
			var bootstrapCss = _props.bootstrapCss;
			var query = _props.query;

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

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])("current-query", { "panel-body": bootstrapCss }) },
				_react2["default"].createElement(
					"div",
					{ className: (0, _classnames2["default"])({ "row": bootstrapCss }) },
					_react2["default"].createElement(
						"ul",
						{ className: (0, _classnames2["default"])({ "col-md-6": bootstrapCss }) },
						evens.map(function (searchField, i) {
							return _react2["default"].createElement(
								"li",
								{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }), key: i },
								_react2["default"].createElement(
									"label",
									null,
									searchField.label
								),
								_this2.renderFieldValues(searchField)
							);
						})
					),
					_react2["default"].createElement(
						"ul",
						{ className: (0, _classnames2["default"])({ "col-md-6": bootstrapCss }) },
						odds.map(function (searchField, i) {
							return _react2["default"].createElement(
								"li",
								{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }), key: i },
								_react2["default"].createElement(
									"label",
									null,
									searchField.label
								),
								_this2.renderFieldValues(searchField)
							);
						})
					)
				)
			);
		}
	}]);

	return CurrentQuery;
})(_react2["default"].Component);

CurrentQuery.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	onChange: _react2["default"].PropTypes.func,
	query: _react2["default"].PropTypes.object
};

exports["default"] = CurrentQuery;
module.exports = exports["default"];

},{"classnames":1,"react":"react"}],15:[function(_dereq_,module,exports){
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

},{"react":"react"}],16:[function(_dereq_,module,exports){
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

var Search = (function (_React$Component) {
	_inherits(Search, _React$Component);

	function Search() {
		_classCallCheck(this, Search);

		_get(Object.getPrototypeOf(Search.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(Search, [{
		key: "render",
		value: function render() {
			return _react2["default"].createElement(
				"svg",
				{ className: "search-icon", viewBox: "0 0 250.313 250.313", width: "10" },
				_react2["default"].createElement("path", { d: "M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" })
			);
		}
	}]);

	return Search;
})(_react2["default"].Component);

exports["default"] = Search;
module.exports = exports["default"];

},{"react":"react"}],17:[function(_dereq_,module,exports){
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

},{"react":"react"}],18:[function(_dereq_,module,exports){
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

	function ListFacet(props) {
		_classCallCheck(this, ListFacet);

		_get(Object.getPrototypeOf(ListFacet.prototype), "constructor", this).call(this, props);

		this.state = {
			filter: "",
			truncateFacetListsAt: props.truncateFacetListsAt
		};
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
			var _this = this;

			var _props = this.props;
			var query = _props.query;
			var label = _props.label;
			var facets = _props.facets;
			var field = _props.field;
			var value = _props.value;
			var bootstrapCss = _props.bootstrapCss;
			var facetSort = _props.facetSort;
			var collapse = _props.collapse;
			var truncateFacetListsAt = this.state.truncateFacetListsAt;

			var facetCounts = facets.filter(function (facet, i) {
				return i % 2 === 1;
			});
			var facetValues = facets.filter(function (facet, i) {
				return i % 2 === 0;
			});

			var facetSortValue = facetSort ? facetSort : query.facetSort ? query.facetSort : query.facetLimit && query.facetLimit > -1 ? "count" : "index";

			var expanded = !(collapse || false);

			var showMoreLink = truncateFacetListsAt > -1 && truncateFacetListsAt < facetValues.length ? _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }), onClick: function () {
						return _this.setState({ truncateFacetListsAt: -1 });
					} },
				"Show all (",
				facetValues.length,
				")"
			) : null;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])("list-facet", { "list-group-item": bootstrapCss }), id: "solr-list-facet-" + field },
				_react2["default"].createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2["default"].createElement(
						"h5",
						null,
						bootstrapCss ? _react2["default"].createElement(
							"span",
							null,
							_react2["default"].createElement("span", { className: (0, _classnames2["default"])("glyphicon", {
									"glyphicon-collapse-down": expanded,
									"glyphicon-collapse-up": !expanded
								}) }),
							" "
						) : null,
						label
					)
				),
				expanded ? _react2["default"].createElement(
					"div",
					null,
					_react2["default"].createElement(
						"ul",
						{ className: (0, _classnames2["default"])({ "list-group": bootstrapCss }) },
						facetValues.filter(function (facetValue, i) {
							return truncateFacetListsAt < 0 || i < truncateFacetListsAt;
						}).map(function (facetValue, i) {
							return _this.state.filter.length === 0 || facetValue.toLowerCase().indexOf(_this.state.filter.toLowerCase()) > -1 ? _react2["default"].createElement(
								"li",
								{ className: (0, _classnames2["default"])("facet-item-type-" + field, { "list-group-item": bootstrapCss }), key: facetValue + "_" + facetCounts[i], onClick: function () {
										return _this.handleClick(facetValue);
									} },
								value.indexOf(facetValue) > -1 ? _react2["default"].createElement(_iconsChecked2["default"], null) : _react2["default"].createElement(_iconsUnchecked2["default"], null),
								" ",
								facetValue,
								_react2["default"].createElement(
									"span",
									{ className: "facet-item-amount" },
									facetCounts[i]
								)
							) : null;
						}),
						showMoreLink
					),
					facetValues.length > 4 ? _react2["default"].createElement(
						"div",
						null,
						_react2["default"].createElement("input", { onChange: function (ev) {
								return _this.setState({ filter: ev.target.value });
							}, placeholder: "Filter... ", type: "text", value: this.state.filter }),
						" ",
						_react2["default"].createElement(
							"span",
							{ className: (0, _classnames2["default"])({ "btn-group": bootstrapCss }) },
							_react2["default"].createElement(
								"button",
								{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "index" }),
									onClick: function () {
										return _this.props.onFacetSortChange(field, "index");
									} },
								"a-z"
							),
							_react2["default"].createElement(
								"button",
								{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "count" }),
									onClick: function () {
										return _this.props.onFacetSortChange(field, "count");
									} },
								"0-9"
							)
						),
						_react2["default"].createElement(
							"span",
							{ className: (0, _classnames2["default"])({ "btn-group": bootstrapCss, "pull-right": bootstrapCss }) },
							_react2["default"].createElement(
								"button",
								{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss }),
									onClick: function () {
										return _this.props.onChange(field, []);
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
})(_react2["default"].Component);

ListFacet.defaultProps = {
	value: []
};

ListFacet.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	children: _react2["default"].PropTypes.array,
	collapse: _react2["default"].PropTypes.bool,
	facetSort: _react2["default"].PropTypes.string,
	facets: _react2["default"].PropTypes.array.isRequired,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func,
	onFacetSortChange: _react2["default"].PropTypes.func,
	onSetCollapse: _react2["default"].PropTypes.func,
	query: _react2["default"].PropTypes.object,
	truncateFacetListsAt: _react2["default"].PropTypes.number,
	value: _react2["default"].PropTypes.array
};

exports["default"] = ListFacet;
module.exports = exports["default"];

},{"../icons/checked":15,"../icons/unchecked":17,"classnames":1,"react":"react"}],19:[function(_dereq_,module,exports){
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
			var _this = this;

			var _props = this.props;
			var label = _props.label;
			var field = _props.field;
			var bootstrapCss = _props.bootstrapCss;
			var collapse = _props.collapse;
			var value = this.state.value;

			var range = this.facetsToRange();

			var filterRange = value.length > 0 ? value : range;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])("range-facet", { "list-group-item": bootstrapCss }), id: "solr-range-facet-" + field },
				_react2["default"].createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2["default"].createElement(
						"button",
						{ style: { display: this.state.expanded ? "block" : "none" },
							className: (0, _classnames2["default"])("clear-button", {
								"btn": bootstrapCss,
								"btn-default": bootstrapCss,
								"btn-xs": bootstrapCss,
								"pull-right": bootstrapCss }),
							onClick: function () {
								return _this.props.onChange(field, []);
							} },
						"clear"
					),
					_react2["default"].createElement(
						"h5",
						null,
						bootstrapCss ? _react2["default"].createElement(
							"span",
							null,
							_react2["default"].createElement("span", { className: (0, _classnames2["default"])("glyphicon", {
									"glyphicon-collapse-down": !collapse,
									"glyphicon-collapse-up": collapse
								}) }),
							" "
						) : null,
						label
					)
				),
				_react2["default"].createElement(
					"div",
					{ style: { display: collapse ? "none" : "block" } },
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
	collapse: _react2["default"].PropTypes.bool,
	facets: _react2["default"].PropTypes.array.isRequired,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func,
	onSetCollapse: _react2["default"].PropTypes.func,
	value: _react2["default"].PropTypes.array
};

exports["default"] = RangeFacet;
module.exports = exports["default"];

},{"./range-slider":20,"classnames":1,"react":"react"}],20:[function(_dereq_,module,exports){
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
				{ className: "facet-range-slider", viewBox: "0 0 400 26" },
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

},{"react":"react","react-dom":"react-dom"}],21:[function(_dereq_,module,exports){
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

},{"classnames":1,"react":"react"}],22:[function(_dereq_,module,exports){
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

			var resultLabel = numFound > 1 ? resultCountLabels.pl : numFound === 1 ? resultCountLabels.sg : resultCountLabels.none;

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

},{"react":"react"}],23:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = _dereq_("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = _dereq_("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

exports["default"] = function (props) {
	var bootstrapCss = props.bootstrapCss;
	var onClick = props.onClick;

	return _react2["default"].createElement(
		"button",
		{ onClick: onClick, className: (0, _classnames2["default"])({ btn: bootstrapCss, "btn-default": bootstrapCss, "pull-right": bootstrapCss, "btn-xs": bootstrapCss }) },
		"Export excel"
	);
};

module.exports = exports["default"];

},{"classnames":1,"react":"react"}],24:[function(_dereq_,module,exports){
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

},{"classnames":1,"react":"react"}],25:[function(_dereq_,module,exports){
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

},{"classnames":1,"react":"react"}],26:[function(_dereq_,module,exports){
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
						{ className: (0, _classnames2["default"])({ "disabled": currentPage === pageAmt - 1 }), key: "end" },
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

},{"classnames":1,"react":"react"}],27:[function(_dereq_,module,exports){
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

},{"react":"react"}],28:[function(_dereq_,module,exports){
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

var PreloadIndicator = (function (_React$Component) {
	_inherits(PreloadIndicator, _React$Component);

	function PreloadIndicator(props) {
		_classCallCheck(this, PreloadIndicator);

		_get(Object.getPrototypeOf(PreloadIndicator.prototype), "constructor", this).call(this, props);

		this.scrollListener = this.onWindowScroll.bind(this);
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

			var domNode = _reactDom2["default"].findDOMNode(this);
			if (!domNode) {
				return;
			}

			var _domNode$getBoundingClientRect = domNode.getBoundingClientRect();

			var top = _domNode$getBoundingClientRect.top;

			if (top < window.innerHeight) {
				this.props.onNextCursorQuery();
			}
		}
	}, {
		key: "render",
		value: function render() {
			var bootstrapCss = this.props.bootstrapCss;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])("fetch-by-cursor", { "list-group-item": bootstrapCss }) },
				"Loading more..."
			);
		}
	}]);

	return PreloadIndicator;
})(_react2["default"].Component);

PreloadIndicator.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	onNextCursorQuery: _react2["default"].PropTypes.func,
	query: _react2["default"].PropTypes.object,
	results: _react2["default"].PropTypes.object
};

exports["default"] = PreloadIndicator;
module.exports = exports["default"];

},{"classnames":1,"react":"react","react-dom":"react-dom"}],29:[function(_dereq_,module,exports){
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

},{"classnames":1,"react":"react"}],30:[function(_dereq_,module,exports){
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
			var _props = this.props;
			var bootstrapCss = _props.bootstrapCss;
			var onNewSearch = _props.onNewSearch;

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
							"button",
							{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss }),
								onClick: onNewSearch },
							"New search"
						),
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
	children: _react2["default"].PropTypes.array,
	onNewSearch: _react2["default"].PropTypes.func
};

exports["default"] = SearchFieldContainer;
module.exports = exports["default"];

},{"classnames":1,"react":"react"}],31:[function(_dereq_,module,exports){
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
			var truncateFacetListsAt = _props.truncateFacetListsAt;
			var _props2 = this.props;
			var onSearchFieldChange = _props2.onSearchFieldChange;
			var onSortFieldChange = _props2.onSortFieldChange;
			var onPageChange = _props2.onPageChange;
			var onCsvExport = _props2.onCsvExport;
			var searchFields = query.searchFields;
			var sortFields = query.sortFields;
			var start = query.start;
			var rows = query.rows;

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
			var resultPending = results.pending ? _react2["default"].createElement(ResultPendingComponent, { bootstrapCss: bootstrapCss }) : null;

			var pagination = query.pageStrategy === "paginate" ? _react2["default"].createElement(PaginateComponent, _extends({}, this.props, { bootstrapCss: bootstrapCss, onChange: onPageChange })) : null;

			var preloadListItem = query.pageStrategy === "cursor" && results.docs.length < results.numFound ? _react2["default"].createElement(PreloadComponent, this.props) : null;

			return _react2["default"].createElement(
				"div",
				{ className: (0, _classnames2["default"])("solr-faceted-search", { "container": bootstrapCss, "col-md-12": bootstrapCss }) },
				_react2["default"].createElement(
					SearchFieldContainerComponent,
					{ bootstrapCss: bootstrapCss, onNewSearch: this.props.onNewSearch },
					searchFields.map(function (searchField, i) {
						var type = searchField.type;
						var field = searchField.field;

						var SearchComponent = customComponents.searchFields[type];
						var facets = type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;
						return _react2["default"].createElement(SearchComponent, _extends({
							key: i }, _this.props, searchField, {
							bootstrapCss: bootstrapCss,
							facets: facets,
							truncateFacetListsAt: truncateFacetListsAt,
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
						_react2["default"].createElement(SortComponent, { bootstrapCss: bootstrapCss, onChange: onSortFieldChange, sortFields: sortFields }),
						this.props.showCsvExport ? _react2["default"].createElement(CsvExportComponent, { bootstrapCss: bootstrapCss, onClick: onCsvExport }) : null
					),
					_react2["default"].createElement(CurrentQueryComponent, _extends({}, this.props, { onChange: onSearchFieldChange })),
					pagination,
					_react2["default"].createElement(
						ResultListComponent,
						{ bootstrapCss: bootstrapCss },
						results.docs.map(function (doc, i) {
							return _react2["default"].createElement(ResultComponent, { bootstrapCss: bootstrapCss,
								doc: doc,
								fields: searchFields,
								key: doc.id || i,
								onSelect: _this.props.onSelectDoc,
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
})(_react2["default"].Component);

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	customComponents: _componentPack2["default"],
	pageStrategy: "paginate",
	rows: 20,
	searchFields: [{ type: "text", field: "*" }],
	sortFields: [],
	truncateFacetListsAt: -1,
	showCsvExport: false
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: _react2["default"].PropTypes.bool,
	customComponents: _react2["default"].PropTypes.object,
	onCsvExport: _react2["default"].PropTypes.func,
	onNewSearch: _react2["default"].PropTypes.func,
	onPageChange: _react2["default"].PropTypes.func,
	onSearchFieldChange: _react2["default"].PropTypes.func.isRequired,
	onSelectDoc: _react2["default"].PropTypes.func,
	onSortFieldChange: _react2["default"].PropTypes.func.isRequired,
	query: _react2["default"].PropTypes.object,
	results: _react2["default"].PropTypes.object,
	showCsvExport: _react2["default"].PropTypes.bool,
	truncateFacetListsAt: _react2["default"].PropTypes.number
};

exports["default"] = SolrFacetedSearch;
module.exports = exports["default"];

},{"./component-pack":13,"classnames":1,"react":"react"}],32:[function(_dereq_,module,exports){
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

},{"classnames":1,"react":"react","react-dom":"react-dom"}],33:[function(_dereq_,module,exports){
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

var _iconsSearch = _dereq_("../icons/search");

var _iconsSearch2 = _interopRequireDefault(_iconsSearch);

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
		key: "toggleExpand",
		value: function toggleExpand() {
			this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props;
			var label = _props.label;
			var bootstrapCss = _props.bootstrapCss;
			var collapse = _props.collapse;

			return _react2["default"].createElement(
				"li",
				{ className: (0, _classnames2["default"])({ "list-group-item": bootstrapCss }) },
				_react2["default"].createElement(
					"header",
					{ onClick: this.toggleExpand.bind(this) },
					_react2["default"].createElement(
						"h5",
						null,
						bootstrapCss ? _react2["default"].createElement(
							"span",
							null,
							_react2["default"].createElement("span", { className: (0, _classnames2["default"])("glyphicon", {
									"glyphicon-collapse-down": !collapse,
									"glyphicon-collapse-up": collapse
								}) }),
							" "
						) : null,
						label
					)
				),
				_react2["default"].createElement(
					"div",
					{ style: { display: collapse ? "none" : "block" } },
					_react2["default"].createElement("input", {
						onChange: this.handleInputChange.bind(this),
						onKeyDown: this.handleInputKeyDown.bind(this),
						value: this.state.value || "" }),
					" ",
					_react2["default"].createElement(
						"button",
						{ className: (0, _classnames2["default"])({ "btn": bootstrapCss, "btn-default": bootstrapCss, "btn-sm": bootstrapCss }), onClick: this.handleSubmit.bind(this) },
						_react2["default"].createElement(_iconsSearch2["default"], null)
					)
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
	collapse: _react2["default"].PropTypes.bool,
	field: _react2["default"].PropTypes.string.isRequired,
	label: _react2["default"].PropTypes.string,
	onChange: _react2["default"].PropTypes.func,
	onSetCollapse: _react2["default"].PropTypes.func
};

exports["default"] = TextSearch;
module.exports = exports["default"];

},{"../icons/search":16,"classnames":1,"react":"react"}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _componentsSolrFacetedSearch = _dereq_("./components/solr-faceted-search");

var _componentsSolrFacetedSearch2 = _interopRequireDefault(_componentsSolrFacetedSearch);

var _componentsComponentPack = _dereq_("./components/component-pack");

var _componentsComponentPack2 = _interopRequireDefault(_componentsComponentPack);

var _apiSolrClient = _dereq_("./api/solr-client");

exports["default"] = _componentsSolrFacetedSearch2["default"];
exports.SolrFacetedSearch = _componentsSolrFacetedSearch2["default"];
exports.defaultComponentPack = _componentsComponentPack2["default"];
exports.SolrClient = _apiSolrClient.SolrClient;

},{"./api/solr-client":11,"./components/component-pack":13,"./components/solr-faceted-search":31}],35:[function(_dereq_,module,exports){
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
		case "SET_FILTERS":
			return _extends({}, state, { filters: action.newFilters, start: state.pageStrategy === "paginate" ? 0 : null });
		case "SET_START":
			return _extends({}, state, { start: action.newStart });
		case "SET_RESULTS":
			return action.data.nextCursorMark ? _extends({}, state, { cursorMark: action.data.nextCursorMark }) : state;
	}

	return state;
};

module.exports = exports["default"];

},{}],36:[function(_dereq_,module,exports){
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

module.exports = exports["default"];

},{}]},{},[34])(34)
});