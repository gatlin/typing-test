import * as Alm from 'alm';

import BelowBox from '../views/BelowBox';
import WordBox from '../views/WordBox';

const Footer = () => (
    <footer key='footer'>
    <p>
      Made by <a href="http://niltag.net">Gatlin</a> (
          <a href="https://github.com/gatlin/typing-test">
            source code
          </a>
      ).
        </p>
        </footer>
);

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = props => (
    <div
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
        <BelowBox />
      </div>
      <Footer/>
    </div>
);

export default MainComponent;
