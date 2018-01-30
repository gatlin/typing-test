import { connect } from 'alm';
import * as actions from '../actions';
import WordBox from '../components/WordBox';

const WordBoxView = connect(
    ({
        lines,
        current_word,
        current_line,
        typed_so_far
    }) => ({
            lines,
            current_word,
            current_line,
            typed_so_far
        }),
    dispatch => ({
    })
)(WordBox);

export default WordBoxView;
