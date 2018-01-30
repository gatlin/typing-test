/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(3);
function makeReducer(reducers) {
    var reducerKeys = Object.keys(reducers);
    return function (state, action) {
        var hasChanged = false;
        var newState = {};
        for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];
            var reducer = reducers[key];
            var previousState = state[key];
            var nextState = reducer(previousState, action);
            newState[key] = nextState;
            hasChanged = hasChanged || nextState !== previousState;
        }
        return hasChanged ? newState : state;
    };
}
exports.makeReducer = makeReducer;
var Store = (function () {
    function Store(state, reducer) {
        this.state = state;
        this.reducer = reducer;
        this.subscribers = [];
    }
    Store.prototype.dispatch = function (action) {
        this.state = this.reducer(this.state, typeof action === 'function'
            ? action(this.dispatch.bind(this), this.getState.bind(this))
            : action);
        this.subscribers.forEach(function (update) { update(); });
        return this;
    };
    Store.prototype.subscribe = function (subscriber) {
        var _this = this;
        this.subscribers.push(subscriber);
        return function () {
            var idx = _this.subscribers.indexOf(subscriber);
            _this.subscribers.splice(idx, 1);
        };
    };
    Store.prototype.getState = function () {
        return Object.seal(this.state);
    };
    return Store;
}());
exports.Store = Store;
function el(ctor, props) {
    if (props === void 0) { props = {}; }
    var _children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        _children[_i - 2] = arguments[_i];
    }
    return function (ctx) {
        props = props === null ? {} : props;
        var eventHandlers = {};
        if (props.on) {
            eventHandlers = props.on;
            delete props.on;
        }
        if (props.className) {
            props['class'] = props.className;
            delete props['className'];
        }
        if (props.ref) {
            eventHandlers['ref'] = props['ref'];
            delete props['ref'];
        }
        _children = Array.isArray(_children) && Array.isArray(_children[0])
            ? _children[0]
            : _children;
        var children = _children
            ? _children
                .filter(function (child) { return typeof child !== 'undefined'; })
                .map(function (child, idx) {
                if (!child) {
                    return null;
                }
                return typeof child === 'string'
                    ? new vdom_1.VDom(child, [], vdom_1.VDomType.Text)
                    : child(ctx);
            })
                .filter(function (child) { return child !== null; })
            : [];
        var handler = function (e) { ctx.handle(e, eventHandlers); };
        var view = typeof ctor === 'string'
            ? new vdom_1.VDom({
                tag: ctor,
                attrs: props
            }, children, vdom_1.VDomType.Node, handler)
            : ctor(__assign({}, props, { children: children }))(ctx);
        return view;
    };
}
exports.el = el;
var AlmEvent = (function () {
    function AlmEvent(evt) {
        this.raw = evt;
        this.classes = evt.target.className.trim().split(/\s+/g) || [];
        this.id = evt.target.id || '';
        this.value = evt.target.value;
    }
    AlmEvent.prototype.hasClass = function (klass) {
        return (this.classes.indexOf(klass) !== -1);
    };
    AlmEvent.prototype.getClasses = function () {
        return this.classes;
    };
    AlmEvent.prototype.getId = function () {
        return this.id;
    };
    AlmEvent.prototype.getValue = function () {
        return this.value;
    };
    AlmEvent.prototype.getRaw = function () {
        return this.raw;
    };
    AlmEvent.prototype.class_in_ancestry = function (klass) {
        var result = null;
        var done = false;
        var elem = this.raw.target;
        while (!done) {
            if (!elem.className) {
                done = true;
                break;
            }
            var klasses = elem.className.trim().split(/\s+/g) || [];
            if (klasses.indexOf(klass) !== -1) {
                result = elem;
                done = true;
            }
            else if (elem.parentNode) {
                elem = elem.parentNode;
            }
            else {
                done = true;
            }
        }
        return result;
    };
    return AlmEvent;
}());
exports.AlmEvent = AlmEvent;
var Alm = (function () {
    function Alm(cfg) {
        this.gensymnumber = 0;
        this.store = new Store(cfg.model, cfg.update);
        this.eventRoot = typeof cfg.eventRoot === 'string'
            ? document.getElementById(cfg.eventRoot)
            : typeof cfg.eventRoot === 'undefined'
                ? document
                : cfg.eventRoot;
        this.domRoot = typeof cfg.domRoot === 'string'
            ? document.getElementById(cfg.domRoot)
            : cfg.domRoot;
        this.view = cfg.view;
        this.events = {};
    }
    Alm.prototype.start = function () {
        var _this = this;
        this.events = {};
        var store = this.store;
        var handle = function (e, handlers) {
            window.setTimeout(function () {
                var eId;
                if (e.hasAttribute('data-alm-id')) {
                    eId = e.getAttribute('data-alm-id');
                }
                else {
                    eId = _this.gensym();
                    e.setAttribute('data-alm-id', eId);
                }
                if (handlers.ref) {
                    handlers.ref(e);
                    delete handlers['ref'];
                }
                for (var evtName in handlers) {
                    if (!(evtName in _this.events)) {
                        _this.events[evtName] = {};
                        _this.registerEvent(evtName, _this.handleEvent);
                    }
                    _this.events[evtName][eId] = handlers[evtName];
                }
                return function () {
                    for (var evtName in handlers) {
                        delete _this.events[evtName][eId];
                    }
                };
            }, 0);
        };
        var context = { store: store, handle: handle };
        var vtree = this.view(context);
        vdom_1.initialDOM(this.domRoot, vtree);
        this.store.subscribe(function () {
            var updated = _this.view(context);
            vdom_1.diff_dom(_this.domRoot, vtree, updated);
            vtree = updated;
        });
    };
    Alm.prototype.handleEvent = function (evt) {
        var evtName = evt.type;
        if (this.events[evtName]) {
            if (evt.target.hasAttribute('data-alm-id')) {
                var almId = evt.target.getAttribute('data-alm-id');
                if (this.events[evtName][almId]) {
                    this.events[evtName][almId](new AlmEvent(evt));
                }
            }
        }
    };
    Alm.prototype.gensym = function () {
        return 'node-' + (this.gensymnumber++).toString();
    };
    Alm.prototype.registerEvent = function (evtName, cb) {
        this.eventRoot.addEventListener(evtName, cb.bind(this), true);
    };
    return Alm;
}());
exports.Alm = Alm;
function connect(mapState, mapDispatch) {
    if (mapState === void 0) { mapState = null; }
    if (mapDispatch === void 0) { mapDispatch = null; }
    return function (component) { return function (props) {
        if (props === void 0) { props = {}; }
        return function (ctx) {
            var store = ctx.store;
            var state = store.getState();
            var mappedState = mapState ? mapState(state) : {};
            var mappedDispatch = mapDispatch
                ? mapDispatch(store.dispatch.bind(store))
                : {};
            var finalProps = __assign({}, props, mappedState, mappedDispatch);
            return component(finalProps)(ctx);
        };
    }; };
}
exports.connect = connect;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Actions;
(function (Actions) {
    Actions[Actions["Init"] = 0] = "Init";
    Actions[Actions["GoBack"] = 1] = "GoBack";
    Actions[Actions["NextWord"] = 2] = "NextWord";
    Actions[Actions["KeyPress"] = 3] = "KeyPress";
    Actions[Actions["Stop"] = 4] = "Stop";
})(Actions = exports.Actions || (exports.Actions = {}));
;
exports.initialize = function (data) { return function (dispatch, getState) {
    window.setTimeout(function () {
        dispatch({
            type: Actions.Stop
        });
    }, 60000);
    return ({
        type: Actions.Init,
        data: data
    });
}; };
exports.keyPress = function (data) { return ({
    type: Actions.KeyPress,
    data: data
}); };
exports.goBack = function () { return ({
    type: Actions.GoBack
}); };
exports.nextWord = function () { return ({
    type: Actions.NextWord
}); };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var store_1 = __webpack_require__(4);
var MainView_1 = __webpack_require__(5);
var reducer_1 = __webpack_require__(16);
var app = new alm_1.Alm({
    model: store_1.initialState,
    update: reducer_1.default,
    view: MainView_1.default(),
    domRoot: 'main',
    eventRoot: 'main'
});
app.store.subscribe(function () {
});
document.title = 'Typing Test';
app.start();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VDomType;
(function (VDomType) {
    VDomType[VDomType["Text"] = 0] = "Text";
    VDomType[VDomType["Node"] = 1] = "Node";
})(VDomType = exports.VDomType || (exports.VDomType = {}));
;
var VDom = (function () {
    function VDom(content, children, treeType, handler) {
        if (handler === void 0) { handler = null; }
        this.content = content;
        this.children = children;
        this.treeType = treeType;
        this.onCreate = handler;
        this.onDestroy = null;
        if (treeType === VDomType.Node) {
            if ('key' in this.content.attrs) {
                this.key = this.content.attrs.key;
                delete this.content.attrs.key;
            }
            else if ('id' in this.content.attrs) {
                this.key = this.content.attrs.id;
            }
            else {
                this.key = this.content.tag;
            }
        }
        else {
            this.key = 'text-node';
        }
    }
    VDom.prototype.setChildren = function (children) {
        this.children = children;
        return this;
    };
    VDom.prototype.eq = function (other) {
        if (!other) {
            return false;
        }
        return (this.key === other.key);
    };
    return VDom;
}());
exports.VDom = VDom;
function makeDOMNode(tree) {
    if (tree === null) {
        return null;
    }
    if (tree.treeType === VDomType.Text) {
        return document.createTextNode(tree.content);
    }
    var el = document.createElement(tree.content.tag);
    for (var key in tree.content.attrs) {
        if (tree.content.attrs[key] !== null) {
            el.setAttribute(key, tree.content.attrs[key]);
        }
    }
    for (var i = 0; i < tree.children.length; i++) {
        var child = makeDOMNode(tree.children[i]);
        el.appendChild(child);
    }
    tree.onDestroy = tree.onCreate(el);
    return el;
}
function initialDOM(domRoot, tree) {
    var root = domRoot;
    var domTree = makeDOMNode(tree);
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
    root.appendChild(domTree);
}
exports.initialDOM = initialDOM;
var Op;
(function (Op) {
    Op[Op["Merge"] = 0] = "Merge";
    Op[Op["Delete"] = 1] = "Delete";
    Op[Op["Insert"] = 2] = "Insert";
})(Op || (Op = {}));
;
function diff_array(a, b, eq) {
    if (!a.length) {
        return b.map(function (c) { return [Op.Insert, null, c]; });
    }
    if (!b.length) {
        return a.map(function (c) { return [Op.Delete, c, null]; });
    }
    var m = a.length + 1;
    var n = b.length + 1;
    var d = new Array(m * n);
    var moves = [];
    for (var i_1 = 0; i_1 < m; i_1++) {
        d[i_1 * n] = i_1;
    }
    for (var j_1 = 0; j_1 < n; j_1++) {
        d[j_1] = j_1;
    }
    for (var j_2 = 1; j_2 < n; j_2++) {
        for (var i_2 = 1; i_2 < m; i_2++) {
            if (eq(a[i_2 - 1], b[j_2 - 1])) {
                d[i_2 * n + j_2] = d[(i_2 - 1) * n + (j_2 - 1)];
            }
            else {
                d[i_2 * n + j_2] = Math.min(d[(i_2 - 1) * n + j_2], d[i_2 * n + (j_2 - 1)])
                    + 1;
            }
        }
    }
    var i = m - 1, j = n - 1;
    while (!(i === 0 && j === 0)) {
        if (eq(a[i - 1], b[j - 1])) {
            i--;
            j--;
            moves.unshift([Op.Merge, a[i], b[j]]);
        }
        else {
            if (d[i * n + (j - 1)] <= d[(i - 1) * n + j]) {
                j--;
                moves.unshift([Op.Insert, null, b[j]]);
            }
            else {
                i--;
                moves.unshift([Op.Delete, a[i], null]);
            }
        }
    }
    return moves;
}
exports.diff_array = diff_array;
function diff_dom(parent, a, b, index) {
    if (index === void 0) { index = 0; }
    if (typeof b === 'undefined' || b === null) {
        if (parent.childNodes[index].onDestroy) {
            parent.childNodes[index].onDestroy();
        }
        parent.removeChild(parent.childNodes[index]);
        return;
    }
    if (typeof a === 'undefined' || a === null) {
        parent.insertBefore(makeDOMNode(b), parent.childNodes[index]);
        return;
    }
    if (b.treeType === VDomType.Node) {
        if (a.treeType === VDomType.Node) {
            if (a.content.tag === b.content.tag) {
                var dom_1 = parent.childNodes[index];
                for (var attr in a.content.attrs) {
                    if (!(attr in b.content.attrs)) {
                        dom_1.removeAttribute(attr);
                        delete dom_1[attr];
                    }
                }
                for (var attr in b.content.attrs) {
                    var v = b.content.attrs[attr];
                    if (!(attr in a.content.attrs) ||
                        v !== a.content.attrs[attr]) {
                        dom_1[attr] = v;
                        dom_1.setAttribute(attr, v);
                    }
                }
                window.setTimeout(function () {
                    if (dom_1.hasAttribute('value')) {
                        dom_1.value = dom_1.getAttribute('value');
                    }
                }, 0);
                var moves = diff_array(a.children, b.children, function (a, b) {
                    if (typeof a === 'undefined')
                        return false;
                    return a.eq(b);
                });
                var domIndex = 0;
                for (var i = 0; i < moves.length; i++) {
                    var move = moves[i];
                    diff_dom(parent.childNodes[index], move[1], move[2], domIndex);
                    if (move[0] !== Op.Delete) {
                        domIndex++;
                    }
                }
            }
        }
    }
    else {
        if (parent.childNodes[index].onDestroy) {
            parent.childNodes[index].onDestroy();
        }
        parent.replaceChild(makeDOMNode(b), parent.childNodes[index]);
    }
}
exports.diff_dom = diff_dom;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = {
    initialized: false,
    typed_so_far: '',
    lines: [],
    current_word: 0,
    current_line: 0,
    words_box_width: 0,
    char_width: 0,
    words_typed: 0,
    active: false,
    finished: false,
    cpm: 0,
    num_words_incorrect: 0
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var actions = __webpack_require__(1);
var MainComponent_1 = __webpack_require__(6);
var MainView = alm_1.connect(function (state) { return state; }, function (dispatch) { return ({
    initialize: function (d) { return dispatch(actions.initialize(d)); }
}); })(MainComponent_1.default);
exports.default = MainView;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alm = __webpack_require__(0);
__webpack_require__(7);
var BelowBox_1 = __webpack_require__(12);
var WordBox_1 = __webpack_require__(14);
var MainComponent = function (props) { return (Alm.el("section", { id: "typing-app", className: "app" },
    Alm.el("div", { id: 'words-box-outer', ref: function (e) {
            props.initialize(e.offsetWidth);
        } },
        Alm.el(WordBox_1.default, { lines: props.lines })),
    Alm.el(BelowBox_1.default, null))); };
exports.default = MainComponent;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(10)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./MainComponent.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./MainComponent.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var actions = __webpack_require__(1);
var BelowBox_1 = __webpack_require__(13);
var BelowBoxView = alm_1.connect(function (state) { return state; }, function (dispatch) { return ({
    keyPress: function (d) { return dispatch(actions.keyPress(d)); },
    goBack: function () { return dispatch(actions.goBack()); },
    nextWord: function () { return dispatch(actions.nextWord()); }
}); })(BelowBox_1.default);
exports.default = BelowBoxView;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alm = __webpack_require__(0);
var BelowBoxInitial = function (props) { return (Alm.el("div", null,
    Alm.el("input", { type: 'text', id: 'typing-input', key: null, autoFocus: true, on: {
            keypress: function (evt) {
                var _a = evt.getRaw(), keyCode = _a.keyCode, charCode = _a.charCode;
                if (8 === keyCode) {
                    props.goBack();
                }
                else if (0 === keyCode && 32 === charCode) {
                    props.nextWord();
                }
                else if (0 !== charCode) {
                    props.keyPress({
                        charCode: charCode
                    });
                }
            }
        }, value: props.typed_so_far }),
    Alm.el("div", { key: 'huh', id: 'some-text', className: props.active ? 'begun' : '' },
        Alm.el("p", null, "Just start typing to begin! You have 1 minute.")))); };
var BelowBoxFinished = function (props) { return (Alm.el("div", { className: 'fade-in' },
    Alm.el("h2", { id: 'score' },
        "You typed ",
        props.cpm.toString(),
        " characters per minute!"),
    props.num_words_incorrect > 0
        ? (Alm.el("p", null,
            "The number would have been higher but you got ",
            props.num_words_incorrect.toString(),
            " words wrong."))
        : null,
    Alm.el("p", null, "Refresh to try again. Maybe take a 2 minute break."))); };
var BelowBox = function (props) {
    var belowBox = props.finished
        ? BelowBoxFinished(props)
        : BelowBoxInitial(props);
    return (Alm.el("div", { id: 'below-box' },
        belowBox,
        Alm.el("p", null,
            " Made by ",
            Alm.el("a", { href: "http://niltag.net" }, "Gatlin"),
            " (",
            Alm.el("a", { href: "https://github.com/gatlin/typing-test" }, "source code"),
            ").")));
};
exports.default = BelowBox;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var WordBox_1 = __webpack_require__(15);
var WordBoxView = alm_1.connect(function (state) { return state; }, function (dispatch) { return ({}); })(WordBox_1.default);
exports.default = WordBoxView;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alm = __webpack_require__(0);
function currentWord(_a) {
    var line_idx = _a.line_idx, word_idx = _a.word_idx, current_word = _a.current_word, current_line = _a.current_line;
    var line_check = current_line === 0
        ? line_idx === 0
        : line_idx === 1;
    return line_check && (word_idx === current_word);
}
var Word = function (props) {
    var _a = props.word, expected = _a.expected, actual = _a.actual, incorrect = _a.incorrect;
    var outerClassName = 'word';
    var innerClassName = '';
    var bolded = '';
    var unbolded = '';
    if (incorrect) {
        outerClassName += ' incorrect';
    }
    if (currentWord(props)) {
        innerClassName = 'bolded';
        outerClassName += ' current-word';
        var len = actual.length;
        bolded = expected.slice(0, len);
        unbolded = expected.slice(len);
    }
    else {
        unbolded = expected;
    }
    return (Alm.el("span", { id: 'word-' + expected, className: outerClassName },
        Alm.el("span", { className: innerClassName }, bolded),
        Alm.el("span", null, unbolded)));
};
var Line = function (_a) {
    var lines = _a.lines, current_word = _a.current_word, current_line = _a.current_line, words = _a.words, line_idx = _a.line_idx, typed_so_far = _a.typed_so_far;
    return (Alm.el("div", { className: 'line', key: line_idx }, words.map(function (word, word_idx) { return Word({
        word: word,
        line_idx: line_idx,
        word_idx: word_idx,
        current_word: current_word,
        current_line: current_line,
        typed_so_far: typed_so_far
    }); })));
};
var WordBox = function (_a) {
    var lines = _a.lines, current_word = _a.current_word, current_line = _a.current_line, typed_so_far = _a.typed_so_far;
    var line_start = current_line === 0
        ? 0
        : current_line - 1;
    var line_end = line_start + 3;
    return (Alm.el("div", { id: 'words-box' }, lines
        .slice(line_start, line_end)
        .map(function (words, line_idx) {
        return Line({
            lines: lines,
            current_word: current_word,
            current_line: current_line,
            words: words,
            line_idx: line_idx,
            typed_so_far: typed_so_far
        });
    })));
};
exports.default = WordBox;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = __webpack_require__(1);
var words_1 = __webpack_require__(17);
function flatten_array(ary) {
    return ary.reduce(function (a, b) { return a.concat(b); }, []);
}
function generate_line(box_width, char_width) {
    if (char_width === void 0) { char_width = 20; }
    var uw = [];
    var current_width = 0;
    var done = false;
    while (!done) {
        var word = words_1.random_word();
        current_width += word.length * char_width + char_width;
        if (current_width >= box_width) {
            done = true;
            break;
        }
        else {
            uw.push({
                expected: word,
                actual: '',
                incorrect: false
            });
        }
    }
    return uw;
}
var reducer = function (state, action) {
    var initialized = state.initialized, typed_so_far = state.typed_so_far, lines = state.lines, current_word = state.current_word, current_line = state.current_line, words_box_width = state.words_box_width, char_width = state.char_width, words_typed = state.words_typed, active = state.active, finished = state.finished, cpm = state.cpm, num_words_incorrect = state.num_words_incorrect;
    switch (action.type) {
        case actions_1.Actions.Init: {
            if (initialized) {
                return state;
            }
            words_box_width = action.data;
            lines = [];
            for (var i = 0; i < 3; i++) {
                var line = generate_line(words_box_width);
                lines.push(line);
            }
            initialized = true;
            break;
        }
        case actions_1.Actions.GoBack: {
            if ('' === typed_so_far &&
                words_typed > 0) {
                current_word--;
                words_typed--;
                if (current_word < 0 && current_line > 0) {
                    current_line--;
                    var line = lines[current_line];
                    current_word = line.length - 1;
                }
                typed_so_far =
                    lines[current_line][current_word].actual;
            }
            else {
                typed_so_far = typed_so_far
                    .substring(0, typed_so_far.length - 1);
                var the_word = lines[current_line][current_word];
                the_word.actual = typed_so_far.replace(/\s+/g, '');
                lines[current_line][current_word] = the_word;
            }
            break;
        }
        case actions_1.Actions.NextWord: {
            active = !finished;
            var the_word = lines[current_line][current_word];
            the_word.actual = typed_so_far.replace(/\s+/g, '');
            if (the_word.expected !== the_word.actual) {
                num_words_incorrect++;
                the_word.incorrect = true;
            }
            else {
                if (the_word.incorrect) {
                    num_words_incorrect--;
                }
                the_word.incorrect = false;
            }
            lines[current_line][current_word] = the_word;
            current_word++;
            if (current_word >= lines[current_line].length) {
                lines.push(generate_line(words_box_width));
                current_word = 0;
                current_line++;
            }
            typed_so_far = '';
            words_typed++;
            break;
        }
        case actions_1.Actions.KeyPress: {
            var charCode = action.data.charCode;
            typed_so_far += String.fromCharCode(charCode);
            var the_word = lines[current_line][current_word];
            the_word.actual = typed_so_far.replace(/\s+/g, '');
            lines[current_line][current_word] = the_word;
            break;
        }
        case actions_1.Actions.Stop: {
            finished = true;
            if (active) {
                active = false;
                var words = flatten_array(lines)
                    .slice(0, words_typed)
                    .filter(function (word) { return !word.incorrect; });
                cpm = 0;
                for (var i = 0; i < words.length; i++) {
                    cpm += words[i].expected.length;
                }
                cpm += words.length;
            }
            break;
        }
        default:
            return __assign({}, state);
    }
    return __assign({}, state, { initialized: initialized,
        typed_so_far: typed_so_far,
        lines: lines,
        current_word: current_word,
        current_line: current_line,
        words_box_width: words_box_width,
        char_width: char_width,
        words_typed: words_typed,
        active: active,
        finished: finished,
        cpm: cpm,
        num_words_incorrect: num_words_incorrect });
};
exports.default = reducer;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var source_words_str = 'the name of very to through and just form in much is great it think you say ' +
    'that help he low was line for before on turn are cause with same as mean ' +
    'differ his move they right be boy at old one too have does this tell from ' +
    'sentence or set had three by want hot air but well some also what play there ' +
    'small we end can put out home other read were hand all port your large when ' +
    'spell up add use even word land how here said must an big each high she such ' +
    'which follow do act their why time ask if men will change way went about light ' +
    'many kind then off them need would house write picture like try so us these ' +
    'again her animal long point make mother thing world see near him build two self ' +
    'has earth look father more head day stand could own go page come should did ' +
    'country my found sound answer no school most grow number study who still over ' +
    'learn know plant water cover than food call sun first four people thought may ' +
    'let down keep side eye been never now last find door any between new city work ' +
    'tree part cross take since get hard place start made might live story where saw ' +
    'after far back sea little draw only left round late man run year don\'t came ' +
    'while show press every close good night me real give life our few under stop ' +
    'open ten seem simple together several next vowel white toward children war ' +
    'begin lay got against walk pattern example slow ease center paper love often ' +
    'person always money music serve those appear both road mark map book science ' +
    'letter rule until govern mile pull river cold car notice feet voice care fall ' +
    'second power group town carry fine took certain rain fly eat unit room lead ' +
    'friend cry began dark idea machine fish note mountain wait north plan once ' +
    'figure base star hear box horse noun cut field sure rest watch correct color ' +
    'able face pound wood done main beauty enough drive plain stood girl contain ' +
    'usual front young teach ready week above final ever gave red green list oh ' +
    'though quick feel develop talk sleep bird warm soon free body minute dog strong ' +
    'family special direct mind pose behind leave clear song tail measure produce ' +
    'state fact product street black inch short lot numeral nothing class course ' +
    'wind stay question wheel happen full complete force ship blue area object half ' +
    'decide rock surface order deep fire moon south island problem foot piece yet ' +
    'told busy knew test pass record farm boat top common whole gold king possible ' +
    'size plane heard age best dry hour wonder better laugh true thousand during ago ' +
    'hundred ran am check remember game step shape early yes hold hot west miss ' +
    'ground brought interest heat reach snow fast bed five bring sing sit listen ' +
    'perhaps six fill table east travel weight less language morning among speed ' +
    'typing mineral seven eight nine everything something standard distant ' +
    'paint';
exports.source_words = source_words_str.split(' ');
function random_word() {
    return exports.source_words[Math.floor(Math.random() * exports.source_words.length)];
}
exports.random_word = random_word;


/***/ })
/******/ ]);