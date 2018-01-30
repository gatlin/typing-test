import { connect } from 'alm';
import * as actions from '../actions';
import MainComponent from '../components/MainComponent';

const MainView = connect(
    state => state,
    dispatch => ({
        initialize: d => dispatch(actions.initialize(d))
    })
)(MainComponent);

export default MainView;
