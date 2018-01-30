import * as Alm from 'alm';

/**
 * The component to render before the test has begun.
 */
const BelowBoxInitial = props => (
    <div>
      <input
        type='text'
        id='typing-input'
        key={null}
        autoFocus
        on={{
            keypress: evt => {
                const { keyCode, charCode } = evt.getRaw();

                if (8 === keyCode) {
                    props.goBack();
                }
                else if (0 === keyCode && 32 === charCode) {
                    props.nextWord();
                }
                else if (0 !== charCode) {
                    props.keyPress({
                        charCode
                    });
                }
            }
        }}
        value={props.typed_so_far}
        />
        <div
          key='huh'
          id='some-text'
          className={ props.active ? 'begun' : '' }>
        <p>
          Just start typing to begin! You have 1 minute.
        </p>
      </div>
    </div>
);

/**
 * The component to render when the test is finished.
 */
const BelowBoxFinished = props => (
    <div className='fade-in'>
      <h2 id='score'>
        You typed { props.cpm.toString() } characters per minute!
      </h2>
      { props.num_words_incorrect > 0
          ? (<p>The number would have been higher but you got {
              props.num_words_incorrect.toString() } words wrong.</p>)
        : null}
        <p>
        Refresh to try again. Maybe take a 2 minute break.
        </p>

    </div>
);

/**
 * The component below the word box.
 */
const BelowBox = props => {
    const belowBox = props.finished
          ? BelowBoxFinished(props)
          : BelowBoxInitial(props);
    return (
        <div id='below-box'>
          { belowBox }
          <p> Made by <a href="http://niltag.net">Gatlin</a> (
            <a href="https://github.com/gatlin/typing-test">
              source code
            </a>).
          </p>
        </div>
    );
};

export default BelowBox;
