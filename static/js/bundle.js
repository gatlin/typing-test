/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, alm_1, words_1) {
	    "use strict";
	    exports.__esModule = true;
	    // space bar keycode: 32
	    // backspace: 8
	    var words_box_mbox = new alm_1.Mailbox(null);
	    var timer_mbox = new alm_1.Mailbox(false);
	    var Actions;
	    (function (Actions) {
	        Actions[Actions["Init"] = 0] = "Init";
	        Actions[Actions["UpdateInput"] = 1] = "UpdateInput";
	        Actions[Actions["KeyDown"] = 2] = "KeyDown";
	        Actions[Actions["Stop"] = 3] = "Stop";
	    })(Actions || (Actions = {}));
	    ;
	    function generate_line(box_width, char_width) {
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
	    function empty_model() {
	        return {
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
	    }
	    // for readability later
	    function flatten_array(ary) {
	        return ary.reduce(function (a, b) { return a.concat(b); }, []);
	    }
	    function update_model(action, model) {
	        var dispatch = {};
	        // once the words box is rendered we can calculate the geometry for the
	        // scroll box
	        dispatch[Actions.Init] = function () {
	            if (!model.initialized) {
	                model.words_box_width = action.data.offsetWidth;
	                model.char_width =
	                    document.getElementById('current-word').offsetWidth / 3;
	                for (var i = 0; i < 3; i++) {
	                    var line = generate_line(model.words_box_width, model.char_width);
	                    model.lines.push(line);
	                }
	                model.initialized = true;
	            }
	            return model;
	        };
	        // the user typed something
	        dispatch[Actions.UpdateInput] = function () {
	            if (!model.active && !model.finished) {
	                model.active = true;
	                timer_mbox.send(true);
	            }
	            model.typed_so_far = action.data;
	            // did they hit the space bar?
	            var split_input = model.typed_so_far.split(' ');
	            var space_pressed = split_input.length === 2;
	            if (space_pressed) {
	                // generate a new word, push the old word into the history
	                var current_word = model.lines[model.current_line][model.current_word];
	                current_word.actual = model.typed_so_far.replace(/\s+$/, '');
	                if (current_word.expected !== current_word.actual) {
	                    model.num_words_incorrect++;
	                    current_word.incorrect = true;
	                }
	                else {
	                    if (current_word.incorrect) {
	                        // we went back and fixed one
	                        model.num_words_incorrect--;
	                    }
	                    current_word.incorrect = false;
	                }
	                model.current_word++;
	                if (model.current_word >= model.lines[model.current_line].length) {
	                    var next_line = generate_line(model.words_box_width, model.char_width);
	                    model.lines.push(next_line);
	                    model.current_word = 0;
	                    model.current_line++;
	                }
	                model.typed_so_far = '';
	                model.words_typed++;
	            }
	            return model;
	        };
	        // check if backspace was pressed with empty input
	        dispatch[Actions.KeyDown] = function () {
	            var go_back_a_word = 8 === action.data &&
	                '' === model.typed_so_far &&
	                model.words_typed > 0; // we have something to go back to
	            if (go_back_a_word) {
	                model.current_word--;
	                model.words_typed--;
	                // if we're trying to back up to a previous line
	                if (model.current_word < 0 && model.current_line > 0) {
	                    model.current_line--;
	                    var line = model.lines[model.current_line];
	                    model.current_word = line.length - 1;
	                }
	                model.typed_so_far =
	                    model.lines[model.current_line][model.current_word].actual;
	            }
	            return model;
	        };
	        dispatch[Actions.Stop] = function () {
	            if (model.active) {
	                model.active = false;
	                model.finished = true;
	                // calculate a score
	                var words = flatten_array(model.lines)
	                    .slice(0, model.words_typed)
	                    .filter(function (word) { return !word.incorrect; });
	                model.cpm = 0; // double tap
	                for (var i = 0; i < words.length; i++) {
	                    model.cpm += words[i].expected.length;
	                }
	                model.cpm += words.length; // spaces
	            }
	            return model;
	        };
	        return dispatch[action.type]();
	    }
	    // logic for taking an array of `Word`s and rendering as a single line
	    function render_line(line, current_word) {
	        if (current_word === void 0) { current_word = null; }
	        var line_spans = line.map(function (uw, idx) {
	            var attrs = {
	                'class': 'word',
	                'id': 'word-' + uw.expected
	            };
	            if (idx !== null && idx === current_word) {
	                attrs['class'] = attrs['class'] + ' current-word';
	            }
	            if (uw.incorrect) {
	                attrs['class'] = attrs['class'] + ' incorrect';
	            }
	            return alm_1.el('span', attrs, [uw.expected]);
	        });
	        return line_spans;
	    }
	    function render_model(model) {
	        var words_line = [];
	        if (model.initialized) {
	            var start_index = model.current_line === 0
	                ? 0
	                : model.current_line - 1;
	            var end_index = model.current_line === 0
	                ? 2
	                : model.current_line + 1;
	            for (var i = start_index; i <= end_index; i++) {
	                var line = model.lines[i];
	                var rendered_line = render_line(line, model.current_line === i
	                    ? model.current_word
	                    : null);
	                words_line.push(alm_1.el('div', {
	                    'class': 'line'
	                }, rendered_line));
	            }
	        }
	        else {
	            // put a single line and a single character for the purposes of
	            // calculating the width of the lines and the characters
	            words_line.push(alm_1.el('span', {
	                'class': 'word',
	                'id': 'current-word'
	            }, ['foo']));
	        }
	        var below_box;
	        if (!model.finished) {
	            below_box = alm_1.el('div', { 'id': 'below-box' }, [
	                alm_1.el('input', {
	                    'type': 'text',
	                    'id': 'typing-input',
	                    'key': 'typing-input',
	                    'autofocus': 'autofocus',
	                    'value': model.typed_so_far
	                }, []),
	                alm_1.el('div', {
	                    'id': 'some-text',
	                    'class': model.active ? 'begun' : ''
	                }, [
	                    alm_1.el('p', {}, ['Just start typing to begin.'])
	                ])
	            ]);
	        }
	        else {
	            var text = [alm_1.el('p', {}, [
	                    'Refresh to try again, maybe after a two minute break.'
	                ])];
	            if (model.num_words_incorrect > 0) {
	                text.unshift(alm_1.el('p', {}, ['It would have been higher, but you got ' +
	                        model.num_words_incorrect + ' words incorrect.']));
	            }
	            below_box = alm_1.el('div', { 'id': 'below-box', 'class': 'fade-in' }, [
	                alm_1.el('h2', { 'id': 'score' }, [
	                    'You typed ' + model.cpm + ' characters per minute!'
	                ]),
	                alm_1.el('span', {}, text)
	            ]);
	        }
	        return alm_1.el('div', { 'id': 'typing-app' }, [
	            alm_1.el('div', { 'id': 'words-box-outer' }, [
	                alm_1.el('div', { 'id': 'words-box' }, words_line)
	                    .subscribe(words_box_mbox)
	            ]),
	            below_box
	        ]);
	    }
	    function main(scope) {
	        scope.events.input
	            .filter(function (evt) { return evt.getId() === 'typing-input'; })
	            .map(function (evt) { return ({
	            type: Actions.UpdateInput,
	            data: evt.getValue()
	        }); })
	            .connect(scope.actions);
	        scope.events.keydown
	            .filter(function (evt) { return evt.getId() === 'typing-input'; })
	            .map(function (evt) { return ({
	            type: Actions.KeyDown,
	            data: evt.getRaw().keyCode
	        }); })
	            .connect(scope.actions);
	        words_box_mbox
	            .filter(function (elem) { return elem !== null; })
	            .map(function (elem) { return ({
	            type: Actions.Init,
	            data: elem
	        }); })
	            .connect(scope.actions);
	        timer_mbox
	            .filter(function (msg) { return msg === true; })
	            .recv(function (_) {
	            window.setTimeout(function () {
	                scope.actions.send({ type: Actions.Stop });
	            }, 60000);
	        });
	    }
	    var app = new alm_1.App({
	        domRoot: 'main',
	        eventRoot: 'main',
	        state: empty_model(),
	        update: update_model,
	        render: render_model,
	        main: main
	    }).start();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, base_1, vdom_1, base_2, vdom_2) {
	    "use strict";
	    function __export(m) {
	        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	    exports.__esModule = true;
	    __export(base_1);
	    exports.el = vdom_1.el;
	    /**
	     * Wraps system events and provides some convenience methods.
	     * @constructor
	     * @param evt - The raw browser event value.
	     */
	    var AlmEvent = (function () {
	        function AlmEvent(evt) {
	            this.raw = evt;
	            this.classes = evt.target.className.trim().split(/\s+/g) || [];
	            this.id = evt.target.id;
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
	            return this.raw.target.value;
	        };
	        AlmEvent.prototype.getRaw = function () {
	            return this.raw;
	        };
	        return AlmEvent;
	    }());
	    exports.AlmEvent = AlmEvent;
	    /**
	     * Constructs signals emitting whichever browser event names you pass in.
	     * @param {Array<string>} evts - The event names you want signals for.
	     * @return {Array<Signal>} The event signals.
	     */
	    function makeEvents(evts) {
	        var events = {};
	        for (var i = 0; i < evts.length; i++) {
	            var evtName = evts[i];
	            events[evtName] = new base_2.Signal(function (evt) { return new AlmEvent(evt); });
	        }
	        return events;
	    }
	    /**
	     * Builds the port signals for an App.
	     * @param {Object} portCfg - An object whose keys name arrays of desired port
	     *                           names.
	     *                           Eg, { outbound: ['port1','port2' ],
	     *                                 inbound: ['port3'] }.
	     *
	     * @return {Object} ports - An object with the same keys but this time they
	     *                          point to objects whose keys were in the original
	     *                          arrays and whose values are signals.
	     */
	    function makePorts(portCfg) {
	        // If it is simply an array then make ports for each string
	        if (Array.isArray(portCfg)) {
	            var _ports = {};
	            for (var i = 0; i < portCfg.length; i++) {
	                var portName = portCfg[i];
	                _ports[portName] = base_2.Signal.make();
	            }
	            return _ports;
	        }
	        var ports = (typeof portCfg === 'undefined' || portCfg === null)
	            ? { outbound: [], inbound: [] }
	            : portCfg;
	        for (var key in ports) {
	            var portNames = ports[key];
	            var portSpace = {};
	            for (var i = 0; i < portNames.length; i++) {
	                var portName = portNames[i];
	                portSpace[portName] = base_2.Signal.make();
	            }
	            ports[key] = portSpace;
	        }
	        return ports;
	    }
	    var standardEvents = [
	        'click',
	        'dblclick',
	        'keyup',
	        'keydown',
	        'keypress',
	        'blur',
	        'focusout',
	        'input',
	        'change',
	        'load'
	    ];
	    /**
	     * A self-contained application.
	     * @constructor
	     * @param {AppConfig} cfg - the configuration object.
	     */
	    var App = (function () {
	        function App(cfg) {
	            this.gui = typeof cfg.gui === 'undefined'
	                ? true
	                : cfg.gui;
	            this.eventRoot = typeof cfg.eventRoot === 'string'
	                ? document.getElementById(cfg.eventRoot)
	                : typeof cfg.eventRoot === 'undefined'
	                    ? document
	                    : cfg.eventRoot;
	            this.domRoot = typeof cfg.domRoot === 'string'
	                ? document.getElementById(cfg.domRoot)
	                : typeof cfg.domRoot === 'undefined'
	                    ? document.body
	                    : cfg.domRoot;
	            var events = standardEvents.concat(typeof cfg.extraEvents !== 'undefined'
	                ? cfg.extraEvents
	                : []);
	            this.events = makeEvents(events);
	            this.ports = makePorts(cfg.ports);
	            // create the signal graph
	            var actions = new base_2.Mailbox(null);
	            var state = actions.reduce(cfg.state, function (action, model) {
	                if (action === null) {
	                    return model;
	                }
	                return cfg.update(action, model);
	            });
	            this.scope = Object.seal({
	                events: this.events,
	                ports: this.ports,
	                actions: actions,
	                state: state
	            });
	            cfg.main(this.scope);
	            this.render = this.gui ? cfg.render : null;
	        }
	        /**
	         * Internal method which registers a given signal to emit upstream browser
	         * events.
	         */
	        App.prototype.registerEvent = function (evtName, sig) {
	            var fn = function (evt) { return sig.send(evt); };
	            this.eventRoot.addEventListener(evtName, fn, true);
	        };
	        /**
	         * Provides access to the application scope for any other configuration.
	         *
	         * @param f - A function which accepts a scope and returns nothing.
	         * @return @this
	         */
	        App.prototype.editScope = function (cb) {
	            cb(this.scope);
	            return this;
	        };
	        /**
	         * Set the root element in the page to which we will attach listeners.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setEventRoot = function (er) {
	            this.eventRoot = typeof er === 'string'
	                ? document.getElementById(er)
	                : er;
	            return this;
	        };
	        /**
	         * Set the root element in the page in which we will render.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setDomRoot = function (dr) {
	            this.domRoot = typeof dr === 'string'
	                ? document.getElementById(dr)
	                : dr;
	            return this;
	        };
	        /**
	         * This method actually registers the desired events and creates the ports.
	         * @return An object containing the App's port signals and a state update
	         * signal.
	         */
	        App.prototype.start = function () {
	            /* Find all the event listeners the user cared about and bind those */
	            for (var evtName in this.events) {
	                var sig = this.events[evtName];
	                if (sig.numListeners() > 0) {
	                    this.registerEvent(evtName, sig);
	                }
	            }
	            if (this.gui) {
	                var view = this.scope.state.map(this.render);
	                vdom_2.render(view, this.domRoot);
	            }
	            return {
	                ports: this.scope.ports,
	                state: this.scope.state
	            };
	        };
	        return App;
	    }());
	    exports.App = App;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/*
	[1]: The proper thing for it to wrap would be the type `Event`. However I also
	want to be able to make assumptions about the target because I'll be getting
	them exclusively from the browser. I do not know the proper TypeScript-fu yet
	for expressing this properly.

	[2]: I don't know the typescript way of saying "an object of string literal keys
	which point to arrays of names. any number of such keys, or none at all."
	*/


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.__esModule = true;
	    /**
	     * Permits something akin to traits and automatically derived functions. The
	     * type receiving the traits must implement stub properties with the correct
	     * names.
	     *
	     * @param derivedCtor - the constructor you want to add traits to.
	     * @param baseCtors - the parent constructors you wish to inherit traits from.
	     */
	    function derive(derivedCtor, baseCtors) {
	        baseCtors.forEach(function (baseCtor) {
	            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
	                derivedCtor.prototype[name] = baseCtor.prototype[name];
	            });
	        });
	    }
	    exports.derive = derive;
	    /**
	     * Using `derive` you can get an implementation of flatMap for free by
	     * implementing this class as an interface with a null return value for flatMap.
	     */
	    var FlatMap = (function () {
	        function FlatMap() {
	        }
	        FlatMap.pipe = function (ms) {
	            var v = ms[0];
	            for (var i = 1; i < ms.length; i++) {
	                v = v.flatMap(ms[i]);
	            }
	            return v;
	        };
	        FlatMap.prototype.flatMap = function (f) {
	            return this.map(f).flatten();
	        };
	        FlatMap.prototype.pipe = function (ms) {
	            var me = this;
	            for (var i = 0; i < ms.length; i++) {
	                me = me.flatMap(ms[i]);
	            }
	            return me;
	        };
	        return FlatMap;
	    }());
	    exports.FlatMap = FlatMap;
	    /** Utility function to perform some function asynchronously. */
	    function async(f) {
	        setTimeout(f, 0);
	    }
	    exports.async = async;
	    /**
	     * Signals route data through an application.
	    
	     * A signal is a unary function paired with an array of listeners. When a signal
	     * receives a value it computes a result using its function and then sends that
	     * to each of its listeners.
	     *
	     * @constructor
	     * @param fn - A unary function.
	     */
	    var Signal = (function () {
	        function Signal(fn) {
	            this.fn = fn;
	            this.listeners = [];
	        }
	        /** Attaches the argument as a listener and then returns the argument. */
	        Signal.prototype.connect = function (sig) {
	            this.listeners.push(sig);
	            return sig;
	        };
	        /** Convenience constructor. */
	        Signal.make = function () {
	            return new Signal(function (x) { return x; });
	        };
	        /**
	         * Gives the argument to the signal's internal function and then sends the
	         * result to all its listeners.
	         *
	         * @param x - The value to send.
	         * @return Nothing
	         */
	        Signal.prototype.send = function (x) {
	            var v = this.fn(x);
	            if (typeof v !== 'undefined') {
	                for (var i = 0; i < this.listeners.length; i++) {
	                    var r = this.listeners[i];
	                    r.send(v);
	                }
	            }
	        };
	        Signal.prototype.recv = function (f) {
	            this.connect(new Signal(function (v) { return f(v); }));
	        };
	        /**
	         * Creates a new signal with the specified function, attaches it to this
	         * signal, and returns the newly created signal.
	         *
	         * @param f - A unary function with which to create a new signal.
	         * @return a new signal attached to this one.
	         */
	        Signal.prototype.map = function (f) {
	            var sig = new Signal(f);
	            return this.connect(sig);
	        };
	        /**
	         * Creates a new signal which will only propagate a value if a condition
	         * is met. The new signal will be attached as a listener to this one.
	         *
	         * @param cond - A unary function returning a boolean.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.filter = function (cond) {
	            var r = new Signal(function (v) {
	                if (cond(v)) {
	                    return v;
	                }
	            });
	            return this.connect(r);
	        };
	        /**
	         * Creates a new signal which reduces incoming values using a supplied
	         * function and an initial value. The new signal will be attached as a
	         * listener to this one.
	         *
	         * @param initial - An initial value for the reduction.
	         * @param reducer - A function accepting new signal values and the old
	         *                  reduced value.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.reduce = function (initial, reducer) {
	            var state = initial;
	            var r = new Signal(function (v) {
	                state = reducer(v, state);
	                return state;
	            });
	            return this.connect(r);
	        };
	        Signal.prototype.numListeners = function () {
	            return this.listeners.length;
	        };
	        return Signal;
	    }());
	    exports.Signal = Signal;
	    /**
	     * A signal to which you may send and receive values. Messages are sent
	     * asynchronously. You must supply an initial value to send.
	     *
	     * This makes Mailboxes useful for kicking off any initial actions that must
	     * be taken. Internally a Mailbox is used for initial state reduction by App.
	     */
	    var Mailbox = (function (_super) {
	        __extends(Mailbox, _super);
	        function Mailbox(t) {
	            var _this = _super.call(this, function (x) { return x; }) || this;
	            _this.send(t);
	            return _this;
	        }
	        Mailbox.prototype.send = function (t) {
	            var _this = this;
	            async(function () {
	                _super.prototype.send.call(_this, t);
	            });
	        };
	        Mailbox.prototype.recv = function (k) {
	            _super.prototype.recv.call(this, k);
	        };
	        return Mailbox;
	    }(Signal));
	    exports.Mailbox = Mailbox;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.__esModule = true;
	    /** Helper function for creating VTrees exported to the top level. */
	    function el(tag, attrs, children) {
	        var children_trees = (typeof children === 'undefined')
	            ? []
	            : children.map(function (kid, idx) {
	                return typeof kid === 'string'
	                    ? new VTree(kid, [], VTreeType.Text)
	                    : kid;
	            });
	        return new VTree({
	            tag: tag,
	            attrs: attrs
	        }, children_trees, VTreeType.Node);
	    }
	    exports.el = el;
	    var VTreeType;
	    (function (VTreeType) {
	        VTreeType[VTreeType["Text"] = 0] = "Text";
	        VTreeType[VTreeType["Node"] = 1] = "Node";
	    })(VTreeType || (VTreeType = {}));
	    ;
	    /**
	     * A rose tree representing DOM elements. Can represent either an element node
	     * or a text node.
	     *
	     * Because VTree is lighter weight than actual DOM elements an efficient diff
	     * procedure can be used to compare old and new trees and determine what needs
	     * to be done to the actual DOM.
	     *
	     * The {@link VTree#key} property is used to determine equality. If a `key`
	     * attribute is provided, it will be used. If there is not one, then `id` will
	     * be used. Failing that the tag name will be used. If this is a text node, the
	     * text itself will be used. I'm open to other possibilities, especially
	     * regarding that last one.
	     */
	    var VTree = (function () {
	        function VTree(content, children, treeType) {
	            this.content = content;
	            this.children = children;
	            this.treeType = treeType;
	            this.mailbox = null;
	            /* There must be a key */
	            if (treeType === VTreeType.Node) {
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
	        /**
	         * Whenever this VTree is re-rendered the DOM node will be sent to this
	         * Mailbox. This is useful in case an important element is recreated and you
	         * need an up to date reference to it.
	         */
	        VTree.prototype.subscribe = function (mailbox) {
	            this.mailbox = mailbox;
	            return this;
	        };
	        /** Equality based on the key. */
	        VTree.prototype.eq = function (other) {
	            if (!other) {
	                return false;
	            }
	            return (this.key === other.key);
	        };
	        return VTree;
	    }());
	    exports.VTree = VTree;
	    /** Constructs an actual DOM node from a {@link VTree}. */
	    function makeDOMNode(tree) {
	        if (tree === null) {
	            return null;
	        }
	        if (tree.treeType === VTreeType.Text) {
	            return document.createTextNode(tree.content);
	        }
	        var el = document.createElement(tree.content.tag);
	        for (var key in tree.content.attrs) {
	            el.setAttribute(key, tree.content.attrs[key]);
	        }
	        for (var i = 0; i < tree.children.length; i++) {
	            var child = makeDOMNode(tree.children[i]);
	            el.appendChild(child);
	        }
	        // if a mailbox was subscribed, notify it the element was re-rendered
	        if (tree.mailbox !== null) {
	            tree.mailbox.send(el);
	        }
	        return el;
	    }
	    /** Constructs an initial DOM from a {@link VTree}. */
	    function initialDOM(domRoot, tree) {
	        var root = domRoot;
	        var domTree = makeDOMNode(tree);
	        while (root.firstChild) {
	            root.removeChild(root.firstChild);
	        }
	        root.appendChild(domTree);
	    }
	    /**
	     * A simple enum representing three kinds of array edit operations.
	     */
	    var Op;
	    (function (Op) {
	        Op[Op["Merge"] = 0] = "Merge";
	        Op[Op["Delete"] = 1] = "Delete";
	        Op[Op["Insert"] = 2] = "Insert";
	    })(Op || (Op = {}));
	    ;
	    /**
	     * Computes an array of edit operations allowing the first argument to be
	     * transformed into the second argument.
	     *
	     * @param a - The original array
	     * @param b - The the desired array
	     * @param eq - An equality testing function for elements in the arrays.
	     * @return An array of {@link Op} values.
	     */
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
	    /**
	     * The name is a little misleading. This takes an old and a current
	     * {@link VTree}, the parent node of the one the old tree represents,
	     * and an (optional) index into that parent's childNodes array.
	     *
	     * If either of the trees is null or undefined this triggers DOM node creation
	     * or destruction.
	     *
	     * If both are nodes then attributes are reconciled followed by children.
	     *
	     * Otherwise the new tree simply overwrites the old one.
	     *
	     * While this does not perform a perfect tree diff it doesn't need to and
	     * performance is (probably) the better for it. In typical cases a DOM node will
	     * add or remove a few children at once, and the grandchildren will not need to
	     * be recovered from their parents. Meaning starting from the root node we can
	     * treat this as a list diff problem for the children and then, once children
	     * are paired up, we can recurse on them.
	     */
	    function diff_dom(parent, a, b, index) {
	        if (index === void 0) { index = 0; }
	        if (typeof b === 'undefined' || b === null) {
	            parent.removeChild(parent.childNodes[index]);
	            return;
	        }
	        if (typeof a === 'undefined' || a === null) {
	            parent.insertBefore(makeDOMNode(b), parent.childNodes[index]);
	            return;
	        }
	        if (b.treeType === VTreeType.Node) {
	            if (a.treeType === VTreeType.Node) {
	                if (a.content.tag === b.content.tag) {
	                    // contend with attributes. only necessary changes.
	                    var dom = parent.childNodes[index];
	                    for (var attr in a.content.attrs) {
	                        if (!(attr in b.content.attrs)) {
	                            dom.removeAttribute(attr);
	                            delete dom[attr];
	                        }
	                    }
	                    for (var attr in b.content.attrs) {
	                        var v = b.content.attrs[attr];
	                        if (!(attr in a.content.attrs) ||
	                            v !== a.content.attrs[attr]) {
	                            dom[attr] = v;
	                            dom.setAttribute(attr, v);
	                        }
	                    }
	                    // contend with the children.
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
	            // different types of nodes, `b` is a text node, or they have different
	            // tags. in all cases just replace the DOM element.
	            parent.replaceChild(makeDOMNode(b), parent.childNodes[index]);
	        }
	    }
	    exports.diff_dom = diff_dom;
	    /**
	     * This reduces a Signal producing VTrees.
	     *
	     * @param view_signal - the Signal of VTrees coming from the App.
	     * @param domRoot - The root element we will be rendering the VTree in.
	     */
	    function render(view_signal, domRoot) {
	        view_signal.reduce(null, function (update, tree) {
	            if (tree === null) {
	                initialDOM(domRoot, update);
	            }
	            else {
	                diff_dom(domRoot, tree, update);
	            }
	            return update;
	        });
	    }
	    exports.render = render;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.__esModule = true;
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
	    // not sure which of these two I'll actually want
	    function random_word() {
	        return exports.source_words[Math.floor(Math.random() * exports.source_words.length)];
	    }
	    exports.random_word = random_word;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);