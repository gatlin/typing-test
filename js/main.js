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
;
function flatten(ary) {
    return ary.reduce(function (a, b) { return a.concat(b); }, []);
}
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
                if (!child || child instanceof Array) {
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
        console.log('view', view);
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
        var _this = this;
        this.gensymnumber = 0;
        this.handleEvent = function (evt) {
            var evtName = evt.type;
            if (_this.events[evtName]) {
                if (evt.target.hasAttribute('data-alm-id')) {
                    var almId = evt.target.getAttribute('data-alm-id');
                    if (_this.events[evtName][almId]) {
                        _this.events[evtName][almId](new AlmEvent(evt));
                    }
                }
            }
        };
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
    Alm.prototype.gensym = function () {
        return 'node-' + (this.gensymnumber++).toString();
    };
    Alm.prototype.registerEvent = function (evtName, cb) {
        this.eventRoot.addEventListener(evtName, cb, true);
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
exports.initialize = function (data) { return ({
    type: Actions.Init,
    data: data
}); };
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
var actions_1 = __webpack_require__(1);
var MainView_1 = __webpack_require__(5);
var reducer_1 = __webpack_require__(11);
var app = new alm_1.Alm({
    model: store_1.initialState,
    update: reducer_1.default,
    view: MainView_1.default(),
    domRoot: 'main',
    eventRoot: 'main'
});
app.store.subscribe(function () {
    var do_set_timer = app.store.getState().do_set_timer;
    if (do_set_timer) {
        window.setTimeout(function () {
            app.store.dispatch({
                type: actions_1.Actions.Stop
            });
        }, 60000);
    }
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
})(Op = exports.Op || (exports.Op = {}));
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
                d[i_2 * n + j_2] = Math.min(d[(i_2 - 1) * n + j_2], d[i_2 * n + (j_2 - 1)]) + 1;
            }
        }
    }
    var i = m - 1;
    var j = n - 1;
    while (i > 0 && j > 0) {
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
    if (i > 0 && j === 0) {
        for (; i >= 0; i--) {
            moves.unshift([Op.Delete, a[i], null]);
        }
    }
    if (j > 0 && i === 0) {
        for (; j >= 0; j--) {
            moves.unshift([Op.Insert, null, b[j]]);
        }
    }
    return moves;
}
exports.diff_array = diff_array;
function diff_dom(parent, a, b, index) {
    if (index === void 0) { index = 0; }
    if (typeof b === 'undefined' || b === null) {
        if (parent.childNodes[index]) {
            if (parent.childNodes[index].onDestroy) {
                parent.childNodes[index].onDestroy();
            }
            parent.removeChild(parent.childNodes[index]);
        }
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
    num_words_incorrect: 0,
    do_set_timer: false
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var actions = __webpack_require__(1);
var MainComponent_1 = __webpack_require__(6);
var MainView = alm_1.connect(function (_a) {
    var lines = _a.lines;
    return ({ lines: lines });
}, function (dispatch) { return ({
    initialize: function (d) { return dispatch(actions.initialize(d)); }
}); })(MainComponent_1.default);
exports.default = MainView;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alm = __webpack_require__(0);
var BelowBox_1 = __webpack_require__(7);
var WordBox_1 = __webpack_require__(9);
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

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var actions = __webpack_require__(1);
var BelowBox_1 = __webpack_require__(8);
var BelowBoxView = alm_1.connect(function (_a) {
    var cpm = _a.cpm, num_words_incorrect = _a.num_words_incorrect, finished = _a.finished, active = _a.active, typed_so_far = _a.typed_so_far;
    return ({
        cpm: cpm,
        num_words_incorrect: num_words_incorrect,
        finished: finished,
        active: active,
        typed_so_far: typed_so_far
    });
}, function (dispatch) { return ({
    keyPress: function (d) { return dispatch(actions.keyPress(d)); },
    goBack: function () { return dispatch(actions.goBack()); },
    nextWord: function () { return dispatch(actions.nextWord()); }
}); })(BelowBox_1.default);
exports.default = BelowBoxView;


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var WordBox_1 = __webpack_require__(10);
var WordBoxView = alm_1.connect(function (_a) {
    var lines = _a.lines, current_word = _a.current_word, current_line = _a.current_line, typed_so_far = _a.typed_so_far;
    return ({
        lines: lines,
        current_word: current_word,
        current_line: current_line,
        typed_so_far: typed_so_far
    });
}, function (dispatch) { return ({}); })(WordBox_1.default);
exports.default = WordBoxView;


/***/ }),
/* 10 */
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
    var current_word = _a.current_word, current_line = _a.current_line, words = _a.words, line_idx = _a.line_idx, typed_so_far = _a.typed_so_far;
    return (Alm.el("div", { className: 'line', key: current_line }, words.map(function (word, word_idx) { return Word({
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
/* 11 */
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
var words_1 = __webpack_require__(12);
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
    var initialized = state.initialized, typed_so_far = state.typed_so_far, lines = state.lines, current_word = state.current_word, current_line = state.current_line, words_box_width = state.words_box_width, char_width = state.char_width, words_typed = state.words_typed, active = state.active, finished = state.finished, cpm = state.cpm, num_words_incorrect = state.num_words_incorrect, do_set_timer = state.do_set_timer;
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
            active = !finished;
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
            active = true;
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
    do_set_timer = initialized && !state.active && active;
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
        num_words_incorrect: num_words_incorrect,
        do_set_timer: do_set_timer });
};
exports.default = reducer;


/***/ }),
/* 12 */
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