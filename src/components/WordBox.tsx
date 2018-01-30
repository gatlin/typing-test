import * as Alm from 'alm';

function currentWord({ line_idx, word_idx, current_word, current_line }) {
    const line_check = current_line === 0
          ? line_idx === 0
          : line_idx === 1;
    return line_check && (word_idx === current_word);
}

const Word = props => {
    const { expected, actual, incorrect } = props.word;
    let outerClassName = 'word';
    let innerClassName = '';
    let bolded = '';
    let unbolded = '';
    if (incorrect) {
        outerClassName += ' incorrect';
    }
    if (currentWord(props)) {
        innerClassName = 'bolded';
        outerClassName += ' current-word';
        const len = actual.length;
        bolded = expected.slice(0, len);
        unbolded = expected.slice(len);
    } else {
        unbolded = expected;
    }
    return (
        <span
          id={'word-'+expected}
          className={outerClassName}
          >
          <span className={innerClassName}>{ bolded }</span>
          <span>{ unbolded }</span>
        </span>
    );
};

const Line = ({
    lines,
    current_word,
    current_line,
    words,
    line_idx,
    typed_so_far
}) => (
    <div
      className='line'
      key={line_idx}
      >
      { words.map((word, word_idx) => Word({
          word,
          line_idx,
          word_idx,
          current_word,
          current_line,
          typed_so_far
      })) }
    </div>
);

const WordBox = ({ lines, current_word, current_line, typed_so_far }) => {
    const line_start = current_line === 0
          ? 0
          : current_line - 1;
    const line_end = line_start + 3;
    return (
        <div id='words-box'>
          { lines
              .slice(line_start, line_end)
              .map((words, line_idx) =>
                   Line({
                       lines,
                       current_word,
                       current_line,
                       words,
                       line_idx,
                       typed_so_far
                   }))
          }
        </div>
    );
};

export default WordBox;
