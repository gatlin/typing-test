import { connect } from 'alm';
import * as actions from '../actions';
import WordBox from '../components/WordBox';

const WordBoxView = connect(
    state => state,
    dispatch => ({
    })
)(WordBox);

export default WordBoxView;
