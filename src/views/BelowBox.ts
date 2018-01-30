import { connect } from 'alm';
import * as actions from '../actions';
import BelowBox from '../components/BelowBox';

const BelowBoxView = connect(
    state => state,
    dispatch => ({
        keyPress: d => dispatch(actions.keyPress(d)),
        goBack: () => dispatch(actions.goBack()),
        nextWord: () => dispatch(actions.nextWord())
    })
)(BelowBox);

export default BelowBoxView;
