import { el, App, Mailbox } from './alm/alm';
import { random_word } from './words';

// space bar keycode: 32
// backspace: 8

const words_box_mbox = new Mailbox(null);
const timer_mbox = new Mailbox(false);

type Word = {
    expected: string;
    actual: string;
    incorrect: boolean;
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
    active: boolean;
    finished: boolean;
    cpm: number;
    num_words_incorrect: number;
};

enum Actions {
    Init,
    UpdateInput,
    KeyDown,
    Stop
};

type Action = {
    'type': Actions;
    data?: any;
};

function generate_line(box_width, char_width) {
    const uw = [];
    let current_width = 0;
    let done: boolean = false;
    while (!done) {
        let word = random_word();
        current_width += word.length * char_width + char_width;
        if (current_width >= box_width) {
            done = true;
            break;
        } else {
            uw.push({
                expected: word,
                actual: '',
                incorrect: false
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
        words_typed: 0,
        active: false,
        finished: false,
        cpm: 0,
        num_words_incorrect: 0
    };
}

// for readability later
function flatten_array<T>(ary: Array<Array<T>>): Array<T> {
    return ary.reduce((a, b) => a.concat(b), []);
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    // once the words box is rendered we can calculate the geometry for the
    // scroll box
    dispatch[Actions.Init] = () => {
        if (!model.initialized) {
            model.words_box_width = action.data.offsetWidth;
            model.char_width =
                document.getElementById('current-word').offsetWidth / 3;
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
        if (!model.active && !model.finished) {
            model.active = true;
            timer_mbox.send(true);
        }

        model.typed_so_far = action.data;
        // did they hit the space bar?
        const split_input = model.typed_so_far.split(' ');
        let space_pressed: boolean = split_input.length === 2;

        if (space_pressed) {
            // generate a new word, push the old word into the history
            const current_word =
                model.lines[model.current_line][model.current_word];
            current_word.actual = model.typed_so_far.replace(/\s+$/, '');

            if (current_word.expected !== current_word.actual) {
                model.num_words_incorrect++;
                current_word.incorrect = true;
            }
            else {
                current_word.incorrect = false;
            }

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

    dispatch[Actions.Stop] = () => {
        if (model.active) {
            model.active = false;
            model.finished = true;

            // calculate a score
            const words: Array<Word> = flatten_array(model.lines)
                .slice(0, model.words_typed)
                .filter(word => !word.incorrect);

            model.cpm = 0; // double tap
            for (let i = 0; i < words.length; i++) {
                model.cpm += words[i].expected.length;
            }

            model.cpm += words.length; // spaces
        }
        return model;
    };

    return dispatch[action.type]();
}

// logic for taking an array of `Word`s and rendering as a single line
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
            if (uw.incorrect) {
                attrs['class'] = attrs['class'] + ' incorrect';
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
        // put a single line and a single character for the purposes of
        // calculating the width of the lines and the characters
        words_line.push(el('span', {
            'class': 'word',
            'id': 'current-word'
        }, ['foo']));
    }

    let below_box;

    if (!model.finished) {
        below_box = el('div', { 'id': 'below-box' }, [
            el('input', {
                'type': 'text',
                'id': 'typing-input',
                'key': 'typing-input',
                'autofocus': 'autofocus',
                'value': model.typed_so_far
            }, []),
            el('div', {
                'id': 'some-text',
                'class': model.active ? 'begun' : ''
            }, [
                    el('p', {}, ['Just start typing to begin.'])
                ])
        ])

    } else {
        const text = [el('p', {}, [
            'Refresh to try again, maybe after a two minute break.'])];

        if (model.num_words_incorrect > 0) {
            text.unshift(el('p', {}, ['It would have been higher, but you got ' +
                model.num_words_incorrect + ' words incorrect.']));
        }

        below_box = el('div', { 'id': 'below-box', 'class': 'fade-in' }, [
            el('h2', { 'id': 'score' }, [
                'You typed ' + model.cpm + ' characters per minute!'
            ]),
            el('span', {}, text)
        ]);
    }

    return el('div', { 'id': 'typing-app' }, [
        el('div', { 'id': 'words-box-outer' }, [
            el('div', { 'id': 'words-box' }, words_line)
                .subscribe(words_box_mbox)]),
        below_box
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

    timer_mbox
        .filter(msg => msg === true)
        .recv(_ => {
            window.setTimeout(() => {
                scope.actions.send({ type: Actions.Stop });
            }, 60000);
        });
}

const app = new App({
    domRoot: 'main',
    eventRoot: 'main',
    state: empty_model(),
    update: update_model,
    render: render_model,
    main: main
}).start();
