import * as Alm from 'alm';

const BelowBoxInitial = props => (
    <div id='below-box'>
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
          Just start typing to begin!
        </p>
      </div>
    </div>
);

const BelowBoxFinished = props => (
    <div id='below-box' className='fade-in'>
      <h2 id='score'>
        You typed { props.cpm.toString() } characters per minute!
      </h2>
      { props.num_words_incorrect > 0
          ? (<p>The number would have been higher but you got {
              props.num_words_incorrect.toString() } words wrong.</p>)
        : null}
      <p>
        Refresh to try again. Maybe take a two minute break.
      </p>
    </div>
);

const BelowBox = props => {
    switch (props.finished) {
    case true:
        return BelowBoxFinished(props);
    default:
        return BelowBoxInitial(props);
    }
};

export default BelowBox;
