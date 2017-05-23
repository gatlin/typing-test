import { el, App, Mailbox } from './alm/alm';
import * as words from './words';

// space bar keycode: 32
// backspace: 8

const words_box_mbox = new Mailbox(null);

type WordResult = {
    expected: string;
    actual: string;
    correct_chars: number;
}

type AppState = {
    initialized: boolean;
    typed_so_far: string;
    upcoming_words: Array<string>;
    current_word: number; // index into the upcoming words (current line)
    words_box_width: number; // width of the words box (computed)
    char_width: number; // width of a character (computed)
};

enum Actions {
    Init,
    UpdateInput,
    KeyDown
};

type Action = {
    'type': string;
    data?: any;
}

function generate_line(box_width, char_width) {
    console.log('box width', box_width);
    const uw = [];
    let current_width = 0;
    let done: boolean = false;
    while (!done) {
        let word = words.random_word();
        current_width += word.length * char_width + char_width;
        if (current_width >= box_width) {
            done = true;
            break;
        } else {
            uw.push(word);
        }
    }
    return uw;
}

function empty_model(): AppState {

    return {
        initialized: false,
        typed_so_far: '',
        upcoming_words: [],
        current_word: 0,
        words_box_width: 0,
        char_width: 0
    };
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    // once the words box is rendered we can calculate the geometry for the
    // scroll box
    dispatch[Actions.Init] = () => {
        console.log('CALLING INIT');
        if (!model.initialized) {
            model.words_box_width = action.data.offsetWidth;
            model.char_width = document.getElementById('current-word').offsetWidth /
                3;
            console.log('[update] box width', model.words_box_width);
            console.log('[update] char width', model.char_width);
            model.upcoming_words = generate_line(model.words_box_width,
                model.char_width);
            model.initialized = true;
        }
        return model;
    };

    dispatch[Actions.UpdateInput] = () => {
        model.typed_so_far = action.data;
        // did they hit the space bar?
        const split_input = model.typed_so_far.split(' ');
        let space_pressed: boolean = split_input.length === 2;

        if (space_pressed) {
            // generate a new word, push the old word into the history

            model.current_word++;
            console.log('current word =', model.current_word);

            if (model.current_word >= model.upcoming_words.length) {
                model.upcoming_words = generate_line(
                    model.words_box_width,
                    model.char_width
                );
                model.current_word = 0;
                console.log('new line', model.upcoming_words);
            }
            model.typed_so_far = '';
        }
        return model;
    };

    dispatch[Actions.KeyDown] = () => {
        return model;
    };

    return dispatch[action.type]();
}

function render_line(line, current_word = null) {

    const upcoming_words_spans: Array<any> = line.map(
        (uw, idx) => {
            let attrs = { 'class': 'word', 'key': 'word-' + uw };
            if (idx !== null && idx === current_word) {
                attrs['id'] = 'current-word';
            }
            return el('span', attrs, [uw]);
        });

    return upcoming_words_spans;
}

function render_model(model) {
    let words_line = [];

    if (model.initialized) {
        words_line = render_line(model.upcoming_words, model.current_word);

    } else {
        words_line.push('foo');
    }
    return el('div', { 'id': 'typing-app' }, [
        el('div', { 'id': 'words-box' }, [
            el('span', { 'id': 'current-word' }, words_line)
        ]).subscribe(words_box_mbox),
        el('div', { 'id': 'input-wrapper' }, [
            el('input', {
                'type': 'text',
                'id': 'typing-input',
                'key': 'typing-input',
                'value': model.typed_so_far
            }, [])
        ])
    ]);
}

function main(scope) {
    scope.events.input
        .filter(evt => evt.getId() === 'typing-input')
        .map(evt => ({
            type: Actions.UpdateInput,
            data: evt.getValue()
        }))
        .connect(scope.actions);

    scope.events.keydown
        .filter(evt => evt.getId() === 'typing-input')
        .map(evt => ({
            type: Actions.KeyDown,
            data: evt.getRaw().keyCode
        }))
        .connect(scope.actions);

    words_box_mbox
        .filter(elem => elem !== null)
        .map(elem => ({
            type: Actions.Init,
            data: elem
        }))
        .connect(scope.actions);
}

const app = new App({
    domRoot: 'main',
    eventRoot: 'main',
    state: empty_model(),
    update: update_model,
    render: render_model,
    main: main
}).start();
