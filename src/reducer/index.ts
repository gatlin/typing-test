/**
 * @module reducer
 * The state reducer function.
 */
import { Reducer } from 'alm';
import { Actions } from '../actions';
import { source_words, random_word } from '../words';
import { Word, State } from '../store';

function flatten_array<T>(ary: Array<Array<T>>): Array<T> {
    return ary.reduce((a, b) => [...a, ...b], []);
}

function generate_line(box_width, char_width = 20) {
    const uw = [];
    let current_width = 0;
    let done = false;
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

const reducer: Reducer<State, Actions> = (state, action) => {
    let {
        initialized,
        typed_so_far,
        lines,
        current_word,
        current_line,
        words_box_width,
        char_width,
        words_typed,
        active,
        finished,
        cpm,
        num_words_incorrect
    } = state;
    switch (action.type) {
        case Actions.Init: {
            if (initialized) {
                return state;
            }
            words_box_width = action.data;
            // generate the first three lines
            lines = [];
            for (let i = 0; i < 3; i++) {
                let line = generate_line(
                    words_box_width
                );
                lines.push(line);
            }
            initialized = true;
            break;
        }

        case Actions.GoBack: {

            // case 1: we're trying to go back the previous word
            if ('' === typed_so_far &&
                words_typed > 0) {

                current_word--;
                words_typed--;

                // case 1.1: the previous word is on the previous line
                if (current_word < 0 && current_line > 0) {
                    current_line--;
                    let line = lines[current_line];
                    current_word = line.length - 1;
                }
                typed_so_far =
                    lines[current_line][current_word].actual;
            }
            // case 2: we're simply deleting a character
            else {
                typed_so_far = typed_so_far
                    .substring(0, typed_so_far.length - 1);
                const the_word = lines[current_line][current_word];
                the_word.actual = typed_so_far.replace(/\s+/g, '');
                lines[current_line][current_word] = the_word;
            }
            break;
        }

        case Actions.NextWord: {
            active = !finished;

            const the_word = lines[current_line][current_word];
            the_word.actual = typed_so_far.replace(/\s+/g, '');
            if (the_word.expected !== the_word.actual) {
                num_words_incorrect++;
                the_word.incorrect = true;
            }
            else {
                // we went back and fixed something
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

        case Actions.KeyPress: {
            const { charCode } = action.data;
            typed_so_far += String.fromCharCode(charCode);
            const the_word = lines[current_line][current_word];
            the_word.actual = typed_so_far.replace(/\s+/g, '');
            lines[current_line][current_word] = the_word;
            break;
        }

        case Actions.Stop: {
            finished = true;
            if (active) {
                active = false;
                const words = flatten_array(lines)
                    .slice(0, words_typed)
                    .filter((word: Word) => !word.incorrect);
                cpm = 0;
                for (let i = 0; i < words.length; i++) {
                    cpm += words[i].expected.length;
                }
                cpm += words.length;
            }
            break;
        }
        default:
            return { ...state };
    }
    return {
        ...state,
        initialized,
        typed_so_far,
        lines,
        current_word,
        current_line,
        words_box_width,
        char_width,
        words_typed,
        active,
        finished,
        cpm,
        num_words_incorrect
    };
};

export default reducer;
