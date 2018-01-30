import { connect } from 'alm';
import * as actions from '../actions';
import MainComponent from '../components/MainComponent';

const MainView = connect(
    ({ lines }) => ({ lines }),
    dispatch => ({
        initialize: d => dispatch(actions.initialize(d))
    })
)(MainComponent);

export default MainView;
