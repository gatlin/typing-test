import { connect } from 'alm';
import * as actions from '../actions';
import BelowBox from '../components/BelowBox';

const BelowBoxView = connect(
    ({
        cpm,
        num_words_incorrect,
        finished,
        active,
        typed_so_far
    }) => ({
            cpm,
            num_words_incorrect,
            finished,
            active,
            typed_so_far
        }),
    dispatch => ({
        keyPress: d => dispatch(actions.keyPress(d)),
        goBack: () => dispatch(actions.goBack()),
        nextWord: () => dispatch(actions.nextWord())
    })
)(BelowBox);

export default BelowBoxView;
