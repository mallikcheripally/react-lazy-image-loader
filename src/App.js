// @flow
import React, { Component } from 'react';

import './App.scss';
import LazyImages from './containers/LazyImages/LazyImages';

type Props = {};

type State = {};

class App extends Component<Props, State> {
  render() {
    return (
      <div className="App">
        <LazyImages />
      </div>
    );
  }
}

export default App;
