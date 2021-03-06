import React from 'react';
import hljs from 'highlight.js';
import Modal from './modal';
import yml from '../snippets/yml';

const libraries = {
  'yml': yml,
};

// TODO: check for localStorage availability?
// are we ever going to run into a browser that supports flexbox but not localStorage?

const LOCAL_STORAGE_KEY = 'codegen_lib';

class CodeModal extends React.Component {
  constructor(props) {
    super(props);
    const keys = Object.keys(libraries);
    let initial = keys[Math.floor(Math.random() * keys.length)];

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      initial = stored;
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, initial);
    }

    this.state = { library: initial };
  }

  changeLibrary = (event) => {
    localStorage.setItem('codegen_lang', event.target.value);
    this.setState({ library: event.target.value });
  };

  render() {
    const { data, hasError, webhookMode, ...props } = this.props;
    let code = 'Errors encountered when validating/parsing your data.\nCheck those first before trying to generate code.';
    let language = 'accesslog';

    // if (webhookMode) {
    //   // TODO: add support for this in whatever libraries support it directly?
    //   // seems like very few of them do it
    //   code = 'Webhook mode not supported yet.';
    // } else
    if (!hasError) {
      language = libraries[this.state.library].language;
      code = libraries[this.state.library].generateFrom(data, webhookMode);
    }

    const theme = `atom-one-${this.props.darkTheme ? 'dark' : 'light'}`;
    const highlightedBlock = hljs.highlight(language, code, true);

    return (
      <Modal title='Generate code' {...props} maxWidth='90ch'>
        <div className='ma3'>

          <div className='mv2 flex flex-auto flex-column'>
            <select
              className='w-100 h2 mb2'
              value={this.state.library}
              onChange={this.changeLibrary}
            >
              {Object.keys(libraries).sort().map(k => {
                return <option value={k} key={k}>{libraries[k].name}</option>;
              })}
            </select>

            <pre className='ma0'>
              <code
                className={`${theme} hljs ${highlightedBlock.language}`}
                dangerouslySetInnerHTML={{ __html: highlightedBlock.value }}
              />
            </pre>
          </div>

        </div>
      </Modal>
    );
  }
}

function wrapper(props) {
  return <CodeModal {...props} />;
}


export default wrapper;
