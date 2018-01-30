import * as Alm from 'alm';

import BelowBox from '../views/BelowBox';
import WordBox from '../views/WordBox';

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = props => (
    <section
      id="typing-app"
      className="app"
      >
      <div
        id='words-box-outer'
        ref={ e => {
            props.initialize(e.offsetWidth);
        }}
        >
        <WordBox lines={props.lines} />
      </div>
      <BelowBox />
    </section>
);

export default MainComponent;
