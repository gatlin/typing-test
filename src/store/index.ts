/**
 * @module store
 * The state types as well as the initial application state.
 */

export type Word = {
    expected: string;
    actual: string;
    incorrect: boolean;
};

export type State = {
    initialized: boolean;
    typed_so_far: string;
    lines: Array<Array<Word>>;
    current_word: number;
    current_line: number;
    words_box_width: number;
    char_width: number;
    words_typed: number;
    active: boolean;
    finished: boolean;
    cpm: number;
    num_words_incorrect: number;
}

export const initialState: State = {
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
