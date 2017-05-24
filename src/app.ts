import { el, App, Mailbox } from './alm/alm';
import * as words from './words';

// space bar keycode: 32
// backspace: 8

const words_box_mbox = new Mailbox(null);

type Word = {
    expected: string;
    actual: string;
};

type AppState = {
    initialized: boolean;
    typed_so_far: string;
    lines: Array<Array<Word>>;
    current_word: number; // index into the upcoming words (current line)
    current_line: number;
    words_box_width: number; // width of the words box (computed)
    char_width: number; // width of a character (computed)
    words_typed: number;
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
            uw.push({
                expected: word,
                actual: ''
            });
        }
    }
    return uw;
}

function empty_model(): AppState {

    return {
        initialized: false,
        typed_so_far: '',
        lines: [],
        current_word: 0,
        current_line: 0,
        words_box_width: 0,
        char_width: 0,
        words_typed: 0
    };
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    // once the words box is rendered we can calculate the geometry for the
    // scroll box
    dispatch[Actions.Init] = () => {
        if (!model.initialized) {
            model.words_box_width = action.data.offsetWidth;
            model.char_width = document.getElementById('current-word').offsetWidth /
                3;
            for (let i = 0; i < 3; i++) {
                let line = generate_line(
                    model.words_box_width,
                    model.char_width
                );
                model.lines.push(line);
            }
            model.initialized = true;
        }
        return model;
    };

    // the user typed something
    dispatch[Actions.UpdateInput] = () => {
        model.typed_so_far = action.data;
        // did they hit the space bar?
        const split_input = model.typed_so_far.split(' ');
        let space_pressed: boolean = split_input.length === 2;

        if (space_pressed) {
            // generate a new word, push the old word into the history
            const current_word =
                model.lines[model.current_line][model.current_word];
            current_word.actual = model.typed_so_far.replace(/\s+$/, '');
            model.current_word++;

            if (model.current_word >= model.lines[model.current_line].length) {
                let next_line = generate_line(
                    model.words_box_width,
                    model.char_width
                );
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
    dispatch[Actions.KeyDown] = () => {
        let go_back_a_word =
            8 === action.data && // backspace
            '' === model.typed_so_far && // nothing typed yet
            model.words_typed > 0; // we have something to go back to
        if (go_back_a_word) {
            model.current_word--;
            model.words_typed--;

            // if we're trying to back up to a previous line
            if (model.current_word < 0 && model.current_line > 0) {
                model.current_line--;
                let line = model.lines[model.current_line];
                model.current_word = line.length - 1;
            }
            model.typed_so_far =
                model.lines[model.current_line][model.current_word].actual;
        }
        return model;
    };

    return dispatch[action.type]();
}

function render_line(line, current_word = null) {
    const line_spans: Array<any> = line.map(
        (uw, idx) => {
            let attrs = {
                'class': 'word',
                'id': 'word-' + uw.expected
            };
            if (idx !== null && idx === current_word) {
                attrs['class'] = attrs['class'] + ' current-word';
            }
            return el('span', attrs, [uw.expected]);
        });

    return line_spans;
}

function render_model(model) {
    let words_line = [];

    if (model.initialized) {
        let start_index = model.current_line === 0
            ? 0
            : model.current_line - 1;
        let end_index = model.current_line === 0
            ? 2
            : model.current_line + 1;

        for (let i = start_index; i <= end_index; i++) {
            let line = model.lines[i];
            let rendered_line = render_line(
                line,
                model.current_line === i
                    ? model.current_word
                    : null
            );
            words_line.push(el('div', {
                'class': 'line'
            }, rendered_line));
        }
    } else {
        words_line.push(el('span', {
            'class': 'word',
            'id': 'current-word'
        }, ['foo']));
    }
    return el('div', { 'id': 'typing-app' }, [
        el('div', { 'id': 'words-box' }, words_line).subscribe(words_box_mbox),
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
